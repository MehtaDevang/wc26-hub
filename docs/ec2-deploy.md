# The Goal Posts — EC2 build & deploy runbook

Self-host the Next.js app on **AWS EC2** (tested on **t3.micro**). Build on your
Mac, sync to the server, run behind **nginx** with **PM2**.

**Recommended flow:** Mac `npm run build` → `rsync` → EC2 `npm ci --omit=dev` → `pm2 restart`

Do **not** build on t3.micro unless you have swap and patience — 1 GB RAM is too
tight for `next build`.

---

## Architecture

```
Browser → DNS (thegoalposts.in) → Elastic IP
         → nginx :443 (Let's Encrypt)
         → Next.js :3000 (PM2)
         → MongoDB Atlas (optional — news + wallpapers)
         → ESPN API (outbound HTTPS, no key)
```

| Path on server | Purpose |
|----------------|---------|
| `/var/www/thegoalposts` | App root |
| `.env.production` | Production env (only on server) |
| `~/.ssh/authorized_keys` | Your deploy SSH public key |

---

## One-time: AWS setup

### 1. Launch EC2

| Setting | Value |
|---------|--------|
| AMI | Amazon Linux 2023 or Ubuntu 22.04 |
| Type | t3.micro (min); t3.small for on-server builds |
| Storage | 20–30 GB |
| Key pair | Download `.pem` — **you cannot re-download it** |

### 2. Elastic IP

EC2 → **Elastic IPs** → Allocate → Associate with the instance. Use this IP for
DNS and SSH.

### 3. Security group (inbound)

| Port | Source | Purpose |
|------|--------|---------|
| 22 | Your IP | SSH |
| 80 | 0.0.0.0/0 | HTTP (certbot + redirect) |
| 443 | 0.0.0.0/0 | HTTPS |

Do **not** open port 3000 publicly.

### 4. Swap (t3.micro — required)

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
free -h
```

### 5. Install Node.js 20 + nginx (on server)

**Amazon Linux 2023:**

```bash
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs nginx git
sudo npm install -g pm2
```

**Ubuntu:**

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git
sudo npm install -g pm2
```

### 6. App directory

```bash
sudo mkdir -p /var/www/thegoalposts
sudo chown $USER:$USER /var/www/thegoalposts
```

### 7. SSH access from your Mac

**Do not keep the `.pem` in `~/Downloads`** — macOS may block Cursor’s terminal
from reading it (`Operation not permitted`).

```bash
mkdir -p ~/.ssh
mv ~/Downloads/your-key.pem ~/.ssh/thegoalposts.pem
chmod 400 ~/.ssh/thegoalposts.pem
```

**If the `.pem` does not work** (wrong key pair or lost key):

1. AWS Console → EC2 → **Connect** → **EC2 Instance Connect**
2. On your Mac:
   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/thegoalposts_deploy -N ""
   cat ~/.ssh/thegoalposts_deploy.pub
   ```
3. On the server (browser shell):
   ```bash
   mkdir -p ~/.ssh && chmod 700 ~/.ssh
   echo "PASTE_PUBLIC_KEY_LINE" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```
4. Test: `ssh -i ~/.ssh/thegoalposts_deploy ec2-user@<ELASTIC_IP>`

Default login user: **`ec2-user`** (Amazon Linux), **`ubuntu`** (Ubuntu AMI).

### 8. Production environment (on server only)

```bash
nano /var/www/thegoalposts/.env.production
```

```bash
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_SITE_URL=https://www.thegoalposts.in

