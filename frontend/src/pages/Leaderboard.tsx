import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Tab,
  Tabs,
  LinearProgress,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { EmojiEvents, LocalFlorist, Whatshot } from '@mui/icons-material';

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  points: number;
  carbonReduction: number;
  badges: string[];
  level: number;
  progress: number;
}

const mockData: LeaderboardEntry[] = [
  {
    rank: 1,
    name: 'Sarah Green',
    avatar: '👩',
    points: 2500,
    carbonReduction: 1200,
    badges: ['Carbon Master', 'Challenge Champion'],
    level: 5,
    progress: 75,
  },
  {
    rank: 2,
    name: 'John Earth',
    avatar: '👨',
    points: 2300,
    carbonReduction: 1100,
    badges: ['Eco Warrior'],
    level: 4,
    progress: 90,
  },
  {
    rank: 3,
    name: 'Emma Sky',
    avatar: '👩',
    points: 2100,
    carbonReduction: 950,
    badges: ['Tree Planter'],
    level: 4,
    progress: 60,
  },
  {
    rank: 4,
    name: 'Mike Ocean',
    avatar: '👨',
    points: 1900,
    carbonReduction: 800,
    badges: ['Energy Saver'],
    level: 3,
    progress: 85,
  },
  {
    rank: 5,
    name: 'Lisa Sun',
    avatar: '👩',
    points: 1800,
    carbonReduction: 750,
    badges: ['Recycling Pro'],
    level: 3,
    progress: 45,
  },
];

const userStats = {
  rank: 12,
  totalUsers: 156,
  points: 1200,
  carbonReduction: 500,
  level: 2,
  progress: 65,
  nextLevel: 3,
  pointsToNextLevel: 300,
};

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
      id={`leaderboard-tabpanel-${index}`}
      aria-labelledby={`leaderboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Leaderboard = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Leaderboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        See how you rank against other eco-warriors
      </Typography>

      {/* User Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmojiEvents color="primary" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Your Rank
                </Typography>
              </Box>
              <Typography variant="h3" gutterBottom>
                #{userStats.rank}
              </Typography>
              <Typography color="text.secondary">
                Out of {userStats.totalUsers} users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Whatshot color="primary" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Level {userStats.level}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={userStats.progress}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Typography color="text.secondary">
                {userStats.pointsToNextLevel} points to Level {userStats.nextLevel}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalFlorist color="primary" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Impact
                </Typography>
              </Box>
              <Typography variant="h4" gutterBottom>
                {userStats.carbonReduction} kg
              </Typography>
              <Typography color="text.secondary">CO2 reduced</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Leaderboard Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Global Rankings" />
          <Tab label="Monthly" />
          <Tab label="Weekly" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell align="right">Points</TableCell>
                  <TableCell align="right">CO2 Reduced</TableCell>
                  <TableCell>Badges</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockData.map((entry) => (
                  <TableRow
                    key={entry.rank}
                    sx={{
                      backgroundColor:
                        entry.rank === userStats.rank ? 'action.selected' : 'inherit',
                    }}
                  >
                    <TableCell>
                      <Typography
                        variant="h6"
                        color={entry.rank <= 3 ? 'primary' : 'inherit'}
                      >
                        #{entry.rank}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2 }}>{entry.avatar}</Avatar>
                        <Box>
                          <Typography>{entry.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Level {entry.level}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6">{entry.points}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      {entry.carbonReduction} kg
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {entry.badges.map((badge) => (
                          <Chip
                            key={badge}
                            label={badge}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography color="text.secondary" align="center">
            Monthly rankings will be available at the end of the month
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography color="text.secondary" align="center">
            Weekly rankings will be available at the end of the week
          </Typography>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default Leaderboard; 