// Style frames for approval: four key moments in the premium abstract look. Frame N of this composition = style frame N.
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { fonts } from "../brand/theme";
import { Backdrop, Chip, Eyebrow, Glass, Headline, P } from "../components/premium";

const polar = (cx: number, cy: number, r: number, deg: number): [number, number] => [
  cx + r * Math.sin((deg * Math.PI) / 180),
  cy - r * Math.cos((deg * Math.PI) / 180),
];

/* 1. Hook: a precise dial. The sleep window's two ends glow; REM sits struck through in the middle. */
const HookFrame: React.FC = () => {
  const cx = 506;
  const cy = 1190;
  const R = 270;
  const clock = (h: number) => (h % 12) * 30;
  const a0 = clock(11.8);
  const a1 = clock(7.03) + 360;
  const p0 = polar(cx, cy, R, a0);
  const p1 = polar(cx, cy, R, a1);
  const sweep = a1 - a0;
  return (
    <AbsoluteFill>
      <Backdrop glowY={60} />
      <Eyebrow y={290}>Sleep trackers</Eyebrow>
      <Headline y={346} size={104} text="There's a number *more important* than REM." />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <defs>
          <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>
        <circle cx={cx} cy={cy} r={R + 46} fill="none" stroke={P.hair} strokeWidth={2} />
        {new Array(60).fill(0).map((_, i) => {
          const long = i % 5 === 0;
          const [x1, y1] = polar(cx, cy, R + 30, i * 6);
          const [x2, y2] = polar(cx, cy, R + (long ? 14 : 22), i * 6);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={long ? P.dim : P.faint} strokeWidth={long ? 3 : 2} strokeLinecap="round" />;
        })}
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={P.faint} strokeWidth={18} />
        <path
          d={`M ${p0[0]} ${p0[1]} A ${R} ${R} 0 ${sweep > 180 ? 1 : 0} 1 ${p1[0]} ${p1[1]}`}
          fill="none"
          stroke={P.ink}
          strokeWidth={18}
          strokeLinecap="round"
        />
        {[p0, p1].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={30} fill={P.amberGlow} filter="url(#glow)" />
            <circle cx={x} cy={y} r={17} fill={P.amber} stroke={P.ground} strokeWidth={5} />
          </g>
        ))}
        <text x={cx} y={cy - 46} textAnchor="middle" fill={P.dim} style={{ fontFamily: fonts.sans, fontSize: 28, fontWeight: 500, letterSpacing: "0.14em" }}>
          REM
        </text>
        <text x={cx} y={cy + 44} textAnchor="middle" fill={P.dim} style={{ fontFamily: fonts.sans, fontSize: 96, fontWeight: 500, letterSpacing: "-0.04em" }}>
          1h 42m
        </text>
        <line x1={cx - 150} y1={cy + 12} x2={cx + 150} y2={cy + 12} stroke={P.dim} strokeWidth={5} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", left: p0[0] - 200, top: p0[1] - 150, width: 400, textAlign: "center", fontFamily: fonts.sans }}>
        <div style={{ fontSize: 26, fontWeight: 500, letterSpacing: "0.14em", color: P.dim }}>FELL ASLEEP</div>
        <div style={{ fontSize: 48, fontWeight: 500, color: P.ink, letterSpacing: "-0.02em" }}>11:48 PM</div>
      </div>
      <div style={{ position: "absolute", left: p1[0] - 330, top: p1[1] + 34, width: 400, textAlign: "center", fontFamily: fonts.sans }}>
        <div style={{ fontSize: 26, fontWeight: 500, letterSpacing: "0.14em", color: P.dim }}>WOKE UP</div>
        <div style={{ fontSize: 48, fontWeight: 500, color: P.ink, letterSpacing: "-0.02em" }}>7:02 AM</div>
      </div>
    </AbsoluteFill>
  );
};

/* 2. Stat: a giant number over a precise field of dots, mid-count. */
const StatFrame: React.FC = () => {
  const cols = 22;
  const rows = 12;
  const lit = Math.round(cols * rows * 0.72);
  return (
    <AbsoluteFill>
      <Backdrop glowY={30} />
      <Eyebrow y={290}>One study · UK Biobank</Eyebrow>
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
        }}
      >
        60,000
      </div>
      <Headline y={680} size={58} text="people. Steady timing predicted health *better than hours slept.*" accent />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {new Array(rows * cols).fill(0).map((_, i) => {
          const r = Math.floor(i / cols);
          const c = i % cols;
          const on = i < lit;
          const edge = i === lit - 1;
          return (
            <circle
              key={i}
              cx={P.margin + 6 + c * 40}
              cy={960 + r * 36}
              r={on ? 5 : 4}
              fill={P.ink}
              opacity={edge ? 1 : on ? 0.8 : 0.13}
            />
          );
        })}
      </svg>
      <Chip y={1410}>Windred et al., Sleep, 2024</Chip>
    </AbsoluteFill>
  );
};

