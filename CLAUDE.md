# CLAUDE.md — Ship It! (working title — idle dev-studio tycoon)
> Drop this at the repo root. Claude Code reads it automatically every turn.
> It is the source of truth for design, stack rules, and current scope.
> Keep it tight — if something here is wrong, fix it here, not in chat.
## What we're building
A single-player idle / incremental mobile game for iOS + Android in Expo (React Native + TypeScript). Theme: running an indie software studio — tap to write code, hire a team that auto-produces code, ship features, pull users, and "exit" (prestige) for permanent multipliers. The mechanics are standard idle; **the personality and art direction are the entire differentiator.**
Core loop: tap → earn **Code** → spend Code on generators (your team) that auto-produce Code → milestones unlock **Users** → an **Exit** (prestige) wipes progress in exchange for permanent **Equity** multipliers. Primary retention hook = offline earnings (the team keeps producing while the app is closed) + local notifications.
## Tech stack — and the non-negotiables
- **Expo + React Native + TypeScript.** Dev-client build required once Skia/ads land (NOT Expo Go). Phases 0–1 can run in Expo Go for speed.
- **Zustand** for state. One game-state store. **Always read with selectors** so only the components using a value re-render on each tick — never subscribe a whole screen to the full store.
- **break_infinity.js** for ALL currency / production / cost values. Never use plain JS `number` for currency — it overflows within an hour of play. Every balance, cost, and rate is a `Decimal`.
- **AsyncStorage** for persistence — serialize the full game state as JSON. Save on meaningful change and on app-background.
- **Offline earnings = delta-time only.** Store a `lastSeen` timestamp. On resume, award `productionPerSec × min(elapsedSeconds, OFFLINE_CAP_SECONDS)` in a single calculation. NEVER simulate ticks across offline time. Default cap 8h (made extendable via rewarded ad in Phase 3).
- **Two separate cadences:** logic tick ~250ms (updates Decimal balances); UI refresh runs on a slower, separate cadence. Do not re-render the tree every 250ms.
- **Animation:** `react-native-reanimated` (UI-thread worklets) + `react-native-skia` (particles, glows, animated background) + **Moti** for everyday declarative micro-animations. ALL animation runs on the UI thread — the tick loop lives on the JS thread and must never share it with animations.
- **expo-haptics** on every tap, every purchase, every milestone.
- **Later-phase only — do NOT add until their phase:** `react-native-google-mobile-ads` (AdMob), `react-native-purchases` (RevenueCat), Supabase (cloud save + leaderboard), `expo-notifications`.
## Art direction
Flat, bold-outline editorial illustration. **NOT 3D. NOT generic SaaS.** Visual language: cream paper background, heavy black outlines on every element, chunky black pill buttons, expressive mascot characters with kawaii faces + sparkle accents, sticker-style decorative elements, bold characterful display type, hard (non-blurred) offset drop shadows.
Palette — **decorative / brand use** (assign to characters & sections; tweak to taste):
- Background / paper: `#F6F1E7`
- Ink (outlines, primary text): `#141210`
- Card surface: `#FFFFFF` with a 2–3px black outline + hard offset shadow (no soft blur)
- Accents (character/section coded): orange `#F5872E` · pink `#EF4C8F` · sky `#4FB0E0` · violet `#7C5CD6` · yellow `#FFC93C` · green `#27AE76`
Type: a bold display face for headings (chunky — grotesque or rounded display) + a clean readable sans for body and numbers. Lock exact faces in `theme.ts`.
Motifs: sparkles/stars, small geometric confetti, sticker badges, thick outlines, hard offset shadows. Reuse relentlessly so it feels like one world.
## COLOURBLIND RULE — hard constraint, applies to EVERY component
The developer is red-green colourblind. **Semantic state must NEVER be carried by hue alone, and never by a green-vs-red distinction.** Non-negotiable for: affordable vs unaffordable, ready-to-collect, locked, success/error, and progress.
Encode state with: **fill vs ghost** (filled = affordable/active, outlined = not), **outline weight**, **icons**, **text labels**, and **motion** (a pulse/glow = ready to collect). The vibrant accent palette is for decoration and character/section coding only — it must never be the sole carrier of meaning. When in doubt, add a second, non-colour cue.
## Economy — starting point (tune in Phase 1)
Currencies: **Code** (primary; generated + spent) · **Users** (milestone metric) · **Equity** (prestige multiplier currency).
Generators (the "idle" producers): You (tap) → Junior Dev → AI Coding Agent → Senior Engineer → Offshore Team → DevOps Bot → 10x Engineer → AI Swarm.
Generator cost: `baseCost × growthRate^owned` (growthRate ~1.07–1.15). Starter values:
| Generator        | baseCost | base Code/sec | growth |
|------------------|---------:|--------------:|-------:|
| Junior Dev       |       15 |           0.1 |   1.07 |
| AI Coding Agent  |      100 |             1 |   1.10 |
| Senior Engineer  |    1,100 |             8 |   1.12 |
| Offshore Team    |   12,000 |            47 |   1.14 |
Tap value starts at 1; upgrades multiply it. Exit/prestige awards Equity ≈ `sqrt(totalUsersEver / C)`; each Equity point = +2% global production. All constants are placeholders to tune.
Upgrades: one-time multipliers with on-brand flavour (Mechanical Keyboard +2x tap, Cold Brew On Tap, Copilot subscription, Standing Desk, "quit the day job").
Events: timed pop-ups — "HackerNews front page → 2x Users for 60s", "Production outage → tap to fix" (becomes watch-an-ad-to-fix in Phase 3).
## File structure
```
/src
  /state        Zustand store, game-state types, tick loop, save/load, offline-earnings calc
  /economy      generators, upgrades, cost/production math (pure functions, Decimal in/out)
  /theme        design tokens (palette, type, spacing, shadows) — single source of truth
  /components   reusable UI (Button, Card, AnimatedNumber, ProgressRing, FloatingText, CurrencyBar)
  /screens      MainGame + modals (Shop, Exit, Settings, Stats)
  /assets       images/sprites (mascots, icons) — generated externally
/App.tsx
```
Every colour, spacing value, type style, and shadow comes from `/theme`. Never hardcode a hex or a px inside a component.
## Build phases — current scope = PHASE 0
- **Phase 0 (NOW):** math prototype. `theme.ts` tokens + Zustand store + economy math + tap-to-earn + ONE generator auto-producing + working offline earnings (delta-time). Minimal UI; correctness over polish. The goal is to prove the loop feels good.
- **Phase 1:** full generator roster, upgrades, Exit/prestige, break_infinity throughout, events, curve tuning.
- **Phase 2:** juice & art — Reanimated/Skia/Moti, the cream/black-outline visual system, mascots, sound. (Switch to a dev build here.)
- **Phase 3:** monetization — AdMob (rewarded + interstitial), RevenueCat IAP, extendable offline cap.
- **Phase 4:** backend — Supabase cloud save + leaderboard, expo-notifications, remote event config.
- **Phase 5:** store listings, soft launch, retention iteration.
## Conventions
- TypeScript everywhere; functional components + hooks.
- All economy math = pure functions (easy to test and re-tune).
- Small commits, one per slice.
- Do not introduce a library not listed above without flagging it first.
- Build only what the current phase covers. Don't scaffold future-phase systems early.

