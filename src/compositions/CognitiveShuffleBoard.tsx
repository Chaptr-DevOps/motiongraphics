// Gate 0 sketches for CognitiveShuffle (Oct 30): four directions, four frames each (frame i = panel i + 1).
// A: pictures over your head. Worry notes, an empty gap they slide into, then quick unrelated pictures.
// B: letter tiles on the duvet spell BREAD; the B tile lifts and the pictures flick up out of it.
// C: a deck of picture cards on the nightstand; worries deal into a neat strip (a story), shuffled cards land crooked.
// D: an open jar from above; emptied, worries pour back in; filled with banana, bike, bear instead.
// One still top-down bedroom on a fixed stage, supers above it, you as the dot. Sheet: scripts/storyboard.mjs.
import { useId } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { photos } from "../brand/photos";
import { fonts } from "../brand/theme";
import { PhotoBackground } from "../components/PhotoBackground";
import { LINE, SurfaceTint, useSurface } from "../components/objects";
import { QuizNote } from "../components/rooms";
import { P } from "../components/premium";
import { HeadlineIn } from "../templates/motion";

export const BOARD_PANELS = 16;

// The seeded pick (car horizon) came out flat grey with a black floor; deep blue sky over trees instead.
export const PHOTO = photos.starsTreeline;
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
  chair: { x: 430, y: 540, w: 160, h: 160, r: 54 },
  rug: { x: 90, y: 600, w: 260, h: 120, r: 60 },
};

const INK = (o: number) => `rgba(243,238,230,${o})`;

/** Line drawings of the things you picture, centred on 0,0, about 110 units across. */
type Thing = "banana" | "bike" | "bear" | "rabbit";
const Doodle: React.FC<{ thing: Thing; o?: number }> = ({ thing, o = 0.9 }) => {
  const st = { fill: "none", stroke: INK(o), strokeWidth: LINE + 1, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (thing === "banana")
    return (
      <g>
        <path d="M -46 -22 Q -30 40 44 26 Q 8 24 -30 -30 Z" {...st} />
        <path d="M -30 -30 L -38 -42" {...st} />
        <path d="M 44 26 L 50 28" {...st} />
      </g>
    );
  if (thing === "bike")
    return (
      <g>
        <circle cx={-32} cy={18} r={24} {...st} />
        <circle cx={34} cy={18} r={24} {...st} />
        <path d="M -32 18 L -8 -16 L 22 -16 L 34 18 M -8 -16 L 2 18 L -32 18 M 2 18 L 22 -16 M -14 -26 L -2 -26 M 22 -16 L 18 -30 L 30 -32" {...st} />
      </g>
    );
  if (thing === "bear")
    return (
      <g>
        <circle cx={-27} cy={-28} r={13} {...st} />
        <circle cx={27} cy={-28} r={13} {...st} />
        <circle cx={0} cy={0} r={38} {...st} />
        <path d="M -7 8 Q 0 4 7 8 Q 0 16 -7 8 Z" fill={INK(o)} />
        <path d="M 0 14 L 0 20 M -9 22 Q 0 28 9 22" {...st} />
        <circle cx={-14} cy={-8} r={3.5} fill={INK(o)} />
        <circle cx={14} cy={-8} r={3.5} fill={INK(o)} />
      </g>
    );
  return (
    <g>
      <ellipse cx={-12} cy={-30} rx={9} ry={26} {...st} />
      <ellipse cx={12} cy={-30} rx={9} ry={26} {...st} />
      <circle cx={0} cy={16} r={28} {...st} />
      <circle cx={-9} cy={12} r={3.5} fill={INK(o)} />
      <circle cx={9} cy={12} r={3.5} fill={INK(o)} />
    </g>
  );
};

/** A thought: a soft round card with a picture in it. Thoughts sit on top of everything. */
const Thought: React.FC<{ thing: Thing; x: number; y: number; rot?: number; o?: number; size?: number }> = ({ thing, x, y, rot = 0, o = 1, size = 170 }) => {
  const s = useSurface();
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={o}>
      <rect x={-size / 2 + 6} y={-size / 2 + 12} width={size} height={size} rx={size * 0.3} fill="rgba(0,0,0,0.35)" />
      <rect x={-size / 2} y={-size / 2} width={size} height={size} rx={size * 0.3} fill={s(0.24, 0.06)} stroke={INK(0.75)} strokeWidth={LINE} />
      <g transform={`scale(${size / 170})`}>
        <Doodle thing={thing} />
      </g>
    </g>
  );
};

