import { NextRequest, NextResponse } from 'next/server';
import { orderRepository } from '@/lib/repositories/orders';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const order = await orderRepository.getById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found', message: `No order found with reference "${orderId}"` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Get Order error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
