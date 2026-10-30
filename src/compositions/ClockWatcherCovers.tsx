// Cover options for ClockWatcher, built for a profile grid (a small 3:4 tile cropped from the middle, y 240–1680).
// Frame i = option i. The user picked option 3 (Oct 30): the question over the bed, three sleep-math notes in the light.
// 3a is their wording; 3b says "sleep" (the cover rule: the question names the viewer's situation and mentions sleep).
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { fonts } from "../brand/theme";
import { PhotoBackground } from "../components/PhotoBackground";
import { SurfaceTint } from "../components/objects";
import { ClockRoom } from "../components/rooms";
import { P } from "../components/premium";
import { PHOTO, TINT } from "./ClockWatcher";

export const COVER_OPTIONS = 2;

const Title: React.FC<{ y: number; size: number; lines: string[] }> = ({ y, size, lines }) => (
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
      <div key={i}>{l}</div>
    ))}
  </div>
);

/** The bed in the clock's light, the three notes piled over you. */
const Room: React.FC<{ top: number; w: number }> = ({ top, w }) => (
  <div style={{ position: "absolute", left: 540 - w / 2, top }}>
    <ClockRoom
      w={w}
      awake={1.3}
      clock={{ minutes: 90, scale: 1.35, lit: 1 }}
      beam={1.2}
      notes={[
        { text: "6 hours left", x: 70, y: 214, rot: -4, p: 1 },
        { text: "5½ hours left", x: 34, y: 318, rot: 3, p: 1 },
        { text: "If I fall asleep now…", x: 16, y: 424, rot: -2, p: 1 },
      ]}
    />
  </div>
);

const options: Array<() => React.ReactNode> = [
  // 3a. The user's pick, as worded.
  () => (
    <>
      <Title y={280} size={146} lines={["Can't stop", "checking the", "clock at night?"]} />
      <Room top={800} w={620} />
    </>
  ),
  // 3b. Same, naming sleep.
  () => (
    <>
      <Title y={280} size={140} lines={["Checking the", "clock when you", "can't sleep?"]} />
      <Room top={800} w={620} />
    </>
  ),
];

export const ClockWatcherCovers: React.FC = () => {
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
