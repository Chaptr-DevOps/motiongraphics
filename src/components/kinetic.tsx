// Explainer building blocks: soft beats, liquid kinetic type, pen-tip line drawing, a full-frame SVG stage.
import { getLength, getPointAtLength } from "@remotion/paths";
import { useContext, useMemo } from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { content, ease, fonts, reel, sec } from "../brand/theme";
import { SupersContext, progress, usePalette } from "../lib/animation";
import { parse } from "./Super";

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** A beat that swells in and dissolves out. Pair with a LiquidWipe at the hand-off. Seconds. */
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
  const pIn = first ? 1 : progress(frame, 0, 16, ease.outExpo);
  const pOut = last ? 0 : progress(frame, duration - 14, 14, ease.inOutCubic);
  // A slow continuous push so the frame always breathes.
  const drift = frame / duration;
  const scale = lerp(0.92, 1, pIn) * lerp(1, 1.08, pOut) * (1 + drift * 0.035);
  return (
    <AbsoluteFill
      style={{
        opacity: pIn * (1 - pOut),
        transform: `translateY(${-drift * 24}px) scale(${scale})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/**
 * Liquid kinetic type (Instrument Sans). Letters rise like droplets, stretch and settle, then ripple in a slow wave.
 * `*key*` words in primary. Seconds, local. `out` melts the letters away.
 */
export const Kinetic: React.FC<{
  text: string;
  at?: number;
  out?: number;
  y: number;
  size?: number;
  keyColor?: string;
}> = ({ text, at = 0, out, y, size = 96, keyColor }) => {
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
        transform: "translateY(-50%)",
        textAlign: "center",
        fontFamily: fonts.sans,
        fontWeight: 600,
        fontSize: size,
        lineHeight: 1.04,
        letterSpacing: "-0.025em",
      }}
    >
      {parse(text).map((w, wi) => (
        <span key={wi} style={{ display: "inline-block", whiteSpace: "nowrap", margin: "0 0.13em" }}>
          {w.text.split("").map((ch, k) => {
            const start = sec(at) + ci * 1.2;
            const o = out === undefined ? 0 : progress(frame, sec(out) + ci * 0.6, 14, ease.inOutCubic);
            const wave = Math.sin(frame * 0.07 - ci * 0.45) * 4;
            ci++;
            const p = progress(frame, start, 22, ease.outBack);
            const lin = progress(frame, start, 12, ease.linear);
            const blur = (1 - lin) * 10 + o * 12;
            return (
              <span
                key={k}
                style={{
                  display: "inline-block",
                  color: w.key ? keyColor ?? palette.primary : palette.muted,
                  opacity: lin * (1 - o),
                  transformOrigin: "50% 100%",
                  transform: `translateY(${(1 - p) * 80 + wave * lin + o * 50}px) scale(${0.85 + 0.15 * p}, ${1 + (1 - lin) * 0.5 + o * 0.6})`,
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

/** An SVG path that draws itself from progress 0 to 1, led by a glowing pen tip. Round caps and joins. */
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
