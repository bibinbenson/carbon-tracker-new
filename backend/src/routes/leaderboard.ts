import express, { Request, Response } from 'express';
import { User, IUser } from '../models/User';
import { auth } from '../middleware/auth';

const router = express.Router();

interface AuthRequest extends Request {
  user?: IUser;
}

// Get global leaderboard
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const users = await User.find({})
      .select('name ecoScore carbonReduced activitiesCompleted challengesCompleted')
      .sort({ ecoScore: -1 })
      .limit(10);

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      name: user.name,
      ecoScore: user.ecoScore,
      carbonReduced: user.carbonReduced,
      activitiesCompleted: user.activitiesCompleted,
      challengesCompleted: user.challengesCompleted,
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Error fetching leaderboard data' });
  }
});

// Get user's rank and nearby users
router.get('/me', auth, async (req: AuthRequest, res: Response) => {
  try {
    const currentUser = await User.findById(req.user?._id);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get total number of users and user's rank
    const userCount = await User.countDocuments();
    const userRank = await User.countDocuments({
      ecoScore: { $gt: currentUser.ecoScore }
    });

    // Get users with similar scores (5 above and 5 below)
    const nearbyUsers = await User.find({
      ecoScore: {
        $gte: currentUser.ecoScore - 100,
        $lte: currentUser.ecoScore + 100
      }
    })
      .select('name ecoScore carbonReduced activitiesCompleted challengesCompleted')
      .sort({ ecoScore: -1 })
      .limit(11); // Get 11 to potentially exclude the current user

    const nearbyLeaderboard = nearbyUsers
      .filter(user => user._id.toString() !== currentUser._id.toString())
      .map((user, index) => ({
        rank: userRank + index + 1,
        userId: user._id,
        name: user.name,
        ecoScore: user.ecoScore,
        carbonReduced: user.carbonReduced,
        activitiesCompleted: user.activitiesCompleted,
        challengesCompleted: user.challengesCompleted,
      }));

    res.json({
      userRank: userRank + 1,
      totalUsers: userCount,
      nearbyUsers: nearbyLeaderboard,
      currentUser: {
        name: currentUser.name,
        ecoScore: currentUser.ecoScore,
        carbonReduced: currentUser.carbonReduced,
        activitiesCompleted: currentUser.activitiesCompleted,
        challengesCompleted: currentUser.challengesCompleted,
      }
    });
  } catch (error) {
    console.error('Error fetching user leaderboard:', error);
    res.status(500).json({ message: 'Error fetching user leaderboard data' });
  }
});

export default router; 