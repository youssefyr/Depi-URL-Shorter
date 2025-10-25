import express from 'express';
import cors from 'cors';
import { metricsService } from './services/metrics';
import urlRoutes from './routes'; // adjust this if your routes are defined elsewhere

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Metrics endpoint — must come BEFORE other routes
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', metricsService.getRegistry().contentType);
    res.end(await metricsService.getMetrics());
  } catch (error) {
    console.error('Error serving metrics:', error);
    res.status(500).send('Error generating metrics');
  }
});

// ✅ Main app routes
app.use('/api', urlRoutes);

// ✅ Optional: redirect route (last)
import { redirectUrl } from './controllers/urlController';
app.get('/:shortCode', redirectUrl);


export default app;
