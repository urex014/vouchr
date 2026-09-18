import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/server/services/paymentService';

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-payment-signature') || request.headers.get('verif-hash');
    const body = await request.json();

    const result = await PaymentService.processWebhook('generic', body, signature);

    return NextResponse.json({
      received: true,
      processed: result.processed,
      orderId: result.orderId,
    });
  } catch (err: any) {
    console.error('[API /api/payments/webhook] Webhook error:', err);
    return NextResponse.json({ received: true, error: err.message }, { status: 200 });
  }
}
