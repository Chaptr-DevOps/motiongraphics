// "Racing mind at bedtime? Move the meeting." Script: docs/racing-mind-move-the-meeting.md. VO: public/audio/racing-mind-vo.mp3.
// Approved board: RacingMindBoard. Running metaphor: worries are a meeting your brain books at bedtime; the fix is to move it.
// Continuity: the meeting block bursts into worry pills, the pills land in an inbox, peel off into a loop, pour back into
// the calendar as an evening block, which opens into the page, which folds into the note; the note gives way to the calendar,
// where the quiz invite gets accepted and books itself into the evening. The last frames fade back to frame 0 so it loops.
import {
  AbsoluteFill,
  Audio,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";
import type { EasingFunction, SpringConfig } from "remotion";
import { ease, fonts, reel, sec } from "../brand/theme";
import {
  Calendar,
  FoldingPage,
  Inbox,
  Invite,
  inviteAccept,
  Pill,
  QuizBlock,
  SurfaceTint,
  TapRing,
} from "../components/objects";
import type { CalEvent, Entry } from "../components/objects";
import { P } from "../components/premium";
import { PhotoBackground } from "../components/PhotoBackground";
import { pickPhoto } from "../brand/photos";
import { progress } from "../lib/animation";
import { HeadlineIn } from "../templates/motion";

export const RACING_MIND_SECONDS = 46.6;

const PHOTO = pickPhoto("racing-mind");
// Object surfaces take the photo's tint, desaturated like the photo itself (saturation 0.7 below).
const grey = (PHOTO.tint[0] + PHOTO.tint[1] + PHOTO.tint[2]) / 3;
const TINT = PHOTO.tint.map((c) => c * 0.7 + grey * 0.3) as [
  number,
  number,
  number,
];
const CX = 506;
const TOP = 360;
const BOTTOM = 1270;

// VO cues (seconds), from the pauses in the voiceover.
const T = {
  meeting: 1.53,
  move: 3.44,
  fix: 4.88,
  day: 7.31,
  quiet: 10.43,
  ping: 12.33,
  bed: 16.61,
  loop: 19.27,
  dropped: 20.88,
  tonight: 22.76,
  fifteen: 25.14,
  columns: 26.85,
  mind: 28.37,
  step: 29.48,
  fold: 31.89,
  study: 33.73,
  worry: 37.44,
  list: 39.74,
  // "Want to know what's keeping you up?" The note gives way to the calendar and the quiz invite.
  back: 41.01,
  quiz: 42.63,
  plan: 44.86,
};

const CAL = { x: 146, y: 720, w: 720, h: 760 };
const CAL_ROWS = {
  rows: 5,
  nightFrom: 3,
  labels: { 0: "Afternoon", 1: "Dinner", 2: "Evening", 3: "Lights out" },
};
// The evening slot sits right before Lights out, so the worry list reads as an evening task.
const EVENING = 2;
const ROW_H = (CAL.h - 120) / 5;
const rowTop = (r: number) => CAL.y + 120 + r * ROW_H;
const BLOCK = { x: CAL.x + 150, w: CAL.w - 174, h: ROW_H - 16 };
const MEETING = {
  title: "Everything, all at once",
  sub: "Organizer: your brain",
  attendees: true,
};

const PAGE = { x: 146, y: 290, w: 720, h: 880 };
const NOTE = { x: CX - 230, y: 780, w: 460, h: 560 };
const ENTRIES: Entry[] = [
  { worry: "Rent", step: "Check balance Friday" },
  { worry: "Reply to Sam", step: "Two lines, tomorrow" },
  { worry: "Dentist?", step: "Book online at lunch" },
  { worry: "That thing I said", step: "Ask, if it still matters" },
];

// Worries: where each one drifts, and the inbox row it lands in (same order).
const WORRIES = [
  { t: "Reply to Sam", x: 350, y: 380, r: -6, s: 1 },
  { t: "Rent", x: 730, y: 470, r: 8, s: 1 },
  { t: "Dentist?", x: 300, y: 650, r: 5, s: 1 },
  { t: "That thing I said", x: 620, y: 740, r: -4, s: 1 },
  { t: "Birthday gift", x: 360, y: 930, r: 6, s: 0.92 },
  { t: "Car noise?", x: 740, y: 980, r: -7, s: 1 },
  { t: "Work deadline", x: 520, y: 1120, r: 3, s: 0.88 },
];
const INBOX = { x: CAL.x, y: 290, w: CAL.w };
const ORBIT = { x: CX, y: 1100, r: 290 };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const sp = (
  f: number,
  s: number,
  config: Partial<SpringConfig> = { damping: 14, stiffness: 120 },
) => spring({ frame: f - sec(s), fps: reel.fps, config });
const prog = (
  f: number,
  s: number,
  frames: number,
  e: EasingFunction = ease.inOutCubic,
) => progress(f, sec(s), frames, e);

// Loop angle: drifts slowly as the worries line up, speeds up on "looping", and coasts to a stop on "tonight".
const angle = (t: number) => {
  if (t < T.loop) return (t - T.bed) * 0.35;
  const run = Math.min(t, T.tonight) - T.loop;
  const spun = (T.loop - T.bed) * 0.35 + 0.35 * run + 0.45 * run * run;
  if (t < T.tonight) return spun;
  const v = 0.35 + 0.9 * (T.tonight - T.loop);
  return spun + v * 0.5 * (1 - Math.exp(-(t - T.tonight) / 0.5));
};
const speed = (t: number) => (angle(t + 0.05) - angle(t)) / 0.05;

const rowLand = (i: number) => sec(T.ping + i * 0.1) + 9;
const inboxRowY = (i: number) => INBOX.y + 120 + i * 96 + 48;

type PillState = {
  x: number;
  y: number;
  rot: number;
  scale: number;
  opacity: number;
};

const pillAt = (i: number, f: number): PillState | null => {
  const t = f / reel.fps;
  const w = WORRIES[i];
  const origin = { x: BLOCK.x + BLOCK.w / 2, y: rowTop(EVENING) + ROW_H / 2 };
  // Drifting: they burst out of the meeting block and wander, calming down once the house goes quiet.
  const calm = 1 - 0.75 * prog(f, T.quiet, 40);
  const drift = {
    x: w.x + Math.sin(f / 38 + i * 1.7) * 22 * calm,
    y: w.y + Math.cos(f / 47 + i) * 16 * calm,
    rot: w.r + Math.sin(f / 55 + i) * 4 * calm,
  };
  if (t < T.day) return null;
  if (t < T.ping) {
    const b = sp(f, T.day + i * 0.07, { damping: 12, stiffness: 80 });
    return {
      x: lerp(origin.x, drift.x, b),
      y: lerp(origin.y, drift.y, b),
      rot: drift.rot * b,
      scale: lerp(0.4, w.s, Math.min(1, b)),
      opacity: clamp01(b * 4),
    };
  }
  const row = { x: INBOX.x + 200, y: inboxRowY(i) };
  if (t < T.bed) {
    // "They all ping at once": every pill flies to its inbox row and becomes it.
    const g = sp(f, T.ping + i * 0.1, { damping: 16, stiffness: 170 });
    const landed = clamp01((f - rowLand(i)) / 4);
    return {
      x: lerp(drift.x, row.x, g),
      y: lerp(drift.y, row.y, g),
      rot: lerp(drift.rot, 0, g),
      scale: lerp(w.s, 0.85, g),
      opacity: 1 - landed,
    };
  }
  // Rows peel off into the loop; "Rent" slips out once and gets pulled back in.
  const o = sp(f, T.bed + i * 0.08, { damping: 14, stiffness: 70 });
  const slip =
    i === 1
      ? 120 *
        (sp(f, T.dropped, { damping: 12, stiffness: 140 }) -
          sp(f, T.dropped + 0.45, { damping: 11, stiffness: 120 }))
      : 0;
  const a = (i / WORRIES.length) * Math.PI * 2 - Math.PI / 2 + angle(t);
  const orbit = {
    x: ORBIT.x + Math.cos(a) * (ORBIT.r + slip),
    y: ORBIT.y + Math.sin(a) * (ORBIT.r + slip),
  };
  // "So tonight": they pour into the evening slot of the calendar.
  const c = prog(f, T.tonight + 0.3 + i * 0.05, 22);
  const slot = { x: BLOCK.x + BLOCK.w / 2, y: rowTop(EVENING) + ROW_H / 2 };
  return {
    x: lerp(lerp(row.x, orbit.x, o), slot.x, c),
    y: lerp(lerp(row.y, orbit.y, o), slot.y, c),
    rot: i === 1 ? slip * 0.12 : 0,
    scale: lerp(0.85, 0.8, o) * (1 - 0.7 * c),
    opacity: clamp01((f - sec(T.bed)) / 6) * (1 - clamp01((c - 0.6) / 0.4)),
  };
};

/** Speed trails behind the looping worries. */
const Trails: React.FC<{ f: number }> = ({ f }) => {
  const t = f / reel.fps;
  if (t < T.bed || t > T.tonight + 1.2) return null;
  const v = speed(t);
  const len = Math.min(0.7, v * 0.12);
  const fade = prog(f, T.bed + 0.4, 14) * (1 - prog(f, T.tonight + 0.2, 16));
  return (
    <svg
      width={reel.width}
      height={reel.height}
      style={{ position: "absolute", opacity: fade }}
    >
      <circle
        cx={ORBIT.x}
        cy={ORBIT.y}
        r={ORBIT.r}
        fill="none"
        stroke={P.hair}
        strokeWidth={3}
      />
      {WORRIES.map((_, i) => {
        const a =
          (i / WORRIES.length) * Math.PI * 2 - Math.PI / 2 + angle(t) - 0.14;
        const b = a - len;
        const r = ORBIT.r;
        return (
          <path
            key={i}
            d={`M ${ORBIT.x + Math.cos(b) * r} ${ORBIT.y + Math.sin(b) * r} A ${r} ${r} 0 0 1 ${ORBIT.x + Math.cos(a) * r} ${ORBIT.y + Math.sin(a) * r}`}
            fill="none"
            stroke="rgba(243,238,230,0.35)"
            strokeWidth={4}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};

/** Tonight's calendar in its three appearances: the meeting gets booked and moved, the evening block, and free at the end. */
const CalendarLayer: React.FC<{ f: number }> = ({ f }) => {
  const t = f / reel.fps;
  const fromRow3 = rowTop(EVENING) - rowTop(3);
  if (t < T.tonight) {
    const show = 1 - prog(f, T.day, 12);
    if (show <= 0) return null;
    const drop = sp(f, T.meeting, { damping: 9, stiffness: 140 });
    const lift =
      sp(f, T.move, { damping: 13, stiffness: 120 }) -
      sp(f, T.fix + 1.0, { damping: 13, stiffness: 120 });
    const drag = sp(f, T.fix, { damping: 14, stiffness: 80 });
    const events: CalEvent[] = [];
    if (t >= T.fix)
      events.push({
        row: 3,
        ...MEETING,
        attendees: false,
        state: "ghost",
        opacity: prog(f, T.fix + 0.15, 10),
      });
    if (t >= T.meeting) {
      events.push({
        row: 3,
        ...MEETING,
        dy: (1 - drop) * -260 + fromRow3 * drag,
        opacity: clamp01(drop * 3) * (1 - prog(f, T.day, 6)),
        lift,
      });
    }
    return (
      <Calendar
        {...CAL}
        {...CAL_ROWS}
        free={3}
        freeOpacity={1 - prog(f, T.meeting + 0.1, 6)}
        events={events}
        style={{ opacity: show, transform: `scale(${0.94 + 0.06 * show})` }}
      />
    );
  }
  if (t < T.back) {
    const show =
      prog(f, T.tonight + 0.45, 16) * (1 - prog(f, T.columns + 0.15, 10));
    if (show <= 0) return null;
    const pop = sp(f, T.fifteen, { damping: 11, stiffness: 150 });
    const events: CalEvent[] =
      t >= T.fifteen
        ? [
            {
              row: EVENING,
              title: "Worry list · 15 min",
              sub: "Moved from lights out",
              scale: 0.6 + 0.4 * pop,
              opacity: clamp01(pop * 3) * (1 - prog(f, T.columns, 4)),
            },
          ]
        : [];
    return (
      <Calendar
        {...CAL}
        {...CAL_ROWS}
        free={3}
        events={events}
        style={{ opacity: show, transform: `scale(${0.94 + 0.06 * show})` }}
      />
    );
  }
  const show = prog(f, T.back + 0.1, 18);
  return (
    <Calendar
      {...CAL}
      {...CAL_ROWS}
      free={3}
      style={{ opacity: show, transform: `scale(${0.94 + 0.06 * show})` }}
    />
  );
};

const InboxLayer: React.FC<{ f: number }> = ({ f }) => {
  const t = f / reel.fps;
  if (t < T.ping || t > T.bed + 0.6) return null;
  const rows = WORRIES.reduce(
    (sum, _, i) => sum + clamp01((f - rowLand(i)) / 4),
    0,
  );
  const show = prog(f, T.ping, 10) * (1 - prog(f, T.bed, 12));
  return (
    <Inbox
      {...INBOX}
      items={WORRIES.map((w) => w.t)}
      rows={rows}
      count={Math.max(1, Math.ceil(rows))}
      style={{ opacity: show, transform: `scale(${0.96 + 0.04 * show})` }}
    />
  );
};

/** The evening block opens into the page, entries write in, the page folds, shrinks to a note, and lets one more worry in. */
const PageLayer: React.FC<{ f: number }> = ({ f }) => {
  const t = f / reel.fps;
  if (t < T.columns || t > T.back + 0.6) return null;
  const grow = sp(f, T.columns, { damping: 18, stiffness: 90 });
  const from = { x: BLOCK.x, y: rowTop(EVENING) + 8, w: BLOCK.w, h: BLOCK.h };
  const shrink = sp(f, T.study, { damping: 16, stiffness: 80 });
  const rect = {
    x: lerp(PAGE.x, NOTE.x, shrink),
    y: lerp(PAGE.y, NOTE.y, shrink),
    w: lerp(PAGE.w, NOTE.w, shrink),
    h: lerp(PAGE.h, NOTE.h, shrink),
  };
  // A crack opens for the late worry, then closes.
  const crack =
    0.18 *
    (sp(f, T.list + 0.1, { damping: 12, stiffness: 120 }) -
      sp(f, T.list + 0.75, { damping: 12, stiffness: 120 }));
  const fold = prog(f, T.fold + 0.05, 22) - crack;
  const out = prog(f, T.back, 12);
  return (
    <FoldingPage
      {...rect}
      entries={ENTRIES}
      fold={fold}
      amber={1 - prog(f, T.study + 0.3, 20)}
      chrome={prog(f, T.columns + 0.5, 16)}
      worries={(f - sec(T.mind)) / 9}
      steps={(f - sec(T.step)) / 13}
      style={{
        transformOrigin: "0 0",
        transform:
          grow < 1 && t < T.fold
            ? `translate(${(from.x - PAGE.x) * (1 - grow)}px, ${(from.y - PAGE.y) * (1 - grow)}px) scale(${lerp(from.w / PAGE.w, 1, grow)}, ${lerp(from.h / PAGE.h, 1, grow)})`
            : `scale(${1 - 0.06 * out})`,
        opacity: 1 - out,
      }}
    />
  );
};

/** "Quieted racing thoughts": a busy line draws left to right and settles into a slow wave. */
const Signal: React.FC<{ f: number }> = ({ f }) => {
  const t = f / reel.fps;
  if (t < T.study || t > T.worry + 0.6) return null;
  const x0 = 130;
  const x1 = 880;
  const y = 870;
  const pts: string[] = [];
  for (let k = 0; k <= 300; k++) {
    const u = k / 300;
    const calm = 1 / (1 + Math.exp(-(u - 0.5) * 14));
    const busy =
      (Math.sin(u * 97 + f * 0.25) * 0.6 +
        Math.sin(u * 151 + 1 - f * 0.18) * 0.4 +
        Math.sin(u * 59 + 2 + f * 0.1) * 0.5) *
      110 *
      (1 - calm);
    const soft = Math.sin(u * Math.PI * 4 - f * 0.04) * 22 * calm;
    pts.push(
      `${k ? "L" : "M"} ${(x0 + (x1 - x0) * u).toFixed(1)} ${(y + busy + soft).toFixed(1)}`,
    );
  }
  const draw = prog(f, T.study + 0.3, 70);
  const show = 1 - prog(f, T.worry, 12);
  const label = {
    position: "absolute" as const,
    top: 1010,
    fontFamily: fonts.sans,
    fontSize: 22,
    letterSpacing: "0.12em",
    color: P.dim,
  };
  return (
    <AbsoluteFill style={{ opacity: show }}>
      <svg
        width={reel.width}
        height={reel.height}
        style={{ position: "absolute" }}
      >
        <defs>
          <linearGradient id="signalFade" x1="0" x2="1">
            <stop offset="0" stopColor={P.ink} stopOpacity={0} />
            <stop offset="0.08" stopColor={P.ink} stopOpacity={0.9} />
            <stop offset="0.92" stopColor={P.ink} stopOpacity={0.9} />
            <stop offset="1" stopColor={P.ink} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path
          d={pts.join(" ")}
          pathLength={1}
          strokeDasharray={`${draw} 1`}
          fill="none"
          stroke="url(#signalFade)"
          strokeWidth={4}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      <div style={{ ...label, left: x0, opacity: draw > 0 ? 1 : 0 }}>
        RACING
      </div>
      <div
        style={{
          ...label,
          right: reel.width - x1,
          opacity: prog(f, T.study + 1.8, 16),
        }}
      >
        QUIET
      </div>
    </AbsoluteFill>
  );
};

/** "If a worry shows up later": it pops up, gets a tick on "you're on the list", and slides into the note. */
const LateWorry: React.FC<{ f: number }> = ({ f }) => {
  const t = f / reel.fps;
  if (t < T.worry || t > T.back) return null;
  const pop = sp(f, T.worry + 0.25, { damping: 10, stiffness: 150 });
  const tick = sp(f, T.list, { damping: 9, stiffness: 180 });
  const into = prog(f, T.list + 0.35, 14);
  return (
    <Pill
      x={CX}
      y={lerp(840, NOTE.y + NOTE.h / 2 - 20, into)}
      text="Are they mad at me?"
      tick
      tickScale={tick}
      rot={-3 * (1 - into)}
      scale={pop * (1 - 0.5 * into)}
      opacity={clamp01(pop * 3) * (1 - prog(f, T.list + 0.6, 6))}
    />
  );
};

/** "Want to know what's keeping you up?": the quiz invite drops in, Accept is tapped, and it books itself into the evening. */
const INVITE = { x: CAL.x, y: 270, w: CAL.w, h: 420 };
const QUIZ = { x: BLOCK.x, y: rowTop(EVENING) + 8, w: BLOCK.w, h: BLOCK.h };
const TAP = T.quiz + 0.9;
const LOOP_FADE = RACING_MIND_SECONDS - 0.3;
const EndLayer: React.FC<{ f: number }> = ({ f }) => {
  const t = f / reel.fps;
  if (t < T.back) return null;
  const drop = sp(f, T.back + 0.35, { damping: 12, stiffness: 120 });
  const press =
    sp(f, TAP, { damping: 12, stiffness: 260 }) -
    sp(f, TAP + 0.2, { damping: 12, stiffness: 200 });
  const ring = prog(f, TAP, 16, ease.outQuart);
  // Booking: the invite travels down into the evening slot, shrinking and tilting like a picked-up block, then becomes it.
  const g = sp(f, T.plan - 0.2, { damping: 16, stiffness: 110 });
  const from = { x: INVITE.x + INVITE.w / 2, y: INVITE.y + INVITE.h / 2 };
  const to = { x: QUIZ.x + QUIZ.w / 2, y: QUIZ.y + QUIZ.h / 2 };
  const scale = lerp(1, 0.42, g);
  const fade = 1 - prog(f, LOOP_FADE, 9);
  const accept = inviteAccept(INVITE.h);
  return (
    <>
      {g < 0.95 ? (
        <Invite
          {...INVITE}
          accepted={t >= TAP + 0.12}
          press={press}
          style={{
            transform: `translate(${(to.x - from.x) * g}px, ${(1 - drop) * -160 + (to.y - from.y) * g}px) rotate(${-3 * Math.sin(Math.PI * g)}deg) scale(${scale * (0.96 + 0.04 * drop)})`,
            opacity: clamp01(drop * 3) * (1 - clamp01((g - 0.6) / 0.3)),
          }}
        />
      ) : null}
      {t >= TAP && ring < 1 ? (
        <TapRing
          x={INVITE.x + accept.x}
          y={INVITE.y + accept.y}
          r={30 + 50 * ring}
          opacity={1 - ring}
        />
      ) : null}
      {g > 0.5 ? (
        <QuizBlock
          {...QUIZ}
          style={{
            opacity: clamp01((g - 0.55) / 0.3) * fade,
            transform: `scale(${0.9 + 0.1 * g})`,
          }}
        />
      ) : null}
    </>
  );
};

const supers: Array<{
  at: number;
  out: number;
  y: number;
  text: string;
  accent?: boolean;
}> = [
  // The hook is fully on screen in the first frame.
  {
    at: -3,
    out: T.fix - 0.4,
    y: TOP,
    text: "Racing mind at bedtime? *Move the meeting.*",
  },
  {
    at: T.fix,
    out: T.day - 0.4,
    y: TOP,
    text: "The fix happens *before bed.*",
  },
  {
    at: T.day,
    out: T.ping - 0.3,
    y: BOTTOM,
    text: "Worries have *nowhere to land.*",
  },
  { at: T.ping, out: T.bed - 0.4, y: BOTTOM, text: "They all *ping at once.*" },
  {
    at: T.bed,
    out: T.tonight - 0.4,
    y: TOP,
    text: "Your mind keeps them *looping.*",
  },
  {
    at: T.tonight,
    out: T.columns - 0.4,
    y: TOP,
    text: "*Fifteen minutes,* before bed.",
  },
  {
    at: T.columns,
    out: T.fold - 0.3,
    y: BOTTOM,
    text: "Two columns: *worry, next step.*",
  },
  {
    at: T.fold,
    out: T.study - 0.4,
    y: BOTTOM,
    text: "Then *fold the page.*",
    accent: true,
  },
  {
    at: T.study,
    out: T.worry - 0.4,
    y: TOP,
    text: "It *quieted racing thoughts.*",
  },
  {
    at: T.worry,
    out: T.back - 0.4,
    y: TOP,
    text: "A worry shows up? *It's on the list.*",
  },
];

export const RacingMind: React.FC<{ supers?: boolean }> = ({
  supers: withSupers = true,
}) => {
  const f = useCurrentFrame();
  const t = f / reel.fps;
  // "The house goes quiet": the lights dim until "tonight".
  const dim =
    t < T.tonight
      ? 0.45 * prog(f, T.quiet, 24)
      : 0.45 * (1 - prog(f, T.tonight, 24));
  const source =
    prog(f, T.study + 0.5, 18, ease.outQuart) *
    (1 - prog(f, T.worry - 0.4, 10));
  return (
    <SurfaceTint.Provider value={TINT}>
      <AbsoluteFill>
        {/* A seeded photo behind frosted, darkened glass, so the objects and type stay readable. */}
        <PhotoBackground photo={PHOTO} blur={44} calm={0.5} saturation={0.7} />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(170deg, rgba(255,255,255,0.05), rgba(5,6,16,0.3))",
          }}
        />
        <AbsoluteFill style={{ background: `rgba(3,4,10,${dim})` }} />
        <Audio src={staticFile("audio/racing-mind-vo.mp3")} />
        <CalendarLayer f={f} />
        <InboxLayer f={f} />
        <Trails f={f} />
        {WORRIES.map((w, i) => {
          const s = pillAt(i, f);
          return s && s.opacity > 0.01 ? (
            <Pill key={w.t} text={w.t} {...s} />
          ) : null;
        })}
        <PageLayer f={f} />
        <Signal f={f} />
        <LateWorry f={f} />
        <EndLayer f={f} />
        {withSupers ? (
          <>
            {supers.map((s) => (
              <HeadlineIn
                key={s.at}
                y={s.y}
                size={100}
                text={s.text}
                at={s.at}
                out={s.out}
                accent={s.accent}
                align="center"
              />
            ))}
            {/* Loop line; it fades out over the last frames so the cut back to the hook is soft. */}
            <div style={{ opacity: 1 - prog(f, LOOP_FADE, 9) }}>
              <HeadlineIn
                y={TOP}
                size={100}
                text="So you'll have a *plan for when…*"
                at={T.plan}
                align="center"
              />
            </div>
            <div
              style={{
                position: "absolute",
                top: TOP + 240,
                left: P.margin,
                width: P.right - P.margin,
                textAlign: "center",
                fontFamily: fonts.sans,
                fontWeight: 500,
                fontSize: 30,
                color: P.dim,
                opacity: source,
              }}
            >
              Carney &amp; Waters, 2006
            </div>
          </>
        ) : null}
      </AbsoluteFill>
    </SurfaceTint.Provider>
  );
};
