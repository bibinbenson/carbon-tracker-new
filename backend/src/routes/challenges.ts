import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getAllChallenges,
  getChallengeById,
  createChallenge,
  joinChallenge,
  leaveChallenge
} from '../controllers/challenges';

const router = express.Router();

// Get all challenges
router.get('/', authenticateToken, getAllChallenges);

// Get challenge by ID
router.get('/:id', authenticateToken, getChallengeById);

// Create new challenge
router.post('/', authenticateToken, createChallenge);

// Join challenge
router.post('/:id/join', authenticateToken, joinChallenge);

// Leave challenge
router.post('/:id/leave', authenticateToken, leaveChallenge);

export default router; 