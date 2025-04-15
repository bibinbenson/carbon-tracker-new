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
  Alert,
} from '@mui/material';

const CalculatorWithoutResults = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [carMileage, setCarMileage] = useState(10000);

  const handleCalculate = async () => {
    setLoading(true);
    
    // Simple calculation
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
    const calculatedResult = carMileage * 0.35; // Simple formula
    
    setResult(calculatedResult);
    setLoading(false);
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Simple Carbon Calculator
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Calculating...
            </Typography>
          </Box>
        ) : result !== null ? (
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <Alert severity="success" sx={{ mb: 2 }}>
              Calculation completed!
            </Alert>
            <Typography variant="h5" gutterBottom>
              Your Carbon Footprint: {result.toFixed(2)} kg CO2e
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleReset}
              sx={{ mt: 2 }}
            >
              Calculate Again
            </Button>
          </Box>
        ) : (
          <>
            <Typography variant="subtitle1" paragraph align="center">
              This is a simplified calculator that only uses car mileage.
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Annual Car Mileage (miles)"
                  type="number"
                  value={carMileage}
                  onChange={(e) => setCarMileage(Number(e.target.value))}
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

export default CalculatorWithoutResults; 