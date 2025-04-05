import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import {
  LocalFlorist,
  DirectionsCar,
  Lightbulb,
  RestaurantMenu,
} from '@mui/icons-material';

const Dashboard = () => {
  // Mock data - replace with real data later
  const stats = [
    {
      title: 'Total Carbon Footprint',
      value: '2.5 tons CO2e',
      progress: 65,
      icon: <LocalFlorist color="primary" />,
    },
    {
      title: 'Transportation',
      value: '0.8 tons CO2e',
      progress: 40,
      icon: <DirectionsCar color="primary" />,
    },
    {
      title: 'Energy Usage',
      value: '1.2 tons CO2e',
      progress: 75,
      icon: <Lightbulb color="primary" />,
    },
    {
      title: 'Food & Diet',
      value: '0.5 tons CO2e',
      progress: 25,
      icon: <RestaurantMenu color="primary" />,
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome to EcoTrack AI
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Track and reduce your carbon footprint with AI-powered insights
      </Typography>

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
                <Typography variant="h4" component="div" gutterBottom>
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
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            {/* Add activity list or chart here */}
            <Typography color="text.secondary">
              Your recent carbon-impacting activities will appear here
            </Typography>
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
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 