#!/usr/bin/env bash
# Run on the EC2 instance when the site is down (disk full, broken node_modules, bad nginx).
#
#   cd /var/www/thegoalposts && sudo bash scripts/ec2-recover.sh

set -euo pipefail

APP_PATH="${APP_PATH:-/var/www/thegoalposts}"
cd "$APP_PATH"

echo "=== Disk before cleanup ==="
df -h /

echo "→ Freeing space…"
npm cache clean --force 2>/dev/null || true
rm -rf .next/dev .next/cache node_modules/.cache 2>/dev/null || true
# Nested copy from a bad rsync
rm -rf wc26-hub 2>/dev/null || true
pm2 flush 2>/dev/null || true
journalctl --vacuum-time=3d 2>/dev/null || true

echo "=== Disk after cleanup ==="
df -h /

if [[ $(df / | tail -1 | awk '{print $5}' | tr -d '%') -gt 92 ]]; then
  echo "WARNING: disk still >92% full — npm ci may fail. Remove old logs or resize the volume."
fi

echo "→ Installing production dependencies…"
unset NODE_ENV
npm ci --omit=dev

if [[ ! -x node_modules/next/dist/bin/next ]]; then
  echo "ERROR: next binary missing"
  exit 1
fi

if [[ ! -f .env.production ]]; then
  echo "→ Creating .env.production template (edit MONGODB_URI if you use MongoDB)…"
  cat > .env.production <<'ENVEOF'
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_SITE_URL=https://www.thegoalposts.in
DISABLE_SENTRY_TUNNEL=1
# MONGODB_URI=mongodb+srv://...
ENVEOF
  echo "Edit: nano .env.production"
fi

echo "→ PM2 restart…"
pm2 delete thegoalposts 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save

echo "→ Health check…"
sleep 2
curl -sf -o /dev/null -w "localhost:3000 → HTTP %{http_code}\n" http://127.0.0.1:3000/ || true

echo ""
echo "=== nginx ==="
echo "Replace /etc/nginx/conf.d/thegoalposts.conf with scripts/nginx-thegoalposts.conf, then:"
echo "  sudo nginx -t && sudo systemctl reload nginx"
echo ""
echo "Test redirect (must NOT contain :3000):"
echo "  curl -sI https://thegoalposts.in/fixtures | grep -i location"
