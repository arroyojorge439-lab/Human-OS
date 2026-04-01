import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, 
  Heart, 
  Zap, 
  Star, 
  Moon, 
  Sparkles, 
  Send, 
  Microscope, 
  Dna, 
  X,
  AlertTriangle,
  Loader2,
  Activity,
  Download
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
import ReactMarkdown from 'react-markdown';
import { Onboarding } from './components/Onboarding.tsx';

// --- Types ---
interface EmotionalState {
  calma: number;
  energia: number;
  conexion: number;
}

interface BioState {
  dopamina: number;
  enfoque: number;
  oxitocina: number;
  empatia: number;
  energia: number;
  estres: number;
  coherencia: number;
  proposito: number;
}

interface HistoryEntry {
  coherencia: number;
  date: number;
}

interface SleepEntry {
  hours: number;
  date: number;
}

interface ChatMessage {
  role: 'user' | 'ai' | 'system';
  content: string;
}

interface Protocol {
  title: string;
  desc: string;
}

// --- Decision Engine Types ---
type ActionType = "descansar" | "enfocarse" | "evitar" | "socializar";

interface ActionDecision {
  action: ActionType;
  probability: number;
}

interface StateHistoryPoint {
  timestamp: number;
  energia: number;
  calma: number;
  estres: number;
}

interface TrendAnalysis {
  label: string;
  trend: 'up' | 'down' | 'stable';
  value: string;
}

interface ConsciousnessMetrics {
  phi: number;
  realityError: number;
  willpower: number;
  selfStability: number;
}

interface ConsciousnessHistoryPoint extends ConsciousnessMetrics {
  timestamp: number;
}

// --- Global Types for AI Studio ---
declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

interface NeuralSync {
  dopamina?: number;
  enfoque?: number;
  oxitocina?: number;
  empatia?: number;
  energia?: number;
  estres?: number;
  coherencia?: number;
  proposito?: number;
}

