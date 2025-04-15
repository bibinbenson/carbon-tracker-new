import React, { useState, useEffect } from 'react';
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
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  EmojiEvents as EmojiEventsIcon,
  LocalActivity as ActivityIcon,
  TrendingUp as TrendingUpIcon,
  Spa as EcoIcon,
  DirectionsCar as CarIcon,
  LocalDining as FoodIcon,
  Home as HomeIcon,
  ShoppingBag as ShoppingIcon,
  Edit as EditIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Person,
  Timeline,
  LocationOn,
  Email,
  CalendarToday,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { userAPI, activityAPI, achievementAPI, User, Activity, Achievement, Statistics } from '../services/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Profile = () => {
  const [tabValue, setTabValue] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all([
          userAPI.getProfile(),
          activityAPI.getRecent(10),
          achievementAPI.getAll(),
          userAPI.getStatistics(),
        ]);

        const [userResponse, activitiesResponse, achievementsResponse, statisticsResponse] = responses;
        
        const userData = userResponse.data;
        const activitiesData = activitiesResponse.data;
        const achievementsData = achievementsResponse.data;
        const statisticsData = statisticsResponse.data;

        setUser(userData);
        setActivities(activitiesData);
        setAchievements(achievementsData);
        setStatistics(statisticsData);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        // Set mock data when API fails
        setUser({
          id: '1',
          name: 'Demo User',
          email: 'demo@example.com',
          location: 'San Francisco, CA',
          preferences: {
            theme: 'light',
            notifications: true,
            weeklyGoal: 100
          },
          level: 5,
          ecoScore: 2500,
          carbonFootprint: 1200,
          carbonReduced: 800,
          activitiesCompleted: 45,
          challengesCompleted: 12,
          joinedDate: new Date('2024-01-01')
        });
        
        setActivities([
          {
            id: '1',
            userId: '1',
            category: 'Transportation',
            subcategory: 'Electric Vehicle',
            amount: 100,
            unit: 'km',
            carbonFootprint: 0,
            date: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]);
        
        setAchievements([
          {
            id: '1',
            userId: '1',
            title: 'Early Adopter',
            description: 'Joined EcoTrack and started tracking carbon footprint',
            category: 'General',
            points: 100,
            earnedDate: new Date(),
            icon: 'eco',
            completed: true
          }
        ]);
        
        setStatistics({
          totalCarbonFootprint: 1200,
          categoryBreakdown: {
            Transportation: 35,
            Energy: 25,
            Food: 20,
            Shopping: 20
          },
          categoryData: [
            { name: 'Transportation', value: 35, color: '#8884d8' },
            { name: 'Energy', value: 25, color: '#82ca9d' },
            { name: 'Food', value: 20, color: '#ffc658' },
            { name: 'Shopping', value: 20, color: '#ff7300' }
          ],
          monthlyData: [
            { month: 'Jan', carbonFootprint: 1200, ecoScore: 650 },
            { month: 'Feb', carbonFootprint: 1100, ecoScore: 700 },
            { month: 'Mar', carbonFootprint: 950, ecoScore: 750 },
            { month: 'Apr', carbonFootprint: 850, ecoScore: 800 }
          ],
          weeklyActivities: [
            { date: '2024-04-08', activities: 5, carbonFootprint: 250 },
            { date: '2024-04-15', activities: 7, carbonFootprint: 200 }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditClick = () => {
    setEditForm(user || {});
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    if (user) {
      try {
        const updatedUser = await userAPI.updateProfile(editForm);
        setUser(updatedUser);
        setEditDialogOpen(false);
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleDownloadReport = () => {
    const report = {
      user,
      activities,
      achievements,
      statistics,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'eco-tracker-report.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calculate progress
  const progressToNextLevel = user ? (user.ecoScore / (user.level * 1000)) * 100 : 0;

  // Use statistics data if available, otherwise fallback to mock data
  const chartData = {
    categoryData: statistics?.categoryData || [
      { name: 'Transportation', value: 35, color: '#8884d8' },
      { name: 'Energy', value: 25, color: '#82ca9d' },
      { name: 'Food', value: 20, color: '#ffc658' },
      { name: 'Shopping', value: 20, color: '#ff7300' }
    ],
    monthlyData: statistics?.monthlyData || [
      { month: 'Jan', carbonFootprint: 1200, ecoScore: 650 },
      { month: 'Feb', carbonFootprint: 1100, ecoScore: 700 },
      { month: 'Mar', carbonFootprint: 950, ecoScore: 750 },
      { month: 'Apr', carbonFootprint: 850, ecoScore: 800 }
    ]
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Typography>Error loading profile data</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        {/* User Info Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar
                sx={{ width: 120, height: 120, mb: 2 }}
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
              />
              <Typography variant="h5" gutterBottom>
                {user.name}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                Level {user.level}
              </Typography>
              <Box sx={{ width: '100%', mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={progressToNextLevel}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption" color="textSecondary">
                  {Math.round(progressToNextLevel)}% to Level {user.level + 1}
                </Typography>
              </Box>
              <List sx={{ width: '100%', mt: 2 }}>
                <ListItem>
                  <ListItemIcon>
                    <Email />
                  </ListItemIcon>
                  <ListItemText primary={user.email} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationOn />
                  </ListItemIcon>
                  <ListItemText primary={user.location || 'Location not set'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Joined ${new Date(user.joinedDate).toLocaleDateString()}`}
                  />
                </ListItem>
              </List>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEditClick}
                >
                  Edit Profile
                </Button>
                <IconButton onClick={handleShareProfile}>
                  <Tooltip title="Share Profile">
                    <ShareIcon />
                  </Tooltip>
                </IconButton>
                <IconButton onClick={handleDownloadReport}>
                  <Tooltip title="Download Report">
                    <DownloadIcon />
                  </Tooltip>
                </IconButton>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Stats and Charts */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Overview" />
                <Tab label="Statistics" />
                <Tab label="Achievements" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Activities Completed
                      </Typography>
                      <Typography variant="h4">{user.activitiesCompleted}</Typography>
                      <ActivityIcon color="primary" />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Challenges Completed
                      </Typography>
                      <Typography variant="h4">{user.challengesCompleted}</Typography>
                      <EmojiEventsIcon color="primary" />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Carbon Reduced (kg)
                      </Typography>
                      <Typography variant="h4">{user.carbonReduced}</Typography>
                      <EcoIcon color="primary" />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Eco Score
                      </Typography>
                      <Typography variant="h4">{user.ecoScore}</Typography>
                      <TrendingUpIcon color="primary" />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Activities
                </Typography>
                <List>
                  {activities.map((activity) => (
                    <ListItem key={activity.id}>
                      <ListItemIcon>
                        {activity.category === 'Transportation' && <CarIcon />}
                        {activity.category === 'Food' && <FoodIcon />}
                        {activity.category === 'Energy' && <HomeIcon />}
                        {activity.category === 'Shopping' && <ShoppingIcon />}
                      </ListItemIcon>
                      <ListItemText
                        primary={`${activity.category} - ${activity.subcategory}`}
                        secondary={`${activity.amount} ${activity.unit} • ${new Date(
                          activity.date
                        ).toLocaleDateString()}`}
                      />
                      <Chip
                        label={`${activity.carbonFootprint} kg CO2`}
                        color="primary"
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Carbon Footprint by Category
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData.categoryData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {chartData.categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Monthly Progress
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="carbonFootprint"
                        stroke="#8884d8"
                        name="Carbon Footprint"
                      />
                      <Line
                        type="monotone"
                        dataKey="ecoScore"
                        stroke="#82ca9d"
                        name="Eco Score"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={2}>
                {achievements.map((achievement) => (
                  <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                    <Card>
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={1}>
                          <EmojiEventsIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="h6">{achievement.title}</Typography>
                        </Box>
                        <Typography variant="body2" color="textSecondary" paragraph>
                          {achievement.description}
                        </Typography>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Chip
                            label={achievement.completed ? 'Completed' : 'In Progress'}
                            color={achievement.completed ? 'success' : 'default'}
                            size="small"
                          />
                          <Typography variant="caption" color="textSecondary">
                            {achievement.points} points
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={editForm.name || ''}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Location"
              value={editForm.location || ''}
              onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Weekly Goal (kg CO2)"
              type="number"
              value={editForm.preferences?.weeklyGoal || ''}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  preferences: { ...editForm.preferences, weeklyGoal: Number(e.target.value) },
                })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;