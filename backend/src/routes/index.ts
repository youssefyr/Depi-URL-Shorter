import { Router } from 'express';
import { shortenUrl, redirectUrl, getUrlStats } from '../controllers/urlController';
import { metricsService } from '../services/metrics';
import { getUrlCount, getTotalClicks, getAllUrls } from '../models/url';

const router = Router();

// Health check - FIRST
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API routes
router.post('/api/shorten', shortenUrl);

router.get('/api/urls', async (req, res) => {
  try {
    const urls = await getAllUrls();
    res.json(urls);
  } catch (error) {
    console.error('Error fetching URLs:', error);
    res.status(500).json({ error: 'Failed to fetch URLs' });
  }
});

router.get('/api/stats/:shortCode', getUrlStats);

// Prometheus metrics (text format)
router.get('/api/metric', async (req, res) => {
  try {
    res.set('Content-Type', 'text/plain');
    res.send(await metricsService.getMetrics());
  } catch (error) {
    console.error('Error fetching Prometheus metrics:', error);
    res.status(500).send('Error fetching metrics');
  }
});

// JSON metrics for frontend
router.get('/api/metrics', async (req, res) => {
  try {
    const [urlCount, totalClicks] = await Promise.all([
      getUrlCount(),
      getTotalClicks()
    ]);

    const failedLookups = metricsService.getCounterValue('failed_lookups_total');
    const latencyStats = metricsService.getHistogramStats();

    res.json({
      urlsShortened: urlCount,
      successfulRedirects: totalClicks,
      failedLookups: failedLookups,
      averageLatency: latencyStats.average,
      p95Latency: latencyStats.average * 1.5
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// Redirect route
router.get('/go/:shortCode', redirectUrl);

export default router;