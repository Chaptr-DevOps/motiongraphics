// Script 1: "Sleep trackers". Character-led, fluid style: soft people, liquid motion, no hard corners, sans only.
// Timings are PLACEHOLDERS (~150 wpm). Retime to the recorded voiceover.
import { noise2D } from "@remotion/noise";
import { AbsoluteFill, Sequence, interpolate, random, useCurrentFrame } from "remotion";
import { ease, fonts, palettes, sec } from "../brand/theme";
import { FluidBackground, Goo, LiquidWipe, Stream } from "../components/fluid";
import { Beat, Draw, Kinetic, Stage, lerp } from "../components/kinetic";
import { Dream, Mini, Person, pose, posesAt, rig } from "../components/Person";
import type { Pose } from "../components/Person";
import { WaitlistPanel } from "../components/WaitlistPanel";
import { PaletteContext, SupersContext, progress, usePalette } from "../lib/animation";
import { blobPath, liquidPill, smoothPath } from "../lib/shapes";
import type { Pt } from "../lib/shapes";

export const SLEEP_TRACKERS_SECONDS = 43.5;

const CX = 498; // horizontal center of the safe content area
const BEATS = { hook: 0, tap: 5, estimate: 10, timing: 14.6, study: 20.6, week: 29.6, close: 38, cta: 39.6 };
const OVERLAP = 0.45;
const HANDOFFS = [BEATS.tap, BEATS.estimate, BEATS.timing, BEATS.study, BEATS.week, BEATS.close, BEATS.cta];

const BED = "#232A4E";
const PILLOW = "#38416E";
const BLANKET = "#3B4478";
const DEVICE = "#2A3158";

const Text: React.FC<{
  x: number;
  y: number;
  children: string;
  p?: number;
  anchor?: "start" | "middle" | "end";
  size?: number;
  color?: string;
  label?: boolean;
}> = ({ x, y, children, p = 1, anchor = "middle", size = 46, color, label }) => {
  const palette = usePalette();
  const lin = Math.min(1, Math.max(0, p));
  return (
    <text
      x={x}
      y={y + (1 - p) * 24}
      textAnchor={anchor}
      fill={color ?? (label ? palette.muted : palette.primary)}
      opacity={lin}
      style={{
        fontFamily: fonts.sans,
        fontWeight: label ? 500 : 600,
        fontSize: label ? 32 : size,
        letterSpacing: label ? `${0.08 + (1 - lin) * 0.4}em` : "-0.01em",
        filter: lin < 1 ? `blur(${(1 - lin) * 6}px)` : undefined,
      }}
    >
      {label ? children.toUpperCase() : children}
    </text>
  );
};

const lying = (x: number, y: number, extra: Partial<Pose> = {}) =>
  pose({ x, y, lean: 90, head: -4, armL: [6, 4], armR: [4, 2], legL: [2, 0], legR: [-2, 2], eyes: 1, ...extra });

const breathe = (p: Pose, frame: number): Pose => ({ ...p, lean: p.lean + Math.sin(frame * 0.08) * 0.9 });

/** A sleeper in bed: soft base, pillow under the head, body, rippling blanket, near arm resting on top. */
const Sleeper: React.FC<{ p: Pose; s: number; bedX: number; bedEnd: number; seed: string }> = ({ p, s, bedX, bedEnd, seed }) => {
  const frame = useCurrentFrame();
  const r = rig(p, s);
  const bedY = p.y + 40 * s;
  const blanketX = p.x - 105 * s;
  return (
    <g>
      <rect x={bedX} y={bedY} width={bedEnd - bedX} height={110 * s} rx={55 * s} fill={BED} stroke="rgba(255,255,255,0.12)" strokeWidth={3} />
      <ellipse cx={r.head[0] - 6 * s} cy={bedY - 10 * s} rx={92 * s} ry={34 * s} fill={PILLOW} />
      <Person p={p} s={s} parts="body" />
      <path
        d={liquidPill(blanketX, p.y - 54 * s - Math.sin(frame * 0.08) * 3, bedEnd - 8 - blanketX, 100 * s, seed, frame / 60, 5)}
        fill={BLANKET}
      />
      <Person p={p} s={s} parts="nearArm" />
    </g>
  );
};

