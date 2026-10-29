// Storyboard for StayAwake (Oct 29): one still per beat (frame i = panel i + 1).
// Running metaphor: sleep is the moon over your bed. Chase it and it slips away; trying switches the lamp on (effort
// keeps you alert) and a worry lands on the bed. Lie in the dark, stop trying, and it drifts in to you on its own.
// Polish rules from BedLearnedIt: one fixed stage, supers above it (bottom once, for the study), new objects grow out of
// the room, the dot is you. Rendered to a labelled sheet with scripts/storyboard.mjs and docs/stay-awake-board.json.
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { photos } from "../brand/photos";
import { fonts } from "../brand/theme";
import { PhotoBackground } from "../components/PhotoBackground";
import { SurfaceTint } from "../components/objects";
import { DARK, DarkRoom, ROOM_H, ROOM_W } from "../components/rooms";
import { P } from "../components/premium";
import { HeadlineIn } from "../templates/motion";

export const BOARD_PANELS = 12;

// The seeded pick (lit olive trees) came out flat grey behind a dark room; the pine dusk (deep blue, not used yet) instead.
export const PHOTO = photos.pines;
export const TINT = PHOTO.tint;
export const BLUR = 44;
export const SATURATION = 0.7;

/** The fixed stage: same place and size for the whole video. */
export const STAGE = { x: 146, y: 620, w: 720, h: (ROOM_H * 720) / ROOM_W };
export const TOP = 360;
export const BOTTOM = 1250;
/** For the study the stage glides up so the super can sit underneath. */
export const STAGE_UP = 300;
export const SOURCE = "Broomfield & Espie, University of Glasgow, 2003";

const Super: React.FC<{ text: string; y?: number }> = ({ text, y = TOP }) => <HeadlineIn y={y} size={100} text={text} at={-3} align="center" />;
const Stage: React.FC<{ children: React.ReactNode; y?: number }> = ({ children, y = STAGE.y }) => (
  <div style={{ position: "absolute", left: STAGE.x, top: y, width: STAGE.w }}>{children}</div>
);
const Room: React.FC<Omit<React.ComponentProps<typeof DarkRoom>, "w">> = (p) => <DarkRoom w={STAGE.w} {...p} />;
/** The study, named on screen under the stage. */
export const Source: React.FC<{ o?: number }> = ({ o = 1 }) => (
  <div style={{ position: "absolute", top: STAGE_UP + STAGE.h + 26, left: STAGE.x, width: STAGE.w, textAlign: "center", fontFamily: fonts.sans, fontSize: 28, fontWeight: 500, color: P.dim, opacity: o }}>
    {SOURCE}
  </div>
);

/** Two weeks: fourteen tiny copies of the bedroom, one row per week. */
export const MINI = 92;
export const NIGHTS = 14;
export const miniSpots = () => {
  const h = (ROOM_H * MINI) / ROOM_W;
  const gapX = 8;
  const gapY = 56;
  const top = (STAGE.h - (2 * h + gapY)) / 2;
  const left = (STAGE.w - (7 * MINI + 6 * gapX)) / 2;
  return Array.from({ length: NIGHTS }, (_, i): [number, number] => [left + (i % 7) * (MINI + gapX), top + Math.floor(i / 7) * (h + gapY)]);
};
/** Night i of the two weeks: the worry gets smaller and the lamp dimmer, until both are gone. */
export const night = (i: number) => {
  const k = Math.max(0, 1 - i / (NIGHTS - 2));
  return { worry: { p: k > 0.05 ? 1 : 0, scale: 0.35 + 0.65 * k }, lamp: k, awake: 0.3 + 0.7 * k };
};
const Studies: React.FC = () => (
  <div style={{ position: "relative", width: STAGE.w, height: STAGE.h, borderRadius: 45, border: "3px solid rgba(243,238,230,0.22)", boxSizing: "border-box", background: "linear-gradient(170deg, rgba(255,255,255,0.05), rgba(5,6,16,0.35))" }}>
    {miniSpots().map(([x, y], i) => (
      <div key={i} style={{ position: "absolute", left: x, top: y }}>
        <DarkRoom w={MINI} mini {...night(i)} />
      </div>
    ))}
  </div>
);

