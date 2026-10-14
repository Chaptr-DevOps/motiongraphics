// The hero: a single stroke that morphs through a list of stages (see lib/morph.ts). A soft glow sits behind a crisp shape.
import { interpolateColors, useCurrentFrame } from "remotion";
import { reel } from "../brand/theme";
import { resolve } from "../lib/morph";
import type { Stage } from "../lib/morph";
import { P } from "./premium";

export const Hero: React.FC<{ stages: Stage[]; dotCount?: number; transform?: string; origin?: string }> = ({
  stages,
  dotCount,
  transform,
  origin,
}) => {
  const frame = useCurrentFrame();
  const { d, look, dashed } = resolve(frame, stages, dotCount);
  const color = interpolateColors(look.amber, [0, 1], [P.ink, P.amber]);
  const shape = {
    d,
    stroke: color,
    strokeWidth: look.width,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeDasharray: dashed?.array,
    strokeDashoffset: dashed?.offset,
    fill: color,
    fillOpacity: look.fill,
  };
  return (
    <svg width={reel.width} height={reel.height} style={{ position: "absolute", overflow: "visible" }}>
      <defs>
        <filter id="heroGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={26} />
        </filter>
      </defs>
      <g style={{ transform, transformOrigin: origin }}>
        <path {...shape} filter="url(#heroGlow)" opacity={0.28} />
        <path {...shape} />
      </g>
    </svg>
  );
};
