import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { UserRepository } from '@/server/repositories/userRepository';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { User } from '@/models/User';
import { z } from 'zod';

const UpdateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional().or(z.literal('')),
});

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireAuth(request);
    const userDoc = await UserRepository.findById(user.userId);

    if (!userDoc) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        _id: userDoc._id,
        name: userDoc.name,
        email: userDoc.email,
        role: userDoc.role,
        phone: userDoc.phone,
        avatar: userDoc.avatar,
        isVerified: userDoc.isVerified,
        createdAt: userDoc.createdAt,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch user' },
      { status: err.status || 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { user } = await requireAuth(request);
    const body = await request.json();
    const validated = UpdateProfileSchema.parse(body);

    await connectToDatabase();
    const updated = await User.findByIdAndUpdate(
      user.userId,
      { $set: validated },
      { returnDocument: 'after' }
    );

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Profile updated successfully.',
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: (err as any).issues?.[0]?.message || (err as any).errors?.[0]?.message || 'Validation error' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || 'Profile update failed' },
      { status: err.status || 500 }
    );
  }
}
