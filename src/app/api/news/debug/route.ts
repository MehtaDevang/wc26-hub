import { apiJsonResponse } from "@/lib/api-security";
import { getMongoClient } from "@/lib/mongodb";

export const revalidate = 0;
export const dynamic = "force-dynamic";
export const maxDuration = 15;

/**
 * Temporary diagnostic endpoint. Reports what the server can actually see in
 * MongoDB without leaking the connection string. Delete once the prod issue
 * is resolved.
 */
export async function GET() {
  const uri = process.env.MONGODB_URI ?? "";
  const configuredDb = process.env.MONGODB_DB ?? null;

  // Parse the default database name embedded in the connection string (if any)
  let uriDefaultDb: string | null = null;
  try {
    const path = new URL(uri.replace(/^mongodb\+srv/, "https").replace(/^mongodb/, "http")).pathname;
    uriDefaultDb = path.replace(/^\//, "").split("?")[0] || null;
  } catch {
    uriDefaultDb = null;
  }

  const report: Record<string, unknown> = {
    hasUri: Boolean(uri),
    configuredDbEnv: configuredDb,
    uriDefaultDb,
    dbNameUsed: configuredDb ?? "thegoalposts",
  };

  if (!uri) {
    report.error = "MONGODB_URI is not set in this environment";
    return apiJsonResponse(report, { status: 200 });
  }

  try {
    const client = await getMongoClient();

    // What the app actually queries
    const appDb = client.db(configuredDb ?? "thegoalposts");
    report.appDbCollections = (await appDb.listCollections().toArray()).map((c) => c.name);
    report.appDbNewsCount = await appDb.collection("news").countDocuments();
    report.appDbNewsIds = await appDb
      .collection("news")
      .find({}, { projection: { _id: 0, id: 1, isOriginal: 1 } })
      .limit(10)
      .toArray();

    // Enumerate all databases + their news counts to find where the doc lives
    try {
      const admin = client.db().admin();
      const { databases } = await admin.listDatabases();
      const perDb: Record<string, number> = {};
      for (const d of databases) {
        if (["admin", "local", "config"].includes(d.name)) continue;
        try {
          perDb[d.name] = await client.db(d.name).collection("news").countDocuments();
        } catch {
          perDb[d.name] = -1;
        }
      }
      report.newsCountByDatabase = perDb;
    } catch (e) {
      report.listDatabasesError = e instanceof Error ? e.message : String(e);
    }
  } catch (error) {
    report.connectionError = error instanceof Error ? error.message : String(error);
  }

  return apiJsonResponse(report, { status: 200 });
}
