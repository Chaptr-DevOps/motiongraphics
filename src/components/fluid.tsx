// Fluid layer: drifting lava-light background with flowing ink currents, gooey liquid wipes, particle streams.
import { noise2D } from "@remotion/noise";
import { getLength, getPointAtLength } from "@remotion/paths";
import { useMemo } from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { ease, reel } from "../brand/theme";
import { progress, usePalette } from "../lib/animation";
import { smoothPath } from "../lib/shapes";
import type { Pt } from "../lib/shapes";

/** SVG "goo" filter: blur then sharpen the alpha so nearby shapes melt together like liquid. */
export const Goo: React.FC<{ id: string; blur?: number }> = ({ id, blur = 12 }) => (
  <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="b" />
    <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" result="g" />
    <feComposite in="SourceGraphic" in2="g" operator="atop" />
  </filter>
);

/** Night background that never sits still: soft light pools drift; faint currents flow upward. */
export const FluidBackground: React.FC<{ currents?: number }> = ({ currents = 110 }) => {
  const frame = useCurrentFrame();
  const palette = usePalette();
  const pools = [
    { color: "#26305E", size: 1300, sx: "p1" },
    { color: "#2B2246", size: 1100, sx: "p2" },
    { color: "#1B2A4A", size: 1200, sx: "p3" },
  ];
  const parts = useMemo(
    () =>
      new Array(currents).fill(0).map((_, i) => ({
        x: random(`cx${i}`) * reel.width,
        y: random(`cy${i}`) * 2200,
        v: 0.6 + random(`cv${i}`) * 1.1,
        w: 1.5 + random(`cw${i}`) * 2.5,
      })),
    [currents],
  );
  const at = (i: number, t: number): Pt => {
    const p = parts[i];
    const yRaw = p.y - t * p.v * 1.6;
    const y = ((yRaw % 2200) + 2200) % 2200 - 140;
    const x = p.x + noise2D(`fx${i}`, y * 0.0016, t * 0.004) * 220;
    return [x, y];
  };
  return (
    <AbsoluteFill style={{ backgroundColor: palette.ground, overflow: "hidden" }}>
      {pools.map((pool, i) => {
        const x = 540 + noise2D(pool.sx, frame * 0.003, 0) * 420 - pool.size / 2;
        const y = 960 + noise2D(pool.sx, 0, frame * 0.003) * 700 - pool.size / 2;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: pool.size,
              height: pool.size,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${pool.color} 0%, transparent 65%)`,
              opacity: 0.75,
            }}
          />
        );
      })}
      <svg width={reel.width} height={reel.height} style={{ position: "absolute" }}>
        {parts.map((p, i) => {
          const trail: Pt[] = [0, 4, 8, 12, 16, 20].map((k) => at(i, frame - k));
          for (let k = 1; k < trail.length; k++) {
            if (Math.abs(trail[k][1] - trail[k - 1][1]) > 200) return null;
          }
          return (
            <path
              key={i}
              d={smoothPath(trail)}
              fill="none"
              stroke={palette.primary}
              strokeWidth={p.w}
              strokeLinecap="round"
              opacity={0.12 + 0.08 * Math.sin(frame * 0.05 + i)}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

/** A liquid wipe that floods the frame around `at` (frame) and drains away, hiding a beat change. */
export const LiquidWipe: React.FC<{ at: number; seed: string; color?: string }> = ({ at, seed, color = "#151A35" }) => {
  const frame = useCurrentFrame();
  const grow = progress(frame, at - 13, 13, ease.inOutCubic);
  const drain = progress(frame, at, 16, ease.inOutCubic);
  const size = grow * (1 - drain);
  if (size <= 0.001) return null;
  // Partial ink splash: never fully covers the frame, so the next beat shows through the gaps.
  const blobs = new Array(18).fill(0).map((_, i) => ({
    x: random(`${seed}x${i}`) * reel.width,
    y: random(`${seed}y${i}`) * reel.height,
    r: 130 + random(`${seed}r${i}`) * 190,
    lag: random(`${seed}l${i}`) * 0.35,
  }));
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={reel.width} height={reel.height}>
        <defs>
          <Goo id={`wipe-${seed}`} blur={24} />
        </defs>
        <g filter={`url(#wipe-${seed})`} opacity={0.94}>
          {blobs.map((b, i) => {
            const local = Math.max(0, Math.min(1, (size - b.lag * (1 - size)) / (1 - b.lag * 0.5)));
            return <circle key={i} cx={b.x + (local - 0.5) * 60} cy={b.y - local * 80} r={b.r * local} fill={color} />;
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/** Particles streaming along a path. Put it inside a group with a Goo filter to make it read as liquid. */
export const Stream: React.FC<{
  d: string;
  count?: number;
  /** Trips along the path per second. */
  speed?: number;
  /** How much of the path the liquid has reached (0..1). */
  reach?: number;
  size?: number;
  jitter?: number;
  color: string;
  seed: string;
  pulse?: (frame: number) => number;
}> = ({ d, count = 40, speed = 0.4, reach = 1, size = 14, jitter = 10, color, seed, pulse }) => {
  const frame = useCurrentFrame();
  const length = useMemo(() => getLength(d), [d]);
  const boost = pulse ? pulse(frame) : 1;
  return (
    <g>
      {new Array(count).fill(0).map((_, i) => {
        const u = (i / count + (frame * speed) / 30) % 1;
        if (u > reach) return null;
        const pt = getPointAtLength(d, u * length);
        const jx = noise2D(`${seed}jx${i}`, frame * 0.05, 0) * jitter;
        const jy = noise2D(`${seed}jy${i}`, 0, frame * 0.05) * jitter;
        const r = size * (0.6 + random(`${seed}r${i}`) * 0.6) * boost * Math.min(1, (reach - u) * 12 + 0.3);
        return <circle key={i} cx={pt.x + jx} cy={pt.y + jy} r={Math.max(0, r)} fill={color} />;
      })}
    </g>
  );
};
