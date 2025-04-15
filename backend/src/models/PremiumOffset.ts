import mongoose, { Document, Schema } from 'mongoose';

export interface IPremiumOffset extends Document {
  name: string;
  description: string;
  provider: string;
  projectType: string;
  location: string;
  pricePerTon: number;
  availableTons: number;
  certification: string;
  images: string[];
  verification: {
    verifiedBy: string;
    verificationDate: Date;
    documents: string[];
    impactReport: string;
  };
  impact: {
    co2Reduced: number;
    treesPlanted: number;
    communitiesImpacted: number;
    biodiversityScore: number;
  };
  timeline: {
    startDate: Date;
    endDate: Date;
    milestones: {
      date: Date;
      description: string;
      completed: boolean;
    }[];
  };
  reviews: {
    userId: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    date: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const PremiumOffsetSchema = new Schema<IPremiumOffset>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  provider: { type: String, required: true },
  projectType: { type: String, required: true },
  location: { type: String, required: true },
  pricePerTon: { type: Number, required: true },
  availableTons: { type: Number, required: true },
  certification: { type: String, required: true },
  images: [{ type: String }],
  verification: {
    verifiedBy: { type: String, required: true },
    verificationDate: { type: Date, required: true },
    documents: [{ type: String }],
    impactReport: { type: String, required: true }
  },
  impact: {
    co2Reduced: { type: Number, required: true },
    treesPlanted: { type: Number, required: true },
    communitiesImpacted: { type: Number, required: true },
    biodiversityScore: { type: Number, required: true }
  },
  timeline: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    milestones: [{
      date: { type: Date, required: true },
      description: { type: String, required: true },
      completed: { type: Boolean, default: false }
    }]
  },
  reviews: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

export default mongoose.model<IPremiumOffset>('PremiumOffset', PremiumOffsetSchema); 