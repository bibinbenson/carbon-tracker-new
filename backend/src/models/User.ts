import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  location?: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    weeklyGoal: number;
  };
  autoOffset: {
    enabled: boolean;
    monthlyAmount: number;
    lastOffsetDate: Date;
    paymentMethod?: {
      type: string;
      last4: string;
      expiry: string;
    };
  };
  level: number;
  ecoScore: number;
  carbonFootprint: number;
  carbonReduced: number;
  activitiesCompleted: number;
  challengesCompleted: number;
  joinedDate: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    trim: true
  },
  location: { type: String },
  preferences: {
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    notifications: { type: Boolean, default: true },
    weeklyGoal: { type: Number, default: 100 },
  },
  autoOffset: {
    enabled: { type: Boolean, default: false },
    monthlyAmount: { type: Number, default: 0 },
    lastOffsetDate: { type: Date },
    paymentMethod: {
      type: { type: String },
      last4: { type: String },
      expiry: { type: String }
    }
  },
  level: { type: Number, default: 1 },
  ecoScore: { type: Number, default: 0 },
  carbonFootprint: { type: Number, default: 0 },
  carbonReduced: { type: Number, default: 0 },
  activitiesCompleted: { type: Number, default: 0 },
  challengesCompleted: { type: Number, default: 0 },
  joinedDate: { type: Date, default: Date.now },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

export const User = mongoose.model<IUser>('User', UserSchema); 