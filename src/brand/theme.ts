// NightShift brand tokens, from "NightShift Motion Graphics Brief.docx". Single source of truth.
import type { CSSProperties } from "react";
import { Easing } from "remotion";

export type Palette = {
  ground: string;
  primary: string;
  muted: string;
  amber: string;
  pill: string;
  pillText: string;
  glassFill: string;
  glassEdge: string;
  glassHighlight: string;
};

// Night is the default; Evening for wind-down topics; Morning only for check-in / daytime habits.
export const palettes = {
  night: {
    ground: "#0D0E17",
    primary: "#F3EEE6",
    muted: "#D6D0DC",
    amber: "#E9A45B",
    pill: "#EFE9DF",
    pillText: "#16141C",
    glassFill: "rgba(255,255,255,0.09)",
    glassEdge: "rgba(255,255,255,0.20)",
    glassHighlight: "rgba(255,255,255,0.14)",
  },
  evening: {
    ground: "#1A1420",
    primary: "#F6EFE6",
    muted: "#D2C4C9",
    amber: "#F0A56A",
    pill: "#F4ECE2",
    pillText: "#16141C",
    glassFill: "rgba(255,255,255,0.09)",
    glassEdge: "rgba(255,255,255,0.20)",
    glassHighlight: "rgba(255,255,255,0.14)",
  },
  morning: {
    ground: "#1B2240",
    primary: "#F6F2EA",
    muted: "#E2DDE7",
    amber: "#E9A45B",
    pill: "#EFE9DF",
    pillText: "#16141C",
    glassFill: "rgba(255,255,255,0.10)",
    glassEdge: "rgba(255,255,255,0.22)",
    glassHighlight: "rgba(255,255,255,0.14)",
  },
} satisfies Record<string, Palette>;

export type PaletteName = keyof typeof palettes;

// Sans only: Instrument Sans everywhere (user direction; the serif is retired).
export const fonts = {
  sans: "'Instrument Sans', system-ui, sans-serif",
};

// Type scale at 1080x1920.
export const type = {
  hook: { fontFamily: fonts.sans, fontWeight: 600, fontSize: 108, lineHeight: 1.0, letterSpacing: "-0.02em" },
  body: { fontFamily: fonts.sans, fontWeight: 600, fontSize: 84, lineHeight: 1.02, letterSpacing: "-0.02em" },
  quote: { fontFamily: fonts.sans, fontWeight: 400, fontSize: 56, lineHeight: 1.35 },
  label: {
    fontFamily: fonts.sans,
    fontWeight: 500,
    fontSize: 38,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  caption: { fontFamily: fonts.sans, fontWeight: 400, fontSize: 42, lineHeight: 1.4 },
  row: { fontFamily: fonts.sans, fontWeight: 400, fontSize: 44, lineHeight: 1.2 },
  pill: { fontFamily: fonts.sans, fontWeight: 600, fontSize: 48 },
} satisfies Record<string, CSSProperties>;

export const reel = { width: 1080, height: 1920, fps: 30 };

// Platform UI covers these edges. Supers and panels stay inside; 56px is the frame margin.
export const safe = { top: 250, bottom: 420, right: 140, margin: 56 };
export const content = {
  left: safe.margin,
  right: reel.width - safe.right,
  width: reel.width - safe.right - safe.margin,
};

const c4 = (2 * Math.PI) / 3;

// Calm defaults (out, inOut) plus the expressive set from easings.net for the explainer style.
export const ease = {
  out: Easing.bezier(0.22, 1, 0.36, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  outQuart: Easing.bezier(0.25, 1, 0.5, 1),
  outExpo: Easing.bezier(0.16, 1, 0.3, 1),
  inExpo: Easing.bezier(0.7, 0, 0.84, 0),
  outBack: Easing.bezier(0.34, 1.56, 0.64, 1),
  inOutCubic: Easing.bezier(0.65, 0, 0.35, 1),
  inOutQuint: Easing.bezier(0.83, 0, 0.17, 1),
  outElastic: (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1),
  linear: (x: number) => x,
};

// Durations in frames at 30fps.
export const motion = {
  wordReveal: 9, // 300ms, fade up from 12px
  wordStagger: 4,
  superOut: 9, // 300ms, drifts up 8px
  sceneTransition: 15, // 500ms crossfade with blur dip
  punchIn: 12, // 400ms to 106%
  panelIn: 15, // 500ms, rise 40px
  tap: 10, // soft 4% scale-down and back
};

export const sec = (s: number) => Math.round(s * reel.fps);
