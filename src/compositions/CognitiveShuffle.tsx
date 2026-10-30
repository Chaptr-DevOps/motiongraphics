// "Your mind won't switch off? Give it a word game" (cognitive shuffling). Script: docs/cognitive-shuffle.md.
// VO: public/audio/cognitive-shuffle-vo.mp3. Direction B (user, Oct 30): letter tiles on the duvet, in the still bedroom.
// Worry notes pile over you; five tiles slide out of the nightstand and shuffle. Take the tiles away and the notes slide
// into the empty slots (the gap). The tiles come back and flip to spell BREAD; B lifts (the one amber edge) and a
// banana, a bike, a bear pop out of it; then R. Quick, unrelated pictures; a dotted line starting to join two snaps
// (no story). For drifting off the tiles and pictures scatter loosely and the room dims. The tiles re-spell QUIZ on a
// card that grows under them; it slides back into the nightstand as the first worry drops in again (frame 0).
import { useId } from "react";
import { AbsoluteFill, Audio, spring, staticFile, useCurrentFrame } from "remotion";
import type { SpringConfig } from "remotion";
import { photos } from "../brand/photos";
import { ease, fonts, reel, sec } from "../brand/theme";
import { PhotoBackground } from "../components/PhotoBackground";
import { Doodle, LetterTile, LINE, SurfaceTint, useSurface } from "../components/objects";
import type { Thing } from "../components/objects";
import { P } from "../components/premium";
import { progress } from "../lib/animation";
import { HeadlineIn } from "../templates/motion";

// The seeded pick (car horizon) came out flat grey with a black floor; deep blue sky over trees instead.
export const PHOTO = photos.starsTreeline;
export const TINT = PHOTO.tint;

// The last word ends at ~31.3 s.
export const COGNITIVE_SHUFFLE_SECONDS = 31.5;

// VO cues (seconds), from the pauses in the voiceover.
const T = {
  empty: 1.86, // "Don't empty it."
  game: 2.97, // "Give it a word game."
  called: 4.24, // "It's called cognitive shuffling."
  nothing: 6.43, // "Trying to think of nothing leaves a gap,"
  fill: 8.69, // "and worries fill it."
  pick: 10.23, // "Pick a word,"
  bread: 11.63, // "like 'bread.'"
  forB: 12.45, // "For B,"
  picture: 13.27, // "picture random things:"
  banana: 14.84, // "a banana,"
  bike: 15.66, // "a bike,"
  bear: 16.5, // "a bear."
  runOut: 17.42, // "When you run out,"
  moveR: 18.34, // "move to R."
  quick: 19.62, // "Keep them quick and unrelated,"
  story: 21.43, // "so nothing becomes a story."
  jumbled: 23.41, // "It's meant to copy the jumbled pictures your brain makes as you drift off."
  quiz: 27.33, // "Find your sleep type with the sleep quiz in our bio,"
  nights: 30.29, // "for nights when…"
};

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const prog = (f: number, s: number, frames: number) => progress(f, sec(s), frames, ease.out);
const SP: Partial<SpringConfig> = { damping: 16, stiffness: 70, mass: 1 };
const SLOW: Partial<SpringConfig> = { damping: 18, stiffness: 40, mass: 1 };
const GLIDE: Partial<SpringConfig> = { damping: 20, stiffness: 24, mass: 1 };
const QUICK: Partial<SpringConfig> = { damping: 15, stiffness: 160, mass: 0.7 };
const spf = (f: number, s: number, config: Partial<SpringConfig> = SP, delay = 0) =>
  spring({ frame: Math.max(0, f - sec(s) - delay), fps: reel.fps, config });
type Step = [number, number, Partial<SpringConfig>?, number?];
/** A value that springs to each new target in turn: [seconds, target, spring, delay in frames]. */
const track = (f: number, start: number, steps: Step[]) => {
  let v = start;
  for (const [at, to, cfg, delay] of steps) v = lerp(v, to, spf(f, at, cfg ?? SP, delay ?? 0));
  return v;
};

