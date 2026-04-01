import { ActionType, ActionDecision, EmotionalState, BioState, StateHistoryPoint, ConsciousnessMetrics } from '../types';

// --- Decision Engine Logic ---
export const calculateQ = (state: { energia: number, calma: number, estres: number }, action: ActionType) => {
  const { energia, calma, estres } = state;
  switch (action) {
    case "descansar": return (1 - energia) + estres;
    case "enfocarse": return energia * (1 - estres);
    case "evitar": return estres * 0.8;
    case "socializar": return calma * energia;
    default: return 0;
  }
};

export const calculateBeta = (state: { energia: number, calma: number, estres: number }) => {
  const { energia, calma, estres } = state;
  return (energia + calma) / (1 + estres);
};

export const softmax = (values: number[], beta: number) => {
  const expValues = values.map(v => Math.exp(beta * v));
  const sum = expValues.reduce((a, b) => a + b, 0);
  return expValues.map(v => v / sum);
};

export const runDecisionEngine = (emotionalState: EmotionalState, estres: number): ActionDecision[] => {
  const state = {
    energia: emotionalState.energia,
    calma: emotionalState.calma,
    estres: estres / 100
  };

  const beta = calculateBeta(state);
  const actions: ActionType[] = ["descansar", "enfocarse", "evitar", "socializar"];
  const qValues = actions.map(a => calculateQ(state, a));
  const probabilities = softmax(qValues, beta);

  return actions.map((action, i) => ({
    action,
    probability: probabilities[i]
  }));
};

// --- Consciousness Model Logic ---
export const calculateConsciousness = (
  emotionalState: EmotionalState, 
  bioState: BioState, 
  stateHistory: StateHistoryPoint[]
): ConsciousnessMetrics => {
  const { calma, energia, conexion } = emotionalState;
  const { estres, coherencia, enfoque } = bioState;

  // 1. Phi (IIT): Integrated Information
  const phi = (coherencia / 100 * conexion) / (1 + (estres / 100));

  // 2. Reality Error (Predictive Coding): E = |S - P|
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

  return {
    phi: Math.max(0, Math.min(1, phi)),
    realityError: Math.max(0, Math.min(1, error * 2)),
    willpower: Math.max(0, Math.min(1, willpower)),
    selfStability: Math.max(0, Math.min(1, selfStability))
  };
};
