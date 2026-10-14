// Storyboard for RacingMind: one still per beat (frame i = panel i + 1), built from the illustrated objects.
// Rendered to a labelled sheet with scripts/storyboard.mjs and docs/racing-mind-board.json.
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { fonts, reel } from "../brand/theme";
import { Calendar, FoldingPage, Inbox, LINE, Page, Pill } from "../components/objects";
import type { Entry } from "../components/objects";
import { Backdrop, P } from "../components/premium";
import { HeadlineIn } from "../templates/motion";

export const BOARD_PANELS = 11;

const CX = 506;
const TOP = 360;
const BOTTOM = 1270;
const CAL = { x: 146, y: 720, w: 720, h: 760 };
const CAL_ROWS = { rows: 5, nightFrom: 3, labels: { 0: "Afternoon", 1: "Dinner", 2: "Evening", 3: "Lights out" } };
// The evening slot sits right before Lights out, so the worry list reads as an evening task.
const EVENING = 2;
const rowH = (CAL.h - 120) / 5;
const rowCenter = (r: number) => CAL.y + 120 + r * rowH + rowH / 2;
const MEETING = { title: "Everything, all at once", sub: "Organizer: your brain", attendees: true };

const ENTRIES: Entry[] = [
  { worry: "Rent", step: "Check balance Friday" },
  { worry: "Reply to Sam", step: "Two lines, tomorrow" },
  { worry: "Dentist?", step: "Book online at lunch" },
  { worry: "That thing I said", step: "Ask, if it still matters" },
];

const Super: React.FC<{ y: number; text: string; accent?: boolean }> = ({ y, text, accent }) => (
  <HeadlineIn y={y} size={100} text={text} at={-3} accent={accent} align="center" />
);

