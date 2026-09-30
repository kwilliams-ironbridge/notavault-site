# FourCount V1 Specification

Date: 2026-09-30. Produced after a three-round alignment interview (docs/07). Alignment at close: 95 percent. This document is the source for the coding prompt. Everything in docs/00_vision.md and Lessons Learned Parts 1 to 6 still applies.

---

## 1. Vision statement

FourCount teaches any person to regulate their own body the way operators are taught: one four-count drill a day, one sixty-second reset always within reach, three numbers measured every week with nothing but the phone, and a graph that proves it is working. Trained, not calmed. It never asks a stressed person to choose, never blames a bad week, and never claims to treat anything. The operator is the standard; the customer is anyone who wants it.

## 2. The user and the load

| Persona | The moment the app opens |
|---|---|
| **Reyes, 34, firefighter-paramedic** | Rig bay, 0620, third night in a row. Opens Today, sees "Box 4-count, 5 min," runs it standing. Uses Reset after a bad call at 1400. |
| **Dana, 41, ops director, two kids** | Car in the school lot at 0748 before a board call. Reset drill, 60 seconds, eyes closed, one hand. Sunday morning re-test before coffee. |
| **Marcus, 27, amateur boxer** | Locker room between rounds of sparring. Reset. Evening Down-shift on Week 4. Wants the control-pause number to climb like a lift. |

Anti-persona: the content browser who wants a library of sounds. FourCount has no library.

## 3. End-to-end workflow

1. **First open.** Welcome (the one line, the evidence line, the disclaimer). No permission prompts.
2. **Lesson.** Diaphragm lesson with the five-breath counter. "I have done this before" skips it.
3. **Safety screen.** Mandatory once before the first breath hold: never in water, never while driving or operating equipment, stop at the first sign of dizziness, talk to a doctor first if pregnant or if you have a heart, lung, or blood-pressure condition. Re-shown once a year. Acceptance is logged with a timestamp.
4. **Baseline.** Three tests, ninety seconds. Skippable; Today then shows "No baseline yet" with a one-tap path back.
5. **Day 1 to 7.** Today prescribes Box 4-count, 5 min. Reset card always present. Before-rating, drill, after-rating, log. Program day advances by calendar date; a missed day shifts the program, never resets it.
6. **Day 8, Week 2 gate.** Today shows the Week 2 drill with the Pro tag. Start opens the paywall. Reset and the graph stay free forever.
7. **Weekly re-test.** Due every 7 days. Counted only if taken before 11:00 local and the user confirms no caffeine yet. Any reading that moves more than 40 percent from the prior one is marked as an off-week, plotted muted, and the app offers a next-morning re-test.
8. **Weeks 2 to 4.** Autonomic base, Box ladder, Down-shift plus box. Ladder rules in section 5.
9. **Day 29 and beyond.** Cycle 2 starts automatically: same four-week shape, box ladder begins at the count the user finished on, Down-shift starts at the ratio they finished on. Settings offers Maintenance: three drills a week, re-tests continue. Nothing ends; the subscription is for the re-tests and the cycles.
10. **Off-ramp.** Reset all data in Settings, with a confirmation that names what is deleted. Export JSON first is offered on the same screen.

## 4. Screens and navigation

Tabs: Today, Test, Progress, Settings. Full-screen modals: Session, Safety, Paywall. Stack: Onboarding (first run only).

| Screen | Contents | Taps from launch |
|---|---|---|
| Today | Day and week, drills this week (n of 7), prescribed drill card with Start, Reset card, re-test card when due, three stat tiles or the no-baseline card | 0 |
| Session | Before-rating, how-to, animated orb, phase label, count, time left, End, after-rating, down-shift, Log drill | 1 |
| Test | One measurement at a time, big number, one button, running summary, morning-and-no-caffeine confirmation | 1 |
| Progress | CO2 tolerance first, then resting rate, exhale control, down-shift per drill, drills and minutes totals. Off-weeks plotted muted | 1 |
| Settings | Reminder time, haptics, tone, cohort code (hidden until entered), Pro status and Upgrade, Restore Purchases, Export JSON, Privacy, Terms, "Refunds are handled by Apple," Reset all data | 1 |
| Paywall | Section 9 | 2 |

No streak counter anywhere. No library grid anywhere.

## 5. Drill engine and ladder

- Phases are data: label, seconds, kind (in, out, hold), orb scale. Engine runs on a monotonic clock (start timestamp plus elapsed), not accumulated setInterval ticks, so a 6-minute drill ends within 200 ms of true time.
- Backgrounded mid-drill: the drill pauses; on return it offers Resume or End. Never silently keeps counting.
- Cues: haptic on every phase change (medium for in and out, light for hold). Optional tone. No music, ever. Voice counting is 1.1.
- **Clean drill:** completed to the end without End, and after-rating is less than or equal to before-rating.
- **Box ladder:** count rises 4 to 5 to 6 after three consecutive clean box drills. Falls one count after two consecutive early ends. Never below 4, never above 6 in Cycle 1; 7 unlocks in Cycle 2.
- **Down-shift ratio:** exhale rises 6 to 7 to 8 seconds, one step per clean drill, falls one step after two early ends.
- Reset drill: 60 seconds of cyclic sighing. Always available, never gated, logged as a drill without ratings unless the user wants to rate it.

