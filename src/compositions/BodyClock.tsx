// "Wide awake at midnight, foggy at 7 a.m.?" (body clock set by light; the camping study). Script: docs/body-clock.md.
// VO: public/audio/body-clock-vo.mp3. Direction A, rebuilt after preview 1 (user, Oct 31: "the visual is not clear
// enough"): a red digital alarm clock on the nightstand; your body clock is a dashed ghost readout under the real time.
// A hanging pendant light washes the room cold and bright; the window stays fixed and only the curtain moves (its gap
// sets the stripe of light). Camping is one tent, close up: the room slides away and the tent springs in around you, the
// clock comes along as the travel clock; sunset, the fire to embers, and the ghost slides up into the real time. Home
// again: coffee on the sunny step (curtain shut, one light), the ghost ticks up a little; at night the bedside lamp
// (amber, once) replaces the pendant; the quiz card grows out of the lamp and sinks back as frame 0 returns.
import { useId } from "react";
import { AbsoluteFill, Audio, spring, staticFile, useCurrentFrame } from "remotion";
import type { SpringConfig } from "remotion";
import { photos } from "../brand/photos";
import { ease, fonts, reel, sec } from "../brand/theme";
import { PhotoBackground } from "../components/PhotoBackground";
import { LINE, SurfaceTint, useSurface } from "../components/objects";
import { P } from "../components/premium";
import { DeskClock, Mug, Pendant } from "../components/rooms";
import { progress } from "../lib/animation";
import { HeadlineIn } from "../templates/motion";

// The seeded pick (Milky Way, tree corner) came out washed-out grey (user, Oct 31); the deep blue sky instead.
export const PHOTO = photos.blueSky;
export const TINT = PHOTO.tint;

// The last word ends at ~33.9 s.
export const BODY_CLOCK_SECONDS = 34.1;

// VO cues (seconds), from the pauses in the voiceover.
const T = {
  foggy: 1.65, // "foggy at 7 a.m.?"
  late: 3.48, // "Your body clock may run two hours late."
  light: 6.25, // "Your body clock sets itself by light."
  dim: 9.0, // "Indoor mornings are dim"
  bright: 10.5, // "and nights are bright,"
  slides: 11.95, // "so it slides later."
  camping: 13.56, // "Researchers took eight people camping for a week,"
  noLight: 16.61, // "no electric light."
  hormone: 18.08, // "Their sleep hormone, melatonin,"
  earlier: 20.07, // "kicked in two hours earlier."
  owls: 22.19, // "Night owls shifted most."
  coffee: 24.23, // "Drink your morning coffee outside for ten minutes."
  night: 27.24, // "At night,"
  lamp: 27.96, // "use a lamp,"
  overhead: 28.86, // "not the overhead light."
  quiz: 30.42, // "See if you're a Night Owl with the sleep quiz in our bio,"
  ifYoure: 33.39, // "if you're—"
};

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const prog = (f: number, s: number, frames: number) => progress(f, sec(s), frames, ease.out);
const SP: Partial<SpringConfig> = { damping: 16, stiffness: 70, mass: 1 };
const SLOW: Partial<SpringConfig> = { damping: 18, stiffness: 40, mass: 1 };
const GLIDE: Partial<SpringConfig> = { damping: 20, stiffness: 24, mass: 1 };
const QUICK: Partial<SpringConfig> = { damping: 15, stiffness: 160, mass: 0.7 };
const spf = (f: number, s: number, config: Partial<SpringConfig> = SP, delay = 0) =>
  spring({ frame: Math.max(0, f - sec(s) - delay), fps: reel.fps, config });
type Step = [number, number, Partial<SpringConfig>?, number?];
/** A value that springs to each new target in turn: [seconds, target, spring, delay in frames]. */
const track = (f: number, start: number, steps: Step[]) => {
  let v = start;
  for (const [at, to, cfg, delay] of steps) v = lerp(v, to, spf(f, at, cfg ?? SP, delay ?? 0));
  return v;
};

// ─── The room (room units: 640 × 760) ───────────────────────────────────────────────────────────────────────────────
const W = 640;
const H = 760;
export const WIN = { x: 180, y: 640, w: 720, h: (H * 720) / W };
const WIN_UP = 300;
export const TOP = 360;
const BOTTOM = 1210;
const INK = (o: number) => `rgba(243,238,230,${o})`;
const SUN = "#FFE7BF";
const BULB = "#EEF3FF";

