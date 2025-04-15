import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { userAPI } from '../api';

const AutoOffset: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [autoOffset, setAutoOffset] = useState({
    enabled: false,
    monthlyAmount: 0,
  });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const response = await userAPI.getCurrent();
        setAutoOffset({
          enabled: response.data.autoOffset?.enabled || false,
          monthlyAmount: response.data.autoOffset?.monthlyAmount || 0,
        });
      } catch (error) {
        console.error('Error fetching user settings:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load settings',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserSettings();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      await userAPI.updateAutoOffset(autoOffset.enabled, autoOffset.monthlyAmount);
      setSnackbar({
        open: true,
        message: 'Settings saved successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save settings',
        severity: 'error',
      });
    } finally {
      setLoading(false);
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
        Automatic Carbon Offsetting
      </Typography>
      <Typography variant="body1" paragraph>
        Set up automatic monthly carbon offset purchases to maintain a carbon-neutral lifestyle.
      </Typography>

      <Card>
        <CardContent>
          <FormControlLabel
            control={
              <Switch
                checked={autoOffset.enabled}
                onChange={(e) => setAutoOffset({ ...autoOffset, enabled: e.target.checked })}
              />
            }
            label="Enable Automatic Carbon Offsetting"
          />

          {autoOffset.enabled && (
            <Box mt={2}>
              <TextField
                label="Monthly Offset Amount ($)"
                type="number"
                value={autoOffset.monthlyAmount}
                onChange={(e) =>
                  setAutoOffset({ ...autoOffset, monthlyAmount: Number(e.target.value) })
                }
                fullWidth
                margin="normal"
                helperText="We'll automatically purchase carbon offsets for this amount each month"
              />
            </Box>
          )}

          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={autoOffset.enabled && autoOffset.monthlyAmount <= 0}
            >
              Save Settings
            </Button>
          </Box>
        </CardContent>
      </Card>

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

export default AutoOffset; 