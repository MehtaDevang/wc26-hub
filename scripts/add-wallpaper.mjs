// Add an HD wallpaper to the MongoDB `wallpapers` collection by URL.
//
// The script fetches the image, stores the binary in MongoDB, and the
// /wallpapers page serves it from our own domain via /wallpapers/db/[id].
//
// Usage (Node 20+):
//   node --env-file=.env.local scripts/add-wallpaper.mjs \
//     --url "https://example.com/photo.jpg" \
//     --title "Maradona's Goal of the Century" \
//     --teams "Argentina 2-1 England" \
//     --year 1986 \
//     --category goal \
//     --credit "Wikimedia Commons" \
//     [--id hand-of-god] [--source "https://source-page"]
//
// Requires MONGODB_URI (and optionally MONGODB_DB, defaults to "thegoalposts").
// Upserts by `id`, so re-running with the same id replaces the image.

import { MongoClient } from "mongodb";

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB (BSON doc limit is 16 MB)

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith("--")) {
      args[key] = next;
      i++;
    } else {
      args[key] = "true";
    }
  }
  return args;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function dbFromUri(connectionString) {
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

const args = parseArgs(process.argv.slice(2));

if (!args.url || args.url === "true") {
  console.error("Missing --url. Example:\n  node --env-file=.env.local scripts/add-wallpaper.mjs --url \"https://...\" --title \"...\" --year 1986");
  process.exit(1);
}

const uri = process.env.MONGODB_URI ?? process.env.STORAGE_MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI / STORAGE_MONGODB_URI is not set. Pass it via --env-file or the environment.");
  process.exit(1);
}
const dbName = process.env.MONGODB_DB ?? dbFromUri(uri) ?? "thegoalposts";

const id = (args.id && args.id !== "true" ? slugify(args.id) : null) ?? slugify(args.title && args.title !== "true" ? args.title : new URL(args.url).pathname.split("/").pop() ?? `wallpaper-${Date.now()}`);

console.log(`Fetching ${args.url} ...`);

let res;
try {
  res = await fetch(args.url, {
    headers: {
      "User-Agent": "TheGoalPostsBot/1.0 (+https://www.thegoalposts.in; wallpapers)",
      Accept: "image/*",
    },
  });
} catch (error) {
  console.error("Fetch failed:", error.message);
  process.exit(1);
}

if (!res.ok) {
  console.error(`Fetch failed: HTTP ${res.status}`);
  process.exit(1);
}

const contentType = res.headers.get("content-type") ?? "";
if (!contentType.startsWith("image/")) {
  console.error(`URL did not return an image (content-type: ${contentType || "unknown"}).`);
  process.exit(1);
}

const buffer = Buffer.from(await res.arrayBuffer());
if (buffer.length === 0) {
  console.error("Downloaded an empty file.");
  process.exit(1);
}
if (buffer.length > MAX_BYTES) {
  console.error(`Image is ${(buffer.length / 1024 / 1024).toFixed(1)} MB, over the ${MAX_BYTES / 1024 / 1024} MB limit. Use a smaller/compressed source.`);
  process.exit(1);
}

const doc = {
  id,
  title: args.title && args.title !== "true" ? args.title : id,
  teams: args.teams && args.teams !== "true" ? args.teams : undefined,
  year: args.year && args.year !== "true" ? Number(args.year) : undefined,
  category: args.category && args.category !== "true" ? args.category : undefined,
  credit: args.credit && args.credit !== "true" ? args.credit : undefined,
  source: args.source && args.source !== "true" ? args.source : args.url,
  contentType: contentType.split(";")[0].trim(),
  bytes: buffer.length,
  data: buffer,
  createdAt: new Date().toISOString(),
};
// Drop undefined fields for a clean document.
for (const key of Object.keys(doc)) if (doc[key] === undefined) delete doc[key];

const client = new MongoClient(uri);
try {
  await client.connect();
  const collection = client.db(dbName).collection("wallpapers");
  await collection.createIndex({ id: 1 }, { unique: true });
  await collection.replaceOne({ id }, doc, { upsert: true });
  console.log(`Stored wallpaper "${id}" (${(buffer.length / 1024).toFixed(0)} KB, ${doc.contentType}) in "${dbName}".`);
  console.log(`View at  /wallpapers/db/${id}`);
  console.log(`Download /wallpapers/db/${id}?dl=1`);
} catch (error) {
  console.error("MongoDB error:", error.message);
  process.exit(1);
} finally {
  await client.close();
}
