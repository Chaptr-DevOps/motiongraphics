// Building blocks for the "extravagant" explainer style: starfield, zoom-through beats, kinetic type, line drawing.
import { useContext, useMemo } from "react";
import { AbsoluteFill, Sequence, interpolate, random, useCurrentFrame } from "remotion";
import { content, ease, fonts, reel, sec } from "../brand/theme";
import { SupersContext, progress, usePalette } from "../lib/animation";
import { parse } from "./Super";

/** Slow flight through stars. `surges` are master-timeline frames where the camera rushes forward. */
export const Starfield: React.FC<{ count?: number; surges?: number[] }> = ({ count = 170, surges = [] }) => {
  const frame = useCurrentFrame();
  const palette = usePalette();
  const stars = useMemo(
    () =>
      new Array(count).fill(0).map((_, i) => ({
        x: random(`sx${i}`) * 2 - 1,
        y: random(`sy${i}`) * 2 - 1,
        z: random(`sz${i}`),
        r: 0.8 + random(`sr${i}`) * 1.8,
        tw: random(`st${i}`) * Math.PI * 2,
      })),
    [count],
  );
  const travel = frame * 0.0012 + surges.reduce((acc, f) => acc + 0.09 * progress(frame, f - 14, 28, ease.inOut), 0);

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 90% 60% at 50% 38%, #1B2240 0%, ${palette.ground} 70%)`,
        }}
      />
      <svg width={reel.width} height={reel.height} style={{ position: "absolute" }}>
        {stars.map((s, i) => {
          const z = (((s.z - travel) % 1) + 1) % 1; // 0 = near, 1 = far
          const depth = 0.12 + z * 0.88;
          const x = 540 + (s.x * 620) / depth;
          const y = 960 + (s.y * 1100) / depth;
          if (x < -20 || x > 1100 || y < -20 || y > 1940) return null;
          const fade = Math.min(1, (1 - z) * 4) * Math.min(1, z * 6);
          const twinkle = 0.7 + 0.3 * Math.sin(frame * 0.06 + s.tw);
          return (
            <circle key={i} cx={x} cy={y} r={s.r * (1.5 - depth)} fill={palette.primary} opacity={0.75 * fade * twinkle} />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

/** A beat that zooms in from depth and zooms through the camera on its way out. Times in seconds. */
export const Beat: React.FC<{ from: number; to: number; first?: boolean; last?: boolean; children: React.ReactNode }> = ({
  from,
  to,
  first,
  last,
  children,
}) => {
  const start = sec(from);
  const duration = sec(to) - start;
  return (
    <Sequence from={start} durationInFrames={duration}>
      <BeatInner duration={duration} first={first} last={last}>
        {children}
      </BeatInner>
    </Sequence>
  );
};

const BeatInner: React.FC<{ duration: number; first?: boolean; last?: boolean; children: React.ReactNode }> = ({
  duration,
  first,
  last,
  children,
}) => {
  const frame = useCurrentFrame();
  const T = 14;
  const pIn = first ? 1 : progress(frame, 0, T, ease.out);
  const pOut = last ? 0 : progress(frame, duration - T, T, ease.inOut);
  const scale = interpolate(pIn, [0, 1], [0.8, 1]) * interpolate(pOut, [0, 1], [1, 1.8]);
  const blur = (1 - pIn) * 18 + pOut * 22;
  return (
    <AbsoluteFill
      style={{
        opacity: pIn * (1 - pOut),
        transform: `scale(${scale})`,
        filter: blur > 0.1 ? `blur(${blur}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Kinetic two-tone line: words flip up into place. `*key*` words in primary. Times in seconds (local). */
export const Kinetic: React.FC<{
  text: string;
  at?: number;
  out?: number;
  y: number;
  size?: number;
  stagger?: number;
  italic?: boolean;
  keyColor?: string;
}> = ({ text, at = 0, out, y, size = 110, stagger = 3, italic, keyColor }) => {
  const frame = useCurrentFrame();
  const palette = usePalette();
  const show = useContext(SupersContext);
  if (!show) return null;
  const q = out === undefined ? 0 : progress(frame, sec(out), 9, ease.inOut);
  return (
    <div
      style={{
        position: "absolute",
        left: content.left,
        width: content.width,
        top: y,
        transform: `translateY(calc(-50% - ${q * 10}px))`,
        opacity: 1 - q,
        textAlign: "center",
        perspective: 900,
        fontFamily: fonts.serif,
        fontStyle: italic ? "italic" : "normal",
        fontSize: size,
        lineHeight: 0.98,
        letterSpacing: "-0.02em",
      }}
    >
      {parse(text).map((w, i) => {
        const p = progress(frame, sec(at) + i * stagger, 16, ease.out);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              margin: "0 0.12em",
              color: w.key ? keyColor ?? palette.primary : palette.muted,
              opacity: p,
              transformOrigin: "50% 100%",
              transform: `translateY(${(1 - p) * 40}px) rotateX(${(1 - p) * -80}deg)`,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

/** An SVG path that draws itself from progress 0 to 1. */
export const Draw: React.FC<{
  d: string;
  p: number;
  stroke?: string;
  width?: number;
  opacity?: number;
}> = ({ d, p, stroke, width = 4, opacity = 1 }) => {
  const palette = usePalette();
  return (
    <path
      d={d}
      pathLength={1}
      strokeDasharray="1 1"
      strokeDashoffset={1 - p}
      fill="none"
      stroke={stroke ?? palette.primary}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={p > 0 ? opacity : 0}
    />
  );
};

/** Full-frame SVG layer in 1080x1920 coordinates. */
export const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={reel.width} height={reel.height} viewBox={`0 0 ${reel.width} ${reel.height}`} style={{ position: "absolute" }}>
    {children}
  </svg>
);
