import mongoose, { Document, Schema } from 'mongoose';

export interface ICarbonOffset extends Document {
  name: string;
  description: string;
  provider: string;
  projectType: string;
  location: string;
  pricePerTon: number;
  availableTons: number;
  certification: string;
  images: string[];
  commission: {
    rate: number;
    minimum: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CarbonOffsetSchema = new Schema<ICarbonOffset>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    provider: { type: String, required: true },
    projectType: { type: String, required: true },
    location: { type: String, required: true },
    pricePerTon: { type: Number, required: true },
    availableTons: { type: Number, required: true },
    certification: { type: String, required: true },
    images: [{ type: String }],
    commission: {
      rate: { type: Number, default: 0.05 }, // 5% commission
      minimum: { type: Number, default: 1 } // $1 minimum commission
    }
  },
  { timestamps: true }
);

export default mongoose.model<ICarbonOffset>('CarbonOffset', CarbonOffsetSchema); 