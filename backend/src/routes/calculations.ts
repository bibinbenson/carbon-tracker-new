import express, { Request } from 'express';
import { CarbonCalculation } from '../models/CarbonCalculation';
import { User } from '../models/User';
import { auth } from '../middleware/auth';
import { IUser } from '../models/User';

const router = express.Router();

// Extended request interface with user property
interface AuthRequest extends Request {
  user?: IUser;
  token?: string;
}

/**
 * @route   POST /api/calculations
 * @desc    Save a new carbon calculation
 * @access  Private
 */
router.post('/', auth, async (req: AuthRequest, res) => {
  try {
    const {
      totalEmissions,
      breakdown,
      inputs,
      notes
    } = req.body;

    if (!totalEmissions || !breakdown || !inputs) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create a new calculation
    const calculation = new CarbonCalculation({
      userId: req.user?._id,
      totalEmissions,
      breakdown,
      inputs,
      notes: notes || '',
      date: new Date()
    });

    // Save the calculation
    await calculation.save();

    // Update user's overall carbon footprint
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        carbonFootprint: totalEmissions
      });
    }

    res.status(201).json({
      success: true,
      calculation
    });
  } catch (error) {
    console.error('Error saving carbon calculation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/calculations
 * @desc    Get all user's carbon calculations
 * @access  Private
 */
router.get('/', auth, async (req: AuthRequest, res) => {
  try {
    const calculations = await CarbonCalculation.find({ 
      userId: req.user?._id 
    }).sort({ date: -1 });

    res.json({
      success: true,
      calculations
    });
  } catch (error) {
    console.error('Error retrieving carbon calculations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/calculations/:id
 * @desc    Get a specific carbon calculation
 * @access  Private
 */
router.get('/:id', auth, async (req: AuthRequest, res) => {
  try {
    const calculation = await CarbonCalculation.findOne({
      _id: req.params.id,
      userId: req.user?._id
    });

    if (!calculation) {
      return res.status(404).json({ message: 'Calculation not found' });
    }

    res.json({
      success: true,
      calculation
    });
  } catch (error) {
    console.error('Error retrieving carbon calculation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   DELETE /api/calculations/:id
 * @desc    Delete a specific carbon calculation
 * @access  Private
 */
router.delete('/:id', auth, async (req: AuthRequest, res) => {
  try {
    const calculation = await CarbonCalculation.findOneAndDelete({
      _id: req.params.id,
      userId: req.user?._id
    });

    if (!calculation) {
      return res.status(404).json({ message: 'Calculation not found' });
    }

    res.json({
      success: true,
      message: 'Calculation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting carbon calculation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 