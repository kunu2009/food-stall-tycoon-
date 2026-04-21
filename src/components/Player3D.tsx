import React from 'react';
import { AvatarConfig } from '../types';

interface Player3DProps {
  config: AvatarConfig;
  isMoving: boolean;
  isServing?: boolean;
  facing?: 'left' | 'right';
}

export function Player3D({ config, isMoving, isServing = false, facing = 'right' }: Player3DProps) {
  const colorMap: Record<string, { body: string, border: string, arm: string, leg: string }> = {
    blue: { body: 'bg-blue-500', border: 'border-blue-700', arm: 'bg-blue-400', leg: 'bg-slate-700' },
    red: { body: 'bg-red-500', border: 'border-red-700', arm: 'bg-red-400', leg: 'bg-slate-700' },
    green: { body: 'bg-emerald-500', border: 'border-emerald-700', arm: 'bg-emerald-400', leg: 'bg-slate-700' },
    purple: { body: 'bg-purple-500', border: 'border-purple-700', arm: 'bg-purple-400', leg: 'bg-slate-700' },
    orange: { body: 'bg-orange-500', border: 'border-orange-700', arm: 'bg-orange-400', leg: 'bg-slate-700' },
    pink: { body: 'bg-pink-500', border: 'border-pink-700', arm: 'bg-pink-400', leg: 'bg-slate-700' },
  };

  const colors = colorMap[config.color] || colorMap.blue;

  const flipClass = facing === 'left' ? '-scale-x-100' : '';
  const serveClass = isServing ? '-translate-y-6 scale-110' : '';

  const leftArmClass = isServing 
    ? 'rotate-[150deg]' 
    : isMoving 
      ? 'animate-[swingArm_0.3s_ease-in-out_infinite_alternate]' 
      : 'rotate-12';

  const rightArmClass = isServing 
    ? '-rotate-[150deg]' 
    : isMoving 
      ? 'animate-[swingArm_0.3s_ease-in-out_infinite_alternate-reverse]' 
      : '-rotate-12';

  const leftLegClass = isMoving 
    ? 'animate-[swingLeg_0.3s_ease-in-out_infinite_alternate]' 
    : 'rotate-0';

  const rightLegClass = isMoving 
    ? 'animate-[swingLeg_0.3s_ease-in-out_infinite_alternate-reverse]' 
    : 'rotate-0';

  return (
    <>
      <style>{`
        @keyframes swingArm {
          0% { transform: rotate(-40deg); }
          100% { transform: rotate(40deg); }
        }
        @keyframes swingLeg {
          0% { transform: rotate(-30deg); }
          100% { transform: rotate(30deg); }
        }
        @keyframes walkBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes serveAction {
          0% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.1); }
          100% { transform: translateY(0) scale(1); }
        }
      `}</style>
      <div className={`relative flex flex-col items-center transition-all duration-200 ${flipClass} ${serveClass} ${isMoving && !isServing ? 'animate-[walkBounce_0.3s_ease-in-out_infinite]' : ''} ${isServing ? 'animate-[serveAction_0.3s_ease-in-out]' : ''}`}>
        {/* Hat */}
        {config.hat === 'ChefHat' && (
          <div className="absolute -top-6 w-10 h-8 bg-white rounded-t-xl border-b-4 border-slate-200 shadow-sm z-30"></div>
        )}
        {config.hat === 'Crown' && (
          <div className="absolute -top-5 w-10 h-6 bg-yellow-400 rounded-t-sm border-b-4 border-yellow-600 shadow-sm z-30 flex justify-around items-start">
            <div className="w-2 h-2 bg-yellow-400 rounded-full -mt-1"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full -mt-2"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full -mt-1"></div>
          </div>
        )}
        {config.hat === 'HardHat' && (
          <div className="absolute -top-4 w-12 h-6 bg-yellow-500 rounded-t-full border-b-4 border-yellow-600 shadow-sm z-30"></div>
        )}

        {/* Head */}
        <div className="w-12 h-12 bg-amber-200 rounded-xl border-b-4 border-amber-300 shadow-md z-20 flex flex-col items-center justify-center relative">
          {/* Eyes */}
          <div className={`flex gap-2 mt-1 transition-transform ${isServing ? '-translate-y-1' : ''}`}>
            <div className={`w-2 h-3 bg-slate-800 rounded-full ${isServing ? 'scale-y-50' : ''}`}></div>
            <div className={`w-2 h-3 bg-slate-800 rounded-full ${isServing ? 'scale-y-50' : ''}`}></div>
          </div>
          
          {/* Accessory */}
          {config.accessory === 'Glasses' && (
            <div className={`absolute top-4 flex gap-1 transition-transform ${isServing ? '-translate-y-1' : ''}`}>
              <div className="w-4 h-4 border-2 border-slate-800 rounded-full"></div>
              <div className="w-4 h-4 border-2 border-slate-800 rounded-full"></div>
            </div>
          )}
        </div>

        {/* Body */}
        <div className={`w-10 h-10 ${colors.body} rounded-b-xl border-b-4 ${colors.border} -mt-2 z-10 relative shadow-inner`}>
          {/* Arms */}
          <div className={`absolute top-2 -left-2 w-3 h-8 ${colors.arm} rounded-full border-b-2 ${colors.border} transition-transform duration-150 ${leftArmClass}`} style={{ transformOrigin: 'top center' }}></div>
          <div className={`absolute top-2 -right-2 w-3 h-8 ${colors.arm} rounded-full border-b-2 ${colors.border} transition-transform duration-150 ${rightArmClass}`} style={{ transformOrigin: 'top center' }}></div>
          
          {/* Star Accessory */}
          {config.accessory === 'Star' && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-yellow-300 text-xs">★</div>
          )}
        </div>

        {/* Legs */}
        <div className="flex gap-2 -mt-1 z-0">
          <div className={`w-3 h-6 ${colors.leg} rounded-b-full transition-transform duration-150 ${leftLegClass}`} style={{ transformOrigin: 'top center' }}></div>
          <div className={`w-3 h-6 ${colors.leg} rounded-b-full transition-transform duration-150 ${rightLegClass}`} style={{ transformOrigin: 'top center' }}></div>
        </div>
      </div>
    </>
  );
}
