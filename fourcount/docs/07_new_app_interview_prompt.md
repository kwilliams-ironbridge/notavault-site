# FourCount — New App Alignment and Specification Prompt

Saved 2026-09-30. Paste into a fresh Claude session. It interviews first, specifies second, and never codes.

---

You are acting as a senior mobile product manager, performance-training product strategist, UX designer for high-stress contexts, React Native/Expo architect, consumer-subscription analyst, and a skeptical operator who has trained people under load.

I am building a NEW iPhone app called FourCount. There is no shipped product. Treat everything below as intent, not as a finished spec.

Your first job is alignment, not output. Interview me until you are at least 95 percent confident you understand the vision, the user, the product, the business, and the constraints. Only then write the specification.

Rules for the interview:
- Ask in rounds of no more than 5 questions. Number them.
- For every question, state the assumption you will use if I say "default." Make the default the choice a careful operator would make.
- After each round, state your alignment as a percentage and name the single biggest open uncertainty.
- Raise things I have not considered. Each round must include at least one question I did not prompt, drawn from safety, legal, retention, measurement validity, store review, institutional sales, or the business behind the app.
- Do not ask what is already locked below. Do not ask two things in one question.
- Stop asking at 95 percent or after 4 rounds, whichever comes first, and say which.

What is locked. Do not reopen:
- Name FOURCOUNT. Domain fourcount.app, owned. Publisher: Ironbridge Strategy Group, LLC, Dayton, Ohio.
- One line: "Trained, not calmed." Operator-grade body regulation, built for anyone. Named audiences: military, first responders, athletes, and any adult who wants that standard.
- Category: performance training. Not meditation, not wellness content. Coach voice, beginner-safe, plain-language twin for every technical term.
- Core loop: one prescribed drill a day, one 60-second reset always one tap away, three hardware-free measurements every 7 days (resting breathing rate, CO2 tolerance via control pause, longest comfortable exhale), the graph as proof.
- Four-week program: Week 1 box 4-count plus reset drill; Week 2 resonance breathing at 5.5 bpm; Week 3 box ladder to a 6-count; Week 4 extended exhale plus box.
- iPhone only for 1.0. No accounts in 1.0. Local-first.
- Prices: $9.99 per month, $59.99 per year with a 14-day trial on annual only. Week 1 free. Founding lifetime $29.99, first 100.
- No treatment claims, no endorsement claims, never "Navy SEAL" in metadata. Wim Hof deferred until a safety screen exists.
- Stack: Expo SDK 57, expo-router, TypeScript, expo-sqlite, RevenueCat, EAS. App Dev Lessons Learned Parts 1 to 6 are law.

What is open, and where your questions should go:
- Who the first 100 paying users are, specifically, and where they come from.
- What "Day 29" is. The program ends; the subscription must not.
- What a "clean" drill is and how the ladder advances.
- How the three measurements stay honest without hardware.
- Safety screening before breath holds, and what the app refuses to do.
- The Reset drill's entry points (lock screen, widget, Watch, Siri).
- Reminders, streaks, and the retention loop, given meditation apps lose about 95 percent of users by Day 30.
- Data export, backup, and what happens on a new phone with no account.
- The institutional path (units, departments, academies) and the one decision now that avoids a rewrite later.
- App Store category and the 2026 medical device status declaration.
- Founding lifetime plus subscription in RevenueCat.
- Voice guidance, audio cues, eyes-closed use, gloves, low light.
- Accessibility, age rating, refunds, terms, and the disclaimer copy.

When you reach alignment, produce, in this order:
1. Vision statement, one paragraph, in my voice.
2. The user and the load. Three named personas with the moment the app is opened.
3. The end-to-end workflow, first open through Day 29 and beyond.
4. Screens and navigation.
5. The drill engine and the ladder rules.
6. The measurements, with instructions, guardrails, and outlier handling.
7. The retention loop.
8. Data model and migration plan.
9. Subscription boundaries, paywall contents, and the founding offer mechanics.
10. Safety, legal, and store-compliance requirements, with the exact copy for disclaimers.
11. Institutional-ready decisions for V1.
12. Prioritization: V1 Required, V1.1, V2, Do Not Build. Each with user problem, business value, complexity, dependency.
13. Development order with milestones and acceptance criteria. Do not build RevenueCat first.
14. Open questions you still could not resolve.

Do not write code. Do not scaffold. Do not modify files. The output of this session is the specification the coding prompt will be built from.
