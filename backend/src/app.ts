import express from 'express';
import cors from 'cors';
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