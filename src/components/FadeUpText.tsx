import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../brand/theme";

export const FadeUpText: React.FC<{
  text: string;
  delay?: number;
  size?: number;
  color?: string;
}> = ({ text, delay = 0, size = 96, color = colors.text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 200 } });

  return (
    <div
      style={{
        fontFamily: fonts.heading,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.1,
        color,
        textAlign: "center",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)`,
      }}
    >
      {text}
    </div>
  );
};
