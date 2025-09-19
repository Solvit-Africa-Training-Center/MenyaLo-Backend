import { Request, Response } from 'express';
import fs from 'fs';
import pdf from 'pdf-parse';
import { Database } from '../../../database';
import { getEmbedding, generateAnswer } from './ollamaService';
import { chunkText } from '../../../utils/chunker';
import { infoLogger, errorLogger } from '../../../utils/logger';
import { QueryTypes } from 'sequelize';

interface Document {
  id: number;
  filename: string;
  content: string;
  embedding: number[];
  created_at: Date;
}

// Format embedding for Postgres vector
function formatEmbeddingForSQL(embedding: number[]): string {
  return `[${embedding.join(',')}]`;
}

// Fallback web search
async function searchWeb(query: string): Promise<string> {
  return `This is a web answer for: ${query}`;
}

// Helper to log and send errors
function logAndSendError(res: Response, err: unknown, context?: string): void {
  const error = err instanceof Error ? err : new Error(String(err));
  errorLogger(error, context);
  res.status(500).json({ error: error.message });
}

// Upload PDF and store chunks
export async function uploadDocument(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const pdfBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdf(pdfBuffer);
    const cleanText = pdfData.text.replace(/\s+/g, ' ').trim();
    const chunks = chunkText(cleanText, 1000, 100);

    const inserted: Document[] = [];

    for (const chunk of chunks) {
      const embedding = await getEmbedding(chunk);
      const formatted = formatEmbeddingForSQL(embedding);

      const result = await Database.database.query<Document>(
        'INSERT INTO documents (filename, content, embedding) VALUES ($1, $2, $3::vector) RETURNING *',
        {
          bind: [req.file.originalname, chunk, formatted],
          type: QueryTypes.SELECT,
        },
      );

      if (result && result.length > 0) {
        inserted.push(result[0]);
      }
    }

    res.status(201).json({ message: 'Uploaded successfully', chunks: inserted });
    infoLogger(
      `Uploaded ${inserted.length} chunks from file ${req.file.originalname}`,
      'uploadDocument',
    );
  } catch (err: unknown) {
    logAndSendError(res, err, 'uploadDocument');
  }
}

// Query documents and generate answer
export async function queryDocument(req: Request, res: Response): Promise<void> {
  try {
    const { question } = req.body;
    if (!question) {
      res.status(400).json({ error: 'Question required' });
      return;
    }

    const qEmbedding = await getEmbedding(question);
    const formatted = formatEmbeddingForSQL(qEmbedding);

    // Query documents based on embedding distance
    const result = await Database.database.query<Document & { distance: number }>(
      `
      SELECT id, content, embedding <#> $1::vector AS distance
      FROM documents
      ORDER BY distance
      LIMIT 3`,
      {
        bind: [formatted],
        type: QueryTypes.SELECT,
      },
    );

    let context = result.map((r: Document & { distance: number }) => r.content).join('\n---\n');
    let source: 'database' | 'web' = 'database';

    // If no result found, use web search as fallback
    if (!result || result.length === 0) {
      context = await searchWeb(question);
      source = 'web';
    }

    // Generate answer using the context
    const answer = await generateAnswer(context, question);

    // Log query history into history table
    await Database.database.query(
      `
      INSERT INTO history (question, answer, source) 
      VALUES ($1, $2, $3)
    `,
      {
        bind: [question, answer, source],
        type: QueryTypes.INSERT,
      },
    );

    // Send the response back to the client
    res.json({
      answer:
        source === 'web'
          ? `Not in database, but here’s an answer from the web:\n\n${answer}`
          : answer,
      documents: result,
      source,
    });

    // Log successful query
    infoLogger(`Answered question: "${question}" (source: ${source})`, 'queryDocument');
  } catch (err: unknown) {
    logAndSendError(res, err, 'queryDocument');
  }
}

// Get query history
export async function getQueryHistory(req: Request, res: Response): Promise<void> {
  try {
    const result = await Database.database.query('SELECT * FROM history ORDER BY created_at DESC');
    res.json(result);
    infoLogger('Fetched query history', 'getQueryHistory');
  } catch (err: unknown) {
    logAndSendError(res, err, 'getQueryHistory');
  }
}

// Get all documents
export async function getDocuments(req: Request, res: Response): Promise<void> {
  try {
    const result = await Database.database.query<Document>(
      'SELECT * FROM documents ORDER BY created_at DESC',
      {
        type: QueryTypes.SELECT,
      },
    );
    res.json(result);
    infoLogger('Fetched all documents', 'getDocuments');
  } catch (err: unknown) {
    logAndSendError(res, err, 'getDocuments');
  }
}

// Update document by ID
export async function updateDocumentById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const embedding = await getEmbedding(content);
    const formatted = formatEmbeddingForSQL(embedding);

    const result = await Database.database.query<Document>(
      'UPDATE documents SET content=$1, embedding=$2::vector WHERE id=$3 RETURNING *',
      {
        bind: [content, formatted, id],
        type: QueryTypes.SELECT,
      },
    );

    if (!result || result.length === 0) {
      res.status(404).json({ error: 'Document not found' });
      infoLogger(`Update failed: Document ${id} not found`, 'updateDocumentById');
      return;
    }

    res.json(result[0]);
    infoLogger(`Updated document ${id}`, 'updateDocumentById');
  } catch (err: unknown) {
    logAndSendError(res, err, 'updateDocumentById');
  }
}

// Delete document by ID
export async function deleteDocumentById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const result = await Database.database.query('DELETE FROM documents WHERE id=$1 RETURNING *', {
      bind: [id],
      type: QueryTypes.SELECT,
    });

    if (!result || result.length === 0) {
      res.status(404).json({ error: 'Document not found' });
      infoLogger(`Delete failed: Document ${id} not found`, 'deleteDocumentById');
      return;
    }

    res.json({ message: 'Deleted successfully' });
    infoLogger(`Deleted document ${id}`, 'deleteDocumentById');
  } catch (err: unknown) {
    logAndSendError(res, err, 'deleteDocumentById');
  }
}
