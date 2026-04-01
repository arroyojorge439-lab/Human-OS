import React from 'react';
import { Sparkles, Send } from 'lucide-react';
import { ChatMessage } from '../types';

interface NeuralChatProps {
  chatMessages: ChatMessage[];
  inputMessage: string;
  setInputMessage: (val: string) => void;
  sendMessage: () => void;
  getBioProtocols: () => void;
  triggerState: (mode: string) => void;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}

export const NeuralChat: React.FC<NeuralChatProps> = ({
  chatMessages,
  inputMessage,
  setInputMessage,
  sendMessage,
  getBioProtocols,
  triggerState,
  chatEndRef
}) => {
  return (
    <div className="glass-card p-8 flex flex-col lg:col-span-2 relative overflow-hidden">
      <div className="flex justify-between items-center mb-8 relative z-10">
        <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
          <Sparkles className="text-purple-400 w-4 h-4" />
          Núcleo de Inteligencia Gemini
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={getBioProtocols} 
            className="px-4 py-2 bg-green-500/10 text-green-400 text-[8px] font-black uppercase rounded-xl border border-green-500/20 hover:bg-green-500/20 transition-all"
          >
            Bienestar
          </button>
          <button 
            onClick={() => triggerState('meditacion')} 
            className="px-4 py-2 bg-purple-500/10 text-purple-400 text-[8px] font-black uppercase rounded-xl border border-purple-500/20 hover:bg-purple-500/20 transition-all"
          >
            Calma
          </button>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto mb-6 space-y-4 pr-4 h-[350px] custom-scrollbar text-xs relative z-10">
        {chatMessages.map((msg, i) => (
          <React.Fragment key={i}>
            {msg.role === 'system' ? (
              <div className="text-[9px] text-indigo-400/50 font-mono text-center py-2 uppercase tracking-[0.2em] border-y border-white/5 my-4">
                {msg.content}
              </div>
            ) : (
              <div className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] shadow-lg flex-shrink-0">IA</div>
                )}
                <div className={`${msg.role === 'user' ? 'bg-blue-500/10 border-blue-500/10' : 'bg-white/5 border-white/5'} p-4 rounded-3xl border text-slate-300 max-w-[85%] leading-relaxed`}>
                  {msg.content}
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-3 relative z-10">
        <input 
          type="text" 
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Consulta sobre tu bio-regulación..." 
          className="flex-grow bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-purple-400 transition-all text-white"
        />
        <button 
          onClick={sendMessage} 
          className="p-4 bg-purple-500/20 rounded-2xl hover:bg-purple-500/40 border border-purple-500/20 transition-all text-purple-400"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
