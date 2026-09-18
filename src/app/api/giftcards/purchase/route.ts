import { NextRequest, NextResponse } from 'next/server';
import { getGiftCardProvider } from '@/lib/giftcards';
import { PurchaseRequest } from '@/lib/giftcards/types';

export async function POST(request: NextRequest) {
  try {
    const body: PurchaseRequest = await request.json();

    if (!body.productId || !body.denomination || !body.recipientEmail) {
      return NextResponse.json(
        { success: false, error: 'Missing required purchase fields' },
        { status: 400 }
      );
    }

    const provider = getGiftCardProvider();
    
    // 1. Verify availability
    const isAvailable = await provider.checkAvailability(body.productId, body.denomination);
    if (!isAvailable) {
      return NextResponse.json(
        { success: false, error: 'Selected gift card or denomination is currently unavailable' },
        { status: 409 }
      );
    }

    // 2. Execute purchase with provider API (server-side credentials stay hidden)
    const result = await provider.purchaseGiftCard(body);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Purchase transaction failed' },
      { status: 500 }
    );
  }
}
