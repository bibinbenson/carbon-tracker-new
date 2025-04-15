import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { getUserProfile, updateUserProfile } from '../controllers/users';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, getUserProfile);

// Update user profile
router.put('/profile', authenticateToken, updateUserProfile);

export default router; 