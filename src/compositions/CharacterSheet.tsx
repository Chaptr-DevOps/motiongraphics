// Character sheet: the NightShift character in the poses the scripts need. A still for approval.
import { AbsoluteFill } from "remotion";
import { fonts, palettes } from "../brand/theme";
import { Character, HERO, charRig } from "../components/Character";
import type { Look } from "../components/Character";
import { pose } from "../components/Person";
import type { Pose } from "../components/Person";
import { PaletteContext } from "../lib/animation";

export const SHEET = { width: 2400, height: 1350 };

const BED = "#232A4E";
const PILLOW = "#3A4374";
const BLANKET = "#2F3966";
const INK = HERO.ink;

const Panel: React.FC<{ x: number; y: number; label: string; children: React.ReactNode }> = ({ x, y, label, children }) => (
  <g>
    <rect x={x + 20} y={y + 20} width={760} height={635} rx={40} fill="url(#spot)" />
    {children}
    <text x={x + 400} y={y + 630} textAnchor="middle" fill={palettes.night.muted} style={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: 28, letterSpacing: "0.08em" }}>
      {label.toUpperCase()}
    </text>
  </g>
);

/** Character lying in bed: base, pillow under the head, body, blanket with an ink outline, near arm on top. */
const InBed: React.FC<{ p: Pose; s?: number; bedX: number; bedEnd: number; armOver?: boolean }> = ({ p, s = 1, bedX, bedEnd, armOver = true }) => {
  const r = charRig(p, s);
  const bedY = p.y + 44 * s;
  const blanketX = p.x - 96 * s;
  return (
    <g strokeLinejoin="round">
      <rect x={bedX} y={bedY} width={bedEnd - bedX} height={96 * s} rx={30 * s} fill={BED} stroke={INK} strokeWidth={4} />
      <rect x={r.head[0] - 92 * s} y={bedY - 34 * s} width={170 * s} height={52 * s} rx={26 * s} fill={PILLOW} stroke={INK} strokeWidth={4} />
      <Character p={p} s={s} parts={armOver ? "body" : "all"} />
      <rect x={blanketX} y={p.y - 52 * s} width={bedEnd - 10 - blanketX} height={110 * s} rx={40 * s} fill={BLANKET} stroke={INK} strokeWidth={4} />
      {armOver ? <Character p={p} s={s} parts="nearArm" /> : null}
    </g>
  );
};

const lying = (x: number, y: number, extra: Partial<Pose> = {}) =>
  pose({ x, y, lean: 90, head: -4, armL: [6, 4], armR: [4, 2], legL: [2, 0], legR: [-2, 2], eyes: 1, ...extra });

const crowdLooks: Look[] = [
  HERO,
  { ...HERO, hair: "#4A3326", pajamas: "#6C7BD1", pajamasShade: "#5765B4", slippers: "#6C7BD1" },
  { ...HERO, hair: "#C9A25B", pajamas: "#B57A9A", pajamasShade: "#9A6383", slippers: "#B57A9A" },
  { ...HERO, hair: "#26232B", pajamas: "#4E8FBF", pajamasShade: "#3F77A2", slippers: "#4E8FBF" },
  { ...HERO, hair: "#7A4B32", pajamas: "#8C8FA8", pajamasShade: "#73768F", slippers: "#8C8FA8" },
  { ...HERO, hair: "#1B1A1F", pajamas: "#C77B5B", pajamasShade: "#AA6448", slippers: "#C77B5B" },
];

export const CharacterSheet: React.FC = () => {
  const standing = pose({ x: 400, y: 340, armL: [6, -4], armR: [-6, 6], legL: [2, -1], legR: [-2, 1] });
  const sitting = pose({ x: 1110, y: 440, lean: -6, head: -22, legL: [96, -92], legR: [90, -86], armL: [30, 84], armR: [22, 88] });
  const sr = charRig(sitting, 1);
  const phone = sr.armR[2];
  return (
    <PaletteContext.Provider value={palettes.night}>
      <AbsoluteFill style={{ backgroundColor: palettes.night.ground }}>
        <svg width={SHEET.width} height={SHEET.height} viewBox={`0 0 ${SHEET.width} ${SHEET.height}`}>
          <defs>
            <radialGradient id="spot" cx="50%" cy="55%" r="60%">
              <stop offset="0" stopColor="#1F2750" />
              <stop offset="1" stopColor={palettes.night.ground} />
            </radialGradient>
          </defs>

          <Panel x={0} y={0} label="Standing · 3/4">
            <Character p={standing} />
          </Panel>

          <Panel x={800} y={0} label="Sitting · checking phone">
            <rect x={850} y={470} width={360} height={90} rx={30} fill={BED} stroke={INK} strokeWidth={4} />
            <Character p={sitting} parts="body" />
            <g transform={`translate(${phone[0] + 6} ${phone[1] - 26}) rotate(-38)`}>
              <rect x={-30} y={-56} width={60} height={108} rx={16} fill="#2A3158" stroke={INK} strokeWidth={4} />
              <rect x={-22} y={-46} width={44} height={88} rx={10} fill="#F3EEE6" opacity={0.22} />
            </g>
            <Character p={sitting} parts="nearArm" />
          </Panel>

          <Panel x={1600} y={0} label="In bed · checking watch">
            <InBed p={lying(2090, 420, { armR: [96, 84], head: 6 })} bedX={1660} bedEnd={2350} />
          </Panel>

          <Panel x={0} y={675} label="Asleep">
            <InBed p={lying(490, 1095, { eyes: 0, head: -8 })} bedX={60} bedEnd={750} />
          </Panel>

          <Panel x={800} y={675} label="Waking · stretch">
            <InBed p={lying(1290, 1095, { armR: [138, 14], armL: [146, 4] })} bedX={860} bedEnd={1550} />
          </Panel>

          <Panel x={1600} y={675} label="Crowd">
            {crowdLooks.map((look, i) => (
              <Character
                key={i}
                look={look}
                s={0.58}
                p={pose({ x: 1700 + i * 120, y: 675 + 390, armL: [6, -4], armR: [-6, 6], legL: [2, -1], legR: [-2, 1] })}
              />
            ))}
          </Panel>
        </svg>
      </AbsoluteFill>
    </PaletteContext.Provider>
  );
};