/* 1. Hook: a sleeper checks their watch; REM swells into a bubble above them, then melts and drips away. */
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const palette = usePalette();
  const t = frame / 30;
  const S = 1.35;
  const rest = lying(640, 1170);
  const look: Pose = { ...rest, armR: [96, 84], head: 8 };
  const p = breathe(posesAt(frame, [[8, rest], [34, look, ease.outBack]]), frame);
  const r = rig(p, S);
  const wrist = r.armR[2];
  const bubble: Pt = [CX, 700];
  const bubbleIn = progress(frame, 32, 34, ease.outElastic);
  const reach = progress(frame, 26, 22, ease.outQuart) * (1 - progress(frame, 70, 20));
  const remIn = progress(frame, 46, 22, ease.outBack);
  const meltAt = sec(3.3);
  const pop = progress(frame, sec(4.35), 16, ease.outExpo);
  const R = 190 * bubbleIn;
  const stream = smoothPath([wrist, [wrist[0] + 70, wrist[1] - 140], [bubble[0] - 40, bubble[1] + 300], [bubble[0], bubble[1] + R * 0.9]]);
  const letters = [
    { ch: "R", dx: -98 },
    { ch: "E", dx: 0 },
    { ch: "M", dx: 104 },
  ];
  return (
    <AbsoluteFill>
      <Stage>
        <defs>
          <Goo id="hook-goo" blur={10} />
        </defs>
        <Sleeper p={p} s={S} bedX={110} bedEnd={910} seed="blanket" />
        <circle cx={wrist[0]} cy={wrist[1]} r={34 + Math.sin(frame * 0.2) * 4} fill={palette.primary} opacity={0.14 * Math.min(1, reach + remIn)} />
        <circle cx={wrist[0]} cy={wrist[1]} r={15} fill={palette.primary} />
        <g filter="url(#hook-goo)">
          <Stream d={stream} reach={reach} count={26} speed={0.9} size={13} jitter={6} color={palette.primary} seed="wrist" />
          {letters.map((l, i) => {
            const m = progress(frame, meltAt + i * 5, 34, ease.inOutCubic);
            const x = bubble[0] + l.dx;
            const y = bubble[1] + 50;
            return (
              <g key={i} opacity={remIn > 0 ? Math.min(1, remIn) * (1 - progress(frame, meltAt + 26 + i * 5, 12)) : 0}>
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  fill={palette.primary}
                  transform={`translate(${x} ${y}) scale(${0.5 + 0.5 * remIn}, ${(0.5 + 0.5 * remIn) * (1 + m * 0.5)}) translate(${-x} ${-y + m * 60})`}
                  style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 140, letterSpacing: "-0.02em" }}
                >
                  {l.ch}
                </text>
                {[0, 1].map((k) => {
                  const fall = m * (180 + random(`d${i}${k}`) * 260);
                  const dx = (random(`dx${i}${k}`) - 0.5) * 60;
                  return m > 0 ? (
                    <g key={k}>
                      <circle cx={x + dx} cy={y + 6 + fall * 0.4} r={10 * (1 - m * 0.3)} fill={palette.primary} />
                      <circle cx={x + dx} cy={y + 10 + fall} r={(13 + random(`dr${i}${k}`) * 6) * (1 - m * 0.35)} fill={palette.primary} />
                    </g>
                  ) : null;
                })}
              </g>
            );
          })}
          {new Array(10).fill(0).map((_, i) => {
            const a = (i / 10) * Math.PI * 2;
            const d = R + pop * (120 + random(`pp${i}`) * 140);
            return pop > 0 ? (
              <circle key={i} cx={bubble[0] + Math.cos(a) * d} cy={bubble[1] + Math.sin(a) * d + pop * 80} r={10 * (1 - pop)} fill={palette.primary} />
            ) : null;
          })}
        </g>
        {R > 1 && pop < 1 ? (
          <path
            d={blobPath(bubble[0], bubble[1], R * (1 + pop * 0.15), R * (1 + pop * 0.15), "bubble", t * 0.7, 0.05 + progress(frame, meltAt, 30) * 0.08)}
            fill="rgba(255,255,255,0.05)"
            stroke={palette.primary}
            strokeWidth={6}
            opacity={1 - pop}
          />
        ) : null}
      </Stage>
      <Kinetic y={360} at={1.4} text="Something more *important.*" size={92} />
    </AbsoluteFill>
  );
};