// ─── The room (room units: 640 × 760) ───────────────────────────────────────────────────────────────────────────────
const W = 640;
const H = 760;
export const WIN = { x: 180, y: 640, w: 720, h: (H * 720) / W };
const WIN_UP = 300;
export const TOP = 360;
const BOTTOM = 1210;

const R = {
  head: [229, 132] as [number, number],
  bed: { x: 64, y: 52, w: 330, h: 500, r: 36 },
  duvet: { x: 64, y: 222, w: 330, h: 330, r: 36 },
  pillow: { x: 134, y: 84, w: 190, h: 96, r: 36 },
  nightstand: { x: 420, y: 52, w: 156, h: 214, r: 26 },
  chair: { x: 430, y: 540, w: 160, h: 160, r: 54 },
  rug: { x: 90, y: 600, w: 260, h: 120, r: 60 },
};
const INK = (o: number) => `rgba(243,238,230,${o})`;

// The tiles: a row on the duvet below the pillow; they come out of (and go back into) the nightstand.
const WORD = ["B", "R", "E", "A", "D"];
const QUIZ_WORD = ["Q", "U", "I", "Z", ""];
const Z = 66;
const slotX = (i: number) => 229 + (i - 2) * 70;
const SLOT_Y = 280;
const DRAWER: [number, number] = [498, 190];
// While face down they shuffle: [time, tile a, tile b] swap places in small arcs.
const SWAPS: Array<[number, number, number]> = [
  [T.called + 0.1, 0, 3],
  [T.called + 0.65, 1, 4],
  [T.called + 1.2, 2, 0],
];
const SCATTER: Array<[number, number, number]> = [
  [120, 420, -18],
  [300, 360, 12],
  [215, 520, 25],
  [350, 640, -9],
  [130, 650, 8],
];
const quizX = (i: number) => 320 + (i - 1.5) * 80;
const QUIZ_Y = 230;

type TileState = { x: number; y: number; rot: number; o: number; flip: number; lift: number; amber: number; ch: string };

const tileAt = (f: number, i: number): TileState => {
  const t = f / reel.fps;
  const d = i * 3.5;
  // Where it sits in the row: its own slot, except while shuffled face down.
  let slot = i;
  const slotSteps: Step[] = [];
  let order = [0, 1, 2, 3, 4];
  for (const [at, a, b] of SWAPS) {
    order = order.map((v) => (v === a ? b : v === b ? a : v));
    slotSteps.push([at, order[i], SP]);
  }
  slotSteps.push([T.pick, i, SP, d]);
  slot = track(f, i, slotSteps);
  // The swap arc: the tile moving right goes up, the one moving left goes down, so they pass.
  let arc = 0;
  let before = [0, 1, 2, 3, 4];
  for (const [at, a, b] of SWAPS) {
    const after = before.map((v) => (v === a ? b : v === b ? a : v));
    if (before[i] !== after[i]) {
      const k = clamp01(spf(f, at, SP));
      arc += Math.sin(Math.PI * k) * (after[i] > before[i] ? -44 : 44);
    }
    before = after;
  }
  // In the room (1) or in the nightstand (0).
  const inRoom = track(f, 0, [
    [T.game + 0.05, 1, SP, d],
    [T.nothing + 0.25, 0, SP, d],
    [T.pick, 1, SP, d],
    [T.nights + 0.15, 0, SP, d],
  ]);
  const rowX = slotX(slot);
  const rowY = SLOT_Y + arc;
  let x = lerp(DRAWER[0], rowX, inRoom);
  let y = lerp(DRAWER[1], rowY, inRoom);
  let rot = lerp(14, 0, inRoom);
  // Drifting off: the tiles loosen and scatter over the bed; then they gather into a row on the quiz card.
  const scatter = clamp01(spf(f, T.jumbled + 0.2, GLIDE, d * 2) - spf(f, T.quiz, SP, d));
  const gather = clamp01(spf(f, T.quiz, SP, d) - spf(f, T.nights + 0.15, SP, d));
  const [sx, sy, sr] = SCATTER[i];
  x = lerp(lerp(x, sx, scatter), i < 4 ? quizX(i) : DRAWER[0], gather);
  y = lerp(lerp(y, sy, scatter), i < 4 ? QUIZ_Y : DRAWER[1], gather);
  rot = lerp(rot + sr * scatter, 0, gather);
  // Face up from "bread" to the quiz; on the quiz they flip over once and come back up as QUIZ.
  const up = spf(f, T.bread, SP, d) - spf(f, T.nights, SP, d);
  const reflip = clamp01(spf(f, T.quiz + 0.35, SP, d));
  const flip = t > T.quiz + 0.35 ? (reflip < 0.5 ? 1 - reflip * 2 : (reflip - 0.5) * 2) * clamp01(up + 0.001) : clamp01(up);
  const ch = t > T.quiz + 0.35 && reflip >= 0.5 ? QUIZ_WORD[i] : WORD[i];
  // B lifts for "For B", R for "move to R"; the lifted one is edged in amber.
  const lift =
    i === 0
      ? clamp01(spf(f, T.forB, SP) - spf(f, T.runOut + 0.1, SP))
      : i === 1
        ? clamp01(spf(f, T.moveR, SP) - spf(f, T.jumbled, SP))
        : 0;
  const o = clamp01(inRoom * 1.6) * (i === 4 ? 1 - gather : 1);
  return { x: x - lift * 6, y: y - lift * 62, rot: rot - lift * 8, o, flip, lift, amber: lift, ch };
};

