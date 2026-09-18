import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { AdminService } from '@/server/services/adminService';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireAdmin(request);
    const { id } = await params;

    const order = await AdminService.retryOrderFulfillment(id, {
      userId: user.userId,
      email: user.email,
    });

    return NextResponse.json({
      success: true,
      message: `Order fulfillment retried. New purchase status: ${order.purchaseStatus}`,
      data: order,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Retry fulfillment failed' },
      { status: err.status || 500 }
    );
  }
}
