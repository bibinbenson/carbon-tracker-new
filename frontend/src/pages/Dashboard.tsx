import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Alert,
} from '@mui/material';
import {
  LocalFlorist,
  DirectionsCar,
  Lightbulb,
  RestaurantMenu,
  BarChart,
  Delete,
  Calculate,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getCalculations, deleteCalculation } from '../api/calculationService';
import { AuthContext } from '../contexts/AuthContext';
import { format } from 'date-fns';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [calculations, setCalculations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's carbon calculations
  useEffect(() => {
    const fetchCalculations = async () => {
      if (!isAuthenticated) return;

      setLoading(true);
      setError(null);
      try {
        const calculations = await getCalculations();
        setCalculations(calculations);
      } catch (error) {
        console.error('Error fetching calculations:', error);
        setError('Failed to load your carbon calculations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCalculations();
  }, [isAuthenticated]);

  // Handle deletion of a calculation
  const handleDelete = async (id: string) => {
    try {
      await deleteCalculation(id);
      setCalculations(calculations.filter(calc => calc._id !== id));
    } catch (error) {
      console.error('Error deleting calculation:', error);
      setError('Failed to delete calculation. Please try again.');
    }
  };

  // Get the latest calculation for stats display
  const latestCalculation = calculations.length > 0 ? calculations[0] : null;

  // Calculate total carbon reduction (difference between first and latest calculation)
  const calculateReduction = () => {
    if (calculations.length < 2) return 0;
    const firstCalculation = calculations[calculations.length - 1];
    return firstCalculation.totalEmissions - latestCalculation.totalEmissions;
  };

  // Stats for display (use real data if available)
  const stats = latestCalculation
    ? [
        {
          title: 'Total Carbon Footprint',
          value: `${(latestCalculation.totalEmissions / 1000).toFixed(2)} tons CO2e`,
          progress: 65, // Would calculate based on goals
          icon: <LocalFlorist color="primary" />,
        },
        {
          title: 'Transportation',
          value: `${(latestCalculation.breakdown.transportation / 1000).toFixed(2)} tons CO2e`,
          progress: 40,
          icon: <DirectionsCar color="primary" />,
        },
        {
          title: 'Energy Usage',
          value: `${(latestCalculation.breakdown.energy / 1000).toFixed(2)} tons CO2e`,
          progress: 75,
          icon: <Lightbulb color="primary" />,
        },
        {
          title: 'Food & Diet',
          value: `${(latestCalculation.breakdown.food / 1000).toFixed(2)} tons CO2e`,
          progress: 25,
          icon: <RestaurantMenu color="primary" />,
        },
      ]
    : [
        {
          title: 'Total Carbon Footprint',
          value: 'No data yet',
          progress: 0,
          icon: <LocalFlorist color="primary" />,
        },
        {
          title: 'Transportation',
          value: 'Calculate now',
          progress: 0,
          icon: <DirectionsCar color="primary" />,
        },
        {
          title: 'Energy Usage',
          value: 'Calculate now',
          progress: 0,
          icon: <Lightbulb color="primary" />,
        },
        {
          title: 'Food & Diet',
          value: 'Calculate now',
          progress: 0,
          icon: <RestaurantMenu color="primary" />,
        },
      ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {isAuthenticated ? `Welcome back, ${user?.name || 'User'}!` : 'Welcome to EcoTrack AI'}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Track and reduce your carbon footprint with AI-powered insights
      </Typography>

      {!isAuthenticated && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body1">
            Sign in to save and track your carbon footprint over time.
          </Typography>
        </Alert>
      )}

      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {stat.icon}
                  <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                    {stat.title}
                  </Typography>
                </Box>
                <Typography variant="h6" component="div" gutterBottom>
                  {stat.value}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress variant="determinate" value={stat.progress} />
                  </Box>
                  <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">{`${Math.round(
                      stat.progress,
                    )}%`}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Your Carbon Calculations
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<Calculate />}
                onClick={() => navigate('/carbon-calculator')}
              >
                New Calculation
              </Button>
            </Box>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : calculations.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary" paragraph>
                  You haven't performed any carbon calculations yet.
                </Typography>
                <Button 
                  variant="outlined" 
                  startIcon={<Calculate />}
                  onClick={() => navigate('/carbon-calculator')}
                >
                  Calculate Your Footprint
                </Button>
              </Box>
            ) : (
              <List>
                {calculations.map((calc, index) => (
                  <React.Fragment key={calc._id}>
                    <ListItem>
                      <ListItemText
                        primary={`${(calc.totalEmissions / 1000).toFixed(2)} tons CO2e`}
                        secondary={format(new Date(calc.date), 'PPP')}
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" onClick={() => handleDelete(calc._id)}>
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < calculations.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              AI Eco-Tips
            </Typography>
            <Typography paragraph color="text.secondary">
              • Consider using public transportation more frequently
            </Typography>
            <Typography paragraph color="text.secondary">
              • Switch to LED bulbs to reduce energy consumption
            </Typography>
            <Typography paragraph color="text.secondary">
              • Try incorporating more plant-based meals into your diet
            </Typography>
            <Typography paragraph color="text.secondary">
              • Use reusable bags and containers to reduce plastic waste
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 