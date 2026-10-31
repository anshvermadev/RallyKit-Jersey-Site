import { PaymentProvider, CreatePaymentParams, VerifyPaymentParams, PaymentResult } from './types';

/**
 * DemoPaymentProvider
 * 
 * Simulates real payment gateway interactions with synthetic delay,
 * transaction IDs, and configurable failure scenarios.
 * 
 * ========================================================================
 * TODO: HOW TO DROP IN RAZORPAY / PRODUCTION PAYMENT GATEWAY:
 * 1. Create `lib/payment/razorpay.ts` implementing the `PaymentProvider` interface.
 * 2. In `createPayment`:
 *    - Initialize Razorpay instance: `const instance = new Razorpay({ key_id, key_secret })`
 *    - Call `await instance.orders.create({ amount: params.amount * 100, currency: "INR", receipt: params.orderId })`
 * 3. In `verifyPayment`:
 *    - Validate signature using crypto:
 *      `crypto.createHmac('sha256', key_secret).update(order_id + "|" + payment_id).digest('hex') === signature`
 * 4. Replace `currentPaymentProvider` with `new RazorpayPaymentProvider()`.
 * ========================================================================
 */
export class DemoPaymentProvider implements PaymentProvider {
  name = 'DemoGateway';

  async createPayment(params: CreatePaymentParams) {
    // Generate synthetic payment session reference
    const prefix = params.method.toUpperCase();
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const paymentId = `DEMO_${prefix}_${randomHex}`;

    return {
      paymentId,
      amount: params.amount,
      currency: params.currency || 'INR',
      providerData: {
        demoMode: true,
        method: params.method,
        createdAt: new Date().toISOString(),
      },
    };
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<PaymentResult> {
    // Simulate verification
    const isSuccess = !params.transactionId.includes('FAIL');

    return {
      success: isSuccess,
      transactionId: params.transactionId,
      orderId: params.orderId,
      amount: 599,
      method: 'DEMO',
      message: isSuccess
        ? 'Payment authorized successfully in simulated campus sandbox.'
        : 'Simulated payment failure (declined by issuer or user cancellation).',
      timestamp: new Date().toISOString(),
    };
  }
}

export const currentPaymentProvider: PaymentProvider = new DemoPaymentProvider();

