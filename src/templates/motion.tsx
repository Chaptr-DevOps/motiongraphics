// Shared motion for templates: scene enter/exit, masked word reveals, eyebrow labels, number formatting.
// Crisp by rule: no blur, no wobble. Things slide out of masks, draw on, count, and settle.
import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { EasingFunction } from "remotion";
import { ease, fonts, sec } from "../brand/theme";
import { P } from "../components/premium";
import { progress } from "../lib/animation";

/** Progress of a move that starts at `s` seconds (scene-local) and lasts `frames`. */
export const cue = (frame: number, s: number, frames: number, easing: EasingFunction = ease.outExpo) =>
  progress(frame, sec(s), frames, easing);

/** Wraps a template: content rises in at the start and lifts away at the end of `duration` frames. */
export const SceneShell: React.FC<{ duration: number; children: React.ReactNode; enter?: boolean; exit?: boolean }> = ({
  duration,
  children,
  enter = true,
  exit = true,
}) => {
  const frame = useCurrentFrame();
  const pIn = enter ? progress(frame, 0, 18, ease.outExpo) : 1;
  const pOut = exit ? progress(frame, duration - 12, 12, ease.inOutCubic) : 0;
  return (
    <AbsoluteFill style={{ opacity: pIn * (1 - pOut), transform: `translateY(${(1 - pIn) * 40 - pOut * 70}px)` }}>
      {children}
    </AbsoluteFill>
  );
};

/** Eyebrow label: the dot pops, the text wipes in from the left. */
export const EyebrowIn: React.FC<{ y: number; text: string; at?: number; color?: string }> = ({ y, text, at = 0, color = P.dim }) => {
  const frame = useCurrentFrame();
  const dot = cue(frame, at, 16, ease.outBack);
  const wipe = cue(frame, at + 0.1, 22);
  return (
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
        color,
      }}
    >
      <span style={{ width: 10, height: 10, borderRadius: 5, background: color, transform: `scale(${dot})` }} />
      <span style={{ clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)` }}>{text}</span>
    </div>
  );
};

/**
 * Two-tone headline whose words slide up out of a mask, one after another.
 * `*key*` words in full ink (amber with `accent`). `out` (seconds) sends the words up and away.
 */
export const HeadlineIn: React.FC<{
  y: number;
  text: string;
  at?: number;
  out?: number;
  size?: number;
  accent?: boolean;
  width?: number;
  x?: number;
}> = ({ y, text, at = 0, out, size = 108, accent, width = P.right - P.margin, x = P.margin }) => {
  const frame = useCurrentFrame();
  const words: Array<{ w: string; key: boolean }> = [];
  text.split(/(\*[^*]+\*)/).forEach((chunk) => {
    const key = chunk.startsWith("*");
    chunk
      .replace(/\*/g, "")
      .split(/\s+/)
      .filter(Boolean)
      .forEach((w) => words.push({ w, key }));
  });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        fontFamily: fonts.sans,
        fontWeight: 500,
        fontSize: size,
        lineHeight: 1.0,
        letterSpacing: "-0.04em",
      }}
    >
      {words.map((word, i) => {
        const p = progress(frame, sec(at) + i * 2.5, 22, ease.outExpo);
        const o = out === undefined ? 0 : progress(frame, sec(out) + i * 1.5, 14, ease.inOutCubic);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              overflow: "hidden",
              verticalAlign: "top",
              paddingBottom: "0.14em",
              marginBottom: "-0.14em",
              marginRight: "0.24em",
            }}
          >
            <span
              style={{
                display: "inline-block",
                color: word.key ? (accent ? P.amber : P.ink) : P.dim,
                transform: `translateY(${(1 - p) * 110 - o * 110}%)`,
              }}
            >
              {word.w}
            </span>
          </span>
        );
      })}
    </div>
  );
};

export const fmt = (n: number, decimals = 0) =>
  n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
