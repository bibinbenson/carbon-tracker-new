import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  IconButton,
  InputAdornment,
  Snackbar,
  SelectChangeEvent,
} from '@mui/material';
import {
  Notifications,
  Language,
  ColorLens,
  Security,
  Visibility,
  VisibilityOff,
  Delete,
} from '@mui/icons-material';

const Settings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    darkMode: false,
    language: 'en',
    measurementUnit: 'metric',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleSettingChange = (setting: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [setting]: event.target.checked });
  };

  const handleSelectChange = (setting: string) => (event: SelectChangeEvent) => {
    setSettings({ ...settings, [setting]: event.target.value });
  };

  const handleTextChange = (setting: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [setting]: event.target.value });
  };

  const handleSave = () => {
    // TODO: Implement API call to save settings
    setSnackbar({
      open: true,
      message: 'Settings saved successfully',
      severity: 'success',
    });
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion logic
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setSnackbar({
        open: true,
        message: 'Account deletion request sent',
        severity: 'success',
      });
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Notifications sx={{ mr: 1 }} />
              <Typography variant="h6">Notifications</Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications}
                  onChange={handleSettingChange('notifications')}
                />
              }
              label="Enable notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailUpdates}
                  onChange={handleSettingChange('emailUpdates')}
                />
              }
              label="Email updates"
            />
          </Paper>
        </Grid>

        {/* Display Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Language sx={{ mr: 1 }} />
              <Typography variant="h6">Display & Language</Typography>
            </Box>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Language</InputLabel>
              <Select
                value={settings.language}
                onChange={handleSelectChange('language')}
                label="Language"
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
                <MenuItem value="de">German</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Measurement Unit</InputLabel>
              <Select
                value={settings.measurementUnit}
                onChange={handleSelectChange('measurementUnit')}
                label="Measurement Unit"
              >
                <MenuItem value="metric">Metric (kg, km)</MenuItem>
                <MenuItem value="imperial">Imperial (lbs, miles)</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.darkMode}
                  onChange={handleSettingChange('darkMode')}
                />
              }
              label="Dark Mode"
            />
          </Paper>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Security sx={{ mr: 1 }} />
              <Typography variant="h6">Security</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type={showPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={settings.currentPassword}
                  onChange={handleTextChange('currentPassword')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePasswordVisibility}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={settings.newPassword}
                  onChange={handleTextChange('newPassword')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={settings.confirmPassword}
                  onChange={handleTextChange('confirmPassword')}
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleSave}
            >
              Update Password
            </Button>
          </Paper>
        </Grid>

        {/* Account Deletion */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Delete sx={{ mr: 1, color: 'error.main' }} />
              <Typography variant="h6" color="error">
                Delete Account
              </Typography>
            </Box>
            <Typography color="text.secondary" paragraph>
              Once you delete your account, there is no going back. Please be certain.
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </Paper>
        </Grid>
      </Grid>

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
    </Container>
  );
};

export default Settings; 