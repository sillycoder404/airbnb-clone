import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { createPaymentOrder, paymentWebhook, verifyPayment } from '../controllers/paymentController.js';

const router = Router();

router.post('/webhook', paymentWebhook);
router.post('/orders', protect, createPaymentOrder);
router.post('/verify', protect, verifyPayment);

export default router;
