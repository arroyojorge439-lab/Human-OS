import React from 'react';
import { X, ShieldCheck, Zap, Heart, Brain, Star } from 'lucide-react';
import { Protocol } from '../types';

interface ProtocolsModalProps {
  showProtocols: boolean;
  setShowProtocols: (val: boolean) => void;
  protocols: Protocol[];
}

export const ProtocolsModal: React.FC<ProtocolsModalProps> = ({
  showProtocols,
  setShowProtocols,
  protocols
}) => {
  if (!showProtocols) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="glass-card max-w-2xl w-full p-10 relative overflow-hidden border border-green-500/20">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
        <button 
          onClick={() => setShowProtocols(false)} 
          className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-all text-slate-500 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-green-500/20 rounded-2xl border border-green-500/20">
            <ShieldCheck className="text-green-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Protocolos de Bienestar</h2>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Bio-Regulación Optimizada v8</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
          {protocols.map((p, i) => (
            <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-green-500/20 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-all">
                  {i % 4 === 0 ? <Zap className="w-3 h-3 text-green-400" /> : 
                   i % 4 === 1 ? <Heart className="w-3 h-3 text-red-400" /> :
                   i % 4 === 2 ? <Brain className="w-3 h-3 text-blue-400" /> :
                   <Star className="w-3 h-3 text-purple-400" />}
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest text-green-400">{p.title}</h3>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed font-medium">{p.desc}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-10 flex justify-end">
          <button 
            onClick={() => setShowProtocols(false)} 
            className="px-8 py-3 bg-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-green-500/20 hover:bg-green-500/30 transition-all"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
