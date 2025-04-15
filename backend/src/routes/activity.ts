import express, { Request, Response } from 'express';
import { Activity, IActivity } from '../models/Activity';

const router = express.Router();

interface AuthRequest extends Request {
  user?: {
    _id: string;
  };
}

// Get all activities for the current user
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const activities = await Activity.find({ user: req.user?._id });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities' });
  }
});

// Create a new activity
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const activity = new Activity({
      ...req.body,
      user: req.user?._id,
    });
    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ message: 'Error creating activity' });
  }
});

// Get activity statistics
router.get('/stats', async (req: AuthRequest, res: Response) => {
  try {
    const stats = await Activity.aggregate([
      { $match: { user: req.user?._id } },
      {
        $group: {
          _id: '$category',
          totalCarbonFootprint: { $sum: '$carbonFootprint' },
          count: { $sum: 1 }
        }
      }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity statistics' });
  }
});

export default router; 