// Gate 0 sketches for BodyClock (Oct 31): three directions, four frames each (frame i = panel i + 1): hook, main idea,
// the camping study, the quiz (with the evening tip: lamp on, overhead light off).
// A: the analog clock on the nightstand is your body clock; window light and the ceiling light set it.
// B: a houseplant on the windowsill is your body clock: it leans toward whichever light is strongest.
// C: a sundial on the floor is your body clock: a clock that only reads light; the bulb's shadow points late.
// One still top-down bedroom on a fixed stage, supers above it, you as the dot. Sheet: scripts/storyboard.mjs.
import { useId } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { pickPhoto } from "../brand/photos";
import { fonts } from "../brand/theme";
import { PhotoBackground } from "../components/PhotoBackground";
import { Clock, LINE, SurfaceTint, useSurface } from "../components/objects";
import { P } from "../components/premium";
import { HeadlineIn } from "../templates/motion";

export const BOARD_PANELS = 17;

export const PHOTO = pickPhoto("body-clock");
const W = 640;
const H = 760;
export const STAGE = { x: 146, y: 620, w: 720, h: (H * 720) / W };
const TOP = 360;

const R = {
  head: [229, 132] as [number, number],
  bed: { x: 64, y: 52, w: 330, h: 500, r: 36 },
  duvet: { x: 64, y: 222, w: 330, h: 330, r: 36 },
  pillow: { x: 134, y: 84, w: 190, h: 96, r: 36 },
  nightstand: { x: 420, y: 52, w: 156, h: 214, r: 26 },
  rug: { x: 90, y: 600, w: 260, h: 120, r: 60 },
  clock: [498, 150] as [number, number],
  ceiling: [490, 400] as [number, number],
  lamp: [540, 670] as [number, number],
  plant: [560, 540] as [number, number],
  dial: [220, 660] as [number, number],
};
const SUN = "#FFE7BF";
const BULB = "#E4ECFF";

type Light = { o: number; sliver?: boolean };
type RoomProps = {
  /** 0 calm … 1 wide awake: your glow. */
  awake?: number;
  /** Groggy: the glow dim and smeared. */
  groggy?: number;
  /** Morning light through the window; `sliver` = the curtain nearly shut (a dim indoor morning). */
  sun?: Light;
  curtain?: number;
  /** The overhead light: fixture on the ceiling and its hard, cold pool over everything. */
  ceiling?: number;
  /** The bedside lamp: low, warm, amber (once). */
  lamp?: number;
  /** A: the clock, small on the nightstand or grown over the room; `lag` = hours your body clock runs behind. */
  clock?: { hours: number; grow?: number; lag?: number; size?: number; at?: [number, number]; trail?: number };
  /** Out the door: a sunlit step past the bottom wall; you (and your mug) out on it. */
  outside?: number;
  /** Where you are, when you're not on the pillow. */
  you?: [number, number];
  /** B: the plant on the sill. `lean` = direction of the light it turns to (degrees, 0 = up), `droop` 0..1. */
  plant?: { lean: number; droop?: number; grow?: number; at?: [number, number] };
  /** C: the sundial on the rug. `shadow` = direction of the shadow (degrees), `ghost` = where it should point. */
  dial?: { shadow: number; crisp?: number; ghost?: number; grow?: number; at?: [number, number] };
  camp?: boolean;
  quiz?: number;
};

const Card: React.FC = () => {
  const s = useSurface();
  return (
    <g>
      <rect x={10} y={22} width={560} height={560} rx={34} fill="rgba(0,0,0,0.35)" />
      <rect width={560} height={560} rx={34} fill={s(0.22, 0.08)} stroke="rgba(243,238,230,0.7)" strokeWidth={LINE} />
      <text x={56} y={96} fontFamily={fonts.sans} fontWeight={500} fontSize={26} letterSpacing="0.12em" fill={P.dim}>
        ARE YOU A NIGHT OWL?
      </text>
      <rect x={56} y={160} width={58} height={58} rx={16} fill="none" stroke="rgba(243,238,230,0.75)" strokeWidth={LINE} />
      <text fontFamily={fonts.sans} fontWeight={600} fontSize={74} letterSpacing="-0.03em" fill={P.ink}>
        <tspan x={140} y={214}>Take the</tspan>
        <tspan x={140} y={296}>sleep quiz</tspan>
      </text>
      <line x1={56} y1={400} x2={504} y2={400} stroke="rgba(243,238,230,0.25)" strokeWidth={2} />
      <text x={56} y={484} fontFamily={fonts.sans} fontWeight={600} fontSize={46} letterSpacing="-0.02em" fill={P.ink}>
        Link in bio
      </text>
    </g>
  );
};

