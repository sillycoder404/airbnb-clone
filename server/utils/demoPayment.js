const demoPaymentMethods = new Set(['card', 'wallet', 'upi']);

export function isDemoPaymentMethod(method) {
  return demoPaymentMethods.has(method);
}

export function calculateDemoRefund(totalPrice, checkIn, now = new Date()) {
  const hoursUntilCheckIn = (new Date(checkIn).getTime() - new Date(now).getTime()) / (60 * 60 * 1000);
  const percentage = hoursUntilCheckIn >= 48 ? 75 : hoursUntilCheckIn >= 24 ? 50 : 0;
  return {
    percentage,
    amount: Math.round(totalPrice * percentage) / 100
  };
}
