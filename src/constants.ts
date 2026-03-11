import { GameState, Ingredient, MenuItem, StallType, Weather, Event, Rival } from './types';

export const INGREDIENTS: Record<Ingredient, { cost: number; batch: number }> = {
  'Tea Leaves': { cost: 50, batch: 50 },
  'Milk': { cost: 60, batch: 20 },
  'Sugar': { cost: 40, batch: 50 },
  'Spices': { cost: 100, batch: 30 },
  'Puri': { cost: 80, batch: 100 },
  'Potato': { cost: 30, batch: 20 },
  'Tamarind Water': { cost: 40, batch: 50 },
  'Pav': { cost: 50, batch: 40 },
  'Vada': { cost: 100, batch: 40 },
  'Chutney': { cost: 30, batch: 50 },
  'Batter': { cost: 120, batch: 30 },
  'Rice': { cost: 200, batch: 50 },
  'Chicken': { cost: 300, batch: 20 },
};

export const MENU: Record<MenuItem, { basePrice: number; recipe: Partial<Record<Ingredient, number>>; prepTime: number; reqStall: StallType; idealWeather: Weather[]; idealEvent: Event[] }> = {
  'Chai': { basePrice: 10, recipe: { 'Tea Leaves': 1, 'Milk': 1, 'Sugar': 1 }, prepTime: 2, reqStall: 'Chai Tapri', idealWeather: ['Rainy', 'Pleasant'], idealEvent: ['Monsoon'] },
  'Masala Chai': { basePrice: 15, recipe: { 'Tea Leaves': 1, 'Milk': 1, 'Sugar': 1, 'Spices': 1 }, prepTime: 3, reqStall: 'Chai Tapri', idealWeather: ['Rainy', 'Pleasant'], idealEvent: ['Monsoon'] },
  'Pani Puri': { basePrice: 30, recipe: { 'Puri': 6, 'Potato': 1, 'Tamarind Water': 1 }, prepTime: 5, reqStall: 'Pani Puri Cart', idealWeather: ['Sunny', 'Hot'], idealEvent: ['Local Fair'] },
  'Vada Pav': { basePrice: 20, recipe: { 'Pav': 1, 'Vada': 1, 'Chutney': 1 }, prepTime: 4, reqStall: 'Snack Stall', idealWeather: ['Rainy'], idealEvent: ['Cricket Match'] },
  'Dosa': { basePrice: 50, recipe: { 'Batter': 1, 'Potato': 1, 'Chutney': 1 }, prepTime: 8, reqStall: 'Dosa Camp', idealWeather: ['Sunny', 'Pleasant'], idealEvent: ['Diwali'] },
  'Biryani': { basePrice: 150, recipe: { 'Rice': 2, 'Chicken': 1, 'Spices': 2 }, prepTime: 15, reqStall: 'Biryani Handi', idealWeather: ['Pleasant', 'Rainy'], idealEvent: ['Diwali', 'Cricket Match'] }
};

export const STALLS: Record<StallType, { cost: number; unlockReq: number; desc: string }> = {
  'Chai Tapri': { cost: 0, unlockReq: 0, desc: 'A humble start.' },
  'Pani Puri Cart': { cost: 1000, unlockReq: 20, desc: 'Expand to street snacks.' },
  'Snack Stall': { cost: 3000, unlockReq: 40, desc: 'Serve hot Vada Pavs.' },
  'Dosa Camp': { cost: 8000, unlockReq: 60, desc: 'South Indian delicacies.' },
  'Biryani Handi': { cost: 20000, unlockReq: 80, desc: 'The ultimate feast.' },
  'Food Truck': { cost: 50000, unlockReq: 95, desc: 'A mobile food empire!' }
};

export const UPGRADES = [
  { id: 'marketing_1', name: 'Word of Mouth', cost: 500, desc: 'Increases customer flow slightly.', effect: 'cust_rate_1' },
  { id: 'quality_1', name: 'Better Ingredients', cost: 1000, desc: 'Boosts reputation gain per sale.', effect: 'rep_1' },
  { id: 'speed_1', name: 'Fast Hands', cost: 1500, desc: 'Customers wait longer before leaving.', effect: 'patience_1' },
  { id: 'marketing_2', name: 'Local Flyers', cost: 3000, desc: 'Increases customer flow moderately.', effect: 'cust_rate_2' },
  { id: 'auto_chai', name: 'Chotu (Helper)', cost: 5000, desc: 'Automatically sells Chai to waiting customers.', effect: 'auto_chai' },
];

export const INITIAL_RIVALS: Rival[] = [
  {
    id: 'rival_1',
    name: 'Sharma Ji Tapri',
    stallType: 'Chai Tapri',
    aggressiveness: 0.6,
    quality: 0.4,
    prices: { 'Chai': 9, 'Masala Chai': 14 },
    marketShare: 40
  }
];

export const INITIAL_STATE: GameState = {
  money: 200,
  day: 1,
  time: 8 * 60, // 8:00 AM
  weather: 'Sunny',
  currentEvent: 'None',
  inventory: {
    'Tea Leaves': 20,
    'Milk': 20,
    'Sugar': 20,
    'Spices': 0,
    'Puri': 0,
    'Potato': 0,
    'Tamarind Water': 0,
    'Pav': 0,
    'Vada': 0,
    'Chutney': 0,
    'Batter': 0,
    'Rice': 0,
    'Chicken': 0,
  },
  unlockedItems: ['Chai'],
  unlockedStalls: ['Chai Tapri'],
  currentStall: 'Chai Tapri',
  upgrades: [],
  reputation: 30,
  loyalty: 10,
  salesHistory: [],
  messages: ['Welcome to Street Vendor Tycoon! Set your prices and wait for customers.'],
  customPrices: {
    'Chai': 10,
    'Masala Chai': 15,
    'Pani Puri': 30,
    'Vada Pav': 20,
    'Dosa': 50,
    'Biryani': 150
  },
  rivals: INITIAL_RIVALS,
  customersWaiting: {
    'Chai': 0,
    'Masala Chai': 0,
    'Pani Puri': 0,
    'Vada Pav': 0,
    'Dosa': 0,
    'Biryani': 0
  },
  autoSuppliers: {},
  avatar: {
    color: 'blue',
    hat: 'ChefHat',
    accessory: 'None'
  }
};
