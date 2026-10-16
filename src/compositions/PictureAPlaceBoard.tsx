// Storyboard for PictureAPlace (Oct 16): one still per beat (frame i = panel i + 1).
// Running metaphor: your mind is a bedroom seen from above. Counting sheep only fills one corner, so worries slip onto
// the rest of the floor; a beach postcard on the nightstand grows until the scene fills the whole room. The quiz is
// written on the postcard's back. Polish rules from BedLearnedIt: one fixed stage, supers above it (bottom once, for the
// study), new objects grow out of the room, the dot is you.
// Rendered to a labelled sheet with scripts/storyboard.mjs and docs/picture-a-place-board.json.
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { photos } from "../brand/photos";
import { fonts } from "../brand/theme";
import { PhotoBackground } from "../components/PhotoBackground";
import { PostcardBack, SurfaceTint } from "../components/objects";
import { DREAM, Daydream, ROOM_H, ROOM_W } from "../components/rooms";
import type { BeachFx } from "../components/rooms";
import { P } from "../components/premium";
import { HeadlineIn } from "../templates/motion";

export const BOARD_PANELS = 18;

// The lake photo instead of the seeded pick (which drew a grey sky): blue water under the beach.
export const PHOTO = photos.lake;
export const TINT = PHOTO.tint;
export const BLUR = 44;
export const SATURATION = 0.7;

/** The fixed stage: same place and size for the whole video. */
export const STAGE = { x: 146, y: 620, w: 720, h: (ROOM_H * 720) / ROOM_W };
const TOP = 360;
const BOTTOM = 1250;
/** For the study the stage glides up so the super can sit underneath. */
const STAGE_UP = 300;

const Super: React.FC<{ text: string; y?: number }> = ({ text, y = TOP }) => <HeadlineIn y={y} size={100} text={text} at={-3} align="center" />;
const Stage: React.FC<{ children: React.ReactNode; y?: number; sx?: number }> = ({ children, y = STAGE.y, sx = 1 }) => (
  <div style={{ position: "absolute", left: STAGE.x, top: y, width: STAGE.w, transform: `scaleX(${sx})` }}>{children}</div>
);
const Room: React.FC<Omit<React.ComponentProps<typeof Daydream>, "w">> = (p) => <Daydream w={STAGE.w} {...p} />;
/** The study, named on screen under the stage. */
const Source: React.FC = () => (
  <div style={{ position: "absolute", top: STAGE_UP + STAGE.h + 26, left: STAGE.x, width: STAGE.w, textAlign: "center", fontFamily: fonts.sans, fontSize: 28, fontWeight: 500, color: P.dim }}>
    Harvey &amp; Payne, University of Oxford, 2002
  </div>
);

/** Settled room after the worries: pen in the corner, notes on the floor, you awake on the pillow. */
const busy = { glow: DREAM.pillow, heat: 1.2, pen: 1, jumped: 3, bored: 1, worries: 4 };
const beach = (fx: BeachFx, glow: [number, number] = DREAM.sand) => ({ glow, heat: 0.45, room: 0, card: 1, fx: { phase: 40, ...fx } });

/** "In an Oxford study": the stage holds two small copies of the room, side by side. */
const Study: React.FC<{ asleep: number }> = ({ asleep }) => {
  const w = 320;
  const gap = 28;
  const left = (STAGE.w - 2 * w - gap) / 2;
  const top = 200;
  const caption = (text: string) => (
    <div style={{ fontFamily: fonts.sans, fontSize: 30, fontWeight: 600, color: P.ink, textAlign: "center", marginTop: 26, lineHeight: 1.15 }}>{text}</div>
  );
  return (
    <div style={{ position: "relative", width: STAGE.w, height: STAGE.h, borderRadius: 45, border: "3px solid rgba(243,238,230,0.22)", boxSizing: "border-box", background: "linear-gradient(170deg, rgba(255,255,255,0.05), rgba(5,6,16,0.35))" }}>
      <div style={{ position: "absolute", left, top, width: w }}>
        <Daydream w={w} glow={DREAM.pillow} heat={1.1 * (1 - asleep)} card={1} clock={60 + 40 * asleep} />
        {caption("Pictured a calm scene")}
      </div>
      <div style={{ position: "absolute", left: left + w + gap, top, width: w }}>
        <Daydream w={w} glow={DREAM.pillow} heat={1.1} cardIn={0} clock={60 + 140 * asleep} />
        {caption("Just distracted")}
      </div>
    </div>
  );
};

