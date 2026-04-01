
import { useEffect, useState } from 'react';

const Onboarding = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  if (!showOnboarding) {
    return null;
  }

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-content">
        <h2>Bienvenido al BIO-NÚCLEO V8</h2>
        <p>Esta es tu guía táctica para navegar el sistema:</p>
        <ul>
          <li>
            <strong>Sincronización Biométrica:</strong> Conecta tus dispositivos para un análisis en tiempo real.
          </li>
          <li>
            <strong>Análisis Simbólico:</strong> Describe tus sueños y pensamientos para una interpretación profunda.
          </li>
          <li>
            <strong>Optimización Circadiana:</strong> Recibe recomendaciones para alinear tu ritmo biológico.
          </li>
          <li>
            <strong>Human OS:</strong> Accede a un dashboard completo con todas tus métricas.
          </li>
        </ul>
        <button onClick={handleClose}>Entendido</button>
      </div>
    </div>
  );
};

export default Onboarding;