/* 3. Timeline: a week of bedtimes on a time axis; the swing between earliest and latest is the number to shrink. */
const TimelineFrame: React.FC = () => {
  const x0 = 210;
  const perHour = 172;
  const hours = ["10 PM", "11 PM", "12 AM", "1 AM", "2 AM"];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const bed = [1.0, 1.5, 0.75, 2.1, 1.2, 2.6, 0.9];
  const xs = bed.map((h) => x0 + h * perHour);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const top = 730;
  const gap = 84;
  return (
    <AbsoluteFill>
      <Backdrop glowY={55} />
      <Eyebrow y={290}>Your week</Eyebrow>
      <Headline y={346} text="Look at your *bedtimes.*" />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="win" x1="0" x2="1">
            <stop offset="0" stopColor={P.ink} stopOpacity="0.85" />
            <stop offset="1" stopColor={P.ink} stopOpacity="0.04" />
          </linearGradient>
          <filter id="g2" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>
        {hours.map((h, i) => (
          <g key={h}>
            <line x1={x0 + i * perHour} y1={top - 30} x2={x0 + i * perHour} y2={top + gap * 7 - 20} stroke={P.hair} strokeWidth={2} />
            <text x={x0 + i * perHour} y={top - 50} textAnchor="middle" fill={P.dim} style={{ fontFamily: fonts.sans, fontSize: 26, fontWeight: 500 }}>
              {h}
            </text>
          </g>
        ))}
        <rect x={minX} y={top - 30} width={maxX - minX} height={gap * 7 + 10} rx={6} fill={P.amber} opacity={0.08} />
        {bed.map((_, i) => {
          const y = top + i * gap;
          return (
            <g key={i}>
              <text x={P.margin} y={y + 30} fill={P.dim} style={{ fontFamily: fonts.sans, fontSize: 30, fontWeight: 500 }}>
                {days[i]}
              </text>
              <rect x={xs[i]} y={y} width={950 - xs[i]} height={42} rx={21} fill="url(#win)" />
              <circle cx={xs[i]} cy={y + 21} r={16} fill={P.ink} opacity={0.35} filter="url(#g2)" />
              <circle cx={xs[i]} cy={y + 21} r={11} fill={P.ink} stroke={P.ground} strokeWidth={4} />
            </g>
          );
        })}
        <path
          d={`M ${minX} ${top + gap * 7 + 2} v 18 H ${maxX} v -18`}
          fill="none"
          stroke={P.amber}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: (minX + maxX) / 2 - 250,
          width: 500,
          top: top + gap * 7 + 40,
          textAlign: "center",
          fontFamily: fonts.sans,
          fontSize: 48,
          fontWeight: 500,
          letterSpacing: "-0.02em",
          color: P.amber,
        }}
      >
        Swings 1h 51m
      </div>
    </AbsoluteFill>
  );
};

/* 4. Comparison: done list vs to-do list, and the result. */
const Row: React.FC<{ text: string; done?: boolean }> = ({ text, done }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 18, marginBottom: 26, fontFamily: fonts.sans, fontSize: 36, lineHeight: 1.15, letterSpacing: "-0.01em" }}>
    <svg width={34} height={34} viewBox="0 0 34 34" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx={17} cy={17} r={14} fill={done ? P.faint : "none"} stroke={done ? "none" : P.ink} strokeWidth={2.5} />
      {done ? <path d="M10 17.5 l4.5 4.5 l9 -9.5" fill="none" stroke={P.dim} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /> : null}
    </svg>
    <span style={{ color: done ? P.dim : P.ink, textDecoration: done ? "line-through" : undefined, textDecorationThickness: 2 }}>{text}</span>
  </div>
);

const ComparisonFrame: React.FC = () => (
  <AbsoluteFill>
    <Backdrop glowX={70} glowY={48} />
    <Eyebrow y={290}>Baylor sleep lab</Eyebrow>
    <Headline y={346} size={100} text="Write *tomorrow's list,* not today's." />
    <Glass x={P.margin} y={700} w={420} h={360}>
      <div style={{ fontFamily: fonts.sans, fontSize: 24, fontWeight: 500, letterSpacing: "0.14em", color: P.dim, marginBottom: 34 }}>WHAT&apos;S DONE</div>
      <Row done text="Finished the report" />
      <Row done text="Gym" />
      <Row done text="Groceries" />
    </Glass>
    <Glass x={P.margin + 440} y={700} w={420} h={360} highlight>
      <div style={{ fontFamily: fonts.sans, fontSize: 24, fontWeight: 500, letterSpacing: "0.14em", color: P.ink, marginBottom: 34 }}>WHAT&apos;S NEXT</div>
      <Row text="Email Sarah about Friday" />
      <Row text="Book the dentist" />
      <Row text="Call Mom back" />
    </Glass>
    <div style={{ position: "absolute", left: P.margin - 8, top: 1130, display: "flex", alignItems: "center", gap: 36, fontFamily: fonts.sans }}>
      <div style={{ fontSize: 200, fontWeight: 500, letterSpacing: "-0.06em", color: P.amber, lineHeight: 1 }}>−9 min</div>
      <div style={{ fontSize: 48, fontWeight: 500, color: P.dim, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
        to fall
        <br />
        asleep
      </div>
    </div>
  </AbsoluteFill>
);

export const StyleFrames: React.FC = () => {
  const frame = useCurrentFrame();
  return [<HookFrame key="1" />, <StatFrame key="2" />, <TimelineFrame key="3" />, <ComparisonFrame key="4" />][Math.min(3, frame)];
};
