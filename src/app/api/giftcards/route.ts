import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/server/services/productService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country') || searchParams.get('countryCode') || undefined;
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 50;

    const { products } = await ProductService.getProducts(
      { country, category, search, isActive: true },
      { limit }
    );

    // Map to normalized gift card format for existing frontend consumers
    const formatted = products.map((p) => ({
      id: String(p.reloadlyProductId),
      numericId: p.reloadlyProductId,
      brand: p.brandName,
      brandName: p.brandName,
      brandSlug: p.brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      productName: p.productName,
      brandLogo: p.brandLogo,
      logoUrl: p.brandLogo,
      productImage: p.productImage,
      giftCardImage: p.productImage,
      giftCardUrl: p.productImage,
      category: p.category,
      country: p.country,
      countryName: p.country === 'GLOBAL' ? 'Global' : p.country,
      currency: p.currency,
      currencySymbol: p.currency === 'USD' ? '$' : p.currency === 'EUR' ? '€' : p.currency === 'GBP' ? '£' : p.currency,
      denominations: p.fixedAmounts.length > 0 ? p.fixedAmounts : [p.minAmount, p.maxAmount],
      minAmount: p.minAmount,
      maxAmount: p.maxAmount,
      fixedAmounts: p.fixedAmounts,
      denominationType: p.denominationType,
      deliveryMethod: p.deliveryMethod,
      description: p.description,
      isAvailable: p.isActive,
      available: p.isActive,
      availability: p.isActive ? 'in_stock' : 'out_of_stock',
      global: p.country === 'GLOBAL',
    }));

    return NextResponse.json({
      success: true,
      count: formatted.length,
      data: formatted,
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
