import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/server/services/orderService';
import { getServerSession } from '@/lib/auth/session';
import { z } from 'zod';

const CreateOrderSchema = z.object({
  productId: z.string().optional(),
  reloadlyProductId: z.number().int().positive('Product ID must be a valid positive number'),
  amount: z.number().positive('Denomination amount must be positive'),
  quantity: z.number().int().positive().default(1),
  customerEmail: z.string().email('Valid customer email required'),
  customerName: z.string().optional(),
  recipientEmail: z.string().email('Valid recipient email required'),
  recipientName: z.string().optional(),
  personalMessage: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(request);
    const body = await request.json();
    const validated = CreateOrderSchema.parse(body);

    const order = await OrderService.createOrder({
      ...validated,
      userId: session?.userId,
    });

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order initialized successfully.',
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: (err as any).issues?.[0]?.message || (err as any).errors?.[0]?.message || 'Validation error' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || 'Order creation failed' },
      { status: err.status || 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(request);
    const { searchParams } = new URL(request.url);
    const guestEmail = searchParams.get('email');

    if (!session && !guestEmail) {
      return NextResponse.json(
        { success: false, error: 'Authentication or customer email required' },
        { status: 401 }
      );
    }

    const orders = session
      ? await OrderService.getUserOrders(session)
      : await OrderService.getUserOrders({
          userId: '',
          email: guestEmail!,
          role: 'USER',
          name: '',
        });

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
