# The Goal Posts

Live football hub - World Cup scores, match details, fixtures, standings, history, and daily puzzles.

**Live site:** [thegoalposts.in](https://www.thegoalposts.in)

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
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

**Required environment variables:**

| Variable | Example |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | `https://www.thegoalposts.in` |
| `GOOGLE_SITE_VERIFICATION` | (from Search Console) |

```bash
npx vercel login
npx vercel --prod
```

Add `www.thegoalposts.in` and `thegoalposts.in` in Vercel **Domains**. Apex redirects to `www` automatically.

## Deploy to EC2 (self-hosted)

Full runbook: **[docs/ec2-deploy.md](docs/ec2-deploy.md)** — Mac build, rsync to EC2, nginx, PM2, DNS, and SSL. Use `./scripts/sync-to-ec2.sh` for routine deploys.

## SEO checklist (get on Google)

1. **Set `NEXT_PUBLIC_SITE_URL`** to `https://www.thegoalposts.in` and redeploy.
2. **[Google Search Console](https://search.google.com/search-console)** → Add property `https://www.thegoalposts.in`.
3. Verify via `GOOGLE_SITE_VERIFICATION` env var → redeploy.
4. Submit sitemap: `https://www.thegoalposts.in/sitemap.xml`
5. Use **URL Inspection** → “Request indexing” for homepage, `/fixtures`, `/standings`.
6. New sites often take **3–14 days** for first results; live scores help freshness.

Built-in SEO: canonical URLs, `robots.txt`, dynamic sitemap (static pages + match URLs), Open Graph image, Organization + WebSite JSON-LD, per-page metadata.

## Features

- **Live Scores** - Real ESPN data, auto-refreshing
- **Match Details** - Videos, photos, lineups, stats, standings, minute-by-minute
- **Fixtures & Tables** - Full schedule and group standings
- **Daily Puzzles** - Guess the Player, Name Scramble, and Daily Quiz

## Monetization

1. **Google AdSense** - Configure slot env vars (see `.env.example`)
2. **Stripe** - Wire up Premium upsell in `PremiumUpsell.tsx`
3. **Sponsored contests** - Customize `SponsoredBanner.tsx`
