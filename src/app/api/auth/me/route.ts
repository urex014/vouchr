import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { UserRepository } from '@/server/repositories/userRepository';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userDoc = await UserRepository.findById(session.userId);
    if (!userDoc) {
      return NextResponse.json(
        { success: false, error: 'User record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          _id: userDoc._id,
          name: userDoc.name,
          email: userDoc.email,
          role: userDoc.role,
          phone: userDoc.phone,
          avatar: userDoc.avatar,
          isVerified: userDoc.isVerified,
          createdAt: userDoc.createdAt,
        },
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Session lookup failed' },
      { status: 500 }
    );
  }
}
