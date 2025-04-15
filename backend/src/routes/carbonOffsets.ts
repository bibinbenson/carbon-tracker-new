import express, { Request, Response } from 'express';
import CarbonOffset from '../models/CarbonOffset';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get all carbon offsets
router.get('/', async (req: Request, res: Response) => {
  try {
    const offsets = await CarbonOffset.find();
    res.json(offsets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching carbon offsets' });
  }
});

// Get a specific carbon offset
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const offset = await CarbonOffset.findById(req.params.id);
    if (!offset) {
      return res.status(404).json({ message: 'Carbon offset not found' });
    }
    res.json(offset);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching carbon offset' });
  }
});

// Create a new carbon offset (admin only)
router.post('/', auth, async (req: Request, res: Response) => {
  try {
    const offset = new CarbonOffset(req.body);
    await offset.save();
    res.status(201).json(offset);
  } catch (error) {
    res.status(400).json({ message: 'Error creating carbon offset' });
  }
});

// Update a carbon offset (admin only)
router.put('/:id', auth, async (req: Request, res: Response) => {
  try {
    const offset = await CarbonOffset.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!offset) {
      return res.status(404).json({ message: 'Carbon offset not found' });
    }
    res.json(offset);
  } catch (error) {
    res.status(400).json({ message: 'Error updating carbon offset' });
  }
});

// Delete a carbon offset (admin only)
router.delete('/:id', auth, async (req: Request, res: Response) => {
  try {
    const offset = await CarbonOffset.findByIdAndDelete(req.params.id);
    if (!offset) {
      return res.status(404).json({ message: 'Carbon offset not found' });
    }
    res.json({ message: 'Carbon offset deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting carbon offset' });
  }
});

export default router; 