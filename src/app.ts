import express, { Application } from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/routes';
import 'dotenv/config';

const app: Application = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', userRoutes);

export default app;
