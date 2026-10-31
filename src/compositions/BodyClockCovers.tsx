// Cover options for BodyClock, built for a profile grid (a small 3:4 tile cropped from the middle, y 240–1680).
// Frame i = option i. 1: "Can't sleep at midnight?" + "Foggy at 7?" (amber) over the clock with the dashed hand two hours
// behind (the red digital clock, a ghost readout below). 2: "Is your sleep clock running late?" over the same clock. 3: "Can't sleep till midnight?" over the clock at
// midnight under the glare of the overhead light.
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { fonts, reel } from "../brand/theme";
import { PhotoBackground } from "../components/PhotoBackground";
import { SurfaceTint } from "../components/objects";
import { DeskClock } from "../components/rooms";
import { P } from "../components/premium";
import { PHOTO, TINT } from "./BodyClock";

export const COVER_OPTIONS = 3;

const Title: React.FC<{ y: number; size: number; lines: Array<string | [string, "amber"]> }> = ({ y, size, lines }) => (
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
      <div key={i} style={{ color: typeof l === "string" ? P.ink : P.amber }}>
        {typeof l === "string" ? l : l[0]}
      </div>
    ))}
  </div>
);

/** The red digital clock at midnight; `lag` adds your body clock's ghost readout below; `glare` the overhead light. */
const BigClock: React.FC<{ y: number; size: number; lag?: number; glare?: boolean }> = ({ y, size, lag, glare }) => (
  <svg width={reel.width} height={reel.height} style={{ position: "absolute", left: 0, top: 0 }}>
    <defs>
      <radialGradient id="cvglare">
        <stop offset="0" stopColor="#EEF3FF" stopOpacity={0.45} />
        <stop offset="1" stopColor="#EEF3FF" stopOpacity={0} />
      </radialGradient>
    </defs>
    {glare ? <circle cx={540} cy={y - size * 0.3} r={size * 0.9} fill="url(#cvglare)" /> : null}
    <DeskClock x={540} y={y} size={size} hours={12} ghost={lag ? { lag, y: size * 0.42, o: 1 } : undefined} />
  </svg>
);

const options: Array<() => React.ReactNode> = [
  () => (
    <>
      <Title y={270} size={150} lines={["Can't sleep", "at midnight?", ["Foggy at 7?", "amber"]]} />
      <BigClock y={1080} size={620} lag={2} />
    </>
  ),
  () => (
    <>
      <Title y={270} size={160} lines={["Is your", "sleep clock", "running late?"]} />
      <BigClock y={1110} size={620} lag={2} />
    </>
  ),
  () => (
    <>
      <Title y={270} size={160} lines={["Can't sleep", "till midnight?"]} />
      <BigClock y={1080} size={660} glare />
    </>
  ),
];

export const BodyClockCovers: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SurfaceTint.Provider value={TINT}>
      <AbsoluteFill>
        <PhotoBackground photo={PHOTO} blur={44} calm={0.5} saturation={0.7} />
        <AbsoluteFill style={{ background: "linear-gradient(170deg, rgba(255,255,255,0.05), rgba(5,6,16,0.3))" }} />
        {options[Math.min(frame, options.length - 1)]()}
      </AbsoluteFill>
    </SurfaceTint.Provider>
  );
};
