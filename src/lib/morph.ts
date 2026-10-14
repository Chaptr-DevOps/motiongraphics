// Morph engine: one hero shape that never leaves the screen and springs from one form into the next.
// Every form is the same N points along a centreline, so any form can blend into any other point by point.
// Crisp by rule: no blur or wobble in the shape itself; the life comes from spring overshoot and per-point stagger.
import { spring } from "remotion";
import type { SpringConfig } from "remotion";
import { ease, reel, sec } from "../brand/theme";
import { progress } from "./animation";
import type { Pt } from "./shapes";

export const N = 120;
const TAU = Math.PI * 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const sample = (fn: (u: number) => Pt): Pt[] => Array.from({ length: N }, (_, i) => fn(i / (N - 1)));

/** A dot is a line too short to see; the round stroke caps make it a circle of diameter `look.width`. */
export const dot = (cx: number, cy: number): Pt[] => sample((u) => [cx + (u - 0.5) * 0.6, cy]);

export const line = (x0: number, y0: number, x1: number, y1: number): Pt[] => sample((u) => [lerp(x0, x1, u), lerp(y0, y1, u)]);

/** Sine wave pinned softly at both ends. Advance `phase` to make it travel. */
export const wave = (x0: number, x1: number, y: number, amp: number, cycles: number, phase = 0): Pt[] =>
  sample((u) => [lerp(x0, x1, u), y + Math.sin(u * cycles * TAU + phase) * amp * Math.sin(Math.PI * u) ** 0.6]);

/** Circle outline whose two ends meet at the bottom, so a line curls up into it. */
export const ring = (cx: number, cy: number, r: number): Pt[] =>
  sample((u) => [cx + Math.cos(Math.PI / 2 + u * TAU) * r, cy + Math.sin(Math.PI / 2 + u * TAU) * r]);

/** Rotates (and if needed reverses) a closed outline so its points line up with `ref` and the morph does not twist. */
const alignClosed = (ref: Pt[], pts: Pt[]): Pt[] => {
  const m = pts.length;
  let best: Pt[] = pts;
  let bestCost = Infinity;
  for (const candidate of [pts, [...pts].reverse()]) {
    for (let shift = 0; shift < m; shift++) {
      let cost = 0;
      for (let k = 0; k < m; k++) {
        const p = candidate[(k + shift) % m];
        cost += (p[0] - ref[k][0]) ** 2 + (p[1] - ref[k][1]) ** 2;
      }
      if (cost < bestCost) {
        bestCost = cost;
        best = candidate.map((_, k) => candidate[(k + shift) % m]);
      }
    }
  }
  return best;
};

/** Crescent moon outline (a disc with a bite out of the upper right), point-matched to `ring(cx, cy, R)`. */
export const crescent = (cx: number, cy: number, R: number): Pt[] => {
  const off: Pt = [R * 0.43, -R * 0.26];
  const r2 = R * 0.95;
  const D = Math.hypot(off[0], off[1]);
  const phi = Math.atan2(off[1], off[0]);
  const a = (R * R - r2 * r2 + D * D) / (2 * D);
  const beta = Math.acos(a / R);
  const gamma = Math.acos((D - a) / r2);
  const m = N - 1;
  const outerLen = R * (TAU - 2 * beta);
  const innerLen = r2 * 2 * gamma;
  const nOuter = Math.round((m * outerLen) / (outerLen + innerLen));
  const cycle: Pt[] = [];
  for (let k = 0; k < nOuter; k++) {
    const t = phi + beta + (k / nOuter) * (TAU - 2 * beta);
    cycle.push([cx + Math.cos(t) * R, cy + Math.sin(t) * R]);
  }
  for (let k = 0; k < m - nOuter; k++) {
    const t = phi + Math.PI + gamma - (k / (m - nOuter)) * 2 * gamma;
    cycle.push([cx + off[0] + Math.cos(t) * r2, cy + off[1] + Math.sin(t) * r2]);
  }
  const aligned = alignClosed(ring(cx, cy, R).slice(0, m), cycle);
  return [...aligned, aligned[0]];
};

export type Look = {
  /** Stroke thickness. For a dot this is its diameter. */
  width: number;
  /** 0 = outline only, 1 = filled solid. */
  fill: number;
  /** 0 = one continuous stroke, 1 = broken into separate round dots. */
  dots: number;
  /** 0 = ink, 1 = amber. */
  amber: number;
};

export type Stage = {
  /** Second at which the hero starts morphing into this form. */
  at: number;
  /** The form, as a function of the frame so it can keep moving while it holds. */
  shape: (frame: number) => Pt[];
  look: Look;
  spring?: Partial<SpringConfig>;
  /** Extra delay in frames for the point at position `u` (0..1) along the shape. Makes ends whip or a curl travel. */
  stagger?: (u: number) => number;
  /** Switch fill and dots instantly instead of fading. Use when leaving a dot, where the change cannot be seen. */
  snap?: boolean;
};

const SPRING: Partial<SpringConfig> = { damping: 13, stiffness: 120, mass: 0.9 };

export const resolve = (frame: number, stages: Stage[], dotCount = 7) => {
  let i = 0;
  for (let k = 0; k < stages.length; k++) if (frame >= sec(stages[k].at)) i = k;
  const cur = stages[i];
  let pts = cur.shape(frame);
  let look = cur.look;
  if (i > 0) {
    const prev = stages[i - 1];
    const from = prev.shape(frame);
    const local = frame - sec(cur.at);
    const s = (delay: number) => spring({ frame: Math.max(0, local - delay), fps: reel.fps, config: cur.spring ?? SPRING });
    const stagger = cur.stagger ?? (() => 0);
    pts = pts.map((p, k): Pt => {
      const t = s(stagger(k / (N - 1)));
      return [lerp(from[k][0], p[0], t), lerp(from[k][1], p[1], t)];
    });
    const c = cur.snap ? 1 : progress(local, 0, 16, ease.inOutCubic);
    look = {
      width: Math.max(2, lerp(prev.look.width, cur.look.width, s(0))),
      fill: lerp(prev.look.fill, cur.look.fill, c),
      dots: lerp(prev.look.dots, cur.look.dots, c),
      amber: lerp(prev.look.amber, cur.look.amber, c),
    };
  }
  let length = 0;
  for (let k = 1; k < pts.length; k++) length += Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]);
  const d = pts.map((p, k) => `${k === 0 ? "M" : "L"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  // Dots: split the stroke into `dotCount` equal periods and shrink each dash toward zero length; the round caps do the rest.
  const period = length / dotCount;
  const dash = Math.max(0.02, period * (1 - look.dots));
  const dashed = look.dots > 0.001 ? { array: `${dash} ${period - dash}`, offset: -(period - dash) / 2 } : undefined;
  return { d, look, dashed };
};
