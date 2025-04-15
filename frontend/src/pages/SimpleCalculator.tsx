import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const SimpleCalculator: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Simple Calculator
        </Typography>
        <Typography variant="body1" paragraph>
          This is a simplified version of the carbon calculator with no dependencies.
        </Typography>
        <Typography variant="body1" paragraph>
          If you can see this, the basic rendering is working correctly.
        </Typography>
      </Paper>
    </Container>
  );
};

export default SimpleCalculator; 