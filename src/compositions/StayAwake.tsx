// "Try staying awake" (paradoxical intention). Script: docs/stay-awake.md. VO: public/audio/stay-awake-vo.mp3.
// Third take (Oct 29). The bed-and-moon version was static and unclear; a pillow pass with a follow camera moved too
// much ("nauseous, I'll scroll away"). Agreed: the room stays still, only you and the pillow move.
// Sleep is your pillow. From frame 1 it squirts out from under your head (the dot) and slides round the room: off the
// bed, over the armchair on "slips away", faster for "effort mode"; you follow it one step behind. The study: two weeks
// of tiny rooms, each chase smaller than the last until the last night is still. Then you stop chasing and sit in the
// armchair, the pillow slides back to the bed on its own, and on "lie in the dark" you go back to bed, onto it. The
// bedside table ticks as a clock and your glow fades: asleep. The quiz is a note to self grown from the nightstand.
import {
  AbsoluteFill,
  Audio,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";
import type { EasingFunction, SpringConfig } from "remotion";
import { ease, reel, sec } from "../brand/theme";
import { PhotoBackground } from "../components/PhotoBackground";
import { SurfaceTint } from "../components/objects";
import type { PillowState } from "../components/rooms";
import {
  PILLOW_ROOM,
  PillowRoom,
  ROOM_H,
  ROOM_W,
  routeAt,
} from "../components/rooms";
import { progress } from "../lib/animation";
import { HeadlineIn } from "../templates/motion";
import { BLUR, BOTTOM, PHOTO, SATURATION, TINT, TOP } from "./StayAwakeBoard";
import { fonts } from "../brand/theme";
import { P } from "../components/premium";

// The last word ends at 33.78 s.
export const STAY_AWAKE_SECONDS = 34.1;

// VO cues (seconds), from the pauses in the voiceover.
const T = {
  instead: 3.22, // "Try staying awake instead."
  name: 5.27, // "It's a real insomnia technique called paradoxical intention."
  forgotten: 9.57, // "Sleep is like a forgotten name:"
  chase: 11.85, // "chase it,"
  slips: 12.66, // "and it slips away."
  effort: 14.13, // "Trying to sleep puts your brain"
  mode: 16.02, // "in effort mode,"
  alert: 16.95, // "and effort keeps you alert."
  study: 18.97, // "In a Glasgow study,"
  weeks: 20.17, // "two weeks of this made people worry less about sleep."
  next: 23.51, // "Next time,"
  dark: 24.32, // "lie in the dark,"
  eyes: 25.46, // "eyes open,"
  tell: 26.34, // "and tell yourself:"
  longer: 27.55, // "stay awake a little longer."
  quiz: 29.83, // "See what's keeping you up"
  bio: 31.5, // "with the sleep quiz in our bio,"
  nights: 32.67, // "for nights when you're…"
};

// The plan the user set (Oct 29): the pillow bounces round the room for the hook; "try staying awake instead" puts you
// back in bed with the lamp on; the chase comes back for "chase it, it slips away"; after the study you're back in bed,
// the lamp goes off on "lie in the dark", and an amber tag says "Stay awake a little longer".
const END = { home: 23.5, homeYou: 23.75 };

type Pt = [number, number];
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const clamp01 = (x: number) => clamp(x, 0, 1);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const ptLerp = (a: Pt, b: Pt, k: number): Pt => [
  lerp(a[0], b[0], k),
  lerp(a[1], b[1], k),
];
const prog = (
  f: number,
  s: number,
  frames: number,
  e: EasingFunction = ease.out,
) => progress(f, sec(s), frames, e);

const SP: Partial<SpringConfig> = { damping: 16, stiffness: 70, mass: 1 };
const SLOW: Partial<SpringConfig> = { damping: 18, stiffness: 40, mass: 1 };
const GLIDE: Partial<SpringConfig> = { damping: 20, stiffness: 24, mass: 1 };
const QUICK: Partial<SpringConfig> = { damping: 15, stiffness: 160, mass: 0.7 };
const spf = (
  f: number,
  s: number,
  config: Partial<SpringConfig> = SP,
  delay = 0,
) => spring({ frame: Math.max(0, f - sec(s) - delay), fps: reel.fps, config });
const track = (
  f: number,
  start: number,
  steps: Array<[number, number, Partial<SpringConfig>]>,
) => {
  let v = start;
  for (const [at, to, cfg] of steps) v = lerp(v, to, spf(f, at, cfg));
  return v;
};
const arc = (a: Pt, b: Pt, k: number, bend: number): Pt => {
  const mx = (a[0] + b[0]) / 2 - (b[1] - a[1]) * bend;
  const my = (a[1] + b[1]) / 2 + (b[0] - a[0]) * bend;
  const u = 1 - k;
  return [
    u * u * a[0] + 2 * u * k * mx + k * k * b[0],
    u * u * a[1] + 2 * u * k * my + k * k * b[1],
  ];
};
const HEAD = PILLOW_ROOM.head;
const FRAMES = sec(STAY_AWAKE_SECONDS) + 1;

// ─── The chase ──────────────────────────────────────────────────────────────────────────────────────────────────────
// The pillow's route (room units, 640 × 760). 0–7: the hook, bouncing quickly to every part of the room and back to the
// bed. 7–29: the chase for "chase it, it slips away" and "effort mode", over the armchair at 12 and 23.
const ROUTE: Pt[] = [
  [226, 126],
  [560, 300],
  [120, 660],
  [570, 690],
  [540, 190],
  [300, 560],
  [380, 250],
  [226, 126],
  [352, 150],
  [372, 250],
  [520, 300],
  [575, 450],
  [507, 611],
  [360, 700],
  [190, 650],
  [95, 560],
  [230, 548],
  [440, 470],
  [590, 330],
  [570, 190],
  [450, 215],
  [430, 360],
  [540, 470],
  [507, 611],
  [330, 700],
  [140, 650],
  [110, 560],
  [300, 540],
  [470, 430],
  [590, 280],
];
const ON_BED = 7;
// How far along the route the pillow is at each time: [seconds, route index], smooth (Hermite) between keys.
const KEYS: Array<[number, number]> = [
  [0, 0],
  [0.08, 0],
  [0.5, 1],
  [0.95, 2],
  [1.4, 3],
  [1.85, 4],
  [2.3, 5],
  [2.75, 6],
  // "Try staying awake instead": back on the bed, and it stays there through "a real insomnia technique".
  [3.5, ON_BED],
  [9.75, ON_BED],
  // "Sleep is like a forgotten name: chase it, and it slips away" (over the armchair on "slips away"), then faster.
  [10.4, 8.2],
  [11.5, 10],
  [T.slips, 12],
  [T.effort, 14.5],
  [15.5, 18],
  [16.9, 22],
  [T.study, 28],
  [19.8, 29],
  [40, 29],
];
const keyed = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 2 && KEYS[i + 1][0] < t) i++;
  const [t0, u0] = KEYS[i];
  const [t1, u1] = KEYS[i + 1];
  const slope = (j: number) =>
    j <= 0 || j >= KEYS.length - 1
      ? 0
      : (KEYS[j + 1][1] - KEYS[j - 1][1]) / (KEYS[j + 1][0] - KEYS[j - 1][0]);
  const h = t1 - t0;
  const s = clamp01((t - t0) / h);
  const m0 = slope(i) * h;
  const m1 = slope(i + 1) * h;
  return (
    (2 * s ** 3 - 3 * s ** 2 + 1) * u0 +
    (s ** 3 - 2 * s ** 2 + s) * m0 +
    (-2 * s ** 3 + 3 * s ** 2) * u1 +
    (s ** 3 - s ** 2) * m1
  );
};
const LAG = 6;
const GAP = 0.55;
const levelAngle = (a: number) => {
  while (a > 90) a -= 180;
  while (a < -90) a += 180;
  return a;
};

