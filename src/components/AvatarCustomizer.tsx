import React from 'react';
import { PlayerAvatar } from './PlayerAvatar';
import { AvatarConfig } from '../types';
import { X } from 'lucide-react';

interface AvatarCustomizerProps {
  config: AvatarConfig;
  onUpdate: (config: Partial<AvatarConfig>) => void;
  onClose: () => void;
}

export function AvatarCustomizer({ config, onUpdate, onClose }: AvatarCustomizerProps) {
  const colors = ['blue', 'red', 'green', 'purple', 'orange', 'pink'];
  const hats = ['None', 'ChefHat', 'Crown', 'HardHat'];
  const accessories = ['None', 'Glasses', 'Star'];

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-black text-slate-800 mb-6 text-center">Customize Avatar</h2>

        <div className="flex justify-center mb-8">
          <PlayerAvatar config={config} size={120} className="shadow-2xl" />
        </div>

        <div className="space-y-6">
          {/* Colors */}
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Color</h3>
            <div className="flex flex-wrap gap-3">
              {colors.map(c => (
                <button
                  key={c}
                  onClick={() => onUpdate({ color: c })}
                  className={`w-10 h-10 rounded-full border-4 transition-transform ${config.color === c ? 'border-slate-800 scale-110' : 'border-transparent hover:scale-110'} ${
                    c === 'blue' ? 'bg-blue-500' :
                    c === 'red' ? 'bg-red-500' :
                    c === 'green' ? 'bg-emerald-500' :
                    c === 'purple' ? 'bg-purple-500' :
                    c === 'orange' ? 'bg-orange-500' :
                    'bg-pink-500'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Hats */}
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Headwear</h3>
            <div className="grid grid-cols-4 gap-2">
              {hats.map(h => (
                <button
                  key={h}
                  onClick={() => onUpdate({ hat: h })}
                  className={`py-2 px-1 rounded-xl text-sm font-bold transition-colors ${config.hat === h ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          {/* Accessories */}
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Accessory</h3>
            <div className="grid grid-cols-3 gap-2">
              {accessories.map(a => (
                <button
                  key={a}
                  onClick={() => onUpdate({ accessory: a })}
                  className={`py-2 px-1 rounded-xl text-sm font-bold transition-colors ${config.accessory === a ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-lg transition-colors shadow-lg shadow-teal-600/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
