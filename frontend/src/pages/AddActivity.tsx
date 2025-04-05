import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
} from '@mui/material';
import { DirectionsCar, Lightbulb, RestaurantMenu, LocalFlorist } from '@mui/icons-material';

interface ActivityCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  subcategories: {
    id: string;
    name: string;
    unit: string;
    conversionFactor: number;
  }[];
}

const categories: ActivityCategory[] = [
  {
    id: 'transportation',
    name: 'Transportation',
    icon: <DirectionsCar />,
    subcategories: [
      { id: 'car', name: 'Car Travel', unit: 'km', conversionFactor: 0.2 },
      { id: 'bus', name: 'Bus Travel', unit: 'km', conversionFactor: 0.1 },
      { id: 'train', name: 'Train Travel', unit: 'km', conversionFactor: 0.05 },
      { id: 'plane', name: 'Air Travel', unit: 'km', conversionFactor: 0.3 },
    ],
  },
  {
    id: 'energy',
    name: 'Energy Usage',
    icon: <Lightbulb />,
    subcategories: [
      { id: 'electricity', name: 'Electricity', unit: 'kWh', conversionFactor: 0.5 },
      { id: 'gas', name: 'Natural Gas', unit: 'm³', conversionFactor: 2.1 },
      { id: 'heating', name: 'Heating Oil', unit: 'L', conversionFactor: 2.7 },
    ],
  },
  {
    id: 'food',
    name: 'Food & Diet',
    icon: <RestaurantMenu />,
    subcategories: [
      { id: 'meat', name: 'Meat Consumption', unit: 'kg', conversionFactor: 13.3 },
      { id: 'dairy', name: 'Dairy Products', unit: 'kg', conversionFactor: 3.2 },
      { id: 'vegetables', name: 'Vegetables', unit: 'kg', conversionFactor: 0.4 },
    ],
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    icon: <LocalFlorist />,
    subcategories: [
      { id: 'waste', name: 'Waste Generation', unit: 'kg', conversionFactor: 0.5 },
      { id: 'water', name: 'Water Usage', unit: 'L', conversionFactor: 0.001 },
      { id: 'recycling', name: 'Recycling', unit: 'kg', conversionFactor: -0.5 },
    ],
  },
];

const AddActivity = () => {
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const selectedCategory = categories.find((c) => c.id === category);
  const selectedSubcategory = selectedCategory?.subcategories.find((s) => s.id === subcategory);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !subcategory || !amount || !date) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Calculate carbon footprint
      const carbonFootprint = Number(amount) * (selectedSubcategory?.conversionFactor || 0);

      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
      setCategory('');
      setSubcategory('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
    } catch (err) {
      setError('Failed to add activity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Add Activity
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Log your daily activities to track their carbon footprint impact
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  label="Category"
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSubcategory('');
                  }}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {cat.icon}
                        <Typography sx={{ ml: 1 }}>{cat.name}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth disabled={!category}>
                <InputLabel>Subcategory</InputLabel>
                <Select
                  value={subcategory}
                  label="Subcategory"
                  onChange={(e) => setSubcategory(e.target.value)}
                >
                  {selectedCategory?.subcategories.map((sub) => (
                    <MenuItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={!subcategory}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {selectedSubcategory?.unit || ''}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Adding Activity...' : 'Add Activity'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success">
          Activity added successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddActivity; 