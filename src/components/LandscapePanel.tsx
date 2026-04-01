import React from 'react';
import { Sparkles, Activity, Moon, Zap, Heart, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { EmotionalState, NeuralSync } from '../types';

interface LandscapePanelProps {
  landscapeDescription: string;
  setLandscapeDescription: (val: string) => void;
  emotionalState: EmotionalState;
  setEmotionalState: React.Dispatch<React.SetStateAction<EmotionalState>>;
  isDynamicMode: boolean;
  setIsDynamicMode: (val: boolean) => void;
  depthLevel: 'suave' | 'medio' | 'profundo';
  setDepthLevel: (val: 'suave' | 'medio' | 'profundo') => void;
  isGeneratingLandscape: boolean;
  handleGenerateLandscape: () => void;
  landscapeImage: string;
  landscapeInterpretation: string;
  blindSpot: string;
  neuralSync: NeuralSync | null;
  applyNeuralSync: () => void;
}

export const LandscapePanel: React.FC<LandscapePanelProps> = ({
  landscapeDescription,
  setLandscapeDescription,
  emotionalState,
  setEmotionalState,
  isDynamicMode,
  setIsDynamicMode,
  depthLevel,
  setDepthLevel,
  isGeneratingLandscape,
  handleGenerateLandscape,
  landscapeImage,
  landscapeInterpretation,
  blindSpot,
  neuralSync,
  applyNeuralSync
}) => {
  return (
    <div className="glass-card p-6 border border-pink-500/10">
      <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center justify-between">
        <span className="flex items-center gap-2"><Sparkles className="text-pink-400 w-4 h-4" /> Paisaje Emocional</span>
        <button 
          onClick={() => setIsDynamicMode(!isDynamicMode)}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition-all ${isDynamicMode ? 'bg-green-500/20 border-green-500/40 text-green-400' : 'bg-white/5 border-white/10 text-slate-500'}`}
        >
          <Activity className="w-3 h-3" />
          <span className="text-[8px]">{isDynamicMode ? 'ON' : 'OFF'}</span>
        </button>
      </h3>
      <div className="flex gap-2 mb-6">
        {(['suave', 'medio', 'profundo'] as const).map(level => (
          <button
            key={level}
            onClick={() => setDepthLevel(level)}
            className={`flex-1 py-1.5 text-[8px] font-black uppercase rounded-lg border transition-all ${depthLevel === level ? 'bg-pink-500/20 border-pink-500/40 text-pink-400' : 'bg-white/5 border-white/10 text-slate-500'}`}
          >
            {level}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-[9px] text-slate-500 uppercase font-bold mb-2 block">Descripción del Paisaje</label>
          <textarea 
            value={landscapeDescription}
            onChange={(e) => setLandscapeDescription(e.target.value.slice(0, 800))}
            placeholder="Describe cómo te sientes hoy como un paisaje..."
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] text-slate-300 focus:outline-none focus:border-pink-500/40 transition-all h-24 resize-none"
          />
          <div className="flex justify-end mt-1">
            <span className="text-[7px] text-slate-600 uppercase font-mono">{landscapeDescription.length}/800</span>
          </div>
        </div>
        {[
          { id: 'calma', label: 'Calma', color: 'accent-blue-400', icon: <Moon className="w-3 h-3 text-blue-400" /> },
          { id: 'energia', label: 'Energía', color: 'accent-yellow-400', icon: <Zap className="w-3 h-3 text-yellow-400" /> },
          { id: 'conexion', label: 'Conexión', color: 'accent-pink-400', icon: <Heart className="w-3 h-3 text-pink-400" /> }
        ].map((emotion) => (
          <div key={emotion.id}>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[9px] text-slate-500 uppercase font-bold flex items-center gap-1">
                {emotion.icon} {emotion.label}
              </label>
              <span className="text-[10px] font-mono text-white">{(emotionalState[emotion.id as keyof EmotionalState] * 100).toFixed(0)}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={emotionalState[emotion.id as keyof EmotionalState]}
              onChange={(e) => setEmotionalState(prev => ({ ...prev, [emotion.id]: parseFloat(e.target.value) }))}
              className={`w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer ${emotion.color}`}
            />
          </div>
        ))}
        
        <button 
          onClick={handleGenerateLandscape}
          disabled={isGeneratingLandscape}
          className="w-full py-4 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-pink-500/20 flex items-center justify-center gap-3"
        >
          {isGeneratingLandscape ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {isGeneratingLandscape ? 'Proyectando...' : 'Proyectar Paisaje'}
        </button>

        {landscapeImage && (
          <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group">
              <img 
                src={landscapeImage} 
                alt="Paisaje Emocional" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <p className="text-[8px] text-white/80 italic line-clamp-2">{landscapeDescription}</p>
              </div>
            </div>
            
            {landscapeInterpretation && (
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[10px] text-slate-300 leading-relaxed markdown-body">
                <ReactMarkdown>{landscapeInterpretation}</ReactMarkdown>
                
                {neuralSync && (
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></div>
                      <span className="text-[8px] font-black uppercase text-blue-400">Sincronía Neuronal Detectada</span>
                    </div>
                    <button 
                      onClick={applyNeuralSync}
                      className="px-3 py-1 bg-blue-500/20 text-blue-400 text-[8px] font-black uppercase rounded-lg border border-blue-500/20 hover:bg-blue-500/40 transition-all"
                    >
                      Aplicar Ajuste
                    </button>
                  </div>
                )}
              </div>
            )}

            {blindSpot && (
              <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl animate-in zoom-in duration-500">
                <h5 className="text-[8px] font-black uppercase tracking-widest mb-1 text-indigo-300">Posible punto ciego:</h5>
                <div className="text-[10px] text-indigo-200 italic markdown-body">
                  <ReactMarkdown>{blindSpot}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
