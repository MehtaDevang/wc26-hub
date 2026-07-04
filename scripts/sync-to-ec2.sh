#!/usr/bin/env bash
# Build on your Mac and sync to EC2 (for t3.micro — don't build on the server).
#
# Usage:
#   export EC2_HOST=1.2.3.4
#   export EC2_PEM=~/Downloads/my-key.pem
#   export EC2_USER=root          # or ubuntu on Ubuntu AMI
#   ./scripts/sync-to-ec2.sh
#
# Optional:
#   export EC2_PATH=/var/www/thegoalposts
#   export SKIP_BUILD=1           # only rsync + remote npm ci

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

EC2_HOST="${EC2_HOST:?Set EC2_HOST to your Elastic IP or public DNS}"
EC2_PEM="${EC2_PEM:?Set EC2_PEM to the path of your .pem key}"
EC2_USER="${EC2_USER:-root}"
EC2_PATH="${EC2_PATH:-/var/www/thegoalposts}"
SSH_OPTS=(
  -i "$EC2_PEM"
  -o StrictHostKeyChecking=accept-new
  -o ServerAliveInterval=30
  -o ServerAliveCountMax=10
  -o TCPKeepAlive=yes
)

if [[ ! -f "$EC2_PEM" ]]; then
  echo "PEM key not found: $EC2_PEM"
  exit 1
fi

chmod 400 "$EC2_PEM" 2>/dev/null || true

if [[ "${SKIP_BUILD:-}" != "1" ]]; then
  echo "→ Building locally…"
  npm run build
fi

# Dev cache is huge and not needed on the server — drop it before sync.
rm -rf .next/dev .next/cache 2>/dev/null || true

echo "→ Syncing to ${EC2_USER}@${EC2_HOST}:${EC2_PATH} …"
rsync -avz --delete --timeout=300 \
  -e "ssh ${SSH_OPTS[*]}" \
  --exclude node_modules \
  --exclude .git \
  --exclude .env.local \
  --exclude .next/cache \
  --exclude .next/dev \
  --exclude .cursor \
  --exclude ios \
  --exclude android \
  ./ "${EC2_USER}@${EC2_HOST}:${EC2_PATH}/"

echo "→ Installing production deps on server…"
ssh "${SSH_OPTS[@]}" "${EC2_USER}@${EC2_HOST}" bash -s <<EOF
set -euo pipefail
cd ${EC2_PATH}
unset NODE_ENV
npm ci --omit=dev
if [[ ! -x node_modules/next/dist/bin/next ]]; then
  echo "ERROR: next binary missing after npm ci — check disk space and package-lock.json"
  exit 1
fi
if command -v pm2 >/dev/null; then
  pm2 delete thegoalposts 2>/dev/null || true
  pm2 start ecosystem.config.cjs
  pm2 save
  sleep 2
  curl -sf -o /dev/null http://127.0.0.1:3000/ || echo "WARN: app not responding on :3000 yet"
else
  echo "pm2 not found — run: npm install -g pm2 && pm2 start ecosystem.config.cjs"
fi
EOF

echo "→ Done. Open https://www.thegoalposts.in (after DNS/nginx are set)."
