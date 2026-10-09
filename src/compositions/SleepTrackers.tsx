// Script 1: "Sleep trackers". Explainer style test: line art, kinetic type, whip-zoom beats.
// Timings are PLACEHOLDERS (~150 wpm). Retime to the recorded voiceover.
import { noise2D } from "@remotion/noise";
import { AbsoluteFill, Sequence, interpolate, random, useCurrentFrame } from "remotion";
import { ease, fonts, palettes, sec, type } from "../brand/theme";
import { Beat, Draw, Kinetic, Stage, Starfield, lerp } from "../components/kinetic";
import { WaitlistPanel } from "../components/WaitlistPanel";
import { PaletteContext, SupersContext, progress, usePalette } from "../lib/animation";

export const SLEEP_TRACKERS_SECONDS = 43.5;

const CX = 498; // horizontal center of the safe content area
const BEATS = { hook: 0, tap: 5, estimate: 10, timing: 14.6, study: 20.6, week: 29.6, close: 38, cta: 39.6 };
const OVERLAP = 0.45; // each beat whips out while the next one whips in
const surges = [BEATS.tap, BEATS.estimate, BEATS.timing, BEATS.study, BEATS.week, BEATS.close].map(sec);

const Label: React.FC<{
  x: number;
  y: number;
  children: string;
  p?: number;
  anchor?: "start" | "middle" | "end";
}> = ({ x, y, children, p = 1, anchor = "middle" }) => {
  const palette = usePalette();
  // Tracking collapses from wide to normal as the label lands.
  return (
    <text
      x={x}
      y={y + (1 - p) * 20}
      textAnchor={anchor}
      fill={palette.muted}
      opacity={Math.min(1, p)}
      style={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: 34, letterSpacing: `${0.08 + (1 - p) * 0.5}em` }}
    >
      {children.toUpperCase()}
    </text>
  );
};

/* 1. Hook: the watch springs in, REM pops inside, gets struck through and falls away. */
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const palette = usePalette();
  const cy = 1080;
  const watchIn = progress(frame, 0, 26, ease.outBack);
  const ring = progress(frame, 2, 30, ease.outQuart);
  const strap = progress(frame, 12, 26, ease.inOutCubic);
  const rem = progress(frame, 16, 22, ease.outBack);
  const remLin = progress(frame, 16, 10, ease.linear);
  const strike = progress(frame, sec(3.2), 10, ease.outExpo);
  const fall = progress(frame, sec(3.65), 22, ease.inExpo);
  const orbit = frame * 0.07 - Math.PI / 2;
  const breathe = 1 + Math.sin(frame * 0.08) * 0.01;
  return (
    <AbsoluteFill>
      <Stage>
        <g
          transform={`translate(${CX} ${cy}) scale(${(0.6 + 0.4 * watchIn) * breathe}) rotate(${(1 - watchIn) * -18})`}
          opacity={Math.min(1, watchIn * 2)}
        >
          <Draw d="M -120 -232 L -100 -430 H 100 L 120 -232" p={strap} opacity={0.6} tip={false} />
          <Draw d="M -120 232 L -100 430 H 100 L 120 232" p={strap} opacity={0.6} tip={false} />
          <Draw d="M 0 -250 A 250 250 0 1 1 -0.1 -250" p={ring} width={6} />
          <Draw d="M 250 -40 h 26 v 80 h -26" p={strap} tip={false} />
          <circle cx={Math.cos(orbit) * 250} cy={Math.sin(orbit) * 250} r={9} fill={palette.primary} opacity={ring} />
          <circle cx={Math.cos(orbit) * 250} cy={Math.sin(orbit) * 250} r={26} fill={palette.primary} opacity={ring * 0.15} />
          <g transform={`translate(0 ${fall * 420}) rotate(${fall * 14})`} opacity={remLin * (1 - fall)}>
            <text
              y={55}
              textAnchor="middle"
              fill={palette.primary}
              opacity={1 - strike * 0.45}
              transform={`scale(${0.4 + 0.6 * rem})`}
              style={{ fontFamily: fonts.serif, fontSize: 170, letterSpacing: "-0.02em" }}
            >
              REM
            </text>
            <Draw d="M -170 10 L 170 0" p={strike} width={7} />
          </g>
        </g>
        <Label x={CX} y={cy - 480} p={progress(frame, 6, 22, ease.outExpo)}>
          Your sleep tracker
        </Label>
      </Stage>
      <Kinetic y={400} at={1.5} text="Something more *important.*" size={104} />
    </AbsoluteFill>
  );
};

