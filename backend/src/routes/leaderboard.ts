import express, { Request, Response } from 'express';
import User from '../models/User';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

// Get global leaderboard
router.get('/', verifyToken, async (_req: AuthRequest, res: Response) => {
  try {
    const users = await User.find({})
      .select('username ecoScore level achievements')
      .sort({ ecoScore: -1 })
      .limit(100);

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      username: user.username,
      ecoScore: user.ecoScore,
      level: user.level,
      achievements: user.achievements.length,
    }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's rank and nearby users
router.get('/me', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const currentUser = await User.findById(req.user?.userId);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get total number of users and user's rank
    const userCount = await User.countDocuments();
    const userRank = await User.countDocuments({ ecoScore: { $gt: currentUser.ecoScore } });

    // Get 5 users above and below the current user
    const nearbyUsers = await User.find({
      _id: { $ne: currentUser._id },
      ecoScore: {
        $gte: currentUser.ecoScore - 500,
        $lte: currentUser.ecoScore + 500,
      },
    })
      .select('username ecoScore level achievements')
      .sort({ ecoScore: -1 })
      .limit(10);

    const response = {
      currentUser: {
        rank: userRank + 1,
        userId: currentUser._id,
        username: currentUser.username,
        ecoScore: currentUser.ecoScore,
        level: currentUser.level,
        achievements: currentUser.achievements.length,
      },
      totalUsers: userCount,
      nearbyUsers: nearbyUsers.map((user) => ({
        userId: user._id,
        username: user.username,
        ecoScore: user.ecoScore,
        level: user.level,
        achievements: user.achievements.length,
      })),
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 