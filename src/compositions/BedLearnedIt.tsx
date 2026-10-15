// "Your bed learned it." Script: docs/bed-learned-it.md. VO: public/audio/bed-learned-it-vo.mp3.
// Approved board: BedLearnedItBoard (v3, Oct 15). Rooms seen from above; "you" are one dot (the head) with a soft glow.
// Polish rules for this reel: one fixed stage (it only glides up once, for the week, so that super can sit at the bottom);
// new objects grow out of the room (week of tiny bedrooms, nightstand → clock, the quiz on the back of the stage);
// one signature transition (the glow swells to fill the stage, the next room resolves); couch → bed is the only true
// morph; no tags except the amber "Get up"; one move at a time, on the VO's pauses. The last frames fade into frame 0.
import { AbsoluteFill, Audio, spring, staticFile, useCurrentFrame } from "remotion";
import type { EasingFunction, SpringConfig } from "remotion";
import { ease, fonts, reel, sec } from "../brand/theme";
import { PhotoBackground } from "../components/PhotoBackground";
import { SurfaceTint, TapRing } from "../components/objects";
import { ROOM_H, ROOM_W, RoomMorph, ROOMS_MORPH } from "../components/rooms";
import type { RoomKey, RoomTag } from "../components/rooms";
import { P } from "../components/premium";
import { progress } from "../lib/animation";
import { HeadlineIn } from "../templates/motion";
import { BLUR, PHOTO, SATURATION, QUIZ_TAP, QuizBack, STAGE, StageFrame, TINT } from "./BedLearnedItBoard";

// The last word ends at 34.39 s.
export const BED_LEARNED_IT_SECONDS = 34.6;

const TOP = 360;
const BOTTOM = 1250;

// VO cues (seconds), from the pauses in the voiceover.
const T = {
  bed: 1.59, // "then the second you get into bed,"
  awake: 3.25, // "you're wide awake."
  random: 4.71,
  learned: 6.07,
  night: 7.83, // "Every night you lie there trying,"
  pairs: 9.88, // "your brain pairs the bed with being alert,"
  kitchen: 12.43, // "like a kitchen that makes you hungry the second you walk in."
  longer: 15.54, // "So staying in bed longer to catch up only makes the link stronger."
  fix: 20.09, // "The fix is called stimulus control."
  work: 22.61, // "When trying feels like work,"
  getUp: 24.44,
  dim: 25.26,
  dull: 26.5,
  back: 28.03, // "and go back when your eyes feel heavy."
  quiz: 29.99,
  pattern: 32.24, // "to find your pattern,"
  when: 33.49, // "for nights when—"
};

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const prog = (f: number, s: number, frames: number, e: EasingFunction = ease.out) => progress(f, sec(s), frames, e);
const sp = (f: number, s: number, config: Partial<SpringConfig> = { damping: 14, stiffness: 140 }) =>
  spring({ frame: f - sec(s), fps: reel.fps, config });
const spot = (r: RoomKey) => ROOMS_MORPH[r].glow;

// Fluid motion, as in MorphTest: springs and a stagger so pieces arrive one after another. Tuned slower and calmer
// (user, Oct 15): getting into bed is a slow, peaceful settle; getting out is quick and frantic; nothing bounces much.
const SP: Partial<SpringConfig> = { damping: 16, stiffness: 70, mass: 1 }; // general moves: unhurried, no real overshoot
const INTO_BED: Partial<SpringConfig> = { damping: 18, stiffness: 40, mass: 1 }; // crawling into bed: slow, settles softly
const OUT_OF_BED: Partial<SpringConfig> = { damping: 20, stiffness: 140, mass: 0.8 }; // getting up: quick (~0.7 s), still well under getting in
const STAGGER = 3.5; // frames between pieces
const spf = (fr: number, s: number, delay = 0, config: Partial<SpringConfig> = SP) =>
  spring({ frame: Math.max(0, fr - sec(s) - delay), fps: reel.fps, config });
const pieceKs = (fr: number, s: number, config: Partial<SpringConfig> = SP) =>
  Array.from({ length: 7 }, (_, i) => spf(fr, s, i * STAGGER, config));
/** A point along a gentle curve from `a` to `b` (bend is the sideways bulge, as a share of the distance). */
const arc = (a: [number, number], b: [number, number], k: number, bend: number): [number, number] => {
  const mx = (a[0] + b[0]) / 2 - (b[1] - a[1]) * bend;
  const my = (a[1] + b[1]) / 2 + (b[0] - a[0]) * bend;
  const u = 1 - k;
  return [u * u * a[0] + 2 * u * k * mx + k * k * b[0], u * u * a[1] + 2 * u * k * my + k * k * b[1]];
};

