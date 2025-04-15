import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { carbonOffsetAPI, CarbonOffset } from '../api';

const CarbonOffsetMarketplace: React.FC = () => {
  const [offsets, setOffsets] = useState<CarbonOffset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffset, setSelectedOffset] = useState<CarbonOffset | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchOffsets = async () => {
      try {
        const response = await carbonOffsetAPI.getAll();
        setOffsets(response.data);
      } catch (error) {
        console.error('Error fetching carbon offsets:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load carbon offsets',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOffsets();
  }, []);

  const handlePurchase = async () => {
    if (!selectedOffset) return;

    try {
      const response = await carbonOffsetAPI.purchase(selectedOffset._id, purchaseAmount);
      setSnackbar({
        open: true,
        message: response.data.message,
        severity: 'success',
      });
      setDialogOpen(false);
    } catch (error) {
      console.error('Error purchasing carbon offset:', error);
      setSnackbar({
        open: true,
        message: 'Failed to purchase carbon offset',
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
        Carbon Offset Marketplace
      </Typography>
      <Typography variant="body1" paragraph>
        Support verified carbon offset projects and neutralize your carbon footprint.
      </Typography>

      <Grid container spacing={3}>
        {offsets.map((offset) => (
          <Grid item xs={12} sm={6} md={4} key={offset._id}>
            <Card>
              {offset.images && offset.images[0] && (
                <CardMedia
                  component="img"
                  height="140"
                  image={offset.images[0]}
                  alt={offset.name}
                />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {offset.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {offset.description}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Provider: {offset.provider}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Location: {offset.location}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Price: ${offset.pricePerTon} per ton
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => {
                    setSelectedOffset(offset);
                    setDialogOpen(true);
                  }}
                >
                  Purchase
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Purchase Carbon Offset</DialogTitle>
        <DialogContent>
          {selectedOffset && (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedOffset.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {selectedOffset.description}
              </Typography>
              <TextField
                label="Amount (tons)"
                type="number"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(Number(e.target.value))}
                fullWidth
                margin="normal"
                inputProps={{ min: 1, max: selectedOffset.availableTons }}
              />
              <Typography variant="body1" gutterBottom>
                Total Cost: ${(selectedOffset.pricePerTon * purchaseAmount).toFixed(2)}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handlePurchase} variant="contained" color="primary">
            Confirm Purchase
          </Button>
        </DialogActions>
      </Dialog>

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

export default CarbonOffsetMarketplace; 