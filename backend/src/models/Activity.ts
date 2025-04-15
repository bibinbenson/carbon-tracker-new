import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
  user: mongoose.Types.ObjectId;
  category: string;
  subcategory: string;
  amount: number;
  unit: string;
  carbonFootprint: number;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema<IActivity>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  amount: { type: Number, required: true },
  unit: { type: String, required: true },
  carbonFootprint: { type: Number, required: true },
  date: { type: Date, required: true },
  notes: { type: String },
}, {
  timestamps: true
});

export const Activity = mongoose.model<IActivity>('Activity', ActivitySchema); 