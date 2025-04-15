import axios from 'axios';

const API_URL = 'http://localhost:5003/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface CarbonOffset {
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

export interface PurchaseResponse {
  success: boolean;
  message: string;
  transactionId: string;
}

export const carbonOffsetAPI = {
  getAll: () => api.get<CarbonOffset[]>('/carbon-offsets'),
  getById: (id: string) => api.get<CarbonOffset>(`/carbon-offsets/${id}`),
  purchase: (id: string, amount: number) =>
    api.post<PurchaseResponse>(`/carbon-offsets/${id}/purchase`, { amount }),
};

export const subscriptionAPI = {
  get: () => api.get('/subscriptions'),
  update: (data: any) => api.post('/subscriptions', data),
  cancel: () => api.post('/subscriptions/cancel'),
  updateAutoOffset: (data: { enabled: boolean; monthlyAmount: number }) =>
    api.put('/subscriptions/auto-offset', data),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  updateAutoOffset: (data: { enabled: boolean; monthlyAmount: number }) =>
    api.put('/users/auto-offset', data),
}; 