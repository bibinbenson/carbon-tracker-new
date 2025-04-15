import express from 'express';
import { authenticateToken } from '../middleware/auth';
import Achievement from '../models/Achievement';

const router = express.Router();

// Get all achievements
router.get('/', authenticateToken, async (req, res) => {
  try {
    const achievements = await Achievement.find();
    res.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user achievements
router.get('/user', authenticateToken, async (req, res) => {
  try {
    // TODO: Implement user achievements logic
    res.json({ message: 'User achievements endpoint' });
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 