const rad = (d: number) => (d * Math.PI) / 180;

/** B: a houseplant from above: pot, soil, six leaves fanned toward the light. */
const Plant: React.FC<{ x: number; y: number; lean: number; droop?: number; scale?: number }> = ({ x, y, lean, droop = 0, scale = 1 }) => {
  const s = useSurface();
  const L = 78 - 26 * droop;
  const pull = 26 * (1 - droop);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <circle r={40} fill="rgba(0,0,0,0.3)" transform="translate(4 8)" />
      <circle r={40} fill={s(0.1, 0.3)} stroke="rgba(243,238,230,0.6)" strokeWidth={LINE} />
      <circle r={30} fill={s(0.02, 0.4)} />
      {[-75, -45, -15, 15, 45, 75, 180].map((off, i) => {
        // Leaves bunch toward the light: the side facing it is long, the back leaf short.
        const a = lean + off * (0.75 + 0.25 * droop);
        const len = (off === 180 ? 0.55 : 1 - Math.abs(off) / 260) * L;
        const cx = (len * 0.55 + (off === 180 ? 0 : pull)) * Math.sin(rad(a));
        const cy = -(len * 0.55 + (off === 180 ? 0 : pull)) * Math.cos(rad(a));
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx={len * 0.2}
            ry={len * 0.52}
            transform={`rotate(${a} ${cx} ${cy})`}
            fill="rgba(170,214,186,0.32)"
            stroke="rgba(214,238,222,0.8)"
            strokeWidth={LINE}
          />
        );
      })}
    </g>
  );
};

/** C: a sundial from above: dial, hour ticks fanned from morning (sun) to evening (moon), gnomon, shadow. */
const Sundial: React.FC<{ x: number; y: number; r: number; shadow: number; crisp?: number; ghost?: number }> = ({ x, y, r, shadow, crisp = 1, ghost }) => {
  const s = useSurface();
  const ray = (deg: number, r0: number, r1: number) => [r0 * Math.sin(rad(deg)), -r0 * Math.cos(rad(deg)), r1 * Math.sin(rad(deg)), -r1 * Math.cos(rad(deg))];
  const wedge = (deg: number, len: number) => {
    const [, , tx, ty] = ray(deg, 0, len);
    const [lx, ly] = [r * 0.09 * Math.cos(rad(deg)), r * 0.09 * Math.sin(rad(deg))];
    return `M ${lx} ${ly} L ${tx} ${ty} L ${-lx} ${-ly} Z`;
  };
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill="rgba(0,0,0,0.3)" transform="translate(4 8)" />
      <circle r={r} fill={s(0.42, 0.1)} stroke="rgba(243,238,230,0.7)" strokeWidth={LINE} />
      <circle r={r * 0.84} fill="none" stroke="rgba(243,238,230,0.2)" strokeWidth={2} />
      {Array.from({ length: 13 }, (_, i) => {
        const [x1, y1, x2, y2] = ray(-90 + i * 15, r * (i % 3 === 0 ? 0.62 : 0.7), r * 0.8);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={`rgba(243,238,230,${i % 3 === 0 ? 0.75 : 0.35})`} strokeWidth={i % 3 === 0 ? LINE : 2} strokeLinecap="round" />;
      })}
      {/* Morning at the left end, night at the right. */}
      <circle cx={-r * 0.92} cy={r * 0.16} r={r * 0.06} fill={SUN} opacity={0.9} />
      <path d="M27 5 A16 16 0 1 0 35 27 A13 13 0 1 1 27 5 Z" fill={P.ink} opacity={0.85} transform={`translate(${r * 0.86} ${r * 0.08}) scale(${r / 300}) translate(-20 -16)`} />
      {ghost !== undefined ? <path d={wedge(ghost, r * 0.78)} fill="none" stroke="rgba(243,238,230,0.7)" strokeWidth={2} strokeDasharray="6 7" strokeLinejoin="round" /> : null}
      <path d={wedge(shadow, r * 0.78)} fill="#02040C" opacity={0.4 + 0.5 * crisp} style={{ filter: crisp < 0.5 ? "blur(6px)" : undefined }} />
      {/* The gnomon, edge-on from above: a thin bright fin pointing north. */}
      <line x1={0} y1={0} x2={0} y2={-r * 0.2} stroke={P.ink} strokeWidth={LINE + 2} strokeLinecap="round" />
      <circle r={8} fill={P.ink} />
    </g>
  );
};

