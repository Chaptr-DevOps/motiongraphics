# Night Shift — motion graphics workspace

Remotion project for short-form 9:16 promo reels (IG Reels / TikTok / Shorts) for **Night Shift**, a sleep app.

## Current direction
- **The playbook is the authority** on goals, hooks, script structure, formats and the pre-posting checklist: `NightShift Short-Form Playbook for the Video Agent(1).md` in the project root. Where it cites "the motion brief" (removed), follow this file and the user's reference frames instead.
- **Dark look stays.** Keep the dark night palette (`P` in `components/premium.tsx`, `night` in `theme.ts`) even where the playbook mentions night photography / frosted glass.
- **No people on screen, ever.** No characters, figures or silhouettes; the character rig was deleted on purpose. Don't rebuild it.
- **No waitlist in any video.** Videos direct viewers to the **sleep check** (the quiz). The closing sleep-check frame is not designed yet; ask the user before building it.
- **Scripts come from the user, one per video.** All older scripts and the reels built from them were removed. Old renders in `out/` are kept as files only; do not use them to inform new work.
- **Do not use app screenshots** (`public/screenshots/`) in any video for now.
- **Motion idea: continuity and morphing.** `reference/frames/` (gitignored) holds frames the user picked. What to take: an element (dot, icon, line) stays on screen and morphs into the next thing, with text on top, so the video flows instead of cutting. Do not take their colors, fonts, logos, phone screens or script structure. `reference/video.68e43b7c.mp4` was rejected as too bland; it is not a style target.

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
- `src/brand/fonts.ts` — loads Instrument Sans. **Sans only; never use the Newsreader serif** (user direction).
- `src/brand/photos.ts` — named night photos (`photos.moon`, `photos.lake`, ...) with crop positions. No night-road photo exists.
- `src/components/` — `PhotoBackground` (blur, grain, ground overlay, drift), `Scene` (crossfade + blur dip, punch-in/push-in zoom keys), `Super` (two-tone word reveal: `*key words*` in primary, `accent` makes them amber), `Glass` (`GlassPanel`, `Label`, `StepRow`, `Pill` with tap).
- Approved look: `components/premium.tsx` (`Backdrop`, `Glass`, `Headline`, `Eyebrow`, `Chip`, palette `P`), `src/templates/` (`DialHook`, `StatCounter`, `BedtimeWeek`, `CompareCards`, shared `motion.tsx`), shown in `compositions/StyleFrames.tsx` and `TemplatePreview.tsx`. Their sample copy is placeholder from old scripts.
- Morph engine: `lib/morph.ts` (shapes `dot`/`line`/`wave`/`ring`/`crescent` as the same N points; `Stage` list with `at`, `shape(frame)`, `look` {width, fill, dots, amber}, spring + per-point stagger; `resolve`) and `components/Morph.tsx` (`Hero`). Demo: `compositions/MorphTest.tsx`. Gotcha: never fade `fill` on an open line (it fills the area under the curve); pass through a `dot` and use `snap`.
- Other helpers: `components/fluid.tsx` (`FluidBackground`, `LiquidWipe`, `Stream`, `Goo` filter), `components/kinetic.tsx` (`Beat`, liquid `Kinetic` type, pen-tip `Draw`, `Stage`), `lib/shapes.ts` (`smoothPath`, `blobPath`, `liquidPill`).
- `src/compositions/` — one file per reel; register each in `src/Root.tsx` twice: master and `-Textless` (`supers: false`).
- `scripts/stills.mjs` — `node scripts/stills.mjs <CompositionId> <sec> [sec...]` renders stills and a contact sheet to `out/stills/`.
- `public/` — assets via `staticFile()`: `brand/fonts`, `images` (night photos), `audio`. `screenshots/` is not used for now.
- `NightShift Short-Form Playbook for the Video Agent(1).md` (project root) — the current instructions for goals, hooks, script structure, formats and the pre-posting checklist. It replaces the old motion brief and script rules .docx files, which were removed.
- `docs/` — empty for now; new scripts from the user go here.
- `out/` — renders (gitignored).

## Style direction (from the user)
- Soft, rounded, no harsh corners anywhere; motion that flows like liquid; push boundaries over following the brief literally.
- Goo filter gotcha: shapes inside a `Goo` group must be fully opaque (put opacity on the group), or they vanish / show seams.
- Early stage: preview with `--scale=0.5 --crf=28` into `out/preview/`; no full-fidelity renders until the look is approved.

## Conventions
- Keep text and panels inside `safe` / `content` (theme.ts) — platform UI covers the top 250, bottom 420 and right 140 px.
- Pull every color and font from `theme.ts`; never hardcode brand values in compositions.
- Timing inside a `Scene` is in seconds from the scene start; `Scene from/to` are on the master timeline.
- **Text layout (approved):** centred headlines that swap between the top and the lower middle, with the hero shape moving to the other half as it morphs. Swap at script turns in uneven groups (e.g. top, top, bottom, bottom, top), never strict top/bottom alternation and never fixed top-left for a whole video. The hook is at the top in the first frame. See `MorphTest-Swap`.
- Amber once per video. Supers max seven words, two lines. No clocks or current times on screen.
- After layout changes, run `scripts/stills.mjs` at key moments and look at the sheet before rendering the full MP4 (full renders take several minutes).
- Per video deliverables: master MP4, textless MP4, cover still (a frame where the hook is fully visible).
