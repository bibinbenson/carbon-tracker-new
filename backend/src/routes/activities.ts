import express, { Request } from 'express';
import CarbonActivity from '../models/CarbonActivity';
import { OpenAI } from 'openai';

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware to verify JWT token
import { verifyToken } from '../middleware/auth';

interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

// Get all activities for a user
router.get('/', verifyToken, async (req: AuthRequest, res) => {
  try {
    const activities = await CarbonActivity.find({ userId: req.user?.userId })
      .sort({ date: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new activity
router.post('/', verifyToken, async (req: AuthRequest, res) => {
  try {
    const { category, subCategory, amount, unit } = req.body;

    // Calculate carbon footprint based on activity
    const carbonFootprint = calculateCarbonFootprint(category, subCategory, amount, unit);

    // Get AI suggestions
    const aiSuggestions = await getAISuggestions(category, subCategory, amount);

    const activity = new CarbonActivity({
      userId: req.user?.userId,
      category,
      subCategory,
      amount,
      unit,
      carbonFootprint,
      aiSuggestions,
    });

    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

interface EmissionFactors {
  [key: string]: {
    [key: string]: number;
  };
}

// Helper function to calculate carbon footprint
function calculateCarbonFootprint(category: string, subCategory: string, amount: number, unit: string): number {
  // These are simplified calculations. In a real app, you'd want more precise calculations
  const factors: EmissionFactors = {
    transport: {
      car: 0.2, // kg CO2 per km
      bus: 0.08,
      train: 0.04,
      plane: 0.25,
    },
    energy: {
      electricity: 0.5, // kg CO2 per kWh
      gas: 0.2,
      oil: 0.3,
    },
    food: {
      meat: 13.3, // kg CO2 per kg
      dairy: 3.2,
      vegetables: 0.4,
    },
    shopping: {
      clothes: 10, // kg CO2 per item
      electronics: 30,
      furniture: 50,
    },
  };

  const factor = factors[category]?.[subCategory] || 1;
  return amount * factor;
}

// Helper function to get AI suggestions
async function getAISuggestions(category: string, subCategory: string, amount: number): Promise<string[]> {
  try {
    const prompt = `Given a carbon footprint activity in the category "${category}" (${subCategory}) with amount ${amount}, 
    provide 3 specific, actionable suggestions to reduce the carbon footprint. Format as a JSON array of strings.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an eco-friendly AI assistant providing specific, actionable suggestions to reduce carbon footprint."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    const suggestions = JSON.parse(response.choices[0].message.content || '[]');
    return suggestions.slice(0, 3);
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    return ['Consider more eco-friendly alternatives.',
            'Try to reduce consumption when possible.',
            'Look for energy-efficient options.'];
  }
}

export default router; 