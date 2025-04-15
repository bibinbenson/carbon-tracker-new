import axios, { AxiosInstance } from 'axios';

// Interfaces
export interface User {
  id: string;
  email: string;
  name: string;
  location?: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    weeklyGoal: number;
  };
  level: number;
  ecoScore: number;
  carbonFootprint: number;
  carbonReduced: number;
  activitiesCompleted: number;
  challengesCompleted: number;
  joinedDate: Date;
}

export interface Activity {
  id: string;
  userId: string;
  category: string;
  subcategory: string;
  amount: number;
  unit: string;
  carbonFootprint: number;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Achievement {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  points: number;
  earnedDate: Date;
  icon: string;
  completed: boolean;
  progress?: number;
}

export interface Statistics {
  totalCarbonFootprint: number;
  categoryBreakdown: {
    [key: string]: number;
  };
  categoryData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  monthlyData: Array<{
    month: string;
    carbonFootprint: number;
    ecoScore: number;
  }>;
  weeklyActivities: Array<{
    date: string;
    activities: number;
    carbonFootprint: number;
  }>;
}

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User API
export const userAPI = {
  getProfile: () => api.get<User>('/users/profile'),
  updateProfile: (data: Partial<User>) => api.put<User>('/users/profile', data),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/users/password', { currentPassword, newPassword }),
  getStatistics: () => api.get<Statistics>('/users/statistics'),
};

// Activity API
export const activityAPI = {
  getRecent: (limit: number = 10) =>
    api.get<Activity[]>(`/activities/recent?limit=${limit}`),
  getAll: (page: number = 1, limit: number = 20) =>
    api.get<{ activities: Activity[]; total: number }>(`/activities?page=${page}&limit=${limit}`),
  create: (data: Omit<Activity, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) =>
    api.post<Activity>('/activities', data),
  update: (id: string, data: Partial<Activity>) =>
    api.put<Activity>(`/activities/${id}`, data),
  delete: (id: string) => api.delete(`/activities/${id}`),
  getStatistics: (timeframe: 'week' | 'month' | 'year') =>
    api.get<Statistics>(`/activities/statistics?timeframe=${timeframe}`),
};

// Achievement API
export const achievementAPI = {
  getAll: () => api.get<Achievement[]>('/achievements'),
  getById: (id: string) => api.get<Achievement>(`/achievements/${id}`),
  updateProgress: (id: string, progress: number) =>
    api.put<Achievement>(`/achievements/${id}/progress`, { progress }),
};

export default api; 