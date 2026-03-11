import React from 'react';
import { ChefHat, User, Crown, HardHat, Glasses, Star } from 'lucide-react';
import { AvatarConfig } from '../types';

interface PlayerAvatarProps {
  config: AvatarConfig;
  size?: number;
  className?: string;
}

export function PlayerAvatar({ config, size = 48, className = '' }: PlayerAvatarProps) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    green: 'bg-emerald-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    pink: 'bg-pink-500',
  };

  const bgColor = colorMap[config.color] || 'bg-blue-500';
  const iconSize = size * 0.5;

  return (
    <div 
      className={`relative rounded-full border-4 border-white shadow-xl flex items-center justify-center ${bgColor} ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Base Character */}
      <User className="text-white/80" size={iconSize} />

      {/* Hat */}
      {config.hat === 'ChefHat' && (
        <ChefHat className="absolute -top-3 text-white drop-shadow-md" size={iconSize * 0.8} />
      )}
      {config.hat === 'Crown' && (
        <Crown className="absolute -top-4 text-yellow-300 drop-shadow-md" size={iconSize * 0.8} />
      )}
      {config.hat === 'HardHat' && (
        <HardHat className="absolute -top-3 text-yellow-500 drop-shadow-md" size={iconSize * 0.8} />
      )}

      {/* Accessory */}
      {config.accessory === 'Glasses' && (
        <Glasses className="absolute top-1/2 -translate-y-1/2 text-slate-800" size={iconSize * 0.7} />
      )}
      {config.accessory === 'Star' && (
        <Star className="absolute -bottom-1 -right-1 text-yellow-400 fill-yellow-400 drop-shadow-sm" size={iconSize * 0.5} />
      )}
    </div>
  );
}
