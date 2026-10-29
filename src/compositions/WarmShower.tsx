// "Warm shower" (passive body heating). Script: docs/warm-shower.md. VO: public/audio/warm-shower-vo.mp3.
// Approved board: WarmShowerBoard (Oct 29), cover A; the first preview was approved as is.
// Your heat, seen from above: hot under the shower, the heat flows out to four radiators around you (your hands and
// feet) and they shimmer it away, which takes time (a clock grows out of the basin).
// Straight to bed, you're still glowing. The study splits the shower into seventeen tiny ones that pool back together;
// the quiz is written in the fogged mirror. One fixed stage (it glides up once, for the study); springs, one move at a time.
import { AbsoluteFill, Audio, spring, staticFile, useCurrentFrame } from "remotion";
import type { EasingFunction, SpringConfig } from "remotion";
import { ease, reel, sec } from "../brand/theme";
import { PhotoBackground } from "../components/PhotoBackground";
import { SurfaceTint } from "../components/objects";
import type { WarmClock } from "../components/rooms";
import { ShowerRoom, WARM } from "../components/rooms";
import { progress } from "../lib/animation";
import { HeadlineIn } from "../templates/motion";
import { BLUR, BOTTOM, MINI, PHOTO, SATURATION, STAGE, STAGE_UP, Source, TINT, TOP, miniSpots } from "./WarmShowerBoard";

// The last word ends at 33.04 s.
export const WARM_SHOWER_SECONDS = 33.4;

// VO cues (seconds), from the pauses in the voiceover.
const T = {
  late: 2.06, // "you're about an hour too late."
  longer: 4.03, // "You don't need a longer shower,"
  earlier: 5.65, // "just an earlier one."
  sleep: 7.14, // "To fall asleep,"
  cool: 8.2, // "your body has to cool down."
  warm: 10.28, // "Warm water sends heat out to your hands and feet,"
  radiators: 13.26, // "which work like radiators and let it go."
  time: 15.86, // "But that cooling takes time."
  straight: 17.85, // "Straight to bed,"
  still: 18.9, // "you're still warm."
  study: 20.39, // "Researchers at UT Austin pooled 17 studies."
  shower: 24.16, // "A warm shower one to two hours before bed"
  hours: 24.9,
  helped: 27.07, // "helped people fall asleep"
  faster: 28.68, // "about ten minutes faster."
  quiz: 30.34, // "See what's keeping you up"
  bio: 31.48, // "with the sleep quiz in our bio"
};

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const prog = (f: number, s: number, frames: number, e: EasingFunction = ease.out) => progress(f, sec(s), frames, e);

// Springs, as in BedLearnedIt: unhurried, low bounce. Into bed is a slow settle; "straight to bed" is quick.
const SP: Partial<SpringConfig> = { damping: 16, stiffness: 70, mass: 1 };
const SLOW: Partial<SpringConfig> = { damping: 18, stiffness: 40, mass: 1 };
const POP: Partial<SpringConfig> = { damping: 14, stiffness: 150, mass: 0.8 };
const spf = (f: number, s: number, config: Partial<SpringConfig> = SP, delay = 0) =>
  spring({ frame: Math.max(0, f - sec(s) - delay), fps: reel.fps, config });
/** A value that springs from one level to the next at each step: [time, value, spring]. */
const track = (f: number, start: number, steps: Array<[number, number, Partial<SpringConfig>]>) => {
  let v = start;
  for (const [at, to, cfg] of steps) v = lerp(v, to, spf(f, at, cfg));
  return v;
};
/** A point along a gentle curve from `a` to `b`. */
const arc = (a: [number, number], b: [number, number], k: number, bend: number): [number, number] => {
  const mx = (a[0] + b[0]) / 2 - (b[1] - a[1]) * bend;
  const my = (a[1] + b[1]) / 2 + (b[0] - a[0]) * bend;
  const u = 1 - k;
  return [u * u * a[0] + 2 * u * k * mx + k * k * b[0], u * u * a[1] + 2 * u * k * my + k * k * b[1]];
};

// Room moves: +1 into the bedroom, -1 back to the bathroom. Pieces follow one after another (~3.5 frames apart).
const MOVES: Array<[number, 1 | -1, Partial<SpringConfig>]> = [
  [T.sleep + 0.1, 1, SLOW],
  [9.95, -1, SP],
  [T.straight - 0.05, 1, POP],
  [T.study, -1, SP],
  [T.helped, 1, SLOW],
  [29.9, -1, SP],
];
const bedAt = (f: number, delay: number) => clamp01(MOVES.reduce((v, [at, dir, cfg]) => v + dir * spf(f, at, cfg, delay), 0));

// The study: the room shrinks into one of seventeen tiny showers; the others pop in around it, then pool back into it.
const SPOTS = miniSpots();
const CENTRE = 6;
// They pool in the pause before "A warm shower", so the stage is back in place when the next super comes in.
const POOL = 23.6;

