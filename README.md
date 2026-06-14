# WC26 Hub

Live FIFA World Cup 2026 hub — scores, match details, fixtures, standings, and daily football puzzles.

## Live Data

Match scores, stats, scorers, videos, lineups, and highlights are powered by the **ESPN public API** (free, no API key required):

- `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard`
- `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/summary?event={id}`

Data refreshes every 60 seconds for scores and 30 seconds for match details.

### Optional: API-Football

For production scale, you can also add `API_FOOTBALL_KEY` from [api-football.com](https://www.api-football.com) (100 free requests/day).

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

```bash
npx vercel login
npx vercel --prod
```

## Features

- **Live Scores** — Real ESPN data, auto-refreshing
- **Match Details** — Videos, photos, lineups, stats, standings, minute-by-minute
- **Fixtures & Tables** — Full schedule and group standings
- **Daily Puzzles** — Guess the Player, Name Scramble, and Daily Quiz

## Monetization

1. **Google AdSense** — Replace `<AdBanner />` placeholders
2. **Stripe** — Wire up Premium upsell in `PremiumUpsell.tsx`
3. **Sponsored contests** — Customize `SponsoredBanner.tsx`