// ─── Worry notes ────────────────────────────────────────────────────────────────────────────────────────────────────
type Spot = [number, number, number];
const WORRIES: Array<{ text: string; at: number; hook: Spot; aside: Spot; fill: Spot }> = [
  { text: "Reply to Sam", at: -1, hook: [110, 214, -4], aside: [340, 590, 7], fill: [74, 226, -5] },
  { text: "Are they mad at me?", at: 0.45, hook: [40, 318, 3], aside: [0, 660, -4], fill: [150, 262, 3] },
  { text: "Rent's due", at: 0.9, hook: [230, 430, -2], aside: [378, 452, -8], fill: [60, 364, -3] },
];

const worryAt = (f: number, i: number) => {
  const t = f / reel.fps;
  const w = WORRIES[i];
  const d = i * 3.5;
  // The first note drops in again on "for nights when…", back where frame 0 has it.
  if (i === 0 && t > T.nights + 0.1) {
    const p = spf(f, T.nights + 0.2, SP);
    return { x: w.hook[0], y: w.hook[1] - 30 * (1 - p), rot: w.hook[2], o: clamp01(p * 1.5), scale: 1 + 0.12 * (1 - p) };
  }
  const p = w.at < 0 ? 1 : spf(f, w.at, SP);
  const aside = spf(f, T.empty + 0.05, SP, d);
  const fill = spf(f, T.fill, SP, d);
  const gone = spf(f, T.pick + 0.15, SP, d);
  const pos = (k: 0 | 1 | 2) => lerp(lerp(lerp(w.hook[k], w.aside[k], aside), w.fill[k], fill), w.fill[k] + (k === 1 ? 520 : k === 0 ? 60 : 10), gone);
  return {
    x: pos(0),
    y: pos(1) - 30 * (1 - p),
    rot: pos(2),
    o: clamp01(p * 1.5) * lerp(lerp(1, 0.5, aside), 1, fill) * (1 - clamp01(gone * 1.3)),
    scale: (1 + 0.12 * (1 - p)) * lerp(lerp(1, 0.85, aside), 1, fill),
  };
};

