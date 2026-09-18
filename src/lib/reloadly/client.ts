import { getReloadlyAccessToken, clearReloadlyTokenCache, getReloadlyAudience } from './auth';
import { ReloadlyApiError } from './types';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  timeoutMs?: number;
  cacheTtlMs?: number; // In-memory cache for GET endpoints
  logContext?: {
    requestType?: string;
    productId?: string | number;
    orderId?: string;
    transactionId?: string | number;
  };
}

interface CacheEntry {
  data: any;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry>();

/**
 * Executes a resilient, authenticated request to the Reloadly Gift Cards API.
 * Includes automatic 401 token refresh, sanitized server-side telemetry, and timeouts.
 */
export async function reloadlyFetch<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    timeoutMs = 15000,
    cacheTtlMs = 0,
    logContext = {},
  } = options;

  const baseUrl = getReloadlyAudience();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const cacheKey = `${method}:${url}:${JSON.stringify(body || '')}`;

  // 1. Check in-memory cache for idempotent GET requests
  if (method === 'GET' && cacheTtlMs > 0) {
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.data as T;
    }
  }

  // 2. Obtain OAuth2 token
  const token = await getReloadlyAccessToken();

  const controller = new AbortController();
  const timeoutTimer = setTimeout(() => controller.abort(), timeoutMs);
  const startTime = Date.now();

  const executeRequest = async (authToken: string) => {
    return fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/com.reloadly.giftcards-v1+json',
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      cache: 'no-store',
    });
  };

  try {
    let response = await executeRequest(token);

    // 3. Handle 401 Unauthorized by invalidating token and retrying once
    if (response.status === 401) {
      console.warn('[Reloadly Client] Received 401 Unauthorized. Refreshing token and retrying...');
      clearReloadlyTokenCache();
      const freshToken = await getReloadlyAccessToken();
      response = await executeRequest(freshToken);
    }

    const duration = Date.now() - startTime;

    // Sanitized server-side logging (Never log tokens, secrets, or codes)
    console.info('[Reloadly API Telemetry]', {
      timestamp: new Date().toISOString(),
      type: logContext.requestType || method,
      endpoint,
      status: response.status,
      durationMs: duration,
      productId: logContext.productId,
      orderId: logContext.orderId,
      transactionId: logContext.transactionId,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      let parsedError: any = {};
      try {
        parsedError = JSON.parse(errorBody);
      } catch (_) {
        parsedError = { message: errorBody };
      }

      const apiError: ReloadlyApiError = {
        message: parsedError.message || `Reloadly error HTTP ${response.status}`,
        code: parsedError.errorCode || parsedError.code,
        statusCode: response.status,
        details: parsedError,
      };

      console.error('[Reloadly API Error]', {
        timestamp: new Date().toISOString(),
        endpoint,
        status: response.status,
        errorCode: apiError.code,
        errorMessage: apiError.message,
      });

      throw apiError;
    }

    const data = await response.json();

    // Store in cache if enabled
    if (method === 'GET' && cacheTtlMs > 0) {
      memoryCache.set(cacheKey, {
        data,
        expiresAt: Date.now() + cacheTtlMs,
      });
    }

    return data as T;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      const timeoutError: ReloadlyApiError = {
        message: 'Reloadly API request timed out after 15 seconds',
        code: 'TIMEOUT',
        statusCode: 504,
      };
      throw timeoutError;
    }
    throw err;
  } finally {
    clearTimeout(timeoutTimer);
  }
}

/**
 * Clears cached catalog responses from memory when fresh data is required.
 */
export function clearReloadlyCatalogCache(): void {
  memoryCache.clear();
}
