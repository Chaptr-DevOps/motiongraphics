// Cover options for PictureAPlace, built for a profile grid (a small 3:4 tile cropped from the middle, y 240–1680).
// Frame i = option i. White Instrument Sans 600, the turn in amber, one big object from the video: the bedroom from above.
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { fonts } from "../brand/theme";
import { PhotoBackground } from "../components/PhotoBackground";
import { SurfaceTint } from "../components/objects";
import { DREAM, Daydream } from "../components/rooms";
import { P } from "../components/premium";
import { BLUR, PHOTO, SATURATION, TINT } from "./PictureAPlaceBoard";

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
  // A. The belief turned over: sheep in the corner, you wide awake.
  () => (
    <>
      <Title y={290} size={150} lines={["Can't sleep?", "Counting", "sheep won't", "help."]} amberFrom={1} />
      <Big top={930}>{(w) => <Daydream w={w} glow={DREAM.pillow} heat={1.4} pen={1} jumped={3} bored={1} />}</Big>
    </>
  ),
  // B. The situation, then the beach filling the room around you in bed, and the answer.
  () => (
    <>
      <Title y={300} size={160} lines={["Can't sleep?", "Mind won't", "switch off?"]} />
      <Big top={830} w={540}>{(w) => <Daydream w={w} glow={DREAM.pillow} heat={0.7} card={1} fx={{ phase: 40, light: 0.8 }} />}</Big>
      <Title y={1500} size={88} lines={["Picture a beach."]} amberFrom={0} />
    </>
  ),
  // C (chosen, Oct 16): a sheep mid-hop over the bed, the beach picture swung out on the wall; the turn in amber.
  () => (
    <>
      <Title y={290} size={150} lines={["Can't sleep?", "Skip the", "sheep."]} amberFrom={1} />
      <Big top={830} w={600}>{(w) => <Daydream w={w} glow={DREAM.pillow} heat={1.2} pen={1} jumped={2.5} swing={1} fx={{ phase: 40 }} />}</Big>
    </>
  ),
];

export const PictureAPlaceCovers: React.FC = () => {
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
