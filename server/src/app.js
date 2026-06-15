import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);

export default app;
