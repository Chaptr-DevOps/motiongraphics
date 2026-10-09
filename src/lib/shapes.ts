// Organic geometry: smooth curves through points, wobbling blobs, liquid pills. No hard corners.
import { noise2D } from "@remotion/noise";

export type Pt = [number, number];

/** Catmull-Rom spline through points, as cubic Béziers. */
export const smoothPath = (pts: Pt[], closed = false): string => {
  const n = pts.length;
  if (n < 2) return "";
  const get = (i: number) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  const f = (v: number) => v.toFixed(1);
  let d = `M ${f(pts[0][0])} ${f(pts[0][1])}`;
  const segments = closed ? n : n - 1;
  for (let i = 0; i < segments; i++) {
    const p0 = get(i - 1);
    const p1 = get(i);
    const p2 = get(i + 1);
    const p3 = get(i + 2);
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return closed ? `${d} Z` : d;
};

/** A closed blob whose edge breathes with noise. `t` advances the wobble; `wobble` is a fraction of the radius. */
export const blobPath = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  seed: string,
  t: number,
  wobble = 0.08,
  points = 12,
): string => {
  const pts: Pt[] = [];
  for (let k = 0; k < points; k++) {
    const a = (k / points) * Math.PI * 2;
    const n = noise2D(seed, Math.cos(a) * 0.9 + t, Math.sin(a) * 0.9 - t * 0.7);
    const s = 1 + n * wobble;
    pts.push([cx + Math.cos(a) * rx * s, cy + Math.sin(a) * ry * s]);
  }
  return smoothPath(pts, true);
};

/** A pill (fully rounded ends) whose top surface ripples like liquid. */
export const liquidPill = (x: number, y: number, w: number, h: number, seed: string, t: number, amp = 6): string => {
  const r = h / 2;
  if (w <= h) return blobPath(x + w / 2, y + r, w / 2, r, seed, t, 0.05, 10);
  const pts: Pt[] = [];
  const steps = Math.max(2, Math.round((w - h) / 40));
  for (let k = 0; k <= steps; k++) {
    const px = x + r + ((w - h) * k) / steps;
    pts.push([px, y + noise2D(seed, px * 0.01, t) * amp]);
  }
  for (let k = 1; k < 5; k++) {
    const a = -Math.PI / 2 + (k / 5) * Math.PI;
    pts.push([x + w - r + Math.cos(a) * r, y + r + Math.sin(a) * r]);
  }
  for (let k = steps; k >= 0; k--) {
    pts.push([x + r + ((w - h) * k) / steps, y + h]);
  }
  for (let k = 1; k < 5; k++) {
    const a = Math.PI / 2 + (k / 5) * Math.PI;
    pts.push([x + r + Math.cos(a) * r, y + r + Math.sin(a) * r]);
  }
  return smoothPath(pts, true);
};
