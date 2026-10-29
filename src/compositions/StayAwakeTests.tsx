// Two motion tests for StayAwake (Oct 29), after the bed-and-moon preview was rejected ("not enough movement", "I don't
// understand what you're trying to represent"). Same four beats, ~8 s, silent, supers carry the words:
//   hook (moving from frame 1) → "chase it, it slips away" → "effort keeps you alert" → "stay awake a little longer".
// A. The moon on still water: the bed is a dark pool with the moon reflected in it. Moving makes ripples that break the
//    reflection; the more you move, the choppier it gets. Lie still and it pieces itself back together.
// B. The forgotten name: a "Hello, my name is" tag with Sleep half-remembered on it. Chase the letters and they scatter;
//    stop chasing and they drift back and write themselves in.
import { AbsoluteFill, spring, useCurrentFrame } from "remotion";
import type { SpringConfig } from "remotion";
import { fonts, reel, sec } from "../brand/theme";
import { PhotoBackground } from "../components/PhotoBackground";
import { LINE, SurfaceTint, useSurface } from "../components/objects";
import { ROOM_H, ROOM_W, ROOMS_MORPH } from "../components/rooms";
import { P } from "../components/premium";
import { HeadlineIn } from "../templates/motion";
import { BLUR, PHOTO, SATURATION, STAGE, TINT, TOP } from "./StayAwakeBoard";

export const TEST_SECONDS = 8;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
type Pt = [number, number];
const ptLerp = (a: Pt, b: Pt, k: number): Pt => [
  lerp(a[0], b[0], k),
  lerp(a[1], b[1], k),
];
const SP: Partial<SpringConfig> = { damping: 16, stiffness: 70, mass: 1 };
const QUICK: Partial<SpringConfig> = { damping: 15, stiffness: 160, mass: 0.7 };
const SLOW: Partial<SpringConfig> = { damping: 20, stiffness: 30, mass: 1 };
const spf = (
  f: number,
  s: number,
  config: Partial<SpringConfig> = SP,
  delay = 0,
) => spring({ frame: Math.max(0, f - sec(s) - delay), fps: reel.fps, config });
/** A point that springs from one spot to the next at each step. */
const path = (
  f: number,
  start: Pt,
  steps: Array<[number, Pt, Partial<SpringConfig>]>,
): Pt => {
  let p = start;
  for (const [at, to, cfg] of steps) p = ptLerp(p, to, spf(f, at, cfg));
  return p;
};
/** The opening reach: out and back over ~0.8 s, moving from the very first frames. */
const reach = (f: number) => {
  const t = f / reel.fps;
  return t < 0.85 ? Math.sin(Math.PI * Math.pow(t / 0.85, 0.75)) : 0;
};

const B = { chase: 1.5, effort: 3.6, still: 5.6 };
const SUPERS = [
  { at: -3, out: 1.3, text: "Trying hard *to fall asleep?*" },
  { at: B.chase, out: 3.4, text: "Chase it, *it slips away.*" },
  { at: B.effort, out: 5.4, text: "Effort *keeps you alert.*" },
  { at: B.still, text: "*Stay awake a little longer.*" },
];

const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill>
    <PhotoBackground
      photo={PHOTO}
      blur={BLUR}
      calm={0.5}
      saturation={SATURATION}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(170deg, rgba(255,255,255,0.05), rgba(5,6,16,0.3))",
      }}
    />
    {children}
    {SUPERS.map((s) => (
      <HeadlineIn
        key={s.at}
        y={TOP}
        size={100}
        text={s.text}
        at={s.at}
        out={s.out}
        align="center"
      />
    ))}
  </AbsoluteFill>
);

