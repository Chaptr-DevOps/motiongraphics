import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, safeArea } from "../brand/theme";
import { FadeUpText } from "../components/FadeUpText";
import { PhoneFrame } from "../components/PhoneFrame";

export type StarterReelProps = { hook: string; cta: string; screenshot?: string };

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = interpolate(frame, [0, 300], [30, 45]);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% ${glow}%, ${colors.bgAlt} 0%, ${colors.bg} 70%)`,
      }}
    />
  );
};

const PhoneIn: React.FC<{ screenshot?: string }> = ({ screenshot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 18 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ transform: `translateY(${interpolate(p, [0, 1], [1400, 300])}px)` }}>
        <PhoneFrame src={screenshot} width={540} />
      </div>
    </AbsoluteFill>
  );
};

export const StarterReel: React.FC<StarterReelProps> = ({ hook, cta, screenshot }) => {
  return (
    <AbsoluteFill>
      <Background />
      <Sequence from={45} durationInFrames={165}>
        <PhoneIn screenshot={screenshot} />
      </Sequence>
      <Sequence durationInFrames={120}>
        <AbsoluteFill style={{ paddingTop: safeArea.top + 80, paddingLeft: safeArea.left, paddingRight: safeArea.right }}>
          <FadeUpText text={hook} />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={210}>
        <AbsoluteFill style={{ justifyContent: "center", gap: 40 }}>
          <FadeUpText text="Night Shift" size={140} color={colors.primary} />
          <FadeUpText text={cta} size={64} delay={10} color={colors.textMuted} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
