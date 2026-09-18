import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { AdminService } from '@/server/services/adminService';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const paymentStatus = searchParams.get('paymentStatus') || undefined;
    const purchaseStatus = searchParams.get('purchaseStatus') || undefined;
    const deliveryStatus = searchParams.get('deliveryStatus') || undefined;
    const country = searchParams.get('country') || undefined;
    const product = searchParams.get('product') || undefined;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;

    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 20;

    const result = await AdminService.getOrders(
      {
        search,
        paymentStatus,
        purchaseStatus,
        deliveryStatus,
        country,
        product,
        startDate,
        endDate,
      },
      { page, limit }
    );

    return NextResponse.json({
      success: true,
      data: result.orders,
      pagination: {
        page: result.page,
        limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch admin orders' },
      { status: err.status || 500 }
    );
  }
}