/** The stage window, in room units (640 × 760). */
const Window: React.FC<{
  children: React.ReactNode;
  defs?: React.ReactNode;
}> = ({ children, defs }) => {
  const z = STAGE.w / ROOM_W;
  return (
    <div
      style={{
        position: "absolute",
        left: STAGE.x,
        top: STAGE.y,
        width: STAGE.w,
        height: ROOM_H * z,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 45,
          border: `${LINE}px solid rgba(243,238,230,0.22)`,
          background:
            "linear-gradient(170deg, rgba(255,255,255,0.05), rgba(5,6,16,0.35))",
          boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
        }}
      />
      <svg
        width={STAGE.w}
        height={ROOM_H * z}
        viewBox={`0 0 ${ROOM_W} ${ROOM_H}`}
        style={{
          position: "relative",
          display: "block",
          overflow: "hidden",
          borderRadius: 45,
        }}
      >
        <defs>
          <radialGradient id="tglow">
            <stop offset="0" stopColor="#F3EEE6" stopOpacity={0.45} />
            <stop offset="1" stopColor="#F3EEE6" stopOpacity={0} />
          </radialGradient>
          {defs}
        </defs>
        {children}
      </svg>
    </div>
  );
};

/** You: a soft glow and a dot, with a short trail while moving. */
const You: React.FC<{ p: Pt; lag: Pt; awake?: number }> = ({
  p,
  lag,
  awake = 1,
}) => {
  const speed = Math.hypot(p[0] - lag[0], p[1] - lag[1]);
  const trail = clamp01((speed - 6) / 30);
  return (
    <>
      {trail > 0.01
        ? [0.25, 0.5, 0.75].map((t) => (
            <circle
              key={t}
              cx={lerp(lag[0], p[0], t)}
              cy={lerp(lag[1], p[1], t)}
              r={27 * (0.5 + 0.4 * t)}
              fill={P.ink}
              opacity={trail * 0.35 * t}
            />
          ))
        : null}
      <circle
        cx={p[0]}
        cy={p[1]}
        r={90 + 120 * awake}
        fill="url(#tglow)"
        opacity={0.35 + 0.65 * awake}
      />
      <circle cx={p[0]} cy={p[1]} r={27} fill={P.ink} />
    </>
  );
};

// ─── A. The moon on still water ───────────────────────────────────────────────────────────────────────────────────

// A big bed that fills the stage, so the water reads on a phone: frame, pool where the duvet was, two pillows.
const POOL = { x: 92, y: 192, w: 456, h: 506 };
const REFLECT: Pt = [330, 470];
const PILLOW: Pt = [214, 126];
const BIG_FRAME = [{ x: 70, y: 52, w: 500, h: 668, r: 38, fill: 0.06, rot: 0 }];
const BIG_PILLOWS = [
  { x: 112, y: 80, w: 204, h: 94, r: 34, fill: 0.2, rot: -5 },
  { x: 334, y: 80, w: 196, h: 94, r: 34, fill: 0.2, rot: 0 },
];

const youA = (f: number): Pt => {
  const lunge = ptLerp(PILLOW, REFLECT, 0.2 * reach(f));
  return path(f, lunge, [
    [B.chase, [300, 400], SP],
    [B.chase + 0.9, [280, 600], QUICK],
    [B.effort, [200, 290], QUICK],
    [B.effort + 0.45, [450, 340], QUICK],
    [B.effort + 0.9, [180, 420], QUICK],
    [B.effort + 1.35, [440, 260], QUICK],
    [B.still - 0.3, PILLOW, SP],
  ]);
};

/** Ripples: a ring is dropped every few frames while you move, where you are. Chop is how stirred the water is. */
const ripples = (f: number) => {
  const rings: Array<{ x: number; y: number; age: number; s: number }> = [];
  let chop = 0;
  for (let i = 0; i <= f; i++) {
    const p = youA(i);
    const q = youA(Math.max(0, i - 1));
    const v = Math.hypot(p[0] - q[0], p[1] - q[1]);
    chop = Math.min(1.1, chop * 0.955 + v * 0.0075);
    if (i % 5 === 0 && v > 1.2)
      rings.push({ x: p[0], y: p[1], age: f - i, s: Math.min(1, v / 8) });
  }
  // Once you lie still the water settles for good, so the moon is whole again before the end.
  const settle = clamp01((f / reel.fps - B.still - 0.3) / 1.6);
  return { rings: rings.filter((r) => r.age < 70), chop: clamp01(chop) * (1 - settle * settle * (3 - 2 * settle)) };
};

