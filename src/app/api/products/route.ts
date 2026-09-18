import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/server/services/productService';
import { requireAdmin } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country') || undefined;
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 30;

    const { products, total } = await ProductService.getProducts(
      { country, category, search, isActive: true },
      { page, limit }
    );

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (err: any) {
    console.error('[API /api/products GET] Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    const result = await ProductService.syncReloadlyProducts();
    return NextResponse.json({
      success: true,
      message: `Successfully synchronized ${result.syncedCount} products from Reloadly.`,
      data: result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Product sync failed' },
      { status: err.status || 500 }
    );
  }
}
