import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { AdminService } from '@/server/services/adminService';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 25;

    // Sensitive codes are safely omitted by select: false in schema
    const result = await AdminService.getGiftCards({ page, limit });

    return NextResponse.json({
      success: true,
      data: result.giftCards,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit) || 1,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch gift cards' },
      { status: err.status || 500 }
    );
  }
}
