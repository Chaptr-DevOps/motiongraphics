// Template: two cards side by side. The left list gets checked off and struck through and steps back;
// the right card lifts forward; a result counts in underneath. Good for "this, not that" findings.
import { useCurrentFrame } from "remotion";
import { ease, fonts, sec } from "../brand/theme";
import { P } from "../components/premium";
import { progress } from "../lib/animation";
import { EyebrowIn, HeadlineIn, cue, fmt } from "./motion";

export type CompareCardsProps = {
  eyebrow: string;
  headline: string;
  left: { title: string; items: string[] };
  right: { title: string; items: string[] };
  result?: { value: number; prefix?: string; unit: string; label: string };
  cues?: { headline?: number; cards?: number; check?: number; lift?: number; result?: number };
};

const Item: React.FC<{ text: string; appear: number; check: number; strong?: boolean }> = ({ text, appear, check, strong }) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 18,
      marginBottom: 26,
      fontFamily: fonts.sans,
      fontSize: 36,
      lineHeight: 1.15,
      letterSpacing: "-0.01em",
      opacity: appear,
      transform: `translateY(${(1 - appear) * 16}px)`,
    }}
  >
    <svg width={34} height={34} viewBox="0 0 34 34" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx={17} cy={17} r={14} fill={check > 0 ? `rgba(243,238,230,${0.14 * check})` : "none"} stroke={strong ? P.ink : P.dim} strokeOpacity={1 - check} strokeWidth={2.5} />
      <path
        d="M10 17.5 l4.5 4.5 l9 -9.5"
        fill="none"
        stroke={P.dim}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - check}
      />
    </svg>
    <span style={{ position: "relative", color: strong ? P.ink : check > 0.5 ? P.dim : "rgba(243,238,230,0.7)" }}>
      {text}
      <span
        style={{
          position: "absolute",
          left: 0,
          top: "55%",
          height: 2.5,
          width: `${check * 100}%`,
          background: P.dim,
          borderRadius: 2,
        }}
      />
    </span>
  </div>
);

export const CompareCards: React.FC<CompareCardsProps> = ({ eyebrow, headline, left, right, result, cues = {} }) => {
  const frame = useCurrentFrame();
  const c = { headline: 0.15, cards: 0.8, check: 2.0, lift: 2.8, result: 3.4, ...cues };
  const cardIn = (i: number) => progress(frame, sec(c.cards) + i * 5, 26, ease.outExpo);
  const lift = cue(frame, c.lift, 24, ease.inOutCubic);
  const res = cue(frame, c.result, 22);
  const count = cue(frame, c.result, 40, ease.outExpo);
  const card = (i: number, data: { title: string; items: string[] }, strong: boolean) => {
    const p = cardIn(i);
    const x = P.margin + i * 440;
    const scale = strong ? 1 + lift * 0.03 : 1 - lift * 0.03;
    return (
      <div
        style={{
          position: "absolute",
          left: x,
          top: 700,
          width: 420,
          height: 360,
          borderRadius: 40,
          boxSizing: "border-box",
          padding: 40,
          background: strong
            ? `linear-gradient(160deg, rgba(255,255,255,${0.035 + lift * 0.065}), rgba(255,255,255,0.03))`
            : "rgba(255,255,255,0.035)",
          border: `2px solid ${strong ? `rgba(243,238,230,${0.12 + lift * 0.14})` : P.hair}`,
          boxShadow: strong ? `0 ${30 * lift}px ${80 * lift}px rgba(0,0,0,${0.35 * lift})` : undefined,
          opacity: p * (strong ? 1 : 1 - lift * 0.3),
          transform: `translateY(${(1 - p) * 80 - (strong ? lift * 14 : 0)}px) scale(${scale})`,
        }}
      >
        <div style={{ fontFamily: fonts.sans, fontSize: 24, fontWeight: 500, letterSpacing: "0.14em", color: strong && lift > 0.5 ? P.ink : P.dim, marginBottom: 34, textTransform: "uppercase" }}>
          {data.title}
        </div>
        {data.items.map((t, k) => (
          <Item
            key={k}
            text={t}
            strong={strong}
            appear={progress(frame, sec(c.cards) + i * 5 + 10 + k * 4, 18, ease.outExpo)}
            check={strong ? 0 : progress(frame, sec(c.check) + k * 6, 16, ease.inOutCubic)}
          />
        ))}
      </div>
    );
  };
  return (
    <>
      <EyebrowIn y={290} text={eyebrow} />
      <HeadlineIn y={346} size={100} at={c.headline} text={headline} />
      {card(0, left, false)}
      {card(1, right, true)}
      {result ? (
        <div
          style={{
            position: "absolute",
            left: P.margin - 8,
            top: 1130,
            display: "flex",
            alignItems: "center",
            gap: 36,
            fontFamily: fonts.sans,
            opacity: res,
            transform: `translateY(${(1 - res) * 40}px)`,
          }}
        >
          <div style={{ fontSize: 200, fontWeight: 500, letterSpacing: "-0.06em", color: P.amber, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
            {result.prefix ?? ""}
            {fmt(result.value * count)} {result.unit}
          </div>
          <div style={{ fontSize: 48, fontWeight: 500, color: P.dim, lineHeight: 1.1, letterSpacing: "-0.02em", maxWidth: 260 }}>{result.label}</div>
        </div>
      ) : null}
    </>
  );
};
