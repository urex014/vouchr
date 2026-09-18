import { PaymentRepository } from '../repositories/paymentRepository';
import { OrderRepository } from '../repositories/orderRepository';
import { FulfillmentService } from './fulfillmentService';
import { verifyCryptoPayment } from '@/lib/crypto/verifier';
import { HARDCODED_WALLETS, DEFAULT_CRYPTO_NETWORK } from '@/lib/crypto/config';
import { IPayment } from '@/models/Payment';
import { IOrder } from '@/models/Order';

export interface InitializePaymentInput {
  orderId: string;
  provider: 'crypto' | string;
  channel?: string;
  userId?: string;
}

export interface VerifyPaymentInput {
  orderId: string;
  providerReference: string;
  provider: 'crypto' | string;
  cryptoDetails?: {
    txHash: string;
    networkId?: string;
  };
}

export class PaymentService {
  /**
   * Initializes a payment session and creates a Payment document in MongoDB
   */
  static async initializePayment(input: InitializePaymentInput): Promise<{
    payment: IPayment;
    providerReference: string;
    amount: number;
    currency: string;
    payoutDetails?: any;
  }> {
    const order = await OrderRepository.findById(input.orderId);
    if (!order) {
      const err: any = new Error('Order not found for payment initialization.');
      err.status = 404;
      throw err;
    }

    if (order.paymentStatus === 'SUCCESS') {
      const err: any = new Error('Order has already been paid and processed.');
      err.status = 400;
      throw err;
    }

    if (input.provider !== 'crypto') {
      const err: any = new Error('Only cryptocurrency payments (USDC/crypto) are accepted on this platform.');
      err.status = 400;
      throw err;
    }

    // Generate unique provider reference: pay_ref_<timestamp>_<random>
    const randomSuffix = Math.random().toString(36).substring(2, 9);
    const providerReference = `pay_${order.orderNumber}_${Date.now()}_${randomSuffix}`;

    const payment = await PaymentRepository.create({
      orderId: order._id,
      userId: input.userId || order.userId,
      provider: 'crypto',
      providerReference,
      amount: order.total,
      currency: order.currency,
      status: 'PENDING',
      channel: input.channel || 'crypto',
      metadata: {
        orderNumber: order.orderNumber,
        productName: order.productName,
      },
    });

    const payoutDetails = {
      wallets: HARDCODED_WALLETS,
      defaultNetwork: DEFAULT_CRYPTO_NETWORK,
      amountUSD: order.total,
    };

    return {
      payment,
      providerReference,
      amount: order.total,
      currency: order.currency,
      payoutDetails,
    };
  }

  /**
   * Verifies settlement with provider, captures payment in MongoDB, and triggers Reloadly fulfillment
   */
  static async verifyPayment(input: VerifyPaymentInput): Promise<{
    success: boolean;
    payment: IPayment;
    order: IOrder;
    explorerUrl?: string;
  }> {
    const { orderId, providerReference, provider, cryptoDetails } = input;

    if (provider !== 'crypto') {
      const err: any = new Error('Only cryptocurrency payments (USDC/crypto) are accepted on this platform.');
      err.status = 400;
      throw err;
    }

    // 1. Fetch Order and Payment from MongoDB
    const order = await OrderRepository.findById(orderId);
    if (!order) {
      const err: any = new Error(`Order ${orderId} not found.`);
      err.status = 404;
      throw err;
    }

    let payment = await PaymentRepository.findByReference(providerReference);
    if (!payment) {
      // Find by orderId as fallback or create
      const existingPayments = await PaymentRepository.findByOrderId(orderId);
      payment = existingPayments[0] || null;
    }

    // Idempotency: If payment was already verified as SUCCESS, return immediately
    if (payment && payment.status === 'SUCCESS' && order.paymentStatus === 'SUCCESS') {
      console.info(`[PaymentService] Payment ${providerReference} already verified.`);
      return {
        success: true,
        payment,
        order,
        explorerUrl: payment.metadata?.explorerUrl,
      };
    }

    let explorerUrl: string | undefined;

    // 2. Provider Verification (Zero trust on client - on-chain crypto only)
    if (!cryptoDetails?.txHash) {
      const err: any = new Error('Blockchain transaction hash (TxID) is required for crypto payment.');
      err.status = 400;
      throw err;
    }

    const cryptoResult = await verifyCryptoPayment({
      txHash: cryptoDetails.txHash,
      networkId: cryptoDetails.networkId,
      expectedAmountUSD: order.total,
    });

    if (!cryptoResult.success) {
      if (payment) {
        await PaymentRepository.updateStatus(payment._id.toString(), 'FAILED', undefined, {
          error: cryptoResult.error,
        });
      }
      const err: any = new Error(cryptoResult.error || 'On-chain transaction verification failed.');
      err.status = 402;
      throw err;
    }

    explorerUrl = cryptoResult.explorerUrl;

    // 3. Mark Payment as SUCCESS in MongoDB
    if (!payment) {
      payment = await PaymentRepository.create({
        orderId: order._id,
        userId: order.userId,
        provider,
        providerReference,
        amount: order.total,
        currency: order.currency,
        status: 'SUCCESS',
        paidAt: new Date(),
        metadata: { explorerUrl, cryptoTxHash: cryptoDetails?.txHash },
      });
    } else {
      payment = (await PaymentRepository.updateStatus(
        payment._id.toString(),
        'SUCCESS',
        new Date(),
        { ...payment.metadata, explorerUrl, cryptoTxHash: cryptoDetails?.txHash }
      ))!;
    }

    // 4. Update Order paymentStatus to SUCCESS
    const updatedOrder = await OrderRepository.updateStatuses(order._id.toString(), {
      paymentStatus: 'SUCCESS',
      paymentId: payment._id.toString(),
    });

    // 5. Trigger Reloadly fulfillment lifecycle
    const fulfilledOrder = await FulfillmentService.fulfillOrder(order._id.toString());

    return {
      success: true,
      payment,
      order: fulfilledOrder || updatedOrder || order,
      explorerUrl,
    };
  }

  /**
   * Idempotent payment webhook processor
   */
  static async processWebhook(
    provider: string,
    payload: any,
    signature?: string | null
  ): Promise<{ processed: boolean; orderId?: string }> {
    const reference = payload.reference || payload.id || payload.txHash;
    if (!reference) {
      return { processed: false };
    }

    const existingPayment = await PaymentRepository.findByReference(reference);
    if (!existingPayment) {
      return { processed: false };
    }

    if (existingPayment.status === 'SUCCESS') {
      return { processed: true, orderId: String(existingPayment.orderId) };
    }

    if (payload.status === 'successful' || payload.status === 'success' || payload.event === 'charge.completed') {
      await PaymentRepository.updateStatus(existingPayment._id.toString(), 'SUCCESS', new Date(), payload);
      await OrderRepository.updateStatuses(String(existingPayment.orderId), {
        paymentStatus: 'SUCCESS',
      });
      await FulfillmentService.fulfillOrder(String(existingPayment.orderId));
      return { processed: true, orderId: String(existingPayment.orderId) };
    }

    return { processed: true };
  }
}
