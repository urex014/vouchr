import jwt from 'jsonwebtoken';

const AUTH_SECRET = process.env.AUTH_SECRET || 'vouchr-super-secure-jwt-secret-key-2026';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'USER' | 'ADMIN';
  name: string;
}

export function signToken(payload: TokenPayload, expiresIn: string | number = '7d'): string {
  return jwt.sign(payload, AUTH_SECRET, { expiresIn: expiresIn as any });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, AUTH_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}
