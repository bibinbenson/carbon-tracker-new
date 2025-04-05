import React from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  LinearProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import {
  EmojiEvents,
  LocalFlorist,
  DirectionsCar,
  Restaurant,
  Lightbulb,
  Star,
  Timeline,
  TrendingUp,
} from '@mui/icons-material';

// Mock user data (replace with actual data from backend later)
const userData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: '👨',
  level: 4,
  experience: 2300,
  nextLevelExp: 3000,
  joinDate: '2024-01-15',
  totalCarbonReduced: 1250,
  achievements: [
    {
      id: 1,
      title: 'Carbon Champion',
      description: 'Reduced carbon footprint by 1000kg',
      icon: <EmojiEvents color="primary" />,
      date: '2024-03-01',
    },
    {
      id: 2,
      title: 'Tree Hugger',
      description: 'Completed 10 eco-friendly challenges',
      icon: <LocalFlorist color="primary" />,
      date: '2024-02-15',
    },
    {
      id: 3,
      title: 'Green Commuter',
      description: 'Used public transport for 30 days',
      icon: <DirectionsCar color="primary" />,
      date: '2024-02-01',
    },
  ],
  stats: {
    transportation: { value: 450, unit: 'kg', change: -15 },
    energy: { value: 320, unit: 'kg', change: -8 },
    food: { value: 280, unit: 'kg', change: -12 },
    lifestyle: { value: 200, unit: 'kg', change: -5 },
  },
  recentActivities: [
    {
      id: 1,
      type: 'Transportation',
      description: 'Cycled to work',
      impact: -2.5,
      date: '2024-03-15',
    },
    {
      id: 2,
      type: 'Energy',
      description: 'Installed LED bulbs',
      impact: -1.8,
      date: '2024-03-14',
    },
    {
      id: 3,
      type: 'Food',
      description: 'Vegetarian meal',
      impact: -3.2,
      date: '2024-03-13',
    },
  ],
};

const Profile = () => {
  const progressToNextLevel = 
    ((userData.experience - 0) / (userData.nextLevelExp - 0)) * 100;

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        {/* User Info Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                fontSize: '4rem',
                margin: '0 auto 1rem',
              }}
            >
              {userData.avatar}
            </Avatar>
            <Typography variant="h5" gutterBottom>
              {userData.name}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              {userData.email}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Level {userData.level}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progressToNextLevel}
                sx={{ height: 8, borderRadius: 4, my: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                {userData.experience} / {userData.nextLevelExp} XP
              </Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Chip
                icon={<Timeline />}
                label={`Member since ${new Date(userData.joinDate).toLocaleDateString()}`}
                variant="outlined"
                sx={{ mt: 1 }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {Object.entries(userData.stats).map(([category, data]) => (
              <Grid item xs={12} sm={6} key={category}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {category === 'transportation' && <DirectionsCar color="primary" />}
                      {category === 'energy' && <Lightbulb color="primary" />}
                      {category === 'food' && <Restaurant color="primary" />}
                      {category === 'lifestyle' && <Star color="primary" />}
                      <Typography
                        variant="h6"
                        sx={{ ml: 1, textTransform: 'capitalize' }}
                      >
                        {category}
                      </Typography>
                    </Box>
                    <Typography variant="h4" gutterBottom>
                      {data.value} {data.unit}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingUp
                        color={data.change < 0 ? 'success' : 'error'}
                        sx={{ mr: 0.5 }}
                      />
                      <Typography
                        variant="body2"
                        color={data.change < 0 ? 'success.main' : 'error.main'}
                      >
                        {Math.abs(data.change)}% this month
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Achievements */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Achievements
            </Typography>
            <List>
              {userData.achievements.map((achievement) => (
                <React.Fragment key={achievement.id}>
                  <ListItem>
                    <ListItemIcon>{achievement.icon}</ListItemIcon>
                    <ListItemText
                      primary={achievement.title}
                      secondary={
                        <>
                          {achievement.description}
                          <br />
                          <Typography variant="caption" color="text.secondary">
                            Earned on {new Date(achievement.date).toLocaleDateString()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <List>
              {userData.recentActivities.map((activity) => (
                <React.Fragment key={activity.id}>
                  <ListItem>
                    <ListItemText
                      primary={activity.description}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {activity.type}
                          </Typography>
                          {' — '}
                          {new Date(activity.date).toLocaleDateString()}
                        </>
                      }
                    />
                    <Chip
                      label={`${activity.impact} kg CO2`}
                      color="success"
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile; 