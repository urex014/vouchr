import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/server/services/authService';
import { setAuthCookie } from '@/lib/auth/session';
import { z } from 'zod';

const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  phone: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = RegisterSchema.parse(body);

    const { user, token } = await AuthService.register(validated);

    const response = NextResponse.json({
      success: true,
      data: { user, token },
      message: 'Account registered successfully.',
    });

    setAuthCookie(response, token);
    return response;
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: (err as any).issues?.[0]?.message || (err as any).errors?.[0]?.message || 'Validation error' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || 'Registration failed.' },
      { status: err.status || 500 }
    );
  }
}
