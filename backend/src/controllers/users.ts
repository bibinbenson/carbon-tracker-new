import { Request, Response } from 'express';
import User from '../models/User';
import Activity from '../models/Activity';

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('achievements')
      .populate('activities');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate user statistics
    const statistics = await calculateUserStatistics(user._id);

    res.json({
      ...user.toObject(),
      statistics,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { name, email, avatar } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const calculateUserStatistics = async (userId: string) => {
  // Calculate category-wise carbon footprint
  const categoryData = await Activity.aggregate([
    { $match: { user: userId } },
    { $group: { _id: '$category', total: { $sum: '$carbonSaved' } } },
  ]);

  // Calculate monthly progress
  const monthlyData = await Activity.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: { $month: '$date' },
        carbonFootprint: { $sum: '$carbonSaved' },
        activities: { $sum: 1 },
      },
    },
  ]);

  // Calculate weekly activity breakdown
  const weeklyData = await Activity.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: { $week: '$date' },
        activities: { $sum: 1 },
        carbonSaved: { $sum: '$carbonSaved' },
      },
    },
  ]);

  return {
    categoryData: categoryData.map(item => ({
      name: item._id,
      value: item.total,
      color: getCategoryColor(item._id),
    })),
    monthlyData: monthlyData.map(item => ({
      month: getMonthName(item._id),
      carbonFootprint: item.carbonFootprint,
      ecoScore: calculateEcoScore(item.activities),
    })),
    weeklyData: weeklyData.map(item => ({
      week: `Week ${item._id}`,
      activities: item.activities,
      carbonSaved: item.carbonSaved,
    })),
  };
};

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    transportation: '#8884d8',
    energy: '#82ca9d',
    food: '#ffc658',
    lifestyle: '#ff8042',
  };
  return colors[category.toLowerCase()] || '#8884d8';
};

const getMonthName = (month: number) => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return months[month - 1];
};

const calculateEcoScore = (activities: number) => {
  // Simple scoring system - can be enhanced
  return activities * 10;
}; 