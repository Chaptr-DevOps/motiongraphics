// "Checking the clock in bed" (clock-watching). Script: docs/clock-watcher.md. VO: public/audio/clock-watcher-vo.mp3.
// Direction B+C (user, Oct 30): the alarm clock's light finds you, and every glance drops a note of sleep math into that
// light. The study: sixty tiny rooms, the clock-watchers' notes pop and their dots stay lit longest. Turn the clock to
// the wall and the light leaves you for the wall, the notes drift out of it; phone face down, the room goes dark. The
// alarm still rings off the clock's back (the one amber tag), and the light on the wall grows into the quiz note.
import { AbsoluteFill, Audio, random, spring, staticFile, useCurrentFrame } from "remotion";
import type { SpringConfig } from "remotion";
import { photos } from "../brand/photos";
import { ease, fonts, reel, sec } from "../brand/theme";
import { PhotoBackground } from "../components/PhotoBackground";
import { SurfaceTint } from "../components/objects";
import { CLOCK_ROOM, ClockRoom, ROOM_H, ROOM_W } from "../components/rooms";
import type { ClockNote } from "../components/rooms";
import { P } from "../components/premium";
import { progress } from "../lib/animation";
import { HeadlineIn } from "../templates/motion";

// The seeded pick (purple Milky Way) has no file in public/images; the user asked for a new colour scheme: deep blue.
export const PHOTO = photos.blueSky;
export const TINT = PHOTO.tint;

// The last word ends at ~31.0 s.
export const CLOCK_WATCHER_SECONDS = 31.3;

// VO cues (seconds), from the pauses in the voiceover.
const T = {
  even: 3.71, // "Even for good sleepers."
  want: 5.55, // "You just want to know how much sleep is left."
  study: 8.33, // "But in a study of 60 people,"
  worried: 10.36, // "clock-watchers worried more"
  longer: 11.92, // "and took longer to fall asleep."
  glance: 13.98, // "Each glance starts a countdown."
  six: 16.34, // "Six hours left."
  half: 17.77, // "Five and a half."
  brain: 19.0, // "That countdown keeps your brain on."
  turn: 21.35, // "So turn your clock to face the wall,"
  phone: 23.55, // "and your phone face down."
  alarm: 25.4, // "Your alarm still works."
  quiz: 26.93, // "Find out if you're a Clock-Watcher with the sleep quiz in our bio,"
  bio: 29.75,
  because: 30.49, // "because…"
};

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const prog = (f: number, s: number, frames: number) => progress(f, sec(s), frames, ease.out);
const SP: Partial<SpringConfig> = { damping: 16, stiffness: 70, mass: 1 };
const SLOW: Partial<SpringConfig> = { damping: 18, stiffness: 40, mass: 1 };
const GLIDE: Partial<SpringConfig> = { damping: 20, stiffness: 28, mass: 1 };
const QUICK: Partial<SpringConfig> = { damping: 15, stiffness: 160, mass: 0.7 };
const spf = (f: number, s: number, config: Partial<SpringConfig> = SP, delay = 0) =>
  spring({ frame: Math.max(0, f - sec(s) - delay), fps: reel.fps, config });
const track = (f: number, start: number, steps: Array<[number, number, Partial<SpringConfig>]>) => {
  let v = start;
  for (const [at, to, cfg] of steps) v = lerp(v, to, spf(f, at, cfg));
  return v;
};
/** A quick flare after `s` that dies away (the light jumping on each glance). */
const flare = (t: number, s: number) => (t < s ? 0 : t - s < 0.15 ? (t - s) / 0.15 : Math.exp(-(t - s - 0.15) * 3));

// ─── The stage ──────────────────────────────────────────────────────────────────────────────────────────────────────
export const WIN = { x: 178, y: 640, w: 724, h: (ROOM_H * 724) / ROOM_W };
const WIN_UP = 300;
export const TOP = 360;
const BOTTOM = 1250;

// Each glance: a dotted look from your head to the clock (0.45 s), landing just before its VO word.
const GLANCES = [1.75, 4.45, T.want + 0.05, T.glance + 0.1, T.six - 0.4, T.half - 0.4, T.brain - 0.4];
const GLANCE_LEN = 0.45;

// The clock's scale and place: on the nightstand level with your head (so its light runs straight at you), big over the
// bed for "how much sleep is left", a little bigger for the countdown so the digits read.
const clockAt = (scale: number): [number, number] => {
  const [x, y] = CLOCK_ROOM.clock;
  const k = clamp01((scale - 1.35) / 0.65);
  return [lerp(x, 466, k), lerp(y, 300, k)];
};

