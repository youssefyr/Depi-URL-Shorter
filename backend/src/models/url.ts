import { query } from '../db';

export interface UrlRecord {
  id: number;
  original_url: string;
  short_code: string;
  created_at: Date;
  clicks: number;
}

export const createUrl = async (originalUrl: string, shortCode: string): Promise<UrlRecord> => {
  const result = await query(
    'INSERT INTO urls (original_url, short_code) VALUES ($1, $2) RETURNING *',
    [originalUrl, shortCode]
  );
  return result.rows[0];
};

export const findByShortCode = async (shortCode: string): Promise<UrlRecord | null> => {
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

export const logClick = async (urlId: number, userAgent: string, referer: string): Promise<void> => {
  try {
    await query(
      'INSERT INTO clicks (url_id, user_agent, referer) VALUES ($1, $2, $3)',
      [urlId, userAgent || null, referer || null]
    );
  } catch (error) {
    console.error('Error logging click:', error);
    // Don't throw - we don't want to fail the redirect if logging fails
  }
};

export const getUrlCount = async (): Promise<number> => {
  const result = await query('SELECT COUNT(*) as count FROM urls');
  return parseInt(result.rows[0].count);
};

export const getTotalClicks = async (): Promise<number> => {
  const result = await query('SELECT SUM(clicks) as total FROM urls');
  return parseInt(result.rows[0].total) || 0;
};

export const getAllUrls = async (): Promise<UrlRecord[]> => {
  const result = await query(
    'SELECT * FROM urls ORDER BY created_at DESC'
  );
  return result.rows;
};

export const getClickStats = async (shortCode: string): Promise<any[]> => {
  const result = await query(
    `SELECT c.*, u.original_url 
     FROM clicks c 
     JOIN urls u ON c.url_id = u.id 
     WHERE u.short_code = $1 
     ORDER BY c.clicked_at DESC`,
    [shortCode]
  );
  return result.rows;
};