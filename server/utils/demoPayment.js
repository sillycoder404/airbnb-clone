const demoPaymentMethods = new Set(['card', 'wallet', 'upi']);

export function isDemoPaymentMethod(method) {
  return demoPaymentMethods.has(method);
}
