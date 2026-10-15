// Cover options for BedLearnedIt, built for legibility on a profile grid (a small 3:4 tile cropped from the middle).
// Frame i = option i. All white, heavy type, one hero object (the bedroom from above, as in the video), inside the 3:4 crop (y 240–1680).
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { fonts } from "../brand/theme";
import { PhotoBackground } from "../components/PhotoBackground";
import { SurfaceTint } from "../components/objects";
import { RoomMorph, ROOMS_MORPH } from "../components/rooms";
import { P } from "../components/premium";
import { BLUR, PHOTO, SATURATION, TINT } from "./BedLearnedItBoard";

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

// The bedroom, drawn big: your head (the dot) lit up on the pillow, as in the video.
const Bed: React.FC<{ heat?: number; up?: boolean; top?: number }> = ({ heat = 1.2, up, top = 860 }) => (
  <div style={{ position: "absolute", left: 540 - 270, top }}>
    <RoomMorph
      w={540}
      a="bed"
      glow={up ? [572, 430] : ROOMS_MORPH.bed.glow}
      heat={up ? 0.6 : heat}
      tags={up ? [{ x: 520, y: 540, text: "Get up", icon: "up", amber: true }] : []}
      tagSize={40}
    />
  </div>
);

const options: Array<() => React.ReactNode> = [
  // A. The question, the bed with your head lit on the pillow, the answer.
  () => (
    <>
      <Title y={300} size={176} lines={["Can't sleep", "once you're", "in bed?"]} />
      <Bed />
      <Title y={1530} size={88} lines={["Your bed learned it."]} />
    </>
  ),
  // B (chosen, Oct 15): the couch contrast from the hook, the turn in amber, no answer line; the bed lit up says the rest.
  () => (
    <>
      <Title y={280} size={150} lines={["Sleepy on", "the couch?", "But not", "in bed?"]} amberFrom={2} />
      <Bed heat={1.5} top={930} />
    </>
  ),
  // C. Answer-first: out of bed, amber "Get up".
  () => (
    <>
      <Title y={300} size={176} lines={["Can't sleep", "once you're", "in bed?"]} />
      <Bed up />
      <Title y={1530} size={88} lines={["Try getting up."]} />
    </>
  ),
];

export const BedLearnedItCovers: React.FC = () => {
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
