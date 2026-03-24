import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import apiRoutes from './server/routes/api.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // Allows us to receive JSON data

// Connect to MongoDB
if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('<your_username>')) {
  console.warn('⚠️  MONGODB_URI in .env is missing or using placeholder values.');
  console.warn('⚠️  Please update it with your real MongoDB Atlas connection string.');
} else {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch((err) => console.error('❌ Error connecting to MongoDB:', err));
}

// Mount the API Routes
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