type Note = { text: string; x: number; y: number; rot?: number; o?: number; dash?: boolean };
const Worry: React.FC<Note> = ({ text, x, y, rot = 0, o = 1, dash }) => {
  const s = useSurface();
  const w = text.length * 19 + 64;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={o}>
      {dash ? null : <rect x={6} y={12} width={w} height={92} rx={22} fill="rgba(0,0,0,0.35)" />}
      <rect width={w} height={92} rx={22} fill={dash ? "none" : s(0.24, 0.06)} stroke={INK(0.75)} strokeWidth={LINE} strokeDasharray={dash ? "2 12" : undefined} strokeLinecap="round" />
      <text x={32} y={58} fontFamily={fonts.sans} fontWeight={600} fontSize={36} fill={P.ink} letterSpacing="-0.01em">
        {text}
      </text>
    </g>
  );
};

/** A wooden letter tile. `lift` tilts it and drops a shadow; `ghost` is the dashed empty slot. */
const Tile: React.FC<{ ch?: string; x: number; y: number; lift?: number; rot?: number; ghost?: boolean; back?: boolean }> = ({ ch, x, y, lift = 0, rot = 0, ghost, back }) => {
  const s = useSurface();
  const z = 58;
  if (ghost) return <rect x={x} y={y} width={z} height={z} rx={14} fill="none" stroke={INK(0.45)} strokeWidth={LINE} strokeDasharray="2 10" strokeLinecap="round" />;
  return (
    <g transform={`translate(${x + z / 2} ${y + z / 2 - lift * 30}) rotate(${rot}) scale(${1 + lift * 0.25})`}>
      <rect x={-z / 2 + 3 + lift * 8} y={-z / 2 + 6 + lift * 22} width={z} height={z} rx={14} fill="rgba(0,0,0,0.4)" />
      <rect x={-z / 2} y={-z / 2} width={z} height={z} rx={14} fill={back ? s(0.1, 0.2) : "rgba(236,226,208,0.92)"} stroke={INK(0.8)} strokeWidth={LINE} />
      {ch ? (
        <text y={15} textAnchor="middle" fontFamily={fonts.sans} fontWeight={600} fontSize={40} fill="#1B1E2E">
          {ch}
        </text>
      ) : null}
    </g>
  );
};

/** A picture card (playing-card shape) with a drawing, or face down. */
const Card: React.FC<{ x: number; y: number; rot?: number; thing?: Thing; text?: string; down?: boolean; o?: number }> = ({ x, y, rot = 0, thing, text, down, o = 1 }) => {
  const s = useSurface();
  const cw = 130;
  const ch = 180;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={o}>
      <rect x={-cw / 2 + 5} y={-ch / 2 + 10} width={cw} height={ch} rx={18} fill="rgba(0,0,0,0.38)" />
      <rect x={-cw / 2} y={-ch / 2} width={cw} height={ch} rx={18} fill={down ? s(0.12, 0.2) : s(0.26, 0.05)} stroke={INK(0.75)} strokeWidth={LINE} />
      {down ? <rect x={-cw / 2 + 14} y={-ch / 2 + 14} width={cw - 28} height={ch - 28} rx={10} fill="none" stroke={INK(0.3)} strokeWidth={2} /> : null}
      {thing ? (
        <g transform="scale(0.85)">
          <Doodle thing={thing} />
        </g>
      ) : null}
      {text
        ? text.split("|").map((t, i, a) => (
            <text key={i} y={(i - (a.length - 1) / 2) * 34 + 10} textAnchor="middle" fontFamily={fonts.sans} fontWeight={600} fontSize={26} fill={P.ink}>
              {t}
            </text>
          ))
        : null}
    </g>
  );
};

type RoomProps = {
  awake?: number;
  notes?: Note[];
  thoughts?: Array<{ thing: Thing; x: number; y: number; rot?: number; o?: number; size?: number }>;
  /** A: the empty gap over your head (dashed ring). */
  gap?: boolean;
  /** Dotted arrows: [x1, y1, x2, y2]. */
  arrows?: Array<[number, number, number, number]>;
  tiles?: React.ReactNode;
  cards?: React.ReactNode;
  jar?: { things?: Thing[]; worries?: number; label?: string; rattle?: boolean };
  quiz?: number;
  dark?: number;
};