/** Dotted arc with an arrowhead, for drags and "this goes there". */
const Arrow: React.FC<{ d: string; head: [number, number, number] }> = ({ d, head: [hx, hy, angle] }) => (
  <svg width={reel.width} height={reel.height} style={{ position: "absolute" }}>
    <path d={d} fill="none" stroke={P.dim} strokeWidth={LINE} strokeLinecap="round" strokeDasharray="0.1 14" />
    <path d="M -14 -11 L 0 0 L -14 11" transform={`translate(${hx} ${hy}) rotate(${angle})`} fill="none" stroke={P.dim} strokeWidth={LINE} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const panels: Array<() => React.ReactNode> = [
  // 1. The brain books a meeting in the lights-out slot.
  () => (
    <>
      <Calendar {...CAL} {...CAL_ROWS} events={[{ row: 3, ...MEETING }]} />
      <Super y={TOP} text="Racing mind at bedtime? *Move the meeting.*" />
    </>
  ),
  // 2. Drag it up to the evening.
  () => (
    <>
      <Calendar
        {...CAL}
        {...CAL_ROWS}
        events={[
          { row: 3, ...MEETING, attendees: false, state: "ghost" },
          { row: EVENING, ...MEETING, state: "lifted", dy: -20 },
        ]}
      />
      <Arrow d={`M 895 ${rowCenter(3)} C 950 ${rowCenter(3) - 60}, 950 ${rowCenter(EVENING) + 40}, 900 ${rowCenter(EVENING) - 25}`} head={[900, rowCenter(EVENING) - 25, 220]} />
      <Super y={TOP} text="The fix happens *before bed.*" />
    </>
  ),
  // 3. Worries drifting with nowhere to land.
  () => (
    <>
      <svg width={reel.width} height={reel.height} style={{ position: "absolute" }}>
        {[
          "M 150 420 Q 220 340 300 380",
          "M 860 520 Q 820 430 740 450",
          "M 140 720 Q 170 640 250 640",
          "M 880 1010 Q 850 920 760 960",
        ].map((d) => (
          <path key={d} d={d} fill="none" stroke={P.faint} strokeWidth={LINE} strokeLinecap="round" strokeDasharray="0.1 12" />
        ))}
      </svg>
      <Pill x={350} y={380} text="Reply to Sam" rot={-6} />
      <Pill x={730} y={470} text="Rent" rot={8} />
      <Pill x={300} y={650} text="Dentist?" rot={5} />
      <Pill x={620} y={740} text="That thing I said" rot={-4} />
      <Pill x={360} y={930} text="Birthday gift" rot={6} opacity={0.75} scale={0.92} />
      <Pill x={740} y={980} text="Car noise?" rot={-7} />
      <Pill x={520} y={1120} text="Work deadline" rot={3} opacity={0.6} scale={0.88} />
      <Super y={BOTTOM} text="Worries have *nowhere to land.*" />
    </>
  ),
  // 4. Lights off; they all land in an inbox at once.
  () => (
    <>
      <AbsoluteFill style={{ background: "rgba(3,4,10,0.45)" }} />
      <Inbox x={CAL.x} y={290} w={CAL.w} count={7} items={["Reply to Sam", "Rent", "Dentist?", "That thing I said", "Birthday gift", "Car noise?", "Work deadline"]} />
      <Super y={BOTTOM} text="They all *ping at once.*" />
    </>
  ),
  // 5. Looping so nothing gets dropped.
  () => {
    const c = { x: CX, y: 1100 };
    const r = 290;
    const items = ["Reply to Sam", "Dentist?", "That thing I said", "Car noise?", "Work deadline", "Birthday gift"];
    return (
      <>
        <svg width={reel.width} height={reel.height} style={{ position: "absolute" }}>
          <circle cx={c.x} cy={c.y} r={r} fill="none" stroke={P.hair} strokeWidth={LINE} />
          {items.map((_, i) => {
            const a = (i / items.length) * Math.PI * 2 - Math.PI / 2;
            const tail = a - 0.55;
            return (
              <path
                key={i}
                d={`M ${c.x + Math.cos(tail) * r} ${c.y + Math.sin(tail) * r} A ${r} ${r} 0 0 1 ${c.x + Math.cos(a - 0.12) * r} ${c.y + Math.sin(a - 0.12) * r}`}
                fill="none"
                stroke="rgba(243,238,230,0.35)"
                strokeWidth={LINE + 1}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        {items.map((t, i) => {
          const a = (i / items.length) * Math.PI * 2 - Math.PI / 2;
          return <Pill key={t} x={c.x + Math.cos(a) * r} y={c.y + Math.sin(a) * r} text={t} scale={0.82} />;
        })}
        <Pill x={860} y={c.y + 10} text="Rent" rot={16} scale={0.82} />
        <Arrow d={`M 880 ${c.y + 60} C 880 ${c.y + 120}, 840 ${c.y + 120}, 805 ${c.y + 95}`} head={[805, c.y + 95, 200]} />
        <Super y={TOP} text="Your mind keeps them *looping.*" />
      </>
    );
  },
  // 6. The meeting now sits in the evening: fifteen minutes.
  () => (
    <>
      <Calendar {...CAL} {...CAL_ROWS} free={3} events={[{ row: EVENING, title: "Worry list · 15 min", sub: "Moved from lights out" }]} />
      <Super y={TOP} text="*Fifteen minutes,* before bed." />
    </>
  ),
  // 7. Two columns.
  () => (
    <>
      <Page x={CAL.x} y={290} w={CAL.w} h={880} entries={ENTRIES} steps={3} />
      <Super y={BOTTOM} text="Two columns: *worry, next step.*" />
    </>
  ),
  // 8. Fold the page (mid-fold, amber back).
  () => (
    <>
      <FoldingPage x={CAL.x} y={290} w={CAL.w} h={880} entries={ENTRIES} fold={0.84} />
      <Super y={BOTTOM} text="Then *fold the page.*" accent />
    </>
  ),
  // 9. Racing signal settles into a calm wave; source under the claim.
  () => {
    const x0 = 130;
    const x1 = 880;
    const pts: string[] = [];
    for (let k = 0; k <= 300; k++) {
      const u = k / 300;
      const calm = 1 / (1 + Math.exp(-(u - 0.5) * 14));
      const busy = (Math.sin(u * 97) * 0.6 + Math.sin(u * 151 + 1) * 0.4 + Math.sin(u * 59 + 2) * 0.5) * 120 * (1 - calm);
      const soft = Math.sin(u * Math.PI * 4) * 22 * calm;
      pts.push(`${k ? "L" : "M"} ${(x0 + (x1 - x0) * u).toFixed(1)} ${(1110 + busy + soft).toFixed(1)}`);
    }
    return (
      <>
        <svg width={reel.width} height={reel.height} style={{ position: "absolute" }}>
          <defs>
            <linearGradient id="fadeEnds" x1="0" x2="1">
              <stop offset="0" stopColor={P.ink} stopOpacity={0} />
              <stop offset="0.08" stopColor={P.ink} stopOpacity={0.9} />
              <stop offset="0.92" stopColor={P.ink} stopOpacity={0.9} />
              <stop offset="1" stopColor={P.ink} stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d={pts.join(" ")} fill="none" stroke="url(#fadeEnds)" strokeWidth={LINE + 1} strokeLinejoin="round" strokeLinecap="round" />
        </svg>
        <div style={{ position: "absolute", top: 1300, left: x0, fontFamily: fonts.sans, fontSize: 22, letterSpacing: "0.12em", color: P.dim }}>RACING</div>
        <div style={{ position: "absolute", top: 1300, right: reel.width - x1, fontFamily: fonts.sans, fontSize: 22, letterSpacing: "0.12em", color: P.dim }}>QUIET</div>
        <Super y={TOP} text="It *quieted racing thoughts.*" />
        <div style={{ position: "absolute", top: TOP + 240, left: P.margin, width: P.right - P.margin, textAlign: "center", fontFamily: fonts.sans, fontSize: 30, fontWeight: 500, color: P.dim }}>
          Carney &amp; Waters, 2006
        </div>
      </>
    );
  },
  // 10. A late worry gets a tick and tucks into the note.
  () => (
    <>
      <FoldingPage x={CX - 230} y={780} w={460} h={560} entries={ENTRIES.slice(0, 3)} fold={0.8} amber={0} />
      <Pill x={CX} y={840} text="Car noise?" tick rot={-3} />
      <Arrow d={`M ${CX + 175} 870 C ${CX + 270} 920, ${CX + 280} 1060, ${CX + 190} 1110`} head={[CX + 190, 1110, 155]} />
      <Super y={TOP} text="A worry shows up? *It's on the list.*" />
    </>
  ),
  // 11. Lights out is free; back to the opening calendar.
  () => (
    <>
      <Calendar {...CAL} {...CAL_ROWS} free={3} />
      <Super y={TOP} text="Nothing's *waiting for you…*" />
    </>
  ),
];

export const RacingMindBoard: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Backdrop glowY={50} />
      {panels[Math.min(frame, panels.length - 1)]()}
    </AbsoluteFill>
  );
};
