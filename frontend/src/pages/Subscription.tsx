import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { subscriptionAPI } from '../api';

interface Subscription {
  plan: 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  autoOffset: {
    enabled: boolean;
    monthlyAmount: number;
  };
  features: {
    apiAccess: boolean;
    premiumOffsets: boolean;
    certification: boolean;
    teamChallenges: boolean;
  };
}

const plans = [
  {
    name: 'Basic',
    price: 0,
    features: [
      'Basic carbon tracking',
      'Standard offset marketplace',
      'Community challenges',
    ],
  },
  {
    name: 'Premium',
    price: 9.99,
    features: [
      'Advanced carbon tracking',
      'Premium offset marketplace',
      'API access',
      'Detailed analytics',
    ],
  },
  {
    name: 'Enterprise',
    price: 49.99,
    features: [
      'Everything in Premium',
      'Team challenges',
      'Carbon neutral certification',
      'Priority support',
    ],
  },
];

const Subscription: React.FC = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoOffsetAmount, setAutoOffsetAmount] = useState(0);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await subscriptionAPI.get();
        setSubscription(response.data);
        setAutoOffsetAmount(response.data?.autoOffset?.monthlyAmount || 0);
      } catch (error) {
        console.error('Error fetching subscription:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load subscription details',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const handlePlanChange = async (plan: string) => {
    try {
      const response = await subscriptionAPI.update({
        plan,
        paymentMethod: {
          type: 'card',
          last4: '4242',
          expiry: '12/25',
        },
      });
      setSubscription(response.data);
      setSnackbar({
        open: true,
        message: 'Subscription updated successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update subscription',
        severity: 'error',
      });
    }
  };

  const handleAutoOffsetChange = async (enabled: boolean) => {
    try {
      const response = await subscriptionAPI.updateAutoOffset({
        enabled,
        monthlyAmount: autoOffsetAmount,
      });
      setSubscription(response.data);
      setSnackbar({
        open: true,
        message: 'Auto-offset settings updated successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error updating auto-offset settings:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update auto-offset settings',
        severity: 'error',
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Subscription Management
      </Typography>

      <Grid container spacing={3}>
        {plans.map((plan) => (
          <Grid item xs={12} md={4} key={plan.name}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {plan.name}
                </Typography>
                <Typography variant="h4" gutterBottom>
                  ${plan.price}/month
                </Typography>
                <Box mb={2}>
                  {plan.features.map((feature) => (
                    <Typography key={feature} variant="body2" gutterBottom>
                      ✓ {feature}
                    </Typography>
                  ))}
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={subscription?.plan === plan.name.toLowerCase()}
                  onClick={() => handlePlanChange(plan.name.toLowerCase())}
                >
                  {subscription?.plan === plan.name.toLowerCase()
                    ? 'Current Plan'
                    : 'Switch to Plan'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Auto-Offset Settings
        </Typography>
        <Card>
          <CardContent>
            <FormControlLabel
              control={
                <Switch
                  checked={subscription?.autoOffset?.enabled || false}
                  onChange={(e) => handleAutoOffsetChange(e.target.checked)}
                />
              }
              label="Enable Automatic Carbon Offsetting"
            />
            {subscription?.autoOffset?.enabled && (
              <TextField
                label="Monthly Offset Amount ($)"
                type="number"
                value={autoOffsetAmount}
                onChange={(e) => setAutoOffsetAmount(Number(e.target.value))}
                fullWidth
                margin="normal"
              />
            )}
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Subscription; 