import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateDemoRefund, isDemoPaymentMethod } from '../utils/demoPayment.js';

test('only card, wallet, and UPI are accepted as demo payment methods', () => {
  assert.equal(isDemoPaymentMethod('card'), true);
  assert.equal(isDemoPaymentMethod('wallet'), true);
  assert.equal(isDemoPaymentMethod('upi'), true);
  assert.equal(isDemoPaymentMethod('cash'), false);
});

test('demo cancellation refunds use 48-hour and 24-hour cutoffs', () => {
  const checkIn = new Date('2026-12-10T00:00:00.000Z');
  assert.deepEqual(calculateDemoRefund(1000, checkIn, new Date('2026-12-08T00:00:00.000Z')), {
    percentage: 75,
    amount: 750
  });
  assert.deepEqual(calculateDemoRefund(1000, checkIn, new Date('2026-12-09T00:00:00.000Z')), {
    percentage: 50,
    amount: 500
  });
  assert.deepEqual(calculateDemoRefund(1000, checkIn, new Date('2026-12-09T00:00:01.000Z')), {
    percentage: 0,
    amount: 0
  });
});