## 6. Measurements

| Test | Instruction (plain twin first) | Guardrail |
|---|---|---|
| Resting rate | "Breathe normally and tap once per inhale for 60 seconds." Sit still 60 s first; the timer shows a settle countdown | Fewer than 6 or more than 30 taps is rejected with "Try again after a minute of sitting still" |
| CO2 tolerance (control pause) | "How long you can comfortably hold after a normal exhale. Stop at the first clear urge, not your max." | Safety screen accepted. Readings over 90 s prompt "Was that a max hold? Redo at the first urge." |
| Exhale control | "One normal breath in, then exhale slowly through pursed lips until empty, no straining." | Readings over 60 s prompt a redo |

Validity rules: re-tests count only before 11:00 local with the no-caffeine confirmation. A change over 40 percent from the prior reading is an off-week. The graph never hides a point; it mutes it. Baseline is never marked off-week.

## 7. Retention loop

- Progress feedback: the down-shift number after every drill, the graph after every re-test, and "drills this week" on Today.
- No streaks. No badges. No leaderboards. No social.
- Reminder: opt-in, asked after the first completed drill with one line. Default 20:00 local, user-changeable. Re-test reminder on the morning it is due.
- Variety comes from the program shape, not from content: the drill changes weekly, the ladder changes the count, Cycle 2 raises the floor.
- Week 1 must produce a felt win: the reset drill is taught on Day 1 so the user has the in-the-moment tool before the paywall.

## 8. Data model and migration

Local-first, expo-sqlite. Three tables replace the single JSON document.

| Table | Fields | Notes |
|---|---|---|
| settings | id (1), onboarded, start_date, safety_accepted_at, box_count, exhale_ratio, cycle, maintenance, remind, remind_time, haptics, tone, cohort_code, pro_source (none, sub, founding), schema_version | One row |
| drills | id, date, tech, minutes, pre, post, completed, reset (bool), cycle, week | Indexed on date |
| tests | id, date, rr, bolt, exhale, morning_confirmed, off_week (bool) | Indexed on date |

Migration: schema_version in settings; migrations run lazily on first open, never at module scope. The current JSON kv-store document migrates to the three tables in version 2.
Backup: the database file lives in the app's Documents directory and rides in the iCloud device backup. Export JSON in Settings writes all three tables to a share sheet.
Institutional-ready: cohort_code is stored from day one; every drill and test row carries cycle and week so a future aggregate export needs no reshaping.

## 9. Subscription, paywall, founding offer

- Free forever: onboarding, safety screen, baseline, Week 1, Reset drill, Progress with the baseline point, export.
- Pro: Weeks 2 to 4, every re-test after baseline, Cycle 2 and beyond, Maintenance mode.
- Prices locked: $9.99 monthly, $59.99 annual with 14-day trial on annual only. Store-provided price strings only; nothing hard-coded.
- Paywall contents, all on the screen: product name, what it unlocks, period, price and per-month equivalent for annual, trial terms, auto-renewal disclosure, Terms link, Privacy link, Restore Purchases, "Not now." Reached at the Week 2 gate and from Settings, two taps from launch.
- Founding lifetime: non-consumable product granting the same entitlement. Unlocked only by an App Store offer code sent to the reservation list. Never shown on the paywall. Capped at 100 codes. pro_source records how Pro was granted.
- RevenueCat: anonymous app user ID, no account. Restore Purchases covers new phone. Configure lazily, inside a function, never at module scope. Key read through env() only.

## 10. Safety, legal, store compliance

Safety screen copy (exact):
"Breath holds can make you light-headed. Never do them in or near water. Never do them while driving or operating equipment. Stop at the first sign of dizziness. If you are pregnant, or have a heart, lung, or blood-pressure condition, talk to a doctor before using FourCount. FourCount is a training tool, not a medical device, and does not treat any condition."

Footer copy (exact, Settings and Welcome):
"Not a medical device. Not a treatment. Not affiliated with any agency, branch, or unit."

Claims policy: allowed verbs are trains, practices, supports, measures, and "in a controlled trial." Banned: treats, cures, reduces anxiety, clinically proven, diagnoses, any endorsement, "Navy SEAL" in metadata.

Store: category Health & Fitness; medical device status declared "not a regulated medical device"; age rating 12+; privacy nutrition label declares no data collected; notification permission requested only after the first completed drill; Terms are Apple's standard EULA; refunds are Apple's, stated in Settings in one line. Review notes carry the exact tap path to the paywall and confirm sandbox purchase on a physical device.

