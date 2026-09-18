import { NextRequest, NextResponse } from 'next/server';
import { verifyCryptoPayment } from '@/lib/crypto/verifier';
import { SUPPORTED_CRYPTO_NETWORKS, DEFAULT_CRYPTO_NETWORK, HARDCODED_WALLETS } from '@/lib/crypto/config';

export async function GET(request: NextRequest) {
  // Return payout wallet addresses & supported networks for client display
  return NextResponse.json({
    success: true,
    data: {
      wallets: HARDCODED_WALLETS,
      networks: Object.values(SUPPORTED_CRYPTO_NETWORKS).map((net) => ({
        id: net.id,
        name: net.name,
        symbol: net.symbol,
        tokenName: net.tokenName,
        walletAddress: net.walletAddress,
        decimals: net.decimals,
        explorerTxUrl: net.explorerTxUrl,
        isToken: net.isToken,
      })),
      defaultNetwork: DEFAULT_CRYPTO_NETWORK,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { txHash, networkId = DEFAULT_CRYPTO_NETWORK, expectedAmountUSD } = body;

    if (!txHash) {
      return NextResponse.json(
        { success: false, error: 'Transaction hash is required.' },
        { status: 400 }
      );
    }

    if (!expectedAmountUSD || expectedAmountUSD <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid expected amount in USD is required.' },
        { status: 400 }
      );
    }

    const verificationResult = await verifyCryptoPayment({
      txHash,
      networkId,
      expectedAmountUSD,
    });

    if (!verificationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: verificationResult.error || 'Transaction verification failed on-chain.',
          details: verificationResult,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Crypto transaction successfully verified on-chain.',
      data: verificationResult,
    });
  } catch (err: any) {
    console.error('[API /api/checkout/verify-crypto] Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal crypto verification failure.' },
      { status: 500 }
    );
  }
}
