import React, { useState } from 'react';
import { useGameLoop } from './hooks/useGameLoop';
import { Footer } from './components/Footer';
import { StallVisualizer } from './components/StallVisualizer';
import { PlayableStall } from './components/PlayableStall';
import { PlayerAvatar } from './components/PlayerAvatar';
import { AvatarCustomizer } from './components/AvatarCustomizer';
import { INGREDIENTS, MENU, STALLS, UPGRADES } from './constants';
import { Ingredient, MenuItem, StallType } from './types';
import { Store, ShoppingCart, TrendingUp, Settings, Clock, Sun, CloudRain, Flame, Wind, AlertCircle, Coffee, Utensils, Truck, Users, Star, Heart, UsersRound } from 'lucide-react';

export default function App() {
  const { 
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
  } = useGameLoop();

  const [activeTab, setActiveTab] = useState<'sell' | 'market' | 'upgrades' | 'rivals'>('sell');
  const [showResetModal, setShowResetModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 || 12;
    return `${displayH}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  const getWeatherIcon = (weather: string) => {
    switch(weather) {
      case 'Sunny': return <Sun className="text-yellow-500" size={20} />;
      case 'Rainy': return <CloudRain className="text-blue-400" size={20} />;
      case 'Hot': return <Flame className="text-orange-500" size={20} />;
      case 'Pleasant': return <Wind className="text-teal-400" size={20} />;
      default: return <Sun size={20} />;
    }
  };

  const getStallIcon = (stall: string) => {
    if (stall.includes('Chai')) return <Coffee size={24} />;
    if (stall.includes('Truck')) return <Truck size={24} />;
    return <Utensils size={24} />;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-teal-200">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowAvatarModal(true)}
              className="hover:scale-105 transition-transform active:scale-95"
              title="Customize Avatar"
            >
              <PlayerAvatar config={gameState.avatar} size={48} />
            </button>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-slate-900">{gameState.currentStall}</h1>
              <div className="flex items-center gap-4 text-sm font-medium">
                <span className="text-slate-500">Day {gameState.day}</span>
                <div className="flex items-center gap-1 text-amber-500" title="Reputation">
                  <Star size={16} fill="currentColor" />
                  {Math.floor(gameState.reputation)}/100
                </div>
                <div className="flex items-center gap-1 text-rose-500" title="Customer Loyalty">
                  <Heart size={16} fill="currentColor" />
                  {Math.floor(gameState.loyalty)}/100
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Balance</span>
              <span className="font-bold text-2xl text-emerald-600">₹{gameState.money.toLocaleString()}</span>
            </div>
            
            <div className="h-10 w-px bg-slate-200 hidden sm:block"></div>
            
            <div className="flex gap-4">
              <div className="flex flex-col items-center bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <div className="flex items-center gap-1 text-slate-700 font-medium">
                  <Clock size={16} className="text-slate-400" />
                  {formatTime(gameState.time)}
                </div>
              </div>
              <div className="flex flex-col items-center bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <div className="flex items-center gap-1 text-slate-700 font-medium" title={gameState.weather}>
                  {getWeatherIcon(gameState.weather)}
                  <span className="hidden sm:inline">{gameState.weather}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Events Banner */}
        {gameState.currentEvent !== 'None' && (
          <div className="bg-indigo-600 text-white text-sm py-1.5 px-4 text-center font-medium flex justify-center items-center gap-2">
            <AlertCircle size={16} />
            Special Event Today: {gameState.currentEvent}! Demand is high!
          </div>
        )}
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Visualizer */}
        <StallVisualizer 
          stall={gameState.currentStall} 
          upgrades={gameState.upgrades} 
          weather={gameState.weather} 
          time={gameState.time} 
        />

        {/* Messages Log */}
        <div className="mb-8 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recent Activity</h3>
          <div className="flex flex-col gap-1">
            {gameState.messages.map((msg, i) => (
              <div key={i} className={`text-sm ${i === 0 ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>
                {msg}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setActiveTab('sell')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === 'sell' ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
          >
            <Store size={18} /> Sell Food
          </button>
          <button 
            onClick={() => setActiveTab('market')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === 'market' ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
          >
            <ShoppingCart size={18} /> Market (Buy Ingredients)
          </button>
          <button 
            onClick={() => setActiveTab('upgrades')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === 'upgrades' ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
          >
            <TrendingUp size={18} /> Upgrades & Expansion
          </button>
          <button 
            onClick={() => setActiveTab('rivals')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === 'rivals' ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
          >
            <Users size={18} /> Rivals
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          
          {/* SELL TAB */}
          {activeTab === 'sell' && (
            <PlayableStall 
              gameState={gameState} 
              sellItem={sellItem} 
              setPrice={setPrice} 
              isPaused={isPaused} 
            />
          )}

          {/* MARKET TAB */}
          {activeTab === 'market' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <h2 className="font-bold text-slate-800">Wholesale Market</h2>
                <span className="text-sm text-slate-500">Buy ingredients in bulk</span>
              </div>
              <div className="divide-y divide-slate-100">
                {(Object.keys(INGREDIENTS) as Ingredient[]).map(ing => {
                  const data = INGREDIENTS[ing];
                  const stock = gameState.inventory[ing] || 0;
                  const canBuy = gameState.money >= data.cost;

                  return (
                    <div key={ing} className="p-4 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                      <div className="flex-1 min-w-[150px]">
                        <h3 className="font-bold text-slate-800">{ing}</h3>
                        <p className="text-sm text-slate-500">Stock: <span className={`font-medium ${stock < 10 ? 'text-red-500' : 'text-slate-700'}`}>{stock} units</span></p>
                      </div>
                      
                      <div className="text-right min-w-[100px]">
                        <div className="font-bold text-slate-800">₹{data.cost}</div>
                        <div className="text-xs text-slate-500">for {data.batch} units</div>
                      </div>

                      <button 
                        onClick={() => buyIngredient(ing, 1)}
                        disabled={!canBuy}
                        className={`px-6 py-2 rounded-xl font-bold transition-all active:scale-[0.98] ${canBuy ? 'bg-slate-800 hover:bg-slate-900 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                      >
                        Buy
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* UPGRADES TAB */}
          {activeTab === 'upgrades' && (
            <div className="space-y-8">
              
              {/* Stalls Expansion */}
              <div>
                <h2 className="font-bold text-xl text-slate-800 mb-4 flex items-center gap-2">
                  <Store className="text-teal-600" /> Expand Empire
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(Object.keys(STALLS) as StallType[]).map(stall => {
                    const data = STALLS[stall];
                    const isUnlocked = gameState.unlockedStalls.includes(stall);
                    const canAfford = gameState.money >= data.cost;

                    if (isUnlocked) {
                      return (
                        <div key={stall} className="bg-teal-50 border border-teal-200 p-4 rounded-2xl flex justify-between items-center">
                          <div>
                            <h3 className="font-bold text-teal-900">{stall}</h3>
                            <p className="text-xs text-teal-700">Owned</p>
                          </div>
                          {gameState.currentStall !== stall && (
                            <button 
                              onClick={() => unlockStall(stall)} // Reusing function to set current
                              className="px-4 py-2 bg-white text-teal-700 rounded-lg text-sm font-bold shadow-sm"
                            >
                              Equip
                            </button>
                          )}
                          {gameState.currentStall === stall && (
                            <span className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold shadow-sm">Active</span>
                          )}
                        </div>
                      );
                    }

                    return (
                      <div key={stall} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col">
                        <h3 className="font-bold text-slate-800 text-lg">{stall}</h3>
                        <p className="text-sm text-slate-500 mb-4">{data.desc}</p>
                        
                        <div className="mt-auto flex items-center justify-between">
                          <span className="font-bold text-slate-800">₹{data.cost.toLocaleString()}</span>
                          <button 
                            onClick={() => unlockStall(stall)}
                            disabled={!canAfford}
                            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${canAfford ? 'bg-slate-800 hover:bg-slate-900 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                          >
                            Purchase
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Menu Expansion */}
              <div>
                <h2 className="font-bold text-xl text-slate-800 mb-4 flex items-center gap-2">
                  <Utensils className="text-teal-600" /> New Menu Items
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {(Object.keys(MENU) as MenuItem[]).map(item => {
                    const isUnlocked = gameState.unlockedItems.includes(item);
                    const reqStall = MENU[item].reqStall;
                    const hasStall = gameState.unlockedStalls.includes(reqStall);

                    if (isUnlocked) return null;

                    return (
                      <div key={item} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                        <h3 className="font-bold text-slate-800">{item}</h3>
                        <p className="text-xs text-slate-500 mb-3">Requires: {reqStall}</p>
                        <button 
                          onClick={() => unlockMenuItem(item)}
                          disabled={!hasStall}
                          className={`w-full py-2 rounded-lg font-bold text-sm transition-all ${hasStall ? 'bg-teal-100 hover:bg-teal-200 text-teal-800' : 'bg-slate-50 text-slate-400 cursor-not-allowed'}`}
                        >
                          {hasStall ? 'Add to Menu (Free)' : 'Stall Required'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Upgrades */}
              <div>
                <h2 className="font-bold text-xl text-slate-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="text-teal-600" /> Business Upgrades
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {UPGRADES.map(upg => {
                    const isOwned = gameState.upgrades.includes(upg.id);
                    const canAfford = gameState.money >= upg.cost;

                    if (isOwned) {
                      return (
                        <div key={upg.id} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex justify-between items-center opacity-70">
                          <div>
                            <h3 className="font-bold text-slate-700 line-through">{upg.name}</h3>
                            <p className="text-xs text-slate-500">{upg.desc}</p>
                          </div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Purchased</span>
                        </div>
                      );
                    }

                    return (
                      <div key={upg.id} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex justify-between items-center gap-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-800">{upg.name}</h3>
                          <p className="text-xs text-slate-500">{upg.desc}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="font-bold text-slate-800">₹{upg.cost.toLocaleString()}</span>
                          <button 
                            onClick={() => buyUpgrade(upg.id, upg.cost)}
                            disabled={!canAfford}
                            className={`px-4 py-1.5 rounded-lg font-bold text-sm transition-all ${canAfford ? 'bg-slate-800 hover:bg-slate-900 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                          >
                            Buy
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* RIVALS TAB */}
          {activeTab === 'rivals' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gameState.rivals.map(rival => (
                <div key={rival.id} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">{rival.name}</h3>
                      <p className="text-xs text-slate-500">{rival.stallType}</p>
                    </div>
                    <div className="bg-rose-50 text-rose-700 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
                      <Users size={14} /> {rival.marketShare}% Market
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Their Prices</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(rival.prices).map(([item, price]) => (
                          <div key={item} className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm">
                            <span className="text-slate-600 font-medium">{item}</span>
                            <span className="text-slate-900 font-bold">₹{price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-slate-100">
                      <p className="text-xs text-slate-500">
                        Aggressiveness: <span className="font-medium text-slate-700">{Math.round(rival.aggressiveness * 100)}%</span>
                        <span className="mx-2">•</span>
                        Quality: <span className="font-medium text-slate-700">{Math.round(rival.quality * 100)}%</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {gameState.rivals.length === 0 && (
                <div className="col-span-full text-center py-12 text-slate-500">
                  No rivals yet. Enjoy the monopoly while it lasts!
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Settings / Controls */}
      <div className="fixed bottom-4 right-4 flex gap-2">
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className="bg-white p-3 rounded-full shadow-lg border border-slate-200 text-slate-600 hover:text-teal-600 transition-colors"
          title={isPaused ? "Resume Game" : "Pause Game"}
        >
          {isPaused ? <Store size={20} /> : <Clock size={20} />}
        </button>
        <button 
          onClick={() => setShowResetModal(true)}
          className="bg-white p-3 rounded-full shadow-lg border border-slate-200 text-slate-600 hover:text-red-600 transition-colors"
          title="Reset Game"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Restart Game?</h3>
            <p className="text-slate-600 mb-6">Are you sure you want to reset your progress? You will lose all your money, stalls, and upgrades. This cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  resetGame();
                  setShowResetModal(false);
                }}
                className="px-4 py-2 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm"
              >
                Yes, Restart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Customizer Modal */}
      {showAvatarModal && (
        <AvatarCustomizer 
          config={gameState.avatar} 
          onUpdate={updateAvatar} 
          onClose={() => setShowAvatarModal(false)} 
        />
      )}

      <Footer />
    </div>
  );
}