type Box = { x: number; y: number; w: number; h: number; r: number };
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
  step: [300, 680] as [number, number],
};
// The window in the right wall; the curtain's two panels close toward the middle. Light through the gap always falls
// the same way (down and to the left), so the stripe only gets wider or narrower, never changes direction.
const WINDOW = { x: 628, top: 290, bottom: 530 };
const FALL: [number, number] = [-286, 140];
// The tent, close up (it springs in around you; the clock comes along as the travel clock).
const TENT = { x: 110, y: 70, w: 420, h: 520 };
const TENT_HEAD: [number, number] = [320, 190];
const TRAVEL = { x: 470, y: 150, size: 120 };

/** The quiz card (grows out of the lamp's light). */
const QuizCard: React.FC<{ tick: number }> = ({ tick }) => {
  const s = useSurface();
  return (
    <g>
      <rect x={10} y={22} width={560} height={560} rx={34} fill="rgba(0,0,0,0.35)" />
      <rect width={560} height={560} rx={34} fill={s(0.22, 0.08)} stroke={INK(0.7)} strokeWidth={LINE} />
      <text x={56} y={96} fontFamily={fonts.sans} fontWeight={500} fontSize={26} letterSpacing="0.12em" fill={P.dim}>
        ARE YOU A NIGHT OWL?
      </text>
      <rect x={56} y={160} width={58} height={58} rx={16} fill="none" stroke={INK(0.75)} strokeWidth={LINE} />
      {tick > 0 ? (
        <path d="M 70 190 L 82 204 L 102 172" fill="none" stroke={P.ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={60} strokeDashoffset={60 * (1 - clamp01(tick))} />
      ) : null}
      <text fontFamily={fonts.sans} fontWeight={600} fontSize={74} letterSpacing="-0.03em" fill={P.ink}>
        <tspan x={140} y={214}>Take the</tspan>
        <tspan x={140} y={296}>sleep quiz</tspan>
      </text>
      <line x1={56} y1={400} x2={504} y2={400} stroke={INK(0.25)} strokeWidth={2} />
      <text x={56} y={484} fontFamily={fonts.sans} fontWeight={600} fontSize={46} letterSpacing="-0.02em" fill={P.ink}>
        Link in bio
      </text>
    </g>
  );
};

const Room: React.FC<{ f: number }> = ({ f }) => {
  const s = useSurface();
  const id = `bc${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const t = f / reel.fps;

  // Scenes: the tent (13.6 → 24.2), the sunny step outside (coffee), night (lamp).
  const camp = clamp01(spf(f, T.camping, SP) - spf(f, T.coffee, SP));
  const tentIn = (d: number) => clamp01(spf(f, T.camping + 0.15, SP, d) - spf(f, T.coffee, SP));
  const out = clamp01(spf(f, T.coffee + 0.5, SP) - spf(f, T.night, SP));
  const dark = 0.28 * clamp01(spf(f, T.night, SLOW) - spf(f, T.ifYoure, SP));

  // The time: past midnight, to 7 (foggy), to midnight (bright nights), 10 at the camp, 7 again for the coffee
  // (ten minutes pass), 10 at night, back to frame 0's time on "if you're—".
  const sweep = Math.min(t, T.foggy) / T.foggy;
  let hours = 11.85 + 0.2 * sweep;
  hours = track(f, hours, [
    [T.foggy, 19, QUICK],
    [T.bright, 24, SP],
    [T.camping, 22, SP],
    [T.coffee + 0.2, 31, SP],
    [T.ifYoure, 35.85, SP],
  ]);
  hours += (1 / 6) * clamp01((t - (T.coffee + 1.2)) / 1.6) - (1 / 6) * spf(f, T.ifYoure, SP);
  hours += 2.83 * clamp01(spf(f, T.night, SP)) - 2.83 * spf(f, T.ifYoure, SP);
  // Your body clock: the ghost readout, `lag` hours behind the real time.
  const lag = track(f, 2, [
    [T.light + 0.4, 1.0, SLOW],
    [T.dim + 0.2, 1.4, SP],
    [T.slides + 0.1, 2, SLOW],
    [T.coffee + 0.6, 2, SLOW],
    [T.coffee + 1.4, 1.9, GLIDE],
  ]);
  // The ghost drops out of the real readout on "two hours late", slides up into it on "two hours earlier", drops out
  // again at home, and is gone for frame 0.
  const ghostDrop = clamp01(spf(f, T.late + 0.3, SP) - spf(f, T.earlier + 0.1, SLOW) + spf(f, T.coffee + 0.5, SP));
  const ghostO = clamp01(spf(f, T.late + 0.3, SP) * 2) * (1 - prog(f, T.ifYoure, 10));
  const lagShown = t > T.earlier && t < T.coffee + 0.5 ? lag * ghostDrop : lag;

  const clockX = lerp(R.clock.x, TRAVEL.x, camp);
  const clockY = lerp(R.clock.y, TRAVEL.y, camp);
  const clockSize = lerp(R.clock.size, TRAVEL.size, camp);

  // Light. The pendant: on for midnight and bright nights, off for mornings; on again at night, off for the lamp.
  const pendant = track(f, 1, [
    [T.foggy, 0, QUICK],
    [T.bright, 1, QUICK],
    [T.camping, 0, SP],
    [T.night, 1, QUICK],
    [T.overhead + 0.2, 0, QUICK],
    [T.ifYoure + 0.1, 1, QUICK],
  ]);
  const lamp = clamp01(spf(f, T.lamp + 0.1, QUICK) - spf(f, T.ifYoure + 0.2, SP));
  const curtain = track(f, 0, [
    [T.foggy, 0.85, SP],
    [T.light, 0.1, SLOW],
    [T.dim, 0.85, SP],
    [T.coffee, 1, SP],
    [T.ifYoure, 0, SP],
  ]);
  const daylight = clamp01(spf(f, T.foggy + 0.1, SP) - spf(f, T.bright, SP));
  const gapTop = WINDOW.top + 120 * curtain;
  const gapBottom = WINDOW.bottom - 120 * curtain;

  // The camp: sun low outside the door, setting on "no electric light"; the fire dies to embers for melatonin.
  const sunset = spf(f, T.noLight, GLIDE);
  const embers = spf(f, T.hormone, GLIDE);

  // You: tossing in the hook; groggy at 7; in the sleeping bag at the camp; out on the step with a mug; back to bed.
  const roll = track(f, 0, [
    [0.05, -55, QUICK],
    [0.7, 50, QUICK],
    [1.3, 0, SP],
  ]);
  const awake = track(f, 1.15, [
    [T.foggy, 0.5, SP],
    [T.late, 0.8, SP],
    [T.camping, 0.7, SP],
    [T.hormone, 0.25, GLIDE],
    [T.coffee, 0.85, SP],
    [T.night, 0.5, SP],
    [T.lamp + 0.3, 0.35, SLOW],
    [T.ifYoure, 1.15, SP],
  ]);
  const groggy = clamp01(spf(f, T.foggy, SP) - spf(f, T.late, SP));
  const toTent = spf(f, T.camping, GLIDE);
  const toStep = spf(f, T.coffee + 0.3, GLIDE);
  const toBed = spf(f, T.night, SP);
  const [hx, hy] = R.head;
  let yx = lerp(lerp(hx, TENT_HEAD[0], toTent), R.step[0], toStep);
  let yy = lerp(lerp(hy, TENT_HEAD[1], toTent), R.step[1], toStep);
  // A gentle sideways bow on the long glides.
  yx += 60 * Math.sin(Math.PI * toStep) + 40 * Math.sin(Math.PI * toBed);
  yx = lerp(yx, hx, toBed) + roll;
  yy = lerp(yy, hy, toBed);
  const pulse = 1 + 0.06 * Math.sin(f / 5) * clamp01((awake - 0.8) * 3);
  const mug = clamp01(spf(f, T.coffee + 0.9, SP) - spf(f, T.night, SP));

  const quizP = clamp01(spf(f, T.quiz + 0.1, SP) - spf(f, T.ifYoure, SP));
  const tick = prog(f, T.quiz + 1.3, 12);

  const piece = (q: Box, fill: number, line: number) => (
    <rect x={q.x} y={q.y} width={q.w} height={q.h} rx={q.r} fill={s(fill, 0.28)} stroke={INK(line)} strokeWidth={LINE} />
  );

  return (
    <div style={{ position: "relative", width: WIN.w, height: WIN.h }}>
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
      <svg width={WIN.w} height={WIN.h} viewBox={`0 0 ${W} ${H}`} style={{ position: "relative", display: "block", overflow: "hidden", borderRadius: 45 }}>
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
            <stop offset="0" stopColor={SUN} stopOpacity={0.4} />
            <stop offset="1" stopColor={SUN} stopOpacity={0} />
          </radialGradient>
          <linearGradient id={`${id}sun`} x1="1" y1="0.3" x2="0" y2="0.6">
            <stop offset="0" stopColor={SUN} stopOpacity={0.6} />
            <stop offset="1" stopColor={SUN} stopOpacity={0.12} />
          </linearGradient>
          <linearGradient id={`${id}dusk`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#F2B98A" stopOpacity={0.5} />
            <stop offset="1" stopColor="#F2B98A" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* ── The bedroom: slides up and away for the camp, back down after. ── */}
        <g transform={`translate(0 ${-H * camp})`} opacity={1 - 0.6 * camp}>
          {out > 0.01 ? null : piece(R.rug, 0.02, 0.18)}
          {piece(R.nightstand, 0.05, 0.3)}
          {piece(R.bed, 0.06, 0.55)}
          {piece(R.duvet, 0.14, 0.55)}
          <rect x={R.pillow.x + roll * 0.4} y={R.pillow.y} width={R.pillow.w} height={R.pillow.h} rx={R.pillow.r} fill={s(0.3, 0.12)} stroke={INK(0.75)} strokeWidth={LINE} transform={`rotate(${roll * 0.06} ${hx} ${hy})`} />
          <line x1={WINDOW.x} y1={WINDOW.top} x2={WINDOW.x} y2={WINDOW.bottom} stroke="rgba(255,240,210,0.75)" strokeWidth={8} strokeLinecap="round" />
          <rect x={600} y={WINDOW.top - 8} width={22} height={6 + 120 * curtain} rx={10} fill={s(0.2, 0.2)} stroke={INK(0.55)} strokeWidth={2} />
          <rect x={600} y={WINDOW.bottom + 2 - 6 - 120 * curtain} width={22} height={6 + 120 * curtain} rx={10} fill={s(0.2, 0.2)} stroke={INK(0.55)} strokeWidth={2} />
          {daylight > 0.01 && gapBottom - gapTop > 2 ? (
            <path
              d={`M 616 ${gapTop} L 616 ${gapBottom} L ${616 + FALL[0]} ${gapBottom + FALL[1]} L ${616 + FALL[0]} ${gapTop + FALL[1]} Z`}
              fill={`url(#${id}sun)`}
              opacity={0.85 * daylight}
            />
          ) : null}
          {/* Out the door: the bottom wall opens onto a sunlit step (the only light in this beat). */}
          {out > 0.01 ? (
            <g opacity={out}>
              <rect x={0} y={600} width={640} height={160} fill={SUN} opacity={0.22} />
              <path d="M 0 600 L 260 600 M 400 600 L 640 600" stroke={INK(0.6)} strokeWidth={LINE + 3} strokeLinecap="round" />
              <path d="M 400 600 A 140 140 0 0 0 260 600" fill="none" stroke={INK(0.35)} strokeWidth={2} strokeDasharray="5 8" />
            </g>
          ) : null}
          {dark > 0.01 ? <rect width={W} height={H} fill="#04103A" opacity={dark} /> : null}
          {lamp > 0.01 ? <circle cx={R.lamp[0]} cy={R.lamp[1]} r={300 * (0.6 + 0.4 * lamp)} fill={`url(#${id}lamp)`} opacity={lamp} /> : null}
          {/* The bedside lamp on the nightstand: a round shade from above (amber when on, once). */}
          <circle cx={R.lamp[0]} cy={R.lamp[1]} r={32} fill={s(0.2, 0.15)} stroke={lamp > 0.5 ? P.amber : INK(0.45)} strokeWidth={LINE} />
          <circle cx={R.lamp[0]} cy={R.lamp[1]} r={10} fill={lamp > 0.5 ? P.amber : INK(0.3)} />
          {/* The pendant: on, it washes the whole room cold and bright. */}
          {pendant > 0.01 ? (
            <>
              <rect width={W} height={H} fill={BULB} opacity={0.12 * pendant} />
              <circle cx={R.pendant[0]} cy={R.pendant[1] + 20} r={420} fill={`url(#${id}bulb)`} opacity={pendant} />
            </>
          ) : null}
          <Pendant x={R.pendant[0]} y={R.pendant[1]} on={pendant} />
        </g>

        {/* ── The tent, close up: springs in around you. ── */}
        {camp > 0.01 ? (
          <g>
            <rect x={0} y={560} width={W} height={200} fill={`url(#${id}dusk)`} opacity={tentIn(0) * lerp(1, 0.25, sunset)} />
            {(() => {
              const k = tentIn(10);
              return (
                <g opacity={k}>
                  <circle cx={320} cy={690} r={lerp(150, 90, embers) * k} fill={`url(#${id}fire)`} />
                  {Array.from({ length: 7 }, (_, i) => {
                    const a = (i / 7) * Math.PI * 2;
                    return <circle key={i} cx={320 + 30 * Math.cos(a)} cy={690 + 30 * Math.sin(a)} r={8} fill={s(0.1, 0.2)} stroke={INK(0.5)} strokeWidth={2} />;
                  })}
                  <circle cx={320} cy={690} r={lerp(18, 6, embers) * (1 + 0.08 * Math.sin(f / 3))} fill={SUN} opacity={0.85} />
                  <circle cx={329} cy={695} r={5 * embers} fill={SUN} opacity={0.6} />
                </g>
              );
            })()}
            {(() => {
              const k = tentIn(0);
              const cx = TENT.x + TENT.w / 2;
              const cy = TENT.y + TENT.h / 2;
              return (
                <g transform={`translate(${cx} ${cy}) scale(${lerp(0.85, 1, k)}) translate(${-cx} ${-cy})`} opacity={clamp01(k * 1.5)}>
                  <rect x={TENT.x} y={TENT.y} width={TENT.w} height={TENT.h} rx={60} fill={s(0.1, 0.28)} stroke={INK(0.6)} strokeWidth={LINE} />
                  <path d={`M 230 ${TENT.y + TENT.h} L 320 ${TENT.y + TENT.h - 70} L 410 ${TENT.y + TENT.h}`} fill={s(0.04, 0.3)} stroke={INK(0.55)} strokeWidth={LINE} strokeLinejoin="round" />
                </g>
              );
            })()}
            {(() => {
              const k = tentIn(3.5);
              return (
                <g opacity={clamp01(k * 1.5)} transform={`translate(0 ${30 * (1 - k)})`}>
                  <rect x={232} y={130} width={176} height={360} rx={70} fill={s(0.22, 0.15)} stroke={INK(0.7)} strokeWidth={LINE} />
                  <path d="M 252 250 Q 320 270 388 250" fill="none" stroke={INK(0.35)} strokeWidth={2.5} strokeLinecap="round" />
                  <ellipse cx={TENT_HEAD[0]} cy={TENT_HEAD[1]} rx={56} ry={50} fill={s(0.3, 0.1)} stroke={INK(0.55)} strokeWidth={2.5} />
                </g>
              );
            })()}
          </g>
        ) : null}

        {/* You: a soft glow and a dot; groggy, the glow is dim and smeared. */}
        <ellipse
          cx={yx}
          cy={yy + 20 * groggy}
          rx={(90 + 120 * awake) * (1 - 0.3 * groggy) * pulse}
          ry={(90 + 120 * awake) * (1 - 0.3 * groggy) * (1 + 0.5 * groggy) * pulse}
          fill={`url(#${id}glow)`}
          opacity={Math.min(1, 0.35 + 0.65 * awake) * (1 - 0.35 * groggy)}
        />
        <circle cx={yx} cy={yy} r={lerp(27, 24, camp)} fill={P.ink} opacity={1 - 0.25 * groggy} />
        {mug > 0.01 ? (
          <g transform={`translate(${yx + 70} ${yy + 6}) scale(${lerp(0.4, 1, mug)})`} opacity={clamp01(mug * 1.5)}>
            <Mug steam={f / 8} />
          </g>
        ) : null}
        {/* Ridge pole of the tent, over you. */}
        {camp > 0.01 ? <line x1={320} y1={TENT.y + 6} x2={320} y2={TENT.y + TENT.h - 76} stroke={INK(0.3)} strokeWidth={2} strokeDasharray="8 10" opacity={tentIn(0)} /> : null}

        {/* The clock: on the nightstand, or the travel clock by your head in the tent. Never bigger than a real one. */}
        <DeskClock x={clockX} y={clockY} size={clockSize} hours={hours} ghost={{ lag: lagShown, y: lerp(0, lerp(66, 56, camp), ghostDrop), o: ghostO * lerp(0.5, 1, ghostDrop) }} />

        {/* The quiz card grows out of the lamp's light. */}
        {quizP > 0.01 ? (
          <g transform={`translate(${lerp(R.lamp[0], 56, quizP)} ${lerp(R.lamp[1], 40, quizP)}) scale(${lerp(0.05, 0.8, quizP)})`} opacity={clamp01(quizP * 1.6)}>
            <QuizCard tick={tick} />
          </g>
        ) : null}
      </svg>
    </div>
  );
};

