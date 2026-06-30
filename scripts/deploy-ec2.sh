#!/usr/bin/env bash
# Build and run on EC2. Do not export NODE_ENV=production before npm ci — it skips
# packages required at build time (Tailwind/PostCSS).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -f .env.production ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env.production
  set +a
fi

echo "→ Installing dependencies (including build tools)…"
# NODE_ENV=production would omit devDependencies; force a full install for the build.
NODE_ENV=development npm ci

echo "→ Building…"
npm run build

echo "→ Pruning dev-only packages (optional, saves RAM on small instances)…"
npm prune --omit=dev

echo "→ Done. Restart the app: pm2 restart thegoalposts"
