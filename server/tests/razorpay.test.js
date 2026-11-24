import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import test from 'node:test';
import { calculateRefund, verifyPaymentSignature, verifyWebhookSignature } from '../utils/razorpay.js';

test('cancellation refunds use the configured 48-hour and 24-hour cutoffs', () => {
  const checkIn = new Date('2026-12-10T00:00:00.000Z');
  assert.deepEqual(calculateRefund(1000, checkIn, new Date('2026-12-08T00:00:00.000Z')), {
    percentage: 75,
    amountPaise: 75000
  });
  assert.deepEqual(calculateRefund(1000, checkIn, new Date('2026-12-09T00:00:00.000Z')), {
    percentage: 50,
    amountPaise: 50000
  });
  assert.deepEqual(calculateRefund(1000, checkIn, new Date('2026-12-09T00:00:01.000Z')), {
    percentage: 0,
    amountPaise: 0
  });
});

test('payment signatures are checked against the server order and secret', (context) => {
  const previousSecret = process.env.RAZORPAY_KEY_SECRET;
  context.after(() => {
    if (previousSecret === undefined) delete process.env.RAZORPAY_KEY_SECRET;
    else process.env.RAZORPAY_KEY_SECRET = previousSecret;
  });
  process.env.RAZORPAY_KEY_SECRET = 'test-secret';
  const signature = createHmac('sha256', 'test-secret').update('order_test|pay_test').digest('hex');
  assert.equal(verifyPaymentSignature('order_test', 'pay_test', signature), true);
  assert.equal(verifyPaymentSignature('different-order', 'pay_test', signature), false);
  assert.equal(verifyPaymentSignature('order_test', 'pay_test', 'invalid'), false);
});

test('webhook signatures use the unmodified request body', (context) => {
  const previousSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  context.after(() => {
    if (previousSecret === undefined) delete process.env.RAZORPAY_WEBHOOK_SECRET;
    else process.env.RAZORPAY_WEBHOOK_SECRET = previousSecret;
  });
  process.env.RAZORPAY_WEBHOOK_SECRET = 'webhook-secret';
  const body = Buffer.from('{"event":"payment.captured"}');
  const signature = createHmac('sha256', 'webhook-secret').update(body).digest('hex');
  assert.equal(verifyWebhookSignature(body, signature), true);
  assert.equal(verifyWebhookSignature(Buffer.from('{"event":"payment.failed"}'), signature), false);
});
