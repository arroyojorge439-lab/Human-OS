import React from 'react';
import { Brain, Heart, Zap, Star } from 'lucide-react';
import { BioState } from '../types';

interface BioStatsProps {
  bioState: BioState;
  isScanning: boolean;
}

export const BioStats: React.FC<BioStatsProps> = ({ bioState, isScanning }) => {
  const renderStat = (label: string, icon: React.ReactNode, colorClass: string, stats: { label: string, value: number, color: string }[]) => (
    <section className={`glass-card p-6 border-b-2 ${colorClass}/20 ${isScanning ? 'scanning' : ''}`}>
      <div className="flex justify-between items-center mb-6">
        {icon}
        <span className="text-[8px] font-bold text-slate-600 uppercase">{label}</span>
      </div>
      <h2 className="text-lg font-bold mb-4">{label}</h2>
      <div className="space-y-4">
        {stats.map((s, i) => (
          <div key={i}>
            <div className="flex justify-between text-[8px] mb-1 uppercase font-bold text-slate-500">
              <span>{s.label}</span>
              <span>{Math.round(s.value)}%</span>
            </div>
            <div className="stat-bar">
              <div className={`stat-fill ${s.color}`} style={{ width: `${s.value}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {renderStat('Cerebro', <Brain className="text-blue-400 w-5 h-5" />, 'border-blue-500', [
        { label: 'Motivación', value: bioState.dopamina, color: 'bg-blue-400' },
        { label: 'Enfoque', value: bioState.enfoque, color: 'bg-blue-600' }
      ])}
      {renderStat('Corazón', <Heart className="text-red-400 w-5 h-5" />, 'border-red-500', [
        { label: 'Conexión', value: bioState.oxitocina, color: 'bg-red-400' },
        { label: 'Empatía', value: bioState.empatia, color: 'bg-red-600' }
      ])}
      {renderStat('Cuerpo', <Zap className="text-green-400 w-5 h-5" />, 'border-green-500', [
        { label: 'Energía', value: bioState.energia, color: 'bg-green-400' },
        { label: 'Tensión', value: bioState.estres, color: 'bg-orange-500' }
      ])}
      {renderStat('Alma', <Star className="text-purple-400 w-5 h-5" />, 'border-purple-500', [
        { label: 'Armonía', value: bioState.coherencia, color: 'bg-purple-400' },
        { label: 'Propósito', value: bioState.proposito, color: 'bg-purple-600' }
      ])}
    </main>
  );
};
