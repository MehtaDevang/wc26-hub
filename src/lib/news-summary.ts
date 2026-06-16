/** Editorial brief for feed + modal — not a verbatim ESPN republish. */
export const NEWS_SUMMARY_WORD_LIMIT = 55;

export function truncateWords(
  text: string,
  maxWords = NEWS_SUMMARY_WORD_LIMIT
): { text: string; truncated: boolean } {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return { text: "", truncated: false };

  const words = cleaned.split(" ");
  if (words.length <= maxWords) {
    return { text: cleaned, truncated: false };
  }

  return {
    text: `${words.slice(0, maxWords).join(" ")}…`,
    truncated: true,
  };
}

function stripPromoCopy(text: string): string {
  return text
    .replace(/^check out all the[^.]*\.\s*/i, "")
    .replace(/^read more[^.]*\.\s*/i, "")
    .replace(/\s*—?\s*on ESPN\.?$/i, "")
    .replace(/\s*via ESPN\.?$/i, "")
    .trim();
}

function isDuplicateOfHeadline(text: string, headline: string): boolean {
  const a = text.toLowerCase().replace(/[^\w\s]/g, "");
  const b = headline.toLowerCase().replace(/[^\w\s]/g, "");
  return a === b || b.startsWith(a) || a.startsWith(b);
}

/**
 * Short Goal Posts-style recap — paraphrased from the source dek, not the full article.
 */
export function buildNewsSummary(
  headline: string,
  description?: string,
  type: "story" | "video" | "other" = "story"
): string {
  const h = headline.replace(/\s+/g, " ").trim().replace(/\.$/, "");
  let desc = stripPromoCopy(description?.replace(/\s+/g, " ").trim() ?? "");

  if (!desc || isDuplicateOfHeadline(desc, h)) {
    if (type === "video") {
      return `Tournament clip — ${h}.`;
    }
    return `World Cup 2026 — ${h}.`;
  }

  if (type === "video") {
    const { text } = truncateWords(desc, 40);
    return `Clip in brief: ${text.charAt(0).toLowerCase()}${text.slice(1)}`;
  }

  // Reframe common ESPN openers into a neutral brief
  let reframed = desc
    .replace(/^it's only one game, sure, but /i, "Early on, ")
    .replace(/^join .+ each day as they /i, "Daily dispatch — ")
    .replace(/^here is a list of /i, "A look at ");

  if (!/world cup|fifa|tournament/i.test(reframed)) {
    reframed = `At World Cup 2026, ${reframed.charAt(0).toLowerCase()}${reframed.slice(1)}`;
  }

  const { text } = truncateWords(reframed, NEWS_SUMMARY_WORD_LIMIT);
  if (!text.endsWith(".") && !text.endsWith("…")) {
    return `${text}.`;
  }
  return text;
}

/** Shorter line for card previews */
export function buildNewsCardBlurb(summary: string): string {
  return truncateWords(summary, 28).text;
}