const StageLayer: React.FC<{ f: number }> = ({ f }) => {
  const t = f / reel.fps;
  const ks = Array.from({ length: 7 }, (_, i) => bedAt(f, i * 3.5));
  const k = bedAt(f, 10);
  const glow = arc(WARM.shower, WARM.pillow, k, 0.15);

  // Heat: hot in the shower; cools in bed; hot again; the radiators let it go, slowly; still warm straight to bed.
  const heat = track(f, 1, [
    [T.cool, 0.25, SLOW],
    [T.warm, 1, SP],
    [T.radiators, 0.6, SLOW],
    [T.time, 0.48, SLOW],
    [T.straight, 0.95, SP],
    [T.shower, 1, SP],
    [T.helped + 0.6, 0.2, SLOW],
    [29.9, 0.8, SP],
  ]);
  const asleep = prog(f, T.faster, 30, ease.inOutCubic) * (1 - prog(f, 29.9, 12));

  // Water: on at the start, again for "warm water", and in the study's showers and "a warm shower".
  const spray = clamp01(1 - prog(f, T.sleep, 12) + prog(f, T.warm, 12) - prog(f, T.radiators + 0.4, 18) + prog(f, T.study + 0.6, 12) - prog(f, T.helped, 12));
  const steam = clamp01(1 - prog(f, T.sleep + 0.4, 30) + prog(f, T.warm + 0.3, 30) - prog(f, T.time, 40) + prog(f, T.shower, 30) - prog(f, T.helped, 30));

  // The radiators: spring up around you once you're back under the water; the heat flows out, they shimmer it away.
  const radiators = spf(f, T.warm + 0.7, POP) * (1 - prog(f, T.straight - 0.1, 10));
  const flow = prog(f, T.warm + 1.2, 18) * (1 - prog(f, T.time + 0.3, 30));
  const radiate = prog(f, T.radiators + 0.2, 24) * (1 - 0.3 * prog(f, T.time + 0.5, 40));

  // Clocks: out of the basin for "an hour too late" (winds back for "earlier"), "takes time" and "1–2 hours before bed";
  // out of the bedside table for "ten minutes faster". Each shrinks back before the room moves.
  let clock: WarmClock | undefined;
  if (t < T.sleep) {
    clock = { p: spf(f, T.late, SP) - spf(f, 6.75, SP), from: "basin", minutes: lerp(720, 660, spf(f, T.earlier + 0.1, SLOW)), moon: 1, wedge: { from: 11, to: 12, o: prog(f, T.late + 0.4, 15) } };
  } else if (t > T.time - 0.2 && t < T.straight + 0.2) {
    const m = 13 * Math.max(0, t - T.time - 0.3);
    clock = { p: spf(f, T.time, SP) - spf(f, T.straight - 0.35, POP), from: "basin", minutes: m, wedge: { from: 0, to: m / 5 } };
  } else if (t > T.shower && t < T.helped + 0.3) {
    clock = { p: spf(f, T.shower + 0.25, SP) - spf(f, T.helped - 0.3, SP), from: "basin", minutes: 630, moon: 1, wedge: { from: 10, to: 11, amber: true, o: prog(f, T.hours, 15) } };
  } else if (t > T.faster - 0.6 && t < 30.3) {
    const m = Math.min(20, 14 * Math.max(0, t - T.faster + 0.4));
    clock = {
      p: spf(f, T.faster - 0.5, SP) - spf(f, 29.75, POP),
      from: "nightstand",
      minutes: m,
      ghost: 30,
      wedge: { from: 4, to: 6, o: prog(f, T.faster + 0.9, 12) },
    };
  }
  if (clock) clock.p = clamp01(clock.p);

  // The mirror: swings up off the bottom wall, fills the room, the quiz is wiped into the fog.
  const mirror = { swing: spf(f, T.quiz + 0.05, SP), grow: spf(f, T.quiz + 0.4, SP), write: prog(f, T.quiz + 0.85, sec(1.3), ease.linear) };

  // The study.
  const shrink = clamp01(spf(f, T.study, SP) - spf(f, POOL, SP));
  const studyOn = t > T.study && t < POOL + 1.5;
  const stageY = lerp(STAGE.y, STAGE_UP, shrink);
  const [cx, cy] = SPOTS[CENTRE];
  const box = { x: lerp(0, cx, shrink), y: lerp(0, cy, shrink), w: lerp(STAGE.w, MINI, shrink) };
  const pool = spf(f, POOL, SP);
  const source = studyOn ? prog(f, T.study + 0.7, 14) * (1 - prog(f, POOL - 0.2, 8)) : 0;

  return (
    <>
      <div style={{ position: "absolute", left: STAGE.x, top: stageY, width: STAGE.w, height: STAGE.h }}>
        {shrink > 0.01 ? (
          <div style={{ position: "absolute", inset: 0, borderRadius: 45, border: "3px solid rgba(243,238,230,0.22)", background: "linear-gradient(170deg, rgba(255,255,255,0.05), rgba(5,6,16,0.35))", opacity: clamp01(shrink * 2) }} />
        ) : null}
        {studyOn
          ? SPOTS.map(([x, y], i) => {
              if (i === CENTRE) return null;
              const pop = spf(f, T.study + 0.35, POP, i * 2);
              const px = lerp(x, cx, pool);
              const py = lerp(y, cy, pool);
              return (
                <div key={i} style={{ position: "absolute", left: px, top: py, opacity: clamp01(pop * 1.5) * (1 - clamp01(pool * 1.4)), transform: `scale(${0.6 + 0.4 * pop})` }}>
                  <ShowerRoom w={MINI} glow={WARM.shower} heat={1} spray={1} phase={f + i * 9} />
                </div>
              );
            })
          : null}
        <div style={{ position: "absolute", left: box.x, top: box.y, width: box.w }}>
          <ShowerRoom
            w={box.w}
            ks={ks}
            bed={k}
            glow={glow}
            heat={heat}
            asleep={asleep}
            spray={spray}
            steam={steam * (1 - shrink)}
            phase={f}
            radiators={radiators}
            flow={flow}
            radiate={radiate}
            clock={clock}
            mirror={mirror}
          />
        </div>
      </div>
      <Source o={source} />
    </>
  );
};

