import { query } from '../db';

export interface Url {
  id: number;
  original_url: string;
  short_code: string;
  created_at: Date;
  clicks: number;
}

export const createUrl = async (originalUrl: string, shortCode: string): Promise<Url> => {
  const result = await query(
    'INSERT INTO urls (original_url, short_code) VALUES ($1, $2) RETURNING *',
    [originalUrl, shortCode]
  );
  return result.rows[0];
};

export const findByShortCode = async (shortCode: string): Promise<Url | null> => {
  const result = await query(
    'SELECT * FROM urls WHERE short_code = $1',
    [shortCode]
  );
  return result.rows[0] || null;
};

export const incrementClicks = async (shortCode: string): Promise<void> => {
  await query(
    'UPDATE urls SET clicks = clicks + 1 WHERE short_code = $1',
    [shortCode]
  );
};

export const getAllUrls = async (): Promise<Url[]> => {
  const result = await query('SELECT * FROM urls ORDER BY created_at DESC');
  return result.rows;
};

export const getUrlCount = async (): Promise<number> => {
  const result = await query('SELECT COUNT(*) as count FROM urls');
  return parseInt(result.rows[0].count);
};

export const getTotalClicks = async (): Promise<number> => {
  const result = await query('SELECT COALESCE(SUM(clicks), 0) as total FROM urls');
  return parseInt(result.rows[0].total);
};