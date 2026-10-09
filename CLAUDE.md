# Night Shift — motion graphics workspace

Remotion project for short-form 9:16 promo reels (IG Reels / TikTok / Shorts) for **Night Shift**, a sleep app.

## Current direction (overrides the brief)
- We're making **explainer videos first**. **Do not use app screenshots** (`public/screenshots/`) in any video for now, even where the brief or its worked example calls for app screens. The fix is shown with supers and frosted-glass panels only.
- Every video **ends with a waitlist call to action** (sign up for the NightShift waitlist). This replaces the brief's "no end cards / CTA lives in the caption" rule.

## Commands
- `npm run studio` — live preview in the browser (localhost:3000)
- `npx remotion render <CompositionId> out/<name>.mp4` — render a video
- `npx remotion still <CompositionId> out/<name>.png --frame=<n>` — render one frame (use to check layouts)
- `npm run typecheck`

## Environment constraints (important)
- Intel Mac on **macOS 12 Monterey**. No Homebrew, no system ffmpeg — don't propose installing them.
- **Remotion is pinned to 4.0.250** on purpose: newer versions ship an ffmpeg/Chrome built for macOS 13+ and crash (dyld "Symbol not found"). All `remotion` / `@remotion/*` packages must stay on the exact same 4.0.250 version.
- **TypeScript pinned to 5.x**: TS 7 breaks Remotion 4.0.250's bundler (`typescript.sys` undefined).

## Layout
- `src/brand/theme.ts` — palettes (night / evening / morning), type scale, safe zones, easing, motion durations, `sec()`. Single source of truth for brand values.
- `src/brand/fonts.ts` — loads Newsreader + Instrument Sans (variable TTFs in `public/brand/fonts/`).
- `src/brand/photos.ts` — named night photos (`photos.moon`, `photos.lake`, ...) with crop positions. No night-road photo exists.
- `src/components/` — `PhotoBackground` (blur, grain, ground overlay, drift), `Scene` (crossfade + blur dip, punch-in/push-in zoom keys), `Super` (two-tone word reveal: `*key words*` in primary, `accent` makes them amber), `Glass` (`GlassPanel`, `Label`, `StepRow`, `Pill` with tap), `WaitlistPanel` (the closing CTA).
- `src/compositions/` — one file per reel; register each in `src/Root.tsx` twice: master and `-Textless` (`supers: false`).
- `scripts/stills.mjs` — `node scripts/stills.mjs <CompositionId> <sec> [sec...]` renders stills and a contact sheet to `out/stills/`.
- `public/` — assets via `staticFile()`: `brand/fonts`, `images` (night photos), `audio`. `screenshots/` is not used for now.
- `docs/` — creative briefs. The brief and script rules .docx files are in the project root.
- `out/` — renders (gitignored).

## Conventions
- Keep text and panels inside `safe` / `content` (theme.ts) — platform UI covers the top 250, bottom 420 and right 140 px.
- Pull every color and font from `theme.ts`; never hardcode brand values in compositions.
- Timing inside a `Scene` is in seconds from the scene start; `Scene from/to` are on the master timeline.
- Amber once per video. Supers max seven words, two lines. No clocks or current times on screen.
- After layout changes, run `scripts/stills.mjs` at key moments and look at the sheet before rendering the full MP4 (full renders take several minutes).
- Per video deliverables: master MP4, textless MP4, cover still (a frame where the hook is fully visible).
