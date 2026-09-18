import { connectToDatabase } from '@/lib/mongodb/connection';
import { Payment, IPayment, PaymentRecordStatus } from '@/models/Payment';

export class PaymentRepository {
  static async create(paymentData: Partial<IPayment>): Promise<IPayment> {
    await connectToDatabase();
    return Payment.create(paymentData);
  }

  static async findByReference(providerReference: string): Promise<IPayment | null> {
    await connectToDatabase();
    return Payment.findOne({ providerReference: providerReference.trim() }).exec();
  }

  static async findByOrderId(orderId: string): Promise<IPayment[]> {
    await connectToDatabase();
    return Payment.find({ orderId }).sort({ createdAt: -1 }).exec();
  }

  static async updateStatus(
    id: string,
    status: PaymentRecordStatus,
    paidAt?: Date,
    metadata?: Record<string, any>
  ): Promise<IPayment | null> {
    await connectToDatabase();
    const updates: any = { status };
    if (paidAt) updates.paidAt = paidAt;
    if (metadata) updates.metadata = metadata;

    return Payment.findByIdAndUpdate(id, { $set: updates }, { returnDocument: 'after' }).exec();
  }

  static async findAll(
    options: { page?: number; limit?: number } = {}
  ): Promise<{ payments: IPayment[]; total: number }> {
    await connectToDatabase();
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 20));
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      Payment.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      Payment.countDocuments().exec(),
    ]);

    return { payments: payments as unknown as IPayment[], total };
  }
}
