import express from 'express';
import { createServer } from 'http';
import setRoutes from './routes/index';
import { initializeDb } from './db/index';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
setRoutes(app);

const server = createServer(app);

async function start() {
    try {
        await initializeDb();
        server.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    }
}

start();

server.on('error', (error) => {
    console.error('Error starting the server:', error);
});