---

## Project status & commands (scaffolded — keep current)
- **Scaffold:** Expo SDK **56** · React **19.2** · React Native **0.85** · TypeScript **6** (strict). App entry is `index.ts` → `App.tsx`. Expo's docs churn between SDKs — consult https://docs.expo.dev/versions/v56.0.0/ for exact APIs.
- **Phase 0 status: implemented.** Theme tokens, the Zustand store, pure economy math (Decimal), tap-to-earn, the auto-producing generator loop, delta-time offline earnings (8h cap), AsyncStorage save/load, and a minimal cream/black-outline UI are all in place. The four starter generators from the economy table are seeded as data; the auto-production system is generic over the roster.
- **Two-cadence loop:** `useGameLoop` runs the 250ms logic tick (`loopConfig.LOGIC_TICK_MS`); `useUiSnapshot` samples for render on the slower `UI_REFRESH_MS`, with `actionVersion` bumping for instant feedback on discrete actions. Don't subscribe components to `code` reactively.
- **Dev-only tooling flagged:** `jest` + `jest-expo` were added for unit tests (not a runtime lib). Pure economy/state logic is covered under `src/**/__tests__`.
- **Commands:**
  - `npm start` — Expo dev server (Expo Go is fine for Phase 0–1)
  - `npm test` — run the Jest suite
  - `npm run typecheck` — `tsc --noEmit`
