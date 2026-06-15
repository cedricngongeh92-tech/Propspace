import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);

export default app;
