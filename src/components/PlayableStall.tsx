import React, { useState, useEffect, useMemo } from 'react';
import { usePlayerMovement } from '../hooks/usePlayerMovement';
import { GameState, MenuItem, Ingredient } from '../types';
import { MENU } from '../constants';
import { UsersRound, ChefHat, CheckCircle2 } from 'lucide-react';
import { PlayerAvatar } from './PlayerAvatar';
import { Player3D } from './Player3D';

const STATION_POSITIONS: Record<string, {x: number, y: number, color: string}> = {
  'Chai': { x: 100, y: 100, color: 'bg-amber-700' },
  'Masala Chai': { x: 300, y: 100, color: 'bg-orange-800' },
  'Pani Puri': { x: 500, y: 100, color: 'bg-emerald-600' },
  'Vada Pav': { x: 100, y: 500, color: 'bg-yellow-600' },
  'Dosa': { x: 300, y: 500, color: 'bg-slate-200' },
  'Biryani': { x: 500, y: 500, color: 'bg-stone-800' },
};

const BOUNDS = { w: 600, h: 600 };

const isoTransform = (x: number, y: number) => {
  const cx = x - BOUNDS.w / 2;
  const cy = y - BOUNDS.h / 2;
  const isoX = (cx - cy) * 0.866;
  const isoY = (cx + cy) * 0.5;
  return { x: isoX, y: isoY };
};

