import { ReloadlyTokenResponse } from './types';

interface CachedToken {
  token: string;
  expiresAt: number; // epoch timestamp in ms
}

let cachedToken: CachedToken | null = null;
let inFlightTokenPromise: Promise<string> | null = null;

const AUTH_URL = 'https://auth.reloadly.com/oauth/token';

/**
 * Returns the active Reloadly audience based on environment.
 * Default is sandbox as recommended during integration.
 */
export function getReloadlyAudience(): string {
  const isProduction = process.env.RELOADLY_ENVIRONMENT === 'production';
  return isProduction
    ? 'https://giftcards.reloadly.com'
    : 'https://giftcards-sandbox.reloadly.com';
}

/**
 * Checks if Reloadly server credentials are configured in the environment.
 */
export function hasReloadlyCredentials(): boolean {
  return Boolean(
    process.env.RELOADLY_CLIENT_ID?.trim() &&
    process.env.RELOADLY_CLIENT_SECRET?.trim()
  );
}

/**
 * Obtains and caches the Reloadly OAuth2 access token.
 * Token is cached in memory until 60 seconds prior to expiration.
 * Concurrent callers share a single in-flight promise to prevent rate-limit thrashing.
 * 
 * NEVER expose this token or the underlying client credentials to the client/browser.
 */
export async function getReloadlyAccessToken(): Promise<string> {
  const now = Date.now();

  // 1. Return cached token if still valid (with 60-second safety margin)
  if (cachedToken && now < cachedToken.expiresAt - 60_000) {
    return cachedToken.token;
  }

  // 2. If already fetching, await existing promise
  if (inFlightTokenPromise) {
    return inFlightTokenPromise;
  }

  // 3. Initiate fetch with mutex
  inFlightTokenPromise = (async () => {
    const clientId = process.env.RELOADLY_CLIENT_ID?.trim();
    const clientSecret = process.env.RELOADLY_CLIENT_SECRET?.trim();

    if (!clientId || !clientSecret) {
      // Return a simulated dev token if keys are not yet configured in development
      console.warn(
        '[Reloadly Auth] Server Notice: RELOADLY_CLIENT_ID and/or RELOADLY_CLIENT_SECRET not set in environment. Running in development sandbox mode.'
      );
      return 'reloadly_dev_simulation_token';
    }

    const audience = getReloadlyAudience();

    try {
      const response = await fetch(AUTH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'client_credentials',
          audience,
        }),
        cache: 'no-store',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `[Reloadly Auth] Authentication request failed with HTTP ${response.status}:`,
          errorText
        );
        throw new Error(`Reloadly authentication failure: HTTP ${response.status}`);
      }

      const data: ReloadlyTokenResponse = await response.json();

      if (!data.access_token) {
        throw new Error('Reloadly auth response did not contain an access_token');
      }

      const expiresInSeconds = data.expires_in || 86400;
      cachedToken = {
        token: data.access_token,
        expiresAt: Date.now() + expiresInSeconds * 1000,
      };

      console.info(
        `[Reloadly Auth] Successfully obtained access token (valid for ${expiresInSeconds}s)`
      );

      return cachedToken.token;
    } catch (err: any) {
      console.error('[Reloadly Auth] Network or authentication error:', err.message);
      throw err;
    } finally {
      inFlightTokenPromise = null;
    }
  })();

  return inFlightTokenPromise;
}

/**
 * Clears cached token forcing fresh authentication on next request.
 * Useful when Reloadly responds with 401 Unauthorized due to premature revocation.
 */
export function clearReloadlyTokenCache(): void {
  cachedToken = null;
  inFlightTokenPromise = null;
}
