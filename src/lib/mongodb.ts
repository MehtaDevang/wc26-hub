import { MongoClient, type Db } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

/**
 * Shared MongoDB client.
 *
 * The connection string is provided by the Vercel MongoDB integration as
 * `MONGODB_URI`. `attachDatabasePool` lets Vercel Fluid Compute reuse the
 * pool across invocations and close it cleanly on shutdown.
 *
 * In development we cache the client promise on `globalThis` so Next.js hot
 * reloads don't open a new pool on every change.
 */

// Vercel's MongoDB storage integration injects the connection string as
// STORAGE_MONGODB_URI; EC2 / local dev use MONGODB_URI in .env.production.
const uri = process.env.MONGODB_URI ?? process.env.STORAGE_MONGODB_URI;

export function isMongoConfigured(): boolean {
  return Boolean(uri?.trim());
}

/** Database name from the connection string path, e.g. ...mongodb.net/<db>?... */
function dbFromUri(connectionString: string | undefined): string | undefined {
  if (!connectionString) return undefined;
  try {
    const path = new URL(
      connectionString
        .replace(/^mongodb\+srv:\/\//, "https://")
        .replace(/^mongodb:\/\//, "http://")
    ).pathname;
    return path.replace(/^\//, "").split("?")[0] || undefined;
  } catch {
    return undefined;
  }
}

// Prefer an explicit override, then the db embedded in the URI, then a default.
const dbName =
  process.env.MONGODB_DB ?? dbFromUri(uri) ?? "thegoalposts";

const options = {};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function createClientPromise(): Promise<MongoClient> {
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Add it to .env.production on the server (optional — news/wallpapers only)."
    );
  }
  const client = new MongoClient(uri, options);
  attachDatabasePool(client);
  return client.connect();
}

export function getMongoClient(): Promise<MongoClient> {
  if (process.env.NODE_ENV === "development") {
    if (!globalThis._mongoClientPromise) {
      globalThis._mongoClientPromise = createClientPromise();
    }
    return globalThis._mongoClientPromise;
  }
  if (!globalThis._mongoClientPromise) {
    globalThis._mongoClientPromise = createClientPromise();
  }
  return globalThis._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(dbName);
}
