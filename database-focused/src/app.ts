import express, { Express } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import supplierRoutes from './routes/supplier.routes';
import inventoryRoutes from './routes/inventory.routes';

dotenv.config();

const app: Express = express();
app.use(cors());
app.use(express.json());

// @desc MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/zerostock_db_assignment';

mongoose.connect(MONGO_URI)
  .then(() => console.log(`Connected to MongoDB: ${MONGO_URI}`))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/supplier', supplierRoutes);
app.use('/inventory', inventoryRoutes);

export default app;
