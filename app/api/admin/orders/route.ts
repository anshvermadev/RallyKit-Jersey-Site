import { NextRequest, NextResponse } from 'next/server';
import { orderRepository, OrderStatus } from '@/lib/repositories/orders';
import { SITE_CONFIG } from '@/lib/config';

function isAuthorized(req: NextRequest): boolean {
  const passcode =
    req.headers.get('x-admin-passcode') ||
    req.nextUrl.searchParams.get('passcode');
  return passcode === SITE_CONFIG.adminPasscode;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized: Invalid admin passcode' }, { status: 401 });
  }

  try {
    const orders = await orderRepository.getAll();

    // Compute summary metrics for admin dashboard
    const totalOrders = orders.length;
    const paidOrders = orders.filter((o) => o.payment.status === 'paid').length;
    const totalRevenue = orders
      .filter((o) => o.payment.status === 'paid')
      .reduce((sum, o) => sum + o.pricing.total, 0);

    const departmentCounts: Record<string, number> = {};
    const sizeDistribution: Record<string, number> = {
      XS: 0,
      S: 0,
      M: 0,
      L: 0,
      XL: 0,
      '2XL': 0,
    };
    const statusCounts: Record<string, number> = {
      Registered: 0,
      Paid: 0,
      Printing: 0,
      Ready: 0,
      Collected: 0,
    };

    orders.forEach((o) => {
      // Dept count
      const dept = o.jersey.departmentName || 'Other';
      departmentCounts[dept] = (departmentCounts[dept] || 0) + (o.jersey.quantity || 1);

      // Size distribution
      const sz = o.jersey.size;
      if (sizeDistribution[sz] !== undefined) {
        sizeDistribution[sz] += o.jersey.quantity || 1;
      }

      // Status
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      summary: {
        totalOrders,
        paidOrders,
        totalRevenue,
        departmentCounts,
        sizeDistribution: Object.entries(sizeDistribution).map(([size, count]) => ({
          size,
          count,
        })),
        statusCounts,
      },
      orders,
    });
  } catch (error: any) {
    console.error('Admin GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized: Invalid admin passcode' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { orderId, status } = body;

    const validStatuses: OrderStatus[] = ['Registered', 'Paid', 'Printing', 'Ready', 'Collected'];
    if (!orderId || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid orderId or status' },
        { status: 400 }
      );
    }

    const updated = await orderRepository.updateStatus(orderId, status);
    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    console.error('Admin PATCH error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

