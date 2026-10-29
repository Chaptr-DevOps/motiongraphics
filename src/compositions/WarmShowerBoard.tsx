// Storyboard for WarmShower (Oct 29): one still per beat (frame i = panel i + 1).
// Running metaphor: your heat, seen from above. In the shower you glow hot; the heat flows out to your hands and feet,
// drawn as four small radiators around you that shimmer it away, and that takes time (a clock grows out of the basin).
// Go straight to bed and you're still glowing. The quiz is written in the fogged bathroom mirror.
// Polish rules from BedLearnedIt: one fixed stage, supers above it (bottom once, for the study), new objects grow out of
// the room, the dot is you. Rendered to a labelled sheet with scripts/storyboard.mjs and docs/warm-shower-board.json.
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { pickPhoto } from "../brand/photos";
import { fonts } from "../brand/theme";
import { PhotoBackground } from "../components/PhotoBackground";
import { SurfaceTint } from "../components/objects";
import { ROOM_H, ROOM_W, ShowerRoom, WARM } from "../components/rooms";
import { P } from "../components/premium";
import { HeadlineIn } from "../templates/motion";

export const BOARD_PANELS = 13;

// The seeded pick: a deep blue sky, which suits a video about cooling down.
export const PHOTO = pickPhoto("warm-shower");
export const TINT = PHOTO.tint;
export const BLUR = 44;
export const SATURATION = 0.7;

/** The fixed stage: same place and size for the whole video. */
export const STAGE = { x: 146, y: 620, w: 720, h: (ROOM_H * 720) / ROOM_W };
export const TOP = 360;
export const BOTTOM = 1250;
/** For the study the stage glides up so the super can sit underneath. */
export const STAGE_UP = 300;
export const SOURCE = "Haghayegh et al., UT Austin, 2019";

const Super: React.FC<{ text: string; y?: number }> = ({ text, y = TOP }) => <HeadlineIn y={y} size={100} text={text} at={-3} align="center" />;
const Stage: React.FC<{ children: React.ReactNode; y?: number }> = ({ children, y = STAGE.y }) => (
  <div style={{ position: "absolute", left: STAGE.x, top: y, width: STAGE.w }}>{children}</div>
);
const Room: React.FC<Omit<React.ComponentProps<typeof ShowerRoom>, "w">> = (p) => <ShowerRoom w={STAGE.w} phase={20} {...p} />;
/** The study, named on screen under the stage. */
export const Source: React.FC<{ o?: number }> = ({ o = 1 }) => (
  <div style={{ position: "absolute", top: STAGE_UP + STAGE.h + 26, left: STAGE.x, width: STAGE.w, textAlign: "center", fontFamily: fonts.sans, fontSize: 28, fontWeight: 500, color: P.dim, opacity: o }}>
    {SOURCE}
  </div>
);

/** Seventeen studies: seventeen tiny copies of the shower, in rows of 4, 5, 4, 4. */
export const ROWS = [4, 5, 4, 4];
export const MINI = 118;
export const miniSpots = () => {
  const h = (ROOM_H * MINI) / ROOM_W;
  const gapX = 18;
  const gapY = 24;
  const top = (STAGE.h - (ROWS.length * h + (ROWS.length - 1) * gapY)) / 2;
  const out: Array<[number, number]> = [];
  ROWS.forEach((n, r) => {
    const left = (STAGE.w - (n * MINI + (n - 1) * gapX)) / 2;
    for (let i = 0; i < n; i++) out.push([left + i * (MINI + gapX), top + r * (h + gapY)]);
  });
  return out;
};
const Studies: React.FC = () => (
  <div style={{ position: "relative", width: STAGE.w, height: STAGE.h, borderRadius: 45, border: "3px solid rgba(243,238,230,0.22)", boxSizing: "border-box", background: "linear-gradient(170deg, rgba(255,255,255,0.05), rgba(5,6,16,0.35))" }}>
    {miniSpots().map(([x, y], i) => (
      <div key={i} style={{ position: "absolute", left: x, top: y }}>
        <ShowerRoom w={MINI} glow={WARM.shower} heat={1} spray={1} phase={i * 9} />
      </div>
    ))}
  </div>
);

const shower = { glow: WARM.shower, heat: 1, spray: 1, steam: 1 };

