import React from 'react';

export interface EmotionalState {
  calma: number;
  energia: number;
  conexion: number;
}

export interface BioState {
  dopamina: number;
  enfoque: number;
  oxitocina: number;
  empatia: number;
  energia: number;
  estres: number;
  coherencia: number;
  proposito: number;
}

export interface HistoryEntry {
  coherencia: number;
  date: number;
}

export interface SleepEntry {
  hours: number;
  date: number;
}

export interface ChatMessage {
  role: 'user' | 'ai' | 'system';
  content: string;
}

export interface Protocol {
  title: string;
  desc: string;
}

export type ActionType = "descansar" | "enfocarse" | "evitar" | "socializar";

export interface ActionDecision {
  action: ActionType;
  probability: number;
}

export interface StateHistoryPoint {
  timestamp: number;
  energia: number;
  calma: number;
  estres: number;
}

export interface TrendAnalysis {
  label: string;
  trend: 'up' | 'down' | 'stable';
  value: string;
}

export interface ConsciousnessMetrics {
  phi: number;
  realityError: number;
  willpower: number;
  selfStability: number;
}

export interface ConsciousnessHistoryPoint extends ConsciousnessMetrics {
  timestamp: number;
}

export interface NeuralSync {
  dopamina?: number;
  enfoque?: number;
  oxitocina?: number;
  empatia?: number;
  energia?: number;
  estres?: number;
  coherencia?: number;
  proposito?: number;
}

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}
