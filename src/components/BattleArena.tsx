import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sword, Zap, Heart, Flame } from 'lucide-react';

type Character = {
  id: string;
  name: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  team: 'player' | 'enemy';
  type: 'warrior' | 'mage' | 'rogue' | 'boss';
  action?: 'idle' | 'move' | 'attack' | 'hurt' | 'dead';
  facing: 'up' | 'down' | 'left' | 'right';
};

const GRID_SIZE = 6;
const CELL_SIZE = 60;

export function BattleArena() {
  const [characters, setCharacters] = useState<Character[]>([
    { id: 'p1', name: 'Daria', x: 2, y: 4, hp: 100, maxHp: 100, team: 'player', type: 'warrior', action: 'idle', facing: 'up' },
    { id: 'p2', name: 'Mage', x: 3, y: 5, hp: 80, maxHp: 80, team: 'player', type: 'mage', action: 'idle', facing: 'up' },
    { id: 'e1', name: 'Orc', x: 2, y: 2, hp: 120, maxHp: 120, team: 'enemy', type: 'rogue', action: 'idle', facing: 'down' },
    { id: 'e2', name: 'Boss', x: 3, y: 1, hp: 200, maxHp: 200, team: 'enemy', type: 'boss', action: 'idle', facing: 'down' },
  ]);
  
  const [selectedCharId, setSelectedCharId] = useState<string | null>('p1');
  const [turn, setTurn] = useState<'player' | 'enemy'>('player');
  const [actionQueue, setActionQueue] = useState<any[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Health bars
  const playerHp = characters.filter(c => c.team === 'player').reduce((sum, c) => sum + c.hp, 0);
  const playerMaxHp = characters.filter(c => c.team === 'player').reduce((sum, c) => sum + c.maxHp, 0);
  const enemyHp = characters.filter(c => c.team === 'enemy').reduce((sum, c) => sum + c.hp, 0);
  const enemyMaxHp = characters.filter(c => c.team === 'enemy').reduce((sum, c) => sum + c.maxHp, 0);

  const handleCellClick = (x: number, y: number) => {
    if (turn !== 'player' || isAnimating || !selectedCharId) return;
    
    const selectedChar = characters.find(c => c.id === selectedCharId);
    if (!selectedChar || selectedChar.team !== 'player') return;

    // Check if cell is occupied
    const targetChar = characters.find(c => c.x === x && c.y === y && c.hp > 0);
    
    if (targetChar) {
      if (targetChar.team === 'enemy') {
        // Attack
        performAttack(selectedChar, targetChar);
      } else {
        // Select teammate
        setSelectedCharId(targetChar.id);
      }
    } else {
      // Move
      performMove(selectedChar, x, y);
    }
  };

  const performMove = (char: Character, x: number, y: number) => {
    setIsAnimating(true);
    
    // Determine facing direction
    let facing = char.facing;
    if (x > char.x) facing = 'right';
    else if (x < char.x) facing = 'left';
    else if (y > char.y) facing = 'down';
    else if (y < char.y) facing = 'up';

    setCharacters(prev => prev.map(c => 
      c.id === char.id ? { ...c, x, y, action: 'move', facing } : c
    ));

    setTimeout(() => {
      setCharacters(prev => prev.map(c => 
        c.id === char.id ? { ...c, action: 'idle' } : c
      ));
      setIsAnimating(false);
      // End turn or allow more actions? Let's just pass turn for simplicity
      setTurn('enemy');
    }, 500);
  };

  const performAttack = (attacker: Character, target: Character) => {
    setIsAnimating(true);
    
    // Determine facing direction
    let facing = attacker.facing;
    if (target.x > attacker.x) facing = 'right';
    else if (target.x < attacker.x) facing = 'left';
    else if (target.y > attacker.y) facing = 'down';
    else if (target.y < attacker.y) facing = 'up';

    setCharacters(prev => prev.map(c => 
      c.id === attacker.id ? { ...c, action: 'attack', facing } : c
    ));

    setTimeout(() => {
      const damage = Math.floor(Math.random() * 20) + 10;
      setCharacters(prev => prev.map(c => {
        if (c.id === target.id) {
          const newHp = Math.max(0, c.hp - damage);
          return { ...c, hp: newHp, action: newHp === 0 ? 'dead' : 'hurt' };
        }
        if (c.id === attacker.id) {
          return { ...c, action: 'idle' };
        }
        return c;
      }));

      setTimeout(() => {
        setCharacters(prev => prev.map(c => 
          c.id === target.id && c.hp > 0 ? { ...c, action: 'idle' } : c
        ));
        setIsAnimating(false);
        if (attacker.team === 'player') setTurn('enemy');
        else setTurn('player');
      }, 500);
    }, 300);
  };

  // Simple enemy AI
  useEffect(() => {
    if (turn === 'enemy' && !isAnimating) {
      const enemies = characters.filter(c => c.team === 'enemy' && c.hp > 0);
      const players = characters.filter(c => c.team === 'player' && c.hp > 0);
      
      if (enemies.length === 0 || players.length === 0) return;

      const activeEnemy = enemies[Math.floor(Math.random() * enemies.length)];
      const targetPlayer = players[Math.floor(Math.random() * players.length)];

      // Simple AI: if adjacent, attack, else move towards
      const dist = Math.abs(activeEnemy.x - targetPlayer.x) + Math.abs(activeEnemy.y - targetPlayer.y);
      
      if (dist === 1) {
        performAttack(activeEnemy, targetPlayer);
      } else {
        // Move towards
        const dx = Math.sign(targetPlayer.x - activeEnemy.x);
        const dy = Math.sign(targetPlayer.y - activeEnemy.y);
        
        let newX = activeEnemy.x;
        let newY = activeEnemy.y;
        
        if (Math.random() > 0.5 && dx !== 0) {
          newX += dx;
        } else if (dy !== 0) {
          newY += dy;
        } else if (dx !== 0) {
          newX += dx;
        }

        // Check if blocked
        if (!characters.find(c => c.x === newX && c.y === newY && c.hp > 0)) {
          performMove(activeEnemy, newX, newY);
        } else {
          // Pass turn if blocked
          setTurn('player');
        }
      }
    }
  }, [turn, isAnimating, characters]);

  // Render Grid
  const grid = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      grid.push({ x, y });
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900 overflow-hidden flex flex-col font-sans select-none">
      
      {/* Top Bar - Health & Status */}
      <div className="absolute top-0 left-0 right-0 z-50 flex flex-col pointer-events-none">
        <div className="flex justify-between items-center px-4 py-2 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700">
          <div className="flex-1">
            <div className="text-white font-bold text-sm mb-1">Daria</div>
            <div className="h-4 bg-slate-700 rounded-full overflow-hidden border border-slate-600 relative">
              <div 
                className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-green-500 to-green-400 transition-all duration-300"
                style={{ width: `${(playerHp / playerMaxHp) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="mx-4 bg-red-600 rounded-lg p-2 shadow-lg border-2 border-red-800 transform rotate-45">
            <Sword className="text-white transform -rotate-45" size={24} />
          </div>
          
          <div className="flex-1 text-right">
            <div className="text-white font-bold text-sm mb-1">Player B22E</div>
            <div className="h-4 bg-slate-700 rounded-full overflow-hidden border border-slate-600 relative flex justify-end">
              <div 
                className="absolute top-0 right-0 bottom-0 bg-gradient-to-l from-red-500 to-red-400 transition-all duration-300"
                style={{ width: `${(enemyHp / enemyMaxHp) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2.5D Arena Container */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-800 to-slate-950">
        
        {/* Background ambient lights */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-500/20 rounded-full blur-[100px]" />

        {/* Isometric World */}
        <div 
          className="relative"
          style={{
            transform: 'rotateX(60deg) rotateZ(-45deg)',
            transformStyle: 'preserve-3d',
            width: GRID_SIZE * CELL_SIZE,
            height: GRID_SIZE * CELL_SIZE,
          }}
        >
          {/* Grid Floor */}
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 shadow-2xl bg-slate-800 border-2 border-slate-700 rounded-lg overflow-hidden">
            {grid.map((cell) => {
              const isSelected = selectedCharId && characters.find(c => c.id === selectedCharId)?.x === cell.x && characters.find(c => c.id === selectedCharId)?.y === cell.y;
              const isTargetable = selectedCharId && !isAnimating && turn === 'player';
              
              return (
                <div 
                  key={`${cell.x}-${cell.y}`}
                  onClick={() => handleCellClick(cell.x, cell.y)}
                  className={`
                    border border-slate-700/50 transition-colors duration-200
                    ${(cell.x + cell.y) % 2 === 0 ? 'bg-slate-700/30' : 'bg-slate-800/30'}
                    ${isSelected ? 'bg-blue-500/40 border-blue-400' : ''}
                    ${isTargetable ? 'hover:bg-white/10 cursor-pointer' : ''}
                  `}
                />
              );
            })}
          </div>

          {/* Characters */}
          <AnimatePresence>
            {characters.filter(c => c.hp > 0 || c.action === 'dead').map(char => {
              const isSelected = char.id === selectedCharId;
              
              // Determine character visual based on type
              let charColor = char.team === 'player' ? 'bg-blue-500' : 'bg-red-500';
              if (char.type === 'mage') charColor = 'bg-purple-500';
              if (char.type === 'boss') charColor = 'bg-orange-600';

              return (
                <motion.div
                  key={char.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    x: char.x * CELL_SIZE, 
                    y: char.y * CELL_SIZE,
                    opacity: char.action === 'dead' ? 0 : 1,
                    scale: char.action === 'dead' ? 0 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="absolute w-[60px] h-[60px] flex items-center justify-center pointer-events-none"
                  style={{ 
                    transformStyle: 'preserve-3d',
                    zIndex: char.x + char.y // Simple depth sorting
                  }}
                >
                  {/* Selection Ring */}
                  {isSelected && (
                    <div className="absolute w-12 h-12 rounded-full border-2 border-blue-400 animate-ping opacity-50" />
                  )}
                  {isSelected && (
                    <div className="absolute w-12 h-12 rounded-full border-2 border-blue-400" />
                  )}

                  {/* Character Sprite (Stands up from the grid) */}
                  <motion.div 
                    className="relative flex flex-col items-center"
                    style={{
                      transform: 'rotateZ(45deg) rotateX(-60deg) translateY(-20px)',
                      transformOrigin: 'bottom center'
                    }}
                    animate={{
                      y: char.action === 'attack' ? (char.facing === 'up' ? -40 : char.facing === 'down' ? 0 : -20) : -20,
                      x: char.action === 'attack' ? (char.facing === 'left' ? -20 : char.facing === 'right' ? 20 : 0) : 0,
                      rotateZ: char.action === 'hurt' ? [0, -15, 15, -15, 15, 0] : 0,
                    }}
                  >
                    {/* Health Bar */}
                    <div className="absolute -top-6 w-12 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                      <div 
                        className={`h-full ${char.team === 'player' ? 'bg-green-400' : 'bg-red-400'}`}
                        style={{ width: `${(char.hp / char.maxHp) * 100}%` }}
                      />
                    </div>
                    
                    {/* Level Badge */}
                    <div className="absolute -top-8 bg-slate-800 text-white text-[8px] font-bold px-1.5 py-0.5 rounded border border-slate-600">
                      Lv.{char.type === 'boss' ? '5' : '1'}
                    </div>

                    {/* Character Body */}
                    <div className={`w-10 h-16 ${charColor} rounded-t-xl rounded-b-md shadow-lg border-2 border-white/10 relative overflow-hidden flex flex-col items-center pt-2`}>
                      {/* Face */}
                      <div className="w-6 h-4 bg-white/20 rounded-full flex justify-center gap-1 items-center">
                        <div className="w-1 h-1 bg-black rounded-full" />
                        <div className="w-1 h-1 bg-black rounded-full" />
                      </div>
                      
                      {/* Weapon/Accessory */}
                      {char.type === 'warrior' && <Sword className="absolute bottom-2 right-[-8px] text-slate-300 transform rotate-45" size={20} />}
                      {char.type === 'mage' && <Zap className="absolute bottom-2 right-[-8px] text-yellow-300" size={18} />}
                      {char.type === 'rogue' && <Sword className="absolute bottom-2 left-[-8px] text-slate-400 transform -rotate-45" size={16} />}
                      {char.type === 'boss' && <Flame className="absolute -top-4 text-orange-400 animate-pulse" size={24} />}
                    </div>
                    
                    {/* Shadow */}
                    <div className="absolute -bottom-2 w-10 h-4 bg-black/40 rounded-full blur-[2px]" style={{ transform: 'rotateX(60deg)' }} />
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom UI - Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center pointer-events-none">
        <div className="bg-slate-800/90 backdrop-blur-md p-4 rounded-2xl border border-slate-700 shadow-2xl pointer-events-auto flex gap-4">
          
          {/* Character Portrait */}
          <div className="w-16 h-16 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center overflow-hidden relative">
            <div className="absolute bottom-0 w-full h-1/2 bg-blue-500/20" />
            <Shield className="text-slate-400" size={32} />
          </div>
          
          {/* Skills */}
          <div className="flex gap-3">
            <button className="w-16 h-16 rounded-xl bg-slate-700 border-2 border-slate-600 hover:border-blue-400 hover:bg-slate-600 transition-all flex flex-col items-center justify-center gap-1 group">
              <Sword className="text-slate-300 group-hover:text-blue-400" size={24} />
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-300">ATTACK</span>
            </button>
            <button className="w-16 h-16 rounded-xl bg-slate-700 border-2 border-slate-600 hover:border-purple-400 hover:bg-slate-600 transition-all flex flex-col items-center justify-center gap-1 group">
              <Zap className="text-slate-300 group-hover:text-purple-400" size={24} />
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-purple-300">SKILL</span>
            </button>
            <button className="w-16 h-16 rounded-xl bg-slate-700 border-2 border-slate-600 hover:border-green-400 hover:bg-slate-600 transition-all flex flex-col items-center justify-center gap-1 group">
              <Heart className="text-slate-300 group-hover:text-green-400" size={24} />
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-green-300">HEAL</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Turn Indicator */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div 
            key={turn}
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className={`px-6 py-2 rounded-full font-black tracking-widest text-sm shadow-lg border-2 ${
              turn === 'player' ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-red-500/20 border-red-500 text-red-400'
            }`}
          >
            {turn === 'player' ? 'YOUR TURN' : 'ENEMY TURN'}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
