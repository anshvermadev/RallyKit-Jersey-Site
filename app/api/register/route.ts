import { NextRequest, NextResponse } from 'next/server';
import { orderRepository } from '@/lib/repositories/orders';
import { CreateOrderRequestSchema } from '@/lib/validators/order';
import { getDepartmentBySlug } from '@/data/departments';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateOrderRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { student, jersey, paymentMethod, simulateFailure } = parsed.data;

    // Check duplicate registration by enrollment number
    const existing = await orderRepository.findByEnrollmentOrEmail(student.enrollmentNumber);
    const hasActiveOrder = existing.some(
      (o) => o.status !== 'Collected' && o.payment.status !== 'failed'
    );

    if (hasActiveOrder) {
      return NextResponse.json(
        {
          error: 'Duplicate registration detected',
          message: `An active order already exists for enrollment number "${student.enrollmentNumber}". You can track your existing order on the MY ORDER page.`,
          existingOrderId: existing[0]?.id,
        },
        { status: 409 }
      );
    }

    // Calculate pricing
    const dept = getDepartmentBySlug(jersey.departmentSlug);
    const basePrice = dept ? dept.basePrice : 599;
    const quantity = jersey.quantity || 1;
    const customizationFee = 0; // Free in early bird demo
    const total = (basePrice + customizationFee) * quantity;

    const initialPaymentStatus = paymentMethod === 'cash' ? 'pending' : (simulateFailure ? 'failed' : 'paid');
    const initialOrderStatus = initialPaymentStatus === 'paid' ? 'Paid' : 'Registered';

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const transactionId = `${paymentMethod.toUpperCase()}-DEMO-${randomSuffix}${simulateFailure ? '-FAIL' : ''}`;

    const newOrder = await orderRepository.create({
      student,
      jersey: {
        ...jersey,
        thumbnailSnapshot: jersey.thumbnailSnapshot || '',
      },
      pricing: {
        basePrice,
        customizationFee,
        quantity,
        discount: 0,
        total,
      },
      payment: {
        method: paymentMethod,
        status: initialPaymentStatus,
        transactionId,
        paidAt: initialPaymentStatus === 'paid' ? new Date().toISOString() : undefined,
        demoDetails: {
          gatewayRef: `DEMO_GW_${randomSuffix}`,
        },
      },
      status: initialOrderStatus,
    });

    return NextResponse.json(
      {
        success: true,
        order: newOrder,
        orderId: newOrder.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message || 'Something went wrong processing your registration.',
      },
      { status: 500 }
    );
  }
}