const StageLayer: React.FC<{ f: number }> = ({ f }) => {
  // For the camp the stage glides up so the supers can sit below it (once).
  const up = clamp01(spf(f, T.camping - 0.1, SP) - spf(f, T.coffee - 0.1, SP));
  return (
    <div style={{ position: "absolute", left: WIN.x, top: lerp(WIN.y, WIN_UP, up) }}>
      <Room f={f} />
    </div>
  );
};

const LOOP_FADE = BODY_CLOCK_SECONDS - 0.32;
export const HOOK = "Awake at night, *foggy all morning?*";
const supers: Array<{ at: number; out: number; y: number; text: string }> = [
  { at: T.late, out: 6.0, y: TOP, text: "Body clock: *two hours late.*" },
  { at: T.light, out: 8.8, y: TOP, text: "It *sets itself by light.*" },
  { at: T.dim, out: 11.75, y: TOP, text: "Dim mornings. *Bright nights.*" },
  { at: T.slides, out: 13.35, y: TOP, text: "So it *slides later.*" },
  { at: T.camping + 0.2, out: 16.4, y: BOTTOM, text: "Eight people. *A week camping.*" },
  { at: T.noLight, out: 17.9, y: BOTTOM, text: "*No electric light.*" },
  { at: T.hormone, out: 22.0, y: BOTTOM, text: "Melatonin kicked in *two hours earlier.*" },
  { at: T.owls, out: 23.9, y: BOTTOM, text: "Night owls *shifted most.*" },
  { at: T.coffee + 0.1, out: 27.0, y: TOP, text: "Coffee outside, *ten minutes.*" },
  { at: T.night, out: 30.2, y: TOP, text: "At night: *a lamp, not the overhead.*" },
];

