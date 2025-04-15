import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  LinearProgress,
  Card,
  CardContent,
  Alert,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  LocalFlorist,
  DirectionsCar,
  PhoneAndroid,
  Home,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import { getEquivalences } from '../utils/emissionFactors';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from 'recharts';

interface ResultCategory {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

interface CarbonResultsProps {
  totalEmissions: number;
  categoryBreakdown: {
    transportation: number;
    energy: number;
    food: number;
    shopping: number;
  };
  onCalculateAgain: () => void;
}

const CarbonResults: React.FC<CarbonResultsProps> = ({
  totalEmissions,
  categoryBreakdown,
  onCalculateAgain,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Convert to tons for certain displays
  const emissionsInTons = totalEmissions / 1000;
  
  // Get equivalences
  const equivalences = getEquivalences(totalEmissions);
  
  // Format breakdown as categories for visualization
  const categories: ResultCategory[] = [
    {
      name: 'Transportation',
      value: categoryBreakdown.transportation,
      color: '#4CAF50',
      percentage: (categoryBreakdown.transportation / totalEmissions) * 100,
    },
    {
      name: 'Home Energy',
      value: categoryBreakdown.energy,
      color: '#2196F3',
      percentage: (categoryBreakdown.energy / totalEmissions) * 100,
    },
    {
      name: 'Food',
      value: categoryBreakdown.food,
      color: '#FF9800',
      percentage: (categoryBreakdown.food / totalEmissions) * 100,
    },
    {
      name: 'Shopping',
      value: categoryBreakdown.shopping,
      color: '#9C27B0',
      percentage: (categoryBreakdown.shopping / totalEmissions) * 100,
    },
  ];
  
  // Global average for comparison (in tons)
  const globalAverageEmissions = 4.7; // tons CO2 per person per year
  const usAverageEmissions = 15.5; // tons CO2 per person per year
  
  // Data for comparison bar chart
  const comparisonData = [
    { name: 'Your Footprint', value: emissionsInTons, color: '#FF5722' },
    { name: 'Global Average', value: globalAverageEmissions, color: '#2196F3' },
    { name: 'US Average', value: usAverageEmissions, color: '#9C27B0' },
  ];
  
  // Determine where the user stands compared to averages
  const getUserStanding = () => {
    if (emissionsInTons < globalAverageEmissions * 0.5) {
      return {
        text: 'Your carbon footprint is significantly lower than the global average. Great job!',
        severity: 'success',
      };
    } else if (emissionsInTons < globalAverageEmissions) {
      return {
        text: 'Your carbon footprint is below the global average.',
        severity: 'success',
      };
    } else if (emissionsInTons < usAverageEmissions) {
      return {
        text: 'Your carbon footprint is above the global average but below the US average.',
        severity: 'warning',
      };
    } else {
      return {
        text: 'Your carbon footprint is above the US average. Consider areas where you can reduce emissions.',
        severity: 'error',
      };
    }
  };
  
  const standing = getUserStanding();
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card sx={{ p: 1, boxShadow: 2 }}>
          <Typography variant="body2" color="textPrimary">
            {payload[0].name}: {payload[0].value.toFixed(2)} {payload[0].unit || 'tons CO2e'}
          </Typography>
          {payload[0].percentage && (
            <Typography variant="body2" color="textSecondary">
              {payload[0].percentage.toFixed(1)}% of total
            </Typography>
          )}
        </Card>
      );
    }
    return null;
  };
  
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Your Carbon Footprint Results
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" color="primary" gutterBottom>
              {totalEmissions.toFixed(2)} kg CO2e
            </Typography>
            <Typography variant="subtitle1">
              ({emissionsInTons.toFixed(2)} tons) per year
            </Typography>
            <Alert severity={standing.severity as any} sx={{ mt: 2 }}>
              {standing.text}
            </Alert>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Relative to Average Emissions:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ minWidth: 100 }}>
                Global Avg:
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min((emissionsInTons / globalAverageEmissions) * 100, 100)}
                sx={{ flexGrow: 1, mx: 1, height: 8, borderRadius: 5 }}
              />
              <Typography variant="body2" sx={{ minWidth: 60 }}>
                {globalAverageEmissions} tons
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ minWidth: 100 }}>
                US Avg:
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min((emissionsInTons / usAverageEmissions) * 100, 100)}
                sx={{ flexGrow: 1, mx: 1, height: 8, borderRadius: 5 }}
              />
              <Typography variant="body2" sx={{ minWidth: 60 }}>
                {usAverageEmissions} tons
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Typography variant="h5" gutterBottom>
        Breakdown by Category
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            {/* Pie Chart for Category Breakdown */}
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={isMobile ? 80 : 100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percentage }) => `${name}: ${percentage.toFixed(0)}%`}
                >
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Grid>
          <Grid item xs={12} md={7}>
            {categories.map((category) => (
              <Box key={category.name} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: category.color,
                    mr: 1,
                  }}
                />
                <Typography variant="body1" sx={{ minWidth: 150 }}>
                  {category.name}:
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={category.percentage}
                  sx={{
                    flexGrow: 1,
                    mx: 1,
                    height: 10,
                    borderRadius: 5,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: category.color,
                    },
                  }}
                />
                <Typography variant="body2" sx={{ minWidth: 100 }}>
                  {category.value.toFixed(0)} kg ({category.percentage.toFixed(0)}%)
                </Typography>
              </Box>
            ))}
          </Grid>
        </Grid>
      </Paper>
      
      <Typography variant="h5" gutterBottom>
        How You Compare
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={comparisonData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Tons CO2e', angle: -90, position: 'insideLeft' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" name="Tons CO2e">
              {comparisonData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList dataKey="value" position="top" formatter={(value: number) => value.toFixed(1)} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Paper>
      
      <Typography variant="h5" gutterBottom>
        What Does This Mean?
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalFlorist color="success" sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h6">
                  {equivalences.trees.toFixed(1)} Trees
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Number of trees needed to absorb your annual carbon emissions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DirectionsCar color="error" sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h6">
                  {equivalences.milesDriven.toFixed(0)} Miles
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Equivalent to driving this many miles in an average car
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PhoneAndroid color="primary" sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h6">
                  {equivalences.phoneCharges.toFixed(0)} Charges
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Equivalent to this many smartphone charges
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Home color="warning" sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h6">
                  {equivalences.homeEnergyDays.toFixed(0)} Days
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Days of average home energy use
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={onCalculateAgain}
          size="large"
        >
          Calculate Again
        </Button>
      </Box>
    </Box>
  );
};

export default CarbonResults; 