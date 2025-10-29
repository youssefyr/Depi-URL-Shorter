import { Router } from 'express';
import { shortenUrl, redirectUrl } from '../controllers/urlController';
import { metricsService } from '../services/metrics';
import { getUrlCount, getTotalClicks, getAllUrls } from '../models/url';

const router = Router();

router.post('/shorten', shortenUrl);

router.get('/:shortCode', redirectUrl);

router.get('/urls', async (req, res) => {
  try {
    const urls = await getAllUrls();
    res.json(urls);
  } catch (error) {
    console.error('Error fetching URLs:', error);
    res.status(500).json({ error: 'Failed to fetch URLs' });
  }
});

// Prometheus (text format)
router.get('/metric', async (req, res) => {
  try {
    res.set('Content-Type', 'text/plain');
    res.send(await metricsService.getMetrics());
  } catch (error) {
    console.error('Error fetching Prometheus metrics:', error);
    res.status(500).send('Error fetching metrics');
  }
});

// Prometheus (JSON format)
router.get('/metrics', async (req, res) => {
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

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default router;