/** The camp: eight tents in a ring round the fire, a few trees, first sun at the top edge. No bulbs. */
const Camp: React.FC<{ id: string }> = ({ id }) => {
  const s = useSurface();
  const [fx, fy] = [320, 410];
  return (
    <g>
      <path d="M 0 0 L 640 0 L 640 90 Q 320 190 0 90 Z" fill={`url(#${id}dawn)`} />
      {[
        [40, 260, 70],
        [600, 230, 60],
        [50, 690, 80],
        [610, 600, 64],
      ].map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill={s(0.04, 0.3)} stroke="rgba(243,238,230,0.2)" strokeWidth={LINE} />
          <circle cx={x} cy={y} r={r * 0.55} fill="none" stroke="rgba(243,238,230,0.12)" strokeWidth={2} />
        </g>
      ))}
      <circle cx={fx} cy={fy} r={190} fill={`url(#${id}fire)`} />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return <circle key={i} cx={fx + 40 * Math.cos(a)} cy={fy + 40 * Math.sin(a)} r={10} fill={s(0.1, 0.2)} stroke="rgba(243,238,230,0.5)" strokeWidth={2} />;
      })}
      <circle cx={fx} cy={fy} r={22} fill={SUN} opacity={0.85} />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
        const tx = fx + 215 * Math.cos(a);
        const ty = fy + 255 * Math.sin(a);
        const deg = (a * 180) / Math.PI + 90;
        // Each tent's door faces the fire; its camper (a dot) sits just outside it.
        return (
          <g key={i}>
            <g transform={`translate(${tx} ${ty}) rotate(${deg})`}>
              <rect x={-46} y={-38} width={92} height={76} rx={18} fill="rgba(0,0,0,0.3)" transform="translate(3 6)" />
              <rect x={-46} y={-38} width={92} height={76} rx={18} fill={s(0.12, 0.25)} stroke="rgba(243,238,230,0.6)" strokeWidth={LINE} />
              <line x1={-46} y1={0} x2={46} y2={0} stroke="rgba(243,238,230,0.45)" strokeWidth={2} transform="rotate(90)" />
            </g>
            <circle cx={fx + 150 * Math.cos(a)} cy={fy + 178 * Math.sin(a)} r={14} fill={P.ink} opacity={0.9} />
          </g>
        );
      })}
    </g>
  );
};

