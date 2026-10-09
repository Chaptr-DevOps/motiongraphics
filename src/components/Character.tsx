// The NightShift character: flat, crisp, outlined, teal pajamas and a ponytail (docs/reference/character-model-sheet.png).
// A poseable rig built from vector parts. Poses use the same `Pose` type and `posesAt` blending as Person.tsx.
import { add, dir, hoseLine } from "./Person";
import type { Pose } from "./Person";
import type { Pt } from "../lib/shapes";

export type Look = { skin: string; hair: string; pajamas: string; pajamasShade: string; slippers: string; ink: string };

export const HERO: Look = {
  skin: "#F3EEE6",
  hair: "#141218",
  pajamas: "#0B9398",
  pajamasShade: "#087A7F",
  slippers: "#0B9398",
  ink: "#0A0A10",
};

const INK_W = 4;

export const charRig = (p: Pose, s = 1) => {
  const upV = dir(p.lean);
  const up: Pt = [-upV[0], -upV[1]];
  const hip: Pt = [p.x, p.y];
  const shoulder = add(hip, up, 118 * s);
  const hv = dir(p.lean + p.head);
  const headUp: Pt = [-hv[0], -hv[1]];
  const head = add(shoulder, headUp, 74 * s);
  const limb = (from: Pt, [a, b]: [number, number], l1: number, l2: number): [Pt, Pt, Pt] => {
    const joint = add(from, dir(p.lean + a), l1 * s);
    return [from, joint, add(joint, dir(p.lean + a + b), l2 * s)];
  };
  // Body's local +x axis (the side she faces when upright). Arms attach at the shoulder edges, legs at the hips.
  const side: Pt = [Math.cos((p.lean * Math.PI) / 180), -Math.sin((p.lean * Math.PI) / 180)];
  const shoulderTop = add(shoulder, dir(p.lean), 12 * s);
  const hipBase = add(hip, dir(p.lean), -4 * s);
  return {
    hip,
    shoulder,
    head,
    armL: limb(add(shoulderTop, side, -34 * s), p.armL, 76, 70),
    armR: limb(add(shoulderTop, side, 34 * s), p.armR, 76, 70),
    legL: limb(add(hipBase, side, -16 * s), p.legL, 120, 114),
    legR: limb(add(hipBase, side, 16 * s), p.legR, 120, 114),
  };
};

/** An outlined tube: ink stroke underneath, fill stroke on top. Reads as a sleeve or trouser leg. */
const Tube: React.FC<{ pts: Pt[]; w: number; fill: string; ink: string }> = ({ pts, w, fill, ink }) => (
  <g fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d={hoseLine(pts)} stroke={ink} strokeWidth={w + INK_W * 2} />
    <path d={hoseLine(pts)} stroke={fill} strokeWidth={w} />
  </g>
);

const Hand: React.FC<{ at: Pt; s: number; look: Look }> = ({ at, s, look }) => (
  <circle cx={at[0]} cy={at[1]} r={11 * s} fill={look.skin} stroke={look.ink} strokeWidth={INK_W} />
);

const Slipper: React.FC<{ at: Pt; angle: number; s: number; look: Look }> = ({ at, angle, s, look }) => (
  <g transform={`translate(${at[0]} ${at[1]}) rotate(${angle}) scale(${s})`}>
    <path d="M -12 -6 C -12 -14 12 -16 26 -8 C 34 -4 32 8 22 8 L -8 8 C -14 8 -14 2 -12 -6 Z" fill={look.slippers} stroke={look.ink} strokeWidth={INK_W / s} strokeLinejoin="round" />
  </g>
);