export function PlayableStall({ 
  gameState, 
  sellItem, 
  setPrice,
  isPaused
}: { 
  gameState: GameState, 
  sellItem: (item: MenuItem) => void, 
  setPrice: (item: MenuItem, price: number) => void,
  isPaused: boolean
}) {
  const { pos, isMoving } = usePlayerMovement(BOUNDS, isPaused);
  const [cooldown, setCooldown] = useState(0);
  const [floatingTexts, setFloatingTexts] = useState<{id: number, x: number, y: number, text: string}[]>([]);

  const nearestStation = useMemo(() => {
    let nearest = null;
    let minDistance = Infinity;

    gameState.unlockedItems.forEach(item => {
      const station = STATION_POSITIONS[item];
      if (!station) return;
      const dist = Math.hypot(station.x - pos.x, station.y - pos.y);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = { item, dist, x: station.x, y: station.y };
      }
    });

    if (minDistance < 80) return nearest;
    return null;
  }, [pos, gameState.unlockedItems]);

  useEffect(() => {
    if (cooldown > 0) {
      const t = setTimeout(() => setCooldown(c => c - 1), 100);
      return () => clearTimeout(t);
    }
  }, [cooldown]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ' || e.key === 'Space') {
        e.preventDefault(); // Prevent page scroll
        if (cooldown === 0 && nearestStation && !isPaused) {
          const menuItem = MENU[nearestStation.item as MenuItem];
          let canMake = true;
          for (const [ing, qty] of Object.entries(menuItem.recipe)) {
            if ((gameState.inventory[ing as Ingredient] || 0) < (qty as number)) {
              canMake = false;
            }
          }
          
          if (canMake && gameState.customersWaiting[nearestStation.item as MenuItem] > 0) {
            sellItem(nearestStation.item as MenuItem);
            setCooldown(3); // 300ms
            
            // Add floating text
            const price = gameState.customPrices[nearestStation.item as MenuItem] || menuItem.basePrice;
            const id = Date.now();
            setFloatingTexts(prev => [...prev, { id, x: nearestStation.x, y: nearestStation.y, text: `+₹${price}` }]);
            
            // Remove floating text after animation
            setTimeout(() => {
              setFloatingTexts(prev => prev.filter(ft => ft.id !== id));
            }, 1000);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nearestStation, cooldown, gameState, sellItem, isPaused]);

  // Generate grid tiles
  const gridTiles = useMemo(() => {
    const tiles = [];
    const cellSize = 60;
    for (let row = 0; row < BOUNDS.h / cellSize; row++) {
      for (let col = 0; col < BOUNDS.w / cellSize; col++) {
        const x = col * cellSize + cellSize / 2;
        const y = row * cellSize + cellSize / 2;
        const iso = isoTransform(x, y);
        tiles.push(
          <div 
            key={`${row}-${col}`}
            className="absolute w-16 h-16 border border-slate-500/20"
            style={{
              left: '50%',
              top: '50%',
              marginLeft: iso.x,
              marginTop: iso.y,
              transform: 'translate(-50%, -50%) rotateX(60deg) rotateZ(-45deg)',
              backgroundColor: (row + col) % 2 === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
            }}
          />
        );
      }
    }
    return tiles;
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="w-full lg:w-[800px] overflow-x-auto pb-4 shrink-0">
        <div className="relative bg-slate-800 rounded-2xl border-4 border-slate-700 overflow-hidden shadow-inner flex items-center justify-center" style={{ height: 500 }}>
          
          {/* Controls Overlay */}
          <div className="absolute top-4 left-4 bg-white/90 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 shadow-sm z-[9999] flex items-center gap-2">
            <div className="flex gap-1">
              <kbd className="bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5 text-xs">W</kbd>
              <kbd className="bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5 text-xs">A</kbd>
              <kbd className="bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5 text-xs">S</kbd>
              <kbd className="bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5 text-xs">D</kbd>
            </div>
            <span>to move</span>
            <span className="mx-2 text-slate-300">|</span>
            <kbd className="bg-slate-100 border border-slate-300 rounded px-2 py-0.5 text-xs">SPACE</kbd>
            <span>to serve</span>
          </div>

          {/* Isometric World Container */}
          <div className="relative w-full h-full">
            {/* Grid Floor */}
            {gridTiles}

            {/* Stations */}
            {gameState.unlockedItems.map(item => {
              const station = STATION_POSITIONS[item];
              if (!station) return null;
              const isNearest = nearestStation?.item === item;
              const waiting = gameState.customersWaiting[item as MenuItem] || 0;
              
              const menuItem = MENU[item as MenuItem];
              let canMake = true;
              for (const [ing, qty] of Object.entries(menuItem.recipe)) {
                if ((gameState.inventory[ing as Ingredient] || 0) < (qty as number)) canMake = false;
              }

              const iso = isoTransform(station.x, station.y);
              const zIndex = Math.floor(station.x + station.y);

              return (
                <div key={item} 
                     className={`absolute flex flex-col items-center justify-center transition-all`}
                     style={{ 
                       left: '50%', 
                       top: '50%', 
                       marginLeft: iso.x, 
                       marginTop: iso.y, 
                       transform: 'translate(-50%, -100%)',
                       zIndex 
                     }}>
                  
                  {/* 3D Shadow */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-24 h-8 bg-black/40 rounded-full blur-[4px]"></div>

                  {/* 3D Station Body */}
                  <div className={`relative flex flex-col items-center transition-transform ${isNearest ? 'scale-110 drop-shadow-2xl' : 'drop-shadow-xl'}`}>
                    {/* Counter Top */}
                    <div className={`w-24 h-12 rounded-t-xl border-t-2 border-l-2 border-r-2 border-white/30 flex items-center justify-center relative z-10 ${station.color} brightness-110`}>
                      <span className={`font-black text-center text-xs px-1 leading-tight drop-shadow-md ${item === 'Dosa' ? 'text-slate-800' : 'text-white'}`}>{item}</span>
                    </div>
                    
                    {/* Counter Front */}
                    <div className={`w-24 h-16 rounded-b-xl border-b-4 border-l-4 border-r-4 border-black/20 relative z-10 ${station.color} brightness-90 flex items-center justify-center`}>
                      <div className="w-16 h-2 bg-black/20 rounded-full"></div>
                    </div>

                    {isNearest && (
                      <div className="absolute inset-0 ring-4 ring-white rounded-xl z-20 pointer-events-none"></div>
                    )}
                  </div>
                  
                  {/* Customers Waiting */}
                  {waiting > 0 && (
                    <div className="absolute -top-8 flex gap-1 z-30">
                      {Array.from({ length: Math.min(waiting, 3) }).map((_, i) => (
                        <div key={i} className="relative">
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-black/30 rounded-full blur-[1px]"></div>
                          {/* Customer Avatar - simple representation */}
                          <div className="w-6 h-8 bg-indigo-500 rounded-t-full rounded-b-md border-2 border-white shadow-sm flex flex-col items-center justify-start pt-1 animate-bounce relative" style={{ animationDelay: `${i * 150}ms` }}>
                            <div className="w-3 h-3 bg-indigo-200 rounded-full"></div>
                          </div>
                        </div>
                      ))}
                      {waiting > 3 && <span className="text-xs font-bold text-slate-800 bg-white/90 px-1.5 py-0.5 rounded-full shadow-sm z-30">+{waiting - 3}</span>}
                    </div>
                  )}

                  {/* Action Prompt */}
                  {isNearest && (
                    <div className="absolute -top-16 bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap animate-pulse z-40">
                      {!canMake ? '❌ Missing Ingredients' : waiting === 0 ? '⏳ No customers' : '✨ [SPACE] Serve'}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Floating Texts for Sales */}
            {floatingTexts.map(ft => {
              const iso = isoTransform(ft.x, ft.y);
              return (
                <div 
                  key={ft.id} 
                  className="absolute font-black text-emerald-400 text-2xl drop-shadow-lg z-[9999]"
                  style={{ 
                    left: '50%', 
                    top: '50%', 
                    marginLeft: iso.x,
                    marginTop: iso.y - 60, // Start higher
                    transform: 'translate(-50%, -50%)',
                    animation: 'floatUp 1s ease-out forwards'
                  }}
                >
                  {ft.text}
                </div>
              );
            })}

            {/* Player Character */}
            {(() => {
              const iso = isoTransform(pos.x, pos.y);
              const zIndex = Math.floor(pos.x + pos.y);
              return (
                <div className="absolute transition-transform"
                     style={{ 
                       left: '50%', 
                       top: '50%', 
                       marginLeft: iso.x, 
                       marginTop: iso.y, 
                       transform: 'translate(-50%, -100%)',
                       zIndex 
                     }}>
                  {/* Player Shadow */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-12 h-5 bg-black/40 rounded-full blur-[2px]"></div>
                  <div className="relative pb-2 drop-shadow-xl">
                    <Player3D config={gameState.avatar} isMoving={isMoving} />
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="lg:hidden mt-4 flex justify-between items-center px-2">
          <div className="grid grid-cols-3 gap-2">
            <div />
            <button 
              className="bg-slate-200 p-4 rounded-xl active:bg-slate-300 shadow-sm flex items-center justify-center text-xl" 
              onTouchStart={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' })); }} 
              onTouchEnd={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowUp' })); }}
              onMouseDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))}
              onMouseUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowUp' }))}
              onMouseLeave={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowUp' }))}
            >
              ↑
            </button>
            <div />
            <button 
              className="bg-slate-200 p-4 rounded-xl active:bg-slate-300 shadow-sm flex items-center justify-center text-xl" 
              onTouchStart={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' })); }} 
              onTouchEnd={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' })); }}
              onMouseDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))}
              onMouseUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }))}
              onMouseLeave={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }))}
            >
              ←
            </button>
            <button 
              className="bg-slate-200 p-4 rounded-xl active:bg-slate-300 shadow-sm flex items-center justify-center text-xl" 
              onTouchStart={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' })); }} 
              onTouchEnd={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowDown' })); }}
              onMouseDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))}
              onMouseUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowDown' }))}
              onMouseLeave={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowDown' }))}
            >
              ↓
            </button>
            <button 
              className="bg-slate-200 p-4 rounded-xl active:bg-slate-300 shadow-sm flex items-center justify-center text-xl" 
              onTouchStart={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' })); }} 
              onTouchEnd={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' })); }}
              onMouseDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))}
              onMouseUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }))}
              onMouseLeave={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }))}
            >
              →
            </button>
          </div>
          <button 
            className="bg-teal-600 text-white p-6 rounded-full font-bold shadow-lg active:bg-teal-700 active:scale-95 transition-transform" 
            onTouchStart={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Space', code: 'Space' })); }} 
            onTouchEnd={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Space', code: 'Space' })); }}
            onMouseDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Space', code: 'Space' }))}
            onMouseUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Space', code: 'Space' }))}
            onMouseLeave={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Space', code: 'Space' }))}
          >
            SERVE
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4 h-[400px] overflow-y-auto">
        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
          <UsersRound size={20} className="text-teal-600" /> Station Management
        </h3>
        
        <div className="flex flex-col gap-3">
          {gameState.unlockedItems.map(item => {
            const menuItem = MENU[item as MenuItem];
            let canMake = true;
            for (const [ing, qty] of Object.entries(menuItem.recipe)) {
              if ((gameState.inventory[ing as Ingredient] || 0) < (qty as number)) canMake = false;
            }

            return (
              <div key={item} className={`p-3 rounded-xl border flex flex-col gap-2 transition-colors ${canMake ? 'bg-slate-50 border-slate-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">{item}</span>
                  <div className="flex items-center bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
                    <span className="text-slate-500 px-2 font-bold text-sm">₹</span>
                    <input 
                      type="number" 
                      min="1"
                      value={gameState.customPrices[item as MenuItem]}
                      onChange={(e) => setPrice(item as MenuItem, parseInt(e.target.value) || 1)}
                      className="w-14 bg-transparent text-sm font-bold text-slate-800 text-center outline-none"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(menuItem.recipe).map(([ing, qty]) => {
                    const hasEnough = (gameState.inventory[ing as Ingredient] || 0) >= (qty as number);
                    return (
                      <span key={ing} className={`text-[10px] px-2 py-1 rounded-md border font-medium ${hasEnough ? 'bg-white border-slate-200 text-slate-600' : 'bg-red-100 border-red-300 text-red-700'}`}>
                        {qty} {ing}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Add keyframes for floating text */}
      <style>{`
        @keyframes floatUp {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -150%) scale(1.2); }
        }
      `}</style>
    </div>
  );
}