const panels: Array<() => React.ReactNode> = [
  // 1. Frame 0 / loop target: the bathroom from above, you under the shower, glowing hot, steam rising.
  () => (
    <>
      <Stage>
        <Room {...shower} />
      </Stage>
      <Super text="Shower *right before bed?*" />
    </>
  ),
  // 2. A clock grows out of the basin: bedtime (the moon) at the top, the hour before it shaded.
  () => (
    <>
      <Stage>
        <Room {...shower} clock={{ p: 1, from: "basin", minutes: 720, moon: 1, wedge: { from: 11, to: 12 } }} />
      </Stage>
      <Super text="You're *an hour too late.*" />
    </>
  ),
  // 3. Same shower, same length: the hands wind back an hour.
  () => (
    <>
      <Stage>
        <Room {...shower} clock={{ p: 1, from: "basin", minutes: 660, moon: 1, wedge: { from: 11, to: 12 } }} />
      </Stage>
      <Super text="Not longer. *Just earlier.*" />
    </>
  ),
  // 4. The bathroom morphs into the bedroom; you glide onto the pillow and your glow shrinks: cooling down.
  () => (
    <>
      <Stage>
        <Room bed={1} glow={WARM.pillow} heat={0.25} />
      </Stage>
      <Super text="To sleep, *your body cools down.*" />
    </>
  ),
  // 5. Back in the shower: four radiators spring up around you and the heat flows out to them along dotted paths.
  () => (
    <>
      <Stage>
        <Room {...shower} steam={0.6} radiators={1} flow={1} />
      </Stage>
      <Super text="Heat flows out *to hands and feet.*" />
    </>
  ),
  // 6. The radiators warm up and shimmer the heat away; your glow gets smaller.
  () => (
    <>
      <Stage>
        <Room glow={WARM.shower} heat={0.6} steam={0.3} radiators={1} flow={0.4} radiate={1} />
      </Stage>
      <Super text="They work *like radiators.*" />
    </>
  ),
  // 7. The clock grows out of the basin and ticks while the radiators keep working.
  () => (
    <>
      <Stage>
        <Room glow={WARM.shower} heat={0.55} radiators={1} radiate={0.8} clock={{ p: 1, from: "basin", minutes: 20, wedge: { from: 0, to: 4 } }} />
      </Stage>
      <Super text="Cooling *takes time.*" />
    </>
  ),
  // 8. Straight to bed (a quick morph): you're on the pillow, still glowing hot.
  () => (
    <>
      <Stage>
        <Room bed={1} glow={WARM.pillow} heat={0.95} />
      </Stage>
      <Super text="Straight to bed? *Still warm.*" />
    </>
  ),
  // 9. The stage glides up; the shower splits into seventeen tiny showers, one per study. Source under the stage.
  () => (
    <>
      <Stage y={STAGE_UP}>
        <Studies />
      </Stage>
      <Source />
      <Super y={BOTTOM} text="UT Austin *pooled 17 studies.*" />
    </>
  ),
  // 10. They pool back into one shower. The clock grows out of the basin: one to two hours before the moon, in amber.
  () => (
    <>
      <Stage>
        <Room {...shower} clock={{ p: 1, from: "basin", minutes: 630, moon: 1, wedge: { from: 10, to: 11, amber: true } }} />
      </Stage>
      <Super text="Shower *1–2 hours before bed.*" />
    </>
  ),
  // 11. Into bed, cooled: your glow goes out (asleep). The bedside clock: asleep ten minutes before the dashed hand.
  () => (
    <>
      <Stage>
        <Room bed={1} glow={WARM.pillow} heat={0.2} asleep={1} clock={{ p: 1, from: "nightstand", minutes: 20, ghost: 30, wedge: { from: 4, to: 6 } }} />
      </Stage>
      <Super text="Asleep *about 10 minutes faster.*" />
    </>
  ),
  // 12. Back in the bathroom: the mirror swings up off the wall, fills the stage, and the quiz is written in the fog.
  () => (
    <>
      <Stage>
        <Room glow={WARM.shower} heat={0.8} mirror={{ swing: 1, grow: 1, write: 1 }} />
      </Stage>
      <Super text="See *what's keeping you up.*" />
    </>
  ),
  // 13. The last frames fade back to frame 0: the shower, you glowing hot.
  () => (
    <>
      <Stage>
        <Room {...shower} />
      </Stage>
      <Super text="Shower *right before bed?*" />
    </>
  ),
];

export const WarmShowerBoard: React.FC = () => {
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