/* 2. One tap away: they sit up with their phone; a tap ripples out and droplets fly up into the week. */
const Tap: React.FC = () => {
  const frame = useCurrentFrame();
  const palette = usePalette();
  const t = frame / 30;
  const S = 1.5;
  const base = pose({ x: 360, y: 1250, lean: -6, head: -4, legL: [96, -92], legR: [90, -86], armL: [40, 50], armR: [34, 56] });
  const hold: Pose = { ...base, head: -16, armL: [34, 96], armR: [26, 102] };
  const p = posesAt(frame, [[4, base], [26, hold, ease.outBack]]);
  p.y += Math.sin(frame * 0.08) * 2;
  const r = rig(p, S);
  const wrist = r.armR[2];
  const tapAt = sec(2.2);
  const press = progress(frame, tapAt - 5, 5, ease.outQuart);
  const release = progress(frame, tapAt, 28, ease.outElastic);
  const phoneScale = 1 - 0.08 * press + 0.08 * release;
  const flash = progress(frame, tapAt, 4) * (1 - progress(frame, tapAt + 4, 20));
  const offsets = [0, 40, -20, 70, 20, 100, 10];
  const widths = [200, 190, 210, 180, 200, 170, 205];
  const phone: Pt = [wrist[0] + 6, wrist[1] - 30];
  return (
    <AbsoluteFill>
      <Stage>
        <defs>
          <Goo id="tap-goo" blur={10} />
        </defs>
        <rect x={30} y={1300} width={440} height={130} rx={65} fill={BED} stroke="rgba(255,255,255,0.12)" strokeWidth={3} />
        <path d={liquidPill(40, 1280, 240, 76, "tapBlanket", t * 0.5, 4)} fill={BLANKET} />
        <circle cx={r.head[0] + 40} cy={r.head[1] + 30} r={190} fill={palette.primary} opacity={0.05 + flash * 0.1} />
        <Person p={p} s={S} />
        <g transform={`translate(${phone[0]} ${phone[1]}) rotate(-22) scale(${phoneScale * 1.25})`}>
          <rect x={-40} y={-74} width={80} height={140} rx={24} fill={DEVICE} stroke={palette.primary} strokeWidth={4} />
          <rect x={-30} y={-62} width={60} height={116} rx={16} fill={palette.primary} opacity={0.12 + flash * 0.5} />
        </g>
        {[0, 1, 2].map((k) => {
          const rp = progress(frame, tapAt + k * 5, 30, ease.outExpo);
          return rp > 0 && rp < 1 ? (
            <path
              key={k}
              d={blobPath(phone[0], phone[1], 40 + rp * 240, 40 + rp * 240, `rip${k}`, t, 0.08)}
              fill="none"
              stroke={palette.primary}
              strokeWidth={4}
              opacity={(1 - rp) * 0.6}
            />
          ) : null;
        })}
        <Text x={600} y={590} label p={progress(frame, tapAt + 30, 20, ease.outExpo)}>
          This week
        </Text>
        <g filter="url(#tap-goo)">
          {offsets.map((o, i) => {
            const tx = 600 + o;
            const ty = 640 + i * 62;
            const start = tapAt + 3 + i * 3;
            const m = progress(frame, start, 22, ease.inOutCubic);
            if (m <= 0) return null;
            const grow = progress(frame, start + 20, 30, ease.outElastic);
            const cx = (1 - m) * (1 - m) * phone[0] + 2 * (1 - m) * m * (phone[0] + 60) + m * m * (tx + 17);
            const cy = (1 - m) * (1 - m) * phone[1] + 2 * (1 - m) * m * (ty - 260) + m * m * (ty + 17);
            return grow > 0 ? (
              <rect key={i} x={tx} y={ty} width={34 + grow * (widths[i] - 34)} height={34} rx={17} fill={palette.primary} opacity={0.75} />
            ) : (
              <circle key={i} cx={cx} cy={cy} r={17} fill={palette.primary} opacity={0.75} />
            );
          })}
        </g>
      </Stage>
      <Kinetic y={380} at={0.3} text="One tap *away.*" size={100} />
    </AbsoluteFill>
  );
};

