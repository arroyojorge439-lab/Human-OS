import type { Request, Response } from "express";
import Stripe from "stripe";
import { config } from "../config/env.ts";

let stripeClient: Stripe | null = null;

const getStripe = () => {
  if (!stripeClient) {
    if (!config.STRIPE_SECRET_KEY) {
      throw new Error("Stripe not configured. Please set STRIPE_SECRET_KEY in the Secrets panel.");
    }
    stripeClient = new Stripe(config.STRIPE_SECRET_KEY);
  }
  return stripeClient;
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "BIO-NÚCLEO V8 - Acceso Premium",
              description: "Desbloquea todas las funciones de optimización circadiana.",
            },
            unit_amount: 1000, // $10.00
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${config.APP_URL}/?payment=success`,
      cancel_url: `${config.APP_URL}/?payment=cancel`,
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: error.message });
  }
};
