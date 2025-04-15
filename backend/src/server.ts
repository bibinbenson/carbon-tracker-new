import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import activityRoutes from './routes/activity';
import userRoutes from './routes/user';
import leaderboardRoutes from './routes/leaderboard';
import carbonOffsetRoutes from './routes/carbonOffsets';
import subscriptionRoutes from './routes/subscription';
import premiumOffsetRoutes from './routes/premiumOffsets';
import calculationRoutes from './routes/calculations';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/carbon-offsets', carbonOffsetRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/premium-offsets', premiumOffsetRoutes);
app.use('/api/calculations', calculationRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecotrack')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app; 