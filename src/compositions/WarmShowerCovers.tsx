// Cover options for WarmShower, built for a profile grid (a small 3:4 tile cropped from the middle, y 240–1680).
// Frame i = option i. White Instrument Sans 600, the turn in amber, one big object from the video.
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { fonts } from "../brand/theme";
import { PhotoBackground } from "../components/PhotoBackground";
import { Clock, SurfaceTint } from "../components/objects";
import { ShowerRoom, WARM } from "../components/rooms";
import { P } from "../components/premium";
import { BLUR, PHOTO, SATURATION, TINT } from "./WarmShowerBoard";

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
  // A (chosen, Oct 29): the situation and the turn, over the steaming shower with you glowing hot.
  () => (
    <>
      <Title y={290} size={150} lines={["Shower right", "before sleep?", "Too late."]} amberFrom={2} />
      <Big top={830} w={560}>{(w) => <ShowerRoom w={w} glow={WARM.shower} heat={1} spray={1} steam={1} phase={20} />}</Big>
    </>
  ),
  // B. The question, then the clock alone: bedtime at the top, one to two hours before it in amber.
  () => (
    <>
      <Title y={290} size={160} lines={["Can't sleep", "after a hot", "shower?"]} />
      <Big top={860} w={560}>{(w) => <Clock size={w} minutes={630} moon={1} wedge={{ from: 10, to: 11, amber: true }} />}</Big>
      <Title y={1460} size={90} lines={["Take it earlier."]} amberFrom={0} />
    </>
  ),
  // C. Still warm in bed: you on the pillow, glowing hot.
  () => (
    <>
      <Title y={290} size={150} lines={["Hot shower,", "then bed?", "Still too warm", "to sleep."]} amberFrom={2} />
      <Big top={930} w={500}>{(w) => <ShowerRoom w={w} bed={1} glow={WARM.pillow} heat={1} phase={20} />}</Big>
    </>
  ),
];

export const WarmShowerCovers: React.FC = () => {
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
