import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  plan: 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate: Date;
  autoOffset: {
    enabled: boolean;
    monthlyAmount: number;
    lastOffsetDate: Date;
  };
  features: {
    apiAccess: boolean;
    premiumOffsets: boolean;
    certification: boolean;
    teamChallenges: boolean;
  };
  paymentMethod: {
    type: string;
    last4: string;
    expiry: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { 
    type: String, 
    enum: ['basic', 'premium', 'enterprise'],
    required: true 
  },
  status: { 
    type: String, 
    enum: ['active', 'cancelled', 'expired'],
    default: 'active'
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  autoOffset: {
    enabled: { type: Boolean, default: false },
    monthlyAmount: { type: Number, default: 0 },
    lastOffsetDate: { type: Date }
  },
  features: {
    apiAccess: { type: Boolean, default: false },
    premiumOffsets: { type: Boolean, default: false },
    certification: { type: Boolean, default: false },
    teamChallenges: { type: Boolean, default: false }
  },
  paymentMethod: {
    type: { type: String },
    last4: { type: String },
    expiry: { type: String }
  }
}, {
  timestamps: true
});

export default mongoose.model<ISubscription>('Subscription', SubscriptionSchema); 