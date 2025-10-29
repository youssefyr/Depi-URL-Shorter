import { Request, Response } from 'express';
import { createUrl, findByShortCode, incrementClicks, logClick, getClickStats } from '../models/url';
import { generateShortCode } from '../services/shortener';
import { isValidUrl } from '../utils/validators';
import { metricsService } from '../services/metrics';

export const shortenUrl = async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  
  try {
    const { url } = req.body;

    if (!url || !isValidUrl(url)) {
      res.status(400).json({ error: 'Invalid URL provided' });
      return;
    }

    const shortCode = generateShortCode();
    const urlRecord = await createUrl(url, shortCode);

    metricsService.incrementUrlsShortened();
    metricsService.recordLatency(Date.now() - startTime);

    res.status(201).json({
      originalUrl: urlRecord.original_url,
      shortCode: urlRecord.short_code,
      shortUrl: `${req.protocol}://${req.get('host')}/${urlRecord.short_code}`,
      createdAt: urlRecord.created_at
    });
  } catch (error) {
    console.error('Error shortening URL:', error);
    metricsService.recordLatency(Date.now() - startTime);
    res.status(500).json({ error: 'Failed to shorten URL' });
  }
};

export const redirectUrl = async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  
  try {
    const { shortCode } = req.params;
    const urlRecord = await findByShortCode(shortCode);

    if (!urlRecord) {
      metricsService.incrementFailedLookups();
      metricsService.recordLatency(Date.now() - startTime);
      res.status(404).json({ error: 'Short URL not found' });
      return;
    }

    await incrementClicks(shortCode);
    await logClick(urlRecord.id, req.headers['user-agent'] || '', req.headers.referer || '');
    metricsService.incrementSuccessfulRedirects();
    metricsService.recordLatency(Date.now() - startTime);

    res.redirect(urlRecord.original_url);
  } catch (error) {
    console.error('Error redirecting:', error);
    metricsService.recordLatency(Date.now() - startTime);
    res.status(500).json({ error: 'Failed to redirect' });
  }
};

export const getUrlStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shortCode } = req.params;
    const stats = await getClickStats(shortCode);
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error getting URL stats:', error);
    res.status(500).json({ error: 'Failed to get URL stats' });
  }
};