import { NextRequest, NextResponse } from 'next/server';
import { getGiftCardProvider } from '@/lib/giftcards';
import { GiftCardCategory, CountryCode } from '@/lib/giftcards/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as GiftCardCategory | undefined;
    const country = searchParams.get('country') as CountryCode | undefined;
    const brand = searchParams.get('brand') || undefined;
    const search = searchParams.get('search') || undefined;
    const tag = searchParams.get('tag') as any;
    const sortBy = searchParams.get('sortBy') as any;

    const provider = getGiftCardProvider();
    const cards = await provider.getGiftCards({
      category,
      country,
      brand,
      search,
      tag,
      sortBy,
    });

    return NextResponse.json({
      success: true,
      count: cards.length,
      data: cards,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal gift card service error',
      },
      { status: 500 }
    );
  }
}
