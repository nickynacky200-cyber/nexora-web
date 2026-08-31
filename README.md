# Next Bridge — Web (Phase 1)

Same Phase 1 scope as the mobile scaffold — Welcome, Login, Onboarding,
and the six tabs (Home, Learn, Test, Ideas, Connect, Profile) — but as a
web app instead of a native build. Everything on screen is demo data
(`src/data/demoData.ts`) until the backend is built.

The layout is deliberately phone-width and centered even in a desktop
browser, with a bottom nav bar, so it reads as an app rather than a
website. It'll also just work on a real phone browser, full width.

## Easiest way to run this — no install at all

Given your machine's specs, skip local `npm install` entirely:

1. Go to **stackblitz.com**
2. Create a new **Vite + React + TypeScript** project
3. Delete the default files it generates, and upload/paste in this
   folder's files (same structure)
4. StackBlitz installs dependencies and runs the dev server in the
   cloud automatically — you get a live preview right in the browser tab,
   and a shareable URL you can also open on your phone

This never touches your local machine's RAM or CPU at all.

## If you'd rather use GitHub + Codespaces instead
Same as before:
```bash
npm install
npm run dev -- --host
```
Then open the forwarded port URL, or the Codespaces "Ports" tab, from
any browser — including your Android phone's browser.

## What's next
Once this is confirmed working for you, Phase 2 adds the backend
(Node/Express + PostgreSQL) and wires real auth + data into these
screens. The React logic here also transfers directly to the Expo/React
Native version later, if/when you want real native app store builds —
same component structure, same design tokens, just swapped to
React Native primitives.

## Folder structure
```
src/
  pages/        one file per screen
  components/   Card, ProgressBar, ScoreRing, PrimaryButton, BottomNav
  theme/        global.css — design tokens as CSS variables
  data/         demoData.ts — placeholder data, clearly marked
```