/* 3. Estimates: pulse and movement pour out of the watch as liquid streams into a jelly that can't hold its shape. */
const Estimate: React.FC = () => {
  const frame = useCurrentFrame();
  const palette = usePalette();
  const t = frame / 30;
  const enter = progress(frame, 0, 26, ease.outExpo);
  const ax = (1 - enter) * -420;
  const ay = (1 - enter) * 420;
  const watch: Pt = [290 + ax, 1410 + ay];
  const heartbeat = (f: number) => 1 + 0.6 * Math.exp(-(f % 26) / 3);
  const pulsePath = smoothPath([[watch[0] + 10, watch[1] - 60], [330, 1180], [430, 990], [580, 930], [690, 990]]);
  const movePath = smoothPath([[watch[0] + 60, watch[1] + 10], [580, 1470], [810, 1350], [830, 1190], [770, 1110]]);
  const pulseReach = progress(frame, 14, 34, ease.outQuart);
  const moveReach = progress(frame, 22, 34, ease.outQuart);
  const jelly = progress(frame, 30, 30, ease.outElastic);
  const wave = new Array(9).fill(0).map((_, i): Pt => {
    const x = 620 + i * 25;
    return [x, 1080 + Math.sin(i * 0.9 + t * 3) * 22 + noise2D("wave", i * 0.5, t) * 24];
  });
  return (
    <AbsoluteFill>
      <Stage>
        <defs>
          <Goo id="est-goo" blur={11} />
        </defs>
        <path d={smoothPath([[-80 + ax, 1780 + ay], [120 + ax, 1580 + ay], [watch[0], watch[1]]])} fill="none" stroke={palette.muted} strokeWidth={120} strokeLinecap="round" />
        <circle cx={watch[0]} cy={watch[1]} r={58} fill={DEVICE} stroke={palette.primary} strokeWidth={5} />
        <circle cx={watch[0]} cy={watch[1]} r={22 * heartbeat(frame)} fill={palette.primary} opacity={0.8} />
        <g filter="url(#est-goo)">
          <Stream d={pulsePath} reach={pulseReach} count={34} speed={0.5} size={14} jitter={5} color={palette.primary} seed="pulse" pulse={heartbeat} />
          <Stream d={movePath} reach={moveReach} count={30} speed={0.35} size={13} jitter={22} color={palette.primary} seed="move" />
        </g>
        {jelly > 0 ? (
          <path
            d={blobPath(720, 1080, 130 * jelly, 116 * jelly, "jelly", t * 1.3, 0.26)}
            fill={palette.primary}
            fillOpacity={0.16}
            stroke={palette.primary}
            strokeOpacity={0.5}
            strokeWidth={4}
            style={{ filter: "blur(1.5px)" }}
          />
        ) : null}
        {jelly > 0.2 ? (
          <path d={smoothPath(wave)} fill="none" stroke={palette.primary} strokeWidth={6} strokeLinecap="round" opacity={0.7} style={{ filter: "blur(2.5px)" }} />
        ) : null}
        <Text x={470} y={880} label p={progress(frame, 24, 22, ease.outExpo)}>
          Pulse
        </Text>
        <Text x={560} y={1410} label p={progress(frame, 32, 22, ease.outExpo)}>
          Movement
        </Text>
        <Text x={720} y={1250} label p={progress(frame, 44, 22, ease.outExpo)}>
          Estimated stages
        </Text>
      </Stage>
      <Kinetic y={380} at={0.2} text="Stages are *estimated.*" size={92} />
    </AbsoluteFill>
  );
};

