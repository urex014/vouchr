import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { AdminService } from '@/server/services/adminService';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const stats = await AdminService.getStats();

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch admin stats' },
      { status: err.status || 500 }
    );
  }
}
