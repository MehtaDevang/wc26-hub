# The Goal Posts — iOS App (Capacitor) runbook

The iOS app is a **Capacitor native shell** that loads the live production site
(`https://www.thegoalposts.in`). The web app is server-rendered, so there is no
static bundle to ship — the shell points at the deployed URL via
`server.url` in `capacitor.config.ts`.

> Everything below must run on a **Mac with Xcode**. The repo is already
> configured; you just scaffold the native project and submit.

## Prerequisites (one-time)

1. **Apple Developer Program** membership ($99/year) — required to submit.
2. **Xcode** (latest from the App Store) + command line tools:
   ```bash
   xcode-select --install
   ```
3. **CocoaPods**:
   ```bash
   sudo gem install cocoapods
   ```

## 1. Scaffold the iOS project

From the repo root:

```bash
npm install
npx cap add ios          # creates the ios/ Xcode project (one-time)
npm run ios:assets       # generates app icons + splash from resources/
npm run ios:sync         # copies config + plugins into the iOS project
```

App icon and splash sources live in `resources/` (`icon.png` 1024×1024,
`splash.png` 2732×2732). Re-run `npm run ios:assets` whenever they change.

## 2. Run / open in Xcode

```bash
npm run ios:open         # opens ios/App/App.xcworkspace in Xcode
```

In Xcode:
- Select the **App** target → **Signing & Capabilities** → set your Team.
- Bundle identifier is `in.thegoalposts.app` (matches `capacitor.config.ts`).
- Run on a simulator or a connected device to smoke-test.

## 3. App Store review notes (important)

- **Guideline 4.2 (minimum functionality):** a plain webview wrapper risks
  rejection. The plan is to add **native push notifications** for match alerts
  (Stage B) as the differentiating native feature. Have that in before review.
- **No AdSense in-app:** AdSense is suppressed automatically inside the shell
  (detected via the `TheGoalPostsApp` user-agent token). Do **not** re-enable
  web ads in the app — use AdMob if in-app ads are ever wanted.
- **Privacy:** the App Store privacy questionnaire is covered by `/privacy`.
  We collect no account data; analytics are aggregate.

## 4. Submit

1. Xcode → **Product → Archive**.
2. **Distribute App → App Store Connect → Upload**.
3. In App Store Connect: create the app record (`in.thegoalposts.app`),
   add screenshots, description, privacy answers, then submit for review.
4. Use **TestFlight** for internal testing before the public release.

## Pointing a build at staging

Set `CAP_SERVER_URL` before `npm run ios:sync` to target a non-production deploy:

```bash
CAP_SERVER_URL=https://staging.thegoalposts.in npm run ios:sync
```