/* 4. Timing: one droplet falls as they drift off, a second as they wake; liquid fills a crisp tube between. */
const Timing: React.FC = () => {
  const frame = useCurrentFrame();
  const palette = usePalette();
  const t = frame / 30;
  const asleepAt = sec(2.15);
  const wakeAt = sec(3.85);
  const S = 1.35;
  const awake = lying(640, 1250);
  const asleep: Pose = { ...awake, eyes: 0, head: -8 };
  const stretch: Pose = { ...awake, eyes: 1, armR: [135, 12], armL: [142, 4], legL: [6, 0], legR: [-6, 0] };
  const p = breathe(
    posesAt(frame, [
      [asleepAt - 12, awake],
      [asleepAt, asleep],
      [wakeAt, asleep],
      [wakeAt + 18, stretch, ease.outBack],
      [wakeAt + 60, { ...stretch, armR: [120, 30], armL: [126, 20] }],
    ]),
    frame,
  );
  const x0 = 170;
  const x1 = 830;
  const ty = 800;
  const fill = progress(frame, asleepAt, wakeAt - asleepAt, ease.inOutCubic);
  const drop = (x: number, land: number) => {
    const f = progress(frame, land - 13, 13, ease.inExpo);
    const splash = progress(frame, land, 20, ease.outExpo);
    if (f <= 0) return null;
    return (
      <g>
        {f < 1 ? <ellipse cx={x} cy={lerp(520, ty, f)} rx={20} ry={20 + f * 10} fill={palette.primary} /> : null}
        {new Array(6).fill(0).map((_, i) => {
          const a = -Math.PI * (0.15 + (i / 5) * 0.7);
          return splash > 0 && splash < 1 ? (
            <circle key={i} cx={x + Math.cos(a) * splash * 90} cy={ty + Math.sin(a) * splash * 70 + splash * splash * 40} r={9 * (1 - splash)} fill={palette.primary} />
          ) : null;
        })}
      </g>
    );
  };
  return (
    <AbsoluteFill>
      <Stage>
        <defs>
          <Goo id="time-goo" blur={10} />
        </defs>
        <rect x={x0} y={ty - 36} width={x1 - x0} height={72} rx={36} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth={3} />
        <g filter="url(#time-goo)">
          {fill > 0 ? <path d={liquidPill(x0 + 6, ty - 30, Math.max(60, (x1 - x0 - 12) * fill), 60, "tube", t, 4 * (1 - fill) + 1)} fill={palette.primary} /> : null}
          {drop(x0 + 36, asleepAt)}
          {drop(x1 - 36, wakeAt)}
        </g>
        <Text x={x0} y={ty - 70} anchor="start" p={progress(frame, asleepAt, 20, ease.outExpo)}>
          Fell asleep
        </Text>
        <Text x={x1} y={ty - 70} anchor="end" p={progress(frame, wakeAt, 20, ease.outExpo)}>
          Woke up
        </Text>
        <Sleeper p={p} s={S} bedX={110} bedEnd={910} seed="blanket2" />
        <Dream x={rig(p, S).head[0] + 30} y={rig(p, S).head[1] - 80} t={frame - asleepAt} color={palette.primary} intensity={frame < wakeAt ? 1 : 0} />
      </Stage>
      <Kinetic y={380} at={0.2} text="But timing is *precise.*" size={92} />
    </AbsoluteFill>
  );
};

