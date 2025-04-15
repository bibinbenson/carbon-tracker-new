import mongoose, { Document, Schema } from 'mongoose';

export interface IChallenge extends Document {
  title: string;
  description: string;
  category: string;
  points: number;
  duration: number; // in days
  startDate: Date;
  endDate: Date;
  participants: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ChallengeSchema = new Schema<IChallenge>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  points: { type: Number, required: true },
  duration: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, {
  timestamps: true
});

export const Challenge = mongoose.model<IChallenge>('Challenge', ChallengeSchema); 