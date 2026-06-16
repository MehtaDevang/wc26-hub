// Seed the MongoDB `news` collection with The Goal Posts original editorial.
//
// Usage (Node 20+):
//   node --env-file=.env.local scripts/seed-news.mjs
//
// Requires MONGODB_URI (and optionally MONGODB_DB, defaults to "thegoalposts").
// Upserts by `id`, so it is safe to run repeatedly.

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "thegoalposts";

if (!uri) {
  console.error("MONGODB_URI is not set. Pass it via --env-file or the environment.");
  process.exit(1);
}

const articles = [
  {
    id: "900000001",
    headline:
      "Lions on the hunt: Senegal ready to roar as France walk into a storm tonight",
    summary:
      "France arrive as favorites — but Senegal are built to ruin big nights. Quick, aggressive, and unafraid, the Lions can turn one mistake into a goal. If they drag France into a chaotic, physical battle, an upset is firmly on the cards.",
    imageUrl: "/news/france-senegal-preview.png",
    imageAlt:
      "France and Senegal clash under the lights ahead of their World Cup 2026 showdown",
    publishedAt: "2026-06-16T12:00:00.000Z",
    type: "story",
    byline: "The Goal Posts Desk",
    isOriginal: true,
    body: [
      "Forget the form guides. Forget the rankings. Tonight, France discover that Senegal didn't come to make up the numbers — they came to make a statement.",
      "On paper, it's a mismatch. France strut in as one of the tournament's heavyweights, dripping with stars and swagger. But football isn't played on paper, and Senegal are the kind of nightmare opponent that turns the favorite's dream into a long, sweaty 90 minutes.",
      "The Lions are fast. They're fearless. And they smell blood the moment a defender hesitates. One loose pass, one lazy step, and they're gone — racing in behind before France even realise the danger.",
      "France will try to slow it down, stroke the ball around, lull the game into their comfort zone. But Senegal don't do comfortable. They press, they pounce, they suffocate. If they drag France into a street fight, the script could be ripped to shreds.",
      "This is pride against pedigree. Hunger against history. And tonight, under the lights, Senegal believe they can pull off the shock that sets the whole tournament talking.",
      "The champions have been warned. The Lions are circling.",
    ],
  },
];

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const news = db.collection("news");

    await news.createIndex({ id: 1 }, { unique: true });
    await news.createIndex({ publishedAt: -1 });

    for (const article of articles) {
      await news.updateOne(
        { id: article.id },
        { $set: article },
        { upsert: true }
      );
      console.log(`Upserted article ${article.id}: ${article.headline}`);
    }

    const count = await news.countDocuments();
    console.log(`Done. "news" collection now has ${count} document(s).`);
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
