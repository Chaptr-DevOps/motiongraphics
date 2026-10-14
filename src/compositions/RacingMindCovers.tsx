// Cover options for RacingMind, built for legibility on a profile grid (a small 3:4 tile cropped from the middle).
// Frame i = option i + 1. All white, heavier type, one hero object, everything inside the 3:4 crop (y 240–1680).
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { pickPhoto } from "../brand/photos";
import { fonts, reel } from "../brand/theme";
import { PhotoBackground } from "../components/PhotoBackground";
import { Attendees, Calendar, LINE, Pill, SurfaceTint } from "../components/objects";
import { P } from "../components/premium";
import { HeadlineIn } from "../templates/motion";

export const COVER_OPTIONS = 4;

const PHOTO = pickPhoto("racing-mind");
const grey = (PHOTO.tint[0] + PHOTO.tint[1] + PHOTO.tint[2]) / 3;
const TINT = PHOTO.tint.map((c) => c * 0.7 + grey * 0.3) as [number, number, number];

const Title: React.FC<{ y: number; size: number; lines: string[]; dimFirst?: boolean }> = ({ y, size, lines, dimFirst }) => (
  <div
    style={{
      position: "absolute",
      top: y,
      left: 60,
      right: 60,
      textAlign: "center",
      fontFamily: fonts.sans,
      fontWeight: 600,
      fontSize: size,
      lineHeight: 0.98,
      letterSpacing: "-0.045em",
      color: P.ink,
      textShadow: "0 6px 40px rgba(0,0,0,0.45)",
    }}
  >
    {lines.map((l, i) => (
      <div key={i} style={{ color: dimFirst && i === 0 ? "rgba(243,238,230,0.7)" : P.ink }}>
        {l}
      </div>
    ))}
  </div>
);

/** The opening meeting block, drawn large for the cover. */
const BigMeeting: React.FC<{ x: number; y: number; w: number; rot?: number; lifted?: boolean; ghost?: boolean }> = ({ x, y, w, rot = 0, lifted, ghost }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: 220,
      boxSizing: "border-box",
      borderRadius: 34,
      border: ghost ? `${LINE + 1}px dashed rgba(243,238,230,0.3)` : `${LINE + 1}px solid rgba(243,238,230,0.75)`,
      background: ghost ? "transparent" : "linear-gradient(160deg, rgba(243,238,230,0.26), rgba(243,238,230,0.10))",
      backdropFilter: ghost ? undefined : "blur(10px)",
      boxShadow: lifted ? "0 50px 90px rgba(0,0,0,0.55)" : undefined,
      transform: `rotate(${rot}deg)`,
      padding: "0 40px 0 62px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: 16,
      fontFamily: fonts.sans,
      color: P.ink,
    }}
  >
    {ghost ? null : (
      <>
        <div style={{ position: "absolute", left: 22, top: 26, bottom: 26, width: 10, borderRadius: 5, background: P.ink }} />
        <div style={{ fontSize: 58, fontWeight: 600, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>Everything, all at once</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 38, fontWeight: 500, color: "rgba(243,238,230,0.7)" }}>Organizer: your brain</div>
          <Attendees count={4} size={44} />
        </div>
      </>
    )}
  </div>
);

const CAL = { x: 146, y: 720, w: 720, h: 760 };
const CAL_ROWS = { rows: 5, nightFrom: 3, labels: { 0: "Afternoon", 1: "Dinner", 2: "Evening", 3: "Lights out" } };

const options: Array<() => React.ReactNode> = [
  // 0. Current cover (frame 90 of the video), for comparison.
  () => (
    <>
      <Calendar {...CAL} {...CAL_ROWS} events={[{ row: 3, title: "Everything, all at once", sub: "Organizer: your brain", attendees: true }]} />
      <HeadlineIn y={360} size={100} text="Racing mind at bedtime? *Move the meeting.*" at={-3} align="center" />
    </>
  ),
  // A. The question, huge. Speaks to the viewer's problem; the meeting block underneath sets up the metaphor.
  () => (
    <>
      <Title y={390} size={176} lines={["Racing", "mind at", "bedtime?"]} />
      <BigMeeting x={95} y={1060} w={890} rot={-3} lifted />
      <Title y={1390} size={92} lines={["Move the meeting."]} />
    </>
  ),
  // B. The move itself: the meeting lifted out of Lights out, ghost left behind, arrow up. Answer-first headline.
  () => (
    <>
      <Title y={300} size={168} lines={["Move the", "meeting."]} />
      <div style={{ position: "absolute", left: 95, top: 1270, fontFamily: fonts.sans, fontSize: 34, fontWeight: 600, letterSpacing: "0.14em", color: "rgba(243,238,230,0.6)" }}>LIGHTS OUT</div>
      <BigMeeting x={95} y={1320} w={890} ghost />
      <svg width={reel.width} height={reel.height} style={{ position: "absolute" }}>
        <path d="M 1010 1420 C 1060 1250, 1060 1050, 1000 950" fill="none" stroke="rgba(243,238,230,0.6)" strokeWidth={5} strokeLinecap="round" strokeDasharray="0.1 18" />
        <path d="M -20 -16 L 0 0 L -20 16" transform="translate(1000 950) rotate(-110)" fill="none" stroke="rgba(243,238,230,0.6)" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <BigMeeting x={75} y={760} w={890} rot={-4} lifted />
    </>
  ),
  // C. The worries themselves, crowding in. Relatable specifics carry it; big question on top.
  () => (
    <>
      <Title y={300} size={150} lines={["Your brain", "calls a", "meeting."]} />
      {[
        { x: 300, y: 870, t: "Are they mad at me?", r: -5 },
        { x: 760, y: 980, t: "Rent", r: 7 },
        { x: 330, y: 1090, t: "Reply to Sam", r: 4 },
        { x: 740, y: 1190, t: "Dentist?", r: -6 },
        { x: 380, y: 1300, t: "That thing I said", r: -3 },
        { x: 770, y: 1410, t: "Work deadline", r: 5 },
        { x: 420, y: 1510, t: "Birthday gift", r: -4 },
      ].map((p) => (
        <Pill key={p.t} x={p.x} y={p.y} text={p.t} rot={p.r} scale={1.55} />
      ))}
    </>
  ),
];

export const RacingMindCovers: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SurfaceTint.Provider value={TINT}>
      <AbsoluteFill>
        <PhotoBackground photo={PHOTO} blur={44} calm={0.5} saturation={0.7} />
        <AbsoluteFill style={{ background: "linear-gradient(170deg, rgba(255,255,255,0.05), rgba(5,6,16,0.3))" }} />
        {options[Math.min(frame, options.length - 1)]()}
      </AbsoluteFill>
    </SurfaceTint.Provider>
  );
};