const Room: React.FC<RoomProps> = ({ awake = 1, notes = [], thoughts = [], gap, arrows = [], tiles, cards, jar, quiz = 0, dark = 0 }) => {
  const s = useSurface();
  const id = `cs${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const piece = (q: { x: number; y: number; w: number; h: number; r: number }, fill: number, line: number) => (
    <rect x={q.x} y={q.y} width={q.w} height={q.h} rx={q.r} fill={s(fill, 0.28)} stroke={INK(line)} strokeWidth={LINE} />
  );
  const [hx, hy] = R.head;
  const JX = 430;
  const JY = 380;
  return (
    <div style={{ position: "relative", width: STAGE.w, height: STAGE.h }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 45,
          border: `${LINE}px solid ${INK(0.22)}`,
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
          <marker id={`${id}head`} viewBox="0 0 10 10" refX={5} refY={5} markerWidth={5} markerHeight={5} orient="auto">
            <path d="M 1 1 L 8 5 L 1 9" fill="none" stroke={INK(0.7)} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          </marker>
        </defs>
        <g opacity={1 - 0.4 * dark}>
          {piece(R.rug, 0.02, 0.18)}
          {piece(R.chair, 0.07, 0.28)}
          <rect x={R.chair.x + 30} y={R.chair.y + 30} width={100} height={100} rx={34} fill={s(0.12, 0.2)} stroke={INK(0.28)} strokeWidth={LINE} />
          {piece(R.nightstand, 0.05, 0.3)}
          {piece(R.bed, 0.06, 0.5)}
          {piece(R.duvet, 0.14, 0.5)}
          <rect x={R.pillow.x} y={R.pillow.y} width={R.pillow.w} height={R.pillow.h} rx={R.pillow.r} fill={s(0.3, 0.12)} stroke={INK(0.7)} strokeWidth={LINE} />
        </g>
        <circle cx={hx} cy={hy} r={90 + 120 * awake} fill={`url(#${id}glow)`} opacity={Math.min(1, 0.35 + 0.65 * awake)} />
        <circle cx={hx} cy={hy} r={27} fill={P.ink} />
        {tiles}
        {cards}
        {/* D: an open glass jar seen from above: thick rim, contents visible through the mouth. */}
        {jar ? (
          <g transform={`translate(${JX} ${JY})`}>
            {jar.rattle
              ? [176, 198].map((r, i) => (
                  <path key={r} d={`M ${r * 0.8} ${-r * 0.6} A ${r} ${r} 0 0 1 ${r * 0.8} ${r * 0.6}`} fill="none" stroke={INK(0.55 - i * 0.2)} strokeWidth={LINE} strokeLinecap="round" />
                ))
              : null}
            <circle r={160} fill="rgba(0,0,0,0.35)" transform="translate(8 16)" />
            <circle r={160} fill={s(0.1, 0.25)} stroke={INK(0.75)} strokeWidth={LINE} />
            <circle r={138} fill={s(0.02, 0.4)} stroke={INK(0.4)} strokeWidth={2} />
            {Array.from({ length: jar.worries ?? 0 }, (_, i) => {
              const a = i * 2.4;
              const d = 30 + (i % 3) * 32;
              return (
                <rect key={i} x={Math.cos(a) * d - 38} y={Math.sin(a) * d - 18} width={76} height={36} rx={10} fill={s(0.24, 0.06)} stroke={INK(0.65)} strokeWidth={2.5} transform={`rotate(${(i * 37) % 60 - 30} ${Math.cos(a) * d} ${Math.sin(a) * d})`} />
              );
            })}
            {(jar.things ?? []).map((t, i) => {
              const pos = [
                [-50, -48, -14],
                [52, -10, 18],
                [-30, 62, 6],
              ][i];
              return (
                <g key={t} transform={`translate(${pos[0]} ${pos[1]}) rotate(${pos[2]}) scale(0.78)`}>
                  <Doodle thing={t} />
                </g>
              );
            })}
            {jar.label ? (
              <g transform="translate(-150 -150) rotate(-10)">
                <rect x={-36} y={-36} width={72} height={72} rx={18} fill="rgba(236,226,208,0.92)" stroke={INK(0.8)} strokeWidth={LINE} />
                <text y={15} textAnchor="middle" fontFamily={fonts.sans} fontWeight={600} fontSize={44} fill="#1B1E2E">
                  {jar.label}
                </text>
              </g>
            ) : null}
          </g>
        ) : null}
        {gap ? <circle cx={hx + 60} cy={hy + 220} r={130} fill="none" stroke={INK(0.5)} strokeWidth={LINE} strokeDasharray="2 12" strokeLinecap="round" /> : null}
        {arrows.map(([x1, y1, x2, y2], i) => (
          <path
            key={i}
            d={`M ${x1} ${y1} Q ${(x1 + x2) / 2 + (y2 - y1) * 0.2} ${(y1 + y2) / 2 - (x2 - x1) * 0.2} ${x2} ${y2}`}
            fill="none"
            stroke={INK(0.6)}
            strokeWidth={3}
            strokeDasharray="2 12"
            strokeLinecap="round"
            markerEnd={`url(#${id}head)`}
          />
        ))}
        {notes.map((n, i) => (
          <Worry key={i} {...n} />
        ))}
        {thoughts.map((t, i) => (
          <Thought key={i} {...t} />
        ))}
        {quiz > 0.01 ? (
          <g transform="translate(40 80) rotate(-2 280 300)" opacity={quiz}>
            <QuizNote tick={1} />
          </g>
        ) : null}
      </svg>
    </div>
  );
};

