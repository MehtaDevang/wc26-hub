// Seed the MongoDB `news` collection with The Goal Posts original editorial.
//
// Usage (Node 20+):
//   node --env-file=.env.local scripts/seed-news.mjs
//
// Requires MONGODB_URI (and optionally MONGODB_DB, defaults to "thegoalposts").
// Upserts by `id`, so it is safe to run repeatedly.

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI ?? process.env.STORAGE_MONGODB_URI;

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

const dbName = process.env.MONGODB_DB ?? dbFromUri(uri) ?? "thegoalposts";

if (!uri) {
  console.error(
    "MONGODB_URI / STORAGE_MONGODB_URI is not set. Pass it via --env-file or the environment."
  );
  process.exit(1);
}

console.log(`Seeding database "${dbName}"...`);

const articles = [
  {
    id: "900000001",
    headline:
      "Lions on the hunt: Senegal ready to roar as France walk into a storm tonight",
    summary:
      "France arrive as favorites - but Senegal are built to ruin big nights. Quick, aggressive, and unafraid, the Lions can turn one mistake into a goal. If they drag France into a chaotic, physical battle, an upset is firmly on the cards.",
    imageUrl: "/news/france-senegal-preview.png",
    imageAlt:
      "France and Senegal clash under the lights ahead of their World Cup 2026 showdown",
    publishedAt: "2026-06-16T12:00:00.000Z",
    type: "story",
    byline: "The Goal Posts Desk",
    isOriginal: true,
    body: [
      "Forget the form guides. Forget the rankings. Tonight, France discover that Senegal didn't come to make up the numbers - they came to make a statement.",
      "On paper, it's a mismatch. France strut in as one of the tournament's heavyweights, dripping with stars and swagger. But football isn't played on paper, and Senegal are the kind of nightmare opponent that turns the favorite's dream into a long, sweaty 90 minutes.",
      "The Lions are fast. They're fearless. And they smell blood the moment a defender hesitates. One loose pass, one lazy step, and they're gone - racing in behind before France even realise the danger.",
      "France will try to slow it down, stroke the ball around, lull the game into their comfort zone. But Senegal don't do comfortable. They press, they pounce, they suffocate. If they drag France into a street fight, the script could be ripped to shreds.",
      "This is pride against pedigree. Hunger against history. And tonight, under the lights, Senegal believe they can pull off the shock that sets the whole tournament talking.",
      "The champions have been warned. The Lions are circling.",
    ],
  },
  {
    id: "900000002",
    headline:
      "Desert storm brewing: Iraq ready to silence Haaland as Norway eye a statement win",
    summary:
      "Norway have the firepower and a striker who turns half-chances into goals. But Iraq are stubborn, street-smart and lethal on the break. Frustrate Haaland, and the Lions of Mesopotamia could turn this into the night nobody saw coming.",
    imageUrl: "/news/iraq-norway-preview.png",
    imageAlt:
      "Iraq and Norway face off under the lights at World Cup 2026",
    publishedAt: "2026-06-16T15:00:00.000Z",
    type: "story",
    byline: "The Goal Posts Desk",
    isOriginal: true,
    body: [
      "Norway think they know how tonight ends. Iraq are about to remind them football doesn't read the script.",
      "On one side, a Norwegian machine built around the most lethal striker on the planet - Erling Haaland, a man who turns half-chances into goals and defenders into spectators.",
      "On the other, the Lions of Mesopotamia: stubborn, street-smart, and carrying the hopes of a nation that lives and breathes this game. Underdogs? Absolutely. Pushovers? Never.",
      "Iraq's plan is simple and brutal - suffocate the space, starve Haaland of service, and turn every Norwegian mistake into a counter-attack that stings.",
      "If Norway get sloppy, if they assume the three points are already in the bag, this is exactly the kind of night that ends in heartbreak for the favourites.",
      "Pride against power. Heart against hype. And under the lights, Iraq believe they can write a story the whole tournament will be talking about.",
      "Haaland has been warned. The desert is ready to roar.",
    ],
  },
  {
    id: "900000003",
    headline:
      "France vs Senegal by the numbers: the only time they've met, the champions fell",
    summary:
      "France and Senegal have met just once in history, and it is the stat that should worry Les Bleus. France arrive 3rd in the world to Senegal's 15th, but the head-to-head reads: played 1, Senegal 1, France 0.",
    imageUrl: "/news/france-senegal-preview.png",
    imageAlt:
      "France and Senegal head-to-head stats ahead of their World Cup 2026 Group I opener",
    publishedAt: "2026-06-16T16:30:00.000Z",
    type: "story",
    byline: "The Goal Posts Desk",
    isOriginal: true,
    body: [
      "France walk into MetLife Stadium as one of the tournament favourites, but the numbers carry a warning: the only time they have ever met Senegal, they lost.",
      "The two nations have crossed paths just once, and it came on the biggest stage of all. On 31 May 2002, Senegal beat defending champions France 1-0 in the opening game of the World Cup, with Papa Bouba Diop scoring the goal that stunned the holders. That single result is the entire head-to-head record: played 1, won by Senegal, France yet to score against them.",
      "On paper, France are clear favourites. Les Bleus sit 3rd in the FIFA world rankings, while Senegal are 15th - a gap of 12 places. But a ranking gap meant nothing in 2002, when France were reigning world champions and Senegal were tournament debutants.",
      "Tonight's meeting opens Group I for both sides at MetLife Stadium in East Rutherford, New Jersey. With Iraq and Norway completing the group, three points on matchday one would be a major step towards the knockout rounds for either nation.",
      "The storyline almost writes itself. Twenty-four years on from the most famous result in Senegalese football history, the Lions of Teranga get another shot at France on the grandest stage. France, for their part, will be desperate to make sure history does not repeat itself.",
    ],
  },
  {
    id: "900000004",
    headline:
      "Champions on the march: Argentina ready to kick off their World Cup defence against Algeria",
    summary:
      "Argentina open Group J tonight as world No. 1 and defending champions. Algeria arrive ranked 28th with nothing to lose at Arrowhead Stadium - but the Albiceleste have a 4-3 friendly win in the only meeting between these two nations.",
    imageUrl: "/news/argentina-algeria-preview.png",
    imageAlt:
      "Argentina and Algeria face off at World Cup 2026 in Kansas City",
    publishedAt: "2026-06-16T18:00:00.000Z",
    type: "story",
    byline: "The Goal Posts Desk",
    isOriginal: true,
    body: [
      "The holders are here. Argentina walk into Arrowhead Stadium tonight not as hopefuls, but as the team everyone else is trying to catch.",
      "This is Group J, matchday one, and the world champions open their World Cup 2026 campaign against Algeria in Kansas City. On paper it looks one-sided: Argentina sit top of the FIFA rankings, Algeria are 28th. But openers have a habit of biting back when the pressure is highest.",
      "These two nations have met just once before - a 4-3 Argentina win in a friendly back in 2007. That was a seven-goal thriller with no World Cup stakes attached. Tonight the stakes could not be higher: three points, group momentum, and the first statement from the team that lifted the trophy in Qatar.",
      "Argentina carry the weight of expectation and the talent to match it. Lionel Messi remains the figurehead of a squad built around experience, creativity, and a winning mentality forged over the last decade. Algeria, meanwhile, arrive as underdogs with a proud record in African football and a reputation for making life uncomfortable when the spotlight is brightest.",
      "At GEHA Field at Arrowhead Stadium, under the lights in Missouri, the defending champions begin the long road towards retaining their crown. Algeria will not roll over. Argentina will not expect them to.",
      "The World Cup is back. And the champions mean business.",
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
