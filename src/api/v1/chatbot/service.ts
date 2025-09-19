import { pool } from '../../../database/config/config';
import { getEmbedding, generateAnswer } from './ollamaService';

export async function processFile(file: Express.Multer.File): Promise<void> {
  const text = file.buffer.toString('utf-8');
  const embedding = await getEmbedding(text);

  await pool.query(
    'INSERT INTO documents (content, embedding) VALUES ($1, $2)',
    [text, embedding],
  );
}

export async function queryDocuments(question: string): Promise<string> {
  const embedding = await getEmbedding(question);

  const { rows } = await pool.query(
    `SELECT content, 1 - (embedding <=> $1::vector) AS similarity
     FROM documents
     ORDER BY similarity DESC
     LIMIT 1`,
    [embedding],
  );

  const context = rows[0]?.content ?? '';

  return await generateAnswer(context, question);
}

export async function getAllDocuments(): Promise<{ id: number; content: string }[]> {
  const { rows } = await pool.query('SELECT id, content FROM documents');
  return rows;
}

export async function updateDocument(id: number, content: string): Promise<void> {
  const embedding = await getEmbedding(content);

  await pool.query(
    'UPDATE documents SET content = $1, embedding = $2 WHERE id = $3',
    [content, embedding, id],
  );
}

export async function deleteDocument(id: number): Promise<void> {
  await pool.query('DELETE FROM documents WHERE id = $1', [id]);
}