const MOON = "M27 5 A16 16 0 1 0 35 27 A13 13 0 1 1 27 5 Z";
const STRIPS = 14;

/** The moon's reflection, cut into horizontal strips that the chop pushes sideways and apart. */
const Reflection: React.FC<{ f: number; chop: number }> = ({ f, chop }) => {
  const size = 180;
  const [cx, cy] = REFLECT;
  const top = cy - size / 2;
  const h = size / STRIPS;
  const k = size / 40;
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={size * 1.25}
        fill="url(#tglow)"
        opacity={0.7 * (1 - 0.7 * chop)}
      />
      {Array.from({ length: STRIPS }, (_, i) => {
        const dx =
          Math.sin(i * 1.9 + f * 0.32) * 70 * chop +
          Math.sin(i * 0.7 + f * 0.11) * 4;
        const dy = (i - STRIPS / 2) * 9 * chop;
        return (
          <g
            key={i}
            transform={`translate(${dx} ${dy})`}
            opacity={
              1 - 0.55 * chop * (0.5 + 0.5 * Math.sin(i * 2.3 + f * 0.2))
            }
          >
            <clipPath id={`strip${i}`}>
              <rect
                x={cx - size}
                y={top + i * h}
                width={size * 2}
                height={h + 1.2 - 2.7 * chop}
              />
            </clipPath>
            <g clipPath={`url(#strip${i})`}>
              <g transform={`translate(${cx - size / 2} ${top}) scale(${k})`}>
                <path d={MOON} fill={P.ink} />
              </g>
            </g>
          </g>
        );
      })}
    </g>
  );
};

const TestA: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSurface();
  const p = youA(f);
  const lag = youA(Math.max(0, f - 6));
  const { rings, chop } = ripples(f);
  const t = f / reel.fps;
  const awake = 1 - 0.5 * clamp01((t - B.still - 0.8) / 1.5);
  return (
    <Frame>
      <Window
        defs={
          <>
            <clipPath id="pool">
              <rect
                x={POOL.x}
                y={POOL.y}
                width={POOL.w}
                height={POOL.h}
                rx={30}
              />
            </clipPath>
            <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={s(0.02, 0.55)} />
              <stop offset="1" stopColor={s(0, 0.75)} />
            </linearGradient>
          </>
        }
      >
        {/* Nightstands and the bed frame, the pool where the duvet was, pillows on top. */}
        {BIG_FRAME.map((q, i) => (
          <rect
            key={i}
            x={q.x}
            y={q.y}
            width={q.w}
            height={q.h}
            rx={q.r}
            fill={s(q.fill, 0.28)}
            stroke="rgba(243,238,230,0.62)"
            strokeWidth={LINE}
          />
        ))}
        <rect
          x={POOL.x}
          y={POOL.y}
          width={POOL.w}
          height={POOL.h}
          rx={30}
          fill="url(#water)"
          stroke="rgba(243,238,230,0.35)"
          strokeWidth={2}
        />
        <g clipPath="url(#pool)">
          {/* Faint swell lines across the water: they get wavier with the chop. */}
          {[250, 330, 410, 540, 620].map((y, i) => {
            const a = 3 + 16 * chop;
            const ph = f * 0.18 + i;
            return (
              <path
                key={y}
                d={`M ${POOL.x - 20} ${y} C ${POOL.x + 60} ${y - a * Math.sin(ph)}, ${POOL.x + 160} ${y + a * Math.cos(ph)}, ${POOL.x + 240} ${y} S ${POOL.x + 400} ${y - a * Math.sin(ph + 1)}, ${POOL.x + 480} ${y}`}
                fill="none"
                stroke="rgba(243,238,230,0.12)"
                strokeWidth={2}
              />
            );
          })}
          <Reflection f={f} chop={chop} />
          {rings.map((r, i) => {
            const k = r.age / 70;
            return (
              <circle
                key={i}
                cx={r.x}
                cy={r.y}
                r={20 + 300 * k}
                fill="none"
                stroke="rgba(243,238,230,0.6)"
                strokeWidth={2.5}
                opacity={(1 - k) * r.s}
              />
            );
          })}
        </g>
        {BIG_PILLOWS.map((q, i) => (
          <rect
            key={i}
            x={q.x}
            y={q.y}
            width={q.w}
            height={q.h}
            rx={q.r}
            fill={s(q.fill, 0.28)}
            stroke="rgba(243,238,230,0.62)"
            strokeWidth={LINE}
            transform={`rotate(${q.rot ?? 0} ${q.x + q.w / 2} ${q.y + q.h / 2})`}
          />
        ))}
        <You p={p} lag={lag} awake={awake} />
      </Window>
    </Frame>
  );
};

