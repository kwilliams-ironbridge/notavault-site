# FourCount Phase 4b: MVP Feature Spec and Tech Stack

Date: 2026-09-09
Inputs: Phase 1 to 3 research (tracker sections), 04_techniques_evidence.md, App Dev Lessons Learned Parts 1 to 6.

---

## 1. Positioning (locked 2026-09-10, see docs/00_vision.md)

"Regulate under load. Any load. The 4-count operators drill, trained like a skill, measured every week, built for anyone."

Sold as PERFORMANCE TRAINING for everyday people, modeled on military and first-responder tactical breathing. Audience: any adult who wants to regulate their own body. The operator is the standard, not the only customer. Phase 3 personas all apply. Coach voice, beginner-safe. Plain-language twin for every technical term. No treatment claims. No endorsement claims.

Design rule: never make a stressed user choose. The home screen prescribes today's session. No library grid.

---

## 2. What v1.0 ships (and nothing else)

Lessons Learned 4.3: ship a smaller surface that works completely. Every entry point below must do something.

| Screen | What it does | Taps from launch |
|--------|--------------|------------------|
| Onboarding (first run only) | 3 screens: why training, the diaphragm lesson, baseline test. No account. | 0 |
| Today | One prescribed drill card, streak, next re-test date. Two buttons: Start, and Reset (60 s, always available, named for everyday loads). | 0 |
| Session | Animated breath guide, phase label, count, remaining time. Pre and post arousal rating (1 flat to 10 redlined). | 1 |
| Test | Three timed measures: resting breaths per minute, control pause, longest exhale. Weekly. | 1 |
| Progress | Four line charts: CO2 tolerance (control pause), resting rate, exhale control, down-shift per drill. 4-week view. | 1 |
| Settings | Reminders, sound, Upgrade (paywall), Restore Purchases, Privacy, Terms. | 1 |
| Paywall | Monthly and annual with price, period, renewal disclosure, Terms, Privacy, Restore. | 2 (Settings > Upgrade) |

Not in v1.0: accounts, social, Wim Hof, camera HRV, iPad, Android, Apple Watch, HealthKit. Each gets added only when it earns the attention.

---

## 3. The 4-week program (the product)

| Week | Daily drill | Duration | Progression lever |
|------|-------------|----------|-------------------|
| 1 | Box 4-count, plus the Reset drill taught on day 1 | 5 min + 60 s | Fixed 4-count. Goal is rhythm without breaking, and knowing the reset cold. |
| 2 | Resonance breathing (autonomic base) | 6 min, 5.5 bpm | Inhale 5 s, exhale 5.5 s. No holds. |
| 3 | Box ladder | 6 min | Count moves 4 to 5 to 6 after 3 clean sessions each. Hold grows with it. |
| 4 | Extended exhale (evening) plus box (morning) | 5 + 5 min | Exhale ratio moves 4:6 to 4:8. |

Reset drill: 60 seconds of physiological sighs, one tap from Today at any time, never gated.

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
| Web prototype | `fourcount/app/index.html` in this repo | Testable today. Technique engine and program logic port 1:1 to TypeScript. |
| iPhone app | github.com/kwilliams-ironbridge/fourcount-app | The Expo project. Moved out of this repo 2026-09-24. |

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

1. Name: decided, FOURCOUNT (2026-09-09). fourcount.app is owned. Remaining: holdcount defensively (optional), then the Class 9 and 41 knockout search.
2. Lane: decided, performance training (2026-09-10). Calm-lane artboard removed from the canvas.
3. Own repo: done. The Expo app lives at github.com/kwilliams-ironbridge/fourcount-app as of 2026-09-24. Docs, research, prototype, and design stay here until they move.

## 7. Money

Nothing here bills until the paywall works in a TestFlight build. Fastest path to first dollar: ship Week 1 free, Weeks 2 to 4 paid, annual at $59.99 with a 14-day trial. Estimated build to TestFlight: 3 to 4 weeks of focused sessions. The web prototype in this repo costs nothing and can be used for a willingness-to-pay test this week.
