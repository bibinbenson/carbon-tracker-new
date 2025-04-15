import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  DirectionsCar,
  Home,
  Restaurant,
  ShoppingBag,
  Flight,
  LocalShipping,
} from '@mui/icons-material';

// Form validation schema
const schema = yup.object().shape({
  // Transportation
  carMileage: yup.number().min(0).required(),
  carType: yup.string().required(),
  publicTransport: yup.number().min(0).required(),
  flights: yup.number().min(0).required(),
  
  // Home Energy
  electricity: yup.number().min(0).required(),
  naturalGas: yup.number().min(0).required(),
  heatingOil: yup.number().min(0).required(),
  
  // Food
  meatConsumption: yup.string().required(),
  dairyConsumption: yup.string().required(),
  localFood: yup.string().required(),
  
  // Shopping
  clothing: yup.number().min(0).required(),
  electronics: yup.number().min(0).required(),
  otherShopping: yup.number().min(0).required(),
});

const steps = ['Transportation', 'Home Energy', 'Food', 'Shopping'];

const CarbonCalculator = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    // Simulate calculation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Mock calculation (replace with actual calculation logic)
    const total = Object.values(data).reduce((acc: number, val: any) => {
      if (typeof val === 'number') return acc + val;
      return acc;
    }, 0);
    
    setResult(total);
    setLoading(false);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Annual Car Mileage (miles)"
                type="number"
                {...register('carMileage')}
                error={!!errors.carMileage}
                helperText={errors.carMileage?.message}
                InputProps={{
                  startAdornment: <DirectionsCar color="action" sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.carType}>
                <InputLabel>Car Type</InputLabel>
                <Select {...register('carType')} label="Car Type">
                  <MenuItem value="small">Small (e.g., Toyota Prius)</MenuItem>
                  <MenuItem value="medium">Medium (e.g., Honda Accord)</MenuItem>
                  <MenuItem value="large">Large (e.g., SUV)</MenuItem>
                  <MenuItem value="electric">Electric Vehicle</MenuItem>
                </Select>
                {errors.carType && (
                  <FormHelperText>{errors.carType.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Public Transport Usage (miles/year)"
                type="number"
                {...register('publicTransport')}
                error={!!errors.publicTransport}
                helperText={errors.publicTransport?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Flights (hours/year)"
                type="number"
                {...register('flights')}
                error={!!errors.flights}
                helperText={errors.flights?.message}
                InputProps={{
                  startAdornment: <Flight color="action" sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Electricity Usage (kWh/month)"
                type="number"
                {...register('electricity')}
                error={!!errors.electricity}
                helperText={errors.electricity?.message}
                InputProps={{
                  startAdornment: <Home color="action" sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Natural Gas Usage (therms/month)"
                type="number"
                {...register('naturalGas')}
                error={!!errors.naturalGas}
                helperText={errors.naturalGas?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Heating Oil Usage (gallons/month)"
                type="number"
                {...register('heatingOil')}
                error={!!errors.heatingOil}
                helperText={errors.heatingOil?.message}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.meatConsumption}>
                <InputLabel>Meat Consumption</InputLabel>
                <Select {...register('meatConsumption')} label="Meat Consumption">
                  <MenuItem value="none">None (Vegan)</MenuItem>
                  <MenuItem value="low">Low (Vegetarian)</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
                {errors.meatConsumption && (
                  <FormHelperText>{errors.meatConsumption.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.dairyConsumption}>
                <InputLabel>Dairy Consumption</InputLabel>
                <Select {...register('dairyConsumption')} label="Dairy Consumption">
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
                {errors.dairyConsumption && (
                  <FormHelperText>{errors.dairyConsumption.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.localFood}>
                <InputLabel>Local Food Consumption</InputLabel>
                <Select {...register('localFood')} label="Local Food Consumption">
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
                {errors.localFood && (
                  <FormHelperText>{errors.localFood.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Clothing Purchases ($/year)"
                type="number"
                {...register('clothing')}
                error={!!errors.clothing}
                helperText={errors.clothing?.message}
                InputProps={{
                  startAdornment: <ShoppingBag color="action" sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Electronics Purchases ($/year)"
                type="number"
                {...register('electronics')}
                error={!!errors.electronics}
                helperText={errors.electronics?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Other Shopping ($/year)"
                type="number"
                {...register('otherShopping')}
                error={!!errors.otherShopping}
                helperText={errors.otherShopping?.message}
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Carbon Footprint Calculator
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph align="center">
          Calculate your carbon footprint by answering a few questions about your lifestyle
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : result !== null ? (
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <Typography variant="h5" gutterBottom>
              Your Carbon Footprint
            </Typography>
            <Typography variant="h3" color="primary" gutterBottom>
              {result.toFixed(2)} kg CO2/year
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              This is an estimate based on your inputs. For more accurate results,
              consider using a professional carbon footprint calculator.
            </Alert>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setResult(null);
                setActiveStep(0);
              }}
              sx={{ mt: 2 }}
            >
              Calculate Again
            </Button>
          </Box>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStepContent(activeStep)}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Calculate
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </Box>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default CarbonCalculator; 