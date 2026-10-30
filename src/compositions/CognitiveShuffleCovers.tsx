// Cover options for CognitiveShuffle, built for a profile grid (a small 3:4 tile cropped from the middle, y 240–1680).
// Frame i = option i. 1: the question, the turn in amber, BREAD tiles with B lifted. 2: the question over the lifted B
// with a banana, a bike and a bear floating out of it. 3: "Can't sleep? Spell BREAD." over the tile row.
// The user picked option 3 (Oct 30).
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { fonts, reel } from "../brand/theme";
import { PhotoBackground } from "../components/PhotoBackground";
import { Doodle, LetterTile, LINE, SurfaceTint, useSurface } from "../components/objects";
import type { Thing } from "../components/objects";
import { P } from "../components/premium";
import { PHOTO, TINT } from "./CognitiveShuffle";

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

/** The BREAD row; `lifted` raises B (edged in amber only when `amber`). */
const Tiles: React.FC<{ y: number; z: number; lifted?: boolean; amber?: boolean }> = ({ y, z, lifted, amber }) => {
  const step = z * 1.1;
  return (
    <svg width={reel.width} height={reel.height} style={{ position: "absolute", left: 0, top: 0 }}>
      {["B", "R", "E", "A", "D"].map((ch, i) => {
        const x = 540 + (i - 2) * step;
        const up = lifted && i === 0;
        return (
          <g key={ch} transform={`translate(${x} ${y - (up ? z * 0.55 : 0)}) rotate(${up ? -9 : 0})`}>
            {up ? <rect x={-z / 2} y={z * 0.05} width={z} height={z} rx={z * 0.24} fill="none" stroke="rgba(243,238,230,0.5)" strokeWidth={LINE} strokeDasharray="2 10" strokeLinecap="round" transform={`rotate(9) translate(0 ${z * 0.0})`} /> : null}
            <LetterTile ch={ch} z={z} lift={up ? 1 : 0} amber={up && amber ? 1 : 0} />
          </g>
        );
      })}
    </svg>
  );
};

const Thought: React.FC<{ thing: Thing; x: number; y: number; size: number; rot: number }> = ({ thing, x, y, size, rot }) => {
  const s = useSurface();
  return (
    <svg width={reel.width} height={reel.height} style={{ position: "absolute", left: 0, top: 0 }}>
      <g transform={`translate(${x} ${y}) rotate(${rot})`}>
        <rect x={-size / 2 + 8} y={-size / 2 + 16} width={size} height={size} rx={size * 0.3} fill="rgba(0,0,0,0.35)" />
        <rect x={-size / 2} y={-size / 2} width={size} height={size} rx={size * 0.3} fill={s(0.24, 0.06)} stroke="rgba(243,238,230,0.75)" strokeWidth={LINE + 1} />
        <g transform={`scale(${size / 170})`}>
          <Doodle thing={thing} />
        </g>
      </g>
    </svg>
  );
};

const options: Array<() => React.ReactNode> = [
  // 1. The question, the turn in amber; BREAD below with B lifted.
  () => (
    <>
      <Title y={270} size={150} lines={["Mind won't", "switch off", "for sleep?", ["Try a word game.", "amber"]]} />
      <Tiles y={1220} z={160} lifted />
    </>
  ),
  // 2. The lifted B, a banana, a bike and a bear floating out of it.
  () => (
    <>
      <Title y={280} size={170} lines={["Too wired", "to sleep?"]} />
      <Thought thing="banana" x={270} y={830} size={250} rot={-8} />
      <Thought thing="bike" x={560} y={760} size={250} rot={5} />
      <Thought thing="bear" x={830} y={880} size={250} rot={-3} />
      <svg width={reel.width} height={reel.height} style={{ position: "absolute", left: 0, top: 0 }}>
        <g transform="translate(540 1270) rotate(-9)">
          <LetterTile ch="B" z={260} lift={1} amber={1} />
        </g>
      </svg>
    </>
  ),
  // 3. "Can't sleep? Spell BREAD." over the tile row.
  () => (
    <>
      <Title y={270} size={160} lines={["Can't sleep?", ["Spell", "amber"], ["BREAD.", "amber"]]} />
      <Tiles y={1200} z={160} lifted />
    </>
  ),
];

export const CognitiveShuffleCovers: React.FC = () => {
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
