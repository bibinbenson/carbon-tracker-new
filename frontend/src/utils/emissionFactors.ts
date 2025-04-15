/**
 * Carbon Emission Factors
 * 
 * These values are based on real-world data from sources like:
 * - EPA (Environmental Protection Agency)
 * - IPCC (Intergovernmental Panel on Climate Change)
 * - EIA (Energy Information Administration)
 */

// Transportation Emission Factors (kg CO2e per mile)
export const transportationFactors = {
  car: {
    small: 0.29, // Small car (e.g., Toyota Prius)
    medium: 0.39, // Medium car (e.g., Honda Accord)
    large: 0.57, // SUV or large vehicle
    electric: 0.1, // Electric vehicle (includes emissions from electricity generation)
  },
  publicTransport: 0.16, // Bus, train, etc. (average)
  flight: 53, // kg CO2e per hour of flight
};

// Home Energy Emission Factors
export const energyFactors = {
  electricity: 0.42, // kg CO2e per kWh (US average)
  naturalGas: 5.3, // kg CO2e per therm
  heatingOil: 10.16, // kg CO2e per gallon
};

// Food Emission Factors (kg CO2e per year)
export const foodFactors = {
  meat: {
    none: 0, // Vegan
    low: 300, // Vegetarian with occasional meat
    medium: 1200, // Average meat consumer
    high: 2500, // High meat consumer
  },
  dairy: {
    none: 0,
    low: 200,
    medium: 400,
    high: 600,
  },
  localFood: {
    none: 400, // No local food
    low: 300, // Some local food
    medium: 200, // Moderate local food
    high: 100, // Mostly local food
  },
};

// Shopping Emission Factors (kg CO2e per dollar)
export const shoppingFactors = {
  clothing: 0.5,
  electronics: 0.7,
  other: 0.4,
};

// Carbon Equivalence for visualization
export const carbonEquivalences = {
  treesPerTon: 16.5, // Number of trees needed to absorb 1 ton of CO2 per year
  milesDriven: 2.5, // Miles driven equivalent to 1 kg CO2
  phoneCharges: 33, // Number of smartphone charges equivalent to 1 kg CO2
  homeEnergyDays: 0.23, // Days of home energy use equivalent to 1 kg CO2
};

/**
 * Calculate carbon footprint from transportation inputs
 */
export const calculateTransportationEmissions = (data: {
  carMileage: number;
  carType: string;
  publicTransport: number;
  flights: number;
}): number => {
  const { carMileage, carType, publicTransport, flights } = data;
  
  // Calculate car emissions
  const carEmissions = 
    carMileage * 
    (transportationFactors.car[carType as keyof typeof transportationFactors.car] || 
    transportationFactors.car.medium);
  
  // Calculate public transport emissions
  const publicTransportEmissions = publicTransport * transportationFactors.publicTransport;
  
  // Calculate flight emissions
  const flightEmissions = flights * transportationFactors.flight;
  
  return carEmissions + publicTransportEmissions + flightEmissions;
};

/**
 * Calculate carbon footprint from home energy inputs
 */
export const calculateEnergyEmissions = (data: {
  electricity: number;
  naturalGas: number;
  heatingOil: number;
}): number => {
  const { electricity, naturalGas, heatingOil } = data;
  
  // Calculate energy emissions (monthly values * 12 for annual total)
  const electricityEmissions = electricity * energyFactors.electricity * 12;
  const naturalGasEmissions = naturalGas * energyFactors.naturalGas * 12;
  const heatingOilEmissions = heatingOil * energyFactors.heatingOil * 12;
  
  return electricityEmissions + naturalGasEmissions + heatingOilEmissions;
};

/**
 * Calculate carbon footprint from food consumption
 */
export const calculateFoodEmissions = (data: {
  meatConsumption: string;
  dairyConsumption: string;
  localFood: string;
}): number => {
  const { meatConsumption, dairyConsumption, localFood } = data;
  
  // Calculate food emissions
  const meatEmissions = 
    foodFactors.meat[meatConsumption as keyof typeof foodFactors.meat] || 
    foodFactors.meat.medium;
  
  const dairyEmissions = 
    foodFactors.dairy[dairyConsumption as keyof typeof foodFactors.dairy] || 
    foodFactors.dairy.medium;
  
  const localFoodImpact = 
    foodFactors.localFood[localFood as keyof typeof foodFactors.localFood] || 
    foodFactors.localFood.medium;
  
  return meatEmissions + dairyEmissions + localFoodImpact;
};

/**
 * Calculate carbon footprint from shopping habits
 */
export const calculateShoppingEmissions = (data: {
  clothing: number;
  electronics: number;
  otherShopping: number;
}): number => {
  const { clothing, electronics, otherShopping } = data;
  
  // Calculate shopping emissions
  const clothingEmissions = clothing * shoppingFactors.clothing;
  const electronicsEmissions = electronics * shoppingFactors.electronics;
  const otherEmissions = otherShopping * shoppingFactors.other;
  
  return clothingEmissions + electronicsEmissions + otherEmissions;
};

/**
 * Calculate total carbon footprint
 */
export const calculateTotalEmissions = (data: any): number => {
  const transportEmissions = calculateTransportationEmissions(data);
  const energyEmissions = calculateEnergyEmissions(data);
  const foodEmissions = calculateFoodEmissions(data);
  const shoppingEmissions = calculateShoppingEmissions(data);
  
  return transportEmissions + energyEmissions + foodEmissions + shoppingEmissions;
};

/**
 * Get equivalences for a given amount of CO2
 */
export const getEquivalences = (kgCO2: number) => {
  return {
    trees: (kgCO2 / 1000) * carbonEquivalences.treesPerTon,
    milesDriven: kgCO2 * carbonEquivalences.milesDriven,
    phoneCharges: kgCO2 * carbonEquivalences.phoneCharges,
    homeEnergyDays: kgCO2 * carbonEquivalences.homeEnergyDays,
  };
}; 