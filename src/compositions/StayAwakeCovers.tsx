// Cover options for StayAwake, built for a profile grid (a small 3:4 tile cropped from the middle, y 240–1680).
// Frame i = option i. White Instrument Sans 600, the turn in amber, one big object from the video.
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { fonts } from "../brand/theme";
import { PhotoBackground } from "../components/PhotoBackground";
import { SurfaceTint } from "../components/objects";
import { DARK, DarkRoom, PillowRoom } from "../components/rooms";
import { P } from "../components/premium";
import { BLUR, PHOTO, SATURATION, TINT } from "./StayAwakeBoard";

export const COVER_OPTIONS = 3;

/** Lines of cover type; `amberFrom` turns that line and the ones after it amber. */
const Title: React.FC<{ y: number; size: number; lines: string[]; amberFrom?: number }> = ({ y, size, lines, amberFrom }) => (
  <div
    style={{
      position: "absolute",
      top: y,
      left: 50,
      right: 50,
      textAlign: "center",
      fontFamily: fonts.sans,
      fontWeight: 600,
      fontSize: size,
      lineHeight: 0.98,
      letterSpacing: "-0.035em",
      color: P.ink,
      textShadow: "0 6px 40px rgba(0,0,0,0.45)",
    }}
  >
    {lines.map((l, i) => (
      <div key={i} style={amberFrom !== undefined && i >= amberFrom ? { color: P.amber } : undefined}>
        {l}
      </div>
    ))}
  </div>
);

const Big: React.FC<{ top: number; w?: number; children: (w: number) => React.ReactNode }> = ({ top, w = 560, children }) => (
  <div style={{ position: "absolute", left: 540 - w / 2, top }}>{children(w)}</div>
);

const options: Array<() => React.ReactNode> = [
  // A. The situation and the turn, over the bed: you wide awake, the moon out of reach at the foot of the bed.
  () => (
    <>
      <Title y={290} size={150} lines={["Trying hard", "to fall asleep?", "Stay awake", "instead."]} amberFrom={2} />
      <Big top={930} w={500}>{(w) => <DarkRoom w={w} awake={1} moon={{ x: DARK.foot[0], y: DARK.foot[1], size: 110 }} />}</Big>
    </>
  ),
  // B (chosen, Oct 29): the chase, as in the video: the pillow sliding across the floor, you one step behind it.
  () => (
    <>
      <Title y={290} size={160} lines={["Chasing", "sleep?", "It slips away."]} amberFrom={2} />
      <Big top={860} w={540}>
        {(w) => (
          <PillowRoom
            w={w}
            pillow={{ p: [500, 360], v: [6, 9], rot: 60 }}
            trail={[{ p: [470, 312], v: [6, 9], rot: 58 }, { p: [485, 336], v: [6, 9], rot: 59 }]}
            you={[408, 236]}
            youLag={[350, 190]}
            awake={1.1}
          />
        )}
      </Big>
    </>
  ),
  // C. The question, then the lamp on and the worry on the bed (effort keeps you up).
  () => (
    <>
      <Title y={290} size={150} lines={["Trying harder", "to sleep?", "It keeps you", "awake."]} amberFrom={2} />
      <Big top={930} w={500}>{(w) => <DarkRoom w={w} awake={1} lamp={1} worry={{ p: 1 }} moon={{ x: DARK.corner[0], y: DARK.corner[1], size: 70, o: 0.7 }} />}</Big>
    </>
  ),
];

export const StayAwakeCovers: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SurfaceTint.Provider value={TINT}>
      <AbsoluteFill>
        <PhotoBackground photo={PHOTO} blur={BLUR} calm={0.5} saturation={SATURATION} />
        <AbsoluteFill style={{ background: "linear-gradient(170deg, rgba(255,255,255,0.05), rgba(5,6,16,0.3))" }} />
        {options[Math.min(frame, options.length - 1)]()}
      </AbsoluteFill>
    </SurfaceTint.Provider>
  );
};