const Room: React.FC<RoomProps> = ({ awake = 1, groggy = 0, sun, curtain = 0, ceiling = 0, lamp = 0, clock, plant, dial, camp, quiz = 0, outside = 0, you }) => {
  const s = useSurface();
  const id = `bc${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const piece = (q: { x: number; y: number; w: number; h: number; r: number }, fill: number, line: number) => (
    <rect x={q.x} y={q.y} width={q.w} height={q.h} rx={q.r} fill={s(fill, 0.28)} stroke={`rgba(243,238,230,${line})`} strokeWidth={LINE} />
  );
  const [hx, hy] = you ?? R.head;
  const grow = clock?.grow ?? 0;
  const small = clock?.size ?? 108;
  const home = clock?.at ?? R.clock;
  const size = small + (360 - small) * grow;
  const ccx = home[0] + (320 - home[0]) * grow;
  const ccy = home[1] + (380 - home[1]) * grow;
  const lag = clock?.lag;
  return (
    <div style={{ position: "relative", width: STAGE.w, height: STAGE.h }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 45,
          border: `${LINE}px solid rgba(243,238,230,0.22)`,
          background: "linear-gradient(170deg, rgba(255,255,255,0.05), rgba(5,6,16,0.35))",
          boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
        }}
      />
      <svg width={STAGE.w} height={STAGE.h} viewBox={`0 0 ${W} ${H}`} style={{ position: "relative", display: "block", overflow: "hidden", borderRadius: 45 }}>
        <defs>
          <radialGradient id={`${id}glow`}>
            <stop offset="0" stopColor="#F3EEE6" stopOpacity={0.45} />
            <stop offset="1" stopColor="#F3EEE6" stopOpacity={0} />
          </radialGradient>
          <radialGradient id={`${id}bulb`}>
            <stop offset="0" stopColor={BULB} stopOpacity={0.5} />
            <stop offset="0.6" stopColor={BULB} stopOpacity={0.18} />
            <stop offset="1" stopColor={BULB} stopOpacity={0} />
          </radialGradient>
          <radialGradient id={`${id}lamp`}>
            <stop offset="0" stopColor={P.amber} stopOpacity={0.55} />
            <stop offset="1" stopColor={P.amber} stopOpacity={0} />
          </radialGradient>
          <radialGradient id={`${id}fire`}>
            <stop offset="0" stopColor={SUN} stopOpacity={0.45} />
            <stop offset="1" stopColor={SUN} stopOpacity={0} />
          </radialGradient>
          <linearGradient id={`${id}sun`} x1="1" y1="0.3" x2="0" y2="0.6">
            <stop offset="0" stopColor={SUN} stopOpacity={0.6} />
            <stop offset="1" stopColor={SUN} stopOpacity={0.12} />
          </linearGradient>
          <linearGradient id={`${id}dawn`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={SUN} stopOpacity={0.55} />
            <stop offset="1" stopColor={SUN} stopOpacity={0} />
          </linearGradient>
        </defs>
        {camp ? (
          <Camp id={id} />
        ) : (
          <>
            {outside > 0.01 ? null : piece(R.rug, 0.02, 0.18)}
            {piece(R.nightstand, 0.05, 0.3)}
            {piece(R.bed, 0.06, 0.62)}
            {piece(R.duvet, 0.14, 0.62)}
            <rect x={R.pillow.x} y={R.pillow.y} width={R.pillow.w} height={R.pillow.h} rx={R.pillow.r} fill={s(0.3, 0.12)} stroke="rgba(243,238,230,0.8)" strokeWidth={LINE} />
            {/* The window in the right wall, and its curtain (two panels that close toward the middle). */}
            <line x1={628} y1={290} x2={628} y2={530} stroke="rgba(255,240,210,0.75)" strokeWidth={8} strokeLinecap="round" />
            {curtain > 0.01 ? (
              <>
                <rect x={600} y={282} width={22} height={6 + 114 * curtain} rx={10} fill={s(0.2, 0.2)} stroke="rgba(243,238,230,0.55)" strokeWidth={2} />
                <rect x={600} y={532 - 6 - 114 * curtain} width={22} height={6 + 114 * curtain} rx={10} fill={s(0.2, 0.2)} stroke="rgba(243,238,230,0.55)" strokeWidth={2} />
              </>
            ) : null}
            {sun && sun.o > 0.01 ? (
              <path
                d={sun.sliver ? "M 616 398 L 616 422 L 330 560 L 330 500 Z" : "M 616 290 L 616 530 L 300 680 L 230 260 Z"}
                fill={`url(#${id}sun)`}
                opacity={sun.o * (sun.sliver ? 0.6 : 0.9)}
              />
            ) : null}
          </>
        )}
        {/* Outside: the bottom wall with an open door, and a sunlit step beyond it. */}
        {outside > 0.01 && !camp ? (
          <g opacity={outside}>
            <rect x={0} y={600} width={640} height={160} fill={SUN} opacity={0.22} />
            <path d="M 0 600 L 260 600 M 400 600 L 640 600" stroke="rgba(243,238,230,0.6)" strokeWidth={LINE + 3} strokeLinecap="round" />
            <path d="M 400 600 A 140 140 0 0 0 260 600" fill="none" stroke="rgba(243,238,230,0.35)" strokeWidth={2} strokeDasharray="5 8" />
            {/* The mug: a cup from above, handle, a curl of steam. */}
            <g transform={`translate(${hx + 70} ${hy + 6})`}>
              <circle r={26} fill="rgba(0,0,0,0.3)" transform="translate(3 6)" />
              <rect x={20} y={-9} width={22} height={18} rx={9} fill="none" stroke={P.ink} strokeWidth={LINE} />
              <circle r={26} fill={s(0.2, 0.2)} stroke={P.ink} strokeWidth={LINE} />
              <circle r={17} fill="#3A2A1E" />
              <path d="M -6 -36 q 10 -12 0 -24 q -10 -12 0 -24" fill="none" stroke="rgba(243,238,230,0.6)" strokeWidth={LINE} strokeLinecap="round" />
            </g>
          </g>
        ) : null}
        {/* You: a soft glow and a dot on the pillow; groggy, the glow is dim and smeared. */}
        {camp && !you ? null : (
          <>
            <ellipse
              cx={hx}
              cy={hy + 20 * groggy}
              rx={(90 + 120 * awake) * (1 - 0.3 * groggy)}
              ry={(90 + 120 * awake) * (1 - 0.3 * groggy) * (1 + 0.5 * groggy)}
              fill={`url(#${id}glow)`}
              opacity={Math.min(1, 0.35 + 0.65 * awake) * (1 - 0.35 * groggy)}
            />
            <circle cx={hx} cy={hy} r={27} fill={P.ink} opacity={1 - 0.25 * groggy} />
          </>
        )}
        {plant ? <Plant x={(plant.at ?? R.plant)[0]} y={(plant.at ?? R.plant)[1]} lean={plant.lean} droop={plant.droop} scale={1 + 1.6 * (plant.grow ?? 0)} /> : null}
        {dial ? <Sundial x={(dial.at ?? R.dial)[0]} y={(dial.at ?? R.dial)[1]} r={86 + 150 * (dial.grow ?? 0)} shadow={dial.shadow} crisp={dial.crisp} ghost={dial.ghost} /> : null}
        {clock ? (
          <g>
            {grow > 0 ? <circle cx={ccx + 6} cy={ccy + 14} r={size / 2} fill="rgba(0,0,0,0.35)" /> : null}
            <g transform={`translate(${ccx - size / 2} ${ccy - size / 2})`}>
              <Clock size={size} minutes={clock.hours * 60} wedge={lag !== undefined && lag > 0.05 ? { from: clock.hours - lag, to: clock.hours } : undefined} />
            </g>
            {/* Dotted arc: how far the body clock's hand just moved. */}
            {clock.trail !== undefined && lag !== undefined ? (
              <path
                d={`M ${ccx + size * 0.34 * Math.sin(rad((clock.hours - clock.trail) * 30))} ${ccy - size * 0.34 * Math.cos(rad((clock.hours - clock.trail) * 30))} A ${size * 0.34} ${size * 0.34} 0 0 1 ${ccx + size * 0.34 * Math.sin(rad((clock.hours - lag - 0.15) * 30))} ${ccy - size * 0.34 * Math.cos(rad((clock.hours - lag - 0.15) * 30))}`}
                fill="none"
                stroke="rgba(243,238,230,0.8)"
                strokeWidth={LINE}
                strokeDasharray="2 10"
                strokeLinecap="round"
              />
            ) : null}
            {/* Your body clock's hour hand, dashed, running behind the real one. */}
            {lag !== undefined ? (
              <line
                x1={ccx}
                y1={ccy}
                x2={ccx + size * 0.27 * Math.sin(rad((clock.hours - lag) * 30))}
                y2={ccy - size * 0.27 * Math.cos(rad((clock.hours - lag) * 30))}
                stroke={P.ink}
                strokeWidth={LINE + 1}
                strokeDasharray="6 8"
                strokeLinecap="round"
              />
            ) : null}
          </g>
        ) : null}
        {/* The bedside lamp: a round shade from above and a low warm pool (amber, once). */}
        {lamp > 0.01 && !camp ? (
          <g>
            <circle cx={R.lamp[0]} cy={R.lamp[1]} r={230} fill={`url(#${id}lamp)`} opacity={lamp} />
            <circle cx={R.lamp[0]} cy={R.lamp[1]} r={44} fill={s(0.2, 0.15)} stroke={P.amber} strokeWidth={LINE} />
            <circle cx={R.lamp[0]} cy={R.lamp[1]} r={14} fill={P.amber} />
          </g>
        ) : null}
        {/* The overhead light: on the ceiling, so it's drawn over everything; a hard, cold pool. */}
        {!camp ? (
          <g>
            {ceiling > 0.01 ? <circle cx={R.ceiling[0]} cy={R.ceiling[1]} r={460} fill={`url(#${id}bulb)`} opacity={ceiling} /> : null}
            <circle cx={R.ceiling[0]} cy={R.ceiling[1]} r={50} fill="none" stroke="rgba(243,238,230,0.35)" strokeWidth={2} />
            <circle cx={R.ceiling[0]} cy={R.ceiling[1]} r={34} fill={s(0.1, 0.2)} stroke={ceiling > 0.5 ? BULB : "rgba(243,238,230,0.6)"} strokeWidth={ceiling > 0.5 ? 10 : LINE} />
          </g>
        ) : null}
        {quiz > 0.01 ? (
          <g transform="translate(56 40) scale(0.8)" opacity={quiz}>
            <Card />
          </g>
        ) : null}
      </svg>
    </div>
  );
};

