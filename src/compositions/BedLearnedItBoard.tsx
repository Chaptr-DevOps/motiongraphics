// Storyboard v3 for BedLearnedIt (Oct 15): one still per beat (frame i = panel i + 1).
// Polish pass agreed with the user: one fixed stage that never moves (supers always above it); new objects grow out of
// the room (the nightstand becomes a clock, the week is seven tiny bedrooms, the quiz is the stage flipped over); one
// signature transition (the head's glow swells to fill the stage, then the next room resolves); no tags except the amber
// "Get up"; the fridge alone for the kitchen; one move at a time.
// Rendered to a labelled sheet with scripts/storyboard.mjs and docs/bed-learned-it-board.json.
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { photos } from "../brand/photos";
import { fonts } from "../brand/theme";
import { PhotoBackground } from "../components/PhotoBackground";
import { Button, Glyph, LINE, SurfaceTint, TapRing, useSurface } from "../components/objects";
import { ROOM_H, ROOM_W, ROOMS_MORPH, RoomMorph } from "../components/rooms";
import type { RoomKey } from "../components/rooms";
import { P } from "../components/premium";
import { HeadlineIn } from "../templates/motion";

export const BOARD_PANELS = 12;

// The user picked this photo (Oct 15): stars over a pine treeline, deep blue sky. It replaces the seeded pickPhoto.
export const PHOTO = photos.starsTreeline;
// Object surfaces take the sky's measured blue (12, 26, 48), not the whole photo's average (which the green trees pull
// toward grey), and the photo keeps its full colour, so the stage sits in the same night blue as the sky.
export const TINT: [number, number, number] = [12, 26, 48];
export const BLUR = 30;
export const SATURATION = 1;

// Earlier floor-plan routes, still used by the old covers.
export const ROUTES = {
  toFridge: "M 200 440 C 200 370, 250 300, 300 220",
  bedToDoor: "M 560 240 C 530 330, 470 370, 430 380",
  chairToBed: "M 596 604 C 588 540, 546 494, 530 455",
};

/** Centre of QuizBack's Start button, in stage coordinates. */
export const QUIZ_TAP = { x: 360, y: 650 };

/** The fixed stage: same place and size for the whole video. */
export const STAGE = { x: 146, y: 620, w: 720, h: (ROOM_H * 720) / ROOM_W };
const TOP = 360;
const at = (r: RoomKey) => ROOMS_MORPH[r].glow;

const Super: React.FC<{ text: string }> = ({ text }) => <HeadlineIn y={TOP} size={100} text={text} at={-3} align="center" />;
const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: STAGE.x, top: STAGE.y }}>{children}</div>
);

/** The empty stage frame (same look as the room window). */
export const StageFrame: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      borderRadius: 45,
      border: `${LINE}px solid rgba(243,238,230,0.22)`,
      background: "linear-gradient(170deg, rgba(255,255,255,0.05), rgba(5,6,16,0.35))",
      boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
      ...style,
    }}
  />
);

/** "Every night": the stage holds a week of tiny bedrooms, Mon–Sun; nights that have happened show you awake. */
export const WeekOfNights: React.FC<{ awake: number }> = ({ awake }) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const cell = 150;
  const gap = 18;
  const cellH = (ROOM_H * cell) / ROOM_W;
  const row = (from: number, n: number, y: number) =>
    days.slice(from, from + n).map((d, j) => {
      const i = from + j;
      const on = Math.min(1, Math.max(0, awake - i));
      const left = (STAGE.w - (n * cell + (n - 1) * gap)) / 2 + j * (cell + gap);
      return (
        <div key={d} style={{ position: "absolute", left, top: y }}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: on > 0.5 ? P.ink : P.dim,
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            {d}
          </div>
          <RoomMorph w={cell} a="bed" glow={on > 0.01 ? at("bed") : null} heat={on} dim={0.45 + 0.55 * on} />
        </div>
      );
    });
  const top = (STAGE.h - (2 * (cellH + 42) + 30)) / 2;
  return (
    <div style={{ position: "relative", width: STAGE.w, height: STAGE.h }}>
      <StageFrame />
      {row(0, 4, top)}
      {row(4, 3, top + cellH + 42 + 30)}
    </div>
  );
};