/** Head, drawn facing +x in local space: face, ear, hair cap, ponytail (swings), eyes, brows, smile. */
const Head: React.FC<{ look: Look; eyes: number; swing: number; smile: number }> = ({ look, eyes, swing, smile }) => {
  const k = INK_W;
  const open = eyes > 0.35;
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <g transform={`rotate(${swing} -30 -42)`}>
        <path
          d="M -26 -46 C -62 -44 -80 -6 -78 40 C -76 82 -66 118 -50 128 C -40 134 -34 124 -40 110 C -52 80 -54 30 -34 -6 Z"
          fill={look.hair}
          stroke={look.ink}
          strokeWidth={k}
        />
      </g>
      <rect x={-12} y={30} width={26} height={34} rx={8} fill={look.skin} stroke={look.ink} strokeWidth={k} />
      <path
        d="M -36 -4 C -38 -40 -10 -54 14 -50 C 38 -46 48 -24 46 2 C 44 30 28 48 6 48 C -18 48 -34 28 -36 -4 Z"
        fill={look.skin}
        stroke={look.ink}
        strokeWidth={k}
      />
      <ellipse cx={-14} cy={6} rx={8} ry={10} fill={look.skin} stroke={look.ink} strokeWidth={k} />
      <path
        d="M -42 10 C -48 -38 -14 -62 18 -56 C 42 -52 52 -32 48 -12 C 34 -30 14 -34 -2 -26 C -12 -20 -20 -8 -22 8 C -28 18 -40 18 -42 10 Z"
        fill={look.hair}
        stroke={look.ink}
        strokeWidth={k}
      />
      <circle cx={-30} cy={-44} r={7} fill={look.pajamas} stroke={look.ink} strokeWidth={k * 0.75} />
      <g fill="none" stroke={look.ink} strokeWidth={k}>
        <path d="M 12 -14 q 6 -4 12 -1" />
        <path d="M 32 -14 q 5 -3 9 0" />
        {open ? null : (
          <>
            <path d="M 12 2 q 6 5 12 0" />
            <path d="M 32 2 q 4 4 8 0" />
          </>
        )}
        <path d={`M 20 ${24 - smile} q 8 ${4 + smile * 4} 15 0`} />
      </g>
      {open ? (
        <g fill={look.ink}>
          <ellipse cx={18} cy={1} rx={4.5} ry={6.5 * Math.min(1, eyes * 1.4)} />
          <ellipse cx={37} cy={0} rx={4} ry={6 * Math.min(1, eyes * 1.4)} />
        </g>
      ) : null}
    </g>
  );
};

/** Pajama top in local space (upright, hip at origin, shoulders at y = -118): collar, buttons, pocket. */
const Top: React.FC<{ look: Look }> = ({ look }) => (
  <g strokeLinecap="round" strokeLinejoin="round" stroke={look.ink} strokeWidth={INK_W}>
    <path d="M -40 18 C -44 -40 -50 -100 -40 -120 Q 0 -134 42 -120 C 52 -100 46 -40 42 18 Q 0 26 -40 18 Z" fill={look.pajamas} />
    <path d="M -16 -126 Q -20 -108 -6 -100 L 4 -110" fill="none" />
    <path d="M 22 -126 Q 24 -108 12 -100 L 4 -110" fill="none" />
    <path d="M 4 -100 L 4 16" fill="none" />
    <circle cx={10} cy={-80} r={2.5} fill={look.ink} stroke="none" />
    <circle cx={10} cy={-52} r={2.5} fill={look.ink} stroke="none" />
    <circle cx={10} cy={-24} r={2.5} fill={look.ink} stroke="none" />
    <rect x={-32} y={-96} width={22} height={20} rx={5} fill="none" />
  </g>
);

export const Character: React.FC<{
  p: Pose;
  s?: number;
  look?: Look;
  swing?: number;
  smile?: number;
  parts?: "all" | "body" | "nearArm";
}> = ({ p, s = 1, look = HERO, swing = 0, smile = 1, parts = "all" }) => {
  const r = charRig(p, s);
  const footAngle = -p.lean;
  const nearArm = (
    <g>
      <Tube pts={r.armR} w={28 * s} fill={look.pajamas} ink={look.ink} />
      <Hand at={r.armR[2]} s={s} look={look} />
    </g>
  );
  if (parts === "nearArm") return nearArm;
  return (
    <g>
      <Tube pts={r.armL} w={28 * s} fill={look.pajamasShade} ink={look.ink} />
      <Hand at={r.armL[2]} s={s} look={look} />
      <Slipper at={r.legL[2]} angle={footAngle} s={s} look={look} />
      <Tube pts={r.legL} w={36 * s} fill={look.pajamasShade} ink={look.ink} />
      <Slipper at={r.legR[2]} angle={footAngle} s={s} look={look} />
      <Tube pts={r.legR} w={36 * s} fill={look.pajamas} ink={look.ink} />
      <g transform={`translate(${r.hip[0]} ${r.hip[1]}) rotate(${-p.lean}) scale(${s})`}>
        <Top look={look} />
      </g>
      <g transform={`translate(${r.head[0]} ${r.head[1]}) rotate(${-(p.lean + p.head)}) scale(${s * p.facing} ${s})`}>
        <Head look={look} eyes={p.eyes} swing={swing} smile={smile} />
      </g>
      {parts === "all" ? nearArm : null}
    </g>
  );
};
