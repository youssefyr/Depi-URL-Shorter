import express from 'express';
import cors from 'cors';
<<<<<<< HEAD
import routes from './routes/index';
import { metricsMiddleware } from './middleware/metrics';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(metricsMiddleware);

// Routes
app.use('/', routes);

// JSON parse error handler
app.use((err: any, req: any, res: any, next: any) => {
    if (err && err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Invalid JSON payload' });
    }
    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json({ error: 'Invalid JSON' });
    }
    return next(err);
});

export default app;
=======
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
>>>>>>> 00bdbc0 (Advanced Visualization with Grafana)