/* 2. One tap away: the phone glides up, the button squashes and springs back, the screen flips to the week. */
const Tap: React.FC = () => {
  const frame = useCurrentFrame();
  const palette = usePalette();
  const screen = { x: CX - 220, y: 640, w: 440, h: 860 };
  const enter = progress(frame, 0, 28, ease.outExpo);
  const outline = progress(frame, 4, 26, ease.outQuart);
  const tapAt = sec(2.3);
  const press = progress(frame, tapAt - 5, 5, ease.outQuart);
  const release = progress(frame, tapAt, 26, ease.outElastic);
  const buttonScale = 1 - 0.1 * press + 0.1 * release;
  const ripple = progress(frame, tapAt, 26, ease.outExpo);
  const flip = progress(frame, tapAt + 4, 24, ease.inOutCubic);
  const lift = Math.sin(flip * Math.PI) * 0.08;
  const hypP = progress(frame, 14, 26, ease.outQuart);
  const levels = [0, 1, 2, 3, 2, 1, 2, 3, 3, 2, 1, 2, 1, 0];
  const stepW = 320 / levels.length;
  const hyp = levels.map((l, i) => `${i === 0 ? "M" : "L"} ${i * stepW} ${l * 40} H ${(i + 1) * stepW}`).join(" ");
  const week = [0, 70, -30, 120, 40, 170, 10];
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: screen.x,
          top: screen.y,
          width: screen.w,
          height: screen.h,
          transform: `translateY(${(1 - enter) * 700}px) rotate(${(1 - enter) * 10}deg) scale(${1 + lift})`,
        }}
      >
        <svg width={screen.w} height={screen.h} style={{ position: "absolute", overflow: "visible" }}>
          <rect
            x={0}
            y={0}
            width={screen.w}
            height={screen.h}
            rx={70}
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - outline}
            fill="none"
            stroke={palette.primary}
            strokeWidth={5}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, perspective: 1400 }}>
          <div style={{ position: "absolute", inset: 0, transform: `rotateY(${flip * 180}deg)`, transformStyle: "preserve-3d" }}>
            <svg width={screen.w} height={screen.h} style={{ position: "absolute", backfaceVisibility: "hidden" }}>
              <text x={60} y={130} fill={palette.muted} opacity={hypP} style={{ ...type.label, fontSize: 28 }}>
                LAST NIGHT
              </text>
              <g transform="translate(60 200)">
                <Draw d={hyp} p={hypP} stroke={palette.muted} width={4} />
              </g>
              {[0, 1, 2].map((i) => {
                const p = progress(frame, 20 + i * 4, 20, ease.outExpo);
                return <rect key={i} x={60} y={420 + i * 70} width={(320 - i * 60) * p} height={26} rx={13} fill={palette.muted} opacity={0.18} />;
              })}
              <g transform={`translate(220 752) scale(${buttonScale}) translate(-220 -752)`} opacity={progress(frame, 30, 12)}>
                <rect x={60} y={720} width={320} height={64} rx={32} fill="none" stroke={palette.primary} strokeWidth={3} />
                <text x={220} y={762} textAnchor="middle" fill={palette.primary} style={{ fontFamily: fonts.sans, fontSize: 28 }}>
                  This week
                </text>
              </g>
              <circle cx={220} cy={752} r={20 + ripple * 160} fill="none" stroke={palette.primary} strokeWidth={4} opacity={(1 - ripple) * 0.8} />
              <circle cx={220} cy={752} r={10 + ripple * 90} fill="none" stroke={palette.primary} strokeWidth={3} opacity={(1 - ripple) * 0.5} />
            </svg>
            <svg width={screen.w} height={screen.h} style={{ position: "absolute", backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
              <text x={60} y={130} fill={palette.muted} style={{ ...type.label, fontSize: 28 }}>
                THIS WEEK
              </text>
              {week.map((o, i) => {
                const p = progress(frame, tapAt + 16 + i * 2, 20, ease.outBack);
                return (
                  <rect
                    key={i}
                    x={110 + o * 0.6 + (1 - p) * 160}
                    y={200 + i * 80}
                    width={200}
                    height={34}
                    rx={17}
                    fill={palette.primary}
                    opacity={0.35 * Math.min(1, p)}
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </div>
      <Kinetic y={430} at={0.3} text="One tap *away.*" size={110} />
    </AbsoluteFill>
  );
};

/* 3. Estimates: a scanner sweeps in live pulse and movement; the stage graph wobbles, unsure. */
const Estimate: React.FC = () => {
  const frame = useCurrentFrame();
  const palette = usePalette();
  const left = 110;
  const width = 776;
  const reveal = progress(frame, 2, 30, ease.outQuart);
  const period = 260;
  const beat = "h 90 l 15 -18 l 15 18 h 20 l 12 30 l 16 -150 l 16 170 l 12 -50 h 64";
  const ecg = `M ${-period} 0 ` + new Array(7).fill(beat).join(" ");
  const shift = -((frame * 5) % period);
  const amp = 1 + Math.sin(frame * 0.09) * 0.25;
  const wiggle = new Array(79)
    .fill(0)
    .map((_, i) => {
      const x = i * 10;
      const y = noise2D("move", x * 0.006, frame * 0.025) * 46 * amp;
      return `${i === 0 ? "M" : "L"} ${x} ${y.toFixed(1)}`;
    })
    .join(" ");
  const stages = progress(frame, sec(1.6), 24, ease.outQuart);
  const levels = [0, 1, 2, 3, 2, 1, 2, 3, 3, 2, 1, 0, 1, 2, 1, 0];
  const stepW = width / levels.length;
  const hyp = levels
    .map((l, i) => {
      const jy = l * 50 + noise2D("stage", i * 0.7, frame * 0.05) * 22;
      const jx = noise2D("stagex", i * 0.7, frame * 0.04) * 8;
      return `${i === 0 ? "M" : "L"} ${(i * stepW + jx).toFixed(1)} ${jy.toFixed(1)} H ${((i + 1) * stepW + jx).toFixed(1)}`;
    })
    .join(" ");
  const scanX = left + width * reveal;
  return (
    <AbsoluteFill>
      <Stage>
        <defs>
          <clipPath id="est-clip">
            <rect x={left} y={600} width={width * reveal} height={560} />
          </clipPath>
          <linearGradient id="scan" x1="0" x2="1">
            <stop offset="0" stopColor={palette.primary} stopOpacity="0" />
            <stop offset="1" stopColor={palette.primary} stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <Label x={left} y={640} anchor="start" p={progress(frame, 2, 20, ease.outExpo)}>
          Pulse
        </Label>
        <Label x={left} y={960} anchor="start" p={progress(frame, 8, 20, ease.outExpo)}>
          Movement
        </Label>
        <g clipPath="url(#est-clip)">
          <path d={ecg} transform={`translate(${left + shift} 790)`} fill="none" stroke={palette.primary} strokeWidth={4} strokeLinejoin="round" />
          <path d={wiggle} transform={`translate(${left} 1060)`} fill="none" stroke={palette.primary} strokeWidth={4} opacity={0.85} />
        </g>
        {reveal < 0.995 ? (
          <>
            <rect x={scanX - 70} y={680} width={70} height={460} fill="url(#scan)" opacity={0.6} />
            <line x1={scanX} y1={680} x2={scanX} y2={1140} stroke={palette.primary} strokeWidth={2} opacity={0.5} />
          </>
        ) : null}
        <Label x={left} y={1230} anchor="start" p={stages}>
          Estimated stages
        </Label>
        <g transform={`translate(${left} 1290)`} opacity={Math.min(1, stages) * 0.8} style={{ filter: "blur(3px)" }}>
          <Draw d={hyp} p={stages} stroke={palette.muted} width={6} tip={false} />
        </g>
      </Stage>
      <Kinetic y={430} at={0.2} text="Stages are *estimated.*" size={104} />
    </AbsoluteFill>
  );
};

/* 4. Timing: the sleep bar snaps open with overshoot; crisp markers drop in; a light sweep crosses the glass. */
const Timing: React.FC = () => {
  const frame = useCurrentFrame();
  const palette = usePalette();
  const bar = progress(frame, 4, 24, ease.outBack);
  const a = progress(frame, sec(2.1), 18, ease.outExpo);
  const b = progress(frame, sec(3.8), 18, ease.outExpo);
  const sweep = progress(frame, 18, 40, ease.inOutCubic);
  const y = 1080;
  const x0 = 170;
  const x1 = 830;
  const half = ((x1 - x0) / 2) * bar;
  const marker = (x: number, p: number, label: string) => (
    <g opacity={p > 0 ? 1 : 0}>
      <Draw d={`M ${x} ${y - 190} V ${y + 150}`} p={p} width={5} />
      <circle cx={x} cy={y - 190} r={13 * Math.min(1, p * 1.3)} fill={palette.primary} />
      <circle cx={x} cy={y - 190} r={13 + p * 40} fill="none" stroke={palette.primary} strokeWidth={3} opacity={(1 - p) * 0.8} />
      <text
        x={x}
        y={y - 232 + (1 - p) * 40}
        textAnchor="middle"
        fill={palette.primary}
        opacity={Math.min(1, p)}
        style={{ fontFamily: fonts.sans, fontSize: 46, fontWeight: 500 }}
      >
        {label}
      </text>
    </g>
  );
  return (
    <AbsoluteFill>
      <Stage>
        <defs>
          <clipPath id="bar-clip">
            <rect x={CX - half} y={y - 60} width={Math.max(0, half * 2)} height={120} rx={60} />
          </clipPath>
          <linearGradient id="sweep" x1="0" x2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.22" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect
          x={CX - half}
          y={y - 60}
          width={Math.max(0, half * 2)}
          height={120}
          rx={60}
          fill="rgba(255,255,255,0.09)"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth={3}
        />
        <rect clipPath="url(#bar-clip)" x={lerp(x0 - 300, x1, sweep)} y={y - 60} width={260} height={120} fill="url(#sweep)" />
        {marker(x0, a, "Fell asleep")}
        {marker(x1, b, "Woke up")}
      </Stage>
      <Kinetic y={470} at={0.2} text="But timing is *precise.*" size={104} />
    </AbsoluteFill>
  );
};

/* 5. The study: dots pop out in a ripple, the counter races to 60,000, then the dots stream into two bars. */
const Study: React.FC = () => {
  const frame = useCurrentFrame();
  const palette = usePalette();
  const cols = 34;
  const rows = 58;
  const gap = 23;
  const gx = CX - ((cols - 1) * gap) / 2;
  const gy = 960 - ((rows - 1) * gap) / 2;
  const count = Math.round(progress(frame, 6, sec(2), ease.outExpo) * 60000);
  const compareAt = sec(4.1);
  const counterIn = progress(frame, 4, 24, ease.outBack);
  const counterOut = progress(frame, compareAt - 12, 16, ease.inExpo);
  const solid = progress(frame, compareAt + 30, 16, ease.outQuart);
  const labels = progress(frame, compareAt + 6, 20, ease.outExpo);
  const steadyLen = 760;
  const hoursLen = 420;
  const bars = [
    { y: 1000, len: steadyLen },
    { y: 1230, len: hoursLen },
  ];
  const dots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const gxp = gx + c * gap;
      const gyp = gy + r * gap;
      const dist = Math.hypot(gxp - CX, gyp - 960) / 900;
      const pop = progress(frame, 4 + dist * 26, 16, ease.outBack);
      if (pop <= 0) continue;
      // Two of every three dots stream into the "steady timing" bar.
      const target = bars[i % 3 === 0 ? 1 : 0];
      const tx = 110 + random(`tx${i}`) * target.len;
      const ty = target.y + 8 + random(`ty${i}`) * 48;
      const m = progress(frame, compareAt - 4 + random(`m${i}`) * 16, 26, ease.inOutCubic);
      const arc = Math.sin(m * Math.PI) * (random(`a${i}`) - 0.5) * 220;
      dots.push(
        <circle
          key={i}
          cx={lerp(gxp, tx, m) + arc}
          cy={lerp(gyp, ty, m)}
          r={3.2 * pop * (1 + m * 0.4)}
          fill={m > 0 ? palette.primary : palette.muted}
          opacity={(0.45 + m * 0.4) * Math.min(1, pop) * (1 - solid)}
        />,
      );
    }
  }
  const row = (y: number, label: string, len: number, strong: boolean) => (
    <g>
      <text
        x={110 - (1 - labels) * 60}
        y={y - 34}
        opacity={labels}
        fill={strong ? palette.primary : palette.muted}
        style={{ fontFamily: fonts.sans, fontSize: 46, fontWeight: 500 }}
      >
        {label}
      </text>
      <rect x={110} y={y} width={len} height={64} rx={32} fill={strong ? palette.primary : palette.muted} opacity={solid * (strong ? 0.9 : 0.35)} />
    </g>
  );
  return (
    <AbsoluteFill>
      <Stage>
        {dots}
        <rect
          x={CX - 330}
          y={830}
          width={660}
          height={260}
          rx={130}
          fill={palette.ground}
          opacity={0.85 * Math.min(1, counterIn) * (1 - counterOut)}
          style={{ filter: "blur(30px)" }}
        />
        <g
          opacity={Math.min(1, counterIn) * (1 - counterOut)}
          transform={`translate(${CX} ${960 - counterOut * 260}) scale(${(0.7 + 0.3 * counterIn) * (1 - counterOut * 0.4)}) translate(${-CX} -960)`}
        >
          <text x={CX} y={1000} textAnchor="middle" fill={palette.primary} style={{ fontFamily: fonts.serif, fontSize: 210, letterSpacing: "-0.02em" }}>
            {count.toLocaleString("en-US")}
          </text>
          <Label x={CX} y={1080} p={progress(frame, 14, 22, ease.outExpo)}>
            People in one study
          </Label>
        </g>
        {row(1000, "Steady timing", steadyLen, true)}
        {row(1230, "Hours slept", hoursLen, false)}
        <text x={110} y={1420 + (1 - solid) * 20} fill={palette.muted} opacity={solid} style={{ ...type.caption, fontSize: 40 }}>
          Better predictor of long-term health
        </text>
      </Stage>
      <Kinetic y={470} at={4.3} text="Steady *beats* long." size={110} />
    </AbsoluteFill>
  );
};

/* 6. The payoff: bedtimes swing in, a bracket measures it, then each bar springs into line on amber. */
const Week: React.FC = () => {
  const frame = useCurrentFrame();
  const palette = usePalette();
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const offsets = [10, 110, -40, 180, 60, 240, 0];
  const widths = [470, 420, 500, 390, 450, 360, 480];
  const target = 300;
  const alignAt = sec(5.2);
  const guide = progress(frame, alignAt - 10, 22, ease.outExpo);
  const bracketP = progress(frame, sec(2.4), 22, ease.outExpo);
  const lefts = offsets.map((o, i) => lerp(300 + o, target, progress(frame, alignAt + i * 3, 30, ease.outBack)));
  const spreadMin = Math.min(...lefts);
  const spreadMax = Math.max(...lefts);
  const spread = spreadMax - spreadMin;
  const settled = progress(frame, alignAt + 40, 20, ease.outExpo);
  const by = 1450;
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  return (
    <AbsoluteFill>
      <Stage>
        <Label x={110} y={640} anchor="start" p={progress(frame, 6, 22, ease.outExpo)}>
          Your bedtimes
        </Label>
        <Draw d={`M ${target} 670 V 1400`} p={guide} stroke={palette.amber} width={5} />
        <rect
          x={target - 30}
          y={670}
          width={60}
          height={Math.max(0, 730 * Math.min(1, guide))}
          fill={palette.amber}
          opacity={0.06 + settled * 0.06}
          style={{ filter: "blur(18px)" }}
        />
        {days.map((d, i) => {
          const y = 690 + i * 100;
          const enter = progress(frame, 8 + i * 3, 24, ease.outBack);
          const x = lefts[i] + (1 - enter) * 420;
          const pulse = settled * Math.max(0, Math.sin((frame - alignAt - 40 - i * 3) * 0.15)) * 0.4;
          return (
            <g key={i} opacity={Math.min(1, enter * 1.5)}>
              <text x={110} y={y + 44} fill={palette.muted} style={{ fontFamily: fonts.sans, fontSize: 38, fontWeight: 500 }}>
                {d}
              </text>
              <rect x={x} y={y} width={widths[i]} height={60} rx={30} fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.24)" strokeWidth={3} />
              <circle cx={x} cy={y + 30} r={11 + pulse * 8} fill={palette.primary} />
            </g>
          );
        })}
        <g opacity={interpolate(spread, [10, 80], [0, 1], clamp)}>
          <Draw d={`M ${spreadMin} ${by - 22} V ${by} H ${spreadMax} V ${by - 22}`} p={bracketP} width={4} tip={false} />
          <text
            x={(spreadMin + spreadMax) / 2}
            y={by + 62 + (1 - Math.min(1, bracketP)) * 20}
            textAnchor="middle"
            fill={palette.primary}
            opacity={Math.min(1, bracketP) * interpolate(spread, [120, 200], [0, 1], clamp)}
            style={{ fontFamily: fonts.sans, fontSize: 42, fontWeight: 500 }}
          >
            Swings over an hour
          </text>
        </g>
        <text
          x={target}
          y={by + 62 + (1 - settled) * 24}
          textAnchor="middle"
          fill={palette.amber}
          opacity={settled}
          style={{ fontFamily: fonts.sans, fontSize: 42, fontWeight: 500 }}
        >
          Same time, every night
        </text>
      </Stage>
      <Kinetic y={430} at={0.3} out={4.7} text="Look at your *bedtimes.*" size={104} />
      <Kinetic y={430} at={5.2} text="Shrink the *swing.*" size={110} />
    </AbsoluteFill>
  );
};

/* 7. Close. */
const Close: React.FC = () => <Kinetic y={900} at={0.15} text="Not your *REM.*" size={150} />;

export const SleepTrackers: React.FC<{ supers: boolean }> = ({ supers }) => (
  <PaletteContext.Provider value={palettes.night}>
    <SupersContext.Provider value={supers}>
      <AbsoluteFill style={{ backgroundColor: palettes.night.ground }}>
        <Starfield surges={surges} />
        <Beat from={BEATS.hook} to={BEATS.tap + OVERLAP} first>
          <Hook />
        </Beat>
        <Beat from={BEATS.tap} to={BEATS.estimate + OVERLAP}>
          <Tap />
        </Beat>
        <Beat from={BEATS.estimate} to={BEATS.timing + OVERLAP}>
          <Estimate />
        </Beat>
        <Beat from={BEATS.timing} to={BEATS.study + OVERLAP}>
          <Timing />
        </Beat>
        <Beat from={BEATS.study} to={BEATS.week + OVERLAP}>
          <Study />
        </Beat>
        <Beat from={BEATS.week} to={BEATS.close + OVERLAP}>
          <Week />
        </Beat>
        <Beat from={BEATS.close} to={BEATS.cta + OVERLAP}>
          <Close />
        </Beat>
        <Sequence from={sec(BEATS.cta)}>
          <WaitlistPanel headline="A coach for *steadier nights.*" />
        </Sequence>
      </AbsoluteFill>
    </SupersContext.Provider>
  </PaletteContext.Provider>
);
