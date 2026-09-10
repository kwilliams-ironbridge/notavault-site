# FourCount

Operator-grade body regulation, built for anyone. Expo + expo-router, iPhone only, local-first, no accounts.

Vision, evidence, and spec live in the `notavault-site` repo under `fourcount/docs` and `fourcount/research` until they move here.

## Run

```bash
npm install
npx expo start
```

## Build rules (App Dev Lessons Learned Parts 1 to 6)

- Every `EXPO_PUBLIC_*` is read once in `config/env.ts` through `env(name, fallback)`. Never `process.env.X!`.
- No clients, storage handles, or native modules constructed at module scope. `lib/store.ts`, `lib/purchases.ts`, and `lib/reminders.ts` build lazily.
- No `unstable_` or `experimental_` flags in metro or babel config.
- Every screen has an empty state. No dead buttons. If a feature is not ready, remove its entry point.
- iPhone only: `ios.supportsTablet` is `false` in `app.json`.
- `node scripts/preflight.cjs` must pass before every build.

## Before the first TestFlight build

1. Privacy Policy live at the URL in `config/env.ts`. Terms use Apple's standard EULA.
2. `npx expo install react-native-purchases`, wire `lib/purchases.ts`, set `EXPO_PUBLIC_REVENUECAT_IOS_KEY` in every EAS environment (`eas env:list production`).
3. In App Store Connect: Paid Applications Agreement Active, both IAP products with localized name, price, and a review screenshot of `app/paywall.tsx`, status Ready to Submit, attached to the version.
4. `npx expo run:ios --configuration Release --device` on a physical iPhone before any EAS build.
5. Read the EAS build log to the end. Warnings are errors.

## 10-minute pre-submit test (fresh install from TestFlight, physical device)

1. Launch. Stays up 60 seconds.
2. Tap every tab and every button. Every one does something.
3. Settings > Upgrade reaches the paywall in 2 taps. Write the tap path down; it is the review note.
4. Both products show real prices.
5. Sandbox purchase completes. Restore works.
6. Force-quit and relaunch. Entitlement persists.
