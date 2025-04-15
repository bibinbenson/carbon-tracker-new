import api from './apiClient';

/**
 * Save a carbon calculation to the backend
 */
export const saveCalculation = async (data: {
  totalEmissions: number;
  breakdown: {
    transportation: number;
    energy: number;
    food: number;
    shopping: number;
  };
  inputs: {
    // Transportation
    carMileage: number;
    carType: string;
    publicTransport: number;
    flights: number;
    // Energy
    electricity: number;
    naturalGas: number;
    heatingOil: number;
    // Food
    meatConsumption: string;
    dairyConsumption: string;
    localFood: string;
    // Shopping
    clothing: number;
    electronics: number;
    otherShopping: number;
  };
  notes?: string;
}) => {
  const response = await api.post('/calculations', data);
  return response.data;
};

/**
 * Get all user's carbon calculations
 */
export const getCalculations = async () => {
  const response = await api.get('/calculations');
  return response.data.calculations;
};

/**
 * Get a specific carbon calculation
 */
export const getCalculation = async (id: string) => {
  const response = await api.get(`/calculations/${id}`);
  return response.data.calculation;
};

/**
 * Delete a carbon calculation
 */
export const deleteCalculation = async (id: string) => {
  const response = await api.delete(`/calculations/${id}`);
  return response.data;
}; 