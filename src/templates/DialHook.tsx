// Template: a precision dial. The sleep window draws itself around the face; its two ends snap to amber;
// the centre value appears and can be struck through. Good for "this number matters more than that one".
import { useCurrentFrame } from "remotion";
import { ease, fonts, sec } from "../brand/theme";
import { P } from "../components/premium";
import { progress } from "../lib/animation";
import { EyebrowIn, HeadlineIn, cue } from "./motion";

export type DialHookProps = {
  eyebrow: string;
  headline: string;
  start: { label: string; time: string; hour: number };
  end: { label: string; time: string; hour: number };
  center: { label: string; value: string };
  /** Seconds (scene-local). */
  cues?: { headline?: number; dial?: number; arc?: number; center?: number; strike?: number };
};

const polar = (cx: number, cy: number, r: number, deg: number): [number, number] => [
  cx + r * Math.sin((deg * Math.PI) / 180),
  cy - r * Math.cos((deg * Math.PI) / 180),
];

const arcPath = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  return `M ${x0} ${y0} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
};

export const DialHook: React.FC<DialHookProps> = ({ eyebrow, headline, start, end, center, cues = {} }) => {
  const frame = useCurrentFrame();
  const c = { headline: 0.15, dial: 0.6, arc: 1.1, center: 1.9, strike: 3.2, ...cues };
  const cx = 506;
  const cy = 1190;
  const R = 270;
  const a0 = (start.hour % 12) * 30;
  let a1 = (end.hour % 12) * 30;
  if (a1 <= a0) a1 += 360;

  const ring = cue(frame, c.dial, 30, ease.inOutCubic);
  const arc = cue(frame, c.arc, 40, ease.inOutCubic);
  const head = a0 + (a1 - a0) * arc;
  const startPop = cue(frame, c.arc, 18, ease.outBack);
  const endPop = progress(frame, sec(c.arc) + 36, 18, ease.outBack);
  const centerIn = cue(frame, c.center, 22);
  const strike = cue(frame, c.strike, 16, ease.inOutCubic);
  const breathe = 0.85 + 0.15 * Math.sin(frame * 0.08);
  const [sx, sy] = polar(cx, cy, R, a0);
  const [ex, ey] = polar(cx, cy, R, a1);
  const [hx, hy] = polar(cx, cy, R, head);

  // Labels sit outside the ring, along the radius through their dot.
  const label = (angle: number, l: { label: string; time: string }, p: number) => {
    const [x, y] = polar(cx, cy, R + 128, angle);
    const q = Math.min(1, p);
    return (
    <div
      style={{
        position: "absolute",
        left: x - 200,
        top: y - 44,
        width: 400,
        textAlign: "center",
        fontFamily: fonts.sans,
        opacity: q,
        transform: `translate(${(1 - q) * -Math.sin((angle * Math.PI) / 180) * 24}px, ${(1 - q) * Math.cos((angle * Math.PI) / 180) * 24}px)`,
      }}
    >
      <div style={{ fontSize: 26, fontWeight: 500, letterSpacing: "0.14em", color: P.dim, textTransform: "uppercase" }}>{l.label}</div>
      <div style={{ fontSize: 48, fontWeight: 500, color: P.ink, letterSpacing: "-0.02em" }}>{l.time}</div>
    </div>
    );
  };

  return (
    <>
      <EyebrowIn y={290} text={eyebrow} />
      <HeadlineIn y={346} size={104} at={c.headline} text={headline} />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <defs>
          <filter id="dial-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>
        <circle
          cx={cx}
          cy={cy}
          r={R + 46}
          fill="none"
          stroke={P.hair}
          strokeWidth={2}
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - ring}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        {new Array(60).fill(0).map((_, i) => {
          const long = i % 5 === 0;
          const p = progress(frame, sec(c.dial) + i * 0.45, 10, ease.outQuart);
          const [x1, y1] = polar(cx, cy, R + 30, i * 6);
          const [x2, y2] = polar(cx, cy, R + 30 - (long ? 16 : 8) * p, i * 6);
          return p > 0 ? (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={long ? P.dim : P.faint} strokeWidth={long ? 3 : 2} strokeLinecap="round" />
          ) : null;
        })}
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={P.faint} strokeWidth={18} opacity={ring} />
        {arc > 0.002 ? <path d={arcPath(cx, cy, R, a0, head)} fill="none" stroke={P.ink} strokeWidth={18} strokeLinecap="round" /> : null}
        {arc > 0.002 && arc < 0.999 ? <circle cx={hx} cy={hy} r={13} fill={P.ink} /> : null}
        {[
          { x: sx, y: sy, p: startPop },
          { x: ex, y: ey, p: endPop },
        ].map((d, i) =>
          d.p > 0 ? (
            <g key={i}>
              <circle cx={d.x} cy={d.y} r={30 * Math.min(1, d.p)} fill={P.amberGlow} filter="url(#dial-glow)" opacity={breathe} />
              <circle cx={d.x} cy={d.y} r={17 * d.p} fill={P.amber} stroke={P.ground} strokeWidth={5} />
            </g>
          ) : null,
        )}
        <g opacity={centerIn} transform={`translate(0 ${(1 - centerIn) * 20})`}>
          <text x={cx} y={cy - 46} textAnchor="middle" fill={P.dim} style={{ fontFamily: fonts.sans, fontSize: 28, fontWeight: 500, letterSpacing: "0.14em" }}>
            {center.label.toUpperCase()}
          </text>
          <text
            x={cx}
            y={cy + 44}
            textAnchor="middle"
            fill={strike > 0.5 ? P.dim : P.ink}
            style={{ fontFamily: fonts.sans, fontSize: 96, fontWeight: 500, letterSpacing: "-0.04em" }}
          >
            {center.value}
          </text>
          {strike > 0 ? (
            <line x1={cx - 150} y1={cy + 12} x2={cx - 150 + 300 * strike} y2={cy + 12} stroke={P.dim} strokeWidth={5} strokeLinecap="round" />
          ) : null}
        </g>
      </svg>
      {label(a0, start, startPop)}
      {label(a1, end, endPop)}
    </>
  );
};
