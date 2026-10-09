import { interpolate, useCurrentFrame } from "remotion";
import { content, ease, motion, type } from "../brand/theme";
import { progress, usePalette } from "../lib/animation";

/** Frosted glass panel. Rises 40px and fades in from `enterAt` (frames, local). */
export const GlassPanel: React.FC<{
  enterAt?: number;
  y?: number;
  children: React.ReactNode;
}> = ({ enterAt = 0, y = 875, children }) => {
  const frame = useCurrentFrame();
  const palette = usePalette();
  const p = progress(frame, enterAt, motion.panelIn);

  return (
    <div
      style={{
        position: "absolute",
        left: content.left,
        width: content.width,
        top: y,
        transform: `translateY(calc(-50% + ${interpolate(p, [0, 1], [40, 0])}px))`,
        opacity: p,
        padding: 64,
        borderRadius: 66,
        background: palette.glassFill,
        border: `3px solid ${palette.glassEdge}`,
        boxShadow: `inset 0 3px 0 ${palette.glassHighlight}`,
        backdropFilter: `blur(${65 * p}px)`,
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
};

export const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const palette = usePalette();
  return <div style={{ ...type.label, color: palette.muted, marginBottom: 40 }}>{children}</div>;
};

/** A list row inside a panel: dot, text, optional duration on the right. Fades up at `enterAt`. */
export const StepRow: React.FC<{ enterAt: number; text: string; duration?: string }> = ({
  enterAt,
  text,
  duration,
}) => {
  const frame = useCurrentFrame();
  const palette = usePalette();
  const p = progress(frame, enterAt, motion.wordReveal + 3);
  return (
    <div
      style={{
        ...type.row,
        display: "flex",
        alignItems: "center",
        gap: 32,
        padding: "26px 0",
        color: palette.primary,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [12, 0])}px)`,
      }}
    >
      <div style={{ width: 14, height: 14, borderRadius: 7, background: palette.muted, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>{text}</div>
      {duration ? <div style={{ color: palette.muted }}>{duration}</div> : null}
    </div>
  );
};

/** The single call-to-action shape. A tap is a soft 4% scale-down and back at `tapAt`. */
export const Pill: React.FC<{ label: string; tapAt?: number }> = ({ label, tapAt }) => {
  const frame = useCurrentFrame();
  const palette = usePalette();
  const half = motion.tap / 2;
  const scale =
    tapAt === undefined
      ? 1
      : 1 - 0.04 * progress(frame, tapAt, half, ease.out) + 0.04 * progress(frame, tapAt + half, half, ease.inOut);
  return (
    <div
      style={{
        ...type.pill,
        height: 150,
        borderRadius: 75,
        background: palette.pill,
        color: palette.pillText,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${scale})`,
      }}
    >
      {label}
    </div>
  );
};
