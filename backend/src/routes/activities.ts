import { Router, Request, Response } from 'express';
import { Activity } from '../models/Activity';
import { auth } from '../middleware/auth';
import { IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

const router = Router();

// Get recent activities
router.get('/recent', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 10 } = req.query;
    const activities = await Activity.find({ userId: req.user?.id })
      .sort({ date: -1 })
      .limit(Number(limit));
    res.json(activities);
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({ message: 'Error fetching activities' });
  }
});

// Get all activities with pagination
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const activities = await Activity.find({ userId: req.user?.id })
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Activity.countDocuments({ userId: req.user?.id });

    res.json({
      activities,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Error fetching activities' });
  }
});

// Create new activity
router.post('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const activity = new Activity({
      ...req.body,
      userId: req.user?.id,
    });
    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({ message: 'Error creating activity' });
  }
});

// Update activity
router.put('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const activity = await Activity.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.id },
      req.body,
      { new: true }
    );
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json(activity);
  } catch (error) {
    console.error('Error updating activity:', error);
    res.status(500).json({ message: 'Error updating activity' });
  }
});

// Delete activity
router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const activity = await Activity.findOneAndDelete({
      _id: req.params.id,
      userId: req.user?.id,
    });
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ message: 'Error deleting activity' });
  }
});

export default router; 