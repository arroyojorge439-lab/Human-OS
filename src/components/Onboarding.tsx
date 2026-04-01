import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft, Sparkles, Activity, Brain, Heart } from 'lucide-react';

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    title: "Bienvenido a BIO-NÚCLEO V8",
    description: "Tu centro de comando para la optimización humana integral. Vamos a configurar tu entorno.",
    icon: <Sparkles className="w-12 h-12 text-blue-400" />
  },
  {
    title: "Sincronización Biométrica",
    description: "Monitorea tus niveles de dopamina, estrés y coherencia en tiempo real a través de nuestro panel de control.",
    icon: <Activity className="w-12 h-12 text-green-400" />
  },
  {
    title: "Análisis Simbólico",
    description: "Describe tus paisajes internos y deja que nuestra IA interprete tu estado emocional profundo.",
    icon: <Brain className="w-12 h-12 text-purple-400" />
  },
  {
    title: "Optimización Circadiana",
    description: "Registra tu sueño y actividad para ajustar tu ritmo biológico y alcanzar el máximo rendimiento.",
    icon: <Heart className="w-12 h-12 text-red-400" />
  }
];

export const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding_v8');
    if (!hasSeenOnboarding) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasSeenOnboarding_v8', 'true');
    setIsVisible(false);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl"
        >
          <div className="p-8 flex flex-col items-center text-center">
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-zinc-500" />
            </button>

            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center"
            >
              <div className="mb-6 p-4 bg-zinc-800/50 rounded-2xl">
                {steps[currentStep].icon}
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                {steps[currentStep].title}
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                {steps[currentStep].description}
              </p>
            </motion.div>

            <div className="flex items-center justify-between w-full mt-auto">
              <div className="flex gap-2">
                {steps.map((_, i) => (
                  <div 
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentStep ? 'w-8 bg-blue-500' : 'w-2 bg-zinc-700'
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-4">
                {currentStep > 0 && (
                  <button
                    onClick={prevStep}
                    className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all active:scale-95"
                >
                  {currentStep === steps.length - 1 ? 'Empezar' : 'Siguiente'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