const Super: React.FC<{ text: string }> = ({ text }) => <HeadlineIn y={TOP} size={100} text={text} at={-3} align="center" />;
const Frame: React.FC<{ text: string } & RoomProps> = ({ text, ...room }) => (
  <>
    <div style={{ position: "absolute", left: STAGE.x, top: STAGE.y }}>
      <Room {...room} />
    </div>
    <Super text={text} />
  </>
);

// Directions of light in the room, for the plant to lean toward and the dial's shadow to fall away from.
const TO_CEILING = -30;
const TO_LAMP = 160;

const HOOK = "Awake at night, *foggy all morning?*";
const MAIN = "Indoors, your body clock *slides later.*";
const CAMP = "A week camping: *two hours earlier.*";
const QUIZ = "Are you *a night owl?*";

const panels: Array<() => React.ReactNode> = [
  // A1. Hook: midnight on the clock, the overhead light on, you wide awake.
  () => <Frame text={HOOK} clock={{ hours: 12 }} ceiling={1} awake={1.2} />,
  // A2. The clock grows over the room: a dashed hand two hours behind the real one. Curtain nearly shut, bulb on.
  () => <Frame text={MAIN} clock={{ hours: 12, grow: 1, lag: 2 }} curtain={0.85} sun={{ o: 1, sliver: true }} ceiling={0.8} />,
  // A3. The room becomes a camp: eight tents round a fire, no bulbs, first sun at the top; the clock catches up.
  () => <Frame text={CAMP} camp />,
  // A4. Lamp on (amber), overhead off; the quiz card lifts out of the lamp's light.
  () => <Frame text={QUIZ} clock={{ hours: 10 }} lamp={1} awake={0.4} quiz={1} />,

  // B1. Hook: the plant on the sill has turned to the overhead bulb at midnight; you're wide awake.
  () => <Frame text={HOOK} plant={{ lean: TO_CEILING }} ceiling={1} awake={1.2} />,
  // B2. Main idea: curtain shut, a sliver of morning; the plant grows big and turns away from the window to the bulb.
  () => <Frame text="Your body clock *follows the light.*" plant={{ lean: -45, grow: 0.6, at: [470, 560], droop: 0.2 }} curtain={0.85} sun={{ o: 1, sliver: true }} ceiling={0.8} groggy={0.8} awake={0.4} />,
  // B3. At the camp the plant sits by the fire and leans up to the sunrise.
  () => (
    <>
      <Frame text={CAMP} camp />
      <div style={{ position: "absolute", left: STAGE.x, top: STAGE.y, width: STAGE.w, height: STAGE.h, pointerEvents: "none" }}>
        <svg width={STAGE.w} height={STAGE.h} viewBox={`0 0 ${W} ${H}`}>
          <Plant x={320} y={250} lean={0} scale={1.1} />
        </svg>
      </div>
    </>
  ),
  // B4. Lamp on, overhead off: the plant settles (droops) under the low light; its tag grows into the quiz.
  () => <Frame text={QUIZ} plant={{ lean: TO_LAMP, droop: 0.9 }} lamp={1} awake={0.4} quiz={1} />,

  // C1. Hook: at midnight the overhead bulb throws the dial's shadow to the morning side.
  () => <Frame text={HOOK} dial={{ shadow: TO_CEILING + 180 - 360 }} ceiling={1} awake={1.2} />,
  // C2. The dial grows: the bulb's hard shadow points late; the dashed ghost is where night should be.
  () => <Frame text="Your body clock *sets itself by light.*" dial={{ shadow: 50, ghost: 85, grow: 0.8, at: [250, 490] }} curtain={0.85} sun={{ o: 1, sliver: true }} ceiling={0.8} />,
  // C3. At the camp only the sun casts a shadow: crisp, on time.
  () => (
    <>
      <Frame text={CAMP} camp />
      <div style={{ position: "absolute", left: STAGE.x, top: STAGE.y, width: STAGE.w, height: STAGE.h, pointerEvents: "none" }}>
        <svg width={STAGE.w} height={STAGE.h} viewBox={`0 0 ${W} ${H}`}>
          <Sundial x={320} y={250} r={110} shadow={-60} crisp={1} />
        </svg>
      </div>
    </>
  ),
  // C4. Lamp on, overhead off: a low soft shadow toward night; the dial's face turns into the quiz.
  () => <Frame text={QUIZ} dial={{ shadow: TO_LAMP + 180 - 360 + 30, crisp: 0.3 }} lamp={1} awake={0.4} quiz={1} />,

  // A' (frames 13–17, after the user's notes on A). A'1. Hook: a bigger clock fills the nightstand; the hands pass midnight.
  () => <Frame text={HOOK} clock={{ hours: 12.03, size: 190, at: [470, 160] }} ceiling={1} awake={1.2} />,
  // A'2. The clock grows over the room; your body clock's dashed hand two hours behind.
  () => <Frame text={MAIN} clock={{ hours: 12, grow: 1, lag: 2 }} curtain={0.85} sun={{ o: 1, sliver: true }} ceiling={0.8} />,
  // A'3. The camp: the clock rides above the fire; on "two hours earlier" the dashed hand snaps onto the real one.
  () => <Frame text={CAMP} camp clock={{ hours: 12, size: 220, at: [320, 210], lag: 0, trail: 2 }} />,
  // A'4. Morning coffee outside: you step out the door with a mug into the sun; the dashed hand creeps a notch forward.
  () => <Frame text="Coffee outside, *ten minutes.*" clock={{ hours: 7, size: 190, at: [470, 160], lag: 1.5, trail: 2 }} sun={{ o: 1 }} outside={1} you={[300, 680]} awake={0.8} />,
  // A'5. Lamp on (amber), overhead off; the quiz card lifts out of the lamp's light.
  () => <Frame text={QUIZ} clock={{ hours: 10, size: 190, at: [470, 160] }} lamp={1} awake={0.4} quiz={1} />,
];

export const BodyClockBoard: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SurfaceTint.Provider value={PHOTO.tint}>
      <AbsoluteFill>
        <PhotoBackground photo={PHOTO} blur={44} calm={0.5} saturation={0.7} />
        <AbsoluteFill style={{ background: "linear-gradient(170deg, rgba(255,255,255,0.05), rgba(5,6,16,0.3))" }} />
        {panels[Math.min(frame, panels.length - 1)]()}
      </AbsoluteFill>
    </SurfaceTint.Provider>
  );
};
