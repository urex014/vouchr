import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/server/services/paymentService';
import { z } from 'zod';

const VerifyPaymentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  providerReference: z.string().min(1, 'Payment provider reference is required'),
  provider: z.string().default('crypto'),
  cryptoDetails: z
    .object({
      txHash: z.string(),
      networkId: z.string().optional(),
    })
    .optional(),
  cardDetails: z
    .object({
      cardNumber: z.string(),
      cardExpiry: z.string(),
      cardCvc: z.string(),
    })
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = VerifyPaymentSchema.parse(body);

    const result = await PaymentService.verifyPayment(validated);

    return NextResponse.json({
      success: true,
      data: {
        orderId: result.order._id,
        orderNumber: result.order.orderNumber,
        paymentId: result.payment._id,
        paymentStatus: result.order.paymentStatus,
        purchaseStatus: result.order.purchaseStatus,
        deliveryStatus: result.order.deliveryStatus,
        claimUrl: result.order.claimUrl,
        explorerUrl: result.explorerUrl,
      },
      message: 'Payment verified and order fulfilled successfully.',
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: (err as any).issues?.[0]?.message || (err as any).errors?.[0]?.message || 'Validation error' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || 'Payment verification failed' },
      { status: err.status || 500 }
    );
  }
}