// Moving between rooms: you (the dot) stay on screen and travel on a curve from where you are to where you're going,
// while the old room's pieces slide away one by one behind you and the new room's pieces spring in around you.
const AFTER_GET_UP: [number, number] = [572, 430];
// "then the second you get into bed": the couch starts turning into the bed on "bed".
const INTO_BED_AT = 1.75;
// After getting up, you carry on to the armchair once the get-up has settled.
const TO_CHAIR = 25.15;
const MOVES: Array<{ t: number; from: RoomKey; to: RoomKey; start: [number, number]; bend: number; cfg: Partial<SpringConfig>; settle: number }> = [
  { t: 12.0, from: "bed", to: "fridge", start: ROOMS_MORPH.bed.glow, bend: 0.25, cfg: SP, settle: 2.0 },
  { t: 15.0, from: "fridge", to: "bed", start: ROOMS_MORPH.fridge.glow, bend: -0.25, cfg: INTO_BED, settle: 2.6 },
  { t: TO_CHAIR, from: "bed", to: "chair", start: AFTER_GET_UP, bend: 0.2, cfg: SP, settle: 2.0 },
  { t: T.back, from: "chair", to: "bed", start: ROOMS_MORPH.chair.glow, bend: -0.2, cfg: INTO_BED, settle: 1.7 },
];
const SLIDE = 170;
const moveAt = (fr: number) => {
  const t = fr / reel.fps;
  const m = MOVES.filter((x) => t >= x.t).pop();
  if (!m) return null;
  const k = spf(fr, m.t, 0, m.cfg);
  const end = ROOMS_MORPH[m.to].glow;
  const len = Math.hypot(end[0] - m.start[0], end[1] - m.start[1]) || 1;
  const dir: [number, number] = [((end[0] - m.start[0]) / len) * SLIDE, ((end[1] - m.start[1]) / len) * SLIDE];
  return { ...m, k, ks: pieceKs(fr, m.t, m.cfg), dir, active: t < m.t + m.settle, pos: arc(m.start, end, k, m.bend) };
};
const roomAt = (t: number): RoomKey => MOVES.filter((x) => t >= x.t).pop()?.to ?? "bed";

/** Where your head is at frame `fr`, in window units. */
const headAt = (fr: number): [number, number] => {
  const t = fr / reel.fps;
  if (t < INTO_BED_AT || t >= FLIP_OUT_MID) return ROOMS_MORPH.couch.glow;
  if (t < INTO_BED_AT + 2.6) return arc(ROOMS_MORPH.couch.glow, ROOMS_MORPH.bed.glow, spf(fr, INTO_BED_AT, 0, INTO_BED), -0.2);
  const m = moveAt(fr);
  if (m && m.active) return m.pos;
  if (roomAt(t) === "bed" && t > T.getUp && t < TO_CHAIR) return arc(ROOMS_MORPH.bed.glow, AFTER_GET_UP, spf(fr, T.getUp, 0, OUT_OF_BED), 0.3);
  return ROOMS_MORPH[roomAt(t)].glow;
};

// The stage flips over for the quiz, and flips again onto the couch (frame 0).
const FLIP_IN = 29.75;
const FLIP_OUT = 33.3;
const FLIP = 0.5;
const FLIP_OUT_MID = FLIP_OUT + FLIP / 2;

// "Every night": the bedroom shrinks into Monday, and Tue–Sun pop in beside it, one per beat, already awake.
const WEEK_IN = 7.55;
const WEEK_OUT = 11.2;
const NIGHT = (i: number) => T.night + 0.25 + (i - 1) * 0.38; // i = 1..6 (Tue..Sun)
const CELL = 150;
const CELL_H = (ROOM_H * CELL) / ROOM_W;
const LABEL_H = 36;
const ROW_GAP = 30;
const GRID_TOP = (STAGE.h - (2 * (LABEL_H + CELL_H) + ROW_GAP)) / 2;
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const cellAt = (i: number) => {
  const row = i < 4 ? 0 : 1;
  const n = row ? 3 : 4;
  const j = row ? i - 4 : i;
  return { x: (STAGE.w - (n * CELL + (n - 1) * 18)) / 2 + j * (CELL + 18), y: GRID_TOP + row * (LABEL_H + CELL_H + ROW_GAP) };
};
// The week's super sits at the bottom, so the stage glides up for that beat only.
const STAGE_UP = 270;

// "Staying in bed longer": the right nightstand grows into a clock and ticks hours away, one jump every two frames.
const CLOCK_IN = 16.3;
const clockMinutes = (f: number) => 420 + 4 * Math.max(0, Math.floor((f - sec(CLOCK_IN)) / 2));

const DayLabel: React.FC<{ x: number; y: number; text: string; opacity: number }> = ({ x, y, text, opacity }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: CELL,
      textAlign: "center",
      fontFamily: fonts.sans,
      fontSize: 22,
      fontWeight: 600,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: P.ink,
      opacity,
    }}
  >
    {text}
  </div>
);

