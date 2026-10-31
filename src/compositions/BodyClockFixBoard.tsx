// BodyClock, sketch after preview 1 (user, Oct 31: "the visual is not clear enough"). Four frames:
// 1. Midnight: a hanging pendant light (cord, dome shade, bulb) washes the whole room cold and bright; clock on the nightstand.
// 2. Morning: the curtain stays nearly shut, so only a thin stripe of light gets in; the clock's dashed hand runs 2 h behind.
// 3. Camping: one tent close-up; you in a sleeping bag, sun going down outside the door, the fire to embers, a travel clock.
// 4. Night: the pendant off, the bedside lamp on (amber, once); the room is warm and dim.
import { useId } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PhotoBackground } from "../components/PhotoBackground";
import { Clock, LINE, SurfaceTint, useSurface } from "../components/objects";
import { P } from "../components/premium";
import { LedTime } from "../components/rooms";
import { HeadlineIn } from "../templates/motion";
import { PHOTO } from "./BodyClock";

export const BOARD_PANELS = 4;
const W = 640;
const H = 760;
const STAGE = { x: 180, y: 640, w: 720, h: (H * 720) / W };
const TOP = 360;
const INK = (o: number) => `rgba(243,238,230,${o})`;
const SUN = "#FFE7BF";
const BULB = "#EEF3FF";
const rad = (d: number) => (d * Math.PI) / 180;

const R = {
  head: [229, 132] as [number, number],
  bed: { x: 64, y: 52, w: 330, h: 500, r: 36 },
  duvet: { x: 64, y: 222, w: 330, h: 330, r: 36 },
  pillow: { x: 134, y: 84, w: 190, h: 96, r: 36 },
  nightstand: { x: 420, y: 52, w: 156, h: 214, r: 26 },
  rug: { x: 90, y: 600, w: 260, h: 120, r: 60 },
  clock: { x: 498, y: 100, size: 150 },
  lamp: [498, 226] as [number, number],
  pendant: [407, 420] as [number, number],
};

const fmt = (hours: number) => {
  const m = Math.round((((hours % 12) + 12) % 12) * 60);
  return `${Math.floor(m / 60) || 12}:${String(m % 60).padStart(2, "0")}`;
};

/** A digital alarm clock from above, red LED digits facing the viewer; `lag` adds your body clock as a ghost readout below. */
const ClockAt: React.FC<{ x: number; y: number; size: number; hours: number; lag?: number; ghostY?: number }> = ({ x, y, size, hours, lag, ghostY = 66 }) => {
  const s = useSurface();
  const w = size;
  const h = size * 0.5;
  return (
    <g>
      <rect x={x - w / 2 + 4} y={y - h / 2 + 9} width={w} height={h} rx={16} fill="rgba(0,0,0,0.35)" />
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={16} fill={s(0.03, 0.4)} stroke={INK(0.6)} strokeWidth={LINE} />
      <circle cx={x} cy={y} r={w * 0.55} fill={P.led} opacity={0.07} />
      <g transform={`translate(${x} ${y})`}>
        <LedTime text={fmt(hours)} h={h * 0.6} />
      </g>
      {lag !== undefined ? (
        <g transform={`translate(${x} ${y + ghostY})`}>
          <LedTime text={fmt(hours - lag)} h={h * 0.6} ghost />
        </g>
      ) : null}
    </g>
  );
};

/** A hanging pendant light: a cord down from the top wall, a dome shade, the bulb under it. */
const Pendant: React.FC<{ on: boolean }> = ({ on }) => {
  const s = useSurface();
  const [x, y] = R.pendant;
  return (
    <g>
      <line x1={x} y1={0} x2={x} y2={y - 40} stroke={INK(0.55)} strokeWidth={2.5} />
      <rect x={x - 9} y={y - 50} width={18} height={14} rx={4} fill={s(0.2, 0.2)} stroke={INK(0.6)} strokeWidth={2} />
      {on ? <ellipse cx={x} cy={y + 6} rx={40} ry={14} fill={BULB} /> : null}
      <path d={`M ${x - 70} ${y + 4} Q ${x - 64} ${y - 38} ${x} ${y - 40} Q ${x + 64} ${y - 38} ${x + 70} ${y + 4} Z`} fill={s(on ? 0.3 : 0.12, 0.2)} stroke={on ? BULB : INK(0.65)} strokeWidth={LINE} strokeLinejoin="round" />
      {on ? <circle cx={x} cy={y + 14} r={14} fill="#FFFFFF" /> : <circle cx={x} cy={y + 12} r={10} fill={INK(0.35)} />}
    </g>
  );
};

type RoomProps = {
  pendant?: boolean;
  curtain?: number;
  stripe?: boolean;
  lamp?: boolean;
  clock: { hours: number; lag?: number };
  awake?: number;
  groggy?: number;
};

