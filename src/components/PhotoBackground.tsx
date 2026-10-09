import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import type { Photo } from "../brand/photos";
import { ease, reel, sec } from "../brand/theme";
import { usePalette } from "../lib/animation";

const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>",
)}")`;

type Props = {
  photo: Photo;
  /** Gaussian blur in px. 40–45 by default; ~25 when the silhouette is the point. */
  blur?: number;
  /** Drift in % of frame, [x, y] start and end. Keep total movement 3–6%. */
  drift?: { from: [number, number]; to: [number, number] };
  driftSeconds?: number;
  /** Ground overlay strength, 0.25–0.35. */
  calm?: number;
  /** Fade to ground over the lower 25% when text or UI sits low. */
  bottomGradient?: boolean;
  saturation?: number;
};

export const PhotoBackground: React.FC<Props> = ({
  photo,
  blur = 42,
  drift = { from: [0, 1.5], to: [0, -1.5] },
  driftSeconds = 16,
  calm = 0.3,
  bottomGradient = false,
  saturation = 0.85,
}) => {
  const frame = useCurrentFrame();
  const palette = usePalette();
  const t = interpolate(frame, [0, sec(driftSeconds)], [0, 1], {
    easing: ease.inOut,
    extrapolateRight: "clamp",
  });
  const x = interpolate(t, [0, 1], [drift.from[0], drift.to[0]]);
  const y = interpolate(t, [0, 1], [drift.from[1], drift.to[1]]);
  // Grain re-seeds every other frame so it reads as film, not flicker.
  const seed = Math.floor(frame / 2);

  return (
    <AbsoluteFill style={{ backgroundColor: palette.ground, overflow: "hidden" }}>
      <Img
        src={staticFile(photo.src)}
        style={{
          width: reel.width,
          height: reel.height,
          objectFit: "cover",
          objectPosition: photo.position,
          transform: `translate(${x}%, ${y}%) scale(1.12)`,
          filter: `blur(${blur}px) saturate(${saturation})`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: GRAIN,
          backgroundPosition: `${Math.round(random(`gx${seed}`) * 240)}px ${Math.round(random(`gy${seed}`) * 240)}px`,
          mixBlendMode: "overlay",
          opacity: 0.18,
        }}
      />
      <AbsoluteFill style={{ backgroundColor: palette.ground, opacity: calm }} />
      {bottomGradient ? (
        <AbsoluteFill
          style={{
            top: "75%",
            background: `linear-gradient(to bottom, transparent, ${palette.ground})`,
            opacity: 0.8,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
