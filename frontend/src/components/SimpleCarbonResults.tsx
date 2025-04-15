import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
} from '@mui/material';

interface SimpleCarbonResultsProps {
  totalEmissions: number;
  categoryBreakdown: {
    transportation: number;
    energy: number;
    food: number;
    shopping: number;
  };
  onCalculateAgain: () => void;
}

const SimpleCarbonResults: React.FC<SimpleCarbonResultsProps> = ({
  totalEmissions,
  categoryBreakdown,
  onCalculateAgain,
}) => {
  // Convert to tons for certain displays
  const emissionsInTons = totalEmissions / 1000;
  
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Your Carbon Footprint Results
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" color="primary" gutterBottom>
          {totalEmissions.toFixed(2)} kg CO2e
        </Typography>
        <Typography variant="subtitle1">
          ({emissionsInTons.toFixed(2)} tons) per year
        </Typography>
        <Alert severity="info" sx={{ mt: 2 }}>
          This is a simplified results page without charts.
        </Alert>
      </Paper>
      
      <Typography variant="h5" gutterBottom>
        Breakdown by Category
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="body1">
          Transportation: {categoryBreakdown.transportation.toFixed(2)} kg CO2e
        </Typography>
        <Typography variant="body1">
          Home Energy: {categoryBreakdown.energy.toFixed(2)} kg CO2e
        </Typography>
        <Typography variant="body1">
          Food: {categoryBreakdown.food.toFixed(2)} kg CO2e
        </Typography>
        <Typography variant="body1">
          Shopping: {categoryBreakdown.shopping.toFixed(2)} kg CO2e
        </Typography>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={onCalculateAgain}
          size="large"
        >
          Calculate Again
        </Button>
      </Box>
    </Box>
  );
};

export default SimpleCarbonResults; 