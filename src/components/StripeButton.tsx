
import { useState } from 'react';

const StripeButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/payment/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const session = await response.json();
      if (session.url) {
        window.location.href = session.url;
      } else {
        console.error('Error creating checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
    setIsLoading(false);
  };

  return (
    <button onClick={handleClick} disabled={isLoading}>
      {isLoading ? 'Procesando...' : 'Activar Acceso Premium'}
    </button>
  );
};

export default StripeButton;