/** Everything that depends only on the frame, worked out once: the pillow and you. */
const SIM = (() => {
  const pillow: Pt[] = [];
  const rot: number[] = [];
  const you: Pt[] = [];
  for (let f = 0; f < FRAMES; f++) {
    const t = f / reel.fps;
    const r = routeAt(keyed(t), ROUTE);
    // After the study: the pillow slides home to the bed, and you after it.
    const p = arc(r.p, HEAD, spf(f, END.home, SP), 0.15);
    pillow.push(p);
    rot.push(
      levelAngle(r.angle) *
        clamp01(Math.hypot(p[0] - HEAD[0], p[1] - HEAD[1]) / 80),
    );
    // You: one step behind on the same route (the gap closes when the pillow stops, so you land on it).
    const tl = Math.max(0, f - LAG) / reel.fps;
    const speed = Math.abs(keyed(tl + 0.05) - keyed(tl - 0.05)) / 0.1;
    const ud = Math.max(0, keyed(tl) - GAP * clamp01(speed / 1.5));
    you.push(arc(routeAt(ud, ROUTE).p, HEAD, spf(f, END.homeYou, SP), -0.12));
  }
  return { pillow, rot, you };
})();
const at = <X,>(arr: X[], f: number) =>
  arr[clamp(Math.round(f), 0, arr.length - 1)];

