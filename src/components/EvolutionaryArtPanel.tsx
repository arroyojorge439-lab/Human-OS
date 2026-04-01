import React from 'react';
import { Dna, Loader2, Download, Activity, Sparkles } from 'lucide-react';

interface EvolutionaryArtPanelProps {
  isGeneratingArt: boolean;
  evolutionaryArt: string;
  generateEvolutionaryArt: () => void;
}

export const EvolutionaryArtPanel: React.FC<EvolutionaryArtPanelProps> = ({
  isGeneratingArt,
  evolutionaryArt,
  generateEvolutionaryArt
}) => {
  return (
    <div className="glass-card p-6 border border-blue-500/20 overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center justify-between relative z-10">
        <span className="flex items-center gap-2"><Dna className="text-blue-400 w-4 h-4" /> Arte Evolutivo</span>
        <span className="text-[8px] text-slate-500 font-mono">v3.1 Flash Image</span>
      </h3>
      
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 mb-6 z-10">
        {isGeneratingArt && !evolutionaryArt ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40 backdrop-blur-sm">
            <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
            <div className="text-center">
              <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.3em] mb-1">Sintetizando...</p>
              <p className="text-[8px] text-slate-500 uppercase tracking-widest">Inteligencia Evolutiva v8</p>
            </div>
          </div>
        ) : evolutionaryArt ? (
          <div className="relative group/art h-full">
            <img 
              src={evolutionaryArt} 
              alt="Inteligencia Evolutiva" 
              className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-1000"
              referrerPolicy="no-referrer"
            />
            <a 
              href={evolutionaryArt} 
              download="human-os-evolutionary-art.png"
              className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 text-white rounded-lg opacity-0 group-hover/art:opacity-100 transition-opacity"
              title="Descargar Arte"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <Activity className="w-12 h-12 text-slate-700 mb-4" />
            <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed">
              Presiona el botón para generar una representación visual de la <span className="text-blue-400 font-bold">Inteligencia Evolutiva</span>.
            </p>
          </div>
        )}
      </div>

      <button 
        onClick={generateEvolutionaryArt}
        disabled={isGeneratingArt}
        className="w-full py-4 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-blue-500/20 relative z-10 flex items-center justify-center gap-3"
      >
        {isGeneratingArt ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {isGeneratingArt ? 'Sintetizando...' : 'Generar Arte Evolutivo'}
      </button>
    </div>
  );
};
