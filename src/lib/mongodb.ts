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

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "thegoalposts";

const options = {};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function createClientPromise(): Promise<MongoClient> {
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Add it in Vercel project settings (or .env.local for local dev)."
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