const pillowState = (f: number): PillowState => {
  const p = at(SIM.pillow, f);
  const q = at(SIM.pillow, f - 1);
  return { p, v: [p[0] - q[0], p[1] - q[1]], rot: at(SIM.rot, f) };
};

// ─── The window ─────────────────────────────────────────────────────────────────────────────────────────────────────
// One fixed window showing the whole room; it glides up once, for the study.
const WIN = { x: 178, y: 640, w: 724, h: 860 };
const WIN_UP = 300;
const ZW = WIN.w / ROOM_W; // px per room unit, whole room
const CENTRE: Pt = [ROOM_W / 2, ROOM_H / 2];

// ─── The study ──────────────────────────────────────────────────────────────────────────────────────────────────────
const NIGHTS = 14;
const MINI = 92;
const SPOTS: Pt[] = (() => {
  const h = (ROOM_H * MINI) / ROOM_W;
  const gapX = 10;
  const gapY = 60;
  const top = (WIN.h - (2 * h + gapY)) / 2;
  const left = (WIN.w - (7 * MINI + 6 * gapX)) / 2;
  return Array.from({ length: NIGHTS }, (_, i): Pt => [
    left + (i % 7) * (MINI + gapX),
    top + Math.floor(i / 7) * (h + gapY),
  ]);
})();
const SHRINK = T.study + 0.45;
const POOL = 23.05;
/** Night i: the pillow circles a smaller loop each night, closer to the bed, until on the last night it's still. */
const nightState = (f: number, i: number) => {
  const k = i / (NIGHTS - 1);
  const c = ptLerp([470, 450], HEAD, k);
  const r = 160 * (1 - k);
  const speed = lerp(0.16, 0.06, k);
  const a = f * speed + i * 1.3;
  const pos = (ang: number): Pt => [
    c[0] + r * Math.cos(ang),
    c[1] + 0.8 * r * Math.sin(ang),
  ];
  const p = pos(a);
  const q = pos(a - speed);
  return {
    pillow: {
      p,
      v: [p[0] - q[0], p[1] - q[1]],
      rot: ((a * 180) / Math.PI + 90) * (1 - k),
    } as PillowState,
    you: pos(a - 0.9),
    awake: lerp(1.2, 0.3, k),
  };
};

const SOURCE = "Broomfield & Espie, University of Glasgow, 2003";

