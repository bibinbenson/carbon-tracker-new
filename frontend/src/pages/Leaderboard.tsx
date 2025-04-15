import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  Chip,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import {
  EmojiEvents as EmojiEventsIcon,
  TrendingUp as TrendingUpIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';

interface User {
  id: number;
  name: string;
  avatar: string;
  ecoScore: number;
  level: number;
  carbonReduced: number;
  activitiesCompleted: number;
  challengesCompleted: number;
  rank: number;
}

// Mock data - replace with actual API calls
const mockUsers: User[] = [
  {
    id: 1,
    name: 'Sarah Green',
    avatar: 'SG',
    ecoScore: 1250,
    level: 12,
    carbonReduced: 2500,
    activitiesCompleted: 85,
    challengesCompleted: 25,
    rank: 1,
  },
  {
    id: 2,
    name: 'John Eco',
    avatar: 'JE',
    ecoScore: 1150,
    level: 11,
    carbonReduced: 2200,
    activitiesCompleted: 75,
    challengesCompleted: 22,
    rank: 2,
  },
  {
    id: 3,
    name: 'Emma Sustainable',
    avatar: 'ES',
    ecoScore: 1050,
    level: 10,
    carbonReduced: 2000,
    activitiesCompleted: 70,
    challengesCompleted: 20,
    rank: 3,
  },
  {
    id: 4,
    name: 'Michael Green',
    avatar: 'MG',
    ecoScore: 950,
    level: 9,
    carbonReduced: 1800,
    activitiesCompleted: 65,
    challengesCompleted: 18,
    rank: 4,
  },
  {
    id: 5,
    name: 'Lisa Eco',
    avatar: 'LE',
    ecoScore: 850,
    level: 8,
    carbonReduced: 1600,
    activitiesCompleted: 60,
    challengesCompleted: 15,
    rank: 5,
  },
];

const Leaderboard = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tabValue, setTabValue] = useState(0);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return '#FFD700'; // Gold
      case 2:
        return '#C0C0C0'; // Silver
      case 3:
        return '#CD7F32'; // Bronze
      default:
        return 'inherit';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Leaderboard
        </Typography>
        <Typography color="text.secondary">
          See how you stack up against other eco-warriors
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Rank
              </Typography>
              <Typography variant="h3" color="primary">
                #6
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Keep going! You're close to the top 5
              </Typography>
              <LinearProgress
                variant="determinate"
                value={80}
                sx={{ mt: 2, height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Points to Next Rank
              </Typography>
              <Typography variant="h3" color="primary">
                150
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complete more activities to move up
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Weekly Progress
              </Typography>
              <Typography variant="h3" color="success.main">
                +2
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Moved up 2 positions this week
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="All Time" />
          <Tab label="This Month" />
          <Tab label="This Week" />
        </Tabs>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>User</TableCell>
                <TableCell align="right">Eco Score</TableCell>
                <TableCell align="right">Level</TableCell>
                <TableCell align="right">Carbon Reduced</TableCell>
                <TableCell align="right">Activities</TableCell>
                <TableCell align="right">Challenges</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Chip
                        icon={<EmojiEventsIcon />}
                        label={`#${user.rank}`}
                        sx={{
                          backgroundColor: getRankColor(user.rank),
                          color: user.rank <= 3 ? 'white' : 'inherit',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2 }}>{user.avatar}</Avatar>
                        <Typography>{user.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <TrendingUpIcon sx={{ mr: 1, color: 'success.main' }} />
                        {user.ecoScore}
                      </Box>
                    </TableCell>
                    <TableCell align="right">{user.level}</TableCell>
                    <TableCell align="right">{user.carbonReduced}kg</TableCell>
                    <TableCell align="right">{user.activitiesCompleted}</TableCell>
                    <TableCell align="right">{user.challengesCompleted}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={mockUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default Leaderboard; 