// ─── B. The forgotten name ───────────────────────────────────────────────────────────────────────────────────────

const LETTERS = ["S", "l", "e", "e", "p"];
const HOME: Pt[] = [
  [214, 446],
  [262, 446],
  [306, 446],
  [368, 446],
  [434, 446],
];
/** Where each letter flees to, three times over (chase, then twice during "effort"). */
const FLEE: Pt[][] = [
  [
    [96, 560],
    [160, 650],
    [470, 610],
    [560, 520],
    [540, 680],
  ],
  [
    [540, 600],
    [90, 520],
    [120, 690],
    [330, 690],
    [560, 470],
  ],
  [
    [110, 640],
    [560, 690],
    [520, 560],
    [90, 560],
    [300, 610],
  ],
];
const YOU_B: Pt = [320, 610];

const youB = (f: number): Pt => {
  const lunge = ptLerp(YOU_B, [320, 520], 0.5 * reach(f));
  return path(f, lunge, [
    [B.chase, [320, 470], SP],
    [B.chase + 0.8, [460, 560], QUICK],
    [B.effort, [140, 560], QUICK],
    [B.effort + 0.6, [500, 640], QUICK],
    [B.effort + 1.2, [200, 620], QUICK],
    [B.still - 0.2, [320, 700], SP],
  ]);
};

const letterAt = (f: number, i: number) => {
  // Half-remembered at the start: faint, wandering near the line, shying away as you reach.
  const wander: Pt = [
    Math.sin(f / 13 + i * 1.7) * 6,
    Math.cos(f / 17 + i) * 6 + 30 * reach(Math.max(0, f - 3 - i)),
  ];
  let p: Pt = [HOME[i][0] + wander[0], HOME[i][1] + wander[1]];
  const d = i * 1.5;
  p = ptLerp(p, FLEE[0][i], spf(f, B.chase + 0.35, QUICK, d));
  p = ptLerp(p, FLEE[1][i], spf(f, B.effort + 0.15, QUICK, d));
  p = ptLerp(p, FLEE[2][i], spf(f, B.effort + 1.0, QUICK, d));
  const back = spf(f, B.still + 0.5, SLOW, i * 7);
  p = ptLerp(p, HOME[i], back);
  const scattered = clamp01(spf(f, B.chase + 0.35, QUICK, d) - back);
  const rot =
    Math.sin(i * 2.1 + 1) * 40 * scattered +
    Math.sin(f / 9 + i) * 8 * scattered;
  const ink =
    lerp(0.14, 0.4, scattered) + (1 - lerp(0.14, 0.4, scattered)) * back;
  return { p, rot, ink, back };
};

