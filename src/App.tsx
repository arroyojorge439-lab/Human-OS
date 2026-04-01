import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  AreaChart
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

// --- Internal Modules ---
import { 
  EmotionalState, 
  BioState, 
  HistoryEntry, 
  SleepEntry, 
  ChatMessage, 
  Protocol, 
  ActionDecision, 
  StateHistoryPoint, 
  TrendAnalysis, 
  ConsciousnessMetrics, 
  ConsciousnessHistoryPoint,
  NeuralSync
} from './types';
import { callGemini, generateImage } from './services/ai.service';
import { runDecisionEngine, calculateConsciousness } from './lib/models';

// --- Components ---
import { Onboarding } from './components/Onboarding';
import { Header } from './components/Header';
import { BioStats } from './components/BioStats';
import { LandscapePanel } from './components/LandscapePanel';
import { EvolutionaryArtPanel } from './components/EvolutionaryArtPanel';
import { NeuralChat } from './components/NeuralChat';
import { ProtocolsModal } from './components/ProtocolsModal';

const App: React.FC = () => {
  // --- State ---
  const [bioState, setBioState] = useState<BioState>({
    dopamina: 75, enfoque: 80, oxitocina: 65, empatia: 85, energia: 70, estres: 25, coherencia: 90, proposito: 80
  });
  const [neuralSync, setNeuralSync] = useState<NeuralSync | null>(null);
  const [evolutionHistory, setEvolutionHistory] = useState<HistoryEntry[]>([]);
  const [sleepHistory, setSleepHistory] = useState<SleepEntry[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'ai', content: 'Sistemas en línea. Mi análisis indica que tu coherencia es óptima. He activado los protocolos circadianos.' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [sleepHours, setSleepHours] = useState(7);
  const [showProtocols, setShowProtocols] = useState(false);
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [isLoadingProtocols, setIsLoadingProtocols] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [keyError, setKeyError] = useState<string | null>(null);
  const [isCheckingKey, setIsCheckingKey] = useState(true);
  const [emotionalState, setEmotionalState] = useState<EmotionalState>({
    calma: 0.5, energia: 0.5, conexion: 0.5
  });
  const [landscapeDescription, setLandscapeDescription] = useState<string>('');
  const [landscapeImage, setLandscapeImage] = useState<string>('');
  const [landscapeInterpretation, setLandscapeInterpretation] = useState<string>('');
  const [isGeneratingLandscape, setIsGeneratingLandscape] = useState(false);
  const [isDynamicMode, setIsDynamicMode] = useState(false);
  const [depthLevel, setDepthLevel] = useState<'suave' | 'medio' | 'profundo'>('medio');
  const [blindSpot, setBlindSpot] = useState<string>('');
  const [evolutionaryArt, setEvolutionaryArt] = useState<string>('');
  const [isGeneratingArt, setIsGeneratingArt] = useState(false);
  
  // Decision Engine & Memory State
  const [stateHistory, setStateHistory] = useState<StateHistoryPoint[]>([]);
  const [trends, setTrends] = useState<TrendAnalysis[]>([]);
  const [patternAlert, setPatternAlert] = useState<string | null>(null);

  // Consciousness Model State
  const [consciousnessHistory, setConsciousnessHistory] = useState<ConsciousnessHistoryPoint[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleAIError = useCallback((error: any) => {
    const msg = error.message || String(error);
    if (msg.toLowerCase().includes('origin') || msg.toLowerCase().includes('allowed')) {
      setKeyError(msg);
      setHasKey(false);
    }
    console.error("AI Error:", error);
  }, []);

  // --- Memoized Calculations ---
  const decisions = useMemo(() => runDecisionEngine(emotionalState, bioState.estres), [emotionalState, bioState.estres]);
  
  const consciousness = useMemo(() => calculateConsciousness(emotionalState, bioState, stateHistory), [emotionalState, bioState, stateHistory]);

  // --- Initialization ---
  useEffect(() => {
    const savedEvolution = localStorage.getItem('human_evolution_v8');
    const savedSleep = localStorage.getItem('sleep_history_v8');
    if (savedEvolution) setEvolutionHistory(JSON.parse(savedEvolution));
    if (savedSleep) setSleepHistory(JSON.parse(savedSleep));

    const checkKey = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        let selected = false;
        if (window.aistudio?.hasSelectedApiKey) {
          selected = await window.aistudio.hasSelectedApiKey();
        } else {
          selected = !!process.env.API_KEY || !!process.env.GEMINI_API_KEY;
        }
        
        setHasKey(selected);

        // Test call to check for domain restrictions (Origin not allowed)
        if (selected) {
          try {
            await callGemini("test", "test");
          } catch (error: any) {
            handleAIError(error);
          }
        }
      } catch (e) {
        setHasKey(false);
      } finally {
        setIsCheckingKey(false);
      }
    };
    checkKey();
  }, []);

  // --- Sync History ---
  useEffect(() => {
    const newPoint: StateHistoryPoint = {
      timestamp: Date.now(),
      energia: emotionalState.energia,
      calma: emotionalState.calma,
      estres: bioState.estres / 100
    };
    setStateHistory(prev => [...prev.slice(-20), newPoint]);
  }, [emotionalState, bioState.estres]);

  useEffect(() => {
    setConsciousnessHistory(prev => [...prev.slice(-15), { ...consciousness, timestamp: Date.now() }]);
  }, [consciousness]);

  // --- Actions ---
  const addSystemLog = useCallback((msg: string) => {
    setChatMessages(prev => [...prev, { role: 'system', content: msg }]);
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      setKeyError(null);
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  const handlePayment = async () => {
    try {
      addSystemLog("Iniciando pasarela de pago segura...");
      const response = await fetch('/api/payment/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Error al iniciar pago');
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      addSystemLog("Error en la pasarela de pago.");
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    const userMsg = inputMessage;
    setInputMessage('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);

    const sys = `Eres Human OS, un espacio de introspección y claridad. 
    Conexión Interna: ${consciousness.phi.toFixed(2)}.
    Alineación: ${consciousness.realityError.toFixed(2)}.
    Responde con tono humano, empático y reflexivo.
    IMPORTANTE: Al final incluye: [EMOTIONAL_STATE: {"calma": 0.x, "energia": 0.x, "conexion": 0.x}]`;
    
    try {
      const result = await callGemini(userMsg, sys);
      const stateMatch = result.match(/\[EMOTIONAL_STATE: ({.*?})\]/);
      let cleanResult = result;
      if (stateMatch) {
        try {
          const newState = JSON.parse(stateMatch[1]);
          setEmotionalState(prev => ({ ...prev, ...newState }));
          cleanResult = result.replace(/\[EMOTIONAL_STATE: {.*?}\]/, '').trim();
        } catch (e) {}
      }
      setChatMessages(prev => [...prev, { role: 'ai', content: cleanResult }]);
    } catch (error: any) {
      handleAIError(error);
    }
  };

  const handleGenerateLandscape = async () => {
    if (isGeneratingLandscape) return;
    setIsGeneratingLandscape(true);
    setLandscapeImage('');
    setLandscapeInterpretation('');
    
    try {
      let description = landscapeDescription.trim();
      if (!description) {
        const prompt = `Genera una descripción poética de un paisaje emocional: Calma ${emotionalState.calma}, Energía ${emotionalState.energia}, Conexión ${emotionalState.conexion}.`;
        description = await callGemini(prompt, "Arquitecto de Paisajes Emocionales.");
        setLandscapeDescription(description);
      }
      
      const interpretation = await callGemini(description, `Analista Simbólico. Nivel: ${depthLevel}`);
      const blindSpotMatch = interpretation.match(/### Posible punto ciego\n\n([\s\S]*?)(?=\n\n###|$)/i);
      if (blindSpotMatch) {
        setBlindSpot(blindSpotMatch[1].trim());
        setLandscapeInterpretation(interpretation.replace(/### Posible punto ciego\n\n[\s\S]*?(?=\n\n###|$)/i, '').trim());
      } else {
        setLandscapeInterpretation(interpretation);
        setBlindSpot('');
      }

      const img = await generateImage(`Digital art, cinematic landscape: ${description}`);
      if (img) setLandscapeImage(img);
    } catch (error: any) {
      handleAIError(error);
    } finally {
      setIsGeneratingLandscape(false);
    }
  };

  const generateEvolutionaryArt = async () => {
    if (isGeneratingArt) return;
    setIsGeneratingArt(true);
    try {
      const prompt = `Evolutionary Intelligence art. Mood: Calma ${emotionalState.calma}, Vitalidad ${emotionalState.energia}.`;
      const img = await generateImage(prompt);
      if (img) setEvolutionaryArt(img);
    } catch (error: any) {
      handleAIError(error);
    } finally {
      setIsGeneratingArt(false);
    }
  };

  const getBioProtocols = async () => {
    setShowProtocols(true);
    setIsLoadingProtocols(true);
    try {
      const res = await callGemini("Dame 3 sugerencias de bienestar rápidas en JSON: [{\"title\": \"...\", \"desc\": \"...\"}]");
      const jsonStr = res.replace(/```json|```/g, '').trim();
      setProtocols(JSON.parse(jsonStr));
    } catch (error: any) {
      handleAIError(error);
      setProtocols([{ title: "Error", desc: "No se pudieron sincronizar los protocolos." }]);
    } finally {
      setIsLoadingProtocols(false);
    }
  };

  // --- Render Helpers ---
  if (isCheckingKey) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (hasKey === false) {
    const currentOrigin = window.location.origin;
    const isOriginError = keyError?.toLowerCase().includes('origin not allowed');

    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
        <div className="max-w-2xl w-full glass-card p-10 border-red-500/20">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Acceso Restringido</h2>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Error de Configuración de IA</p>
            </div>
          </div>

          <div className="space-y-6 text-slate-400 text-sm leading-relaxed mb-10">
            {isOriginError ? (
              <>
                <p className="text-red-400 font-bold">Tu API Key tiene restricciones de dominio (CORS).</p>
                <p>Para solucionar esto, debes permitir el origen actual en tu consola de Google Cloud:</p>
                
                <div className="bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-[10px] flex justify-between items-center group">
                  <span className="text-blue-400">{currentOrigin}</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(currentOrigin)}
                    className="text-[8px] bg-white/5 hover:bg-white/10 px-2 py-1 rounded border border-white/10 transition-all opacity-0 group-hover:opacity-100"
                  >
                    COPIAR
                  </button>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-300">Pasos para corregir:</p>
                  <ol className="list-decimal list-inside space-y-2 text-xs">
                    <li>Ve a <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="text-blue-400 underline">Google Cloud Console</a>.</li>
                    <li>Busca tu API Key en la sección "Claves de API".</li>
                    <li>En "Restricciones de sitios web", añade el dominio arriba o selecciona "Ninguna" (solo para pruebas).</li>
                    <li>Guarda los cambios y espera 1-2 minutos.</li>
                    <li>Si usas una llave en tus <b>Variables de Entorno (Secrets)</b>, asegúrate de que no tenga restricciones de dominio.</li>
                  </ol>
                </div>
              </>
            ) : (
              <p>No se detectó una API Key válida para activar el núcleo de IA. Por favor, selecciona una llave o configúrala en tus variables de entorno.</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={handleSelectKey}
              className="py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl font-black uppercase tracking-widest border border-red-500/20 transition-all"
            >
              Seleccionar Llave
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest border border-white/10 transition-all"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 p-4 md:p-10 font-sans selection:bg-blue-500/30">
      <Onboarding />
      <div className="max-w-7xl mx-auto">
        <Header 
          coherencia={bioState.coherencia}
          sleepHistory={sleepHistory}
          calculateEvolution={() => "0.0"}
          reviewSystemState={() => {}}
          handlePayment={handlePayment}
        />

        <BioStats bioState={bioState} isScanning={isScanning} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10">
          <LandscapePanel 
            landscapeDescription={landscapeDescription}
            setLandscapeDescription={setLandscapeDescription}
            emotionalState={emotionalState}
            setEmotionalState={setEmotionalState}
            isDynamicMode={isDynamicMode}
            setIsDynamicMode={setIsDynamicMode}
            depthLevel={depthLevel}
            setDepthLevel={setDepthLevel}
            isGeneratingLandscape={isGeneratingLandscape}
            handleGenerateLandscape={handleGenerateLandscape}
            landscapeImage={landscapeImage}
            landscapeInterpretation={landscapeInterpretation}
            blindSpot={blindSpot}
            neuralSync={neuralSync}
            applyNeuralSync={() => setNeuralSync(null)}
          />

          <div className="space-y-10">
            <EvolutionaryArtPanel 
              isGeneratingArt={isGeneratingArt}
              evolutionaryArt={evolutionaryArt}
              generateEvolutionaryArt={generateEvolutionaryArt}
            />
            
            <div className="glass-card p-6 border border-purple-500/10">
              <h3 className="text-xs font-black uppercase tracking-widest mb-6">Métricas de Conciencia</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={[
                    { subject: 'Phi', A: consciousness.phi * 100 },
                    { subject: 'Realidad', A: (1 - consciousness.realityError) * 100 },
                    { subject: 'Voluntad', A: consciousness.willpower * 100 },
                    { subject: 'Estabilidad', A: consciousness.selfStability * 100 }
                  ]}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 8 }} />
                    <Radar dataKey="A" stroke="#a855f7" fill="#a855f7" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <NeuralChat 
            chatMessages={chatMessages}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            sendMessage={sendMessage}
            getBioProtocols={getBioProtocols}
            triggerState={() => {}}
            chatEndRef={chatEndRef}
          />
        </div>

        <ProtocolsModal 
          showProtocols={showProtocols}
          setShowProtocols={setShowProtocols}
          protocols={protocols}
        />
      </div>
    </div>
  );
};

export default App;
