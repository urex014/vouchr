import { NextRequest, NextResponse } from 'next/server';
import { getReloadlyCountries } from '@/lib/reloadly/giftcards';

export async function GET(request: NextRequest) {
  try {
    const countries = await getReloadlyCountries();
    return NextResponse.json({
      success: true,
      data: countries,
    });
  } catch (error: any) {
    console.error('[API /api/giftcards/countries] Error fetching countries:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve supported countries' },
      { status: 500 }
    );
  }
}