export const BodyClock: React.FC = () => {
  const f = useCurrentFrame();
  const loop = prog(f, LOOP_FADE, 9);
  return (
    <SurfaceTint.Provider value={TINT}>
      <AbsoluteFill>
        <PhotoBackground photo={PHOTO} blur={44} calm={0.5} saturation={0.7} />
        <AbsoluteFill style={{ background: "linear-gradient(170deg, rgba(255,255,255,0.05), rgba(5,6,16,0.3))" }} />
        <Audio src={staticFile("audio/body-clock-vo.mp3")} />
        <StageLayer f={f} />
        {/* The last frames fade into frame 0. */}
        {loop > 0 ? (
          <AbsoluteFill style={{ opacity: loop }}>
            <StageLayer f={0} />
          </AbsoluteFill>
        ) : null}
        <HeadlineIn y={TOP} size={100} text={HOOK} at={-3} out={3.3} align="center" />
        {supers.map((s) => (
          <HeadlineIn key={s.at} y={s.y} size={100} text={s.text} at={s.at} out={s.out} align="center" />
        ))}
        <div style={{ opacity: 1 - loop }}>
          <HeadlineIn y={TOP} size={100} text="Are you *a night owl?*" at={T.quiz} align="center" />
        </div>
        <div style={{ opacity: loop }}>
          <HeadlineIn y={TOP} size={100} text={HOOK} at={-3} align="center" />
        </div>
      </AbsoluteFill>
    </SurfaceTint.Provider>
  );
};
