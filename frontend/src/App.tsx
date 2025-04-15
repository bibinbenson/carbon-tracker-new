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

// Placeholder components for auth (to be implemented later)
const Login = () => <div>Login Page</div>;
const Register = () => <div>Register Page</div>;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="add-activity" element={<AddActivity />} />
            <Route path="challenges" element={<Challenges />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="calculator" element={<CarbonCalculator />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App; 