import mongoose from 'mongoose';
import { CarbonActivity } from '../types';

const carbonActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    enum: ['transport', 'energy', 'food', 'shopping'],
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  carbonFootprint: {
    type: Number,
    required: true,
  },
  aiSuggestions: [{
    type: String,
  }],
});

export default mongoose.model<CarbonActivity & mongoose.Document>('CarbonActivity', carbonActivitySchema); 