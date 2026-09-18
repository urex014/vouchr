import { NextRequest, NextResponse } from 'next/server';
import { getGiftCardProvider } from '@/lib/giftcards';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const provider = getGiftCardProvider();
    const card = await provider.getGiftCard(id);

    if (!card) {
      return NextResponse.json(
        { success: false, error: `Gift card ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: card,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
