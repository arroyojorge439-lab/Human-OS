import Stripe from 'stripe';
import { config } from '../config/env.js';

if (!config.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables.');
}

const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16' as any,
});

export const createCheckoutSession = async (priceId: string, customerEmail?: string) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${config.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.CLIENT_URL}/canceled`,
      customer_email: customerEmail,
    });

    return session;
  } catch (error: any) {
    console.error('Stripe Create Checkout Session Error:', error);
    throw new Error(error.message || 'Failed to create checkout session');
  }
};

export const createCustomerPortalSession = async (customerId: string) => {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${config.CLIENT_URL}/dashboard`,
    });

    return session;
  } catch (error: any) {
    console.error('Stripe Create Portal Session Error:', error);
    throw new Error(error.message || 'Failed to create customer portal session');
  }
};

export const handleWebhook = (payload: string | Buffer, sig: string) => {
  let event: Stripe.Event;

  try {
    if (!config.STRIPE_WEBHOOK_SECRET) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
    }
    event = stripe.webhooks.constructEvent(payload, sig, config.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    throw new Error(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      console.log(`Payment successful for session ${checkoutSession.id}`);
      // Logic to provision services or update user status goes here
      break;
    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription;
      console.log(`Subscription deleted: ${subscription.id}`);
      // Logic to revoke access goes here
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return event;
};

export default stripe;