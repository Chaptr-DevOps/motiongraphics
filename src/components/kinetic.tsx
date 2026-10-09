// Building blocks for the explainer style: warp starfield, whip-zoom beats, per-letter kinetic type, pen-tip line drawing.
import { getLength, getPointAtLength } from "@remotion/paths";
import { useContext, useMemo } from "react";
import { AbsoluteFill, Sequence, interpolate, random, useCurrentFrame } from "remotion";
import { content, ease, fonts, reel, sec } from "../brand/theme";
import { SupersContext, progress, usePalette } from "../lib/animation";
import { parse } from "./Super";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Flight through stars. Around each frame in `surges` the camera rushes forward and stars stretch into streaks. */
export const Starfield: React.FC<{ count?: number; surges?: number[] }> = ({ count = 180, surges = [] }) => {
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
  const travelAt = (f: number) =>
    f * 0.0012 + surges.reduce((acc, s) => acc + 0.11 * progress(f, s - 12, 26, ease.inOutCubic), 0);
  const travel = travelAt(frame);
  const speed = travel - travelAt(frame - 1);
  const project = (s: (typeof stars)[number], z: number) => {
    const depth = 0.12 + z * 0.88;
    return { x: 540 + (s.x * 620) / depth, y: 960 + (s.y * 1100) / depth, depth };
  };

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 90% 60% at 50% ${38 + Math.sin(frame * 0.01) * 4}%, #1B2240 0%, ${palette.ground} 70%)`,
        }}
      />
      <svg width={reel.width} height={reel.height} style={{ position: "absolute" }}>
        {stars.map((s, i) => {
          const z = (((s.z - travel) % 1) + 1) % 1; // 0 = near, 1 = far
          const head = project(s, z);
          if (head.x < -40 || head.x > 1120 || head.y < -40 || head.y > 1960) return null;
          const tail = project(s, Math.min(1, z + speed * 5));
          const fade = Math.min(1, (1 - z) * 4) * Math.min(1, z * 6);
          const twinkle = 0.7 + 0.3 * Math.sin(frame * 0.06 + s.tw);
          return (
            <line
              key={i}
              x1={head.x}
              y1={head.y}
              x2={tail.x}
              y2={tail.y}
              stroke={palette.primary}
              strokeWidth={2 * s.r * (1.5 - head.depth)}
              strokeLinecap="round"
              opacity={0.75 * fade * twinkle}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

/** A beat that whips in from depth (easeOutExpo) and accelerates out through the camera (easeInExpo). Seconds. */
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
  const pIn = first ? 1 : progress(frame, 0, 20, ease.outExpo);
  const pOut = last ? 0 : progress(frame, duration - 16, 16, ease.inExpo);
  // Slow continuous camera push so nothing ever sits dead still.
  const drift = frame / duration;
  const scale = lerp(0.55, 1, pIn) * lerp(1, 2.6, pOut) * (1 + drift * 0.04);
  const rotate = (1 - pIn) * -6 + pOut * 5;
  const blur = (1 - pIn) * 22 + pOut * 28;
  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(1, pIn * 1.3) * (1 - pOut),
        transform: `translateY(${-drift * 30}px) scale(${scale}) rotate(${rotate}deg)`,
        filter: blur > 0.1 ? `blur(${blur}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Kinetic two-tone line. Letters flip up with easeOutBack, then float. `*key*` words in primary. Seconds, local. */
export const Kinetic: React.FC<{
  text: string;
  at?: number;
  out?: number;
  y: number;
  size?: number;
  keyColor?: string;
}> = ({ text, at = 0, out, y, size = 110, keyColor }) => {
  const frame = useCurrentFrame();
  const palette = usePalette();
  const show = useContext(SupersContext);
  if (!show) return null;
  let ci = 0;
  return (
    <div
      style={{
        position: "absolute",
        left: content.left,
        width: content.width,
        top: y,
        transform: `translateY(calc(-50% + ${Math.sin(frame * 0.05) * 5}px))`,
        textAlign: "center",
        perspective: 900,
        fontFamily: fonts.serif,
        fontSize: size,
        lineHeight: 0.98,
        letterSpacing: "-0.02em",
      }}
    >
      {parse(text).map((w, wi) => (
        <span key={wi} style={{ display: "inline-block", whiteSpace: "nowrap", margin: "0 0.12em" }}>
          {w.text.split("").map((ch, k) => {
            const start = sec(at) + ci * 1.1;
            const o = out === undefined ? 0 : progress(frame, sec(out) + ci * 0.5, 12, ease.inExpo);
            ci++;
            const p = progress(frame, start, 20, ease.outBack);
            const lin = progress(frame, start, 10, ease.linear);
            const blur = (1 - lin) * 8 + o * 10;
            return (
              <span
                key={k}
                style={{
                  display: "inline-block",
                  color: w.key ? keyColor ?? palette.primary : palette.muted,
                  opacity: lin * (1 - o),
                  transformOrigin: "50% 100%",
                  transform: `translateY(${(1 - p) * 70 - o * 70}px) rotateX(${(1 - p) * -75}deg) scale(${0.7 + 0.3 * p})`,
                  filter: blur > 0.1 ? `blur(${blur}px)` : undefined,
                }}
              >
                {ch}
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
};

/** An SVG path that draws itself from progress 0 to 1, led by a glowing pen tip. */
export const Draw: React.FC<{
  d: string;
  p: number;
  stroke?: string;
  width?: number;
  opacity?: number;
  tip?: boolean;
}> = ({ d, p, stroke, width = 4, opacity = 1, tip = true }) => {
  const palette = usePalette();
  const color = stroke ?? palette.primary;
  const length = useMemo(() => getLength(d), [d]);
  const drawing = tip && p > 0.001 && p < 0.995;
  const point = drawing ? getPointAtLength(d, length * Math.min(1, p)) : null;
  return (
    <g opacity={p > 0 ? opacity : 0}>
      <path
        d={d}
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - Math.min(1, p)}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {point ? (
        <>
          <circle cx={point.x} cy={point.y} r={width * 5} fill={color} opacity={0.18} />
          <circle cx={point.x} cy={point.y} r={width * 1.6} fill={color} />
        </>
      ) : null}
    </g>
  );
};

/** Full-frame SVG layer in 1080x1920 coordinates. */
export const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg
    width={reel.width}
    height={reel.height}
    viewBox={`0 0 ${reel.width} ${reel.height}`}
    style={{ position: "absolute", overflow: "visible" }}
  >
    {children}
  </svg>
);

export { lerp };
