// A soft, rounded 2D character with a simple skeletal rig. Poses are keyframed and blended.
import type { EasingFunction } from "remotion";
import { ease } from "../brand/theme";
import { progress, usePalette } from "../lib/animation";
import type { Pt } from "../lib/shapes";

/**
 * Angles in degrees. Limb angles are relative to the torso; 0 = hanging straight down from the joint,
 * +90 = pointing toward +x when upright. `lean`: 0 upright, 90 lying with head to the left, -90 head right.
 */
export type Pose = {
  x: number;
  y: number;
  lean: number;
  head: number;
  armL: [number, number];
  armR: [number, number];
  legL: [number, number];
  legR: [number, number];
  /** 1 open, 0 closed. */
  eyes: number;
  /** 1 faces +x when upright (or the ceiling when lying head-left), -1 the other way. */
  facing: number;
};

export const pose = (p: Partial<Pose>): Pose => ({
  x: 0,
  y: 0,
  lean: 0,
  head: 0,
  armL: [8, 12],
  armR: [-6, 14],
  legL: [4, -2],
  legR: [-4, 2],
  eyes: 1,
  facing: 1,
  ...p,
});

export const dir = (deg: number): Pt => [Math.sin((deg * Math.PI) / 180), Math.cos((deg * Math.PI) / 180)];
export const add = (a: Pt, d: Pt, len: number): Pt => [a[0] + d[0] * len, a[1] + d[1] * len];

export const rig = (p: Pose, s = 1) => {
  const upV = dir(p.lean);
  const up: Pt = [-upV[0], -upV[1]];
  const hip: Pt = [p.x, p.y];
  const shoulder = add(hip, up, 118 * s);
  const hv = dir(p.lean + p.head);
  const headUp: Pt = [-hv[0], -hv[1]];
  const head = add(shoulder, headUp, 64 * s);
  const limb = (from: Pt, [a, b]: [number, number], l1: number, l2: number): [Pt, Pt, Pt] => {
    const joint = add(from, dir(p.lean + a), l1 * s);
    return [from, joint, add(joint, dir(p.lean + a + b), l2 * s)];
  };
  return {
    hip,
    shoulder,
    head,
    headUp,
    armL: limb(shoulder, p.armL, 68, 64),
    armR: limb(shoulder, p.armR, 68, 64),
    legL: limb(hip, p.legL, 84, 80),
    legR: limb(hip, p.legR, 84, 80),
  };
};

const mix = (a: Pose, b: Pose, t: number): Pose => {
  const l = (x: number, y: number) => x + (y - x) * t;
  const pair = (x: [number, number], y: [number, number]): [number, number] => [l(x[0], y[0]), l(x[1], y[1])];
  return {
    x: l(a.x, b.x),
    y: l(a.y, b.y),
    lean: l(a.lean, b.lean),
    head: l(a.head, b.head),
    armL: pair(a.armL, b.armL),
    armR: pair(a.armR, b.armR),
    legL: pair(a.legL, b.legL),
    legR: pair(a.legR, b.legR),
    eyes: l(a.eyes, b.eyes),
    facing: t < 0.5 ? a.facing : b.facing,
  };
};

/** Blend between pose keys [frame, pose, easing-into-this-key]. */
export const posesAt = (frame: number, keys: Array<[number, Pose, EasingFunction?]>): Pose => {
  if (frame <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [f0, p0] = keys[i - 1];
    const [f1, p1, e] = keys[i];
    if (frame <= f1) return mix(p0, p1, progress(frame, f0, f1 - f0, e ?? ease.inOutCubic));
  }
  return keys[keys.length - 1][1];
};

