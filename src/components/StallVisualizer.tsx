import React from 'react';
import { StallType, Weather } from '../types';
import { Cloud, Sun, CloudRain, Flame, Megaphone, Moon, Star, Coffee, Utensils, Users } from 'lucide-react';

interface Props {
  stall: StallType;
  upgrades: string[];
  weather: Weather;
  time: number;
}

export function StallVisualizer({ stall, upgrades, weather, time }: Props) {
  const isNight = time >= 18 * 60 || time < 6 * 60;
  const isRainy = weather === 'Rainy';

  let skyClass = 'bg-sky-200 border-sky-300';
  if (isNight) skyClass = 'bg-indigo-950 border-indigo-900';
  else if (isRainy) skyClass = 'bg-slate-400 border-slate-500';

  return (
    <div style={{ perspective: '1000px' }}>
      <div className={`relative w-full h-64 rounded-3xl overflow-hidden shadow-2xl border-4 transition-all duration-1000 ${skyClass}`} style={{ transformStyle: 'preserve-3d', transform: 'rotateX(2deg) rotateY(-2deg)' }}>
        
        {/* Sky / Weather Elements */}
      <div className="absolute top-6 left-8 transition-opacity duration-1000">
         {!isNight && weather === 'Sunny' && <Sun className="text-yellow-400 animate-[spin_10s_linear_infinite]" size={56} fill="currentColor" />}
         {!isNight && weather === 'Rainy' && <CloudRain className="text-slate-600" size={56} fill="currentColor" />}
         {!isNight && weather === 'Hot' && <Flame className="text-orange-500" size={56} fill="currentColor" />}
         {!isNight && weather === 'Pleasant' && <Cloud className="text-white opacity-90 animate-[bounce_3s_ease-in-out_infinite]" size={56} fill="currentColor" />}
         {isNight && <Moon className="text-yellow-100 animate-pulse" size={48} fill="currentColor" />}
      </div>

      {/* Stars at night */}
      {isNight && !isRainy && (
        <>
          <Star className="text-white absolute top-8 right-1/4 opacity-50 animate-pulse" size={12} fill="currentColor" />
          <Star className="text-white absolute top-16 right-1/3 opacity-30 animate-pulse delay-75" size={8} fill="currentColor" />
          <Star className="text-white absolute top-10 right-1/2 opacity-40 animate-pulse delay-150" size={10} fill="currentColor" />
        </>
      )}

      {/* Ground */}
      <div className="absolute bottom-0 w-full h-16 bg-stone-400 border-t-4 border-stone-500 flex items-center justify-around opacity-80">
        <div className="w-16 h-2 bg-stone-500 rounded-full"></div>
        <div className="w-24 h-2 bg-stone-500 rounded-full"></div>
        <div className="w-12 h-2 bg-stone-500 rounded-full"></div>
      </div>

      {/* Upgrades: Signboard */}
      {(upgrades.includes('marketing_1') || upgrades.includes('marketing_2')) && (
        <div className="absolute bottom-12 left-8 md:left-16 w-12 h-16 bg-amber-200 border-4 border-amber-700 rounded-sm flex items-center justify-center transform -rotate-6 shadow-lg z-10">
          <Megaphone size={20} className="text-amber-800 animate-bounce" />
        </div>
      )}

      {/* Upgrades: Chotu (Helper) */}
      {upgrades.includes('auto_chai') && (
        <div className="absolute bottom-14 right-1/4 md:right-1/3 w-10 h-16 bg-blue-600 rounded-t-full flex flex-col items-center justify-start pt-2 shadow-md z-10 animate-[bounce_2s_ease-in-out_infinite]">
           <div className="w-6 h-6 bg-amber-200 rounded-full border-2 border-amber-300 flex items-center justify-center">
             <div className="w-1 h-1 bg-amber-800 rounded-full"></div>
           </div>
           <div className="w-8 h-2 bg-blue-700 mt-2 rounded-full opacity-50"></div>
        </div>
      )}

      {/* Stall Structures */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20">
        
        {stall === 'Chai Tapri' && (
          <div className="relative w-36 h-24 bg-amber-800 rounded-t-sm border-t-4 border-amber-600 shadow-xl flex justify-center">
            <div className="absolute -top-20 w-48 h-20 bg-blue-500 rounded-t-full opacity-95 border-b-4 border-blue-700 shadow-md"></div>
            <div className="absolute -top-20 left-4 w-1.5 h-20 bg-amber-900"></div>
            <div className="absolute -top-20 right-4 w-1.5 h-20 bg-amber-900"></div>
            
            {/* Stove and Kettle */}
            <div className="absolute -top-6 left-6 w-8 h-8 bg-slate-300 rounded-t-md border-2 border-slate-400">
              <div className="absolute -top-4 left-2 w-4 h-4 bg-slate-200 rounded-full border border-slate-400"></div>
              {/* Steam */}
              <div className="absolute -top-8 left-3 w-2 h-4 bg-white/50 rounded-full animate-[ping_1.5s_ease-in-out_infinite]"></div>
            </div>
            
            <div className="absolute -top-2 right-8 w-3 h-3 bg-white rounded-full shadow-sm"></div>
            <div className="absolute -top-2 right-12 w-3 h-3 bg-white rounded-full shadow-sm"></div>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-amber-900/50">
              <Coffee size={24} />
            </div>
          </div>
        )}

        {stall === 'Pani Puri Cart' && (
          <div className="relative w-48 h-28 bg-emerald-600 rounded-t-lg border-t-4 border-emerald-400 shadow-xl">
            <div className="absolute -bottom-5 left-4 w-12 h-12 bg-slate-800 rounded-full border-4 border-slate-300 shadow-md flex items-center justify-center animate-[spin_4s_linear_infinite]">
              <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
            </div>
            <div className="absolute -bottom-5 right-4 w-12 h-12 bg-slate-800 rounded-full border-4 border-slate-300 shadow-md flex items-center justify-center animate-[spin_4s_linear_infinite]">
              <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
            </div>
            <div className="absolute -top-20 -left-2 w-52 h-14 bg-gradient-to-r from-yellow-400 via-emerald-500 to-yellow-400 rounded-t-xl border-b-4 border-yellow-600 shadow-md"></div>
            <div className="absolute -top-20 left-2 w-1.5 h-20 bg-slate-400"></div>
            <div className="absolute -top-20 right-2 w-1.5 h-20 bg-slate-400"></div>
            
            {/* Pani Puri Pots */}
            <div className="absolute -top-8 left-8 w-12 h-10 bg-emerald-800 rounded-full border-2 border-emerald-900 shadow-inner overflow-hidden">
              <div className="w-full h-full bg-emerald-500/30 rounded-full mt-2"></div>
            </div>
            <div className="absolute -top-6 right-10 w-10 h-8 bg-amber-700 rounded-full border-2 border-amber-900 shadow-inner overflow-hidden">
              <div className="w-full h-full bg-amber-500/30 rounded-full mt-2"></div>
            </div>
            
            {/* Puris */}
            <div className="absolute -top-4 left-24 w-8 h-6 bg-yellow-200 rounded-t-full border border-yellow-400 flex flex-wrap justify-center overflow-hidden pt-1">
              <div className="w-2 h-2 bg-yellow-300 rounded-full m-0.5"></div>
              <div className="w-2 h-2 bg-yellow-300 rounded-full m-0.5"></div>
              <div className="w-2 h-2 bg-yellow-300 rounded-full m-0.5"></div>
            </div>
          </div>
        )}

        {stall === 'Snack Stall' && (
          <div className="relative w-56 h-32 bg-orange-600 rounded-t-md border-t-4 border-orange-400 shadow-xl">
            <div className="absolute -top-24 -left-4 w-64 h-20 bg-red-500 rounded-t-2xl border-b-4 border-red-700 flex overflow-hidden shadow-md">
               <div className="w-1/4 h-full bg-white opacity-20"></div>
               <div className="w-1/4 h-full bg-transparent"></div>
               <div className="w-1/4 h-full bg-white opacity-20"></div>
               <div className="w-1/4 h-full bg-transparent"></div>
            </div>
            <div className="absolute -top-24 left-0 w-2 h-24 bg-slate-700"></div>
            <div className="absolute -top-24 right-0 w-2 h-24 bg-slate-700"></div>
            
            {/* Display Case */}
            <div className="absolute -top-12 right-4 w-24 h-14 bg-sky-200/60 border-4 border-slate-300 rounded-sm flex items-end justify-around pb-1">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <div className="w-4 h-4 bg-yellow-600 rounded-full"></div>
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            </div>
            
            {/* Fryer */}
            <div className="absolute -top-8 left-6 w-14 h-10 bg-slate-800 rounded-b-lg border-2 border-slate-600">
               <div className="w-full h-2 bg-orange-400 absolute top-0 opacity-80"></div>
               <div className="absolute -top-4 left-4 w-2 h-2 bg-white/40 rounded-full animate-[ping_1s_ease-in-out_infinite]"></div>
               <div className="absolute -top-6 left-8 w-2 h-2 bg-white/40 rounded-full animate-[ping_1.2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        )}

        {stall === 'Dosa Camp' && (
          <div className="relative w-64 h-28 bg-slate-100 border-t-8 border-slate-300 rounded-t-md shadow-xl flex justify-center">
            <div className="absolute -top-28 bg-yellow-400 px-8 py-2 rounded-lg border-4 border-yellow-500 shadow-lg z-10">
              <span className="font-black text-red-600 tracking-widest text-lg">DOSA CAMP</span>
            </div>
            <div className="absolute -top-24 left-4 w-2 h-24 bg-slate-400"></div>
            <div className="absolute -top-24 right-4 w-2 h-24 bg-slate-400"></div>
            
            {/* Tawa (Griddle) */}
            <div className="absolute -top-2 left-8 w-28 h-4 bg-slate-900 rounded-t-full shadow-inner flex justify-center items-end">
              <div className="w-16 h-1 bg-yellow-100/50 rounded-full mb-1"></div>
            </div>
            
            {/* Containers */}
            <div className="absolute -top-8 right-8 w-10 h-10 bg-white border-2 border-slate-300 rounded-t-lg flex justify-center items-end pb-1">
              <div className="w-6 h-2 bg-green-500 rounded-full"></div>
            </div>
            <div className="absolute -top-6 right-24 w-8 h-8 bg-white border-2 border-slate-300 rounded-t-lg flex justify-center items-end pb-1">
              <div className="w-4 h-2 bg-red-500 rounded-full"></div>
            </div>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-slate-300">
              <Utensils size={32} />
            </div>
          </div>
        )}

        {stall === 'Biryani Handi' && (
          <div className="relative w-64 h-24 bg-stone-800 rounded-t-md border-t-4 border-stone-600 shadow-xl flex justify-around items-end pb-2 px-4">
            
            {/* Handi 1 */}
            <div className="absolute -top-16 left-8 w-20 h-20 bg-amber-600 rounded-b-3xl rounded-t-lg border-4 border-amber-700 shadow-inner flex justify-center">
               <div className="w-12 h-2 bg-amber-800 absolute top-0 rounded-b-full"></div>
               <div className="absolute -top-6 w-4 h-6 bg-white/30 rounded-full animate-[ping_2s_ease-in-out_infinite]"></div>
            </div>
            
            {/* Handi 2 */}
            <div className="absolute -top-14 right-10 w-16 h-16 bg-amber-600 rounded-b-3xl rounded-t-lg border-4 border-amber-700 shadow-inner flex justify-center">
               <div className="w-10 h-2 bg-amber-800 absolute top-0 rounded-b-full"></div>
               <div className="absolute -top-4 w-3 h-5 bg-white/30 rounded-full animate-[ping_2.5s_ease-in-out_infinite]"></div>
            </div>
            
            <Flame className="text-orange-500 absolute -top-4 left-14 animate-pulse" size={28} />
            <Flame className="text-orange-500 absolute -top-2 right-14 animate-pulse" size={24} />
            
            <div className="absolute -top-32 bg-emerald-700 px-8 py-3 rounded-sm border-2 border-emerald-900 shadow-lg z-10">
              <span className="font-bold text-white tracking-widest text-lg">ROYAL BIRYANI</span>
            </div>
            <div className="absolute -top-32 left-4 w-1.5 h-32 bg-stone-500"></div>
            <div className="absolute -top-32 right-4 w-1.5 h-32 bg-stone-500"></div>
          </div>
        )}

        {stall === 'Food Truck' && (
          <div className="relative w-80 h-40 bg-teal-500 rounded-2xl border-b-8 border-teal-700 shadow-2xl">
            {/* Wheels */}
            <div className="absolute -bottom-6 left-10 w-14 h-14 bg-slate-800 rounded-full border-4 border-slate-300 shadow-md flex items-center justify-center">
              <div className="w-4 h-4 bg-slate-400 rounded-full"></div>
            </div>
            <div className="absolute -bottom-6 right-10 w-14 h-14 bg-slate-800 rounded-full border-4 border-slate-300 shadow-md flex items-center justify-center">
              <div className="w-4 h-4 bg-slate-400 rounded-full"></div>
            </div>
            
            {/* Service Window */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-48 h-20 bg-slate-900 rounded-md border-4 border-slate-300 flex items-center justify-center overflow-hidden shadow-inner">
               <div className="w-full h-1/2 bg-slate-800 absolute top-0"></div>
               {/* Vendor inside */}
               <div className="absolute bottom-0 w-10 h-12 bg-slate-700 rounded-t-full flex justify-center pt-2">
                 <div className="w-4 h-4 bg-amber-200 rounded-full"></div>
               </div>
               {/* Counter items */}
               <div className="absolute bottom-0 left-4 w-6 h-4 bg-red-500 rounded-t-sm"></div>
               <div className="absolute bottom-0 right-4 w-8 h-4 bg-yellow-500 rounded-t-sm"></div>
            </div>
            
            {/* Awning */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-56 h-5 bg-rose-500 rounded-t-md flex overflow-hidden shadow-md">
               <div className="w-1/4 h-full bg-white opacity-30"></div>
               <div className="w-1/4 h-full bg-transparent"></div>
               <div className="w-1/4 h-full bg-white opacity-30"></div>
               <div className="w-1/4 h-full bg-transparent"></div>
            </div>
            
            {/* Lights */}
            <div className="absolute top-24 -right-1 w-3 h-8 bg-yellow-400 rounded-l-full shadow-[0_0_10px_rgba(250,204,21,0.8)] animate-pulse"></div>
            <div className="absolute top-24 -left-1 w-3 h-8 bg-red-500 rounded-r-full"></div>
            
            {/* Sign */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 px-6 py-2 rounded-t-xl border-2 border-slate-700 shadow-lg flex items-center gap-2">
              <Star className="text-yellow-400" size={16} fill="currentColor" />
              <span className="font-black text-teal-400 text-lg tracking-widest">STREET KING</span>
              <Star className="text-yellow-400" size={16} fill="currentColor" />
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
