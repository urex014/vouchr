import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { AdminService } from '@/server/services/adminService';
import { z } from 'zod';

const ToggleProductSchema = z.object({
  isActive: z.boolean(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();
    const validated = ToggleProductSchema.parse(body);

    const product = await AdminService.toggleProduct(id, validated.isActive, {
      userId: user.userId,
      email: user.email,
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
      message: `Product ${validated.isActive ? 'enabled' : 'disabled'} successfully.`,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: (err as any).issues?.[0]?.message || (err as any).errors?.[0]?.message || 'Validation error' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update product status' },
      { status: err.status || 500 }
    );
  }
}
