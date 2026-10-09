// Script 1: "Sleep trackers". Extravagant style test: line art, kinetic type, zoom-through beats.
// Timings are PLACEHOLDERS (~150 wpm). Retime to the recorded voiceover.
import { AbsoluteFill, Sequence, interpolate, random, useCurrentFrame } from "remotion";
import { fonts, palettes, sec, type } from "../brand/theme";
import { Beat, Draw, Kinetic, Stage, Starfield } from "../components/kinetic";
import { WaitlistPanel } from "../components/WaitlistPanel";
import { PaletteContext, SupersContext, progress, usePalette } from "../lib/animation";

export const SLEEP_TRACKERS_SECONDS = 43.5;

const CX = 498; // horizontal center of the safe content area
const BEATS = { hook: 0, tap: 5, estimate: 10, timing: 14.6, study: 20.6, week: 29.6, close: 38, cta: 39.6 };
const surges = [BEATS.tap, BEATS.estimate, BEATS.timing, BEATS.study, BEATS.week, BEATS.close].map(sec);

const Label: React.FC<{ x: number; y: number; children: string; opacity?: number; anchor?: "start" | "middle" | "end" }> = ({
  x,
  y,
  children,
  opacity = 1,
  anchor = "middle",
}) => {
  const palette = usePalette();
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill={palette.muted}
      opacity={opacity}
      style={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: 34, letterSpacing: "0.08em" }}
    >
      {children.toUpperCase()}
    </text>
  );
};

/* 1. Hook: a watch draws itself, REM glows inside, then gets struck through. */
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const palette = usePalette();
  const cy = 1080;
  const ring = progress(frame, 0, 26);
  const strap = progress(frame, 10, 22);
  const rem = progress(frame, 14, 16);
  const strike = progress(frame, sec(3.4), 12);
  const orbit = frame * 0.05;
  return (
    <AbsoluteFill>
      <Stage>
        <g transform={`translate(${CX} ${cy})`}>
          <Draw d="M -120 -232 L -100 -430 H 100 L 120 -232" p={strap} opacity={0.6} />
          <Draw d="M -120 232 L -100 430 H 100 L 120 232" p={strap} opacity={0.6} />
          <Draw d="M 0 -250 A 250 250 0 1 1 -0.1 -250" p={ring} width={6} />
          <Draw d="M 250 -40 h 26 v 80 h -26" p={strap} />
          <circle cx={Math.cos(orbit) * 250} cy={Math.sin(orbit) * 250} r={9} fill={palette.primary} opacity={ring} />
          <text
            y={55}
            textAnchor="middle"
            fill={palette.primary}
            opacity={rem * (1 - strike * 0.6)}
            transform={`scale(${0.8 + rem * 0.2 - strike * 0.12})`}
            style={{ fontFamily: fonts.serif, fontSize: 170, letterSpacing: "-0.02em" }}
          >
            REM
          </text>
          <Draw d="M -170 10 L 170 0" p={strike} width={7} />
        </g>
        <Label x={CX} y={cy - 470} opacity={progress(frame, 6, 14)}>
          Your sleep tracker
        </Label>
      </Stage>
      <Kinetic y={400} at={1.6} text="Something more *important.*" size={104} />
    </AbsoluteFill>
  );
};

