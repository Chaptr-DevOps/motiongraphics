// Gate 0 sketches for ClockWatcher (Oct 30): three directions, four frames each (frame i = panel i + 1).
// A: the alarm clock on the nightstand; the wedge from the hour hand to the alarm hand is the sleep that's left.
// B: the clock's face throws light; every glance swings it onto you. Turned to the wall, the light goes into the wall.
// C: each glance drops a note of sleep math over the bed; turn the clock and phone and the notes drift off.
// B+C (frames 13–16, the user's pick): the clock's light finds you and every glance drops a note into it; turned to the
// wall, the light leaves you, the notes drift out of it, and the light on the wall becomes the quiz.
// One still top-down bedroom on a fixed stage, supers above it, you as the dot. Sheet: scripts/storyboard.mjs.
import { useId } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { photos } from "../brand/photos";
import { fonts } from "../brand/theme";
import { PhotoBackground } from "../components/PhotoBackground";
import { Clock, LINE, SurfaceTint, useSurface } from "../components/objects";
import { QuizNote } from "../components/rooms";
import { P } from "../components/premium";
import { HeadlineIn } from "../templates/motion";

export const BOARD_PANELS = 16;

// The seeded pick (purple Milky Way) has no file in public/images and came out flat grey; deep blue sky instead.
export const PHOTO = photos.blueSky;
const W = 640;
const H = 760;
export const STAGE = { x: 146, y: 620, w: 720, h: (H * 720) / W };
const TOP = 360;

/** Where things are in the bedroom (room units). */
const R = {
  head: [229, 132] as [number, number],
  bed: { x: 64, y: 52, w: 330, h: 500, r: 36 },
  duvet: { x: 64, y: 222, w: 330, h: 330, r: 36 },
  pillow: { x: 134, y: 84, w: 190, h: 96, r: 36 },
  nightstand: { x: 420, y: 52, w: 156, h: 214, r: 26 },
  chair: { x: 430, y: 540, w: 160, h: 160, r: 54 },
  rug: { x: 90, y: 600, w: 260, h: 120, r: 60 },
  clock: [498, 116] as [number, number],
  phone: [498, 216] as [number, number],
};

type Note = { text: string; x: number; y: number; rot?: number; o?: number };

type RoomProps = {
  /** 0 calm … 1 wide awake: your glow. */
  awake?: number;
  /** The alarm clock: face up (time in minutes past midnight, wedge to the alarm) or turned to the wall. */
  clock?: { minutes: number; wedge?: boolean; lit?: number; grow?: number; back?: boolean; ring?: number };
  phone?: "up" | "down";
  /** A dotted line from your head to the clock: the glance. */
  glance?: number;
  /** B: the clock's light. `onYou` 1 = on your pillow, 0 = into the wall. */
  beam?: { o: number; onYou: number };
  notes?: Note[];
  /** The quiz note, grown out of the nightstand to fill the room. */
  quiz?: number;
  dark?: number;
};

const ALARM = 7;

