import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/server/services/orderService';
import { getServerSession } from '@/lib/auth/session';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(request);
    const order = await OrderService.getOrder(id, session);

    if (!order) {
      return NextResponse.json(
        { success: false, error: `Order ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve order' },
      { status: error.status || 500 }
    );
  }
}