const panels: Array<() => React.ReactNode> = [
  // 1. Frame 0 / loop target: the bedroom from above, you wide awake on the pillow, the beach picture on the wall.
  () => (
    <>
      <Stage>
        <Room glow={DREAM.pillow} heat={1.3} />
      </Stage>
      <Super text="Your mind *won't switch off.*" />
    </>
  ),
  // 2. A fence grows in the corner; sheep hop it one by one, and the next one gives up and lies down.
  () => (
    <>
      <Stage>
        <Room glow={DREAM.pillow} heat={1.3} pen={1} jumped={2.5} bored={0.6} />
      </Stage>
      <Super text="Counting sheep? *Too boring.*" />
    </>
  ),
  // 3. The picture on the right wall swings out into view: a beach, from above.
  () => (
    <>
      <Stage>
        <Room glow={DREAM.pillow} heat={1.1} pen={1} jumped={3} bored={1} swing={1} />
      </Stage>
      <Super text="Picturing a place *works better.*" />
    </>
  ),
  // 4. Only the sheep's corner is lit; the rest of the room sits empty and dark.
  () => (
    <>
      <Stage>
        <Room glow={DREAM.pillow} heat={1.1} pen={1} jumped={3} bored={1} corner={1} />
      </Stage>
      <Super text="Counting fills *one corner.*" />
    </>
  ),
  // 5. Worry notes slip in across the rest of the floor.
  () => (
    <>
      <Stage>
        <Room {...busy} />
      </Stage>
      <Super text="Worries slip *into the rest.*" />
    </>
  ),
  // 6. The postcard grows from the nightstand until the beach fills the whole room, under the bed.
  () => (
    <>
      <Stage>
        <Room {...busy} heat={0.8} card={1} fx={{ phase: 30 }} />
      </Stage>
      <Super text="A rich scene *fills the whole room.*" />
    </>
  ),
  // 7. The stage glides up and splits into two small rooms; the super moves to the bottom with the source.
  () => (
    <>
      <Stage y={STAGE_UP}>
        <Study asleep={0} />
      </Stage>
      <Source />
      <Super y={BOTTOM} text="An Oxford *insomnia study.*" />
    </>
  ),
  // 8. The calm-scene room's clock stops early and its glow goes out (asleep); the other keeps ticking, still lit.
  () => (
    <>
      <Stage y={STAGE_UP}>
        <Study asleep={1} />
      </Stage>
      <Source />
      <Super y={BOTTOM} text="Calm scene: *asleep faster.*" />
    </>
  ),
  // 9. The two rooms merge back into one: you on the pillow, the beach picture on the wall.
  () => (
    <>
      <Stage>
        <Room glow={DREAM.pillow} heat={1} />
      </Stage>
      <Super text="It's called *imagery distraction.*" />
    </>
  ),
  // 10. The wall picture swings out and grows into the whole room; the bed fades; you glide onto the sand.
  () => (
    <>
      <Stage>
        <Room glow={[340, 240]} heat={0.7} room={0.4} card={0.75} swing={1} fx={{ phase: 50 }} />
      </Stage>
      <Super text="Pick a place you love. *Like a beach.*" />
    </>
  ),
  // 11. Footprints press into the sand behind you, one by one.
  () => (
    <>
      <Stage>
        <Room {...beach({ steps: 1 })} />
      </Stage>
      <Super text="Feel *the warm sand.*" />
    </>
  ),
  // 12. A wave washes up the sand toward you and slides back.
  () => (
    <>
      <Stage>
        <Room {...beach({ steps: 1, wave: 0.5 })} />
      </Stage>
      <Super text="Hear *the waves roll in.*" />
    </>
  ),
  // 13. Salt spray drifts up off the water.
  () => (
    <>
      <Stage>
        <Room {...beach({ steps: 1, salt: 1, phase: 70 })} />
      </Stage>
      <Super text="Smell *the salt.*" />
    </>
  ),
  // 14. Light glints on the water: the one amber moment.
  () => (
    <>
      <Stage>
        <Room {...beach({ steps: 1, light: 1, phase: 90 })} />
      </Stage>
      <Super text="Watch *the light on the water.*" />
    </>
  ),
  // 15. A worry note drifts in onto the sand. You don't move.
  () => (
    <>
      <Stage>
        <Room {...beach({ steps: 1, light: 0.4, drift: { p: 1, text: "Are they mad at me?" } })} />
      </Stage>
      <Super text="A worry drifts in? *Don't fight it.*" />
    </>
  ),
  // 16. You glide back down to the water's edge; the next wave carries the note away.
  () => (
    <>
      <Stage>
        <Room {...beach({ steps: 1, wave: 0.35, drift: { p: 1, out: 0.55, text: "Are they mad at me?" } }, DREAM.shore)} />
      </Stage>
      <Super text="Just walk *back to the waves.*" />
    </>
  ),
  // 17. The stage flips over: it's the postcard's back. The "Link in bio" postmark thumps on.
  () => (
    <>
      <Stage>
        <PostcardBack w={STAGE.w} h={STAGE.h} postmark={1} />
      </Stage>
      <Super text="See *what's keeping you up.*" />
    </>
  ),
  // 18. "For nights when…": it flips back to the bedroom, you awake on the pillow — frame 0.
  () => (
    <>
      <Stage sx={0.45}>
        <Room glow={DREAM.pillow} heat={1.3} />
      </Stage>
      <Super text="Your mind *won't switch off.*" />
    </>
  ),
];

export const PictureAPlaceBoard: React.FC = () => {
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
