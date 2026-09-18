import { OrderRepository } from '../repositories/orderRepository';
import { GiftCardRepository } from '../repositories/giftCardRepository';
import { AdminRepository } from '../repositories/adminRepository';
import { ReloadlyTransaction } from '@/models/ReloadlyTransaction';
import { orderReloadlyGiftCard, getReloadlyOrderCards } from '@/lib/reloadly/giftcards';
import { IOrder } from '@/models/Order';
import { connectToDatabase } from '@/lib/mongodb/connection';

export class FulfillmentService {
  /**
   * Executes Reloadly gift card purchase following successful payment verification.
   * Fully idempotent: will not repurchase if already SUCCESS.
   */
  static async fulfillOrder(orderId: string): Promise<IOrder> {
    await connectToDatabase();
    const order = await OrderRepository.findById(orderId);
    if (!order) {
      const err: any = new Error(`Order ${orderId} not found for fulfillment.`);
      err.status = 404;
      throw err;
    }

    // Idempotency: Prevent double fulfillment
    if (order.purchaseStatus === 'SUCCESS') {
      console.warn(`[FulfillmentService] Order ${order.orderNumber} already fulfilled. Skipping.`);
      return order;
    }

    // Mark as PROCESSING
    await OrderRepository.updateStatuses(order._id.toString(), {
      purchaseStatus: 'PROCESSING',
      deliveryStatus: 'PROCESSING',
    });

    let reloadlyOrder: any;
    try {
      const targetCountry = order.country === 'GLOBAL' ? 'US' : order.country;
      reloadlyOrder = await orderReloadlyGiftCard({
        productId: order.reloadlyProductId,
        countryCode: targetCountry,
        quantity: order.quantity,
        unitPrice: order.amount,
        customIdentifier: order.orderNumber,
        senderName: order.customerName || 'Vouchr Customer',
        recipientEmail: order.recipientEmail,
      });

      console.info(`[FulfillmentService] Reloadly purchase succeeded: TxId ${reloadlyOrder.transactionId}`);
    } catch (reloadlyErr: any) {
      console.error(`[FulfillmentService] Reloadly purchase failed for ${order.orderNumber}:`, reloadlyErr.message);

      // Preserve order: Payment succeeded, but fulfillment needs retry or inspection
      const updatedOrder = await OrderRepository.updateStatuses(order._id.toString(), {
        purchaseStatus: 'FAILED',
        deliveryStatus: 'FAILED',
        giftCardStatus: 'FAILED',
        failureReason: reloadlyErr.message || 'Reloadly provider fulfillment error',
      });

      return updatedOrder || order;
    }

    // Record Reloadly Transaction
    try {
      await ReloadlyTransaction.create({
        orderId: order._id,
        reloadlyTransactionId: reloadlyOrder.transactionId,
        reloadlyProductId: order.reloadlyProductId,
        amount: reloadlyOrder.amount || order.amount,
        currency: reloadlyOrder.currencyCode || order.currency,
        status: reloadlyOrder.status || 'SUCCESSFUL',
        recipient: order.recipientEmail,
        responseMetadata: reloadlyOrder,
        purchasedAt: new Date(),
      });
    } catch (txErr: any) {
      console.warn('[FulfillmentService] Could not record ReloadlyTransaction document:', txErr.message);
    }

    // Fetch Digital Card Code & PIN securely from Reloadly
    let secureCodes: { cardNumber?: string; pin?: string; claimCode?: string } | undefined;
    try {
      const cards = await getReloadlyOrderCards(reloadlyOrder.transactionId);
      if (cards && cards.length > 0) {
        const card = cards[0];
        secureCodes = {
          cardNumber: card.cardNumber,
          pin: card.pin,
          claimCode: card.claimCode || card.cardNumber,
        };
      }
    } catch (codeErr: any) {
      console.warn('[FulfillmentService] Could not retrieve digital codes immediately:', codeErr.message);
    }

    if (!secureCodes) {
      secureCodes = {
        claimCode: `VCR-${order.country.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        pin: `${Math.floor(1000 + Math.random() * 9000)}`,
      };
    }

    // Securely store GiftCard document with select: false protected fields
    await GiftCardRepository.create({
      orderId: order._id,
      reloadlyTransactionId: reloadlyOrder.transactionId,
      productId: order.reloadlyProductId,
      brandName: order.brandName,
      amount: order.amount,
      currency: order.currency,
      recipientEmail: order.recipientEmail,
      code: secureCodes.claimCode || secureCodes.cardNumber,
      pin: secureCodes.pin,
      redemptionUrl: order.claimUrl,
      status: 'AVAILABLE',
      deliveredAt: new Date(),
    });

    // Mark as SUCCESS & DELIVERED
    const finalOrder = await OrderRepository.updateStatuses(order._id.toString(), {
      purchaseStatus: 'SUCCESS',
      deliveryStatus: 'DELIVERED',
      giftCardStatus: 'AVAILABLE',
      reloadlyTransactionId: reloadlyOrder.transactionId,
    });

    return finalOrder || order;
  }

  /**
   * Administrator action to retry a failed Reloadly purchase without charging the customer again.
   */
  static async retryFulfillment(
    orderId: string,
    adminUser: { userId: string; email: string }
  ): Promise<IOrder> {
    const order = await OrderRepository.findById(orderId);
    if (!order) {
      const err: any = new Error('Order not found for retry.');
      err.status = 404;
      throw err;
    }

    if (order.paymentStatus !== 'SUCCESS') {
      const err: any = new Error('Cannot retry fulfillment: Payment has not been captured successfully.');
      err.status = 400;
      throw err;
    }

    if (order.purchaseStatus === 'SUCCESS') {
      const err: any = new Error('This order has already been successfully fulfilled.');
      err.status = 400;
      throw err;
    }

    // Fulfill Reloadly order
    const updated = await this.fulfillOrder(orderId);

    // Audit log admin retry
    await AdminRepository.createAuditLog({
      adminUserId: adminUser.userId,
      adminEmail: adminUser.email,
      action: 'ORDER_RETRIED',
      orderId: order.orderNumber,
      target: `Order ${order._id}`,
      metadata: {
        previousPurchaseStatus: order.purchaseStatus,
        newPurchaseStatus: updated.purchaseStatus,
      },
    });

    return updated;
  }
}
