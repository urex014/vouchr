/**
 * Hardcoded Crypto Payout Wallet Configuration & Supported Blockchain Networks.
 * Payouts and customer crypto payments are routed to these designated addresses.
 */

export interface CryptoNetworkConfig {
  id: string;
  name: string;
  chainId?: number;
  symbol: string;
  tokenName: string;
  walletAddress: string;
  rpcUrl: string;
  explorerTxUrl: string;
  explorerAddressUrl: string;
  decimals: number;
  isToken: boolean;
  tokenContractAddress?: string;
  minConfirmations: number;
}

// -------------------------------------------------------------
// HARDCODED PAYOUT WALLET ADDRESSES
// Overrideable via environment variables if desired,
// otherwise uses the hardened default payout addresses below.
// -------------------------------------------------------------
export const HARDCODED_WALLETS = {
  // Primary EVM Wallet Address (Ethereum, Polygon, Base, Arbitrum)
  EVM: process.env.CRYPTO_PAYOUT_WALLET_EVM || '0x71C83e9613A88126eE7E4eC107297e6e587C6259',
  // Solana Payout Wallet Address
  SOLANA: process.env.CRYPTO_PAYOUT_WALLET_SOL || '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
  // Bitcoin Payout Address
  BITCOIN: process.env.CRYPTO_PAYOUT_WALLET_BTC || 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
};

export const SUPPORTED_CRYPTO_NETWORKS: Record<string, CryptoNetworkConfig> = {
  'polygon-usdc': {
    id: 'polygon-usdc',
    name: 'Polygon (USDC)',
    chainId: 137,
    symbol: 'USDC',
    tokenName: 'USD Coin on Polygon',
    walletAddress: HARDCODED_WALLETS.EVM,
    rpcUrl: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
    explorerTxUrl: 'https://polygonscan.com/tx/',
    explorerAddressUrl: 'https://polygonscan.com/address/',
    decimals: 6,
    isToken: true,
    // Native USDC on Polygon (PoS)
    tokenContractAddress: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    minConfirmations: 1,
  },
  'base-usdc': {
    id: 'base-usdc',
    name: 'Base (USDC)',
    chainId: 8453,
    symbol: 'USDC',
    tokenName: 'USD Coin on Base',
    walletAddress: HARDCODED_WALLETS.EVM,
    rpcUrl: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
    explorerTxUrl: 'https://basescan.org/tx/',
    explorerAddressUrl: 'https://basescan.org/address/',
    decimals: 6,
    isToken: true,
    tokenContractAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    minConfirmations: 1,
  },
  'ethereum-usdc': {
    id: 'ethereum-usdc',
    name: 'Ethereum (USDC)',
    chainId: 1,
    symbol: 'USDC',
    tokenName: 'USD Coin on Ethereum Mainnet',
    walletAddress: HARDCODED_WALLETS.EVM,
    rpcUrl: process.env.ETH_RPC_URL || 'https://cloudflare-eth.com',
    explorerTxUrl: 'https://etherscan.io/tx/',
    explorerAddressUrl: 'https://etherscan.io/address/',
    decimals: 6,
    isToken: true,
    tokenContractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    minConfirmations: 1,
  },
  'solana-usdc': {
    id: 'solana-usdc',
    name: 'Solana (USDC)',
    symbol: 'USDC',
    tokenName: 'USDC on Solana',
    walletAddress: HARDCODED_WALLETS.SOLANA,
    rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
    explorerTxUrl: 'https://solscan.io/tx/',
    explorerAddressUrl: 'https://solscan.io/account/',
    decimals: 6,
    isToken: true,
    tokenContractAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    minConfirmations: 1,
  },
};

export const DEFAULT_CRYPTO_NETWORK = 'polygon-usdc';