// Tossing and turning in the hook: you roll left, right, left, then settle in the middle (frame 0's pose, for the loop).
// [seconds, head dx, pillow dx, pillow rotation, duvet rumple]
const ROLLS: Array<[number, number, number, number, number]> = [
  [0.12, -72, -38, -6, -1],
  [1.2, 66, 40, 5, 1],
  [2.3, -46, -24, -3, -0.6],
  [3.3, 0, 0, 0, 0],
];
const ROLL: Partial<SpringConfig> = { damping: 15, stiffness: 120, mass: 0.8 };
const rolled = (f: number, k: 1 | 2 | 3 | 4) => track(f, 0, ROLLS.map((r) => [r[0], r[k], ROLL] as [number, number, Partial<SpringConfig>]));

const NOTES: Array<Omit<ClockNote, "p" | "drift"> & { at: number }> = [
  { text: "6 hours left", x: 70, y: 214, rot: -4, at: T.six - 0.05 },
  { text: "5½ hours left", x: 34, y: 318, rot: 3, at: T.half - 0.05 },
  { text: "If I fall asleep now…", x: 16, y: 424, rot: -2, at: T.brain },
];

// ─── The study: sixty tiny rooms, half with the clock on ─────────────────────────────────────────────────────────────
const COLS = 10;
const ROWS = 6;
const MINI = 62;
const SPOTS: Array<[number, number]> = (() => {
  const h = (ROOM_H * MINI) / ROOM_W;
  const gapX = 8;
  const gapY = 20;
  const top = (WIN.h - (ROWS * h + (ROWS - 1) * gapY)) / 2;
  const left = (WIN.w - (COLS * MINI + (COLS - 1) * gapX)) / 2;
  return Array.from({ length: COLS * ROWS }, (_, i): [number, number] => [left + (i % COLS) * (MINI + gapX), top + Math.floor(i / COLS) * (h + gapY)]);
})();
// Thirty clock-watchers, seeded; room 0 (you) is one of them.
const WATCHER: boolean[] = (() => {
  const order = SPOTS.map((_, i) => i)
    .slice(1)
    .sort((a, b) => random(`cw-${a}`) - random(`cw-${b}`));
  const on = new Set([0, ...order.slice(0, 29)]);
  return SPOTS.map((_, i) => on.has(i));
})();
const SHRINK = T.study + 0.45;
const POOL = 13.45;
const SOURCE = "Tang et al., 2007";

