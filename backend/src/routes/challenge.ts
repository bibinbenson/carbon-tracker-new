import express, { Request, Response } from 'express';
import { Challenge, IChallenge } from '../models/Challenge';

const router = express.Router();

interface AuthRequest extends Request {
  user?: {
    _id: string;
  };
}

// Get all available challenges
router.get('/', async (req: Request, res: Response) => {
  try {
    const challenges = await Challenge.find();
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching challenges' });
  }
});

// Get user's active challenges
router.get('/user', async (req: AuthRequest, res: Response) => {
  try {
    const challenges = await Challenge.find({
      participants: req.user?._id
    });
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user challenges' });
  }
});

// Join a challenge
router.post('/:challengeId/join', async (req: AuthRequest, res: Response) => {
  try {
    const challenge = await Challenge.findByIdAndUpdate(
      req.params.challengeId,
      { $addToSet: { participants: req.user?._id } },
      { new: true }
    );

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    res.json(challenge);
  } catch (error) {
    res.status(400).json({ message: 'Error joining challenge' });
  }
});

export default router; 