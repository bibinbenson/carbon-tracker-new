import React from 'react';
import { Container, Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TestPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Test Page
        </Typography>
        <Typography variant="body1" paragraph>
          This is a test page to verify routing and rendering are working correctly.
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/carbon-calculator')}
          sx={{ mr: 2 }}
        >
          Go to Carbon Calculator
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/')}
        >
          Go to Dashboard
        </Button>
      </Paper>
    </Container>
  );
};

export default TestPage; 