const LOOP_FADE = WARM_SHOWER_SECONDS - 0.35;
const HOOK = "Shower *right before bed?*";
const supers: Array<{ at: number; out: number; y: number; text: string }> = [
  { at: T.late, out: 3.75, y: TOP, text: "You're *an hour too late.*" },
  { at: T.longer, out: 6.8, y: TOP, text: "Not longer. *Just earlier.*" },
  { at: T.sleep, out: 9.75, y: TOP, text: "To sleep, *your body cools down.*" },
  { at: T.warm, out: 12.95, y: TOP, text: "Heat flows out *to hands and feet.*" },
  { at: T.radiators, out: 15.5, y: TOP, text: "They work *like radiators.*" },
  { at: T.time, out: 17.5, y: TOP, text: "Cooling *takes time.*" },
  { at: T.straight, out: 20.0, y: TOP, text: "Straight to bed? *Still warm.*" },
  { at: T.study + 0.1, out: 23.45, y: BOTTOM, text: "UT Austin *pooled 17 studies.*" },
  { at: T.shower + 0.15, out: 26.8, y: TOP, text: "Shower *1–2 hours before bed.*" },
  { at: T.helped, out: 29.9, y: TOP, text: "Asleep *about 10 minutes faster.*" },
];

export const WarmShower: React.FC = () => {
  const f = useCurrentFrame();
  const loop = prog(f, LOOP_FADE, 10);
  return (
    <SurfaceTint.Provider value={TINT}>
      <AbsoluteFill>
        {/* The seeded photo (deep blue sky) behind frosted, darkened glass, so the stage and type stay readable. */}
        <PhotoBackground photo={PHOTO} blur={BLUR} calm={0.5} saturation={SATURATION} />
        <AbsoluteFill style={{ background: "linear-gradient(170deg, rgba(255,255,255,0.05), rgba(5,6,16,0.3))" }} />
        <Audio src={staticFile("audio/warm-shower-vo.mp3")} />
        <div style={{ opacity: 1 - loop }}>
          <StageLayer f={f} />
        </div>
        {/* The last frames fade back into frame 0: the shower, you glowing hot. */}
        {loop > 0 ? (
          <div style={{ position: "absolute", left: STAGE.x, top: STAGE.y, width: STAGE.w, opacity: loop }}>
            <ShowerRoom w={STAGE.w} glow={WARM.shower} heat={1} spray={1} steam={1} phase={f} mirror={{ swing: 0, grow: 0, write: 0 }} />
          </div>
        ) : null}
        {/* The hook is fully on screen in the first frame, and fades back in over the last frames so the loop is seamless. */}
        <HeadlineIn y={TOP} size={100} text={HOOK} at={-3} out={1.75} align="center" />
        {supers.map((s) => (
          <HeadlineIn key={s.at} y={s.y} size={100} text={s.text} at={s.at} out={s.out} align="center" />
        ))}
        <div style={{ opacity: 1 - loop }}>
          <HeadlineIn y={TOP} size={100} text="See *what's keeping you up.*" at={T.quiz} align="center" />
        </div>
        <div style={{ opacity: loop }}>
          <HeadlineIn y={TOP} size={100} text={HOOK} at={-3} align="center" />
        </div>
      </AbsoluteFill>
    </SurfaceTint.Provider>
  );
};
