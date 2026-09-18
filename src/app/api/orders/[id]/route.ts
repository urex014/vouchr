import { NextRequest, NextResponse } from 'next/server';
import { getOrderById } from '@/lib/orders/store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Always sanitized - strips out secureCodes (card numbers / PINs)
    const order = await getOrderById(id, false);

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
    console.error(`[API /api/orders/[id]] Error:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve order' },
      { status: 500 }
    );
  }
}