Wim Hof and any hyperventilation protocol: not in the product until a dedicated safety gate exists. Not V1, not 1.1.

## 11. Institutional-ready decisions for V1

- cohort_code in settings, hidden until entered.
- cycle and week on every row.
- Export JSON exists, so a department pilot can be run by hand before a dashboard exists.
- No accounts, so no PII to protect when a unit adopts it.
- Nothing else. The team dashboard is V2.

## 12. Prioritization

| Feature | User problem | Business value | Complexity | Depends on | Release |
|---|---|---|---|---|---|
| Drill engine on a monotonic clock | Counts drift, trust dies | Core | Medium | none | V1 |
| Safety screen | Fainting risk, liability | Core | Low | none | V1 |
| Three measurements with guardrails | Numbers must mean something | Core | Medium | safety screen | V1 |
| Off-week logic | Bad weeks kill motivation | Retention | Low | tests | V1 |
| Box ladder and Down-shift ratio rules | "Trained" must be literal | Core | Low | engine | V1 |
| Reset drill, ungated | The in-the-moment tool | Retention, free-tier value | Low | engine | V1 |
| Progress graph with muted off-weeks | Proof | Core | Medium | tests | V1 |
| Paywall, subscription, restore | Revenue | Core | Medium | RevenueCat | V1 |
| Founding lifetime via offer code | First 100 | Revenue | Low | paywall | V1 |
| Export JSON | Data safety without accounts | Trust | Low | data model | V1 |
| Cohort code field | Institutional path | Strategic | Low | settings | V1 |
| Cycle 2 and Maintenance | Day 29 | Retention | Low | program | V1 |
| Reminders, opt-in after first drill | Habit | Retention | Low | notifications | V1 |
| Voice counting, no music | Eyes-closed use | Retention | Medium | engine | 1.1 |
| Lock-screen widget for Reset | Speed to the tool | Retention | Medium | none | 1.1 |
| 4-7-8 as an evening Down-shift variant | Sleep onset | Retention | Low | engine | 1.1 |
| Apple Watch | Wrist access | Reach | High | none | V2 |
| Siri shortcut for Reset | Hands-free | Reach | Low | none | V2 |
| Optional sync | New phone without backup | Trust | High | accounts | V2 |
| Team dashboard | Institutional sales | Revenue | High | sync | V2 |
| Android | Reach | Revenue | High | 100 paying iPhone users | V2 |
| Camera HRV | Extra marker | Differentiation | High | validation study | V2 |
| Streaks, badges, leaderboards, social | none | negative | Low | none | Do not build |
| Music, soundscapes, content library | none | contradicts lane | Medium | none | Do not build |
| Wim Hof, hyperventilation | none | liability | Medium | safety gate | Do not build in V1 or 1.1 |
| Accounts in V1 | none | review surface, PII | High | none | Do not build |

## 13. Development order

Status 2026-09-30: M1 code complete and pushed to fourcount-app main (commit "M1: drill engine, measurements, safety screen, three-table database"). Static acceptance met: tsc, preflight, Metro export. Physical-device Release build still owed.

**M1. Engine and measurements on a real phone.** Monotonic drill clock, background pause and resume, haptic cues, the three tests with guardrails, safety screen, three-table data model with migration from the JSON document. Testing: Release build on a physical iPhone; a 6-minute drill ends within 200 ms; backgrounding pauses; a control pause over 90 s prompts a redo. Acceptance: preflight passes, tsc clean, no module-scope side effects.

**M2. Program and progress.** Prescription by week and cycle, ladder and ratio rules, clean-drill logic, off-week logic, Cycle 2 and Maintenance, Progress graph with muted points, drills-this-week counter, export JSON. Testing: simulate 35 days by shifting start_date; verify Day 8 gate, Day 29 rollover, ladder up and down. Acceptance: every screen has an empty state; no dead buttons.

**M3. Onboarding, reminders, settings.** Welcome, lesson, safety, baseline hand-off, reminder opt-in after first drill, cohort code, Privacy and Terms links live. Acceptance: install to first completed drill in under 12 taps.

**M4. Money.** RevenueCat installed and configured lazily; monthly, annual with trial, founding non-consumable; paywall with every required element; Restore; Week 2 gate. Testing: sandbox purchase, restore, force-quit persistence, offer code redemption. Acceptance: Lessons Learned 10-minute pre-submit test passes on a fresh TestFlight install.

**M5. Submission.** App Store Connect products with review screenshots, medical device declaration, privacy label, age rating, review notes with the tap path, EAS build log read to the end, new build number.

## 14. Open questions not resolved

1. Whether the no-caffeine confirmation is too much friction for re-tests. Decide after 20 users.
2. Exact reminder copy. Draft: "Five minutes. One drill. Then the graph moves."
3. Whether Cycle 2 should unlock a 7-count box or hold at 6. Default 7, revisit with data.
4. Founding code delivery: manual email versus a Netlify function. Manual for the first 100.
