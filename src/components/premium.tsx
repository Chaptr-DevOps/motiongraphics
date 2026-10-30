// Premium abstract system: crisp background, eyebrow labels, two-tone headlines, hairline glass cards, citation chips.
import { AbsoluteFill } from "remotion";
import { fonts, reel } from "../brand/theme";

export const P = {
  ground: "#0B0C14",
  glow: "#1A2147",
  ink: "#F3EEE6",
  dim: "rgba(243,238,230,0.42)",
  faint: "rgba(243,238,230,0.14)",
  hair: "rgba(243,238,230,0.12)",
  amber: "#F0A95E",
  amberGlow: "rgba(240,169,94,0.35)",
  /** A bedside alarm clock's LED red (ClockWatcher, user Oct 30: "that's usually what people associate with that"). */
  led: "#FF4B3E",
  margin: 72,
  right: reel.width - 140,
};

/** Deep night gradient, one soft light source, and a faint dot grid that fades out toward the edges. Static and crisp. */
export const Backdrop: React.FC<{ glowX?: number; glowY?: number }> = ({ glowX = 50, glowY = 42 }) => (
  <AbsoluteFill style={{ backgroundColor: P.ground }}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 110% 65% at ${glowX}% ${glowY}%, ${P.glow} 0%, ${P.ground} 62%)` }} />
    <svg width={reel.width} height={reel.height} style={{ position: "absolute" }}>
      <defs>
        <pattern id="dots" width={36} height={36} patternUnits="userSpaceOnUse">
          <circle cx={18} cy={18} r={1.3} fill="#fff" opacity={0.07} />
        </pattern>
        <radialGradient id="dotFade" cx={`${glowX}%`} cy={`${glowY}%`} r="65%">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="dotMask">
          <rect width={reel.width} height={reel.height} fill="url(#dotFade)" />
        </mask>
      </defs>
      <rect width={reel.width} height={reel.height} fill="url(#dots)" mask="url(#dotMask)" />
    </svg>
  </AbsoluteFill>
);

export const Eyebrow: React.FC<{ y: number; children: string; dot?: string }> = ({ y, children, dot = P.dim }) => (
  <div
    style={{
      position: "absolute",
      left: P.margin,
      top: y,
      display: "flex",
      alignItems: "center",
      gap: 16,
      fontFamily: fonts.sans,
      fontWeight: 500,
      fontSize: 28,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: P.dim,
    }}
  >
    <span style={{ width: 10, height: 10, borderRadius: 5, background: dot }} />
    {children}
  </div>
);

/** Two-tone headline: `*key*` words in full ink (or amber with `accent`), the rest dimmed. */
export const Headline: React.FC<{ y: number; text: string; size?: number; accent?: boolean; width?: number }> = ({
  y,
  text,
  size = 112,
  accent,
  width = P.right - P.margin,
}) => (
  <div
    style={{
      position: "absolute",
      left: P.margin,
      top: y,
      width,
      fontFamily: fonts.sans,
      fontWeight: 500,
      fontSize: size,
      lineHeight: 1.0,
      letterSpacing: "-0.04em",
      color: P.dim,
    }}
  >
    {text.split(/(\*[^*]+\*)/).map((chunk, i) =>
      chunk.startsWith("*") ? (
        <span key={i} style={{ color: accent ? P.amber : P.ink }}>
          {chunk.slice(1, -1)}
        </span>
      ) : (
        <span key={i}>{chunk}</span>
      ),
    )}
  </div>
);

export const Chip: React.FC<{ x?: number; y: number; children: string }> = ({ x = P.margin, y, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      height: 64,
      padding: "0 28px",
      borderRadius: 32,
      border: `2px solid ${P.hair}`,
      background: "rgba(255,255,255,0.03)",
      display: "flex",
      alignItems: "center",
      gap: 14,
      fontFamily: fonts.sans,
      fontSize: 28,
      fontWeight: 500,
      color: P.dim,
      letterSpacing: "0.01em",
    }}
  >
    <svg width={22} height={22} viewBox="0 0 22 22">
      <path d="M5 3 h9 l4 4 v12 h-13 z" fill="none" stroke={P.dim} strokeWidth={2} strokeLinejoin="round" />
      <path d="M8 11 h7 M8 15 h5" stroke={P.dim} strokeWidth={2} strokeLinecap="round" />
    </svg>
    {children}
  </div>
);

export const Glass: React.FC<{ x: number; y: number; w: number; h: number; children?: React.ReactNode; highlight?: boolean }> = ({
  x,
  y,
  w,
  h,
  children,
  highlight,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 40,
      background: highlight ? "linear-gradient(160deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03))" : "rgba(255,255,255,0.035)",
      border: `2px solid ${highlight ? "rgba(243,238,230,0.24)" : P.hair}`,
      boxShadow: highlight ? "0 30px 80px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)" : undefined,
      boxSizing: "border-box",
      padding: 40,
      overflow: "hidden",
    }}
  >
    {children}
  </div>
);
