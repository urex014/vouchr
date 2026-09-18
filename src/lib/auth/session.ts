import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, TokenPayload } from './jwt';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { User, IUser } from '@/models/User';

export const AUTH_COOKIE_NAME = 'vouchr_token';

/**
 * Extracts auth token from cookies or Authorization header
 */
export function extractToken(request: NextRequest | Request): string | null {
  // 1. Check Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }

  // 2. Check NextRequest cookies
  if ('cookies' in request && typeof request.cookies.get === 'function') {
    const cookie = request.cookies.get(AUTH_COOKIE_NAME);
    if (cookie?.value) {
      return cookie.value;
    }
  }

  // 3. Check Cookie header fallback
  const rawCookie = request.headers.get('cookie');
  if (rawCookie) {
    const match = rawCookie.match(new RegExp(`(?:^|; )${AUTH_COOKIE_NAME}=([^;]*)`));
    if (match) {
      return decodeURIComponent(match[1]);
    }
  }

  return null;
}

/**
 * Retrieves the authenticated session payload
 */
export async function getServerSession(
  request: NextRequest | Request
): Promise<TokenPayload | null> {
  const token = extractToken(request);
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  return payload;
}

/**
 * Enforces authenticated user. Returns session or throws standard response.
 */
export async function requireAuth(
  request: NextRequest | Request
): Promise<{ user: TokenPayload }> {
  const session = await getServerSession(request);
  if (!session) {
    const err: any = new Error('Authentication required.');
    err.status = 401;
    throw err;
  }
  return { user: session };
}

/**
 * Enforces admin authorization. Returns session or throws 401/403.
 * Always verifies role against database for zero-trust authorization.
 */
export async function requireAdmin(
  request: NextRequest | Request
): Promise<{ user: TokenPayload; userDoc: IUser }> {
  const session = await getServerSession(request);
  if (!session) {
    const err: any = new Error('Authentication required.');
    err.status = 401;
    throw err;
  }

  await connectToDatabase();
  const userDoc = await User.findById(session.userId);

  if (!userDoc || userDoc.role !== 'ADMIN') {
    const err: any = new Error('Access forbidden: Administrator credentials required.');
    err.status = 403;
    throw err;
  }

  return { user: session, userDoc };
}

/**
 * Attaches HTTP-only auth cookie to NextResponse
 */
export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Clears auth cookie on logout
 */
export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