/* 5. The study: a crowd of people pops up while the count races to 60,000; then they melt and pour into two bars. */
const Study: React.FC = () => {
  const frame = useCurrentFrame();
  const palette = usePalette();
  const t = frame / 30;
  const count = Math.round(progress(frame, 6, sec(2), ease.outExpo) * 60000);
  const compareAt = sec(4.1);
  const counterIn = progress(frame, 4, 26, ease.outBack);
  const counterOut = progress(frame, compareAt - 12, 16, ease.inOutCubic);
  const bars = [
    { y: 980, len: 760, color: palette.primary, label: "Steady timing" },
    { y: 1210, len: 420, color: palette.muted, label: "Hours slept" },
  ];
  const fills = bars.map((_, b) => progress(frame, compareAt + 12 + b * 6, 34, ease.outQuart));
  const crowd: React.ReactNode[] = [];
  const droplets: React.ReactNode[][] = [[], []];
  for (let r = 0; r < 11; r++) {
    for (let c = 0; c < 10; c++) {
      const i = r * 10 + c;
      const x = 150 + c * 77;
      const y = 590 + r * 82;
      const dist = Math.hypot(x - CX, y - 990) / 700;
      const pop = progress(frame, 4 + dist * 24, 18, ease.outBack);
      if (pop <= 0) continue;
      const startMelt = compareAt - 8 + random(`ml${i}`) * 14;
      const melt = progress(frame, startMelt, 10, ease.inOutCubic);
      crowd.push(
        <Mini key={i} x={x} y={y} s={pop * (1 - melt)} color={palette.muted} sway={Math.sin(frame * 0.08 + c * 0.5 + r * 0.3) * 6} opacity={0.85} />,
      );
      const b = i % 3 === 0 ? 1 : 0;
      const m = progress(frame, startMelt + 6, 24, ease.inOutCubic);
      if (melt > 0 && m < 1) {
        const bar = bars[b];
        const tx = 150 + random(`tx${i}`) * (bar.len - 80);
        const tyy = bar.y + 36;
        const lift = Math.sin(m * Math.PI) * -120;
        droplets[b].push(<circle key={i} cx={lerp(x, tx, m)} cy={lerp(y, tyy, m) + lift} r={12 * melt} fill={bar.color} />);
      }
    }
  }
  return (
    <AbsoluteFill>
      <Stage>
        <defs>
          <Goo id="study-goo-0" blur={10} />
          <Goo id="study-goo-1" blur={10} />
        </defs>
        {crowd}
        {bars.map((bar, b) => (
          <g key={b}>
            <Text x={110} y={bar.y - 30} anchor="start" color={b === 0 ? palette.primary : palette.muted} p={progress(frame, compareAt + 4 + b * 6, 22, ease.outExpo)}>
              {bar.label}
            </Text>
            <g filter={`url(#study-goo-${b})`} opacity={b === 0 ? 1 : 0.6}>
              {fills[b] > 0 ? <path d={liquidPill(110, bar.y, Math.max(72, bar.len * fills[b]), 72, `bar${b}`, t, 5)} fill={bar.color} /> : null}
              {droplets[b]}
            </g>
          </g>
        ))}
        <Text x={110} y={1370} anchor="start" size={40} color={palette.muted} p={progress(frame, compareAt + 40, 22, ease.outExpo)}>
          Better predictor of long-term health
        </Text>
        <g opacity={Math.min(1, counterIn) * (1 - counterOut)} transform={`translate(${CX} ${990 - counterOut * 200}) scale(${0.7 + 0.3 * counterIn}) translate(${-CX} -990)`}>
          <path d={blobPath(CX, 990, 360, 150, "cnt", t, 0.06)} fill={palette.ground} opacity={0.9} style={{ filter: "blur(18px)" }} />
          <text x={CX} y={1040} textAnchor="middle" fill={palette.primary} style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 176, letterSpacing: "-0.03em" }}>
            {count.toLocaleString("en-US")}
          </text>
          <Text x={CX} y={1105} label p={progress(frame, 14, 22, ease.outExpo)}>
            People in one study
          </Text>
        </g>
      </Stage>
      <Kinetic y={380} at={4.3} text="Steady *beats* long." size={100} />
    </AbsoluteFill>
  );
};

