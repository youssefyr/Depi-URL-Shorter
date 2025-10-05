import express from 'express';
import setRoutes from './routes/index';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setRoutes(app);

// JSON parse error handler (body-parser)
app.use((err: any, req: any, res: any, next: any) => {
    if (err && err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Invalid JSON payload' });
    }
    // handle generic SyntaxError from body-parser
    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json({ error: 'Invalid JSON' });
    }
    return next(err);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;