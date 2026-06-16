import type { NewsArticleDetail } from "./types";

/**
 * Original Goal Posts editorial — written in-house, not aggregated from ESPN.
 * IDs use a 9-digit range starting with 9 to stay valid (\d{6,15}) and avoid
 * collisions with ESPN's ~8-digit article ids.
 */
export const OWN_NEWS: NewsArticleDetail[] = [
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

export function getOwnNews(): NewsArticleDetail[] {
  return [...OWN_NEWS].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getOwnNewsArticle(id: string): NewsArticleDetail | null {
  return OWN_NEWS.find((article) => article.id === id) ?? null;
}
