import axios from 'axios';

interface CarbonOffset {
  _id: string;
  name: string;
  description: string;
  provider: string;
  projectType: string;
  location: string;
  pricePerTon: number;
  availableTons: number;
  certification: string;
  images: string[];
}

interface Subscription {
  plan: 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  autoOffset: {
    enabled: boolean;
    monthlyAmount: number;
  };
  features: {
    apiAccess: boolean;
    premiumOffsets: boolean;
    certification: boolean;
    teamChallenges: boolean;
  };
}

interface User {
  _id: string;
  name: string;
  email: string;
  autoOffset: {
    enabled: boolean;
    monthlyAmount: number;
  };
  // Add any other necessary user properties here
}

const api = axios.create({
  baseURL: 'http://localhost:5003/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const carbonOffsetAPI = {
  getAll: () => api.get<CarbonOffset[]>('/carbon-offsets'),
  getById: (id: string) => api.get<CarbonOffset>(`/carbon-offsets/${id}`),
  purchase: (id: string, amount: number) =>
    api.post(`/carbon-offsets/${id}/purchase`, { amount }),
};

export const subscriptionAPI = {
  getCurrent: () => api.get<Subscription>('/subscriptions/current'),
  updatePlan: (plan: string) => api.put('/subscriptions/plan', { plan }),
  updateAutoOffset: (enabled: boolean, monthlyAmount: number) =>
    api.put('/subscriptions/auto-offset', { enabled, monthlyAmount }),
  cancel: () => api.post('/subscriptions/cancel'),
};

export const userAPI = {
  getCurrent: () => api.get<User>('/users/me'),
  updateProfile: (data: Partial<User>) => api.put('/users/profile', data),
  updateAutoOffset: (enabled: boolean, monthlyAmount: number) =>
    api.put('/users/auto-offset', { enabled, monthlyAmount }),
};

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (email: string, password: string, name: string) =>
    api.post('/auth/register', { email, password, name }),
  logout: () => api.post('/auth/logout'),
}; 