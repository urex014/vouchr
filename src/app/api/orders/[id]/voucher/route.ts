import { NextRequest, NextResponse } from 'next/server';
import { getOrderById } from '@/lib/orders/store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Explicitly requested with secure codes for legitimate customer claim
    const order = await getOrderById(id, true);

    if (!order) {
      return NextResponse.json(
        { success: false, error: `Order ${id} not found` },
        { status: 404 }
      );
    }

    if (order.paymentStatus !== 'VERIFIED') {
      return NextResponse.json(
        { success: false, error: 'Payment has not been completed or verified for this order.' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.orderId,
        orderNumber: order.orderNumber,
        brandName: order.brandName,
        productName: order.productName,
        productImage: order.productImage,
        amount: order.amount,
        currency: order.currency,
        claimUrl: order.claimUrl,
        secureCodes: order.secureCodes || {
          claimCode: `VCR-${order.country.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
          pin: `${Math.floor(1000 + Math.random() * 9000)}`,
        },
      },
    });
  } catch (error: any) {
    console.error(`[API /api/orders/[id]/voucher] Error:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to access voucher codes' },
      { status: 500 }
    );
  }
}