const StageLayer: React.FC<{ f: number }> = ({ f }) => {
  const t = f / reel.fps;
  const move = moveAt(f);

  // Room, and the couch → bed morph (each piece springs over, one after another).
  const inCouch = t < INTO_BED_AT || t >= FLIP_OUT_MID;
  const morphing = !inCouch && t < INTO_BED_AT + 2.6;
  const morph = spf(f, INTO_BED_AT, 0, INTO_BED);
  const room: RoomKey = inCouch ? "couch" : roomAt(t);

  // Where the head is: it travels on gentle curves and stays round (it's a head seen from above); its glow trails a touch.
  const glow = headAt(f);
  const halo = headAt(f - 2);
  const moving = !inCouch && move !== null && move.active;

  // How alert you feel, blended across a move so the glow never jumps.
  const heatIn = (r: RoomKey) => {
    if (inCouch) return 0.3;
    if (r === "fridge") return 0.85;
    if (r === "chair") return lerp(0.45, 0.25, prog(f, T.dim + 0.4, 40));
    if (t < 12.1) return lerp(0.35, 1, prog(f, T.awake, 12)) + 0.25 * prog(f, T.learned, 18);
    if (t < 28) return 1.3 + 0.4 * prog(f, CLOCK_IN, 30) - 0.3 * prog(f, T.fix, 18) - 0.8 * prog(f, T.getUp, 18);
    return 0.2;
  };
  let heat = moving && move ? lerp(heatIn(move.from), heatIn(move.to), clamp01(move.k)) : heatIn(room);
  // While you lie there wide awake, the glow breathes a little fast.
  const awake = room === "bed" && t > T.awake && t < T.getUp;
  heat *= awake ? 1 + 0.07 * Math.sin(((t - T.awake) / 1.4) * Math.PI * 2) : 1;

  // The week.
  const SOFT: Partial<SpringConfig> = { damping: 18, stiffness: 70, mass: 1 };
  const shrink = spf(f, WEEK_IN, 0, SOFT) - spf(f, WEEK_OUT, 0, SOFT);
  const mon = cellAt(0);
  const roomBox = { x: lerp(0, mon.x, shrink), y: lerp(0, mon.y + LABEL_H, shrink), w: lerp(STAGE.w, CELL, shrink) };
  const lift = spf(f, 7.55, 0, SOFT) - spf(f, WEEK_OUT + 0.3, 0, SOFT);
  const stageY = lerp(STAGE.y, STAGE_UP, lift);
  const weekOut = 1 - prog(f, WEEK_OUT - 0.15, 10);

  // The amber "Get up" tag (the only tag in the video).
  const tagPop = sp(f, T.getUp, { damping: 13, stiffness: 180 });
  const tags: RoomTag[] =
    t > T.getUp - 0.05 && t < TO_CHAIR + 0.1
      ? [{ x: 572, y: 530, text: "Get up", icon: "up", amber: true, opacity: clamp01(tagPop * 1.6) * (1 - prog(f, TO_CHAIR - 0.15, 6)), scale: 0.8 + 0.2 * tagPop }]
      : [];

  // Flips: 0..1 across each, the content swaps at the halfway point.
  const flipIn = clamp01((t - FLIP_IN) / FLIP);
  const flipOut = clamp01((t - FLIP_OUT) / FLIP);
  const flip = t < FLIP_OUT ? flipIn : flipOut;
  const showQuiz = t >= FLIP_IN + FLIP / 2 && t < FLIP_OUT + FLIP / 2;
  const sx = Math.abs(Math.cos(Math.PI * ease.inOutCubic(flip)));
  const press = sp(f, T.pattern, { damping: 12, stiffness: 260 }) - sp(f, T.pattern + 0.2, { damping: 12, stiffness: 200 });
  const ring = prog(f, T.pattern, 16, ease.outQuart);

  return (
    <div style={{ position: "absolute", left: STAGE.x, top: stageY, width: STAGE.w, height: STAGE.h, transform: `scaleX(${Math.max(0.001, sx)})` }}>
      {showQuiz ? (
        <>
          <QuizBack started={t >= T.pattern + 0.12} press={press} />
          {t >= T.pattern && ring < 1 ? <TapRing x={QUIZ_TAP.x} y={QUIZ_TAP.y} r={30 + 50 * ring} opacity={1 - ring} /> : null}
        </>
      ) : (
        <>
          <StageFrame />
          {/* Tue–Sun: the same bed, night after night, each one awake. */}
          {shrink > 0.01
            ? DAYS.slice(1).map((d, j) => {
                const i = j + 1;
                const c = cellAt(i);
                const pop = sp(f, NIGHT(i), { damping: 14, stiffness: 170 }) * weekOut;
                return pop > 0.01 ? (
                  <div
                    key={d}
                    style={{ position: "absolute", left: c.x, top: c.y, opacity: clamp01(pop * 1.5), transform: `scale(${0.75 + 0.25 * pop})`, transformOrigin: "50% 60%" }}
                  >
                    <DayLabel x={0} y={0} text={d} opacity={1} />
                    <div style={{ position: "absolute", top: LABEL_H }}>
                      <RoomMorph w={CELL} a="bed" glow={spot("bed")} heat={0.9} />
                    </div>
                  </div>
                ) : null;
              })
            : null}
          {shrink > 0.01 ? <DayLabel x={mon.x} y={mon.y} text="Mon" opacity={clamp01((shrink - 0.6) / 0.4)} /> : null}
          <div style={{ position: "absolute", left: roomBox.x, top: roomBox.y }}>
            <RoomMorph
              w={roomBox.w}
              a={inCouch || morphing ? "couch" : room}
              b={inCouch ? "couch" : morphing ? "bed" : room}
              k={inCouch ? 0 : morphing ? morph : 0}
              ks={morphing ? pieceKs(f, INTO_BED_AT, INTO_BED) : undefined}
              glow={glow}
              halo={halo}
              heat={heat}
              slide={moving && move ? { from: move.from, k: move.k, dir: move.dir, ks: move.ks } : undefined}
              fridge={sp(f, 13.7, { damping: 15, stiffness: 110 })}
              lamp={prog(f, T.dim + 0.2, 24)}
              book={sp(f, T.dull, { damping: 12, stiffness: 160 })}
              clock={
                room === "bed" && t > CLOCK_IN - 0.1 && t < T.fix + 0.8
                  ? { p: sp(f, CLOCK_IN, { damping: 14, stiffness: 120 }) * (1 - prog(f, T.fix, 15, ease.inOutCubic)), minutes: clockMinutes(f) }
                  : undefined
              }
              tags={tags}
              tagSize={32}
            />
          </div>
        </>
      )}
    </div>
  );
};