/* 6. The payoff: seven sleepers in seven beds drift in at different bedtimes, then flow into line on amber. */
const Week: React.FC = () => {
  const frame = useCurrentFrame();
  const palette = usePalette();
  const t = frame / 30;
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const offsets = [10, 110, -40, 180, 60, 240, 0];
  const widths = [450, 400, 470, 370, 420, 330, 450];
  const target = 330;
  const alignAt = sec(5.2);
  const guide = progress(frame, alignAt - 12, 26, ease.outExpo);
  const bracketP = progress(frame, sec(2.4), 24, ease.outExpo);
  const moves = offsets.map((_, i) => progress(frame, alignAt + i * 3, 32, ease.outBack));
  const lefts = offsets.map((o, i) => lerp(target + o, target, moves[i]));
  const minL = Math.min(...lefts);
  const maxL = Math.max(...lefts);
  const spread = maxL - minL;
  const settled = progress(frame, alignAt + 42, 22, ease.outExpo);
  const by = 1420;
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  return (
    <AbsoluteFill>
      <Stage>
        <defs>
          <Goo id="week-goo" blur={8} />
        </defs>
        <Text x={110} y={612} anchor="start" label p={progress(frame, 6, 22, ease.outExpo)}>
          Your bedtimes
        </Text>
        <rect x={target - 34} y={650} width={68} height={Math.max(0, 740 * Math.min(1, guide))} rx={34} fill={palette.amber} opacity={0.07 + settled * 0.07} style={{ filter: "blur(16px)" }} />
        <g filter="url(#week-goo)">
          <Draw d={`M ${target} 650 V 1390`} p={guide} stroke={palette.amber} width={8} tip={false} />
          {guide > 0.95 ? <circle cx={target} cy={1390 + Math.sin(frame * 0.1) * 4} r={14 + settled * 4} fill={palette.amber} /> : null}
        </g>
        {days.map((d, i) => {
          const y = 680 + i * 102;
          const enter = progress(frame, 8 + i * 3, 26, ease.outBack);
          const x = lefts[i] + (1 - enter) * 440;
          const slosh = Math.sin(moves[i] * Math.PI) * 12 + (1 - Math.min(1, enter)) * 10;
          const head: Pt = [x + 38, y + 35];
          return (
            <g key={i} opacity={Math.min(1, enter * 1.5)}>
              <text x={110} y={y + 48} fill={palette.muted} style={{ fontFamily: fonts.sans, fontSize: 38, fontWeight: 500 }}>
                {d}
              </text>
              <path d={liquidPill(x, y, widths[i], 70, `bed${i}`, t * 0.6, 3 + slosh)} fill={BLANKET} stroke="rgba(255,255,255,0.18)" strokeWidth={3} />
              <circle cx={head[0]} cy={head[1]} r={24} fill={palette.muted} />
              <ellipse cx={head[0] + 2} cy={head[1] - 6} rx={5} ry={1.8} fill={palette.ground} />
              {settled > 0 ? <Dream x={head[0] + 10} y={head[1] - 30} t={frame - alignAt - 42 - i * 6} color={palette.primary} intensity={settled * 0.7} /> : null}
            </g>
          );
        })}
        <g opacity={interpolate(spread, [10, 80], [0, 1], clamp)}>
          <Draw
            d={smoothPath([[minL, by - 26], [minL + 6, by - 6], [minL + 26, by], [maxL - 26, by], [maxL - 6, by - 6], [maxL, by - 26]])}
            p={bracketP}
            width={5}
            tip={false}
          />
          <Text x={(minL + maxL) / 2} y={by + 60} p={Math.min(1, bracketP) * interpolate(spread, [120, 200], [0, 1], clamp)} size={42}>
            Swings over an hour
          </Text>
        </g>
        <Text x={target} y={by + 60} p={settled} size={42} color={palette.amber}>
          Same time, every night
        </Text>
      </Stage>
      <Kinetic y={380} at={0.3} out={4.7} text="Look at your *bedtimes.*" size={92} />
      <Kinetic y={380} at={5.2} text="Shrink the *swing.*" size={100} />
    </AbsoluteFill>
  );
};

/* 7. Close: one peaceful sleeper. */
const Close: React.FC = () => {
  const frame = useCurrentFrame();
  const palette = usePalette();
  const s = 1.05;
  const p = breathe(lying(590, 1150, { eyes: 0, head: -8 }), frame);
  return (
    <AbsoluteFill>
      <Stage>
        <Sleeper p={p} s={s} bedX={200} bedEnd={830} seed="blanket3" />
        <Dream x={rig(p, s).head[0] + 24} y={rig(p, s).head[1] - 70} t={frame} color={palette.primary} />
      </Stage>
      <Kinetic y={760} at={0.15} text="Not your *REM.*" size={130} />
    </AbsoluteFill>
  );
};

export const SleepTrackers: React.FC<{ supers: boolean }> = ({ supers }) => (
  <PaletteContext.Provider value={palettes.night}>
    <SupersContext.Provider value={supers}>
      <AbsoluteFill style={{ backgroundColor: palettes.night.ground }}>
        <FluidBackground />
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
        {HANDOFFS.map((h, i) => (
          <LiquidWipe key={i} at={sec(h) + 6} seed={`w${i}`} />
        ))}
      </AbsoluteFill>
    </SupersContext.Provider>
  </PaletteContext.Provider>
);