const TestB: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSurface();
  const p = youB(f);
  const lag = youB(Math.max(0, f - 6));
  const t = f / reel.fps;
  const awake = 1 - 0.5 * clamp01((t - B.still - 0.4) / 1.2);
  return (
    <Frame>
      <Window>
        {/* The name tag. */}
        <rect
          x={64}
          y={96}
          width={512}
          height={420}
          rx={38}
          fill="rgba(0,0,0,0.3)"
          transform="translate(8 16)"
        />
        <rect
          x={64}
          y={96}
          width={512}
          height={420}
          rx={38}
          fill={s(0.18, 0.12)}
          stroke="rgba(243,238,230,0.65)"
          strokeWidth={LINE}
        />
        <path
          d="M 64 238 L 64 134 Q 64 96 102 96 L 538 96 Q 576 96 576 134 L 576 238 Z"
          fill={s(0.32, 0.05)}
        />
        <line
          x1={64}
          y1={238}
          x2={576}
          y2={238}
          stroke="rgba(243,238,230,0.35)"
          strokeWidth={2}
        />
        <text
          x={320}
          y={178}
          textAnchor="middle"
          fontFamily={fonts.sans}
          fontWeight={700}
          fontSize={78}
          letterSpacing="0.02em"
          fill={P.ink}
        >
          HELLO
        </text>
        <text
          x={320}
          y={220}
          textAnchor="middle"
          fontFamily={fonts.sans}
          fontWeight={500}
          fontSize={30}
          fill="rgba(243,238,230,0.7)"
        >
          my name is
        </text>
        {/* The blank line the name should sit on. */}
        <line
          x1={150}
          y1={466}
          x2={490}
          y2={466}
          stroke="rgba(243,238,230,0.4)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray="2 12"
        />
        <You p={p} lag={lag} awake={awake} />
        {/* The letters: on top of everything, fleeing you. */}
        {LETTERS.map((ch, i) => {
          const l = letterAt(f, i);
          return (
            <text
              key={i}
              x={l.p[0]}
              y={l.p[1]}
              textAnchor="middle"
              fontFamily={fonts.sans}
              fontWeight={600}
              fontSize={124}
              letterSpacing="-0.03em"
              fill={P.ink}
              opacity={l.ink}
              transform={`rotate(${l.rot} ${l.p[0]} ${l.p[1] - 40})`}
            >
              {ch}
            </text>
          );
        })}
      </Window>
    </Frame>
  );
};

// Surfaces mix from the photo's tint, so the provider wraps each test from outside.
export const StayAwakeTestA: React.FC = () => (
  <SurfaceTint.Provider value={TINT}>
    <TestA />
  </SurfaceTint.Provider>
);
export const StayAwakeTestB: React.FC = () => (
  <SurfaceTint.Provider value={TINT}>
    <TestB />
  </SurfaceTint.Provider>
);

// ─── C. The pillow (user, Oct 29: "the thing that would represent sleep the most is a pillow, a blanket or your bed") ──
// Your head on the pillow is sleep. It squeezes out from under you, slides off the bed like wet soap and stays one step
// ahead around the room; lie still on the bare bed and it slides back under your head on its own.

const ROOM_C = {
  bed: { x: 80, y: 56, w: 320, h: 450, r: 34 },
  duvet: { x: 80, y: 214, w: 320, h: 292, r: 34 },
  nightstand: { x: 420, y: 66, w: 96, h: 96, r: 22 },
  chair: { x: 420, y: 520, w: 160, h: 160, r: 52 },
  rug: { x: 120, y: 560, w: 240, h: 150, r: 75 },
};
const PILLOW_W = 170;
const PILLOW_H = 92;
const HEAD: Pt = [240, 126];

type Move = [number, Pt, number, Partial<SpringConfig>];
// Where the pillow goes (centre, rotation): out from under you, off the bed, around the room, and back.
const PILLOW_MOVES: Move[] = [
  [0.12, [348, 150], 14, QUICK],
  [B.chase + 0.45, [500, 330], 62, QUICK],
  [B.effort + 0.2, [230, 640], -24, QUICK],
  [B.effort + 0.85, [560, 410], 80, QUICK],
  [B.effort + 1.5, [460, 214], 20, QUICK],
  [B.still + 0.6, HEAD, 0, SLOW],
];
const pillowAt = (f: number) => {
  let p: Pt = HEAD;
  let rot = 0;
  for (const [at, to, r, cfg] of PILLOW_MOVES) {
    const k = spf(f, at, cfg);
    p = ptLerp(p, to, k);
    rot = lerp(rot, r, k);
  }
  return { p, rot };
};
const youC = (f: number): Pt => {
  const shift = ptLerp(HEAD, [214, 150], reach(f));
  // Always a step behind: each time you get close, the pillow is already sliding off.
  return path(f, shift, [
    [B.chase, [282, 168], SP],
    [B.chase + 0.9, [374, 262], SP],
    [B.effort, [330, 520], QUICK],
    [B.effort + 0.65, [420, 520], QUICK],
    [B.effort + 1.3, [470, 480], QUICK],
    [B.still - 0.2, HEAD, SP],
  ]);
};