const LOOP_FADE = BED_LEARNED_IT_SECONDS - 0.35;
const HOOK = "Couch: sleepy. *Bed: wide awake.*";
const supers: Array<{ at: number; out: number; y: number; text: string }> = [
  { at: T.random, out: 7.1, y: TOP, text: "Not random. *Your bed learned it.*" },
  { at: T.night, out: WEEK_OUT, y: BOTTOM, text: "Your brain *pairs bed with alert.*" },
  { at: T.kitchen, out: 15.15, y: TOP, text: "Like a kitchen *makes you hungry.*" },
  { at: T.longer + 0.1, out: T.fix - 0.45, y: TOP, text: "Staying in longer *makes it stronger.*" },
  { at: T.fix, out: T.work - 0.4, y: TOP, text: "The fix: *stimulus control.*" },
  { at: T.work, out: 24.9, y: TOP, text: "Trying feels like work? *Get up.*" },
  { at: T.dim, out: 29.5, y: TOP, text: "Somewhere dim. *Something dull.*" },
  { at: T.quiz + 0.1, out: 33.15, y: TOP, text: "Find *your pattern.*" },
];

export const BedLearnedIt: React.FC = () => {
  const f = useCurrentFrame();
  const loop = prog(f, LOOP_FADE, 10);
  return (
    <SurfaceTint.Provider value={TINT}>
      <AbsoluteFill>
        {/* A seeded photo behind frosted, darkened glass, so the stage and type stay readable. */}
        <PhotoBackground photo={PHOTO} blur={BLUR} calm={0.5} saturation={SATURATION} />
        <AbsoluteFill style={{ background: "linear-gradient(170deg, rgba(255,255,255,0.05), rgba(5,6,16,0.3))" }} />
        <Audio src={staticFile("audio/bed-learned-it-vo.mp3")} />
        <StageLayer f={f} />
        {/* The hook is fully on screen in the first frame, and fades back in over the last frames so the loop is seamless. */}
        <HeadlineIn y={TOP} size={100} text={HOOK} at={-3} out={T.random - 0.45} align="center" />
        {supers.map((s) => (
          <HeadlineIn key={s.at} y={s.y} size={100} text={s.text} at={s.at} out={s.out} align="center" />
        ))}
        <div style={{ opacity: 1 - loop }}>
          <HeadlineIn y={TOP} size={100} text="For nights *when…*" at={T.when} align="center" />
        </div>
        <div style={{ opacity: loop }}>
          <HeadlineIn y={TOP} size={100} text={HOOK} at={-3} align="center" />
        </div>
      </AbsoluteFill>
    </SurfaceTint.Provider>
  );
};
