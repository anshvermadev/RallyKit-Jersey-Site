import { NextRequest, NextResponse } from 'next/server';
import { orderRepository } from '@/lib/repositories/orders';
import { currentPaymentProvider } from '@/lib/payment/demo';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, method, simulateFailure } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    const order = await orderRepository.getById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const fakeTxId = `${(method || 'DEMO').toUpperCase()}-DEMO-${randomSuffix}${simulateFailure ? '-FAIL' : ''}`;

    // Verify through the payment provider interface
    const result = await currentPaymentProvider.verifyPayment({
      orderId,
      transactionId: fakeTxId,
    });

    if (result.success) {
      const updated = await orderRepository.updatePayment(orderId, {
        status: 'paid',
        transactionId: fakeTxId,
        paidAt: new Date().toISOString(),
      });
      return NextResponse.json({
        success: true,
        message: 'Payment completed successfully (Demo Mode)',
        transactionId: fakeTxId,
        order: updated,
      });
    } else {
      await orderRepository.updatePayment(orderId, {
        status: 'failed',
        transactionId: fakeTxId,
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Payment declined',
          message: 'The simulated transaction was declined. You can retry with a different demo method.',
          transactionId: fakeTxId,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Demo payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