const Room: React.FC<RoomProps> = ({ awake = 1, clock, phone = "up", glance = 0, beam, notes = [], quiz = 0, dark = 0 }) => {
  const s = useSurface();
  const id = `cw${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const piece = (q: { x: number; y: number; w: number; h: number; r: number }, fill: number, line: number) => (
    <rect x={q.x} y={q.y} width={q.w} height={q.h} rx={q.r} fill={s(fill, 0.28)} stroke={`rgba(243,238,230,${line})`} strokeWidth={LINE} />
  );
  const [cx, cy] = R.clock;
  const [hx, hy] = R.head;
  const grow = clock?.grow ?? 0;
  const size = 96 + (330 - 96) * grow;
  const ccx = cx + (430 - cx) * grow;
  const ccy = cy + (330 - cy) * grow;
  // The beam: a cone from the clock face, either onto your pillow or into the top wall.
  const beamPath = (() => {
    if (!beam) return "";
    const tx = hx + (cx - hx) * (1 - beam.onYou);
    const ty = hy + (-20 - hy) * (1 - beam.onYou);
    const a = Math.atan2(ty - cy, tx - cx) + Math.PI / 2;
    const half = 120;
    return `M ${cx} ${cy} L ${tx + half * Math.cos(a)} ${ty + half * Math.sin(a)} L ${tx - half * Math.cos(a)} ${ty - half * Math.sin(a)} Z`;
  })();
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
          <radialGradient id={`${id}screen`}>
            <stop offset="0" stopColor="#DCE6FF" stopOpacity={0.35} />
            <stop offset="1" stopColor="#DCE6FF" stopOpacity={0} />
          </radialGradient>
          <linearGradient id={`${id}beam`} gradientUnits="userSpaceOnUse" x1={cx} y1={cy} x2={beam ? hx + (cx - hx) * (1 - beam.onYou) : hx} y2={beam ? hy + (-20 - hy) * (1 - beam.onYou) : hy}>
            <stop offset="0" stopColor="#FFF4DE" stopOpacity={0.7} />
            <stop offset="1" stopColor="#FFF4DE" stopOpacity={0.12} />
          </linearGradient>
        </defs>
        <g opacity={1 - 0.4 * dark}>
          {piece(R.rug, 0.02, 0.18)}
          {piece(R.chair, 0.07, 0.28)}
          <rect x={R.chair.x + 30} y={R.chair.y + 30} width={100} height={100} rx={34} fill={s(0.12, 0.2)} stroke="rgba(243,238,230,0.28)" strokeWidth={LINE} />
          {piece(R.nightstand, 0.05, 0.3)}
          {piece(R.bed, 0.06, 0.62)}
          {piece(R.duvet, 0.14, 0.62)}
          <rect x={R.pillow.x} y={R.pillow.y} width={R.pillow.w} height={R.pillow.h} rx={R.pillow.r} fill={s(0.3, 0.12)} stroke="rgba(243,238,230,0.8)" strokeWidth={LINE} />
          <path d={`M ${R.pillow.x + 28} ${R.pillow.y + 48} Q ${hx} ${R.pillow.y + 42} ${R.pillow.x + R.pillow.w - 28} ${R.pillow.y + 48}`} fill="none" stroke="rgba(243,238,230,0.35)" strokeWidth={2.5} strokeLinecap="round" />
        </g>
        {/* The phone, lying flat: face up its screen glows (no UI), face down it's a dark slab with a camera dot. */}
        <g transform={`translate(${R.phone[0]} ${R.phone[1]})`}>
          {phone === "up" ? <circle r={130} fill={`url(#${id}screen)`} /> : null}
          <rect x={-50} y={-26} width={100} height={52} rx={12} fill="rgba(0,0,0,0.3)" transform="translate(3 6)" />
          <rect x={-50} y={-26} width={100} height={52} rx={12} fill={phone === "up" ? "rgba(214,226,255,0.55)" : s(0.02, 0.4)} stroke="rgba(243,238,230,0.6)" strokeWidth={LINE} />
          {phone === "down" ? <circle cx={-32} cy={-10} r={6} fill="none" stroke="rgba(243,238,230,0.45)" strokeWidth={2} /> : null}
        </g>
        {beam && beam.o > 0.01 ? (
          <g opacity={beam.o}>
            <path d={beamPath} fill={`url(#${id}beam)`} />
            {beam.onYou > 0.5 ? <circle cx={hx} cy={hy} r={110} fill="#FFF4DE" opacity={0.22} /> : <ellipse cx={cx} cy={4} rx={140} ry={34} fill="#FFF4DE" opacity={0.4} />}
          </g>
        ) : null}
        {glance > 0.01 ? (
          <path
            d={`M ${hx + 44} ${hy - 10} Q ${(hx + cx) / 2} ${hy - 70} ${cx - 56} ${cy - 6}`}
            fill="none"
            stroke="rgba(243,238,230,0.6)"
            strokeWidth={3}
            strokeDasharray="2 12"
            strokeLinecap="round"
            opacity={glance}
          />
        ) : null}
        {/* You: a soft glow and a dot on the pillow. */}
        <circle cx={hx} cy={hy} r={90 + 120 * awake} fill={`url(#${id}glow)`} opacity={Math.min(1, 0.35 + 0.65 * awake)} />
        <circle cx={hx} cy={hy} r={27} fill={P.ink} />
        {/* The alarm clock. Turned to the wall you only see its back: battery cover and the alarm knob. */}
        {clock && clock.back ? (
          <g transform={`translate(${cx} ${cy})`}>
            {(clock.ring ?? 0) > 0.01
              ? [70, 92, 114].map((r, i) => (
                  <path key={r} d={`M ${-r * 0.7} ${r * 0.7} A ${r} ${r} 0 0 1 ${-r * 0.7} ${-r * 0.7}`} fill="none" stroke="rgba(243,238,230,0.6)" strokeWidth={LINE} strokeLinecap="round" opacity={(clock.ring ?? 0) * (1 - i * 0.28)} />
                ))
              : null}
            <circle r={48} fill="rgba(0,0,0,0.3)" transform="translate(4 8)" />
            <circle r={48} fill={s(0.08, 0.3)} stroke="rgba(243,238,230,0.55)" strokeWidth={LINE} />
            <rect x={-20} y={-6} width={40} height={30} rx={8} fill="none" stroke="rgba(243,238,230,0.4)" strokeWidth={2} />
            <circle cx={0} cy={-24} r={7} fill="none" stroke="rgba(243,238,230,0.5)" strokeWidth={2} />
          </g>
        ) : clock ? (
          <g transform={`translate(${ccx - size / 2} ${ccy - size / 2})`}>
            {(clock.lit ?? 0) > 0.01 ? <circle cx={size / 2} cy={size / 2} r={size * 0.9} fill={`url(#${id}glow)`} opacity={clock.lit} /> : null}
            {grow > 0 ? <circle cx={size / 2 + 6} cy={size / 2 + 14} r={size / 2} fill="rgba(0,0,0,0.35)" /> : null}
            <Clock size={size} minutes={clock.minutes} alarm={ALARM} wedge={clock.wedge ? { from: (clock.minutes / 60) % 12, to: ALARM, amber: true } : undefined} />
          </g>
        ) : null}
        {/* Sleep-math notes: thoughts, so they sit on top of everything. */}
        {notes.map((n, i) => (
          <g key={i} transform={`translate(${n.x} ${n.y}) rotate(${n.rot ?? 0})`} opacity={n.o ?? 1}>
            <rect x={6} y={12} width={n.text.length * 19 + 64} height={92} rx={22} fill="rgba(0,0,0,0.35)" />
            <rect width={n.text.length * 19 + 64} height={92} rx={22} fill={s(0.24, 0.06)} stroke="rgba(243,238,230,0.75)" strokeWidth={LINE} />
            <text x={32} y={58} fontFamily={fonts.sans} fontWeight={600} fontSize={36} fill={P.ink} letterSpacing="-0.01em">
              {n.text}
            </text>
          </g>
        ))}
        {quiz > 0.01 ? (
          <g transform={`translate(40 80) rotate(-2 280 300)`} opacity={quiz}>
            <QuizNote tick={1} />
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

// 1:00 at night, alarm at 7: six hours left. Then 1:30: five and a half.
const SIX = 60;
const FIVE_HALF = 90;
const NOTE_X = 90;

const panels: Array<() => React.ReactNode> = [
  // A1. Hook: your glance goes to the clock on the nightstand; it lights up.
  () => <Frame text="Checking the clock *in bed?*" clock={{ minutes: SIX, lit: 1 }} glance={1} />,
  // A2. The clock grows out of the nightstand; the wedge from the hour hand to the alarm hand is the sleep that's left.
  () => <Frame text="Six hours left. *Five and a half.*" clock={{ minutes: FIVE_HALF, wedge: true, grow: 1, lit: 0.6 }} />,
  // A3. Clock turned to the wall (only its back shows), phone face down, room calm; the alarm rings off the back.
  () => <Frame text="Turn it *to face the wall.*" awake={0.35} clock={{ minutes: 0, back: true, ring: 1 }} phone="down" dark={0.3} />,
  // A4. A note on the back of the clock grows to fill the room.
  () => <Frame text="Are you *a Clock-Watcher?*" awake={0.35} clock={{ minutes: 0, back: true }} phone="down" quiz={1} />,

  // B1. Hook: the clock's light falls across the pillow onto you.
  () => <Frame text="Checking the clock *in bed?*" clock={{ minutes: SIX, lit: 1 }} beam={{ o: 1, onYou: 1 }} />,
  // B2. Each glance swings it back onto you, brighter; your glow stays big.
  () => <Frame text="It *keeps your brain on.*" awake={1.3} clock={{ minutes: FIVE_HALF, lit: 1 }} beam={{ o: 1, onYou: 1 }} />,
  // B3. Turned to the wall, the light pools on the wall instead; you go dark and calm.
  () => <Frame text="Turn it *to face the wall.*" awake={0.3} clock={{ minutes: 0, back: true }} beam={{ o: 1, onYou: 0 }} phone="down" dark={0.3} />,
  // B4. The pool of light on the wall becomes the quiz note.
  () => <Frame text="Are you *a Clock-Watcher?*" awake={0.3} clock={{ minutes: 0, back: true }} beam={{ o: 0.5, onYou: 0 }} phone="down" quiz={1} />,

  // C1. Hook: one glance, one note of sleep math lands over the bed.
  () => <Frame text="Checking the clock *in bed?*" clock={{ minutes: SIX, lit: 1 }} glance={1} notes={[{ text: "How long have I got?", x: NOTE_X, y: 250, rot: -3 }]} />,
  // C2. Each glance adds one: the notes pile up over you.
  () => (
    <Frame
      text="Each glance *starts a countdown.*"
      clock={{ minutes: FIVE_HALF, lit: 1 }}
      notes={[
        { text: "6 hours left", x: NOTE_X + 20, y: 210, rot: -4 },
        { text: "5½ hours left", x: NOTE_X - 30, y: 320, rot: 3 },
        { text: "If I fall asleep now…", x: NOTE_X - 50, y: 440, rot: -2 },
      ]}
    />
  ),
  // C3. Clock to the wall, phone face down: no new notes; the pile drifts off the bed.
  () => (
    <Frame
      text="Turn it *to face the wall.*"
      awake={0.35}
      clock={{ minutes: 0, back: true }}
      phone="down"
      dark={0.3}
      notes={[
        { text: "6 hours left", x: 400, y: 330, rot: 12, o: 0.35 },
        { text: "5½ hours left", x: 330, y: 470, rot: -10, o: 0.25 },
      ]}
    />
  ),
  // C4. The last note grows into the quiz.
  () => <Frame text="Are you *a Clock-Watcher?*" awake={0.35} clock={{ minutes: 0, back: true }} phone="down" quiz={1} />,
  // BC1. Hook: your glance lights the clock; its light swings across the pillow onto you.
  () => <Frame text="Checking the clock *in bed?*" clock={{ minutes: SIX, lit: 1 }} glance={1} beam={{ o: 1, onYou: 1 }} />,
  // BC2. Each glance drops a note of sleep math into the light, over you; the hands tick 1:00 → 1:30.
  () => (
    <Frame
      text="Each glance *starts a countdown.*"
      awake={1.2}
      clock={{ minutes: FIVE_HALF, lit: 1 }}
      beam={{ o: 1, onYou: 1 }}
      notes={[
        { text: "6 hours left", x: NOTE_X + 20, y: 210, rot: -4 },
        { text: "5½ hours left", x: NOTE_X - 30, y: 320, rot: 3 },
        { text: "If I fall asleep now…", x: NOTE_X - 50, y: 440, rot: -2 },
      ]}
    />
  ),
  // BC3. Clock to the wall, phone face down: the light leaves you for the wall; the notes drift out of it and fade.
  () => (
    <Frame
      text="Clock *to the wall.* Phone *face down.*"
      awake={0.3}
      clock={{ minutes: 0, back: true }}
      beam={{ o: 1, onYou: 0 }}
      phone="down"
      dark={0.3}
      notes={[
        { text: "6 hours left", x: 60, y: 560, rot: -12, o: 0.3 },
        { text: "5½ hours left", x: 200, y: 640, rot: 9, o: 0.2 },
      ]}
    />
  ),
  // BC4. The light on the wall grows into the quiz note.
  () => <Frame text="Are you *a Clock-Watcher?*" awake={0.3} clock={{ minutes: 0, back: true }} beam={{ o: 0.5, onYou: 0 }} phone="down" quiz={1} />,
];

export const ClockWatcherBoard: React.FC = () => {
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
