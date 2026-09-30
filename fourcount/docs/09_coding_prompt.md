# FourCount Coding Prompt (standing)

Build FourCount, the iPhone app specified in docs/08_spec_v1.md, in the fourcount-app repository (Expo SDK 57, expo-router, TypeScript strict, expo-sqlite, RevenueCat, EAS).

Milestones in order: M1 engine and measurements, M2 program and progress, M3 onboarding and settings, M4 money, M5 submission. Never start a later milestone before the earlier one passes its acceptance criteria on a physical iPhone in a Release build.

Rules, all of them law:
- App Dev Lessons Learned Parts 1 to 6. No process.env.X!. No clients, storage handles, or native modules at module scope. No unstable_ flags. iPhone only. Every screen has an empty state. No dead buttons.
- node scripts/preflight.cjs and npx tsc --noEmit pass before every commit.
- Coach voice, plain-language twin for every technical term, no treatment claims, no endorsement claims, no music, no streaks, no library.
- Store-provided price strings only. Paywall carries every element in spec section 9.
- Safety screen copy and footer copy are exact, from spec section 10.
- Local-first. Three tables. Migrations lazy. Export JSON always available.
- Commit per milestone with a message that names the acceptance criteria met.
