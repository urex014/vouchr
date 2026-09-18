import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { GiftCard, IGiftCard, VoucherStatus } from '@/models/GiftCard';

export class GiftCardRepository {
  static async create(cardData: Partial<IGiftCard>): Promise<IGiftCard> {
    await connectToDatabase();
    return GiftCard.create(cardData);
  }

  static async findByOrderId(
    orderId: string | mongoose.Types.ObjectId,
    includeSensitiveCodes = false
  ): Promise<IGiftCard | null> {
    await connectToDatabase();
    const conditions: any[] = [{ orderId: String(orderId) }, { orderId }];
    if (mongoose.isValidObjectId(orderId)) {
      conditions.push({ orderId: new mongoose.Types.ObjectId(orderId) });
    }
    const query = GiftCard.findOne({ $or: conditions });
    if (includeSensitiveCodes) {
      query.select('+code +pin');
    }
    return query.exec();
  }

  static async findAll(
    options: { page?: number; limit?: number } = {}
  ): Promise<{ giftCards: IGiftCard[]; total: number }> {
    await connectToDatabase();
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 20));
    const skip = (page - 1) * limit;

    // Sensitive codes are naturally excluded by select: false on schema
    const [giftCards, total] = await Promise.all([
      GiftCard.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      GiftCard.countDocuments().exec(),
    ]);

    return { giftCards: giftCards as unknown as IGiftCard[], total };
  }

  static async updateStatus(id: string, status: VoucherStatus): Promise<IGiftCard | null> {
    await connectToDatabase();
    return GiftCard.findByIdAndUpdate(id, { status }, { returnDocument: 'after' }).exec();
  }
}
