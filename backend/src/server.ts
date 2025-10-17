import app from './app';
import { initDatabase } from './db';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    console.log('Waiting for database to be ready...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('Initializing database...');
    await initDatabase();
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();