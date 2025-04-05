import mongoose from 'mongoose';
import { User } from '../types';

const achievementSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  unlockedAt: Date,
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  ecoScore: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
  achievements: [achievementSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<User & mongoose.Document>('User', userSchema); 