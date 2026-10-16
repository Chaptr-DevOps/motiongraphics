// "Picture a place" (imagery distraction). Script: docs/picture-a-place.md. VO: public/audio/picture-a-place-vo.mp3.
// Approved board: PictureAPlaceBoard (Oct 16), cover C. Your mind is a bedroom seen from above: counting sheep fills one
// corner, worries slip onto the rest of the floor, and a beach postcard on the nightstand grows until the scene fills
// the room. The study splits the stage into two small rooms; the how-to happens on the beach; the quiz is on the
// postcard's back. One fixed stage (it glides up once, for the study); springs with low bounce; one move at a time.
import { AbsoluteFill, Audio, spring, staticFile, useCurrentFrame } from "remotion";
import type { EasingFunction, SpringConfig } from "remotion";
import { ease, fonts, reel, sec } from "../brand/theme";
import { PhotoBackground } from "../components/PhotoBackground";
import { PostcardBack, SurfaceTint } from "../components/objects";
import { DREAM, Daydream } from "../components/rooms";
import { P } from "../components/premium";
import { progress } from "../lib/animation";
import { HeadlineIn } from "../templates/motion";
import { BLUR, PHOTO, SATURATION, STAGE, TINT } from "./PictureAPlaceBoard";

// The last word ends at 49.70 s.
export const PICTURE_A_PLACE_SECONDS = 49.9;

const TOP = 360;
const BOTTOM = 1250;

// VO cues (seconds), from the pauses in the voiceover.
const T = {
  sheep: 1.97, // "and counting sheep is too boring to help."
  boring: 3.4,
  picture: 5.03, // "Picturing a place you love works better."
  corner: 7.91, // "Counting only fills a corner of your mind,"
  worries: 10.63, // "so worries slip into the rest."
  rich: 12.89, // "But a rich scene,"
  sounds: 14.18, // "with sounds and smells, fills the whole room."
  fills: 15.6,
  study: 17.83, // "In an Oxford study of people with insomnia,"
  pictured: 20.24, // "those who pictured a calm scene said they fell asleep faster than people told to just distract themselves."
  faster: 22.9,
  named: 26.47, // "It's called imagery distraction."
  how: 28.62, // "Here's how it works."
  pick: 29.98, // "Pick a calm place you love,"
  beach: 31.96, // "like a beach."
  sand: 33.0, // "Feel the warm sand under your feet."
  waves: 35.72, // "Hear the waves roll in."
  salt: 37.68, // "Smell the salt."
  light: 39.32, // "Watch the light on the water."
  worry: 41.27, // "If a worry drifts in,"
  fight: 42.65, // "don't fight it."
  walk: 43.74, // "Just walk back to the waves."
  quiz: 45.69, // "See what's keeping you up with the sleep quiz in our bio,"
  bio: 47.6,
  when: 48.74, // "for nights when…"
};

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const prog = (f: number, s: number, frames: number, e: EasingFunction = ease.out) => progress(f, sec(s), frames, e);

// Springs, as in BedLearnedIt: unhurried, low bounce; the beach scene settles slowly.
const SP: Partial<SpringConfig> = { damping: 16, stiffness: 70, mass: 1 };
const SLOW: Partial<SpringConfig> = { damping: 18, stiffness: 40, mass: 1 };
const POP: Partial<SpringConfig> = { damping: 14, stiffness: 150, mass: 0.8 };
const spf = (f: number, s: number, config: Partial<SpringConfig> = SP, delay = 0) =>
  spring({ frame: Math.max(0, f - sec(s) - delay), fps: reel.fps, config });
/** A point along a gentle curve from `a` to `b`. */
const arc = (a: [number, number], b: [number, number], k: number, bend: number): [number, number] => {
  const mx = (a[0] + b[0]) / 2 - (b[1] - a[1]) * bend;
  const my = (a[1] + b[1]) / 2 + (b[0] - a[0]) * bend;
  const u = 1 - k;
  return [u * u * a[0] + 2 * u * k * mx + k * k * b[0], u * u * a[1] + 2 * u * k * my + k * k * b[1]];
};

