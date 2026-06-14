export type AdPlacement =
  | "top"
  | "footer"
  | "inline"
  | "sidebar"
  | "match"
  | "fixtures"
  | "standings"
  | "history"
  | "puzzles";

export function getAdSenseClientId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  return id && id.length > 0 ? id : undefined;
}

export function getAdSlotId(placement: AdPlacement): string | undefined {
  const slots: Record<AdPlacement, string | undefined> = {
    top: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP,
    footer: process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER,
    inline: process.env.NEXT_PUBLIC_ADSENSE_SLOT_INLINE,
    sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR,
    match: process.env.NEXT_PUBLIC_ADSENSE_SLOT_MATCH,
    fixtures: process.env.NEXT_PUBLIC_ADSENSE_SLOT_FIXTURES,
    standings: process.env.NEXT_PUBLIC_ADSENSE_SLOT_STANDINGS,
    history: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HISTORY,
    puzzles: process.env.NEXT_PUBLIC_ADSENSE_SLOT_PUZZLES,
  };

  const value = slots[placement];
  return value && value.length > 0 ? value : undefined;
}

export function isAdSenseEnabled(): boolean {
  return !!getAdSenseClientId();
}
