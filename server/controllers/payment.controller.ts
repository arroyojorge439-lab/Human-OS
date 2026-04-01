
import { Request, Response } from 'express';
import { stripe } from '../services/stripe.service';
import { config } from '../config/env';

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: "BIO-NÚCLEO V8 - Acceso Premium" },
          unit_amount: 1000, // $10.00
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `${config.APP_URL}/?payment=success`,
      cancel_url: `${config.APP_URL}/?payment=cancel`,
    });
    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, config.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // TODO: Fulfill the purchase.
      // e.g., update a database to grant premium access.
      console.log('ACCESO PREMIUM ACTIVADO. BIENVENIDO AL SIGUIENTE NIVEL.');
      console.log('Checkout session was successful:', session);
      break;
    default:
      console.log(`Evento de Stripe no manejado: ${event.type}`);
  }

  res.json({ received: true });
};