// The stage flips over for the quiz, and back onto the bedroom (frame 0).
const FLIP_IN = 45.45;
const FLIP_OUT = 48.55;
const FLIP = 0.5;

// The study: the room shrinks into the left of two small rooms while the stage glides up.
const STAGE_UP = 300;
const MINI = 320;
const MINI_GAP = 28;
const MINI_X = (STAGE.w - 2 * MINI - MINI_GAP) / 2;
const MINI_Y = 200;
const STUDY_IN = 17.7;
const STUDY_OUT = 26.35;
/** Minutes on the study clocks: one jump every two frames from `T.pictured`, stopping at `stop`. */
const minutes = (f: number, stop: number) => 60 + 3 * Math.floor(Math.max(0, Math.min(f, sec(stop)) - sec(T.pictured)) / 2);

// Each hop takes 1.5 s and they overlap, so all three are over before "Picturing a place".
const HOPS = [1.95, 2.65, 3.35];

const StageLayer: React.FC<{ f: number }> = ({ f }) => {
  const t = f / reel.fps;

  // Flips: the content swaps at the halfway point; after the second flip the bedroom is back to frame 0.
  const flipIn = clamp01((t - FLIP_IN) / FLIP);
  const flipOut = clamp01((t - FLIP_OUT) / FLIP);
  const flip = t < FLIP_OUT ? flipIn : flipOut;
  const showCard = t >= FLIP_IN + FLIP / 2 && t < FLIP_OUT + FLIP / 2;
  const reset = t >= FLIP_OUT + FLIP / 2;
  const sx = Math.abs(Math.cos(Math.PI * ease.inOutCubic(flip)));

  // The study: shrink into the left mini room, the stage glides up, the other room pops in beside it.
  const shrink = spf(f, STUDY_IN, SP) - spf(f, STUDY_OUT, SP);
  const studyOn = t > STUDY_IN && t < STUDY_OUT + 1.6;
  const stageY = lerp(STAGE.y, STAGE_UP, shrink);
  const box = { x: lerp(0, MINI_X, shrink), y: lerp(0, MINI_Y, shrink), w: lerp(STAGE.w, MINI, shrink) };
  const other = studyOn ? spf(f, STUDY_IN + 0.35, POP) * (1 - prog(f, STUDY_OUT - 0.1, 9)) : 0;
  const captions = studyOn ? prog(f, STUDY_IN + 0.7, 14) * (1 - prog(f, STUDY_OUT - 0.2, 8)) : 0;
  const clocks = studyOn ? spf(f, T.pictured - 0.2, POP) * (1 - prog(f, STUDY_OUT - 0.2, 8)) : 0;

  // The sheep: a pen grows in the corner, three hop the fence, the next lies down. Gone after the study.
  const before = t < STUDY_IN + 1;
  const pen = before && !reset ? spf(f, T.sheep, SP) : 0;
  const jumped = HOPS.map((h) => prog(f, h, 45, ease.linear));
  const bored = spf(f, 4.75, SLOW);
  const corner = prog(f, T.corner + 0.1, 18, ease.inOutCubic) * (1 - prog(f, T.worries - 0.2, 18, ease.inOutCubic));
  const worries = before && !reset ? [0, 1, 2, 3].map((i) => spf(f, T.worries + 0.05, SP, i * 9)) : [];

  // The beach picture on the right wall: swings into view for "Picturing a place", again for "a rich scene" and grows on
  // "fills the whole room"; shrinks back and swings flat on "Here's how it works"; swings out on "Pick" and grows again on
  // "like a beach" (and this time the bed goes).
  const swing1 = spf(f, T.picture, SP) - spf(f, T.corner - 0.2, SP);
  const swing2 = spf(f, T.rich, SP) - spf(f, T.how + 0.5, SP);
  const swing3 = spf(f, T.pick, SP);
  const grow1 = spf(f, T.fills, SLOW) - spf(f, T.how, SP);
  const grow2 = spf(f, T.beach, SLOW);
  const inBeach = t >= T.beach && !reset;
  const swing = reset ? 0 : clamp01(swing1 + swing2 + swing3);
  const card = reset ? 0 : clamp01(inBeach ? grow2 : grow1);
  const room = reset ? 1 : 1 - clamp01(spf(f, T.beach + 0.3, SLOW));

  // You: on the pillow until "like a beach", then onto the sand, then down to the water's edge.
  const toSand = spf(f, T.beach + 0.2, SLOW);
  const toShore = spf(f, T.walk + 0.1, SLOW);
  let glow: [number, number] = DREAM.pillow;
  if (!reset && t >= T.beach) glow = t < T.walk ? arc(DREAM.pillow, DREAM.sand, toSand, 0.2) : arc(DREAM.sand, DREAM.shore, toShore, -0.2);

  // How awake you are: restless in the bedroom (breathing a little fast), calmer once the scene fills the room.
  let heat = 1.2 + 0.15 * prog(f, T.worries, 20) - 0.45 * prog(f, T.fills, 40) + 0.15 * prog(f, T.named, 20);
  if (inBeach) heat = lerp(heat, 0.45, toSand);
  // "A corner of your mind": the glow leaves your head for the sheep.
  heat *= 1 - 0.85 * corner;
  if (reset) heat = 1.2;
  const restless = !inBeach || reset;
  heat *= restless ? 1 + 0.07 * Math.sin((t / 1.3) * Math.PI * 2) : 1;
  // In the study, the calm-scene room falls asleep first.
  const asleep = prog(f, T.faster, 30, ease.inOutCubic) * (1 - prog(f, STUDY_OUT, 30));

  // The beach.
  const wave1 = prog(f, T.waves + 0.15, 48, ease.linear);
  const wave2 = prog(f, T.walk + 0.4, 48, ease.linear);
  const fx = {
    phase: f,
    steps: prog(f, T.sand + 0.2, 40, ease.inOutCubic),
    wave: t < T.walk ? wave1 : wave2,
    salt: prog(f, T.salt, 15) * (1 - prog(f, T.light + 0.3, 20)),
    light: prog(f, T.light, 18) * (1 - 0.6 * prog(f, T.fight, 30)) * (1 - prog(f, T.walk + 0.5, 30)),
    drift: t > T.worry ? { p: spf(f, T.worry, SLOW), out: prog(f, T.walk + 0.7, 40, ease.inOutCubic), text: "Are they mad at me?" } : undefined,
  };

  const postmark = spf(f, T.bio, { damping: 12, stiffness: 220, mass: 0.7 });
  const caption = (text: string) => (
    <div style={{ fontFamily: fonts.sans, fontSize: 30, fontWeight: 600, color: P.ink, textAlign: "center", marginTop: 26, lineHeight: 1.15, opacity: captions }}>{text}</div>
  );

  return (
    <>
      <div style={{ position: "absolute", left: STAGE.x, top: stageY, width: STAGE.w, height: STAGE.h, transform: `scaleX(${Math.max(0.001, sx)})` }}>
        {showCard ? (
          <PostcardBack w={STAGE.w} h={STAGE.h} postmark={t >= T.bio ? postmark : 0} />
        ) : (
          <>
            {/* The stage itself, only visible as a frame once the room has shrunk away from it. */}
            {shrink > 0.01 ? (
              <div style={{ position: "absolute", inset: 0, borderRadius: 45, border: "3px solid rgba(243,238,230,0.22)", background: "linear-gradient(170deg, rgba(255,255,255,0.05), rgba(5,6,16,0.35))", opacity: clamp01(shrink * 2) }} />
            ) : null}
            {other > 0.01 ? (
              <div style={{ position: "absolute", left: MINI_X + MINI + MINI_GAP, top: MINI_Y, width: MINI, opacity: clamp01(other * 1.5), transform: `scale(${0.8 + 0.2 * other})`, transformOrigin: "50% 40%" }}>
                <Daydream w={MINI} glow={DREAM.pillow} heat={1.1 * (1 + 0.07 * Math.sin((t / 1.3) * Math.PI * 2))} cardIn={0} clock={clocks > 0.01 ? minutes(f, STUDY_OUT) : undefined} />
                {caption("Just distracted")}
              </div>
            ) : null}
            <div style={{ position: "absolute", left: box.x, top: box.y, width: box.w }}>
              <Daydream
                w={box.w}
                glow={glow}
                heat={studyOn ? heat * (1 - asleep) : heat}
                room={room}
                pen={pen}
                jumped={jumped}
                bored={bored}
                corner={corner}
                worries={worries}
                card={card}
                swing={swing}
                fx={fx}
                clock={clocks > 0.01 && shrink > 0.5 ? minutes(f, T.faster) : undefined}
              />
              {studyOn && shrink > 0.5 ? caption("Pictured a calm scene") : null}
            </div>
          </>
        )}
      </div>
      {/* The study, named on screen under the stage. */}
      <div style={{ position: "absolute", top: STAGE_UP + STAGE.h + 26, left: STAGE.x, width: STAGE.w, textAlign: "center", fontFamily: fonts.sans, fontSize: 28, fontWeight: 500, color: P.dim, opacity: captions }}>
        Harvey &amp; Payne, University of Oxford, 2002
      </div>
    </>
  );
};