const StageLayer: React.FC<{ f: number }> = ({ f }) => {
  const t = f / reel.fps;
  const pillow = pillowState(f);
  const speed = Math.hypot(pillow.v?.[0] ?? 0, pillow.v?.[1] ?? 0);
  const trail =
    speed > 4
      ? [pillowState(f - 6), pillowState(f - 4), pillowState(f - 2)]
      : [];
  const you = at(SIM.you, f);
  const youLag = at(SIM.you, f - 5);

  const awake = track(f, 1, [
    [T.instead, 0.85, SLOW],
    [T.forgotten + 0.2, 1.1, SP],
    [T.effort, 1.3, SP],
    [T.study, 1, SP],
    [T.dark, 0.55, SLOW],
    [T.nights, 1, SP],
  ]);
  // The lamp: appears on the nightstand and clicks on for "try staying awake instead"; off for "lie in the dark".
  const lamp = {
    show: clamp01(spf(f, T.instead + 0.05, QUICK) - spf(f, T.nights, SP)),
    on: clamp01(prog(f, T.instead + 0.6, 5) - prog(f, T.dark + 0.15, 5)),
  };
  const dark =
    prog(f, T.dark + 0.15, 12, ease.inOutCubic) * (1 - prog(f, T.nights, 15));
  // "Stay awake a little longer": the tag on the bed, then your glow fades: asleep.
  const tag = {
    text: "Stay awake a little longer",
    o: clamp01(spf(f, T.longer, SP) - prog(f, T.quiz, 8)),
  };
  const asleep =
    prog(f, T.longer + 1.2, 36, ease.inOutCubic) * (1 - prog(f, T.nights, 12));
  const note = {
    p: clamp01(spf(f, T.quiz + 0.15, SP) - spf(f, T.nights - 0.1, QUICK)),
    tick: prog(f, T.bio, 12),
  };

  // The room stays still (user, Oct 29: a moving camera is nauseating); only you and the pillow move.
  const cam = { zp: ZW, c: CENTRE, rot: 0 };
  // The study: the window glides up, the room shrinks into night 1, the other nights pop in; then they pool back.
  const shrink = clamp01(spf(f, SHRINK, SP) - spf(f, POOL, SP));
  const studyOn = t > SHRINK && t < POOL + 1.5;
  const winY = lerp(
    WIN.y,
    WIN_UP,
    clamp01(spf(f, T.study, SP) - spf(f, POOL, SP)),
  );
  const pool = spf(f, POOL, SP);
  const source = studyOn
    ? prog(f, SHRINK + 0.5, 14) * (1 - prog(f, POOL - 0.2, 8))
    : 0;
  const [sx, sy] = SPOTS[0];

  // The room inside the window: placed by the camera, or shrinking into night 1.
  const roomW = lerp(ROOM_W * cam.zp, MINI, shrink);
  const left = lerp(WIN.w / 2 - cam.c[0] * cam.zp, sx, shrink);
  const top = lerp(WIN.h / 2 - cam.c[1] * cam.zp, sy, shrink);

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: WIN.x,
          top: winY,
          width: WIN.w,
          height: WIN.h,
          borderRadius: 45,
          overflow: "hidden",
          background:
            "linear-gradient(170deg, rgba(255,255,255,0.05), rgba(5,6,16,0.35))",
          boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
        }}
      >
        {studyOn
          ? SPOTS.map(([x, y], i) => {
              if (i === 0) return null;
              const pop = spf(f, SHRINK + 0.3, QUICK, i * 2.5);
              const n = nightState(f, i);
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: lerp(x, sx, pool),
                    top: lerp(y, sy, pool),
                    opacity: clamp01(pop * 1.5) * (1 - clamp01(pool * 1.4)),
                    transform: `scale(${0.6 + 0.4 * pop})`,
                  }}
                >
                  <PillowRoom
                    w={MINI}
                    mini
                    pillow={n.pillow}
                    you={n.you}
                    awake={n.awake}
                    pulse={f + i * 9}
                  />
                </div>
              );
            })
          : null}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `rotate(${cam.rot}deg)`,
            transformOrigin: "50% 50%",
          }}
        >
          <div style={{ position: "absolute", left, top }}>
            <PillowRoom
              w={roomW}
              mini={roomW < 120}
              pillow={pillow}
              trail={shrink < 0.05 ? trail : []}
              you={you}
              youLag={youLag}
              awake={awake}
              pulse={f}
              asleep={asleep}
              dark={dark}
              lamp={lamp}
              tag={tag}
              note={note}
            />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 45,
            border: "3px solid rgba(243,238,230,0.22)",
            pointerEvents: "none",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: WIN_UP + WIN.h + 26,
          left: WIN.x,
          width: WIN.w,
          textAlign: "center",
          fontFamily: fonts.sans,
          fontSize: 28,
          fontWeight: 500,
          color: P.dim,
          opacity: source,
        }}
      >
        {SOURCE}
      </div>
    </>
  );
};