/** The back of the stage: the sleep quiz, as the next stop. */
/** `press` 0..1 squashes Start as it is tapped; its centre is QUIZ_TAP in stage coordinates. */
export const QuizBack: React.FC<{ started?: boolean; press?: number }> = ({ started, press }) => {
  const s = useSurface();
  return (
    <div
      style={{
        position: "relative",
        width: STAGE.w,
        height: STAGE.h,
        borderRadius: 45,
        boxSizing: "border-box",
        border: `${LINE}px solid rgba(243,238,230,0.4)`,
        background: `linear-gradient(170deg, ${s(0.1, 0.2, 0.97)}, ${s(0.04, 0.4, 0.97)})`,
        boxShadow: "0 40px 90px rgba(0,0,0,0.5)",
        fontFamily: fonts.sans,
        color: P.ink,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          border: `${LINE}px solid rgba(243,238,230,0.5)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 44,
        }}
      >
        <Glyph kind="moon" size={58} />
      </div>
      <div style={{ fontSize: 24, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: P.dim }}>Next stop · 2 minutes</div>
      <div style={{ fontSize: 72, fontWeight: 600, letterSpacing: "-0.03em", marginTop: 16 }}>Take the sleep quiz</div>
      <div style={{ fontSize: 36, fontWeight: 500, marginTop: 14 }}>Find your sleep pattern</div>
      <div style={{ fontSize: 30, fontWeight: 500, color: P.dim, marginTop: 10 }}>Link in bio</div>
      <div style={{ marginTop: 56 }}>
        <Button text={started ? "Started" : "Start"} filled done={started} press={press} size={36} />
      </div>
    </div>
  );
};

const panels: Array<() => React.ReactNode> = [
  // 1. Frame 0 / loop target: the couch, head on the arm rest, glow soft.
  () => (
    <>
      <Stage>
        <RoomMorph w={STAGE.w} a="couch" glow={at("couch")} heat={0.3} />
      </Stage>
      <Super text="Couch: sleepy. *Bed: wide awake.*" />
    </>
  ),
  // 2. The couch morphs into the bed (the one true morph: frame → bed, cushions → pillows, blanket → duvet).
  () => (
    <>
      <Stage>
        <RoomMorph w={STAGE.w} a="couch" b="bed" k={0.8} glow={[240, 238]} heat={0.35} />
      </Stage>
      <Super text="Couch: sleepy. *Bed: wide awake.*" />
    </>
  ),
  // 3. Head on the pillow, glow flares: wide awake.
  () => (
    <>
      <Stage>
        <RoomMorph w={STAGE.w} a="bed" glow={at("bed")} heat={1} />
      </Stage>
      <Super text="Couch: sleepy. *Bed: wide awake.*" />
    </>
  ),
  // 4. Same bed, glow stronger: it learned this.
  () => (
    <>
      <Stage>
        <RoomMorph w={STAGE.w} a="bed" glow={at("bed")} heat={1.25} />
      </Stage>
      <Super text="Not random. *Your bed learned it.*" />
    </>
  ),
  // 5. The bedroom shrinks into Monday; the week fills with the same bed, night after night.
  () => (
    <>
      <Stage>
        <WeekOfNights awake={5} />
      </Stage>
      <Super text="Your brain *pairs bed with alert.*" />
    </>
  ),
  // 6. Signature transition: the glow swells to fill the stage...
  () => (
    <>
      <Stage>
        <RoomMorph w={STAGE.w} a="bed" glow={at("bed")} heat={1.3} iris={0.6} />
      </Stage>
      <Super text="Like a kitchen *makes you hungry.*" />
    </>
  ),
  // 7. ...and resolves into the fridge, door open, light falling out toward you.
  () => (
    <>
      <Stage>
        <RoomMorph w={STAGE.w} a="fridge" glow={at("fridge")} heat={0.85} fridge={1} />
      </Stage>
      <Super text="Like a kitchen *makes you hungry.*" />
    </>
  ),
  // 8. Back in bed: the nightstand grows into a clock, ticking hours away.
  () => (
    <>
      <Stage>
        <RoomMorph w={STAGE.w} a="bed" glow={at("bed")} heat={1.6} clock={{ p: 1, minutes: 470 }} />
      </Stage>
      <Super text="Staying in longer *makes it stronger.*" />
    </>
  ),
  // 9. The fix has a name. Clock back to a nightstand; the head still lit on the pillow.
  () => (
    <>
      <Stage>
        <RoomMorph w={STAGE.w} a="bed" glow={at("bed")} heat={1.3} />
      </Stage>
      <Super text="The fix: *stimulus control.*" />
    </>
  ),
  // 10. Get up: the head leaves the pillow for the floor beside the bed. The only tag, in amber.
  () => (
    <>
      <Stage>
        <RoomMorph w={STAGE.w} a="bed" glow={[572, 430]} heat={0.6} tags={[{ x: 572, y: 530, text: "Get up", icon: "up", amber: true }]} tagSize={32} />
      </Stage>
      <Super text="Trying feels like work? *Get up.*" />
    </>
  ),
  // 11. (Glow transition.) The armchair: dim lamp, a dull book, the glow calm.
  () => (
    <>
      <Stage>
        <RoomMorph w={STAGE.w} a="chair" glow={at("chair")} heat={0.3} lamp={1} book={1} />
      </Stage>
      <Super text="Somewhere dim. *Something dull.*" />
    </>
  ),
  // 12. The stage flips over: the quiz is on the back. (After the tap it flips again to the couch, frame 0.)
  () => (
    <>
      <Stage>
        <QuizBack started />
        <TapRing x={STAGE.w / 2} y={650} r={60} opacity={0.7} />
      </Stage>
      <Super text="Find *your pattern.*" />
    </>
  ),
];

export const BedLearnedItBoard: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SurfaceTint.Provider value={TINT}>
      <AbsoluteFill>
        <PhotoBackground photo={PHOTO} blur={BLUR} calm={0.5} saturation={SATURATION} />
        <AbsoluteFill style={{ background: "linear-gradient(170deg, rgba(255,255,255,0.05), rgba(5,6,16,0.3))" }} />
        {panels[Math.min(frame, panels.length - 1)]()}
      </AbsoluteFill>
    </SurfaceTint.Provider>
  );
};
