import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { green } from '@mui/material/colors';
import AppLayout from './components/Layout/AppLayout';
import Dashboard from './pages/Dashboard';
import AddActivity from './pages/AddActivity';
import Challenges from './pages/Challenges';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import CarbonCalculator from './pages/CarbonCalculator';
import CarbonOffsetMarketplace from './pages/CarbonOffsetMarketplace';
import Subscription from './pages/Subscription';
import AutoOffset from './pages/AutoOffset';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import TestPage from './pages/TestPage';
import SimpleCalculator from './pages/SimpleCalculator';
import CalculatorWithoutResults from './pages/CalculatorWithoutResults';
import SimpleFullCalculator from './pages/SimpleFullCalculator';
import { Container, Paper, Typography } from '@mui/material';

// Import Roboto font
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Create theme
const theme = createTheme({
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  palette: {
    primary: {
      main: green[600],
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            {/* Test routes */}
            <Route path="/test" element={<TestPage />} />
            <Route path="/simple-calculator" element={<SimpleCalculator />} />
            <Route path="/calculator-no-results" element={<CalculatorWithoutResults />} />
            <Route path="/simple-full-calculator" element={<SimpleFullCalculator />} />
            
            {/* Try direct route with updated calculator */}
            <Route path="/updated-calculator" element={<CarbonCalculator />} />
            
            {/* Direct route to calculator for testing */}
            <Route path="/calculator-test" element={<CarbonCalculator />} />
            
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Public routes with layout */}
            <Route path="/carbon-calculator" element={
              <AppLayout>
                <CarbonCalculator />
              </AppLayout>
            } />
            
            {/* Protected routes */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <AppLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="add-activity" element={<AddActivity />} />
              <Route path="challenges" element={<Challenges />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="carbon-offset" element={<CarbonOffsetMarketplace />} />
              <Route path="subscription" element={<Subscription />} />
              <Route path="auto-offset" element={<AutoOffset />} />
            </Route>
            
            {/* Add this right after the other test routes */}
            <Route 
              path="/inline-calculator" 
              element={
                <Container maxWidth="md" sx={{ mt: 4 }}>
                  <Paper sx={{ p: 4 }}>
                    <Typography variant="h4" gutterBottom>
                      Inline Carbon Calculator
                    </Typography>
                    <Typography variant="body1">
                      This is a very basic version of the calculator.
                    </Typography>
                  </Paper>
                </Container>
              } 
            />
            
            {/* Redirect to dashboard for unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App; 