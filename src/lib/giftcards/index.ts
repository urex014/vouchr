import { GiftCardProvider } from './provider';
import { MockGiftCardProvider } from './mock-provider';

// Singleton instance of the active gift card provider
let activeProvider: GiftCardProvider | null = null;

/**
 * Returns the configured GiftCardProvider instance.
 * Architected to switch seamlessly between mock provider and real providers
 * (such as Tillo, Reloadly, or Bitrefill) without altering UI components.
 */
export function getGiftCardProvider(): GiftCardProvider {
  if (!activeProvider) {
    // In production with credentials:
    // if (process.env.TILLO_API_KEY) {
    //   activeProvider = new TilloGiftCardProvider({ apiKey: process.env.TILLO_API_KEY });
    // } else if (process.env.RELOADLY_CLIENT_ID) {
    //   activeProvider = new ReloadlyGiftCardProvider({ ... });
    // }
    activeProvider = new MockGiftCardProvider();
  }
  return activeProvider;
}

export * from './types';
export * from './provider';
