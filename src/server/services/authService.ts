import { UserRepository } from '../repositories/userRepository';
import { hashPassword, comparePassword } from '@/lib/auth/passwords';
import { signToken, TokenPayload } from '@/lib/auth/jwt';
import { IUser } from '@/models/User';

export class AuthService {
  /**
   * Registers a new customer account
   */
  static async register(data: {
    name: string;
    email: string;
    password?: string;
    phone?: string;
  }): Promise<{ user: Partial<IUser>; token: string }> {
    const existing = await UserRepository.findByEmail(data.email);
    if (existing) {
      const err: any = new Error('An account with this email address already exists.');
      err.status = 409;
      throw err;
    }

    let passwordHash: string | undefined;
    if (data.password) {
      passwordHash = await hashPassword(data.password);
    }

    const newUser = await UserRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
      phone: data.phone,
      role: 'USER',
      isVerified: true,
      lastLoginAt: new Date(),
    });

    const tokenPayload: TokenPayload = {
      userId: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    };

    const token = signToken(tokenPayload);

    return {
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
      },
      token,
    };
  }

  /**
   * Authenticates user via email and password
   */
  static async login(
    email: string,
    password?: string
  ): Promise<{ user: Partial<IUser>; token: string }> {
    const user = await UserRepository.findByEmail(email, true);
    if (!user) {
      const err: any = new Error('Invalid email or credentials.');
      err.status = 401;
      throw err;
    }

    if (password && user.passwordHash) {
      const isMatch = await comparePassword(password, user.passwordHash);
      if (!isMatch) {
        const err: any = new Error('Invalid email or password.');
        err.status = 401;
        throw err;
      }
    }

    await UserRepository.updateLastLogin(user._id.toString());

    const tokenPayload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const token = signToken(tokenPayload);

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
      token,
    };
  }

  /**
   * Seeds an administrator user if one does not already exist
   */
  static async ensureAdminAccount(): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@vouchr.com';
    const existing = await UserRepository.findByEmail(adminEmail);
    if (!existing) {
      const defaultPassword = process.env.ADMIN_PASSWORD || 'VouchrAdmin2026!';
      const passwordHash = await hashPassword(defaultPassword);
      await UserRepository.create({
        name: 'Vouchr Executive',
        email: adminEmail,
        passwordHash,
        role: 'ADMIN',
        isVerified: true,
      });
      console.info(`[AuthService] Seeded default administrator account: ${adminEmail}`);
    }
  }
}