// ─── The pictures (thoughts: on top of everything) ──────────────────────────────────────────────────────────────────
type Pic = { thing: Thing; at: number; out: number; from: 0 | 1; to: [number, number]; size: number; rot: number; spring?: Partial<SpringConfig> };
const PICS: Pic[] = [
  { thing: "banana", at: T.banana - 0.1, out: T.bike, from: 0, to: [150, 460], size: 170, rot: -6 },
  { thing: "bike", at: T.bike - 0.1, out: T.bear, from: 0, to: [330, 430], size: 170, rot: 5 },
  { thing: "bear", at: T.bear - 0.1, out: T.runOut, from: 0, to: [230, 540], size: 170, rot: -3 },
  { thing: "rabbit", at: T.moveR + 0.45, out: T.quick + 0.15, from: 1, to: [340, 470], size: 160, rot: 4 },
  { thing: "rocket", at: T.quick + 0.15, out: T.quick + 0.7, from: 1, to: [150, 480], size: 150, rot: -5, spring: QUICK },
  { thing: "rain", at: T.quick + 0.7, out: T.story + 0.85, from: 1, to: [410, 540], size: 140, rot: 6, spring: QUICK },
  { thing: "ring", at: T.quick + 1.2, out: T.story + 0.85, from: 1, to: [140, 610], size: 140, rot: -4, spring: QUICK },
];
// "So nothing becomes a story": a dotted line starts joining the last two, snaps, and they drift apart.
const LINK = { draw: T.story + 0.05, snap: T.story + 0.75 };
// "Jumbled pictures": faint, blurred, drifting slowly.
const DRIFT: Array<{ thing: Thing; at: [number, number]; v: [number, number] }> = [
  { thing: "bear", at: [100, 300], v: [6, -4] },
  { thing: "rocket", at: [540, 330], v: [-5, 6] },
  { thing: "banana", at: [480, 560], v: [-7, -3] },
  { thing: "rain", at: [110, 560], v: [5, 5] },
  { thing: "bike", at: [300, 700], v: [-4, -6] },
  { thing: "ring", at: [560, 700], v: [-6, -4] },
  { thing: "rabbit", at: [310, 450], v: [4, 5] },
];

const Thought: React.FC<{ thing: Thing; size: number; o: number }> = ({ thing, size, o }) => {
  const s = useSurface();
  return (
    <g opacity={o}>
      <rect x={-size / 2 + 6} y={-size / 2 + 12} width={size} height={size} rx={size * 0.3} fill="rgba(0,0,0,0.35)" />
      <rect x={-size / 2} y={-size / 2} width={size} height={size} rx={size * 0.3} fill={s(0.24, 0.06)} stroke={INK(0.75)} strokeWidth={LINE} />
      <g transform={`scale(${size / 170})`}>
        <Doodle thing={thing} />
      </g>
    </g>
  );
};

const Worry: React.FC<{ text: string; x: number; y: number; rot: number; o: number; scale: number }> = ({ text, x, y, rot, o, scale }) => {
  const s = useSurface();
  const w = text.length * 19 + 64;
  if (o < 0.01) return null;
  return (
    <g transform={`translate(${x + w / 2} ${y + 46}) rotate(${rot}) scale(${scale}) translate(${-w / 2} -46)`} opacity={o}>
      <rect x={6} y={12} width={w} height={92} rx={22} fill="rgba(0,0,0,0.35)" />
      <rect width={w} height={92} rx={22} fill={s(0.24, 0.06)} stroke={INK(0.75)} strokeWidth={LINE} />
      <text x={32} y={58} fontFamily={fonts.sans} fontWeight={600} fontSize={36} fill={P.ink} letterSpacing="-0.01em">
        {text}
      </text>
    </g>
  );
};

/** The quiz card the tiles sit on (tiles spell QUIZ along its top). */
const QuizCard: React.FC<{ p: number }> = ({ p }) => {
  const s = useSurface();
  if (p < 0.01) return null;
  const cx = 320;
  const cy = 380;
  return (
    <g transform={`translate(${cx} ${cy}) scale(${lerp(0.25, 1, p)}) translate(${-cx} ${-cy})`} opacity={clamp01(p * 1.6)}>
      <rect x={50} y={142} width={540} height={500} rx={34} fill="rgba(0,0,0,0.35)" />
      <rect x={40} y={130} width={540} height={500} rx={34} fill={s(0.22, 0.08)} stroke={INK(0.7)} strokeWidth={LINE} />
      <text fontFamily={fonts.sans} fontWeight={600} fontSize={74} letterSpacing="-0.03em" fill={P.ink} textAnchor="middle">
        <tspan x={310} y={382}>
          Take the
        </tspan>
        <tspan x={310} y={462}>
          sleep quiz
        </tspan>
      </text>
      <line x1={96} y1={516} x2={524} y2={516} stroke={INK(0.25)} strokeWidth={2} />
      <text x={310} y={586} textAnchor="middle" fontFamily={fonts.sans} fontWeight={600} fontSize={46} letterSpacing="-0.02em" fill={P.ink}>
        Link in bio
      </text>
    </g>
  );
};

