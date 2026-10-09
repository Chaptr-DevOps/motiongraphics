// Template: a giant number counts up while a precise dot field lights row by row in step with it.
// A two-tone caption and a citation chip follow. Good for study sizes and headline stats.
import { useCurrentFrame } from "remotion";
import { ease, fonts, sec } from "../brand/theme";
import { P } from "../components/premium";
import { progress } from "../lib/animation";
import { EyebrowIn, HeadlineIn, cue, fmt } from "./motion";

export type StatCounterProps = {
  eyebrow: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  caption: string;
  citation?: string;
  /** Fraction of the dot field lit when the count finishes. */
  fill?: number;
  cues?: { count?: number; caption?: number; citation?: number };
};

export const StatCounter: React.FC<StatCounterProps> = ({
  eyebrow,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  caption,
  citation,
  fill = 1,
  cues = {},
}) => {
  const frame = useCurrentFrame();
  const c = { count: 0.3, caption: 1.5, citation: 2.4, ...cues };
  const countP = cue(frame, c.count, 54, ease.outExpo);
  const numberIn = cue(frame, c.count, 20);
  const cols = 22;
  const rows = 12;
  const total = cols * rows;
  const litEdge = countP * fill * total;
  const chip = cue(frame, c.citation, 22);
  return (
    <>
      <EyebrowIn y={290} text={eyebrow} />
      <div
        style={{
          position: "absolute",
          left: P.margin - 12,
          top: 330,
          fontFamily: fonts.sans,
          fontWeight: 500,
          fontSize: 300,
          letterSpacing: "-0.065em",
          color: P.ink,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
          clipPath: `inset(${(1 - numberIn) * 100}% 0 0 0)`,
          transform: `translateY(${(1 - numberIn) * 60}px)`,
        }}
      >
        {prefix}
        {fmt(value * countP, decimals)}
        {suffix}
      </div>
      <HeadlineIn y={680} size={58} at={c.caption} text={caption} accent />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {new Array(total).fill(0).map((_, i) => {
          const r = Math.floor(i / cols);
          const col = i % cols;
          const appear = progress(frame, sec(c.count) + r * 1.2 + col * 0.15, 10, ease.outQuart);
          const on = Math.max(0, Math.min(1, litEdge - i));
          const edge = on > 0 && on < 1;
          return appear > 0 ? (
            <circle
              key={i}
              cx={P.margin + 6 + col * 40}
              cy={960 + r * 36}
              r={4 + on + (edge ? 1.5 : 0)}
              fill={P.ink}
              opacity={appear * (0.13 + on * 0.67 + (edge ? 0.2 : 0))}
            />
          ) : null;
        })}
      </svg>
      {citation ? (
        <div
          style={{
            position: "absolute",
            left: P.margin,
            top: 1410,
            height: 64,
            padding: "0 28px",
            borderRadius: 32,
            border: `2px solid ${P.hair}`,
            background: "rgba(255,255,255,0.03)",
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontFamily: fonts.sans,
            fontSize: 28,
            fontWeight: 500,
            color: P.dim,
            opacity: chip,
            transform: `translateX(${(1 - chip) * -30}px)`,
          }}
        >
          <svg width={22} height={22} viewBox="0 0 22 22">
            <path d="M5 3 h9 l4 4 v12 h-13 z" fill="none" stroke={P.dim} strokeWidth={2} strokeLinejoin="round" />
            <path d="M8 11 h7 M8 15 h5" stroke={P.dim} strokeWidth={2} strokeLinecap="round" />
          </svg>
          {citation}
        </div>
      ) : null}
    </>
  );
};
