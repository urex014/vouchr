import { connectToDatabase } from '@/lib/mongodb/connection';
import { User, IUser } from '@/models/User';

export class UserRepository {
  static async findByEmail(email: string, includePassword = false): Promise<IUser | null> {
    await connectToDatabase();
    const query = User.findOne({ email: email.toLowerCase().trim() });
    if (includePassword) {
      query.select('+passwordHash');
    }
    return query.exec();
  }

  static async findById(id: string): Promise<IUser | null> {
    await connectToDatabase();
    return User.findById(id).exec();
  }

  static async create(userData: Partial<IUser>): Promise<IUser> {
    await connectToDatabase();
    return User.create({
      ...userData,
      email: userData.email?.toLowerCase().trim(),
    });
  }

  static async updateLastLogin(id: string): Promise<void> {
    await connectToDatabase();
    await User.findByIdAndUpdate(id, { lastLoginAt: new Date() }).exec();
  }

  static async count(): Promise<number> {
    await connectToDatabase();
    return User.countDocuments({ role: 'USER' }).exec();
  }
}
