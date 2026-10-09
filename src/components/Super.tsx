import { useContext } from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { content, ease, motion, sec, type } from "../brand/theme";
import { SupersContext, progress, usePalette } from "../lib/animation";

type Word = { text: string; key: boolean };

// "Stop *waiting* in bed." -> key words wrapped in asterisks get the primary color (or amber).
export const parse = (text: string): Word[] =>
  text
    .split(/(\*[^*]+\*)/)
    .filter(Boolean)
    .flatMap((chunk) => {
      const key = chunk.startsWith("*");
      return chunk
        .replace(/\*/g, "")
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => ({ text: w, key }));
    });

type Props = {
  /** Seconds on the master timeline (or within the enclosing Sequence). */
  from: number;
  to: number;
  text: string;
  variant?: "hook" | "body" | "quote";
  /** Key words in amber instead of primary. Use once per video. */
  accent?: boolean;
  /** Vertical center of the block, px. Hooks sit in the middle third (640–1280). */
  y?: number;
  /** Seconds after `from` that each word starts revealing. Sync to the voiceover. */
  wordTimes?: number[];
};

const SuperInner: React.FC<Omit<Props, "from" | "to"> & { duration: number }> = ({
  text,
  variant = "body",
  accent = false,
  y = 900,
  wordTimes,
  duration,
}) => {
  const frame = useCurrentFrame();
  const palette = usePalette();
  const words = parse(text);
  const out = progress(frame, duration - motion.superOut, motion.superOut, ease.inOut);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: content.left,
          width: content.width,
          top: y,
          transform: `translateY(calc(-50% - ${out * 8}px))`,
          opacity: 1 - out,
          ...type[variant],
        }}
      >
        {words.map((w, i) => {
          const start = wordTimes?.[i] !== undefined ? sec(wordTimes[i]) : i * motion.wordStagger;
          const p = progress(frame, start, motion.wordReveal);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                marginRight: "0.24em",
                color: w.key ? (accent ? palette.amber : palette.primary) : palette.muted,
                opacity: p,
                transform: `translateY(${interpolate(p, [0, 1], [12, 0])}px)`,
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Super: React.FC<Props> = ({ from, to, ...rest }) => {
  const show = useContext(SupersContext);
  if (!show) return null;
  const start = sec(from);
  return (
    <Sequence from={start} durationInFrames={sec(to) - start} layout="none">
      <SuperInner duration={sec(to) - start} {...rest} />
    </Sequence>
  );
};
