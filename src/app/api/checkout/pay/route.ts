import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/server/services/orderService';
import { PaymentService } from '@/server/services/paymentService';
import { getServerSession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(request);
    const body = await request.json();

    const {
      // Payment details
      paymentMethod = 'crypto',
      cryptoDetails,

      // Order & Product details
      reloadlyProductId,
      amount,
      quantity = 1,
      customerEmail,
      recipientEmail,
      recipientName,
      senderName,
      personalMessage,
    } = body;

    // 1. Payment Gateway Validation (Crypto Only)
    if (paymentMethod !== 'crypto') {
      return NextResponse.json(
        { success: false, error: 'Only cryptocurrency payment gateways are supported on this platform.' },
        { status: 400 }
      );
    }

    if (!cryptoDetails?.txHash || !cryptoDetails.txHash.trim()) {
      return NextResponse.json(
        { success: false, error: 'Blockchain transaction hash (TxID) is required for cryptocurrency payment.' },
        { status: 400 }
      );
    }

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

    // 2. Create Order document in MongoDB via OrderService
    const order = await OrderService.createOrder({
      reloadlyProductId: Number(reloadlyProductId),
      amount: Number(amount),
      quantity: Number(quantity),
      customerEmail: (customerEmail || targetRecipientEmail).toLowerCase().trim(),
      customerName: senderName || 'Vouchr Customer',
      recipientEmail: targetRecipientEmail.toLowerCase().trim(),
      recipientName: recipientName || 'Friend',
      personalMessage,
      userId: session?.userId,
    });

    // 3. Initialize Payment document in MongoDB
    const paymentInit = await PaymentService.initializePayment({
      orderId: order._id.toString(),
      provider: paymentMethod as any,
      userId: session?.userId,
    });

    // 4. Verify Payment on-chain/card and fulfill via Reloadly
    const verificationResult = await PaymentService.verifyPayment({
      orderId: order._id.toString(),
      providerReference: paymentInit.providerReference,
      provider: 'crypto',
      cryptoDetails,
    });

    const finalOrder = verificationResult.order;

    return NextResponse.json({
      success: true,
      orderId: finalOrder._id,
      orderNumber: finalOrder.orderNumber,
      status: finalOrder.purchaseStatus === 'SUCCESS' ? 'PURCHASED' : finalOrder.purchaseStatus,
      paymentStatus: finalOrder.paymentStatus,
      deliveryStatus: finalOrder.deliveryStatus,
      claimUrl: finalOrder.claimUrl,
      explorerUrl: verificationResult.explorerUrl,
      message: 'Gift card purchased and dispatched successfully.',
    });
  } catch (error: any) {
    console.error('[Checkout API] Error in /api/checkout/pay:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal checkout processing error',
      },
      { status: error.status || 500 }
    );
  }
}
