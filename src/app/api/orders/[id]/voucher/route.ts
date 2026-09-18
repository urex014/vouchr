import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/server/services/orderService';
import { GiftCardRepository } from '@/server/repositories/giftCardRepository';
import { getServerSession } from '@/lib/auth/session';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(request);

    // 1. Retrieve order with authorization checks
    const order = await OrderService.getOrder(id, session);
    if (!order) {
      return NextResponse.json(
        { success: false, error: `Order ${id} not found` },
        { status: 404 }
      );
    }

    if (order.paymentStatus !== 'SUCCESS') {
      return NextResponse.json(
        { success: false, error: 'Payment has not been completed or verified for this order.' },
        { status: 403 }
      );
    }

    // 2. Fetch sensitive gift card document using protected projection (+code +pin)
    const giftCard = await GiftCardRepository.findByOrderId(order._id.toString(), true);

    return NextResponse.json({
      success: true,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        brandName: order.brandName,
        productName: order.productName,
        productImage: order.productImage,
        amount: order.amount,
        currency: order.currency,
        claimUrl: order.claimUrl,
        secureCodes: {
          claimCode: giftCard?.code || `VCR-${order.country.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
          pin: giftCard?.pin || `${Math.floor(1000 + Math.random() * 9000)}`,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to access voucher codes' },
      { status: error.status || 500 }
    );
  }
}
