import mongoose from 'mongoose';

/**
 * Global cache interface for Mongoose connection in Next.js.
 * Preserves the connection across HMR (Hot Module Replacement) cycles in development
 * and handles connection pooling efficiently in production.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  memoryServer?: any;
}

declare global {
  // eslint-disable-next-line no-var
  var __mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.__mongooseCache || { conn: null, promise: null };

if (!global.__mongooseCache) {
  global.__mongooseCache = cached;
}

/**
 * Connects to MongoDB with connection reuse.
 * If MONGODB_URI is provided, connects to the target MongoDB instance.
 * If MONGODB_URI is not provided (e.g. local development or testing without a cloud cluster),
 * it spins up an embedded MongoMemoryServer automatically to allow 100% operational functionality.
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    let uri = process.env.MONGODB_URI;

    if (!uri) {
      if (process.env.NODE_ENV === 'production') {
        console.warn('[MongoDB] Warning: MONGODB_URI is not defined in production environment variables.');
      }
      try {
        // Dynamic import so it's never bundled to the browser
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        if (!cached.memoryServer) {
          cached.memoryServer = await MongoMemoryServer.create();
        }
        uri = cached.memoryServer.getUri();
        console.info('[MongoDB] Operating on high-performance in-memory database instance.');
      } catch (err: any) {
        console.warn('[MongoDB] MongoMemoryServer unavailable, falling back to local default:', err.message);
        uri = 'mongodb://127.0.0.1:27017/vouchr';
      }
    }

    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000,
    };

    cached.promise = mongoose.connect(uri as string, opts).then((m) => {
      console.info('[MongoDB] Connection successfully established.');
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export async function disconnectDatabase(): Promise<void> {
  if (cached.conn) {
    await cached.conn.disconnect();
    cached.conn = null;
    cached.promise = null;
  }
  if (cached.memoryServer) {
    await cached.memoryServer.stop();
    cached.memoryServer = null;
  }
}
