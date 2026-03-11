import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Ingredient, MenuItem, StallType, Weather, Event, Rival } from '../types';
import { INITIAL_STATE, INGREDIENTS, MENU, STALLS, UPGRADES } from '../constants';

export function useGameLoop() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('streetVendorTycoon');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...INITIAL_STATE,
        ...parsed,
        avatar: parsed.avatar || INITIAL_STATE.avatar
      };
    }
    return INITIAL_STATE;
  });

  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    localStorage.setItem('streetVendorTycoon', JSON.stringify(gameState));
  }, [gameState]);

  const addMessage = (msg: string) => {
    setGameState(prev => ({
      ...prev,
      messages: [msg, ...prev.messages].slice(0, 5)
    }));
  };

  const setPrice = (item: MenuItem, price: number) => {
    if (price < 1) return;
    setGameState(prev => ({
      ...prev,
      customPrices: {
        ...prev.customPrices,
        [item]: price
      }
    }));
  };

  const buyIngredient = (ingredient: Ingredient, amount: number) => {
    const cost = INGREDIENTS[ingredient].cost * amount;
    const quantity = INGREDIENTS[ingredient].batch * amount;

    if (gameState.money >= cost) {
      setGameState(prev => ({
        ...prev,
        money: prev.money - cost,
        inventory: {
          ...prev.inventory,
          [ingredient]: prev.inventory[ingredient] + quantity
        }
      }));
      return true;
    }
    return false;
  };

  const sellItem = useCallback((item: MenuItem) => {
    setGameState(prev => {
      if (prev.customersWaiting[item] <= 0) return prev; // No customers

      const recipe = MENU[item].recipe;
      
      // Check inventory
      for (const [ing, qty] of Object.entries(recipe)) {
        if ((prev.inventory[ing as Ingredient] || 0) < (qty as number)) {
          return prev; // Not enough ingredients
        }
      }

      // Deduct inventory and add money
      const newInventory = { ...prev.inventory };
      for (const [ing, qty] of Object.entries(recipe)) {
        newInventory[ing as Ingredient] -= (qty as number);
      }

      const price = prev.customPrices[item];
      
      // Reputation gain based on quality upgrade and price fairness
      let repGain = 0.1;
      if (prev.upgrades.includes('quality_1')) repGain += 0.1;
      if (price < MENU[item].basePrice) repGain += 0.2; // Bonus for cheap food
      if (price > MENU[item].basePrice * 1.5) repGain -= 0.1; // Penalty for expensive food

      return {
        ...prev,
        money: prev.money + price,
        inventory: newInventory,
        reputation: Math.min(100, Math.max(0, prev.reputation + repGain)),
        loyalty: Math.min(100, prev.loyalty + 0.05),
        customersWaiting: {
          ...prev.customersWaiting,
          [item]: prev.customersWaiting[item] - 1
        }
      };
    });
    return true;
  }, []);

  const buyUpgrade = (upgradeId: string, cost: number) => {
    if (gameState.money >= cost && !gameState.upgrades.includes(upgradeId)) {
      setGameState(prev => ({
        ...prev,
        money: prev.money - cost,
        upgrades: [...prev.upgrades, upgradeId]
      }));
      addMessage(`Purchased upgrade!`);
    }
  };

  const unlockStall = (stall: StallType) => {
    const cost = STALLS[stall].cost;
    if (gameState.money >= cost && !gameState.unlockedStalls.includes(stall)) {
      setGameState(prev => {
        // Find all menu items that require this stall and aren't unlocked yet
        const newItems = (Object.keys(MENU) as MenuItem[]).filter(
          item => MENU[item].reqStall === stall && !prev.unlockedItems.includes(item)
        );

        return {
          ...prev,
          money: prev.money - cost,
          unlockedStalls: [...prev.unlockedStalls, stall],
          unlockedItems: [...prev.unlockedItems, ...newItems],
          currentStall: stall
        };
      });
      addMessage(`Unlocked ${stall} and its menu items!`);
      
      // Add new rivals based on stall
      if (stall === 'Pani Puri Cart') {
         setGameState(p => ({
           ...p,
           rivals: [...p.rivals, {
             id: 'rival_2', name: 'Gupta Chat', stallType: 'Pani Puri Cart', aggressiveness: 0.8, quality: 0.6, prices: { 'Pani Puri': 25 }, marketShare: 30
           }]
         }));
      }
    } else if (gameState.unlockedStalls.includes(stall)) {
      // Just equip it if already unlocked
      setGameState(prev => ({ ...prev, currentStall: stall }));
    }
  };

  const unlockMenuItem = (item: MenuItem) => {
    if (!gameState.unlockedItems.includes(item)) {
      setGameState(prev => ({
        ...prev,
        unlockedItems: [...prev.unlockedItems, item]
      }));
      addMessage(`Added ${item} to menu!`);
    }
  };

  // Game Loop
  useEffect(() => {
    if (isPaused) return;

    const tick = setInterval(() => {
      setGameState(prev => {
        let newTime = prev.time + 10; // 10 minutes per tick
        let newDay = prev.day;
        let newWeather = prev.weather;
        let newEvent = prev.currentEvent;
        let newMoney = prev.money;
        let newInventory = { ...prev.inventory };
        let newWaiting = { ...prev.customersWaiting };
        let newReputation = prev.reputation;
        let newRivals = [...prev.rivals];

        // --- 1. Time & Day Management ---
        if (newTime >= 22 * 60) { // 10:00 PM
          newTime = 8 * 60; // Reset to 8:00 AM
          newDay += 1;
          
          // Random weather
          const weathers: Weather[] = ['Sunny', 'Sunny', 'Hot', 'Rainy', 'Pleasant'];
          newWeather = weathers[Math.floor(Math.random() * weathers.length)];

          // Random event (20% chance)
          if (Math.random() < 0.2) {
            const events: Event[] = ['Diwali', 'Cricket Match', 'Monsoon', 'Local Fair'];
            newEvent = events[Math.floor(Math.random() * events.length)];
            addMessage(`Event today: ${newEvent}! Demand is high.`);
          } else {
            newEvent = 'None';
          }
          
          // Clear waiting customers overnight
          Object.keys(newWaiting).forEach(k => newWaiting[k as MenuItem] = 0);
        }

        // --- 2. Customer Arrival & Demand ---
        // Base customers per tick
        let baseCustomers = 1 + (prev.reputation / 20) + (prev.loyalty / 20);
        
        // Time multiplier (Peak hours: 8-10, 13-14, 17-20)
        const hour = Math.floor(newTime / 60);
        if ((hour >= 8 && hour <= 10) || (hour >= 13 && hour <= 14) || (hour >= 17 && hour <= 20)) {
          baseCustomers *= 1.5;
        }

        // Upgrades
        if (prev.upgrades.includes('marketing_1')) baseCustomers *= 1.2;
        if (prev.upgrades.includes('marketing_2')) baseCustomers *= 1.5;

        // Distribute customers to unlocked items
        prev.unlockedItems.forEach(item => {
          const menuData = MENU[item];
          let itemDemand = baseCustomers / prev.unlockedItems.length;

          // Weather & Event modifiers
          if (menuData.idealWeather.includes(newWeather)) itemDemand *= 1.5;
          if (menuData.idealEvent.includes(newEvent)) itemDemand *= 2.0;

          // Price modifier
          const playerPrice = prev.customPrices[item];
          const basePrice = menuData.basePrice;
          const priceRatio = basePrice / playerPrice; // >1 if cheap, <1 if expensive
          
          // Rival competition
          let rivalPrice = basePrice;
          let rivalMarketShare = 0;
          newRivals.forEach(r => {
            if (r.prices[item]) {
              rivalPrice = Math.min(rivalPrice, r.prices[item]!);
              rivalMarketShare += r.marketShare;
            }
          });

          // If rival is cheaper, lose demand
          if (rivalPrice < playerPrice) {
            itemDemand *= (rivalPrice / playerPrice);
          }

          itemDemand *= Math.pow(priceRatio, 1.5); // Price elasticity

          // Add to waiting queue (randomized based on demand)
          if (Math.random() < itemDemand % 1) {
            newWaiting[item] += Math.floor(itemDemand) + 1;
          } else {
            newWaiting[item] += Math.floor(itemDemand);
          }
        });

        // --- 3. Customer Patience ---
        // Customers leave if waiting too long (simulated by reducing queue)
        let patienceRetention = 0.7; // 30% leave per tick if not served
        if (prev.upgrades.includes('speed_1')) patienceRetention = 0.85;

        prev.unlockedItems.forEach(item => {
          if (newWaiting[item] > 0) {
            const leaving = Math.floor(newWaiting[item] * (1 - patienceRetention));
            if (leaving > 0) {
              newWaiting[item] -= leaving;
              newReputation -= (leaving * 0.05); // Lose rep when customers leave
            }
          }
        });

        // --- 4. Auto-Sellers ---
        if (prev.upgrades.includes('auto_chai') && newWaiting['Chai'] > 0) {
          const recipe = MENU['Chai'].recipe;
          let canMake = true;
          for (const [ing, qty] of Object.entries(recipe)) {
            if ((newInventory[ing as Ingredient] || 0) < (qty as number)) {
              canMake = false; break;
            }
          }
          if (canMake) {
            for (const [ing, qty] of Object.entries(recipe)) {
              newInventory[ing as Ingredient] -= (qty as number);
            }
            newMoney += prev.customPrices['Chai'];
            newWaiting['Chai'] -= 1;
            newReputation += 0.05;
          }
        }

        // --- 5. Rival AI ---
        // Rivals occasionally adjust prices to undercut player
        if (Math.random() < 0.1) {
          newRivals = newRivals.map(rival => {
            const newPrices = { ...rival.prices };
            prev.unlockedItems.forEach(item => {
              if (newPrices[item]) {
                const playerPrice = prev.customPrices[item];
                if (playerPrice < newPrices[item]! && Math.random() < rival.aggressiveness) {
                  // Undercut
                  newPrices[item] = Math.max(MENU[item].basePrice * 0.5, playerPrice - 1);
                } else if (playerPrice > newPrices[item]! + 2) {
                  // Increase price if player is too expensive
                  newPrices[item] = Math.min(MENU[item].basePrice * 2, newPrices[item]! + 1);
                }
              }
            });
            return { ...rival, prices: newPrices };
          });
        }

        return {
          ...prev,
          time: newTime,
          day: newDay,
          weather: newWeather,
          currentEvent: newEvent,
          money: newMoney,
          inventory: newInventory,
          customersWaiting: newWaiting,
          reputation: Math.max(0, Math.min(100, newReputation)),
          rivals: newRivals
        };
      });
    }, 1000); // 1 real second = 10 game minutes

    return () => clearInterval(tick);
  }, [isPaused]);

  const resetGame = () => {
    setGameState(INITIAL_STATE);
  };

  const updateAvatar = (config: Partial<AvatarConfig>) => {
    setGameState(prev => ({
      ...prev,
      avatar: { ...prev.avatar, ...config }
    }));
  };

  return {
    gameState,
    buyIngredient,
    sellItem,
    setPrice,
    buyUpgrade,
    unlockStall,
    unlockMenuItem,
    isPaused,
    setIsPaused,
    resetGame,
    updateAvatar
  };
}
