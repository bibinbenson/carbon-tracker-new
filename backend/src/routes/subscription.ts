import express, { Request, Response } from 'express';
import { auth } from '../middleware/auth';
import Subscription from '../models/Subscription';
import { User } from '../models/User';

const router = express.Router();

interface AuthRequest extends Request {
  user?: {
    _id: string;
  };
}

// Get user's subscription
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user?._id });
    if (!subscription) {
      return res.status(404).json({ message: 'No subscription found' });
    }
    res.json(subscription);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or update subscription
router.post('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { plan, paymentMethod, autoOffset } = req.body;
    
    // Validate plan
    if (!['basic', 'premium', 'enterprise'].includes(plan)) {
      return res.status(400).json({ message: 'Invalid plan' });
    }

    const subscription = await Subscription.findOneAndUpdate(
      { userId: req.user?._id },
      {
        plan,
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        paymentMethod,
        autoOffset,
        features: {
          apiAccess: plan !== 'basic',
          premiumOffsets: plan !== 'basic',
          certification: plan === 'enterprise',
          teamChallenges: plan === 'enterprise'
        }
      },
      { upsert: true, new: true }
    );

    res.json(subscription);
  } catch (error) {
    console.error('Error creating/updating subscription:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel subscription
router.post('/cancel', auth, async (req: AuthRequest, res: Response) => {
  try {
    const subscription = await Subscription.findOneAndUpdate(
      { userId: req.user?._id },
      { status: 'cancelled' },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({ message: 'No subscription found' });
    }

    res.json(subscription);
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update auto-offset settings
router.put('/auto-offset', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { enabled, monthlyAmount } = req.body;
    
    const subscription = await Subscription.findOneAndUpdate(
      { userId: req.user?._id },
      { 
        'autoOffset.enabled': enabled,
        'autoOffset.monthlyAmount': monthlyAmount
      },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({ message: 'No subscription found' });
    }

    res.json(subscription);
  } catch (error) {
    console.error('Error updating auto-offset settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 