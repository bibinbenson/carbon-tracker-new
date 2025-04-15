import express from 'express';
import { User } from '../models/User';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get auto-offset settings
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('autoOffset');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.autoOffset);
  } catch (error) {
    console.error('Error fetching auto-offset settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update auto-offset settings
router.put('/', auth, async (req, res) => {
  try {
    const { enabled, monthlyAmount } = req.body;

    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ message: 'Enabled must be a boolean' });
    }

    if (enabled && (typeof monthlyAmount !== 'number' || monthlyAmount <= 0)) {
      return res.status(400).json({ message: 'Monthly amount must be a positive number' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.autoOffset = {
      ...user.autoOffset,
      enabled,
      monthlyAmount: enabled ? monthlyAmount : 0,
      lastOffsetDate: enabled ? new Date() : undefined
    };

    await user.save();
    res.json(user.autoOffset);
  } catch (error) {
    console.error('Error updating auto-offset settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 