# Optional
GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxx
# NEXT_PUBLIC_ADSENSE_SLOT_INLINE=
MONGODB_URI=mongodb+srv://...
MONGODB_DB=thegoalposts
```

**Important:** Do not `export` this file before `npm ci` on the server during a
**build** — `NODE_ENV=production` skips packages needed at build time. For
Mac-build deploys, only `npm ci --omit=dev` runs on the server (no build).

### 9. MongoDB Atlas (optional)

Atlas → **Network Access** → add the EC2 **Elastic IP**. Required for original
news and HD wallpapers; the rest of the site works without it.

### 10. nginx reverse proxy

```bash
sudo tee /etc/nginx/conf.d/thegoalposts.conf <<'EOF'
server {
    listen 80;
    server_name thegoalposts.in www.thegoalposts.in;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

sudo nginx -t
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 11. DNS

At your registrar (or Route 53):

| Name | Type | Value |
|------|------|--------|
| `@` | A | `<ELASTIC_IP>` |
| `www` | A | `<ELASTIC_IP>` |

Remove old Vercel DNS records when cutting over.

```bash
dig +short www.thegoalposts.in   # should return Elastic IP
```

### 12. HTTPS (after DNS propagates)

```bash
# Amazon Linux
sudo yum install -y certbot python3-certbot-nginx
sudo certbot --nginx -d thegoalposts.in -d www.thegoalposts.in
```

Choose redirect HTTP → HTTPS when prompted.

### 13. PM2 startup on reboot

```bash
cd /var/www/thegoalposts
pm2 start npm --name thegoalposts -- start
pm2 save
pm2 startup
# Run the sudo command PM2 prints
```

---

## Every deploy (Mac → EC2)

### Option A — deploy script (recommended)

```bash
cd /path/to/wc26-hub

export EC2_HOST=<ELASTIC_IP>
export EC2_PEM=~/.ssh/thegoalposts_deploy   # or thegoalposts.pem
export EC2_USER=ec2-user                    # or ubuntu / root

./scripts/sync-to-ec2.sh
```

Skip rebuild if `.next` is already fresh:

```bash
export SKIP_BUILD=1
./scripts/sync-to-ec2.sh
```

### Option B — manual commands

**On your Mac:**

```bash
cd /path/to/wc26-hub
npm run build
rm -rf .next/dev .next/cache

rsync -avz --delete --timeout=300 \
  -e "ssh -i ~/.ssh/thegoalposts_deploy -o ServerAliveInterval=30 -o ServerAliveCountMax=10" \
  --exclude node_modules \
  --exclude .git \
  --exclude .env.local \
  --exclude .next/cache \
  --exclude .next/dev \
  --exclude .cursor \
  --exclude ios \
  --exclude android \
  ./ ec2-user@<ELASTIC_IP>:/var/www/thegoalposts/
```

**On EC2 (or via SSH one-liner):**

```bash
cd /var/www/thegoalposts
unset NODE_ENV
npm ci --omit=dev
pm2 restart thegoalposts
```

One-liner from Mac:

```bash
ssh -i ~/.ssh/thegoalposts_deploy ec2-user@<ELASTIC_IP> \
  'cd /var/www/thegoalposts && unset NODE_ENV && npm ci --omit=dev && pm2 restart thegoalposts'
```

---

## What gets synced / excluded

| Synced | Excluded |
|--------|----------|
| `.next/` (production build) | `node_modules/` (reinstalled on server) |
| `src/`, `public/`, `package.json`, etc. | `.git/`, `.env.local` |
| | `.next/dev/`, `.next/cache/` (dev junk — huge) |

Never rsync `.next/dev` — it can be 500 MB+ and causes SSH timeouts.

Check size before sync:

```bash
rm -rf .next/dev .next/cache
du -sh .next    # expect ~50–150 MB
```

---

## Verify after deploy

**On server:**

```bash
pm2 status
pm2 logs thegoalposts --lines 50
curl -I http://127.0.0.1:3000
```

**From your Mac:**

```bash
curl -I https://www.thegoalposts.in
curl https://www.thegoalposts.in/ads.txt
curl -I https://www.thegoalposts.in/sitemap.xml
```

---

## Troubleshooting

### `next: command not found`

Run `npm ci` or `npm ci --omit=dev` in `/var/www/thegoalposts` before `npm start`.

### `Cannot find module '@tailwindcss/postcss'` (build on server)

- Cause: `NODE_ENV=production` during `npm ci` skips dev/build deps.
- Fix: `unset NODE_ENV && NODE_ENV=development npm ci` before build, **or** build on Mac and rsync (recommended).

### `pm2: command not found`

```bash
sudo npm install -g pm2
# or user install: npm config set prefix '~/.npm-global' && npm install -g pm2
```

### `Permission denied (publickey)`

- Wrong `.pem` for this instance, or wrong `EC2_USER`.
- Use EC2 Instance Connect to add `~/.ssh/thegoalposts_deploy.pub` to `authorized_keys`.

### `Load key: Operation not permitted` (Mac)

Move key to `~/.ssh/`, `chmod 400`, or run from Terminal.app (not Cursor) and grant
Cursor **Files and Folders** access.

### rsync timeout / broken pipe

- Run `rm -rf .next/dev .next/cache` before sync.
- Script uses `ServerAliveInterval=30` and `--timeout=300`.

### Site loads on IP but not domain

- DNS not propagated — check `dig +short www.thegoalposts.in`.
- nginx not running — `sudo systemctl status nginx`.

### 502 Bad Gateway

- App not running — `pm2 status`, `pm2 logs thegoalposts`.
- Wrong proxy port — nginx must point to `127.0.0.1:3000`.

### OOM on t3.micro

- Ensure swap is enabled.
- Use `NODE_OPTIONS=--max-old-space-size=512` in PM2 env.
- Never build on the instance; deploy from Mac.

---

## Build on server only (not recommended for t3.micro)

If you must build on EC2:

```bash
bash scripts/deploy-ec2.sh
pm2 restart thegoalposts
```

`deploy-ec2.sh` forces `NODE_ENV=development` for `npm ci`, then prunes dev deps
after build.

---

## Scripts in this repo

| Script | Use |
|--------|-----|
| `scripts/sync-to-ec2.sh` | Mac build + rsync + remote `npm ci` + PM2 restart |
| `scripts/deploy-ec2.sh` | Full build on the server (avoid on t3.micro) |

---

## Cutover from Vercel

1. Deploy and verify on EC2 (IP or hosts file test).
2. Point DNS A records to Elastic IP.
3. Run certbot for HTTPS.
4. Remove domain from Vercel when satisfied.
5. Confirm `NEXT_PUBLIC_SITE_URL=https://www.thegoalposts.in` in `.env.production`.

---

## Quick reference

```bash
# Mac — full deploy
export EC2_HOST=1.2.3.4 EC2_PEM=~/.ssh/thegoalposts_deploy EC2_USER=ec2-user
./scripts/sync-to-ec2.sh

# Server — logs / restart
pm2 logs thegoalposts
pm2 restart thegoalposts

# Server — nginx / SSL
sudo nginx -t && sudo systemctl reload nginx
sudo certbot renew --dry-run
```