// Rubber-hose limbs: one smooth quadratic that passes through the joint, so elbows and knees never form a corner.
export const hoseLine = (pts: Pt[]) => {
  const f = (v: number) => v.toFixed(1);
  if (pts.length === 2) return `M ${f(pts[0][0])} ${f(pts[0][1])} L ${f(pts[1][0])} ${f(pts[1][1])}`;
  const [a, j, b] = pts;
  const c: Pt = [2 * j[0] - (a[0] + b[0]) / 2, 2 * j[1] - (a[1] + b[1]) / 2];
  return `M ${f(a[0])} ${f(a[1])} Q ${f(c[0])} ${f(c[1])} ${f(b[0])} ${f(b[1])}`;
};

/** Draws the character. Far limbs are dimmer for depth; everything has round caps and joins. */
export const Person: React.FC<{ p: Pose; s?: number; color?: string; parts?: "all" | "body" | "nearArm" }> = ({
  p,
  s = 1,
  color,
  parts = "all",
}) => {
  const palette = usePalette();
  const c = color ?? palette.muted;
  const r = rig(p, s);
  const limb = (pts: Pt[], w: number, o = 1) => (
    <path d={hoseLine(pts)} fill="none" stroke={c} strokeOpacity={o} strokeWidth={w * s} strokeLinecap="round" strokeLinejoin="round" />
  );
  const fwd: Pt = [-r.headUp[1] * p.facing, r.headUp[0] * p.facing];
  const eye: Pt = [r.head[0] + fwd[0] * 20 * s + r.headUp[0] * 6 * s, r.head[1] + fwd[1] * 20 * s + r.headUp[1] * 6 * s];
  const nearArm = limb(r.armR, 24);
  if (parts === "nearArm") return <g>{nearArm}</g>;
  return (
    <g>
      {limb(r.armL, 24, 0.7)}
      {limb(r.legL, 28, 0.7)}
      {limb([r.hip, r.shoulder], 66)}
      {limb(r.legR, 28)}
      <circle cx={r.head[0]} cy={r.head[1]} r={46 * s} fill={c} />
      <path
        d={`M ${r.head[0] + r.headUp[0] * 40 * s} ${r.head[1] + r.headUp[1] * 40 * s} q ${(r.headUp[0] * 22 - fwd[0] * 14) * s} ${(r.headUp[1] * 22 - fwd[1] * 14) * s} ${(-fwd[0] * 30 + r.headUp[0] * 4) * s} ${(-fwd[1] * 30 + r.headUp[1] * 4) * s}`}
        fill="none"
        stroke={c}
        strokeWidth={12 * s}
        strokeLinecap="round"
      />
      <ellipse cx={eye[0]} cy={eye[1]} rx={5.5 * s} ry={Math.max(1.6, 6 * p.eyes) * s} fill={palette.ground} />
      {parts === "all" ? nearArm : null}
    </g>
  );
};

/** A tiny crowd figure: head and a capsule body. */
export const Mini: React.FC<{ x: number; y: number; s?: number; color: string; opacity?: number; sway?: number }> = ({
  x,
  y,
  s = 1,
  color,
  opacity = 1,
  sway = 0,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${sway}) scale(${s})`} opacity={opacity}>
    <path d="M 0 -6 L 0 16" stroke={color} strokeWidth={20} strokeLinecap="round" />
    <circle cx={0} cy={-26} r={11} fill={color} />
  </g>
);

/** Dream bubbles drifting up and away from a sleeper. `t` in frames since sleep began. */
export const Dream: React.FC<{ x: number; y: number; t: number; color: string; intensity?: number }> = ({
  x,
  y,
  t,
  color,
  intensity = 1,
}) => (
  <g>
    {[0, 1, 2].map((i) => {
      const cycle = 54;
      const local = (t - i * 18) % cycle;
      if (t - i * 18 < 0) return null;
      const u = local / cycle;
      return (
        <circle
          key={i}
          cx={x + u * 40 + Math.sin(u * 6) * 8}
          cy={y - u * 120}
          r={6 + u * 14}
          fill="none"
          stroke={color}
          strokeWidth={3}
          opacity={Math.sin(u * Math.PI) * 0.7 * intensity}
        />
      );
    })}
  </g>
);