const LOOP_FADE = STAY_AWAKE_SECONDS - 0.3;
const HOOK = "Trying hard *to fall asleep?*";
const supers: Array<{ at: number; out: number; y: number; text: string }> = [
  { at: T.instead, out: 5.0, y: TOP, text: "Try *staying awake instead.*" },
  { at: T.name, out: 9.25, y: TOP, text: "*Paradoxical intention.*" },
  {
    at: T.forgotten,
    out: 11.6,
    y: TOP,
    text: "Sleep is like *a forgotten name.*",
  },
  { at: T.chase, out: 13.85, y: TOP, text: "Chase it, *it slips away.*" },
  {
    at: T.effort,
    out: 16.7,
    y: TOP,
    text: "Trying puts you *in effort mode.*",
  },
  { at: T.alert, out: 18.7, y: TOP, text: "Effort *keeps you alert.*" },
  {
    at: T.study + 0.1,
    out: 22.6,
    y: BOTTOM,
    text: "Two weeks: *less worry about sleep.*",
  },
  {
    at: T.next + 0.1,
    out: 26.1,
    y: TOP,
    text: "Lie in the dark, *eyes open.*",
  },
  {
    at: T.tell + 0.1,
    out: 29.5,
    y: TOP,
    text: "Then *tell yourself:*",
  },
];

export const StayAwake: React.FC = () => {
  const f = useCurrentFrame();
  const loop = prog(f, LOOP_FADE, 9);
  return (
    <SurfaceTint.Provider value={TINT}>
      <AbsoluteFill>
        {/* The pine dusk photo behind frosted, darkened glass, so the room and type stay readable. */}
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
        <Audio src={staticFile("audio/stay-awake-vo.mp3")} />
        <StageLayer f={f} />
        {/* The last frames fade into frame 0 (the camera is already back on your head). */}
        {loop > 0 ? (
          <AbsoluteFill style={{ opacity: loop }}>
            <StageLayer f={0} />
          </AbsoluteFill>
        ) : null}
        <HeadlineIn
          y={TOP}
          size={100}
          text={HOOK}
          at={-3}
          out={2.95}
          align="center"
        />
        {supers.map((s) => (
          <HeadlineIn
            key={s.at}
            y={s.y}
            size={100}
            text={s.text}
            at={s.at}
            out={s.out}
            align="center"
          />
        ))}
        <div style={{ opacity: 1 - loop }}>
          <HeadlineIn
            y={TOP}
            size={100}
            text="See *what's keeping you up.*"
            at={T.quiz}
            align="center"
          />
        </div>
        <div style={{ opacity: loop }}>
          <HeadlineIn y={TOP} size={100} text={HOOK} at={-3} align="center" />
        </div>
      </AbsoluteFill>
    </SurfaceTint.Provider>
  );
};
