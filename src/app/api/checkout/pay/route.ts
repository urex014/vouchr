import { NextRequest, NextResponse } from 'next/server';
import { verifyServerSidePayment } from '@/lib/payments';
import { createOrder, updateOrder } from '@/lib/orders/store';
import {
  getReloadlyGiftCardById,
  orderReloadlyGiftCard,
  getReloadlyOrderCards,
} from '@/lib/reloadly/giftcards';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      // Payment details
      paymentMethod = 'card',
      cardDetails,
      clientToken,

      // Order & Product details
      reloadlyProductId,
      amount,
      currency = 'USD',
      quantity = 1,
      customerEmail,
      recipientEmail,
      recipientName,
      senderName,
      personalMessage,
      scheduledDate,
    } = body;

    // Validation
    if (!reloadlyProductId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required for checkout.' },
        { status: 400 }
      );
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid denomination amount is required.' },
        { status: 400 }
      );
    }

    const targetRecipientEmail = recipientEmail || customerEmail;
    if (!targetRecipientEmail || !targetRecipientEmail.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid recipient email address is required.' },
        { status: 400 }
      );
    }

    // Verify product exists in Reloadly catalog and validate amounts
    const product = await getReloadlyGiftCardById(reloadlyProductId, true);
    if (!product || !product.isAvailable) {
      return NextResponse.json(
        {
          success: false,
          error: 'This gift card is currently unavailable from the provider.',
        },
        { status: 404 }
      );
    }

    // Range vs Fixed amount validation
    if (product.denominationType === 'FIXED') {
      if (product.fixedAmounts.length > 0 && !product.fixedAmounts.includes(amount)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid denomination ${amount}. Allowed denominations: ${product.fixedAmounts.join(', ')}`,
          },
          { status: 400 }
        );
      }
    } else {
      if (amount < product.minAmount || amount > product.maxAmount) {
        return NextResponse.json(
          {
            success: false,
            error: `Amount ${amount} is outside allowed range (${product.currencySymbol}${product.minAmount} - ${product.currencySymbol}${product.maxAmount}).`,
          },
          { status: 400 }
        );
      }
    }

    const totalToCharge = amount * quantity;

    // 1. CRITICAL: Verify payment on server-side first
    const paymentVerification = await verifyServerSidePayment({
      paymentMethod,
      amount: totalToCharge,
      currency: product.currency,
      cardDetails,
      clientToken,
    });

    if (!paymentVerification.success) {
      console.warn('[Checkout API] Payment declined:', paymentVerification.error);
      return NextResponse.json(
        {
          success: false,
          error: paymentVerification.error || 'Payment authorization failed. Please check your details.',
        },
        { status: 402 }
      );
    }

    // 2. Create order record with verified payment status
    const order = await createOrder({
      reloadlyProductId: product.numericId,
      brandName: product.brandName,
      productName: product.productName,
      productImage: product.productImage,
      country: product.country,
      currency: product.currency,
      amount,
      quantity,
      customerEmail: customerEmail || targetRecipientEmail,
      recipientEmail: targetRecipientEmail,
      recipientName: recipientName || 'Friend',
      senderName: senderName || 'A thoughtful friend',
      personalMessage,
      scheduledDate,
    });

    await updateOrder(order.orderId, {
      status: 'PAYMENT_SUCCESS',
      paymentStatus: 'VERIFIED',
    });

    // 3. Execute Reloadly Gift Card purchase via official API
    let reloadlyOrder;
    try {
      reloadlyOrder = await orderReloadlyGiftCard({
        productId: product.numericId,
        countryCode: product.country === 'GLOBAL' ? 'US' : product.country,
        quantity,
        unitPrice: amount,
        customIdentifier: order.orderNumber,
        senderName: senderName || 'Vouchr Customer',
        recipientEmail: targetRecipientEmail,
      });
    } catch (reloadlyError: any) {
      console.error('[Checkout API] Reloadly fulfillment error:', reloadlyError);
      await updateOrder(order.orderId, {
        status: 'FAILED',
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Payment was captured, but provider fulfillment failed. Our concierge team has been notified.',
          orderId: order.orderId,
        },
        { status: 502 }
      );
    }

    // 4. Securely fetch digital card codes/PINs from Reloadly and store safely server-side
    let secureCodes: { cardNumber?: string; pin?: string; claimCode?: string } | undefined;
    try {
      const cards = await getReloadlyOrderCards(reloadlyOrder.transactionId);
      if (cards && cards.length > 0) {
        const primaryCard = cards[0];
        secureCodes = {
          cardNumber: primaryCard.cardNumber,
          pin: primaryCard.pin,
          claimCode: primaryCard.claimCode || primaryCard.cardNumber,
        };
      }
    } catch (cardErr) {
      console.warn('[Checkout API] Could not retrieve digital codes immediately:', cardErr);
    }

    // 5. Update order to PURCHASED and DELIVERED
    const finalOrder = await updateOrder(order.orderId, {
      status: 'PURCHASED',
      reloadlyTransactionId: reloadlyOrder.transactionId,
      deliveryStatus: scheduledDate ? 'SCHEDULED' : 'DELIVERED',
      deliveryTimestamp: new Date().toISOString(),
      secureCodes,
    });

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
      orderNumber: order.orderNumber,
      status: finalOrder?.status || 'PURCHASED',
      claimUrl: order.claimUrl,
      deliveryStatus: finalOrder?.deliveryStatus || 'DELIVERED',
      message: 'Gift card purchased and dispatched successfully.',
    });
  } catch (error: any) {
    console.error('[Checkout API] Unexpected error in /api/checkout/pay:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal checkout processing error',
      },
      { status: 500 }
    );
  }
}
