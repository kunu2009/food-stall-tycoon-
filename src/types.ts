export type Ingredient = 'Tea Leaves' | 'Milk' | 'Sugar' | 'Spices' | 'Puri' | 'Potato' | 'Tamarind Water' | 'Pav' | 'Vada' | 'Chutney' | 'Batter' | 'Rice' | 'Chicken';

export type MenuItem = 'Chai' | 'Masala Chai' | 'Pani Puri' | 'Vada Pav' | 'Dosa' | 'Biryani';

export type StallType = 'Chai Tapri' | 'Pani Puri Cart' | 'Snack Stall' | 'Dosa Camp' | 'Biryani Handi' | 'Food Truck';

export type Weather = 'Sunny' | 'Rainy' | 'Hot' | 'Pleasant';

export type Event = 'None' | 'Diwali' | 'Cricket Match' | 'Monsoon' | 'Local Fair';

export interface Rival {
  id: string;
  name: string;
  stallType: StallType;
  aggressiveness: number; // 0 to 1, how likely they are to undercut
  quality: number; // 0 to 1
  prices: Partial<Record<MenuItem, number>>;
  marketShare: number; // percentage of customers they take
}

export interface AvatarConfig {
  color: string;
  hat: string;
  accessory: string;
}

export interface GameState {
  money: number;
  day: number;
  time: number; // in minutes from 00:00
  weather: Weather;
  currentEvent: Event;
  inventory: Record<Ingredient, number>;
  unlockedItems: MenuItem[];
  unlockedStalls: StallType[];
  currentStall: StallType;
  upgrades: string[];
  reputation: number; // 0 to 100
  loyalty: number; // 0 to 100
  salesHistory: { day: number; profit: number }[];
  messages: string[];
  customPrices: Record<MenuItem, number>;
  rivals: Rival[];
  customersWaiting: Record<MenuItem, number>;
  autoSuppliers: Partial<Record<Ingredient, number>>;
  avatar: AvatarConfig;
}

