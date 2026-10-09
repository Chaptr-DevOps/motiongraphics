// Template: a week of bedtimes on a time axis. Capsules grow out from each bedtime, the swing between the
// earliest and latest is measured, then (optionally) every night snaps into line on one amber guide.
import { interpolate, useCurrentFrame } from "remotion";
import { ease, fonts, sec } from "../brand/theme";
import { P } from "../components/premium";
import { progress } from "../lib/animation";
import { EyebrowIn, HeadlineIn, cue } from "./motion";

export type BedtimeWeekProps = {
  eyebrow: string;
  headline: string;
  /** Axis labels, one per hour, left to right. */
  hours: string[];
  days: string[];
  /** Bedtimes in hours after the first axis label. */
  bedtimes: number[];
  swingLabel: string;
  /** If set, at `cues.align` every bedtime moves here (hours after first label). */
  target?: number;
  headlineAfter?: string;
  alignedLabel?: string;
  cues?: { headline?: number; axis?: number; rows?: number; swing?: number; align?: number };
};

export const BedtimeWeek: React.FC<BedtimeWeekProps> = ({
  eyebrow,
  headline,
  hours,
  days,
  bedtimes,
  swingLabel,
  target,
  headlineAfter,
  alignedLabel,
  cues = {},
}) => {
  const frame = useCurrentFrame();
  const c = { headline: 0.15, axis: 0.6, rows: 0.9, swing: 2.2, align: 4.2, ...cues };
  const x0 = 210;
  const perHour = 172;
  const top = 730;
  const gap = 84;
  const rowsH = gap * days.length;
  const aligning = target !== undefined;
  const alignP = (i: number) => (aligning ? progress(frame, sec(c.align) + i * 2, 26, ease.inOutCubic) : 0);
  const xs = bedtimes.map((h, i) => x0 + interpolate(alignP(i), [0, 1], [h, target ?? h]) * perHour);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const swing = cue(frame, c.swing, 24, ease.inOutCubic);
  const settled = aligning ? cue(frame, c.align + 0.9, 20) : 0;
  const swingVisible = interpolate(maxX - minX, [8, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const mid = (minX + maxX) / 2;
  const bandL = mid - ((maxX - minX) / 2) * swing;
  const bandR = mid + ((maxX - minX) / 2) * swing;
  const textStyle = { fontFamily: fonts.sans, fontSize: 48, fontWeight: 500, letterSpacing: "-0.02em" } as const;

  return (
    <>
      <EyebrowIn y={290} text={eyebrow} />
      <HeadlineIn y={346} at={c.headline} out={aligning && headlineAfter ? c.align - 0.3 : undefined} text={headline} />
      {aligning && headlineAfter ? <HeadlineIn y={346} at={c.align} text={headlineAfter} /> : null}
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="win" x1="0" x2="1">
            <stop offset="0" stopColor={P.ink} stopOpacity="0.85" />
            <stop offset="1" stopColor={P.ink} stopOpacity="0.04" />
          </linearGradient>
          <filter id="bt-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>
        {hours.map((h, i) => {
          const p = progress(frame, sec(c.axis) + i * 3, 24, ease.outExpo);
          const x = x0 + i * perHour;
          return (
            <g key={h} opacity={p}>
              <line x1={x} y1={top - 30} x2={x} y2={top - 30 + (rowsH + 10) * p} stroke={P.hair} strokeWidth={2} />
              <text x={x} y={top - 50 + (1 - p) * 12} textAnchor="middle" fill={P.dim} style={{ fontFamily: fonts.sans, fontSize: 26, fontWeight: 500 }}>
                {h}
              </text>
            </g>
          );
        })}
        {swing > 0 ? (
          <rect x={bandL} y={top - 30} width={Math.max(4, bandR - bandL)} height={rowsH + 10} rx={4} fill={P.amber} opacity={0.08 + settled * 0.5 * (1 - swingVisible)} />
        ) : null}
        {days.map((d, i) => {
          const y = top + i * gap;
          const rowIn = progress(frame, sec(c.rows) + i * 3, 18, ease.outExpo);
          const grow = progress(frame, sec(c.rows) + i * 3 + 4, 30, ease.outExpo);
          const dot = progress(frame, sec(c.rows) + i * 3, 16, ease.outBack);
          return (
            <g key={i}>
              <text x={P.margin} y={y + 30} fill={P.dim} opacity={rowIn} style={{ fontFamily: fonts.sans, fontSize: 30, fontWeight: 500 }}>
                {d}
              </text>
              {grow > 0 ? <rect x={xs[i]} y={y} width={Math.max(0, (950 - xs[i]) * grow)} height={42} rx={21} fill="url(#win)" /> : null}
              {dot > 0 ? (
                <>
                  <circle cx={xs[i]} cy={y + 21} r={16 * Math.min(1, dot)} fill={P.ink} opacity={0.35} filter="url(#bt-glow)" />
                  <circle cx={xs[i]} cy={y + 21} r={11 * dot} fill={settled > 0.5 ? P.amber : P.ink} stroke={P.ground} strokeWidth={4} />
                </>
              ) : null}
            </g>
          );
        })}
        {swing > 0 ? (
          <path
            d={`M ${bandL} ${top + rowsH + 2} v 18 H ${bandR} v -18`}
            fill="none"
            stroke={P.amber}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={swingVisible}
          />
        ) : null}
      </svg>
      <div
        style={{
          position: "absolute",
          left: mid - 250,
          width: 500,
          top: top + rowsH + 40 + (1 - swing) * 16,
          textAlign: "center",
          color: P.amber,
          opacity: swing * swingVisible * (aligning ? 1 - cue(frame, c.align, 10, ease.inOutCubic) : 1),
          ...textStyle,
        }}
      >
        {swingLabel}
      </div>
      {alignedLabel ? (
        <div
          style={{
            position: "absolute",
            left: mid - 300,
            width: 600,
            top: top + rowsH + 40 + (1 - settled) * 16,
            textAlign: "center",
            color: P.amber,
            opacity: settled,
            ...textStyle,
          }}
        >
          {alignedLabel}
        </div>
      ) : null}
    </>
  );
};