const StageLayer: React.FC<{ f: number }> = ({ f }) => {
  const t = f / reel.fps;
  const glance = GLANCES.map((s) => (t - s) / GLANCE_LEN).find((g) => g > 0 && g < 1) ?? -1;
  const flares = GLANCES.reduce((m, s) => Math.max(m, flare(t, s + GLANCE_LEN)), 0);

  const scale = track(f, 1, [
    [T.want + 0.3, 2, SP],
    [T.study - 0.15, 1, SP],
    [T.glance + 0.1, 1.35, SP],
    [T.turn + 0.25, 1, SP],
  ]);
  const minutes = track(f, 60, [
    [T.half - 0.05, 90, SP],
    [T.because, 60, SP],
  ]);
  const turn = clamp01(spf(f, T.turn, SLOW) - spf(f, T.because + 0.05, SP));
  const beamO = track(f, 1, [
    [T.even + 0.15, 0.2, SLOW],
    [4.45 + GLANCE_LEN, 1, QUICK],
    [T.want + 0.2, 0, SP],
    [T.study + 0.6, 1, SP],
    [T.quiz + 0.2, 0.55, SP],
    [T.because + 0.2, 1, SP],
  ]);
  const awake = track(f, 1, [
    [1.4, 1.15, SP],
    [T.even + 0.15, 0.45, SLOW],
    [4.45 + GLANCE_LEN, 1.1, QUICK],
    [T.want, 1, SP],
    [T.brain, 1.4, SP],
    [T.turn + 0.3, 0.85, SP],
    [T.phone + 0.1, 0.3, SLOW],
    [T.because + 0.1, 1, SP],
  ]);
  const phone = clamp01(spf(f, T.phone, QUICK) - spf(f, T.because + 0.2, SP));
  const dark = prog(f, T.phone + 0.2, 14) * (1 - prog(f, T.because, 10));
  const notes: ClockNote[] = NOTES.map((n, i) => ({ ...n, p: spf(f, n.at, SP), drift: spf(f, T.turn + 0.4, GLIDE, i * 4) }));
  const ring = { t: t - T.alarm, o: prog(f, T.alarm, 8) * (1 - prog(f, T.quiz, 10)) };
  const tag = clamp01(spf(f, T.alarm, SP) - prog(f, T.quiz, 8));
  const quiz = { p: clamp01(spf(f, T.quiz + 0.2, SP) - spf(f, T.because, QUICK)), tick: prog(f, T.bio, 12) };

  // The study: the stage glides up, the room shrinks into room 0, the other fifty-nine pop in; then they pool back.
  const shrink = clamp01(spf(f, SHRINK, SP) - spf(f, POOL, SP));
  const studyOn = t > SHRINK && t < POOL + 1.5;
  const winY = lerp(WIN.y, WIN_UP, clamp01(spf(f, T.study, SP) - spf(f, POOL, SP)));
  const pool = spf(f, POOL, SP);
  const source = studyOn ? prog(f, SHRINK + 0.5, 14) * (1 - prog(f, POOL - 0.2, 8)) : 0;
  const [sx, sy] = SPOTS[0];
  const roomW = lerp(WIN.w, MINI, shrink);
  const miniNote = spf(f, T.worried, QUICK);

  return (
    <>
      <div style={{ position: "absolute", left: WIN.x, top: winY, width: WIN.w, height: WIN.h }}>
        {studyOn
          ? SPOTS.map(([x, y], i) => {
              if (i === 0) return null;
              const pop = spf(f, SHRINK + 0.25, QUICK, (i % COLS) * 1.2 + Math.floor(i / COLS) * 2);
              const w = WATCHER[i];
              // "Took longer to fall asleep": the plain rooms drop off one by one; the clock-watchers stay lit.
              const sleepAt = T.longer + 0.1 + (w ? 1.6 : 0) + 1.1 * random(`cw-sleep-${i}`);
              const asleep = prog(f, sleepAt, 14);
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
                  <ClockRoom
                    w={MINI}
                    mini
                    awake={w ? 1 : 0.6}
                    asleep={asleep}
                    clock={{ minutes: 60, lit: w ? 0.6 : 0 }}
                    beam={w ? 1 : 0}
                    miniNote={w ? spf(f, T.worried + 0.6 * random(`cw-note-${i}`), QUICK) : 0}
                  />
                </div>
              );
            })
          : null}
        <div style={{ position: "absolute", left: lerp(0, sx, shrink), top: lerp(0, sy, shrink) }}>
          <ClockRoom
            w={roomW}
            mini={roomW < 120}
            awake={awake}
            pulse={f}
            dark={dark}
            clock={{ minutes, scale, at: clockAt(scale), turn, lit: 0.6 * beamO + 0.4 * flares }}
            glance={glance}
            restless={{ head: rolled(f, 1), headLag: rolled(f - 4, 1), pillow: rolled(f, 2), pillowRot: rolled(f, 3), rumple: rolled(f, 4) }}
            beam={beamO * (1 + 0.35 * flares)}
            phone={phone}
            notes={notes}
            miniNote={miniNote}
            ring={ring}
            tag={tag}
            quiz={quiz}
          />
        </div>
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

const LOOP_FADE = CLOCK_WATCHER_SECONDS - 0.3;
export const HOOK = "Checking the clock *in bed?*";
const supers: Array<{ at: number; out: number; y: number; text: string }> = [
  { at: T.even, out: 5.3, y: TOP, text: "Even *for good sleepers.*" },
  { at: T.want, out: 8.05, y: TOP, text: "You want to know *how much is left.*" },
  { at: T.study + 0.1, out: 13.3, y: BOTTOM, text: "They worried more, *fell asleep later.*" },
  { at: T.glance, out: 18.75, y: TOP, text: "Each glance *starts a countdown.*" },
  { at: T.brain, out: 21.1, y: TOP, text: "It *keeps your brain on.*" },
  { at: T.turn, out: 25.15, y: TOP, text: "Clock *to the wall.* Phone *face down.*" },
  { at: T.alarm, out: 26.7, y: TOP, text: "Your alarm *still works.*" },
];

export const ClockWatcher: React.FC = () => {
  const f = useCurrentFrame();
  const loop = prog(f, LOOP_FADE, 9);
  return (
    <SurfaceTint.Provider value={TINT}>
      <AbsoluteFill>
        {/* The deep blue sky behind frosted, darkened glass, so the room and type stay readable. */}
        <PhotoBackground photo={PHOTO} blur={44} calm={0.5} saturation={0.7} />
        <AbsoluteFill style={{ background: "linear-gradient(170deg, rgba(255,255,255,0.05), rgba(5,6,16,0.3))" }} />
        <Audio src={staticFile("audio/clock-watcher-vo.mp3")} />
        <StageLayer f={f} />
        {/* The last frames fade into frame 0. */}
        {loop > 0 ? (
          <AbsoluteFill style={{ opacity: loop }}>
            <StageLayer f={0} />
          </AbsoluteFill>
        ) : null}
        <HeadlineIn y={TOP} size={100} text={HOOK} at={-3} out={3.45} align="center" />
        {supers.map((s) => (
          <HeadlineIn key={s.at} y={s.y} size={100} text={s.text} at={s.at} out={s.out} align="center" />
        ))}
        <div style={{ opacity: 1 - loop }}>
          <HeadlineIn y={TOP} size={100} text="Are you *a Clock-Watcher?*" at={T.quiz} align="center" />
        </div>
        <div style={{ opacity: loop }}>
          <HeadlineIn y={TOP} size={100} text={HOOK} at={-3} align="center" />
        </div>
      </AbsoluteFill>
    </SurfaceTint.Provider>
  );
};
