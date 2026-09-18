import { NextRequest, NextResponse } from 'next/server';
import {
  getReloadlyGiftCardById,
  orderReloadlyGiftCard,
  getReloadlyOrderCards,
} from '@/lib/reloadly/giftcards';
import { createOrder, updateOrder } from '@/lib/orders/store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      productId,
      denomination,
      quantity = 1,
      recipientEmail,
      recipientName = 'Friend',
      senderName = 'Vouchr Customer',
      senderEmail,
      message,
    } = body;

    if (!productId || !denomination || !recipientEmail) {
      return NextResponse.json(
        { success: false, error: 'Missing required purchase fields (productId, denomination, recipientEmail)' },
        { status: 400 }
      );
    }

    const card = await getReloadlyGiftCardById(productId);
    if (!card || !card.isAvailable) {
      return NextResponse.json(
        { success: false, error: 'Selected gift card is currently unavailable' },
        { status: 409 }
      );
    }

    // Create order in order store
    const order = await createOrder({
      reloadlyProductId: card.numericId,
      brandName: card.brandName,
      productName: card.productName,
      productImage: card.productImage,
      country: card.country,
      currency: card.currency,
      amount: denomination,
      quantity,
      customerEmail: senderEmail || recipientEmail,
      recipientEmail,
      recipientName,
      senderName,
      personalMessage: message,
    });

    // Execute order via Reloadly API
    const reloadlyOrder = await orderReloadlyGiftCard({
      productId: card.numericId,
      countryCode: card.country === 'GLOBAL' ? 'US' : card.country,
      quantity,
      unitPrice: denomination,
      customIdentifier: order.orderNumber,
      senderName,
      recipientEmail,
    });

    // Fetch code
    let secureCodes: { cardNumber?: string; pin?: string; claimCode?: string } | undefined;
    try {
      const cards = await getReloadlyOrderCards(reloadlyOrder.transactionId);
      if (cards && cards.length > 0) {
        secureCodes = {
          cardNumber: cards[0].cardNumber,
          pin: cards[0].pin,
          claimCode: cards[0].claimCode || cards[0].cardNumber,
        };
      }
    } catch (_) {}

    await updateOrder(order.orderId, {
      status: 'PURCHASED',
      paymentStatus: 'VERIFIED',
      deliveryStatus: 'DELIVERED',
      reloadlyTransactionId: reloadlyOrder.transactionId,
      deliveryTimestamp: new Date().toISOString(),
      secureCodes,
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.orderId,
        orderNumber: order.orderNumber,
        status: 'PURCHASED',
        claimUrl: order.claimUrl,
      },
    });
  } catch (error: any) {
    console.error('[API /api/giftcards/purchase] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Purchase transaction failed' },
      { status: 500 }
    );
  }
}
