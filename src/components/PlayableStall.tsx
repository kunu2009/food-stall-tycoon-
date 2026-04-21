import React, { useState, useEffect, useMemo } from 'react';
import { usePlayerMovement } from '../hooks/usePlayerMovement';
import { GameState, MenuItem, Ingredient } from '../types';
import { MENU } from '../constants';
import { Player3D } from './Player3D';

const WORLD_SIZE = { w: 2000, h: 2000 };

const STATION_POSITIONS: Record<string, {x: number, y: number, color: string}> = {
  'Chai': { x: 800, y: 800, color: 'bg-amber-700' },
  'Masala Chai': { x: 1200, y: 800, color: 'bg-orange-800' },
  'Pani Puri': { x: 1000, y: 1000, color: 'bg-emerald-600' },
  'Vada Pav': { x: 800, y: 1200, color: 'bg-yellow-600' },
  'Dosa': { x: 1200, y: 1200, color: 'bg-slate-200' },
  'Biryani': { x: 1000, y: 1400, color: 'bg-stone-800' },
};

const getIsoPos = (x: number, y: number) => {
  const isoX = (x - y) * 0.866;
  const isoY = (x + y) * 0.5;
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
  const { pos, isMoving, facing } = usePlayerMovement(WORLD_SIZE, isPaused);
  const [cooldown, setCooldown] = useState(0);
  const [isServing, setIsServing] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<{id: number, x: number, y: number, text: string}[]>([]);
  const [screenSize, setScreenSize] = useState({ w: typeof window !== 'undefined' ? window.innerWidth : 1000, h: typeof window !== 'undefined' ? window.innerHeight : 800 });

  useEffect(() => {
    const handleResize = () => setScreenSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate camera offset to keep player centered
  const playerIso = getIsoPos(pos.x, pos.y);
  const cameraOffsetX = screenSize.w / 2 - playerIso.x;
  const cameraOffsetY = screenSize.h / 2 - playerIso.y;

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

    if (minDistance < 120) return nearest;
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
            
            // Trigger serve animation
            setIsServing(true);
            setTimeout(() => setIsServing(false), 300);
            
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
    for (let row = 0; row < WORLD_SIZE.h / cellSize; row++) {
      for (let col = 0; col < WORLD_SIZE.w / cellSize; col++) {
        const x = col * cellSize + cellSize / 2;
        const y = row * cellSize + cellSize / 2;
        const iso = getIsoPos(x, y);
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

  // Decorative elements
  const decorations = useMemo(() => {
    const decos = [];
    const positions = [
      { x: 400, y: 400, type: 'tree' },
      { x: 1600, y: 400, type: 'tree' },
      { x: 400, y: 1600, type: 'tree' },
      { x: 1600, y: 1600, type: 'tree' },
      { x: 1000, y: 600, type: 'bench' },
      { x: 600, y: 1000, type: 'bench' },
    ];

    positions.forEach((pos, i) => {
      const iso = getIsoPos(pos.x, pos.y);
      const zIndex = Math.floor(pos.x + pos.y);

      if (pos.type === 'tree') {
        decos.push(
          <div key={`deco-${i}`} className="absolute flex flex-col items-center justify-end"
               style={{ left: '50%', top: '50%', marginLeft: iso.x, marginTop: iso.y, transform: 'translate(-50%, -100%)', zIndex }}>
            <div className="absolute bottom-0 w-16 h-8 bg-black/30 rounded-full blur-[4px] translate-y-1/2"></div>
            <div className="w-24 h-24 bg-emerald-600 rounded-full border-b-8 border-emerald-800 shadow-inner z-10 relative">
              <div className="absolute top-2 left-4 w-8 h-8 bg-emerald-500 rounded-full"></div>
              <div className="absolute top-6 right-4 w-10 h-10 bg-emerald-700 rounded-full"></div>
            </div>
            <div className="w-4 h-12 bg-amber-900 border-l-2 border-amber-950 -mt-4 z-0"></div>
          </div>
        );
      } else if (pos.type === 'bench') {
        decos.push(
          <div key={`deco-${i}`} className="absolute flex flex-col items-center justify-end"
               style={{ left: '50%', top: '50%', marginLeft: iso.x, marginTop: iso.y, transform: 'translate(-50%, -100%)', zIndex }}>
            <div className="absolute bottom-0 w-20 h-6 bg-black/30 rounded-full blur-[2px] translate-y-1/2"></div>
            <div className="w-20 h-6 bg-amber-700 border-b-4 border-amber-900 rounded-sm z-10"></div>
            <div className="flex justify-between w-16 -mt-1 z-0">
              <div className="w-2 h-6 bg-slate-700"></div>
              <div className="w-2 h-6 bg-slate-700"></div>
            </div>
          </div>
        );
      }
    });
    return decos;
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-800 overflow-hidden z-0">
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
        <div 
          className="absolute transition-transform duration-100 ease-linear"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(${cameraOffsetX}px, ${cameraOffsetY}px)`
          }}
        >
          {/* Grid Floor */}
          {gridTiles}

          {/* Decorations */}
          {decorations}

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

              const iso = getIsoPos(station.x, station.y);
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
              const iso = getIsoPos(ft.x, ft.y);
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
              const iso = getIsoPos(pos.x, pos.y);
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
                    <Player3D config={gameState.avatar} isMoving={isMoving} isServing={isServing} facing={facing} />
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

      {/* Mobile Controls */}
      <div className="lg:hidden absolute bottom-4 left-0 right-0 flex justify-between items-center px-4 z-[9999]">
        <div className="grid grid-cols-3 gap-2">
          <div />
          <button 
            className="bg-white/80 backdrop-blur p-4 rounded-xl active:bg-slate-200 shadow-lg flex items-center justify-center text-xl" 
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
            className="bg-white/80 backdrop-blur p-4 rounded-xl active:bg-slate-200 shadow-lg flex items-center justify-center text-xl" 
            onTouchStart={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' })); }} 
            onTouchEnd={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' })); }}
            onMouseDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))}
            onMouseUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }))}
            onMouseLeave={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }))}
          >
            ←
          </button>
          <button 
            className="bg-white/80 backdrop-blur p-4 rounded-xl active:bg-slate-200 shadow-lg flex items-center justify-center text-xl" 
            onTouchStart={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' })); }} 
            onTouchEnd={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowDown' })); }}
            onMouseDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))}
            onMouseUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowDown' }))}
            onMouseLeave={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowDown' }))}
          >
            ↓
          </button>
          <button 
            className="bg-white/80 backdrop-blur p-4 rounded-xl active:bg-slate-200 shadow-lg flex items-center justify-center text-xl" 
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
          className="bg-teal-600 text-white p-6 rounded-full font-bold shadow-xl active:bg-teal-700 active:scale-95 transition-transform" 
          onTouchStart={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Space', code: 'Space' })); }} 
          onTouchEnd={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Space', code: 'Space' })); }}
          onMouseDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Space', code: 'Space' }))}
          onMouseUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Space', code: 'Space' }))}
          onMouseLeave={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Space', code: 'Space' }))}
        >
          SERVE
        </button>
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
