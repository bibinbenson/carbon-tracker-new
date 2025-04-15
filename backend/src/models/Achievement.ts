import mongoose, { Document, Schema } from 'mongoose';

export interface IAchievement extends Document {
  title: string;
  description: string;
  icon: string;
  points: number;
  criteria: {
    type: string;
    value: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AchievementSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  points: { type: Number, required: true },
  criteria: {
    type: { type: String, required: true },
    value: { type: Number, required: true }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IAchievement>('Achievement', AchievementSchema); 