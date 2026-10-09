# Night Shift — motion graphics workspace

Remotion project for short-form 9:16 promo reels (IG Reels / TikTok / Shorts) for **Night Shift**, a sleep app.

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
- `src/brand/theme.ts` — colors, fonts, reel size (1080x1920 @ 30fps), social safe area. Single source of truth for brand values.
- `src/brand/fonts.ts` — brand font loading.
- `src/components/` — reusable pieces (FadeUpText, PhoneFrame, ...).
- `src/compositions/` — one file per reel/template; register each in `src/Root.tsx`.
- `public/` — assets, referenced with `staticFile("screenshots/x.png")`:
  `brand/fonts`, `brand/logos`, `screenshots` (app screens), `images`, `audio`.
- `docs/` — Night Shift design doc and creative briefs.
- `out/` — renders (gitignored).

## Conventions
- Keep text and key UI inside `safeArea` — platform UI covers the top, bottom and right edges.
- Pull every color and font from `theme.ts`; never hardcode brand values in compositions.
- After layout changes, render a still at a few key frames and look at it before rendering the full MP4.
