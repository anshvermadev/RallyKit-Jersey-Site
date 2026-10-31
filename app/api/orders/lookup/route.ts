import { NextRequest, NextResponse } from 'next/server';
import { orderRepository } from '@/lib/repositories/orders';
import { OrderLookupSchema } from '@/lib/validators/order';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = OrderLookupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { enrollmentNumber, email } = parsed.data;
    const orders = await orderRepository.findByEnrollmentOrEmail(enrollmentNumber, email);

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        {
          error: 'Not found',
          message: `No order records found matching enrollment number "${enrollmentNumber}". Please verify your details.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      orders,
      count: orders.length,
    });
  } catch (error: any) {
    console.error('Order Lookup error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
