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
} from '@mui/icons-material';
import CarbonResults from '../components/CarbonResults';

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

// Define step names as constants for clarity
const STEP_TRANSPORTATION = 0;
const STEP_HOME_ENERGY = 1;
const STEP_FOOD = 2;
const STEP_SHOPPING = 3;

const stepLabels = ['Transportation', 'Home Energy', 'Food', 'Shopping'];

// Simple calculation functions to replace the imported ones
const calculateTransportationEmissions = (data: any): number => {
  // Simplified calculation
  return data.carMileage * 0.4 + data.publicTransport * 0.2 + data.flights * 50;
};

const calculateEnergyEmissions = (data: any): number => {
  // Simplified calculation
  return data.electricity * 0.5 + data.naturalGas * 5 + data.heatingOil * 10;
};

const calculateFoodEmissions = (data: any): number => {
  // Simplified calculation
  const meatFactors: Record<string, number> = {
    none: 0,
    low: 300,
    medium: 1200,
    high: 2500,
  };
  
  const dairyFactors: Record<string, number> = {
    none: 0,
    low: 200,
    medium: 400,
    high: 600,
  };
  
  const localFoodFactors: Record<string, number> = {
    none: 400,
    low: 300,
    medium: 200,
    high: 100,
  };
  
  return (
    meatFactors[data.meatConsumption] +
    dairyFactors[data.dairyConsumption] +
    localFoodFactors[data.localFood]
  );
};

const calculateShoppingEmissions = (data: any): number => {
  // Simplified calculation
  return data.clothing * 0.5 + data.electronics * 0.7 + data.otherShopping * 0.4;
};

const CarbonCalculator = () => {
  console.log("CarbonCalculator component is rendering");
  
  const [activeStep, setActiveStep] = useState(STEP_TRANSPORTATION);
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [categoryBreakdown, setCategoryBreakdown] = useState<{
    transportation: number;
    energy: number;
    food: number;
    shopping: number;
  }>({
    transportation: 0,
    energy: 0,
    food: 0,
    shopping: 0,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      carMileage: 10000,
      carType: 'medium',
      publicTransport: 1000,
      flights: 10,
      electricity: 500,
      naturalGas: 50,
      heatingOil: 0,
      meatConsumption: 'medium',
      dairyConsumption: 'medium',
      localFood: 'low',
      clothing: 1000,
      electronics: 1000,
      otherShopping: 2000,
    }
  });

  const handleNext = async () => {
    // Validate the current step before proceeding
    let fieldsToValidate: string[] = [];
    
    switch (activeStep) {
      case STEP_TRANSPORTATION:
        fieldsToValidate = ['carMileage', 'carType', 'publicTransport', 'flights'];
        break;
      case STEP_HOME_ENERGY:
        fieldsToValidate = ['electricity', 'naturalGas', 'heatingOil'];
        break;
      case STEP_FOOD:
        fieldsToValidate = ['meatConsumption', 'dairyConsumption', 'localFood'];
        break;
      // No need to validate shopping step here as it will submit the form
    }
    
    const isStepValid = await trigger(fieldsToValidate as any);
    if (isStepValid) {
      // Log the transition for debugging
      console.log(`Moving from step ${activeStep} to ${activeStep + 1}`);
      setActiveStep(activeStep + 1);
    } else {
      console.log(`Validation failed for step ${activeStep}`);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const onSubmit = async (data: any) => {
    console.log("Form submitted with data:", data);
    setLoading(true);
    setIsCalculating(true);
    
    try {
      // Calculate emissions for each category
      const transportation = calculateTransportationEmissions(data);
      const energy = calculateEnergyEmissions(data);
      const food = calculateFoodEmissions(data);
      const shopping = calculateShoppingEmissions(data);
      
      // Set the breakdown
      const breakdownData = {
        transportation,
        energy,
        food,
        shopping,
      };
      
      setCategoryBreakdown(breakdownData);
      
      // Calculate total emissions
      const total = transportation + energy + food + shopping;
      
      // Add small delay for UX
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      setResult(total);
    } catch (error) {
      console.error('Error during calculation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateAgain = () => {
    setResult(null);
    setActiveStep(STEP_TRANSPORTATION);
    setIsCalculating(false);
    reset();
  };

  const renderTransportationStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>
          Transportation is often the largest source of an individual's carbon footprint. Let's calculate yours.
        </Typography>
      </Grid>
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

  const renderHomeEnergyStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>
          Home energy use is a significant source of carbon emissions. Enter your monthly usage.
        </Typography>
      </Grid>
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

  const renderFoodStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>
          Diet choices have a significant impact on your carbon footprint.
        </Typography>
      </Grid>
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

  const renderShoppingStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>
          Consumer goods also contribute to your carbon footprint. Estimate your yearly spending.
        </Typography>
      </Grid>
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

  const renderStepContent = (step: number) => {
    console.log(`Rendering content for step: ${step}`);
    
    switch (step) {
      case STEP_TRANSPORTATION:
        return renderTransportationStep();
      case STEP_HOME_ENERGY:
        return renderHomeEnergyStep();
      case STEP_FOOD:
        return renderFoodStep();
      case STEP_SHOPPING:
        return renderShoppingStep();
      default:
        console.error(`Unknown step: ${step}`);
        return null;
    }
  };

  // Add console log to track render cycles
  console.log(`Current active step: ${activeStep}`);

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Calculating your carbon footprint...
            </Typography>
          </Box>
        ) : result !== null ? (
          <CarbonResults 
            totalEmissions={result} 
            categoryBreakdown={categoryBreakdown} 
            onCalculateAgain={handleCalculateAgain} 
          />
        ) : (
          <>
            <Typography variant="h4" gutterBottom align="center">
              Carbon Footprint Calculator
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" paragraph align="center">
              Calculate your carbon footprint by answering a few questions about your lifestyle
            </Typography>

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {stepLabels.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <form onSubmit={(e) => e.preventDefault()} noValidate>
              {renderStepContent(activeStep)}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  disabled={activeStep === STEP_TRANSPORTATION}
                  onClick={handleBack}
                  variant="outlined"
                  type="button"
                >
                  Back
                </Button>
                
                {activeStep === STEP_SHOPPING ? (
                  <Button
                    variant="contained"
                    color="primary"
                    type="button"
                    disabled={isCalculating}
                    onClick={handleSubmit(onSubmit)}
                  >
                    Calculate
                  </Button>
                ) : activeStep === STEP_FOOD ? (
                  // Special button just for Food to Shopping transition
                  <Button
                    variant="contained"
                    color="primary"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log("Direct navigation to Shopping tab");
                      setActiveStep(STEP_SHOPPING);
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    type="button"
                  >
                    Next
                  </Button>
                )}
              </Box>
            </form>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default CarbonCalculator; 