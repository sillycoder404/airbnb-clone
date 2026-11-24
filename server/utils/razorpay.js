import { createHmac, timingSafeEqual } from 'node:crypto';

const API_URL = 'https://api.razorpay.com/v1';

function configurationError() {
  const error = new Error('Payments are not configured. Add the Razorpay keys to the server environment.');
  error.statusCode = 503;
  return error;
}

export function getRazorpayKeyId() {
  const { RAZORPAY_KEY_ID: keyId, RAZORPAY_KEY_SECRET: keySecret } = process.env;
  if (!keyId || !keySecret) throw configurationError();
  return keyId;
}

export async function razorpayRequest(path, { method = 'GET', body } = {}) {
  const { RAZORPAY_KEY_ID: keyId, RAZORPAY_KEY_SECRET: keySecret } = process.env;
  if (!keyId || !keySecret) throw configurationError();

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
      ...(body ? { 'Content-Type': 'application/json' } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });
  const result = await response.json();
  if (!response.ok) {
    const error = new Error(result.error?.description || 'The payment provider could not complete the request.');
    error.statusCode = response.status === 401 ? 503 : 502;
    throw error;
  }
  return result;
}

function matchesSignature(expected, received) {
  if (typeof received !== 'string' || !/^[\da-f]{64}$/i.test(received)) return false;
  const expectedBuffer = Buffer.from(expected, 'hex');
  const receivedBuffer = Buffer.from(received, 'hex');
  return expectedBuffer.length === receivedBuffer.length && timingSafeEqual(expectedBuffer, receivedBuffer);
}

export function verifyPaymentSignature(orderId, paymentId, signature) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret || typeof orderId !== 'string' || typeof paymentId !== 'string') return false;
  const expected = createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
  return matchesSignature(expected, signature);
}

export function verifyWebhookSignature(body, signature) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !Buffer.isBuffer(body)) return false;
  const expected = createHmac('sha256', secret).update(body).digest('hex');
  return matchesSignature(expected, signature);
}

export function calculateRefund(totalPrice, checkIn, now = new Date()) {
  const hoursUntilCheckIn = (new Date(checkIn).getTime() - new Date(now).getTime()) / (60 * 60 * 1000);
  const percentage = hoursUntilCheckIn >= 48 ? 75 : hoursUntilCheckIn >= 24 ? 50 : 0;
  return {
    percentage,
    amountPaise: Math.round(totalPrice * percentage)
  };
}
