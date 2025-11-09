import express from 'express';
import cors from 'cors';
import routes from './routes';
import { metricsService } from './services/metrics';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
    const metrics = await metricsService.getMetrics();
    res.end(metrics);
  } catch (err: any) { // ✅ type fixed
    res.status(500).send(err.message);
  }
});

// Mount routes
app.use('/', routes);

export default app;