const Room: React.FC<{ f: number }> = ({ f }) => {
  const s = useSurface();
  const id = `cs${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const t = f / reel.fps;
  // Tossing and turning in the hook, settled by "Don't empty it" (frame 0's pose, for the loop).
  const roll = track(f, 0, [
    [0.1, -60, QUICK],
    [0.8, 55, QUICK],
    [1.45, -34, QUICK],
    [2.1, 0, SP],
  ]);
  const awake = track(f, 1.15, [
    [T.empty, 1, SP],
    [T.game, 0.85, SP],
    [T.called, 0.7, SP],
    [T.fill, 1.2, SP],
    [T.pick + 0.3, 0.85, SP],
    [T.forB, 0.7, SP],
    [T.quick, 0.6, SP],
    [T.jumbled + 0.3, 0.25, GLIDE],
    [T.quiz, 0.4, SP],
    [T.nights + 0.1, 1.15, SP],
  ]);
  const pulse = 1 + 0.06 * Math.sin(f / 5) * clamp01((awake - 0.8) * 3);
  const dark = clamp01(spf(f, T.jumbled + 0.4, GLIDE) - spf(f, T.quiz, SP)) * 0.4;
  const [hx, hy] = R.head;
  const headX = hx + roll;
  const piece = (q: { x: number; y: number; w: number; h: number; r: number }, fill: number, line: number) => (
    <rect x={q.x} y={q.y} width={q.w} height={q.h} rx={q.r} fill={s(fill, 0.28)} stroke={INK(line)} strokeWidth={LINE} />
  );

  const tiles = WORD.map((_, i) => tileAt(f, i));
  // The empty slots: "leaves a gap" until the tiles come back; a lifted tile leaves its own dashed ghost.
  const gap = prog(f, T.nothing + 0.45, 12) * (1 - prog(f, T.pick + 0.35, 10));
  const quizP = clamp01(spf(f, T.quiz + 0.15, SP) - spf(f, T.nights + 0.1, SP));
  const tileFirst = (tile: TileState) => tile.lift < 0.05;

  const drawTile = (tile: TileState, i: number) =>
    tile.o > 0.01 ? (
      <g key={i} transform={`translate(${tile.x} ${tile.y}) rotate(${tile.rot})`} opacity={tile.o}>
        <LetterTile ch={tile.ch} z={Z} flip={tile.flip} lift={tile.lift} amber={tile.amber} />
      </g>
    ) : null;

  return (
    <div style={{ position: "relative", width: WIN.w, height: WIN.h }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 45,
          border: `${LINE}px solid ${INK(0.22)}`,
          background: "linear-gradient(170deg, rgba(255,255,255,0.05), rgba(5,6,16,0.35))",
          boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
        }}
      />
      <svg width={WIN.w} height={WIN.h} viewBox={`0 0 ${W} ${H}`} style={{ position: "relative", display: "block", overflow: "hidden", borderRadius: 45 }}>
        <defs>
          <radialGradient id={`${id}glow`}>
            <stop offset="0" stopColor="#F3EEE6" stopOpacity={0.45} />
            <stop offset="1" stopColor="#F3EEE6" stopOpacity={0} />
          </radialGradient>
          <filter id={`${id}soft`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={2.4} />
          </filter>
        </defs>
        <g opacity={1 - dark}>
          {piece(R.rug, 0.02, 0.18)}
          {piece(R.chair, 0.07, 0.28)}
          <rect x={R.chair.x + 30} y={R.chair.y + 30} width={100} height={100} rx={34} fill={s(0.12, 0.2)} stroke={INK(0.28)} strokeWidth={LINE} />
          {piece(R.bed, 0.06, 0.5)}
          {piece(R.duvet, 0.14, 0.5)}
          <rect x={R.pillow.x + roll * 0.4} y={R.pillow.y} width={R.pillow.w} height={R.pillow.h} rx={R.pillow.r} fill={s(0.3, 0.12)} stroke={INK(0.7)} strokeWidth={LINE} transform={`rotate(${roll * 0.06} ${hx} ${hy})`} />
        </g>
        {/* You: a soft glow and a dot on the pillow. */}
        <circle cx={headX} cy={hy} r={(90 + 120 * awake) * pulse} fill={`url(#${id}glow)`} opacity={Math.min(1, 0.35 + 0.65 * awake)} />
        <circle cx={headX} cy={hy} r={27} fill={P.ink} />
        {/* Empty slots, and the ghost left by a lifted tile. */}
        {WORD.map((_, i) => {
          const o = Math.max(gap, tiles[i].lift);
          return o > 0.01 ? (
            <rect key={i} x={slotX(i) - Z / 2} y={SLOT_Y - Z / 2} width={Z} height={Z} rx={Z * 0.24} fill="none" stroke={INK(0.5)} strokeWidth={LINE} strokeDasharray="2 10" strokeLinecap="round" opacity={o} />
          ) : null;
        })}
        <g opacity={1 - dark}>{piece(R.nightstand, 0.05, 0.3)}</g>
        <QuizCard p={quizP} />
        {tiles.map((tile, i) => (tileFirst(tile) ? drawTile(tile, i) : null))}
        {tiles.map((tile, i) => (!tileFirst(tile) ? drawTile(tile, i) : null))}
        {/* Thoughts sit on top of everything. */}
        {WORRIES.map((w, i) => (
          <Worry key={i} text={w.text} {...worryAt(f, i)} />
        ))}
        {DRIFT.map((d, i) => {
          const o = 0.45 * prog(f, T.jumbled + 0.5 + i * 0.25, 20) * (1 - prog(f, T.quiz - 0.3, 14));
          if (o < 0.01) return null;
          const k = t - T.jumbled;
          return (
            <g key={i} transform={`translate(${d.at[0] + d.v[0] * k} ${d.at[1] + d.v[1] * k}) rotate(${(i * 23) % 30 - 15 + k * 2})`} opacity={o} filter={`url(#${id}soft)`}>
              <g transform="scale(0.8)">
                <Doodle thing={d.thing} />
              </g>
            </g>
          );
        })}
        {(() => {
          const a = PICS[5];
          const b = PICS[6];
          const draw = prog(f, LINK.draw, 14);
          const snap = spf(f, LINK.snap, QUICK);
          const apart = spf(f, LINK.snap, SLOW);
          const ax = a.to[0] + 60 * apart;
          const ay = a.to[1] - 20 * apart;
          const bx = b.to[0] - 60 * apart;
          const by = b.to[1] + 20 * apart;
          if (t < LINK.draw || t > a.out + 0.6) return null;
          // Before the snap: one dotted line growing from the ring to the rain; after: two halves pulling back.
          const mx = (ax + bx) / 2;
          const my = (ay + by) / 2 - 40;
          const half = (1 - snap) * 0.5;
          const o = 1 - prog(f, a.out, 10);
          return (
            <g opacity={o} fill="none" stroke={INK(0.65)} strokeWidth={3} strokeDasharray="2 12" strokeLinecap="round">
              {t < LINK.snap ? (
                <path d={`M ${bx} ${by} Q ${mx} ${my} ${lerp(bx, ax, draw)} ${lerp(by, ay, draw)}`} />
              ) : (
                <>
                  <path d={`M ${bx} ${by} L ${lerp(bx, mx, half)} ${lerp(by, my, half)}`} />
                  <path d={`M ${ax} ${ay} L ${lerp(ax, mx, half)} ${lerp(ay, my, half)}`} />
                </>
              )}
            </g>
          );
        })()}
        {PICS.map((pic, i) => {
          const pop = spf(f, pic.at, pic.spring ?? SP);
          const fade = prog(f, pic.out, pic.spring ? 6 : 10);
          const o = clamp01(pop * 2) * (1 - fade);
          if (t < pic.at || o < 0.01) return null;
          const src = tiles[pic.from];
          const apart = i >= 5 ? spf(f, LINK.snap, SLOW) * (i === 5 ? 1 : -1) : 0;
          const x = lerp(src.x, pic.to[0], pop) + 60 * apart;
          const y = lerp(src.y, pic.to[1], pop) - 20 * apart;
          return (
            <g key={i} transform={`translate(${x} ${y}) rotate(${pic.rot * pop}) scale(${lerp(0.25, 1, pop)})`}>
              <Thought thing={pic.thing} size={pic.size} o={o} />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const StageLayer: React.FC<{ f: number }> = ({ f }) => {
  // For the jumbled pictures the stage glides up so the super can sit below it (once).
  const up = clamp01(spf(f, T.jumbled - 0.1, SP) - spf(f, T.quiz - 0.45, SP));
  return (
    <div style={{ position: "absolute", left: WIN.x, top: lerp(WIN.y, WIN_UP, up) }}>
      <Room f={f} />
    </div>
  );
};

const LOOP_FADE = COGNITIVE_SHUFFLE_SECONDS - 0.32;
export const HOOK = "Your mind *won't switch off?*";
const supers: Array<{ at: number; out: number; y: number; text: string }> = [
  { at: T.empty, out: 2.75, y: TOP, text: "*Don't* empty it." },
  { at: T.game, out: 4.05, y: TOP, text: "Give it *a word game.*" },
  { at: T.called, out: 6.2, y: TOP, text: "It's called *cognitive shuffling.*" },
  { at: T.nothing, out: 10.0, y: TOP, text: "Nothing leaves a gap. *Worries fill it.*" },
  { at: T.pick, out: 12.2, y: TOP, text: "Pick a word, *like BREAD.*" },
  { at: T.forB, out: 17.2, y: TOP, text: "For B: *banana, bike, bear.*" },
  { at: T.runOut, out: 19.4, y: TOP, text: "Then *move to R.*" },
  { at: T.quick, out: 23.1, y: TOP, text: "Quick, unrelated, *so no story.*" },
  { at: T.jumbled + 0.1, out: 26.95, y: BOTTOM, text: "Like *drifting off.*" },
];

export const CognitiveShuffle: React.FC = () => {
  const f = useCurrentFrame();
  const loop = prog(f, LOOP_FADE, 9);
  return (
    <SurfaceTint.Provider value={TINT}>
      <AbsoluteFill>
        <PhotoBackground photo={PHOTO} blur={44} calm={0.5} saturation={0.7} />
        <AbsoluteFill style={{ background: "linear-gradient(170deg, rgba(255,255,255,0.05), rgba(5,6,16,0.3))" }} />
        <Audio src={staticFile("audio/cognitive-shuffle-vo.mp3")} />
        <StageLayer f={f} />
        {/* The last frames fade into frame 0. */}
        {loop > 0 ? (
          <AbsoluteFill style={{ opacity: loop }}>
            <StageLayer f={0} />
          </AbsoluteFill>
        ) : null}
        <HeadlineIn y={TOP} size={100} text={HOOK} at={-3} out={1.62} align="center" />
        {supers.map((s) => (
          <HeadlineIn key={s.at} y={s.y} size={100} text={s.text} at={s.at} out={s.out} align="center" />
        ))}
        <div style={{ opacity: 1 - loop }}>
          <HeadlineIn y={TOP} size={100} text="The *sleep quiz,* in our bio" at={T.quiz} align="center" />
        </div>
        <div style={{ opacity: loop }}>
          <HeadlineIn y={TOP} size={100} text={HOOK} at={-3} align="center" />
        </div>
      </AbsoluteFill>
    </SurfaceTint.Provider>
  );
};
