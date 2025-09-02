import { Database } from '../../../database';
import { getEmbedding, generateAnswer } from './ollamaService';
import { QueryTypes } from 'sequelize';

// Format embedding for Postgres vector
function formatEmbeddingForSQL(embedding: number[]): string {
  return `[${embedding.join(',')}]`;
}

export async function processFile(file: Express.Multer.File): Promise<void> {
  const text = file.buffer.toString('utf-8');
  const embedding = await getEmbedding(text);
  const formattedEmbedding = formatEmbeddingForSQL(embedding);

  await Database.database.query(
    'INSERT INTO documents (content, embedding) VALUES ($1, $2::vector)',
    {
      bind: [text, formattedEmbedding],
      type: QueryTypes.INSERT,
    },
  );
}

export async function queryDocuments(question: string): Promise<string> {
  const embedding = await getEmbedding(question);
  const formattedEmbedding = formatEmbeddingForSQL(embedding);

  const rows = await Database.database.query<{ content: string; similarity: number }>(
    `SELECT content, 1 - (embedding <=> $1::vector) AS similarity
     FROM documents
     ORDER BY similarity DESC
     LIMIT 1`,
    {
      bind: [formattedEmbedding],
      type: QueryTypes.SELECT,
    },
  );

  const context = rows[0]?.content ?? '';

  return await generateAnswer(context, question);
}

export async function getAllDocuments(): Promise<{ id: number; content: string }[]> {
  const rows = await Database.database.query<{ id: number; content: string }>(
    'SELECT id, content FROM documents',
    {
      type: QueryTypes.SELECT,
    },
  );

  return rows;
}

export async function updateDocument(id: number, content: string): Promise<void> {
  const embedding = await getEmbedding(content);
  const formattedEmbedding = formatEmbeddingForSQL(embedding);

  await Database.database.query(
    'UPDATE documents SET content = $1, embedding = $2::vector WHERE id = $3',
    {
      bind: [content, formattedEmbedding, id],
      type: QueryTypes.UPDATE,
    },
  );
}

export async function deleteDocument(id: number): Promise<void> {
  await Database.database.query('DELETE FROM documents WHERE id = $1', {
    bind: [id],
    type: QueryTypes.DELETE,
  });
}
