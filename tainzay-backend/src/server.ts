import express, { Request, Response } from 'express';
import http from 'http';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import quoteRoutes from './routes/quoteRoutes';
import reviewRoutes from './routes/reviewRoutes';
import adminRoutes from './routes/adminRoutes';
import settingsRoutes from './routes/settingsRoutes';
import { logNotificationConfig } from './services/notifications';
import { initAdminRealtime } from './services/adminRealtime';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tainzay';

const RETRY_DELAY_MS = 5000;

/**
 * Atlas handshakes can take well over the driver's default timeout on slow
 * links, and Mongoose does not retry a failed initial connection, so keep
 * trying instead of leaving the process running without a database.
 */
async function connectToDatabase(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI, {
      connectTimeoutMS: 60000,
      serverSelectionTimeoutMS: 60000,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    const message = error instanceof Error ? error.message.split('\n')[0] : error;
    console.error(`MongoDB connection failed (${message}); retrying in ${RETRY_DELAY_MS / 1000}s`);
    setTimeout(connectToDatabase, RETRY_DELAY_MS);
  }
}

mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
mongoose.connection.on('reconnected', () => console.log('MongoDB reconnected'));
mongoose.connection.on('error', (error: Error) =>
  console.error('MongoDB error:', error.message.split('\n')[0])
);

connectToDatabase();

const CONNECTION_STATES = ['disconnected', 'connected', 'connecting', 'disconnecting'];

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Tainzay Backend API is running',
    database: CONNECTION_STATES[mongoose.connection.readyState] ?? 'unknown',
  });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingsRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const server = http.createServer(app);

initAdminRealtime(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  logNotificationConfig();
});
