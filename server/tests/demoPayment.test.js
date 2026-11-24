import assert from 'node:assert/strict';
import test from 'node:test';
import { isDemoPaymentMethod } from '../utils/demoPayment.js';

test('only card, wallet, and UPI are accepted as demo payment methods', () => {
  assert.equal(isDemoPaymentMethod('card'), true);
  assert.equal(isDemoPaymentMethod('wallet'), true);
  assert.equal(isDemoPaymentMethod('upi'), true);
  assert.equal(isDemoPaymentMethod('cash'), false);
});
