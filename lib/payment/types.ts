export interface CreatePaymentParams {
  orderId: string;
  amount: number; // in INR
  currency?: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  method: 'upi' | 'card' | 'cash';
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  orderId: string;
  amount: number;
  method: string;
  message: string;
  timestamp: string;
  rawResponse?: any;
}

export interface VerifyPaymentParams {
  orderId: string;
  transactionId: string;
  signature?: string; // used for Razorpay HMAC verification
}

export interface PaymentProvider {
  name: string;
  createPayment(params: CreatePaymentParams): Promise<{
    paymentId: string;
    amount: number;
    currency: string;
    redirectUrl?: string;
    providerData?: Record<string, any>;
  }>;
  verifyPayment(params: VerifyPaymentParams): Promise<PaymentResult>;
}

