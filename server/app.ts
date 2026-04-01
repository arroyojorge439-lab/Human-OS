
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import interpretRoutes from './routes/interpret.routes.ts';
import paymentRoutes from './routes/payment.routes.ts'; // Import payment routes
import { config } from './config/env.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = config.PORT;

  app.use(cors());

  // Webhook needs raw body
  app.use('/api/payment/stripe-webhook', express.raw({ type: 'application/json' }));

  app.use(express.json());

  // API: El flujo de datos estratégico
  app.use('/api/interpret', interpretRoutes);
  app.use('/api/payment', paymentRoutes); // Use payment routes

  app.get('/api/health', (req, res) => {
    res.json({ status: 'vivo y coleando', timestamp: new Date().toISOString() });
  });

  // Integración Mecánica con Vite
  if (config.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Chalamandra Engine rugiendo en puerto ${PORT}`);
  });
}

startServer();
