import express, { Request, Response } from 'express';
import { auth } from '../middleware/auth';
import PremiumOffset from '../models/PremiumOffset';
import Subscription from '../models/Subscription';
import mongoose from 'mongoose';

const router = express.Router();

interface AuthRequest extends Request {
  user?: {
    _id: string;
  };
}

// Get all premium offsets
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    // Check if user has premium subscription
    const subscription = await Subscription.findOne({ userId: req.user?._id });
    if (!subscription || !subscription.features.premiumOffsets) {
      return res.status(403).json({ message: 'Premium subscription required' });
    }

    const offsets = await PremiumOffset.find();
    res.json(offsets);
  } catch (error) {
    console.error('Error fetching premium offsets:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific premium offset
router.get('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    // Check if user has premium subscription
    const subscription = await Subscription.findOne({ userId: req.user?._id });
    if (!subscription || !subscription.features.premiumOffsets) {
      return res.status(403).json({ message: 'Premium subscription required' });
    }

    const offset = await PremiumOffset.findById(req.params.id);
    if (!offset) {
      return res.status(404).json({ message: 'Premium offset not found' });
    }
    res.json(offset);
  } catch (error) {
    console.error('Error fetching premium offset:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Purchase premium offset
router.post('/:id/purchase', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { amount } = req.body;
    
    // Check if user has premium subscription
    const subscription = await Subscription.findOne({ userId: req.user?._id });
    if (!subscription || !subscription.features.premiumOffsets) {
      return res.status(403).json({ message: 'Premium subscription required' });
    }

    const offset = await PremiumOffset.findById(req.params.id);
    if (!offset) {
      return res.status(404).json({ message: 'Premium offset not found' });
    }

    if (amount > offset.availableTons) {
      return res.status(400).json({ message: 'Not enough available tons' });
    }

    // Update available tons
    offset.availableTons -= amount;
    await offset.save();

    // TODO: Process payment
    // TODO: Create purchase record
    // TODO: Update user's carbon offset history

    res.json({
      message: 'Purchase successful',
      offset: offset.name,
      amount,
      totalCost: offset.pricePerTon * amount
    });
  } catch (error) {
    console.error('Error purchasing premium offset:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add review to premium offset
router.post('/:id/reviews', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { rating, comment } = req.body;
    
    // Check if user has premium subscription
    const subscription = await Subscription.findOne({ userId: req.user?._id });
    if (!subscription || !subscription.features.premiumOffsets) {
      return res.status(403).json({ message: 'Premium subscription required' });
    }

    const offset = await PremiumOffset.findById(req.params.id);
    if (!offset) {
      return res.status(404).json({ message: 'Premium offset not found' });
    }

    if (!req.user?._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Add review
    offset.reviews.push({
      userId: new mongoose.Types.ObjectId(req.user._id),
      rating,
      comment,
      date: new Date()
    });

    await offset.save();
    res.json(offset);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 