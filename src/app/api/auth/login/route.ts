import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/server/services/authService';
import { setAuthCookie } from '@/lib/auth/session';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = LoginSchema.parse(body);

    // Auto-seed admin if needed on login attempt
    await AuthService.ensureAdminAccount();

    const { user, token } = await AuthService.login(validated.email, validated.password);

    const response = NextResponse.json({
      success: true,
      data: { user, token },
      message: 'Logged in successfully.',
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
      { success: false, error: err.message || 'Login failed.' },
      { status: err.status || 500 }
    );
  }
}
