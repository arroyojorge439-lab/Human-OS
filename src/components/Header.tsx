import React from 'react';
import { Microscope, Star } from 'lucide-react';
import { SleepEntry } from '../types';

interface HeaderProps {
  coherencia: number;
  sleepHistory: SleepEntry[];
  calculateEvolution: () => string;
  reviewSystemState: () => void;
  handlePayment: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  coherencia, 
  sleepHistory, 
  calculateEvolution, 
  reviewSystemState, 
  handlePayment 
}) => {
  const status = coherencia > 80 ? 'ÓPTIMO' : coherencia > 50 ? 'ESTABLE' : 'CRÍTICO';
  
  return (
    <header className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
      <div>
        <h1 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400">
          Human OS
        </h1>
        <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.4em] mt-2">Espacio de Introspección y Claridad</p>
      </div>
      
      <div className="flex items-center gap-6">
        <button 
          onClick={handlePayment}
          className="px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 text-[8px] font-black uppercase rounded-xl border border-yellow-500/30 hover:from-yellow-500/30 hover:to-amber-500/30 transition-all flex items-center gap-2"
        >
          <Star className="w-3 h-3" /> Premium
        </button>
        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
          <div className={`w-2 h-2 rounded-full ${coherencia > 80 ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'} shadow-[0_0_10px_rgba(74,222,128,0.5)]`}></div>
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Sincronía Vital</span>
        </div>
        {sleepHistory.length > 0 && (
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[8px] text-slate-500 uppercase tracking-widest">Último Descanso</span>
            <span className="text-indigo-400 font-bold text-lg">{sleepHistory[sleepHistory.length - 1].hours}h</span>
          </div>
        )}
        <div className="text-right">
          <p className={`font-bold text-xl leading-none ${parseFloat(calculateEvolution()) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {calculateEvolution()}
          </p>
          <p className="text-[8px] text-slate-500 uppercase tracking-widest mt-1">Crecimiento Personal</p>
        </div>
        <button 
          onClick={reviewSystemState} 
          className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl transition-all border border-white/10 flex items-center gap-2"
        >
          <Microscope className="w-3 h-3" /> Revisión Interna
        </button>
      </div>
    </header>
  );
};