const Bedroom: React.FC<RoomProps & { id: string }> = ({ id, pendant, curtain = 0, stripe, lamp, clock, awake = 1, groggy = 0 }) => {
  const s = useSurface();
  const piece = (q: { x: number; y: number; w: number; h: number; r: number }, fill: number, line: number) => (
    <rect x={q.x} y={q.y} width={q.w} height={q.h} rx={q.r} fill={s(fill, 0.28)} stroke={INK(line)} strokeWidth={LINE} />
  );
  const [hx, hy] = R.head;
  return (
    <g>
      {piece(R.rug, 0.02, 0.18)}
      {piece(R.nightstand, 0.05, 0.3)}
      {piece(R.bed, 0.06, 0.55)}
      {piece(R.duvet, 0.14, 0.55)}
      <rect x={R.pillow.x} y={R.pillow.y} width={R.pillow.w} height={R.pillow.h} rx={R.pillow.r} fill={s(0.3, 0.12)} stroke={INK(0.75)} strokeWidth={LINE} />
      {/* Window in the right wall; the curtain's two panels close toward the middle. */}
      <line x1={628} y1={290} x2={628} y2={530} stroke="rgba(255,240,210,0.75)" strokeWidth={8} strokeLinecap="round" />
      <rect x={600} y={282} width={22} height={6 + 114 * curtain} rx={10} fill={s(0.2, 0.2)} stroke={INK(0.55)} strokeWidth={2} />
      <rect x={600} y={532 - 6 - 114 * curtain} width={22} height={6 + 114 * curtain} rx={10} fill={s(0.2, 0.2)} stroke={INK(0.55)} strokeWidth={2} />
      {stripe ? <path d="M 616 398 L 616 422 L 330 560 L 330 500 Z" fill={`url(#${id}sun)`} opacity={0.7} /> : null}
      {/* Night lamp mode: the room goes warm and dim. */}
      {lamp ? (
        <>
          <rect width={W} height={H} fill="#04103A" opacity={0.3} />
          <circle cx={R.lamp[0]} cy={R.lamp[1]} r={300} fill={`url(#${id}lamp)`} />
        </>
      ) : null}
      {/* You. */}
      <ellipse cx={hx} cy={hy + 20 * groggy} rx={(90 + 120 * awake) * (1 - 0.3 * groggy)} ry={(90 + 120 * awake) * (1 - 0.3 * groggy) * (1 + 0.5 * groggy)} fill={`url(#${id}glow)`} opacity={Math.min(1, 0.35 + 0.65 * awake) * (1 - 0.35 * groggy)} />
      <circle cx={hx} cy={hy} r={27} fill={P.ink} opacity={1 - 0.25 * groggy} />
      <ClockAt x={R.clock.x} y={R.clock.y} size={R.clock.size} hours={clock.hours} lag={clock.lag} />
      {/* The bedside lamp on the nightstand: a round shade from above. */}
      <circle cx={R.lamp[0]} cy={R.lamp[1]} r={32} fill={s(0.2, 0.15)} stroke={lamp ? P.amber : INK(0.45)} strokeWidth={LINE} />
      <circle cx={R.lamp[0]} cy={R.lamp[1]} r={10} fill={lamp ? P.amber : INK(0.3)} />
      {/* The overhead light: on, it washes the whole room cold and bright. */}
      {pendant ? (
        <>
          <rect width={W} height={H} fill={BULB} opacity={0.12} />
          <circle cx={R.pendant[0]} cy={R.pendant[1] + 20} r={420} fill={`url(#${id}bulb)`} />
        </>
      ) : null}
      <Pendant on={!!pendant} />
    </g>
  );
};

/** One tent, close up from above: you in a sleeping bag, the door open to a setting sun and a fire down to embers. */
const Tent: React.FC<{ id: string }> = ({ id }) => {
  const s = useSurface();
  const t = { x: 110, y: 70, w: 420, h: 520 };
  const head: [number, number] = [320, 190];
  return (
    <g>
      {/* Low sun at the bottom edge, outside the door. */}
      <rect x={0} y={560} width={W} height={200} fill={`url(#${id}dusk)`} />
      {/* The fire outside the door, down to embers. */}
      <circle cx={320} cy={690} r={110} fill={`url(#${id}fire)`} />
      {Array.from({ length: 7 }, (_, i) => {
        const a = (i / 7) * Math.PI * 2;
        return <circle key={i} cx={320 + 30 * Math.cos(a)} cy={690 + 30 * Math.sin(a)} r={8} fill={s(0.1, 0.2)} stroke={INK(0.5)} strokeWidth={2} />;
      })}
      <circle cx={314} cy={688} r={6} fill={SUN} opacity={0.8} />
      <circle cx={327} cy={694} r={5} fill={SUN} opacity={0.6} />
      {/* Tent floor and walls (the roof seen through: translucent fabric, ridge pole down the middle). */}
      <rect x={t.x} y={t.y} width={t.w} height={t.h} rx={60} fill={s(0.1, 0.28)} stroke={INK(0.6)} strokeWidth={LINE} />
      {/* The open door: two flaps folded back. */}
      <path d={`M 230 ${t.y + t.h} L 320 ${t.y + t.h - 70} L 410 ${t.y + t.h}`} fill={s(0.04, 0.3)} stroke={INK(0.55)} strokeWidth={LINE} strokeLinejoin="round" />
      {/* Sleeping bag with its hood round your head. */}
      <rect x={232} y={130} width={176} height={360} rx={70} fill={s(0.22, 0.15)} stroke={INK(0.7)} strokeWidth={LINE} />
      <path d="M 252 250 Q 320 270 388 250" fill="none" stroke={INK(0.35)} strokeWidth={2.5} strokeLinecap="round" />
      <ellipse cx={head[0]} cy={head[1]} rx={56} ry={50} fill={s(0.3, 0.1)} stroke={INK(0.55)} strokeWidth={2.5} />
      <circle cx={head[0]} cy={head[1]} r={130} fill={`url(#${id}glow)`} opacity={0.45} />
      <circle cx={head[0]} cy={head[1]} r={24} fill={P.ink} />
      {/* Ridge pole, over everything inside. */}
      <line x1={320} y1={t.y + 6} x2={320} y2={t.y + t.h - 76} stroke={INK(0.3)} strokeWidth={2} strokeDasharray="8 10" />
      {/* The travel clock by your head: your body clock's ghost readout sliding up into the real time. */}
      <ClockAt x={470} y={150} size={120} hours={10} lag={0} ghostY={22} />
      <path d="M 470 236 L 470 200" stroke={INK(0.7)} strokeWidth={LINE} strokeDasharray="2 8" strokeLinecap="round" />
    </g>
  );
};

