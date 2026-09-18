import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { AdminService } from '@/server/services/adminService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireAdmin(request);
    const { id } = await params;

    const credentials = await AdminService.revealGiftCard(id, {
      userId: user.userId,
      email: user.email,
    });

    return NextResponse.json({
      success: true,
      data: credentials,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to reveal gift card codes' },
      { status: err.status || 500 }
    );
  }
}