/** The pillow, squeezed along its direction of travel like soap slipping out of a hand. */
const SlipPillow: React.FC<{ p: Pt; lag: Pt; rot: number; o?: number }> = ({ p, lag, rot, o = 1 }) => {
  const s = useSurface();
  const vx = p[0] - lag[0];
  const vy = p[1] - lag[1];
  const v = Math.hypot(vx, vy);
  const squeeze = Math.min(0.28, v / 220);
  const dir = (Math.atan2(vy, vx) * 180) / Math.PI;
  return (
    <g opacity={o} transform={`translate(${p[0]} ${p[1]}) rotate(${dir}) scale(${1 + squeeze} ${1 - squeeze * 0.6}) rotate(${-dir}) rotate(${rot})`}>
      <rect x={-PILLOW_W / 2 + 6} y={-PILLOW_H / 2 + 12} width={PILLOW_W} height={PILLOW_H} rx={34} fill="rgba(0,0,0,0.3)" />
      <rect x={-PILLOW_W / 2} y={-PILLOW_H / 2} width={PILLOW_W} height={PILLOW_H} rx={34} fill={s(0.3, 0.12)} stroke="rgba(243,238,230,0.85)" strokeWidth={LINE} />
      {/* The seam down the middle: what makes a soft rectangle read as a pillow from above. */}
      <path d={`M ${-PILLOW_W / 2 + 26} 0 Q 0 ${-6} ${PILLOW_W / 2 - 26} 0`} fill="none" stroke="rgba(243,238,230,0.35)" strokeWidth={2.5} strokeLinecap="round" />
    </g>
  );
};

const TestC: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSurface();
  const t = f / reel.fps;
  const you = youC(f);
  const lagYou = youC(Math.max(0, f - 6));
  const pl = pillowAt(f);
  const lagPl = pillowAt(Math.max(0, f - 3));
  const trail = [pillowAt(Math.max(0, f - 4)), pillowAt(Math.max(0, f - 8))];
  const speed = Math.hypot(pl.p[0] - trail[1].p[0], pl.p[1] - trail[1].p[1]);
  // Lie still: the room goes dark around you; once the pillow is back under your head, your glow fades: asleep.
  const dark = clamp01((t - B.still) / 0.8);
  const asleep = clamp01((t - B.still - 1.6) / 1.0);
  const R = ROOM_C;
  const piece = (q: { x: number; y: number; w: number; h: number; r: number }, fill: number, line: number) => (
    <rect x={q.x} y={q.y} width={q.w} height={q.h} rx={q.r} fill={s(fill, 0.28)} stroke={`rgba(243,238,230,${line})`} strokeWidth={LINE} />
  );
  return (
    <Frame>
      <Window>
        <g opacity={1 - 0.35 * dark}>
          {piece(R.rug, 0.02, 0.18)}
          {piece(R.nightstand, 0.05, 0.28)}
          {piece(R.chair, 0.07, 0.28)}
          <rect x={R.chair.x + 30} y={R.chair.y + 30} width={100} height={100} rx={34} fill={s(0.12, 0.2)} stroke="rgba(243,238,230,0.28)" strokeWidth={LINE} />
          {piece(R.bed, 0.06, 0.62)}
          {piece(R.duvet, 0.14, 0.62)}
        </g>
        {/* A faint trail behind the pillow while it slips away. */}
        {speed > 10
          ? trail.map((q, i) => <SlipPillow key={i} p={q.p} lag={q.p} rot={q.rot} o={clamp01((speed - 10) / 40) * (0.22 - i * 0.1)} />)
          : null}
        <SlipPillow p={pl.p} lag={lagPl.p} rot={pl.rot} />
        <You p={you} lag={lagYou} awake={1 - 0.6 * asleep} />
      </Window>
    </Frame>
  );
};

export const StayAwakeTestC: React.FC = () => (
  <SurfaceTint.Provider value={TINT}>
    <TestC />
  </SurfaceTint.Provider>
);