const Stage: React.FC<{ children: (id: string) => React.ReactNode }> = ({ children }) => {
  const id = `fx${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <div style={{ position: "absolute", left: STAGE.x, top: STAGE.y, width: STAGE.w, height: STAGE.h }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 45, border: `${LINE}px solid ${INK(0.22)}`, background: "linear-gradient(170deg, rgba(255,255,255,0.05), rgba(5,6,16,0.35))", boxShadow: "0 30px 80px rgba(0,0,0,0.35)" }} />
      <svg width={STAGE.w} height={STAGE.h} viewBox={`0 0 ${W} ${H}`} style={{ position: "relative", display: "block", overflow: "hidden", borderRadius: 45 }}>
        <defs>
          <radialGradient id={`${id}glow`}>
            <stop offset="0" stopColor="#F3EEE6" stopOpacity={0.45} />
            <stop offset="1" stopColor="#F3EEE6" stopOpacity={0} />
          </radialGradient>
          <radialGradient id={`${id}bulb`}>
            <stop offset="0" stopColor={BULB} stopOpacity={0.45} />
            <stop offset="1" stopColor={BULB} stopOpacity={0} />
          </radialGradient>
          <radialGradient id={`${id}lamp`}>
            <stop offset="0" stopColor={P.amber} stopOpacity={0.5} />
            <stop offset="1" stopColor={P.amber} stopOpacity={0} />
          </radialGradient>
          <radialGradient id={`${id}fire`}>
            <stop offset="0" stopColor={SUN} stopOpacity={0.35} />
            <stop offset="1" stopColor={SUN} stopOpacity={0} />
          </radialGradient>
          <linearGradient id={`${id}sun`} x1="1" y1="0.3" x2="0" y2="0.6">
            <stop offset="0" stopColor={SUN} stopOpacity={0.6} />
            <stop offset="1" stopColor={SUN} stopOpacity={0.12} />
          </linearGradient>
          <linearGradient id={`${id}dusk`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#F2B98A" stopOpacity={0.45} />
            <stop offset="1" stopColor="#F2B98A" stopOpacity={0} />
          </linearGradient>
        </defs>
        {children(id)}
      </svg>
    </div>
  );
};

const panels: Array<{ text: string; scene: (id: string) => React.ReactNode }> = [
  { text: "Awake at night, *foggy all morning?*", scene: (id) => <Bedroom id={id} pendant clock={{ hours: 12 }} awake={1.2} /> },
  { text: "Dim mornings. *Bright nights.*", scene: (id) => <Bedroom id={id} curtain={0.85} stripe clock={{ hours: 7, lag: 2 }} awake={0.5} groggy={0.8} /> },
  { text: "A week camping: *two hours earlier.*", scene: (id) => <Tent id={id} /> },
  { text: "At night: *a lamp, not the overhead.*", scene: (id) => <Bedroom id={id} lamp clock={{ hours: 10 }} awake={0.4} /> },
];

export const BodyClockFixBoard: React.FC = () => {
  const frame = useCurrentFrame();
  const p = panels[Math.min(frame, panels.length - 1)];
  return (
    <SurfaceTint.Provider value={PHOTO.tint}>
      <AbsoluteFill>
        <PhotoBackground photo={PHOTO} blur={44} calm={0.5} saturation={0.7} />
        <AbsoluteFill style={{ background: "linear-gradient(170deg, rgba(255,255,255,0.05), rgba(5,6,16,0.3))" }} />
        <Stage>{p.scene}</Stage>
        <HeadlineIn y={TOP} size={100} text={p.text} at={-3} align="center" />
      </AbsoluteFill>
    </SurfaceTint.Provider>
  );
};