const start = { awake: 1, moon: { x: DARK.foot[0], y: DARK.foot[1] } };
const away = { x: DARK.corner[0], y: DARK.corner[1], size: 70, o: 0.7 };

const panels: Array<() => React.ReactNode> = [
  // 1. Frame 0 / loop target: you wide awake on the pillow; sleep (the moon) floats over the foot of the bed.
  () => (
    <>
      <Stage>
        <Room {...start} />
      </Stage>
      <Super text="Trying hard *to fall asleep?*" />
    </>
  ),
  // 2. The turn. The moon drifts a little closer, a hint of the ending.
  () => (
    <>
      <Stage>
        <Room awake={0.8} moon={{ x: 320, y: 470 }} />
      </Stage>
      <Super text="Try *staying awake instead.*" />
    </>
  ),
  // 3. Its name. The room holds; the moon back over the foot of the bed.
  () => (
    <>
      <Stage>
        <Room {...start} />
      </Stage>
      <Super text="*Paradoxical intention.*" />
    </>
  ),
  // 4. Sleep is the moon: it brightens, the room dims around it.
  () => (
    <>
      <Stage>
        <Room awake={1} dim={0.55} moon={{ x: DARK.foot[0], y: DARK.foot[1], size: 110 }} />
      </Stage>
      <Super text="Sleep is like *a forgotten name.*" />
    </>
  ),
  // 5. You glide off the pillow after it (trail); it slips away to the far corner, a dashed ghost where it was.
  () => (
    <>
      <Stage>
        <Room glow={DARK.chase} trail={{ from: DARK.pillow, o: 1 }} awake={1} moon={{ ...away, ghost: DARK.foot, arrow: 1 }} />
      </Stage>
      <Super text="Chase it, *it slips away.*" />
    </>
  ),
  // 6. Back on the pillow; the bedside lamp clicks on and light fills the room.
  () => (
    <>
      <Stage>
        <Room awake={1} lamp={1} moon={away} />
      </Stage>
      <Super text="Trying puts you *in effort mode.*" />
    </>
  ),
  // 7. A worry lands on the bed, over you: What if I can't sleep?
  () => (
    <>
      <Stage>
        <Room awake={1} lamp={1} moon={away} worry={{ p: 1 }} />
      </Stage>
      <Super text="Effort *keeps you alert.*" />
    </>
  ),
  // 8. Swap: super to the bottom. The stage glides up and splits into two weeks of nights (two rows of seven tiny
  // bedrooms); night by night the worry shrinks and the lamp dims, until both are gone. Source under the stage.
  () => (
    <>
      <Stage y={STAGE_UP}>
        <Studies />
      </Stage>
      <Source />
      <Super y={BOTTOM} text="Two weeks: *less worry about sleep.*" />
    </>
  ),
  // 9. One room again, lamp off, no worry: you lie in the dark, awake but calm.
  () => (
    <>
      <Stage>
        <Room awake={0.45} moon={away} />
      </Stage>
      <Super text="Lie in the dark, *eyes open.*" />
    </>
  ),
  // 10. The right bedside table grows into a clock that ticks on; the moon drifts in by itself and settles beside you,
  // turning amber (the one amber moment); your glow fades: asleep.
  () => (
    <>
      <Stage>
        <Room awake={0.3} asleep={0.7} moon={{ x: DARK.near[0], y: DARK.near[1], amber: 1, size: 90 }} clock={{ p: 1, minutes: 12, wedge: { from: 0, to: 2.4 } }} />
      </Stage>
      <Super text="*Stay awake a little longer.*" />
    </>
  ),
  // 11. The clock shrinks back; a note to self grows out of the bedside table and fills the room. The box ticks.
  () => (
    <>
      <Stage>
        <Room awake={0.3} asleep={0.7} note={{ p: 1, tick: 1 }} />
      </Stage>
      <Super text="See *what's keeping you up.*" />
    </>
  ),
  // 12. The note folds back into the table, the moon slips back to the foot of the bed, you're wide awake: frame 0.
  () => (
    <>
      <Stage>
        <Room {...start} />
      </Stage>
      <Super text="Trying hard *to fall asleep?*" />
    </>
  ),
];

export const StayAwakeBoard: React.FC = () => {
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
