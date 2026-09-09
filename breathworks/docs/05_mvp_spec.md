# BreathWorks Phase 4b: MVP Feature Spec and Tech Stack

Date: 2026-09-09
Inputs: Phase 1 to 3 research (tracker sections), 04_techniques_evidence.md, App Dev Lessons Learned Parts 1 to 6.

---

## 1. Positioning (carried from Phase 3, confirmed by the evidence pass)

"Most breathing apps give you a session. This one gives you a training program, and shows you the graph."

Sold as TRAINING, not meditation. Primary persona: the Depleted Professional. Secondary: the Breath Athlete.

Design rule: never make a stressed user choose. The home screen prescribes today's session. No library grid.

---

## 2. What v1.0 ships (and nothing else)

Lessons Learned 4.3: ship a smaller surface that works completely. Every entry point below must do something.

| Screen | What it does | Taps from launch |
|--------|--------------|------------------|
| Onboarding (first run only) | 3 screens: why training, the diaphragm lesson, baseline test. No account. | 0 |
| Today | One prescribed session card, streak, next re-test date. One button: Start. | 0 |
| Session | Animated breath guide, phase label, count, remaining time. Pre and post calm rating (1 to 10). | 1 |
| Test | Three timed measures: resting breaths per minute, control pause, longest exhale. Weekly. | 1 |
| Progress | Four line charts: respiratory rate, control pause, exhale length, calm delta. 4-week view. | 1 |
| Settings | Reminders, sound, Upgrade (paywall), Restore Purchases, Privacy, Terms. | 1 |
| Paywall | Monthly and annual with price, period, renewal disclosure, Terms, Privacy, Restore. | 2 (Settings > Upgrade) |

Not in v1.0: accounts, social, Wim Hof, camera HRV, iPad, Android, Apple Watch, HealthKit. Each gets added only when it earns the attention.

---

## 3. The 4-week program (the product)

| Week | Daily session | Duration | Progression lever |
|------|---------------|----------|-------------------|
| 1 | Cyclic sighing | 5 min | Fixed. Goal is the habit and the first felt win. |
| 2 | Resonance breathing | 5 min, 5.5 bpm | Inhale 5 s, exhale 5.5 s. Week 3 moves to 6 min. |
| 3 | Box breathing ladder | 6 min | Count starts at 4. Moves to 5 when the user completes 3 sessions without breaking rhythm. |
| 4 | Extended exhale (evening) plus resonance (morning) | 5 + 6 min | Exhale ratio moves 4:6 to 4:8. |

Re-test every 7 days. The graph is the retention loop. A missed day does not reset the program, it shifts it.

Free tier: Week 1 complete, baseline test, and the Progress screen. Paid unlocks Weeks 2 to 4 and re-tests. The user sees the graph start before the paywall asks for money.

Pricing (Phase 2 recommendation): $9.99 per month, $59.99 per year, 14-day trial on annual only.

---

## 4. Tech stack decision

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Expo (React Native), expo-router | Same stack as BuildFlow, so Lessons Learned apply directly. |
| Device surface | iPhone only, `supportsTablet: false` | Lesson 2.1. iPad doubles review surface for zero revenue. |
| Storage | Local first: expo-sqlite (sessions, tests) | No account, no backend, no demo account needed for review (Lesson 3.5). |
| Payments | RevenueCat | Same as BuildFlow. Key lives in EAS env, read through one `env()` helper (Lesson 6.1). |
| Audio and haptics | expo-av, expo-haptics | Session cues. |
| Charts | react-native-svg, hand-drawn lines | No chart library dependency risk in release builds. |
| Backend | None in v1.0 | Add Supabase only when sync is a paid feature people ask for. |
| Web prototype | `breathworks/app/index.html` in this repo | Testable today. Technique engine and program logic port 1:1 to TypeScript. |

---

## 5. Lessons Learned, applied as build rules

Pre-flight (do before writing the paywall):
- Paid Applications Agreement Active, bank and tax complete (already Active for BuildFlow's account, verify anyway).
- Privacy Policy and Terms URLs live BEFORE the paywall is coded. Use Apple's standard EULA.
- `supportsTablet: false` in app.json on day one.

Code rules:
- One `config/env.ts` with the `env(name, fallback)` helper. No `process.env.X!` anywhere. Preflight script greps for it.
- No clients, storage handles, or native modules constructed at module scope. Lazy getters only.
- No `unstable_` or `experimental_` flags in metro or babel config.
- Every screen has an empty state. No dead buttons. If a feature is not ready, remove its entry point.

Paywall rules (all on the screen itself):
- Product name, what it unlocks, period, price, auto-renewal disclosure, Terms link, Privacy link, Restore Purchases.
- Reachable in 2 taps from a permanent location (Settings > Upgrade) and at the Week 2 gate.
- Review screenshot of this exact screen uploaded to each IAP product in App Store Connect.

Build rules:
- Local `npx expo run:ios --configuration Release --device` before every EAS build.
- `eas env:list production` diffed against every `EXPO_PUBLIC_*` in source.
- Read the EAS build log to the end. Warnings are errors.
- 10-minute pre-submit test from TestFlight on a fresh install: launch stays up 60 s, every nav item responds, paywall in 2 taps, both prices load, sandbox purchase, restore, force-quit and relaunch keeps entitlement.

Submission rules:
- Review notes carry the exact tap path, no brackets left in, sandbox verification sentence included.
- New build number on every resubmission. Read the "Version reviewed" line first on any rejection.

---

## 6. Open decisions (owner: you)

1. Name: FOURCOUNT (selected Aug 24, trademark knockout pending) vs BreathWorks (this session). Pick one before store setup.
2. Lane: calm vs performance. The canvas shows both. Evidence favors training. Institutional channel (Ironbridge federal posture) is lane-neutral.
3. Own repo: this prototype lives in notavault-site for speed. Move to its own repo when the Expo project starts.

## 7. Money

Nothing here bills until the paywall works in a TestFlight build. Fastest path to first dollar: ship Week 1 free, Weeks 2 to 4 paid, annual at $59.99 with a 14-day trial. Estimated build to TestFlight: 3 to 4 weeks of focused sessions. The web prototype in this repo costs nothing and can be used for a willingness-to-pay test this week.