const LOOP_FADE = PICTURE_A_PLACE_SECONDS - 0.35;
const HOOK = "Your mind *won't switch off.*";
const supers: Array<{ at: number; out: number; y: number; text: string }> = [
  { at: T.sheep, out: 4.75, y: TOP, text: "Counting sheep? *Too boring.*" },
  { at: T.picture, out: 7.55, y: TOP, text: "Picturing a place *works better.*" },
  { at: T.corner, out: 10.3, y: TOP, text: "Counting fills *one corner.*" },
  { at: T.worries, out: 12.55, y: TOP, text: "Worries slip *into the rest.*" },
  { at: T.rich, out: 17.35, y: TOP, text: "A rich scene *fills the whole room.*" },
  { at: T.study + 0.1, out: 19.9, y: BOTTOM, text: "An Oxford *insomnia study.*" },
  { at: T.pictured, out: 26.0, y: BOTTOM, text: "Calm scene: *asleep faster.*" },
  { at: T.named, out: 29.6, y: TOP, text: "It's called *imagery distraction.*" },
  { at: T.pick, out: 32.65, y: TOP, text: "Pick a place you love. *Like a beach.*" },
  { at: T.sand, out: 35.35, y: TOP, text: "Feel *the warm sand.*" },
  { at: T.waves, out: 37.35, y: TOP, text: "Hear *the waves roll in.*" },
  { at: T.salt, out: 38.95, y: TOP, text: "Smell *the salt.*" },
  { at: T.light, out: 40.9, y: TOP, text: "Watch *the light on the water.*" },
  { at: T.worry, out: 43.4, y: TOP, text: "A worry drifts in? *Don't fight it.*" },
  { at: T.walk, out: 45.35, y: TOP, text: "Just walk *back to the waves.*" },
  { at: T.quiz, out: 48.4, y: TOP, text: "See *what's keeping you up.*" },
];

export const PictureAPlace: React.FC = () => {
  const f = useCurrentFrame();
  const loop = prog(f, LOOP_FADE, 10);
  return (
    <SurfaceTint.Provider value={TINT}>
      <AbsoluteFill>
        {/* The lake photo behind frosted, darkened glass, so the stage and type stay readable. */}
        <PhotoBackground photo={PHOTO} blur={BLUR} calm={0.5} saturation={SATURATION} />
        <AbsoluteFill style={{ background: "linear-gradient(170deg, rgba(255,255,255,0.05), rgba(5,6,16,0.3))" }} />
        <Audio src={staticFile("audio/picture-a-place-vo.mp3")} />
        <StageLayer f={f} />
        {/* The hook is fully on screen in the first frame, and fades back in over the last frames so the loop is seamless. */}
        <HeadlineIn y={TOP} size={100} text={HOOK} at={-3} out={T.sheep - 0.4} align="center" />
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
