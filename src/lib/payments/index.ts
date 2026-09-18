import { verifyCryptoPayment } from '../crypto/verifier';

export interface PaymentVerificationRequest {
  paymentMethod: 'crypto';
  amount: number;
  currency: string;
  cryptoDetails: {
    txHash: string;
    networkId?: string;
  };
  clientToken?: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  paymentId: string;
  paymentMethod: 'crypto';
  amountCharged: number;
  currency: string;
  verifiedAt: string;
  explorerUrl?: string;
  error?: string;
}

/**
 * Server-side payment verification engine.
 * Never trust the client for payment completion.
 * Validates and captures settlement before calling Reloadly fulfillment.
 */
export async function verifyServerSidePayment(
  request: PaymentVerificationRequest
): Promise<PaymentVerificationResult> {
  const { paymentMethod, amount, currency, cryptoDetails } = request;

  if (!amount || amount <= 0) {
    return {
      success: false,
      paymentId: '',
      paymentMethod,
      amountCharged: 0,
      currency,
      verifiedAt: new Date().toISOString(),
      error: 'Invalid payment amount specified.',
    };
  }

  if (paymentMethod !== 'crypto') {
    return {
      success: false,
      paymentId: '',
      paymentMethod: 'crypto',
      amountCharged: 0,
      currency,
      verifiedAt: new Date().toISOString(),
      error: 'Only cryptocurrency payments are accepted on this platform.',
    };
  }

  if (!cryptoDetails?.txHash) {
    return {
      success: false,
      paymentId: '',
      paymentMethod: 'crypto',
      amountCharged: 0,
      currency,
      verifiedAt: new Date().toISOString(),
      error: 'Transaction hash is required to verify crypto payment.',
    };
  }

  const cryptoResult = await verifyCryptoPayment({
    txHash: cryptoDetails.txHash,
    networkId: cryptoDetails.networkId,
    expectedAmountUSD: amount,
  });

  if (!cryptoResult.success) {
    return {
      success: false,
      paymentId: '',
      paymentMethod: 'crypto',
      amountCharged: 0,
      currency,
      verifiedAt: new Date().toISOString(),
      explorerUrl: cryptoResult.explorerUrl,
      error: cryptoResult.error || 'Crypto payment verification failed on-chain.',
    };
  }

  const paymentId = `crypto_${cryptoResult.networkId}_${cryptoResult.txHash.slice(0, 10)}`;
  return {
    success: true,
    paymentId,
    paymentMethod: 'crypto',
    amountCharged: cryptoResult.amountReceived,
    currency: 'USD',
    explorerUrl: cryptoResult.explorerUrl,
    verifiedAt: cryptoResult.verifiedAt,
  };
}
