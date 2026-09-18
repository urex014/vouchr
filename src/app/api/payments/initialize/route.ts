import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/server/services/paymentService';
import { getServerSession } from '@/lib/auth/session';
import { z } from 'zod';

const InitializeSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  provider: z.enum(['crypto']).default('crypto'),
  channel: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(request);
    const body = await request.json();
    const validated = InitializeSchema.parse(body);

    const result = await PaymentService.initializePayment({
      orderId: validated.orderId,
      provider: validated.provider,
      channel: validated.channel,
      userId: session?.userId,
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Payment initialized successfully.',
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: (err as any).issues?.[0]?.message || (err as any).errors?.[0]?.message || 'Validation error' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || 'Payment initialization failed' },
      { status: err.status || 500 }
    );
  }
}
