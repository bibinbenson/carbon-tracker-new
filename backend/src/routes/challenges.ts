import express, { Request, Response } from 'express';
import Challenge from '../models/Challenge';
import User from '../models/User';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

// Get all active challenges
router.get('/', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const challenges = await Challenge.find({
      endDate: { $gte: new Date() }
    }).sort({ startDate: -1 });
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new challenge
router.post('/', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, points, duration, difficulty } = req.body;
    
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + duration);

    const challenge = new Challenge({
      title,
      description,
      category,
      points,
      duration,
      difficulty,
      participants: [req.user?.userId],
      endDate,
    });

    await challenge.save();
    res.status(201).json(challenge);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Join a challenge
router.post('/:challengeId/join', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const challenge = await Challenge.findById(req.params.challengeId);
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    if (challenge.participants.includes(req.user?.userId || '')) {
      return res.status(400).json({ message: 'Already joined this challenge' });
    }

    challenge.participants.push(req.user?.userId || '');
    await challenge.save();

    res.json(challenge);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete a challenge
router.post('/:challengeId/complete', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const challenge = await Challenge.findById(req.params.challengeId);
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    if (!challenge.participants.includes(req.user?.userId || '')) {
      return res.status(400).json({ message: 'Not participating in this challenge' });
    }

    // Award points to user
    const user = await User.findById(req.user?.userId);
    if (user) {
      user.ecoScore += challenge.points;
      
      // Level up system (every 100 points)
      const newLevel = Math.floor(user.ecoScore / 100) + 1;
      if (newLevel > user.level) {
        user.level = newLevel;
        // Add achievement for leveling up
        user.achievements.push({
          id: `level_${newLevel}`,
          name: `Eco Warrior Level ${newLevel}`,
          description: `Reached level ${newLevel} in your eco-journey!`,
          unlockedAt: new Date(),
        });
      }

      await user.save();
    }

    res.json({ message: 'Challenge completed successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 