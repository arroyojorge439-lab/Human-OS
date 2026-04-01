
import { Router } from 'express';
import { createCheckoutSession, handleStripeWebhook } from '../controllers/payment.controller';

const router = Router();

router.post('/create-checkout-session', createCheckoutSession);
router.post('/stripe-webhook', handleStripeWebhook);

export default router;