/* 2. One tap away: a phone draws in, a tap ripples, the screen flips to the weekly view. */
const Tap: React.FC = () => {
  const frame = useCurrentFrame();
  const palette = usePalette();
  const body = progress(frame, 4, 24);
  const tapAt = sec(2.4);
  const ripple = progress(frame, tapAt, 22);
  const flip = progress(frame, tapAt + 6, 18);
  const screen = { x: CX - 220, y: 640, w: 440, h: 860 };
  const levels = [0, 1, 2, 3, 2, 1, 2, 3, 3, 2, 1, 2, 1, 0];
  const stepW = 320 / levels.length;
  const hyp = levels.map((l, i) => `${i === 0 ? "M" : "L"} ${i * stepW} ${l * 40} H ${(i + 1) * stepW}`).join(" ");
  const week = [0, 70, -30, 120, 40, 170, 10];
  return (
    <AbsoluteFill>
      <Stage>
        <rect
          x={screen.x}
          y={screen.y}
          width={screen.w}
          height={screen.h}
          rx={70}
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - body}
          fill="none"
          stroke={palette.primary}
          strokeWidth={5}
        />
        <circle cx={CX} cy={1390} r={30 + ripple * 150} fill="none" stroke={palette.primary} strokeWidth={4} opacity={(1 - ripple) * 0.8} />
        <circle cx={CX} cy={1390} r={20 + ripple * 80} fill="none" stroke={palette.primary} strokeWidth={3} opacity={(1 - ripple) * 0.5} />
      </Stage>
      {/* Screen content flips in 3D on the tap. */}
      <div
        style={{
          position: "absolute",
          left: screen.x,
          top: screen.y,
          width: screen.w,
          height: screen.h,
          perspective: 1400,
          opacity: progress(frame, 18, 12),
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `rotateY(${flip * 180}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <svg width={screen.w} height={screen.h} style={{ position: "absolute", backfaceVisibility: "hidden" }}>
            <text x={60} y={130} fill={palette.muted} style={{ ...type.label, fontSize: 28 }}>
              LAST NIGHT
            </text>
            <g transform="translate(60 200)">
              <path d={hyp} fill="none" stroke={palette.muted} strokeWidth={4} opacity={0.8} />
            </g>
            {[0, 1, 2].map((i) => (
              <rect key={i} x={60} y={420 + i * 70} width={320 - i * 60} height={26} rx={13} fill={palette.muted} opacity={0.18} />
            ))}
            <rect x={60} y={720} width={320} height={64} rx={32} fill="none" stroke={palette.primary} strokeWidth={3} />
            <text x={220} y={762} textAnchor="middle" fill={palette.primary} style={{ fontFamily: fonts.sans, fontSize: 28 }}>
              This week
            </text>
          </svg>
          <svg
            width={screen.w}
            height={screen.h}
            style={{ position: "absolute", backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <text x={60} y={130} fill={palette.muted} style={{ ...type.label, fontSize: 28 }}>
              THIS WEEK
            </text>
            {week.map((o, i) => (
              <rect key={i} x={110 + o * 0.6} y={200 + i * 80} width={200} height={34} rx={17} fill={palette.primary} opacity={0.35} />
            ))}
          </svg>
        </div>
      </div>
      <Kinetic y={430} at={0.4} text="One tap *away.*" size={110} />
    </AbsoluteFill>
  );
};

/* 3. Estimates: live pulse and movement lines feed a wobbly, blurred stage graph. */
const Estimate: React.FC = () => {
  const frame = useCurrentFrame();
  const palette = usePalette();
  const left = 110;
  const width = 776;
  const reveal = progress(frame, 4, 30);
  const period = 260;
  const beat = "h 90 l 15 -18 l 15 18 h 20 l 12 30 l 16 -150 l 16 170 l 12 -50 h 64";
  const ecg = `M ${-period} 0 ` + new Array(7).fill(beat).join(" ");
  const shift = -((frame * 5) % period);
  const wiggle = new Array(81)
    .fill(0)
    .map((_, i) => {
      const x = i * 10;
      const y = 26 * Math.sin(x * 0.02 + frame * 0.07) * Math.sin(x * 0.006 + 1) + 14 * Math.sin(x * 0.05 - frame * 0.11);
      return `${i === 0 ? "M" : "L"} ${x} ${y.toFixed(1)}`;
    })
    .join(" ");
  const stages = progress(frame, sec(1.8), 18);
  const levels = [0, 1, 2, 3, 2, 1, 2, 3, 3, 2, 1, 0, 1, 2, 1, 0];
  const stepW = width / levels.length;
  const tick = Math.floor(frame / 3);
  const hyp = levels
    .map((l, i) => {
      const jy = l * 50 + (random(`j${i}-${tick}`) - 0.5) * 22;
      return `${i === 0 ? "M" : "L"} ${i * stepW} ${jy.toFixed(1)} H ${((i + 1) * stepW).toFixed(1)}`;
    })
    .join(" ");
  return (
    <AbsoluteFill>
      <Stage>
        <defs>
          <clipPath id="est-clip">
            <rect x={left} y={600} width={width * reveal} height={600} />
          </clipPath>
        </defs>
        <Label x={left} y={640} anchor="start" opacity={reveal}>
          Pulse
        </Label>
        <g clipPath="url(#est-clip)">
          <path d={ecg} transform={`translate(${left + shift} 790)`} fill="none" stroke={palette.primary} strokeWidth={4} strokeLinejoin="round" />
          <path d={wiggle} transform={`translate(${left} 1050)`} fill="none" stroke={palette.primary} strokeWidth={4} opacity={0.8} />
        </g>
        <Label x={left} y={960} anchor="start" opacity={reveal}>
          Movement
        </Label>
        <Label x={left} y={1230} anchor="start" opacity={stages}>
          Estimated stages
        </Label>
        <g transform={`translate(${left} 1290)`} opacity={stages * 0.75} style={{ filter: "blur(4px)" }}>
          <path d={hyp} fill="none" stroke={palette.muted} strokeWidth={6} />
        </g>
      </Stage>
      <Kinetic y={430} at={0.3} text="Stages are *estimated.*" size={104} />
    </AbsoluteFill>
  );
};

/* 4. Timing: one crisp sleep bar with precise "fell asleep" and "woke up" markers. */
const Timing: React.FC = () => {
  const frame = useCurrentFrame();
  const palette = usePalette();
  const bar = progress(frame, 6, 20);
  const a = progress(frame, sec(2.2), 16);
  const b = progress(frame, sec(3.9), 16);
  const y = 1080;
  const x0 = 170;
  const x1 = 830;
  const marker = (x: number, p: number, label: string) => (
    <g opacity={p > 0 ? 1 : 0}>
      <Draw d={`M ${x} ${y - 190} V ${y + 150}`} p={p} width={5} />
      <circle cx={x} cy={y - 190} r={12 * p} fill={palette.primary} />
      <text
        x={x}
        y={y - 230 + (1 - p) * 20}
        textAnchor="middle"
        fill={palette.primary}
        opacity={p}
        style={{ fontFamily: fonts.sans, fontSize: 46, fontWeight: 500 }}
      >
        {label}
      </text>
    </g>
  );
  return (
    <AbsoluteFill>
      <Stage>
        <rect
          x={CX - ((x1 - x0) / 2) * bar}
          y={y - 60}
          width={(x1 - x0) * bar}
          height={120}
          rx={60}
          fill="rgba(255,255,255,0.09)"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth={3}
        />
        {marker(x0, a, "Fell asleep")}
        {marker(x1, b, "Woke up")}
      </Stage>
      <Kinetic y={470} at={0.3} text="But timing is *precise.*" size={104} />
    </AbsoluteFill>
  );
};

/* 5. The study: dots ripple out while a counter races to 60,000; then steady timing outgrows hours slept. */
const Study: React.FC = () => {
  const frame = useCurrentFrame();
  const palette = usePalette();
  const cols = 34;
  const rows = 58;
  const gap = 23;
  const gx = CX - ((cols - 1) * gap) / 2;
  const gy = 960 - ((rows - 1) * gap) / 2;
  const count = Math.round(interpolate(progress(frame, 6, sec(1.8)), [0, 1], [0, 60000]));
  const compareAt = sec(4.1);
  const dotsOut = progress(frame, compareAt - 6, 14);
  const counterOut = progress(frame, compareAt - 6, 14);
  const steady = progress(frame, compareAt + 10, 30);
  const hours = progress(frame, compareAt + 22, 30);
  const dots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = gx + c * gap;
      const y = gy + r * gap;
      const dist = Math.hypot(x - CX, y - 960) / 900;
      const p = progress(frame, 4 + dist * 30, 10);
      if (p <= 0) continue;
      dots.push(<circle key={`${r}-${c}`} cx={x} cy={y} r={3.2 * p} fill={palette.muted} opacity={0.45 * p * (1 - dotsOut)} />);
    }
  }
  const row = (y: number, label: string, p: number, len: number, strong: boolean) => (
    <g opacity={progress(frame, compareAt, 12)}>
      <text x={110} y={y - 34} fill={strong ? palette.primary : palette.muted} style={{ fontFamily: fonts.sans, fontSize: 46, fontWeight: 500 }}>
        {label}
      </text>
      <rect x={110} y={y} width={Math.max(1, len * p)} height={64} rx={32} fill={strong ? palette.primary : palette.muted} opacity={strong ? 0.9 : 0.35} />
    </g>
  );
  return (
    <AbsoluteFill>
      <Stage>
        {dots}
        <rect x={CX - 330} y={830} width={660} height={260} rx={130} fill={palette.ground} opacity={0.85 * (1 - counterOut)} style={{ filter: "blur(30px)" }} />
        <g opacity={1 - counterOut} transform={`translate(0 ${-counterOut * 60})`}>
          <text x={CX} y={1000} textAnchor="middle" fill={palette.primary} style={{ fontFamily: fonts.serif, fontSize: 210, letterSpacing: "-0.02em" }}>
            {count.toLocaleString("en-US")}
          </text>
          <Label x={CX} y={1080}>
            People in one study
          </Label>
        </g>
        {row(1000, "Steady timing", steady, 760, true)}
        {row(1230, "Hours slept", hours, 420, false)}
        <text x={110} y={1420} fill={palette.muted} opacity={hours} style={{ ...type.caption, fontSize: 40 }}>
          Better predictor of long-term health
        </text>
      </Stage>
      <Kinetic y={470} at={4.2} text="Steady *beats* long." size={110} />
    </AbsoluteFill>
  );
};

/* 6. The payoff: seven bedtimes swing, a bracket measures it, then they all snap into line on amber. */
const Week: React.FC = () => {
  const frame = useCurrentFrame();
  const palette = usePalette();
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const offsets = [10, 110, -40, 180, 60, 240, 0];
  const widths = [470, 420, 500, 390, 450, 360, 480];
  const target = 300;
  const alignAt = sec(5.2);
  const guide = progress(frame, alignAt - 8, 16);
  const bracketP = progress(frame, sec(2.6), 16);
  const lefts = offsets.map((o, i) => interpolate(progress(frame, alignAt + i * 3, 28), [0, 1], [300 + o, target]));
  const spreadMin = Math.min(...lefts);
  const spreadMax = Math.max(...lefts);
  const by = 1450;
  return (
    <AbsoluteFill>
      <Stage>
        <Label x={110} y={640} anchor="start" opacity={progress(frame, 8, 12)}>
          Your bedtimes
        </Label>
        <Draw d={`M ${target} 670 V 1400`} p={guide} stroke={palette.amber} width={5} />
        {days.map((d, i) => {
          const y = 690 + i * 100;
          const enter = progress(frame, 10 + i * 3, 18);
          const x = lefts[i] + (1 - enter) * 300;
          return (
            <g key={i} opacity={enter}>
              <text x={110} y={y + 44} fill={palette.muted} style={{ fontFamily: fonts.sans, fontSize: 38, fontWeight: 500 }}>
                {d}
              </text>
              <rect x={x} y={y} width={widths[i]} height={60} rx={30} fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.24)" strokeWidth={3} />
              <circle cx={x} cy={y + 30} r={11} fill={palette.primary} />
            </g>
          );
        })}
        <g opacity={bracketP * interpolate(spreadMax - spreadMin, [0, 60], [0, 1], { extrapolateRight: "clamp" })}>
          <Draw d={`M ${spreadMin} ${by - 20} V ${by} H ${spreadMax} V ${by - 20}`} p={bracketP} width={4} />
          <text
            x={(spreadMin + spreadMax) / 2}
            y={by + 60}
            textAnchor="middle"
            fill={palette.primary}
            style={{ fontFamily: fonts.sans, fontSize: 42, fontWeight: 500 }}
          >
            {spreadMax - spreadMin > 150 ? "Swings over an hour" : ""}
          </text>
        </g>
        <text x={target} y={by + 60} textAnchor="middle" fill={palette.amber} opacity={progress(frame, alignAt + 40, 14)} style={{ fontFamily: fonts.sans, fontSize: 42, fontWeight: 500 }}>
          Same time, every night
        </text>
      </Stage>
      <Kinetic y={430} at={0.3} out={4.8} text="Look at your *bedtimes.*" size={104} />
      <Kinetic y={430} at={5.2} text="Shrink the *swing.*" size={110} />
    </AbsoluteFill>
  );
};

/* 7. Close. */
const Close: React.FC = () => <Kinetic y={900} at={0.2} text="Not your *REM.*" size={150} />;

export const SleepTrackers: React.FC<{ supers: boolean }> = ({ supers }) => (
  <PaletteContext.Provider value={palettes.night}>
    <SupersContext.Provider value={supers}>
      <AbsoluteFill style={{ backgroundColor: palettes.night.ground }}>
        <Starfield surges={surges} />
        <Beat from={BEATS.hook} to={BEATS.tap + 0.3} first>
          <Hook />
        </Beat>
        <Beat from={BEATS.tap} to={BEATS.estimate + 0.3}>
          <Tap />
        </Beat>
        <Beat from={BEATS.estimate} to={BEATS.timing + 0.3}>
          <Estimate />
        </Beat>
        <Beat from={BEATS.timing} to={BEATS.study + 0.3}>
          <Timing />
        </Beat>
        <Beat from={BEATS.study} to={BEATS.week + 0.3}>
          <Study />
        </Beat>
        <Beat from={BEATS.week} to={BEATS.close + 0.3}>
          <Week />
        </Beat>
        <Beat from={BEATS.close} to={BEATS.cta + 0.3}>
          <Close />
        </Beat>
        <Sequence from={sec(BEATS.cta)}>
          <WaitlistPanel headline="A coach for *steadier nights.*" />
        </Sequence>
      </AbsoluteFill>
    </SupersContext.Provider>
  </PaletteContext.Provider>
);
