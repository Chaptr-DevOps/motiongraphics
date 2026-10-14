# Night Shift — motion graphics workspace

Remotion project for short-form 9:16 promo reels (IG Reels / TikTok / Shorts) for **Night Shift**, a sleep app.

## Current direction
- **The playbook is the authority** on goals, hooks, script structure, formats and the pre-posting checklist: `NightShift Short-Form Playbook for the Video Agent(1).md` in the project root. Where it cites "the motion brief" (removed), follow this file and the user's reference frames instead.
- **Dark look stays, over a photo** (user, Oct 14). Background = a night photo from `public/images` behind frosted, darkened glass: `PhotoBackground` (blur ~44, calm 0.5, saturation 0.7) plus a dark glass gradient, so objects and type stay readable. Each video gets its own photo via `pickPhoto("<slug>")` (`brand/photos.ts`, seeded so re-renders match) for variety across posts. Keep the night palette `P` for type and strokes. Solid object surfaces (pills, note, invite) are mixed from the photo's measured `tint` via `<SurfaceTint.Provider>` (`components/objects.tsx`) so they match the photo; never hardcode navy fills. New photos need their average colour measured into `tint`.
- **No people on screen, ever.** No characters, figures or silhouettes; the character rig was deleted on purpose. Don't rebuild it.
- **No waitlist in any video.** Videos direct viewers to the quiz. On screen, name it the way the VO does (RacingMind's VO says "the two-minute sleep quiz in our bio", so the card reads "Take the sleep quiz · 2 minutes · link in bio").
- **No diagnosis language.** Don't promise to tell viewers "the type of insomnia you have" or assume they have insomnia; say "what's keeping you up" or "your sleep pattern" (suggested to the user Oct 14, and they used it in the VO).
- **The quiz call-to-action goes in the video itself** (user, Oct 14: most people don't read captions or comments). Approved pattern (RacingMind): the CTA is spoken as the **second-to-last** beat, and the loop line stays last, running straight back into the hook. Never add a silent tail or put the CTA after the loop line, because that breaks the loop. Show the CTA as an object from the video's own metaphor, with the text readable without sound (RacingMind: a "Take the sleep quiz · link in bio" invite, *Organizer: you*, gets accepted and books itself into the Evening slot). The last frames fade back to frame 0.
- **Scripts come from the user, one per video.** All older scripts and the reels built from them were removed. Old renders in `out/` are kept as files only; do not use them to inform new work.
- **Do not use app screenshots** (`public/screenshots/`) in any video for now.
- **Motion idea: continuity and morphing.** `reference/frames/` (gitignored) holds frames the user picked. What to take: an element (dot, icon, line) stays on screen and morphs into the next thing, with text on top, so the video flows instead of cutting. Do not take their colors, fonts, logos, phone screens or script structure. `reference/video.68e43b7c.mp4` was rejected as too bland; it is not a style target.

## Visual approach (approved Oct 14, 2026; read before designing any video)
The first RacingMind board (abstract dots turning into lines and circles) was rejected as "very basic", "sloppy" and "low effort". The redone board (`RacingMindBoard`) was approved as "exactly what I was looking for". What changed is the rule:
- **Every beat shows a concrete, recognizable object taken from the script's own metaphor.** "Your brain calls a meeting" means a calendar with a meeting block in the Lights out slot, not a circle of dots. Mine the script for nouns and verbs (meeting, inbox, ping, loop, page, fold) and draw those.
- **One running metaphor per video** that the objects belong to (RacingMind: worries are meetings your brain books at bedtime). Beats call back to earlier objects; the last frame returns to the first object so the video loops.
- **Craft level of a real UI illustration.** Objects carry believable detail and real, specific copy: header labels, a guest-dot row, unread dots, preview lines, a count badge, worry text like *Reply to Sam* or *Dentist?*, small wry touches ("Organizer: your brain"). The two-column page set the bar.
- **Continuity comes from the objects transforming** (the meeting block lifts and drags; pills snap into inbox rows; the evening block opens into the page; the page folds). Abstract morphs (`lib/morph.ts`) are only for the in-between moves, never the content.
- **Thin lines.** Strokes and borders around 3 px (`LINE` in `components/objects.tsx`), hairline dividers; no 12 px outlines or fat dots.
- **Big enough for a phone.** Hero objects about 720 px wide; titles in objects at least 28–30 px. Small uppercase labels are garnish only.
- **Show the action**: lifted blocks get tilt and shadow, the old slot keeps a dashed ghost, dotted arrows show where things go, motion trails for drifting things.
- **Details must support the message.** Check that what an object implies matches the script: the user caught that an "Evening" slot at the top of the calendar made the worry list read like a morning task; it now sits right before "Lights out". They also re-recorded "a couple of hours before bed" as "an hour before bed" because the calendar showed the slot just before Lights out. When the VO and a visual disagree on a specific, point it out.
- **Worry copy should sting.** Specific, emotional worries land harder than mundane ones; the user swapped the late worry "Car noise?" for "Are they mad at me?". A payoff item (like the late worry) is new, not one already seen.
- **No invented data.** Illustrate the direction of a finding (a busy line calming) without axes or numbers the study didn't give.
- Still: dark look over the frosted photo, no people, no phones/beds, no clock times (use row labels like "Evening", "Lights out"), amber once.

## Workflow per script
1. Save the script to `docs/<slug>.md` and the VO to `public/audio/<slug>-vo.mp3`. Time beats from the VO's pauses: `npx remotion ffmpeg -i <vo> -af silencedetect=noise=-38dB:d=0.18 -f null -`.
2. Reply with the visual concept (the running metaphor plus one line per beat: object, text position, on-screen text).
3. **Storyboard before any animation** (the user asked for this): a `<Name>Board` composition with one frame per panel, built from `components/objects.tsx`, rendered with `node scripts/storyboard.mjs <Id> docs/<slug>-board.json` (each panel: `sec` frame, `at` VO time, `vo`, `move`). Look at the sheet yourself and fix overlaps, three-line supers and unreadable objects before showing it.
4. Animate only after the board is approved, reusing the same object components. Keep VO cues in one `T` object at the top of the composition.
5. **VO revisions:** the user often re-records. Keep earlier takes as `<slug>-vo-v1.mp3`, `-v2.mp3`, …, put the new take at `<slug>-vo.mp3`, re-time every cue in `T` from the new pauses (use `d=0.12` to catch short ones and to find where the last word ends), set the duration to just past the last word, and update `docs/<slug>.md`.
6. Low-res preview (`--scale=0.5 --crf=28` into `out/preview/`), checked with stills first. **Full render only after the user approves the preview**: master `out/final/<Name>.mp4` and the cover `out/final/<Name>-cover.png` (a frame where the hook is fully on screen; RacingMind uses frame 90).

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
- `src/brand/photos.ts` — named night photos (`photos.lake`, ...) with crop positions and measured average `tint`; `pickPhoto(seed)` picks one per video. `photos.moon`'s file is missing, so it's excluded. No night-road photo exists. To measure a new photo's tint: `sips -s format bmp -z 8 8` it and average the pixels (the bundled ffmpeg can't write raw video).
- `src/components/` — `PhotoBackground` (blur, grain, ground overlay, drift), `Scene` (crossfade + blur dip, punch-in/push-in zoom keys), `Super` (two-tone word reveal: `*key words*` in primary, `accent` makes them amber), `Glass` (`GlassPanel`, `Label`, `StepRow`, `Pill` with tap).
- Approved look: `components/premium.tsx` (`Backdrop`, `Glass`, `Headline`, `Eyebrow`, `Chip`, palette `P`), `src/templates/` (`DialHook`, `StatCounter`, `BedtimeWeek`, `CompareCards`, shared `motion.tsx`), shown in `compositions/StyleFrames.tsx` and `TemplatePreview.tsx`. Their sample copy is placeholder from old scripts.
- Illustrated objects: `components/objects.tsx` (`Calendar` + event blocks with solid/ghost/lifted states, `Pill`, `Inbox`, `Page` two-column list, `FoldingPage`, `Moon`, `Tick`, `Attendees`, quiz CTA pieces `Invite` / `QuizBlock` / `Button` / `TapRing`, and `SurfaceTint` for photo-matched fills). Build new metaphor objects here in the same style. Gotcha: CSS 3D `rotateX` folds render wrong in the headless renderer; fold with a 2D `scaleY(cos)` flip as `FoldingPage` does.
- Morph engine: `lib/morph.ts` (shapes `dot`/`line`/`wave`/`ring`/`crescent` as the same N points; `Stage` list with `at`, `shape(frame)`, `look` {width, fill, dots, amber}, spring + per-point stagger; `resolve`) and `components/Morph.tsx` (`Hero`). Demo: `compositions/MorphTest.tsx`. Gotcha: never fade `fill` on an open line (it fills the area under the curve); pass through a `dot` and use `snap`.
- Other helpers: `components/fluid.tsx` (`FluidBackground`, `LiquidWipe`, `Stream`, `Goo` filter), `components/kinetic.tsx` (`Beat`, liquid `Kinetic` type, pen-tip `Draw`, `Stage`), `lib/shapes.ts` (`smoothPath`, `blobPath`, `liquidPill`).
- `src/compositions/` — one file per reel; register each in `src/Root.tsx` (the master only; no `-Textless` registration needed).
- `scripts/storyboard.mjs` — `node scripts/storyboard.mjs <CompositionId> <board.json>` renders a labelled storyboard sheet to `out/storyboard/<id>.png`.
- `scripts/stills.mjs` — `node scripts/stills.mjs <CompositionId> <sec> [sec...]` renders stills and a contact sheet to `out/stills/`.
- `public/` — assets via `staticFile()`: `brand/fonts`, `images` (night photos), `audio`. `screenshots/` is not used for now.
- `NightShift Short-Form Playbook for the Video Agent(1).md` (project root) — the current instructions for goals, hooks, script structure, formats and the pre-posting checklist. It replaces the old motion brief and script rules .docx files, which were removed.
- `docs/` — scripts from the user (`<slug>.md`) and storyboard panel notes (`<slug>-board.json`).
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
- Per video deliverables: master MP4 and cover still. **No textless version** (user, Oct 14: the text version works perfectly).
- **Covers are designed separately, not grabbed from the video** (approved Oct 14, `RacingMindCovers` option A). They must read on a profile grid, where the cover shows as a small 3:4 tile cropped from the middle (y 240–1680). The pattern:
  - The hook question that names the viewer's situation (it must mention sleep) in all-white Instrument Sans 600 at about 170 px, three lines at the top.
  - One big object from the video's metaphor in the middle.
  - The short answer at about 90 px below it.
  - No dim two-tone words, no detailed small objects, same photo background and tint as the video.
  - Check it by cropping to 3:4 (`sips -c 1440 1080`) and looking at it at thumbnail size.
  - Build options in a `<Name>Covers` composition and render the chosen one to `out/final/<Name>-cover.png`.
