import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  EmojiEvents,
  DirectionsCar,
  Lightbulb,
  RestaurantMenu,
  Info as InfoIcon,
} from '@mui/icons-material';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  duration: string;
  points: number;
  progress?: number;
  status: 'available' | 'active' | 'completed';
}

const challenges: Challenge[] = [
  {
    id: '1',
    title: 'Public Transport Champion',
    description: 'Use public transportation for a week instead of driving',
    category: 'Transportation',
    icon: <DirectionsCar />,
    duration: '7 days',
    points: 100,
    progress: 71,
    status: 'active',
  },
  {
    id: '2',
    title: 'Energy Saver',
    description: 'Reduce your electricity consumption by 20%',
    category: 'Energy',
    icon: <Lightbulb />,
    duration: '30 days',
    points: 200,
    progress: 45,
    status: 'active',
  },
  {
    id: '3',
    title: 'Meatless Monday Hero',
    description: 'Go vegetarian every Monday for a month',
    category: 'Food',
    icon: <RestaurantMenu />,
    duration: '30 days',
    points: 150,
    status: 'available',
  },
  {
    id: '4',
    title: 'Zero Waste Week',
    description: 'Produce no non-recyclable waste for a week',
    category: 'Lifestyle',
    icon: <EmojiEvents />,
    duration: '7 days',
    points: 120,
    status: 'available',
  },
];

const Challenges = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const handleJoinChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setOpenDialog(true);
  };

  const handleConfirmJoin = () => {
    // TODO: Implement API call to join challenge
    setOpenDialog(false);
    setSelectedChallenge(null);
  };

  const activeChallenges = challenges.filter((c) => c.status === 'active');
  const availableChallenges = challenges.filter((c) => c.status === 'available');

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Challenges
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Join eco-challenges to earn points and reduce your carbon footprint
      </Typography>

      {activeChallenges.length > 0 && (
        <>
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Active Challenges
          </Typography>
          <Grid container spacing={3}>
            {activeChallenges.map((challenge) => (
              <Grid item xs={12} md={6} key={challenge.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {challenge.icon}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {challenge.title}
                      </Typography>
                    </Box>
                    <Typography color="text.secondary" paragraph>
                      {challenge.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Chip
                        label={challenge.category}
                        size="small"
                        color="primary"
                        sx={{ mr: 1 }}
                      />
                      <Chip label={`${challenge.duration}`} size="small" />
                      <Chip
                        label={`${challenge.points} points`}
                        size="small"
                        color="secondary"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Progress: {challenge.progress}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={challenge.progress}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Available Challenges
      </Typography>
      <Grid container spacing={3}>
        {availableChallenges.map((challenge) => (
          <Grid item xs={12} md={6} key={challenge.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {challenge.icon}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {challenge.title}
                  </Typography>
                  <Tooltip title="View challenge details">
                    <IconButton size="small" sx={{ ml: 'auto' }}>
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography color="text.secondary" paragraph>
                  {challenge.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip
                    label={challenge.category}
                    size="small"
                    color="primary"
                    sx={{ mr: 1 }}
                  />
                  <Chip label={`${challenge.duration}`} size="small" />
                  <Chip
                    label={`${challenge.points} points`}
                    size="small"
                    color="secondary"
                    sx={{ ml: 1 }}
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => handleJoinChallenge(challenge)}
                >
                  Join Challenge
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Join Challenge</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Are you ready to start the "{selectedChallenge?.title}" challenge?
          </Typography>
          <Typography color="text.secondary" paragraph>
            Duration: {selectedChallenge?.duration}
          </Typography>
          <Typography color="text.secondary" paragraph>
            Points: {selectedChallenge?.points}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Your commitment (optional)"
            placeholder="Write a short note about how you plan to achieve this challenge..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmJoin} variant="contained" color="primary">
            Start Challenge
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Challenges; 