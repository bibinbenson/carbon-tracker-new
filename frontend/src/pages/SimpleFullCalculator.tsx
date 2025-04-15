import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  CircularProgress,
} from '@mui/material';
import SimpleCarbonResults from '../components/SimpleCarbonResults';

const SimpleFullCalculator = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState({
    transportation: 0,
    energy: 0,
    food: 0,
    shopping: 0,
  });
  const [carMileage, setCarMileage] = useState(10000);
  const [electricity, setElectricity] = useState(500);
  const [food, setFood] = useState(1000);
  const [shopping, setShopping] = useState(2000);

  const handleCalculate = async () => {
    setLoading(true);
    
    // Simple calculations
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
    
    const transportation = carMileage * 0.35;
    const energy = electricity * 0.5;
    const foodEmissions = food * 0.25;
    const shoppingEmissions = shopping * 0.15;
    
    const breakdown = {
      transportation,
      energy,
      food: foodEmissions,
      shopping: shoppingEmissions,
    };
    
    setCategoryBreakdown(breakdown);
    const totalEmissions = transportation + energy + foodEmissions + shoppingEmissions;
    setResult(totalEmissions);
    setLoading(false);
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Simple Full Carbon Calculator
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Calculating...
            </Typography>
          </Box>
        ) : result !== null ? (
          <SimpleCarbonResults
            totalEmissions={result}
            categoryBreakdown={categoryBreakdown}
            onCalculateAgain={handleReset}
          />
        ) : (
          <>
            <Typography variant="subtitle1" paragraph align="center">
              This is a simplified calculator that calculates carbon footprint from 4 inputs.
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Annual Car Mileage (miles)"
                  type="number"
                  value={carMileage}
                  onChange={(e) => setCarMileage(Number(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Monthly Electricity (kWh)"
                  type="number"
                  value={electricity}
                  onChange={(e) => setElectricity(Number(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Food Spending ($/month)"
                  type="number"
                  value={food}
                  onChange={(e) => setFood(Number(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Shopping ($/year)"
                  type="number"
                  value={shopping}
                  onChange={(e) => setShopping(Number(e.target.value))}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCalculate}
                size="large"
              >
                Calculate
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default SimpleFullCalculator; 