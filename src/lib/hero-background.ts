import type { Highlight } from "./types";
import { ICONIC_MOMENTS } from "./iconic-moments";

export interface HeroSlide {
  url: string;
  alt: string;
  label?: string;
  matchId?: string;
}

export function buildHeroSlides(highlights: Highlight[], limit = 10): HeroSlide[] {
  const seen = new Set<string>();
  const slides: HeroSlide[] = [];

  function add(slide: HeroSlide) {
    if (seen.has(slide.url) || slides.length >= limit) return;
    seen.add(slide.url);
    slides.push(slide);
  }

  for (const highlight of highlights) {
    if (!highlight.imageUrl) continue;
    add({
      url: highlight.imageUrl,
      alt: highlight.imageAlt ?? highlight.title,
      label: highlight.title,
      matchId: highlight.matchId,
    });
  }

  for (const moment of ICONIC_MOMENTS) {
    if (moment.era !== "wc26") continue;
    add({
      url: moment.imageUrl,
      alt: moment.imageAlt,
      label: moment.title,
    });
  }

  return slides;
}
