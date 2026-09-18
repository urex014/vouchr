import { NextRequest, NextResponse } from 'next/server';
import { getReloadlyGiftCards } from '@/lib/reloadly/giftcards';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const countryCode = searchParams.get('country') || undefined;
    const category = searchParams.get('category') || undefined;
    const brand = searchParams.get('brand') || undefined;
    const search = searchParams.get('search') || undefined;
    const sortBy = searchParams.get('sortBy') as any;

    const cards = await getReloadlyGiftCards({
      countryCode,
      category,
      brand,
      search,
      sortBy,
    });

    return NextResponse.json({
      success: true,
      count: cards.length,
      data: cards,
    });
  } catch (err: any) {
    console.error('[API /api/giftcards] Error:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'This gift card catalog is temporarily unavailable. Please try again.',
      },
      { status: 500 }
    );
  }
}
