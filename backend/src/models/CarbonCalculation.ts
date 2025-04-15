import mongoose, { Document, Schema } from 'mongoose';

export interface ICarbonCalculation extends Document {
  userId: mongoose.Types.ObjectId;
  totalEmissions: number;
  date: Date;
  breakdown: {
    transportation: number;
    energy: number;
    food: number;
    shopping: number;
  };
  inputs: {
    // Transportation
    carMileage: number;
    carType: string;
    publicTransport: number;
    flights: number;
    // Energy
    electricity: number;
    naturalGas: number;
    heatingOil: number;
    // Food
    meatConsumption: string;
    dairyConsumption: string;
    localFood: string;
    // Shopping
    clothing: number;
    electronics: number;
    otherShopping: number;
  };
  notes: string;
}

const CarbonCalculationSchema = new Schema<ICarbonCalculation>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalEmissions: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  breakdown: {
    transportation: { type: Number, required: true },
    energy: { type: Number, required: true },
    food: { type: Number, required: true },
    shopping: { type: Number, required: true }
  },
  inputs: {
    // Transportation
    carMileage: { type: Number, required: true },
    carType: { type: String, required: true },
    publicTransport: { type: Number, required: true },
    flights: { type: Number, required: true },
    // Energy
    electricity: { type: Number, required: true },
    naturalGas: { type: Number, required: true },
    heatingOil: { type: Number, required: true },
    // Food
    meatConsumption: { type: String, required: true },
    dairyConsumption: { type: String, required: true },
    localFood: { type: String, required: true },
    // Shopping
    clothing: { type: Number, required: true },
    electronics: { type: Number, required: true },
    otherShopping: { type: Number, required: true }
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export const CarbonCalculation = mongoose.model<ICarbonCalculation>('CarbonCalculation', CarbonCalculationSchema); 