const Frame: React.FC<{ text: string } & RoomProps> = ({ text, ...room }) => (
  <>
    <div style={{ position: "absolute", left: STAGE.x, top: STAGE.y }}>
      <Room {...room} />
    </div>
    <HeadlineIn y={TOP} size={100} text={text} at={-3} align="center" />
  </>
);

const WORRIES: Note[] = [
  { text: "Reply to Sam", x: 120, y: 220, rot: -4 },
  { text: "Are they mad at me?", x: 40, y: 340, rot: 3 },
  { text: "Rent's due", x: 230, y: 470, rot: -2 },
];
const HOOK = "Your mind *won't switch off?*";
const GAP = "Nothing leaves a gap. *Worries fill it.*";
const B = "For B: *banana, bike, bear.*";
const QUIZ = "The *sleep quiz,* in our bio";

// BREAD on the duvet, below the pillow.
const TX = 80;
const TY = 250;
const STEP = 62;
const WORD = ["B", "R", "E", "A", "D"];

const panels: Array<() => React.ReactNode> = [
  // A1. Hook: worry notes pile up over your head; your glow is big.
  () => <Frame text={HOOK} awake={1.2} notes={WORRIES} />,
  // A2. The notes are swept off; a dashed empty gap is left over the bed, and they slide back into it.
  () => (
    <Frame
      text={GAP}
      notes={[
        { text: "Reply to Sam", x: 360, y: 610, rot: 8, o: 0.85 },
        { text: "Are they mad at me?", x: 10, y: 660, rot: -5, o: 0.85 },
      ]}
      gap
      arrows={[
        [470, 600, 340, 450],
        [180, 650, 260, 490],
      ]}
    />
  ),
  // A3. Quick pictures pop over your head one after another; each fades as the next arrives.
  () => (
    <Frame
      text={B}
      awake={0.7}
      thoughts={[
        { thing: "banana", x: 140, y: 330, rot: -6, o: 0.35 },
        { thing: "bike", x: 330, y: 300, rot: 4, o: 0.65 },
        { thing: "bear", x: 240, y: 480, rot: -2, o: 1 },
      ]}
    />
  ),
  // A4. The last picture turns over into the quiz note.
  () => <Frame text={QUIZ} awake={0.35} dark={0.3} quiz={1} />,

  // B1. Hook: worry notes over your head; five letter tiles lie face down on the duvet.
  () => (
    <Frame
      text={HOOK}
      awake={1.2}
      tiles={WORD.map((_, i) => (
        <Tile key={i} x={TX + i * STEP} y={460} rot={(i * 23) % 14 - 7} back />
      ))}
      notes={WORRIES.map((n) => ({ ...n, y: n.y - 60 }))}
    />
  ),
  // B2. The tiles are gone: five empty dashed slots, and the worry notes slide into the gap.
  () => (
    <Frame
      text={GAP}
      tiles={WORD.map((_, i) => (
        <Tile key={i} x={TX + i * STEP} y={TY} ghost />
      ))}
      notes={[
        { text: "Reply to Sam", x: 150, y: 400, rot: -6 },
        { text: "Are they mad at me?", x: 30, y: 510, rot: 4 },
      ]}
      arrows={[[300, 400, 200, 330]]}
    />
  ),
  // B3. BREAD is spelled; B lifts with a tilt (dashed ghost in its slot) and the pictures flick up out of it.
  () => (
    <Frame
      text={B}
      awake={0.7}
      tiles={
        <>
          <Tile x={TX} y={TY} ghost />
          {WORD.slice(1).map((c, i) => (
            <Tile key={c} ch={c} x={TX + (i + 1) * STEP} y={TY} />
          ))}
          <Tile ch="B" x={TX - 6} y={TY + 110} lift={1} rot={-10} />
        </>
      }
      thoughts={[
        { thing: "banana", x: 170, y: 520, rot: -6, o: 0.5, size: 160 },
        { thing: "bike", x: 340, y: 440, rot: 5, o: 0.75, size: 160 },
        { thing: "bear", x: 420, y: 630, rot: -3, size: 160 },
      ]}
      arrows={[[TX + 70, TY + 110, 250, 390]]}
    />
  ),
  // B4. The tiles flip; their backs grow into the quiz note.
  () => (
    <Frame
      text={QUIZ}
      awake={0.35}
      dark={0.3}
      tiles={WORD.map((c, i) => (
        <Tile key={c} ch={c} x={TX + i * STEP} y={TY} />
      ))}
      quiz={1}
    />
  ),

  // C1. Hook: a deck on the nightstand deals worry cards face up over the bed.
  () => (
    <Frame
      text={HOOK}
      awake={1.2}
      cards={
        <>
          <Card x={498} y={160} down rot={4} />
          <Card x={150} y={330} text="Reply|to Sam" rot={-8} />
          <Card x={300} y={380} text="Are they|mad at me?" rot={6} />
        </>
      }
    />
  ),
  // C2. The worry cards line up into a neat strip, one leading to the next: a story.
  () => (
    <Frame
      text={GAP}
      cards={
        <>
          <Card x={498} y={160} down rot={4} />
          <Card x={110} y={400} text="Reply|to Sam" />
          <Card x={260} y={400} text="Are they|mad at me?" />
          <Card x={410} y={400} text="What if|I'm fired?" />
        </>
      }
      arrows={[
        [150, 510, 230, 510],
        [300, 510, 380, 510],
      ]}
    />
  ),
  // C3. The deck is shuffled (two half-stacks riffling); picture cards land crooked on top of each other, never in a row.
  () => (
    <Frame
      text={B}
      awake={0.7}
      cards={
        <>
          <Card x={470} y={150} down rot={-14} />
          <Card x={530} y={170} down rot={16} />
          <Card x={170} y={420} thing="banana" rot={-18} />
          <Card x={250} y={380} thing="bike" rot={14} />
          <Card x={330} y={450} thing="bear" rot={-6} />
        </>
      }
    />
  ),
  // C4. The last card dealt is the quiz.
  () => <Frame text={QUIZ} awake={0.35} dark={0.3} cards={<Card x={498} y={160} down rot={4} />} quiz={1} />,

  // D1. Hook: an open jar beside the bed, rattling, full of worry scraps.
  () => <Frame text={HOOK} awake={1.2} jar={{ worries: 11, rattle: true }} />,
  // D2. Emptied: the jar is bare and worry notes pour straight back in.
  () => (
    <Frame
      text={GAP}
      jar={{ worries: 2 }}
      notes={[
        { text: "Reply to Sam", x: 40, y: 600, rot: -6 },
        { text: "Rent's due", x: 330, y: 650, rot: 5 },
      ]}
      arrows={[
        [190, 600, 330, 470],
        [450, 640, 450, 530],
      ]}
    />
  ),
  // D3. A "B" label on the jar; a banana, a bike and a bear tumble in instead.
  () => <Frame text={B} awake={0.7} jar={{ things: ["banana", "bike", "bear"], label: "B" }} />,
  // D4. The label lifts off and grows into the quiz note.
  () => <Frame text={QUIZ} awake={0.35} dark={0.3} jar={{ things: ["banana", "bike", "bear"] }} quiz={1} />,
];

export const CognitiveShuffleBoard: React.FC = () => {
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
