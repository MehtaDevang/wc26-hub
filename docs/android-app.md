# The Goal Posts — Android App (Play Store TWA) runbook

The Android app is a **Trusted Web Activity (TWA)**: a thin native wrapper that
opens the live PWA full-screen (no browser chrome) using Chrome under the hood.
Because it runs in real Chrome (not a webview), the PWA works exactly as on the
web, and Play Store review is lenient.

What's already in this repo:

- An installable PWA (`/manifest.webmanifest`, `public/sw.js`, PNG icons).
- `public/.well-known/assetlinks.json` — the Digital Asset Links file that
  verifies the app ↔ site relationship (you'll paste the signing fingerprint).
- `twa-manifest.json` — a reference Bubblewrap config (package
  `in.thegoalposts.app`, brand colors, shortcuts, notifications enabled).

## Prerequisites (one-time)

1. **Google Play Developer account** — $25 **one-time** (not yearly).
2. **Node 18+** and **JDK 17** installed.
3. **Bubblewrap CLI** (Google's TWA tool) — run via `npx`, no install needed:
   ```bash
   npx @bubblewrap/cli@latest --version
   ```
   On first run it offers to download the Android SDK + JDK for you — accept.

## 1. Generate the Android project

From a clean folder (e.g. `android/` — keep it outside the Next build):

```bash
npx @bubblewrap/cli init --manifest https://www.thegoalposts.in/manifest.webmanifest
```

Accept the defaults; the values match `twa-manifest.json` in this repo
(package `in.thegoalposts.app`, theme `#002868`). When asked about a signing
key, let Bubblewrap create one **or** use Play App Signing (recommended below).

## 2. Build the app bundle

```bash
npx @bubblewrap/cli build
```

This produces `app-release-bundle.aab` (upload this to Play) and prints the
**SHA-256 fingerprint** of your signing key.

## 3. Wire up Digital Asset Links (critical)

Without this the app shows a URL bar. Recommended flow with **Play App Signing**:

1. In Play Console create the app, then upload the `.aab` once.
2. Go to **Test and release → App integrity → App signing key certificate** and
   copy the **SHA-256 certificate fingerprint**.
3. Paste it into `public/.well-known/assetlinks.json`, replacing
   `REPLACE_WITH_PLAY_APP_SIGNING_SHA256_FINGERPRINT`.
4. Redeploy the site and verify it's live:
   ```bash
   curl https://www.thegoalposts.in/.well-known/assetlinks.json
   ```
   It must return your JSON with the real fingerprint and
   `Content-Type: application/json`.

> If you also kept Bubblewrap's local signing key, add **both** fingerprints to
> the `sha256_cert_fingerprints` array.

## 4. Play Console listing & submission

1. **Store listing:** name, short/full description, feature graphic, phone
   screenshots (capture from the installed PWA).
2. **App content:** privacy policy URL → `https://www.thegoalposts.in/privacy`;
   complete the Data Safety form (no account data; aggregate analytics; ads via
   the site). Content rating questionnaire.
3. Upload the `.aab` to a track (Internal testing first, then Production).
4. Roll out.

## Notes

- **Push notifications work in a TWA.** `enableNotifications` is on, so the web
  push match alerts surface as Android notifications — a genuine native feature
  (unlike iOS webviews). No extra backend needed beyond what the web uses.
- **AdSense caveat:** ads serve in a TWA because it's real Chrome, but Google's
  app policies are stricter than web. If you want to be conservative, gate ads
  off for app traffic (Bubblewrap can append `?utm_source=twa` to `startUrl`;
  detect that param and skip ads, mirroring the iOS native-detection approach).
- **Updates:** the app is just a shell — shipping web changes updates the app
  instantly. You only rebuild the `.aab` when changing the package, icons, or
  TWA config.
```