const App: React.FC = () => {
  // --- State ---
  const [bioState, setBioState] = useState<BioState>({
    dopamina: 75, enfoque: 80, oxitocina: 65, empatia: 85, energia: 70, estres: 25, coherencia: 90, proposito: 80
  });
  const [neuralSync, setNeuralSync] = useState<NeuralSync | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);
  const [requestCount, setRequestCount] = useState<number>(0);
  const [evolutionHistory, setEvolutionHistory] = useState<HistoryEntry[]>([]);
  const [sleepHistory, setSleepHistory] = useState<SleepEntry[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'ai', content: 'Sistemas en línea. Mi análisis indica que tu coherencia es óptima. He activado los protocolos circadianos.' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [sleepHours, setSleepHours] = useState(7);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  
  // Decision Engine State
  const [decisions, setDecisions] = useState<ActionDecision[]>([]);
  const [systemBeta, setSystemBeta] = useState<number>(0);
  
  // Dynamic Memory State
  const [stateHistory, setStateHistory] = useState<StateHistoryPoint[]>([]);
  const [trends, setTrends] = useState<TrendAnalysis[]>([]);
  const [patternAlert, setPatternAlert] = useState<string | null>(null);

  // Consciousness Model State
  const [consciousness, setConsciousness] = useState<ConsciousnessMetrics>({
    phi: 0,
    realityError: 0,
    willpower: 0,
    selfStability: 0
  });
  const [consciousnessHistory, setConsciousnessHistory] = useState<ConsciousnessHistoryPoint[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- Initialization ---
  useEffect(() => {
    const savedEvolution = localStorage.getItem('human_evolution_v8');
    const savedSleep = localStorage.getItem('sleep_history_v8');
    if (savedEvolution) setEvolutionHistory(JSON.parse(savedEvolution));
    if (savedSleep) setSleepHistory(JSON.parse(savedSleep));

    const checkKey = async () => {
      try {
        // Small delay to ensure window.aistudio is ready
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
          const selected = await window.aistudio.hasSelectedApiKey();
          setHasKey(selected);
          
          // If selected, we should also check if it's actually working by making a tiny test call
          // but we'll defer that to the first actual use to avoid unnecessary calls.
        } else {
          // Fallback for non-AI Studio environments (local dev)
          const localKey = !!process.env.GEMINI_API_KEY || !!process.env.API_KEY;
          setHasKey(localKey);
        }
      } catch (e) {
        console.error("Error checking API key:", e);
        setHasKey(false);
      } finally {
        setIsCheckingKey(false);
      }
    };
    checkKey();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      addSystemLog("ACCESO PREMIUM ACTIVADO. BIENVENIDO AL SIGUIENTE NIVEL.");
      window.history.replaceState({}, document.title, "/");
    } else if (params.get('payment') === 'cancel') {
      addSystemLog("TRANSACCIÓN CANCELADA.");
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  // --- SEO Dinámico ---
  useEffect(() => {
    const status = bioState.coherencia > 80 ? 'ÓPTIMO' : bioState.coherencia > 50 ? 'ESTABLE' : 'CRÍTICO';
    document.title = `Human OS | ${status} (${Math.round(bioState.coherencia)}%)`;
  }, [bioState.coherencia]);

  // --- Evolución Dinámica ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isDynamicMode) {
      interval = setInterval(() => {
        setEmotionalState(prev => {
          const drift = () => (Math.random() * 0.1 - 0.05);
          return {
            calma: Math.max(0, Math.min(1, prev.calma + drift())),
            energia: Math.max(0, Math.min(1, prev.energia + drift())),
            conexion: Math.max(0, Math.min(1, prev.conexion + drift()))
          };
        });
      }, 15000);
    }
    return () => clearInterval(interval);
  }, [isDynamicMode]);

  useEffect(() => {
    if (isDynamicMode && !isGeneratingLandscape) {
      handleGenerateLandscape();
    }
  }, [emotionalState, isDynamicMode]);

  useEffect(() => {
    runDecisionEngine();
    updateDynamicMemory();
  }, [emotionalState, bioState.estres]);

  useEffect(() => {
    analyzeTrends();
    calculateConsciousness();
  }, [stateHistory, bioState, emotionalState]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // --- AI Integration ---
  const callGemini = async (prompt: string, role: string = "") => {
    try {
      const response = await fetch('/api/interpret/simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, role }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        const errMsg = errorData.error || 'API Error';
        
        // Detect domain restrictions
        if (errMsg.toLowerCase().includes('origin not allowed') || errMsg.toLowerCase().includes('api key not valid')) {
          setKeyError(errMsg);
          setHasKey(false);
        }
        
        throw new Error(errMsg);
      }
      const data = await response.json();
      return data.result || "Error en la respuesta.";
    } catch (error: any) {
      console.error("Gemini Error:", error);
      const msg = error.message || "No pudimos procesar la respuesta en este momento.";
      if (msg.toLowerCase().includes('origin not allowed')) {
        setKeyError(msg);
        setHasKey(false);
      }
      return msg;
    }
  };

  // --- Actions ---
  const handleSelectKey = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
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
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al iniciar pago');
      }
      
      const { url } = await response.json();
      window.location.href = url;
    } catch (error: any) {
      console.error("Payment Error:", error);
      addSystemLog("Error en la pasarela de pago.");
    }
  };

  const logSleep = async () => {
    const entry: SleepEntry = { hours: sleepHours, date: Date.now() };
    const newSleepHistory = [...sleepHistory, entry];
    setSleepHistory(newSleepHistory);
    localStorage.setItem('sleep_history_v8', JSON.stringify(newSleepHistory));

    // Impacto Biológico
    let newState = { ...bioState };
    if (sleepHours < 6) {
      newState.energia -= 20;
      newState.dopamina -= 15;
      newState.estres += 15;
    } else if (sleepHours > 8) {
      newState.energia += 15;
      newState.dopamina += 10;
      newState.estres -= 10;
    } else {
      newState.energia += 5;
      newState.estres -= 5;
    }

    // Clamp values
    Object.keys(newState).forEach(k => {
      const key = k as keyof BioState;
      newState[key] = Math.max(5, Math.min(100, newState[key]));
    });
    setBioState(newState);

    addSystemLog(`Descanso registrado: ${sleepHours}h. Recalibrando el sistema...`);

    const prompt = `El usuario durmió ${sleepHours} horas. Su energía actual es ${newState.energia}%. Dame una sugerencia suave de bienestar para su mañana basada en este descanso.`;
    const advice = await callGemini(prompt, "Acompañante de bienestar.");
    setChatMessages(prev => [...prev, { role: 'ai', content: `Sugerencia Matutina: ${advice}` }]);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    const userMsg = inputMessage;
    setInputMessage('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);

    const lastSleep = sleepHistory.length ? sleepHistory[sleepHistory.length - 1].hours : 'N/A';
    const sys = `Eres Human OS, un espacio de introspección y claridad. Estado: Energía ${bioState.energia}%, Sueño ${lastSleep}h.
    Conexión Interna: ${consciousness.phi.toFixed(2)}.
    Alineación: ${consciousness.realityError.toFixed(2)}.
    Capacidad de Acción: ${consciousness.willpower.toFixed(2)}.
    Responde con tono humano, empático y reflexivo. No uses tecnicismos ni diagnostiques.
    IMPORTANTE: Al final de tu respuesta, incluye SIEMPRE un bloque de datos con el estado emocional inferido del usuario en este formato:
    [EMOTIONAL_STATE: {"calma": 0.x, "energia": 0.x, "conexion": 0.x}]
    Usa valores entre 0 y 1 basados en el tono y contenido del mensaje del usuario.`;
    
    const result = await callGemini(userMsg, sys);

    // Extraer estado emocional si existe
    const stateMatch = result.match(/\[EMOTIONAL_STATE: ({.*?})\]/);
    let cleanResult = result;
    if (stateMatch) {
      try {
        const newState = JSON.parse(stateMatch[1]);
        setEmotionalState(prev => ({ ...prev, ...newState }));
        cleanResult = result.replace(/\[EMOTIONAL_STATE: {.*?}\]/, '').trim();
      } catch (e) {
        console.error("Error parsing inferred state:", e);
      }
    }

    setChatMessages(prev => [...prev, { role: 'ai', content: cleanResult }]);

    // Evolution point
    const newHistory = [...evolutionHistory, { coherencia: bioState.coherencia, date: Date.now() }];
    setEvolutionHistory(newHistory);
    localStorage.setItem('human_evolution_v8', JSON.stringify(newHistory));
  };

  const getBioProtocols = async () => {
    setIsModalOpen(true);
    setIsLoadingProtocols(true);
    addSystemLog("Buscando sugerencias de bienestar...");
    const lastSleep = sleepHistory.length ? sleepHistory[sleepHistory.length - 1].hours : '7';
    const prompt = `Estado: Sueño ${lastSleep}h, Tensión ${bioState.estres}%, Energía ${bioState.energia}%. Dame 3 sugerencias de bienestar rápidas. Responde SOLO con un JSON válido: [{"title": "...", "desc": "..."}]`;
    const res = await callGemini(prompt, "Acompañante de bienestar.");

    try {
      const jsonStr = res.replace(/```json|```/g, '').trim();
      const data = JSON.parse(jsonStr);
      setProtocols(data);
    } catch (e) {
      setProtocols([{ title: "Error", desc: "No se pudieron sincronizar los protocolos." }]);
    } finally {
      setIsLoadingProtocols(false);
    }
  };

  const reviewSystemState = async () => {
    setIsScanning(true);
    addSystemLog("Reflexionando sobre el estado del sistema...");
    const res = await callGemini(`Analiza suavemente: Energía:${bioState.energia}, Tensión:${bioState.estres}. Describe cómo parece estar el sistema en una frase corta y humana, sin diagnosticar.`, "Acompañante de introspección.");
    setTimeout(() => {
      setIsScanning(false);
      addSystemLog("Reflexión: " + res);
    }, 2000);
  };

  const addSystemLog = (msg: string) => {
    setChatMessages(prev => [...prev, { role: 'system', content: msg }]);
  };

  const triggerState = (mode: string) => {
    if (mode === 'meditacion') {
      setBioState(prev => ({ ...prev, estres: 5, coherencia: 100, enfoque: 95 }));
    }
    addSystemLog(`Iniciando modo ${mode}...`);
  };

  // --- Decision Engine Core ---
  const calculateQ = (state: { energia: number, calma: number, estres: number }, action: ActionType) => {
    const { energia, calma, estres } = state;
    switch (action) {
      case "descansar": return (1 - energia) + estres;
      case "enfocarse": return energia * (1 - estres);
      case "evitar": return estres * 0.8;
      case "socializar": return calma * energia;
      default: return 0;
    }
  };

  const calculateBeta = (state: { energia: number, calma: number, estres: number }) => {
    const { energia, calma, estres } = state;
    return (energia + calma) / (1 + estres);
  };

  const softmax = (values: number[], beta: number) => {
    const expValues = values.map(v => Math.exp(beta * v));
    const sum = expValues.reduce((a, b) => a + b, 0);
    return expValues.map(v => v / sum);
  };

  const runDecisionEngine = () => {
    const state = {
      energia: emotionalState.energia,
      calma: emotionalState.calma,
      estres: bioState.estres / 100
    };

    const beta = calculateBeta(state);
    setSystemBeta(beta);

    const actions: ActionType[] = ["descansar", "enfocarse", "evitar", "socializar"];
    const qValues = actions.map(a => calculateQ(state, a));
    const probabilities = softmax(qValues, beta);

    const newDecisions = actions.map((action, i) => ({
      action,
      probability: probabilities[i]
    }));

    setDecisions(newDecisions);
  };

  // --- Dynamic Memory Core ---
  const updateDynamicMemory = () => {
    const newPoint: StateHistoryPoint = {
      timestamp: Date.now(),
      energia: emotionalState.energia,
      calma: emotionalState.calma,
      estres: bioState.estres / 100
    };
    setStateHistory(prev => [...prev.slice(-20), newPoint]); // Keep last 20 points
  };

  const analyzeTrends = () => {
    if (stateHistory.length < 5) return;

    const lastPoints = stateHistory.slice(-5);
    const getTrend = (key: keyof StateHistoryPoint) => {
      const first = lastPoints[0][key] as number;
      const last = lastPoints[lastPoints.length - 1][key] as number;
      const diff = last - first;
      if (Math.abs(diff) < 0.05) return 'stable';
      return diff > 0 ? 'up' : 'down';
    };

    const newTrends: TrendAnalysis[] = [
      { label: 'Vitalidad', trend: getTrend('energia'), value: (emotionalState.energia * 100).toFixed(0) + '%' },
      { label: 'Serenidad', trend: getTrend('calma'), value: (emotionalState.calma * 100).toFixed(0) + '%' },
      { label: 'Tensión', trend: getTrend('estres'), value: (bioState.estres).toFixed(0) + '%' }
    ];
    setTrends(newTrends);

    // Pattern Detection
    const estresTrend = getTrend('estres');
    const energiaTrend = getTrend('energia');
    const calmaTrend = getTrend('calma');

    if (estresTrend === 'up' && energiaTrend === 'down' && bioState.estres > 60) {
      setPatternAlert("Parece que la energía está bajando mientras el estrés sube. Podría ser un buen momento para una pausa.");
    } else if (energiaTrend === 'up' && calmaTrend === 'up' && bioState.estres < 30) {
      setPatternAlert("Te encuentras en un momento de gran armonía y enfoque.");
    } else if (calmaTrend === 'down' && estresTrend === 'up') {
      setPatternAlert("Parece haber una pequeña desconexión interna. Tal vez sea útil buscar un momento de calma.");
    } else {
      setPatternAlert(null);
    }
  };

  // --- Consciousness Model Core ---
  const calculateConsciousness = () => {
    const { calma, energia, conexion } = emotionalState;
    const { estres, coherencia, enfoque } = bioState;

    // 1. Phi (IIT): Integrated Information
    // High coherence and connection with low stress = High Phi
    const phi = (coherencia / 100 * conexion) / (1 + (estres / 100));

    // 2. Reality Error (Predictive Coding): E = |S - P|
    // Simulated as the volatility of the last 5 states
    let error = 0;
    if (stateHistory.length >= 5) {
      const last5 = stateHistory.slice(-5);
      const avgEnergia = last5.reduce((acc, p) => acc + p.energia, 0) / 5;
      error = Math.abs(energia - avgEnergia);
    }

    // 3. Willpower: Ability to override reactive states
    const willpower = (enfoque / 100) - (estres / 200);

    // 4. Self Stability: Invariant of state
    const selfStability = (calma + (1 - (estres / 100))) / 2;

    const newMetrics = {
      phi: Math.max(0, Math.min(1, phi)),
      realityError: Math.max(0, Math.min(1, error * 2)), // Scale for visibility
      willpower: Math.max(0, Math.min(1, willpower)),
      selfStability: Math.max(0, Math.min(1, selfStability))
    };

    setConsciousness(newMetrics);
    setConsciousnessHistory(prev => [...prev.slice(-15), { ...newMetrics, timestamp: Date.now() }]);
  };

  const generateEvolutionaryArt = async () => {
    if (isGeneratingArt) return;
    setIsGeneratingArt(true);
    addSystemLog("Sintetizando una representación visual de tu estado...");
    
    try {
      const { calma, energia, conexion } = emotionalState;
      const mood = `Serenidad: ${Math.round(calma*100)}%, Vitalidad: ${Math.round(energia*100)}%, Conexión: ${Math.round(conexion*100)}%`;
      
      const prompt = `High-quality digital art representing 'Evolutionary Intelligence' influenced by the current mood: ${mood}. Palette: deep blue, neon purple, indigo, vibrant pink, cyber green. Themes: progress, discovery, neural networks, biological growth, futuristic, cinematic lighting, 4k, masterpiece, intricate details. The art should feel like a biological-digital hybrid evolving in real-time.`;
      
      const response = await fetch('/api/interpret/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        const errMsg = errorData.error || 'API Error';
        if (errMsg.toLowerCase().includes('origin not allowed')) {
          setKeyError(errMsg);
          setHasKey(false);
        }
        throw new Error(errMsg);
      }
      const data = await response.json();
      
      if (data.result) {
        setEvolutionaryArt(data.result);
        addSystemLog("ARTE EVOLUTIVO SINTETIZADO CON ÉXITO.");
      } else {
        addSystemLog("SÍNTESIS VISUAL NO DISPONIBLE.");
      }
    } catch (error: any) {
      console.error("Art Generation Error:", error);
      addSystemLog("ERROR EN SÍNTESIS DE ARTE EVOLUTIVO.");
    } finally {
      setIsGeneratingArt(false);
    }
  };

  const calculateEvolution = () => {
    if (evolutionHistory.length < 2) return "0.0";
    const diff = (evolutionHistory[evolutionHistory.length - 1].coherencia - evolutionHistory[0].coherencia).toFixed(1);
    return (parseFloat(diff) > 0 ? "+" : "") + diff;
  };

  const generateLandscapePrompt = () => {
    const { calma, energia, conexion } = emotionalState;
    
    let climate = "";
    if (calma < 0.3) climate = "una tormenta eléctrica con nubes densas y oscuras que oprimen el horizonte";
    else if (calma > 0.7) climate = "un cielo despejado con una luz suave y etérea que lo envuelve todo";
    else climate = "un clima templado con nubes dispersas y una brisa ligera";

    let energy = "";
    if (energia < 0.3) energy = "un paisaje estático, donde el tiempo parece haberse detenido en un silencio absoluto";
    else if (energia > 0.7) energy = "un entorno lleno de movimiento, con vientos fuertes, rayos distantes y una energía vibrante";
    else energy = "un flujo constante de movimiento suave, como el de un río tranquilo";

    let connection = "";
    if (conexion < 0.3) connection = "un vacío desértico, minimalista y vasto, que evoca una soledad profunda";
    else if (conexion > 0.7) connection = "una vegetación exuberante y cálida, donde la vida brota en cada rincón";
    else connection = "una pradera con parches de vegetación y espacios abiertos";

    return `Genera una descripción poética de un paisaje emocional con estas características: ${climate}, ${energy}, y ${connection}. Describe los colores, las texturas y la sensación atmosférica.`;
  };

  const generateLandscapeInterpretation = async (description: string) => {
    try {
      const response = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: description }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        const errMsg = errorData.error || 'API Error';
        if (errMsg.toLowerCase().includes('origin not allowed')) {
          setKeyError(errMsg);
          setHasKey(false);
        }
        throw new Error(errMsg);
      }
      const data = await response.json();
      const interpretation = data.result;
      
      if (!interpretation) {
        setLandscapeInterpretation("No pudimos interpretar esto ahora, puedes intentar de nuevo.");
        return;
      }

      // Intentar extraer el punto ciego si existe para mantener la UI
      const blindSpotMatch = interpretation.match(/### Posible punto ciego\n\n([\s\S]*?)(?=\n\n###|$)/i);
      if (blindSpotMatch) {
        setBlindSpot(blindSpotMatch[1].trim());
        setLandscapeInterpretation(interpretation.replace(/### Posible punto ciego\n\n[\s\S]*?(?=\n\n###|$)/i, '').trim());
      } else {
        setLandscapeInterpretation(interpretation);
        setBlindSpot('');
      }
    } catch (error) {
      console.error("Interpretation Error:", error);
      setLandscapeInterpretation("No pudimos interpretar esto ahora, puedes intentar de nuevo.");
    }

    // Loop Inverso: Sugerencia de Sincronización Neuronal (Modelo Matemático Interno)
    const state = {
      energia: emotionalState.energia,
      calma: emotionalState.calma,
      estres: bioState.estres / 100
    };
    
    const adjustment: NeuralSync = {};
    if (state.estres > 0.7) adjustment.estres = -20;
    if (state.energia < 0.4) adjustment.energia = 20;
    if (state.calma < 0.4) adjustment.oxitocina = 15;
    if (state.energia > 0.8 && state.estres < 0.3) adjustment.enfoque = 10;
    if (state.calma > 0.8) adjustment.coherencia = 10;
    
    setNeuralSync(Object.keys(adjustment).length > 0 ? adjustment : null);
  };

  const handleGenerateLandscape = async () => {
    if (isGeneratingLandscape) return;

    // Rate limiting: 5 requests per minute
    const now = Date.now();
    if (now - lastRequestTime < 60000) {
      if (requestCount >= 5) {
        addSystemLog("LÍMITE DE FRECUENCIA ALCANZADO. POR FAVOR, ESPERA.");
        return;
      }
      setRequestCount(prev => prev + 1);
    } else {
      setLastRequestTime(now);
      setRequestCount(1);
    }

    addSystemLog("Activando el espacio de introspección...");
    setIsGeneratingLandscape(true);
    setLandscapeImage('');
    setLandscapeInterpretation('');
    setBlindSpot('');
    
    try {
      let description = landscapeDescription.trim();
      
      // Si no hay descripción manual, generamos una basada en los sliders
      if (!description) {
        const prompt = generateLandscapePrompt();
        description = await callGemini(prompt, "Arquitecto de Paisajes Emocionales. Crea descripciones poéticas, suaves y evocadoras.");
        setLandscapeDescription(description);
      }
      
      if (description.includes("ERROR DE ORIGEN")) {
        setIsGeneratingLandscape(false);
        return;
      }
      
      // Generar Interpretación Simbólica
      await generateLandscapeInterpretation(description);

      // Generar Imagen
      try {
        const prompt = `Digital art, cinematic landscape, high detail, masterpiece, soft and ethereal atmosphere: ${description}`;
        const imageResponse = await fetch('/api/interpret/image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });
        
        if (!imageResponse.ok) {
          const errorData = await imageResponse.json();
          throw new Error(errorData.error || 'API Error');
        }
        const imageData = await imageResponse.json();
        
        if (imageData.result) {
          setLandscapeImage(imageData.result);
        } else {
          addSystemLog("SÍNTESIS VISUAL NO DISPONIBLE.");
        }
      } catch (imgError: any) {
        console.error("Image Generation Error:", imgError);
        const imgMsg = imgError.message || imgError.toString() || "";
        if (imgMsg.toLowerCase().includes("origin not allowed")) {
          setKeyError("Tu API Key tiene restricciones de dominio (CORS).");
          setHasKey(false);
          addSystemLog("ERROR DE ORIGEN EN IMAGEN: Restricciones detectadas.");
        } else {
          addSystemLog("SÍNTESIS VISUAL NO DISPONIBLE.");
        }
      }

      if (!isDynamicMode) {
        setChatMessages(prev => [...prev, { role: 'ai', content: `Interpretación completada. El paisaje ha sido proyectado.` }]);
      }
    } catch (error: any) {
      console.error("Landscape Generation Error:", error);
      const errorMsg = error.message || error.toString() || "";
      if (errorMsg.toLowerCase().includes("origin not allowed")) {
        setKeyError("Tu API Key tiene restricciones de dominio (CORS).");
        setHasKey(false);
        addSystemLog("ERROR DE ORIGEN: La API Key tiene restricciones de dominio.");
      } else {
        addSystemLog("No pudimos interpretar esto ahora, puedes intentar de nuevo.");
      }
    } finally {
      setIsGeneratingLandscape(false);
    }
  };

  const applyNeuralSync = () => {
    if (!neuralSync) return;
    setIsSyncing(true);
    
    setTimeout(() => {
      setBioState(prev => {
        const newState = { ...prev };
        Object.entries(neuralSync).forEach(([key, val]) => {
          const k = key as keyof BioState;
          newState[k] = Math.max(5, Math.min(100, newState[k] + (val as number)));
        });
        return newState;
      });
      setNeuralSync(null);
      setIsSyncing(false);
      addSystemLog("Ajuste completado. El sistema se siente más equilibrado.");
    }, 1500);
  };

  // --- Render Helpers ---
  const renderStat = (label: string, value: number, colorClass: string, icon: React.ReactNode) => (
    <section className={`glass-card p-6 border-b-2 ${colorClass}/20 ${isScanning ? 'scanning' : ''}`}>
      <div className="flex justify-between items-center mb-6">
        {icon}
        <span className="text-[8px] font-bold text-slate-600 uppercase">{label}</span>
      </div>
      <h2 className="text-lg font-bold mb-4">{label}</h2>
      <div className="space-y-4">
        {label === 'Cerebro' && (
          <>
            <StatBar label="Motivación" value={bioState.dopamina} color="bg-blue-400" />
            <StatBar label="Enfoque" value={bioState.enfoque} color="bg-blue-600" />
          </>
        )}
        {label === 'Corazón' && (
          <>
            <StatBar label="Conexión" value={bioState.oxitocina} color="bg-red-400" />
            <StatBar label="Empatía" value={bioState.empatia} color="bg-red-600" />
          </>
        )}
        {label === 'Cuerpo' && (
          <>
            <StatBar label="Energía" value={bioState.energia} color="bg-green-400" />
            <StatBar label="Tensión" value={bioState.estres} color="bg-orange-500" />
          </>
        )}
        {label === 'Alma' && (
          <>
            <StatBar label="Armonía" value={bioState.coherencia} color="bg-purple-400" />
            <StatBar label="Propósito" value={bioState.proposito} color="bg-purple-600" />
          </>
        )}
      </div>
    </section>
  );

  const StatBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div>
      <div className="flex justify-between text-[8px] mb-1 uppercase font-bold text-slate-500">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="stat-bar">
        <div className={`stat-fill ${color}`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );

  // --- Main Render ---
  if (isCheckingKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050810]">
        <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (hasKey === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050810] p-6">
        <div className="glass-card max-w-md w-full p-10 text-center border-red-500/20">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-6" />
          <h1 className="text-2xl font-black tracking-tighter mb-4 text-white uppercase">Acceso Restringido</h1>
          
          {keyError ? (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-left">
              <p className="text-red-400 text-xs font-bold uppercase mb-2">Error Detectado:</p>
              <p className="text-slate-300 text-[11px] leading-relaxed mb-4">{keyError}</p>
              <p className="text-slate-400 text-[10px] leading-relaxed">
                <span className="text-white font-bold">Solución:</span> Ve a Google Cloud Console, edita tu API Key y asegúrate de que <span className="text-white">"Restricciones de sitios web"</span> esté configurado en <span className="text-white">"Ninguna"</span> o permite este dominio.
              </p>
            </div>
          ) : (
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              Para activar el <span className="text-purple-400 font-bold">BIO-NÚCLEO V8</span> y sus protocolos de inteligencia evolutiva, es necesario vincular una API Key válida de Google AI Studio.
            </p>
          )}

          <button 
            onClick={handleSelectKey}
            className="w-full py-4 bg-purple-500/20 hover:bg-purple-500/40 text-purple-400 rounded-2xl font-black uppercase tracking-widest transition-all border border-purple-500/20"
          >
            {keyError ? "Intentar con otra Clave" : "Vincular API Key"}
          </button>
          <p className="mt-6 text-[10px] text-slate-600 uppercase tracking-widest">
            Requiere facturación activa en Google Cloud
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto">
      <Onboarding />
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
            <div className={`w-2 h-2 rounded-full ${bioState.coherencia > 80 ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'} shadow-[0_0_10px_rgba(74,222,128,0.5)]`}></div>
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

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {renderStat('Cerebro', bioState.dopamina, 'border-blue-500', <Brain className="text-blue-400 w-5 h-5" />)}
        {renderStat('Corazón', bioState.oxitocina, 'border-red-500', <Heart className="text-red-400 w-5 h-5" />)}
        {renderStat('Cuerpo', bioState.energia, 'border-green-500', <Zap className="text-green-400 w-5 h-5" />)}
        {renderStat('Alma', bioState.coherencia, 'border-purple-500', <Star className="text-purple-400 w-5 h-5" />)}
      </main>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
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
                    className={`w-full ${emotion.color} bg-white/5 rounded-lg appearance-none h-1`}
                  />
                </div>
              ))}
              <button 
                onClick={handleGenerateLandscape}
                className="w-full mt-4 py-3 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-pink-500/20"
              >
                Generar Paisaje IA
              </button>
            </div>
          </div>

          <div className="glass-card p-6 border border-indigo-500/10">
            <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <Moon className="text-indigo-400 w-4 h-4" /> Ciclo de Descanso
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[9px] text-slate-500 uppercase font-bold mb-2 block">Horas de Sueño</label>
                <input 
                  type="range" 
                  min="3" 
                  max="12" 
                  step="0.5" 
                  value={sleepHours} 
                  onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 bg-white/5 rounded-lg appearance-none h-1"
                />
                <div className="flex justify-between text-[10px] mt-2 font-mono">
                  <span className="text-slate-600">3h</span>
                  <span className="text-indigo-400 font-bold">{sleepHours.toFixed(1)}h</span>
                  <span className="text-slate-600">12h</span>
                </div>
              </div>
              <button 
                onClick={logSleep} 
                className="w-full py-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-indigo-500/20"
              >
                Sincronizar Descanso
              </button>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 flex justify-between">
              <span>Evolución</span>
              <span className="text-[8px] text-slate-500">Tendencia</span>
            </h3>
            <div className="flex items-end justify-between h-24 gap-1 mb-4">
              {evolutionHistory.slice(-12).map((p, i) => (
                <div 
                  key={i}
                  className="flex-1 bg-gradient-to-t from-blue-500/20 to-purple-500/50 rounded-t-lg transition-all duration-700 hover:brightness-125 cursor-help"
                  style={{ height: `${p.coherencia}%` }}
                  title={`Coherencia: ${p.coherencia}%`}
                />
              ))}
              {evolutionHistory.length === 0 && (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600 uppercase tracking-widest">Sin Datos</div>
              )}
            </div>
            <div className="text-[10px] text-slate-500 italic leading-relaxed bg-white/5 p-3 rounded-xl">
              {evolutionHistory.length > 0 ? "Análisis predictivo activo. Tu coherencia muestra una tendencia estable." : "Registra tu estado para activar el análisis predictivo."}
            </div>
          </div>

          <div className="glass-card p-6 border border-blue-500/10">
            <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center justify-between">
              <span className="flex items-center gap-2"><Activity className="text-blue-400 w-4 h-4" /> Tendencias de Acción</span>
              <span className="text-[8px] text-slate-500 font-mono">v1.1</span>
            </h3>
            
            <div className="mb-6">
              <div className="flex justify-between text-[8px] mb-2 uppercase font-bold text-slate-500">
                <span>Claridad Interna</span>
                <span className={systemBeta > 1 ? 'text-blue-400' : 'text-yellow-400'}>
                  {systemBeta > 1.2 ? 'ALTA' : systemBeta > 0.7 ? 'MEDIA' : 'BAJA'}
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${systemBeta > 1 ? 'bg-blue-400' : 'bg-yellow-400'}`} 
                  style={{ width: `${Math.min(100, systemBeta * 50)}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[8px] text-slate-500 uppercase font-bold mb-2">Acciones Sugeridas</p>
              {decisions.sort((a, b) => b.probability - a.probability).map((d, i) => (
                <div key={d.action} className="relative">
                  <div className="flex justify-between items-center mb-1 relative z-10 px-2">
                    <span className={`text-[10px] font-bold uppercase ${i === 0 ? 'text-white' : 'text-slate-400'}`}>
                      {d.action}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {(d.probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-8 w-full bg-white/5 rounded-lg overflow-hidden relative">
                    <div 
                      className={`absolute inset-y-0 left-0 transition-all duration-1000 ${i === 0 ? 'bg-blue-500/20' : 'bg-white/5'}`}
                      style={{ width: `${d.probability * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <p className="mt-6 text-[9px] text-slate-500 italic leading-relaxed">
              * Representación basada en tendencias de acción y claridad interna.
            </p>
          </div>

          <div className="glass-card p-6 border border-purple-500/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Brain className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center justify-between relative z-10">
              <span className="flex items-center gap-2"><Moon className="text-purple-400 w-4 h-4" /> Fluir del Estado</span>
              <span className="text-[8px] text-slate-500 font-mono">t → t+1</span>
            </h3>

            {patternAlert && (
              <div className="mb-6 p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl animate-pulse">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-3 h-3 text-purple-400" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-purple-400">Alerta de Patrón</span>
                </div>
                <p className="text-[10px] text-slate-300 font-medium leading-relaxed">{patternAlert}</p>
              </div>
            )}

            <div className="space-y-4 relative z-10">
              <p className="text-[8px] text-slate-500 uppercase font-bold mb-2">Análisis de Tendencias</p>
              <div className="grid grid-cols-3 gap-3">
                {trends.map(t => (
                  <div key={t.label} className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <p className="text-[8px] text-slate-500 uppercase font-bold mb-1">{t.label}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black">{t.value}</span>
                      {t.trend === 'up' && <Zap className="w-3 h-3 text-green-400" />}
                      {t.trend === 'down' && <Activity className="w-3 h-3 text-red-400" />}
                      {t.trend === 'stable' && <Moon className="w-3 h-3 text-slate-500" />}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <p className="text-[8px] text-slate-500 uppercase font-bold mb-3">Historial de Sincronización (Últimos 20 ciclos)</p>
                <div className="h-16 flex items-end gap-0.5 bg-black/20 rounded-lg p-2 overflow-hidden">
                  {stateHistory.map((p, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-purple-500/40 rounded-t-sm transition-all duration-500"
                      style={{ height: `${p.energia * 100}%`, opacity: 0.3 + (i / stateHistory.length) * 0.7 }}
                    ></div>
                  ))}
                  {stateHistory.length === 0 && (
                    <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-700 uppercase tracking-widest">
                      Esperando datos...
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <p className="mt-6 text-[9px] text-slate-500 italic leading-relaxed">
              El sistema analiza el fluir de tus estados para ayudarte a encontrar equilibrio y bienestar.
            </p>
          </div>

          <div className="glass-card p-6 border border-amber-500/10 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl"></div>
            <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center justify-between relative z-10">
              <span className="flex items-center gap-2"><Star className="text-amber-400 w-4 h-4" /> Espacio de Conciencia</span>
              <span className="text-[8px] text-slate-500 font-mono">v1.1</span>
            </h3>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 relative z-10"
            >
              {/* Radar Chart: Holistic State */}
              <div className="h-64 bg-black/20 rounded-3xl p-4 border border-white/5">
                <p className="text-[8px] text-slate-500 uppercase font-bold mb-4 text-center">Geometría Interna</p>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                    {subject: 'Conexión Interna', A: consciousness.phi * 100, full: 100},
                    {subject: 'Alineación', A: (1 - consciousness.realityError) * 100, full: 100},
                    {subject: 'Capacidad de Acción', A: consciousness.willpower * 100, full: 100},
                    {subject: 'Equilibrio del Ser', A: consciousness.selfStability * 100, full: 100},
                  ]}>
                    <PolarGrid stroke="#444" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 8 }} />
                    <Radar
                      name="Conciencia"
                      dataKey="A"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Line Chart: Temporal Evolution */}
              <div className="h-64 bg-black/20 rounded-3xl p-4 border border-white/5">
                <p className="text-[8px] text-slate-500 uppercase font-bold mb-4 text-center">Evolución del Estado</p>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={consciousnessHistory}>
                    <defs>
                      <linearGradient id="colorPhi" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111', border: '1px solid #333', fontSize: '8px' }}
                      itemStyle={{ fontSize: '8px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="phi" 
                      stroke="#f59e0b" 
                      fillOpacity={1} 
                      fill="url(#colorPhi)" 
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="willpower" 
                      stroke="#3b82f6" 
                      fillOpacity={0} 
                      strokeWidth={1}
                      strokeDasharray="3 3"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="grid grid-cols-2 gap-4 mb-6 relative z-10"
            >
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[8px] mb-1 uppercase font-bold text-slate-500">
                    <span>Conexión Interna</span>
                    <span className="text-amber-400">{(consciousness.phi * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 transition-all duration-1000" 
                      style={{ width: `${consciousness.phi * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[8px] mb-1 uppercase font-bold text-slate-500">
                    <span>Equilibrio del Ser</span>
                    <span className="text-amber-400">{(consciousness.selfStability * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 transition-all duration-1000" 
                      style={{ width: `${consciousness.selfStability * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[8px] mb-1 uppercase font-bold text-slate-500">
                    <span>Alineación</span>
                    <span className="text-amber-400">{(consciousness.realityError * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 transition-all duration-1000" 
                      style={{ width: `${consciousness.realityError * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[8px] mb-1 uppercase font-bold text-slate-500">
                    <span>Capacidad de Acción</span>
                    <span className="text-amber-400">{(consciousness.willpower * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 transition-all duration-1000" 
                      style={{ width: `${consciousness.willpower * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10">
              <p className="text-[10px] text-amber-200/70 leading-relaxed italic">
                {consciousness.phi > 0.7 
                  ? "Estado de alta integración. El sistema opera como una unidad consciente coherente."
                  : consciousness.realityError > 0.4
                  ? "Divergencia detectada. Tu modelo predictivo está fallando al renderizar la realidad sensorial."
                  : "Procesamiento automático dominante. La conciencia se encuentra en modo de bajo consumo."}
              </p>
            </div>
            
            <p className="mt-6 text-[9px] text-slate-500 italic leading-relaxed">
              * Realismo Agente-Dependiente: La realidad es una simulación estabilizada por el Kernel.
            </p>
          </div>

          {landscapeDescription && (
            <div className="glass-card p-6 border border-pink-500/20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-4 text-pink-400 flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Proyección de Paisaje
              </h3>
              <p className="text-[11px] text-slate-300 leading-relaxed italic font-serif mb-6">
                "{landscapeDescription}"
              </p>
              
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                {isGeneratingLandscape && !landscapeImage ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-8 h-8 text-pink-400 animate-spin" />
                    <span className="text-[8px] text-pink-400 font-black uppercase tracking-[0.3em]">Renderizando...</span>
                  </div>
                ) : landscapeImage ? (
                  <img 
                    src={landscapeImage} 
                    alt="Paisaje Emocional" 
                    className="w-full h-full object-cover animate-in fade-in duration-1000"
                    referrerPolicy="no-referrer"
                  />
                ) : null}
              </div>

              {landscapeInterpretation && (
                <div className="mt-6 pt-6 border-t border-white/5 animate-in fade-in duration-1000">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                      <Brain className="w-3 h-3" /> Lectura Interna
                    </h4>
                    <span className="text-[7px] px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full font-mono border border-indigo-500/30">Human OS Core v2.0</span>
                  </div>
                  <div className="text-[11px] text-slate-400 leading-relaxed font-light markdown-body">
                    <ReactMarkdown>
                      {landscapeInterpretation}
                    </ReactMarkdown>
                    <div className="mt-4 pt-4 border-t border-white/5 text-[8px] text-slate-500 italic">
                      Esto es una interpretación, no una verdad absoluta. Puedes tomar lo que resuene y dejar lo demás.
                    </div>
                  </div>
                  
                  {neuralSync && (
                    <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl animate-in slide-in-from-top-2 duration-500">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="text-[9px] font-black uppercase tracking-widest text-purple-300 flex items-center gap-2">
                          <Activity className="w-3 h-3" /> Explorar este ajuste
                        </h5>
                        <span className="text-[8px] text-slate-500 font-mono">Ajuste Sugerido</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {Object.entries(neuralSync).map(([key, val]) => {
                          const v = val as number;
                          const label = key === 'estres' ? 'Calma' : key.charAt(0).toUpperCase() + key.slice(1);
                          const displayVal = key === 'estres' ? -v : v;
                          return (
                            <div key={key} className="flex justify-between text-[8px] uppercase font-bold px-2 py-1 bg-black/20 rounded-lg">
                              <span className="text-slate-500">{label}</span>
                              <span className={displayVal > 0 ? 'text-green-400' : 'text-red-400'}>{displayVal > 0 ? '+' : ''}{displayVal}%</span>
                            </div>
                          );
                        })}
                      </div>
                      <button 
                        onClick={applyNeuralSync}
                        disabled={isSyncing}
                        className="w-full py-2 bg-purple-500/20 hover:bg-purple-500/40 text-purple-400 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-purple-500/20 flex items-center justify-center gap-2"
                      >
                        {isSyncing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Dna className="w-3 h-3" />}
                        {isSyncing ? 'Sincronizando...' : 'Probar este cambio'}
                      </button>
                    </div>
                  )}

                  {blindSpot && (
                    <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl animate-in zoom-in duration-500">
                      <h5 className="text-[8px] font-black uppercase tracking-widest mb-1 text-indigo-300">Posible punto ciego:</h5>
                      <div className="text-[10px] text-indigo-200 italic markdown-body">
                        <ReactMarkdown>
                          {blindSpot}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

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
        </div>

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
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-8 border-green-500/30">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-bold text-green-400 tracking-tighter">Protocolos de Optimización</h4>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              {isLoadingProtocols ? (
                <div className="flex justify-center p-12">
                  <Dna className="w-12 h-12 text-green-400 animate-bounce" />
                </div>
              ) : (
                protocols.map((p, i) => (
                  <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-green-500/30 transition-all">
                    <p className="font-bold text-green-400 text-[10px] uppercase mb-1">{p.title}</p>
                    <p className="text-[11px] text-slate-400 italic">{p.desc}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
