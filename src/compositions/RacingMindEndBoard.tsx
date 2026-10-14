// Storyboard for RacingMind's closing (VO v2): the quiz invite, accepted and booked into the evening, then the loop line.
// Frame i = panel i + 1. Rendered with scripts/storyboard.mjs and docs/racing-mind-end-board.json.
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { reel } from "../brand/theme";
import { Calendar, Invite, inviteAccept, LINE, QuizBlock, TapRing } from "../components/objects";
import { Backdrop, P } from "../components/premium";
import { HeadlineIn } from "../templates/motion";

export const END_BOARD_PANELS = 5;

const TOP = 360;
const CAL = { x: 146, y: 720, w: 720, h: 760 };
const CAL_ROWS = { rows: 5, nightFrom: 3, labels: { 0: "Afternoon", 1: "Dinner", 2: "Evening", 3: "Lights out" } };
const ROW_H = (CAL.h - 120) / 5;
const EVENING = 2;
const BLOCK = { left: CAL.x + 150, top: CAL.y + 120 + EVENING * ROW_H + 8, w: CAL.w - 174, h: ROW_H - 16 };

const Super: React.FC<{ text: string }> = ({ text }) => <HeadlineIn y={TOP} size={100} text={text} at={-3} align="center" />;

/** Dotted arc with an arrowhead. */
const Arrow: React.FC<{ d: string; head: [number, number, number] }> = ({ d, head: [hx, hy, angle] }) => (
  <svg width={reel.width} height={reel.height} style={{ position: "absolute" }}>
    <path d={d} fill="none" stroke={P.dim} strokeWidth={LINE} strokeLinecap="round" strokeDasharray="0.1 14" />
    <path d="M -14 -11 L 0 0 L -14 11" transform={`translate(${hx} ${hy}) rotate(${angle})`} fill="none" stroke={P.dim} strokeWidth={LINE} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const INVITE = { x: CAL.x, y: 270, w: CAL.w, h: 420 };
const ACCEPT = { x: INVITE.x + inviteAccept(INVITE.h).x, y: INVITE.y + inviteAccept(INVITE.h).y };
const QUIZ = { x: BLOCK.left, y: BLOCK.top, w: BLOCK.w, h: BLOCK.h };

const panels: Array<() => React.ReactNode> = [
  // 1. The note slips away, the calendar returns, and the quiz invite drops in above it.
  () => (
    <>
      <Calendar {...CAL} {...CAL_ROWS} free={3} />
      <Invite {...INVITE} />
    </>
  ),
  // 2. Accept gets tapped and ticks.
  () => (
    <>
      <Calendar {...CAL} {...CAL_ROWS} free={3} />
      <Invite {...INVITE} accepted press={1} />
      <TapRing {...ACCEPT} r={60} />
    </>
  ),
  // 3. The accepted invite shrinks and drops into the evening slot.
  () => (
    <>
      <Calendar {...CAL} {...CAL_ROWS} free={3} />
      <Invite {...INVITE} accepted style={{ transformOrigin: "50% 0", transform: "translate(70px, 330px) scale(0.62)", opacity: 0.9, boxShadow: "0 40px 70px rgba(0,0,0,0.55)" }} />
      <Arrow d={`M 905 640 C 960 800, 950 1000, 880 ${BLOCK.top + 40}`} head={[880, BLOCK.top + 40, 150]} />
    </>
  ),
  // 4. Booked: the quiz sits in the evening, Lights out stays free. The loop line.
  () => (
    <>
      <Calendar {...CAL} {...CAL_ROWS} free={3} />
      <QuizBlock {...QUIZ} />
      <Super text="So you'll have a *plan for when…*" />
    </>
  ),
  // 5. Loop point: the block fades as the video restarts on the same calendar.
  () => (
    <>
      <Calendar {...CAL} {...CAL_ROWS} free={3} />
      <Super text="Racing mind at bedtime? *Move the meeting.*" />
    </>
  ),
];

export const RacingMindEndBoard: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Backdrop glowY={50} />
      {panels[Math.min(frame, panels.length - 1)]()}
    </AbsoluteFill>
  );
};
