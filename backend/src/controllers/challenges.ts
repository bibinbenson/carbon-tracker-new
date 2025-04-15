import { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
import Challenge, { IChallenge } from '../models/Challenge';
import User, { IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

// Get all challenges
export const getAllChallenges = async (req: Request, res: Response) => {
  try {
    const challenges = await Challenge.find()
      .populate('participants', 'name ecoScore');
    res.json(challenges);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get challenge by ID
export const getChallengeById = async (req: Request, res: Response) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .populate('participants', 'name ecoScore');
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    res.json(challenge);
  } catch (error) {
    console.error('Error fetching challenge:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new challenge
export const createChallenge = async (req: Request, res: Response) => {
  try {
    const { title, description, category, duration, points, startDate, endDate } = req.body;
    
    const challenge = new Challenge({
      title,
      description,
      category,
      duration,
      points,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      participants: []
    });
    
    await challenge.save();
    res.status(201).json(challenge);
  } catch (error) {
    console.error('Error creating challenge:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Join challenge
export const joinChallenge = async (req: AuthRequest, res: Response) => {
  try {
    const challengeId = req.params.id as string;
    if (!mongoose.Types.ObjectId.isValid(challengeId)) {
      return res.status(400).json({ message: 'Invalid challenge ID' });
    }

    const challenge = await Challenge.findById(challengeId) as IChallenge | null;
    if (!req.user?.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const userId = req.user.id as string;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const user = await User.findById(userId) as IUser | null;
    
    if (!challenge || !user) {
      return res.status(404).json({ message: 'Challenge or user not found' });
    }
    
    // Check if user is already participating
    if (challenge.participants.some(id => id.equals(user._id))) {
      return res.status(400).json({ message: 'Already participating in this challenge' });
    }
    
    // Add user to challenge participants
    challenge.participants.push(user._id);
    await challenge.save();
    
    // Add challenge to user's challenges
    user.challenges.push(challenge._id);
    await user.save();
    
    res.json(challenge);
  } catch (error) {
    console.error('Error joining challenge:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Leave challenge
export const leaveChallenge = async (req: AuthRequest, res: Response) => {
  try {
    const challengeId = req.params.id as string;
    if (!mongoose.Types.ObjectId.isValid(challengeId)) {
      return res.status(400).json({ message: 'Invalid challenge ID' });
    }

    const challenge = await Challenge.findById(challengeId) as IChallenge | null;
    if (!req.user?.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const userId = req.user.id as string;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const user = await User.findById(userId) as IUser | null;
    
    if (!challenge || !user) {
      return res.status(404).json({ message: 'Challenge or user not found' });
    }
    
    // Remove user from challenge participants
    challenge.participants = challenge.participants.filter(
      (participantId) => !participantId.equals(user._id)
    );
    await challenge.save();
    
    // Remove challenge from user's challenges
    user.challenges = user.challenges.filter(
      (challengeId) => !challengeId.equals(challenge._id)
    );
    await user.save();
    
    res.json({ message: 'Successfully left the challenge' });
  } catch (error) {
    console.error('Error leaving challenge:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 