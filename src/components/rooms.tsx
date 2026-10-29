// Room illustrations for scripts about places: couch, bed, a floor plan of the flat. No people, only the traces they leave
// (a dented cushion, a slipping blanket, twisted sheets). Thin ink strokes, fills mixed from the photo tint like objects.tsx.
import { useId } from "react";
import { fonts } from "../brand/theme";
import { Clock, Glyph, LINE, useSurface } from "./objects";
import type { GlyphKind } from "./objects";
import { P } from "./premium";

const INKS = "rgba(243,238,230,0.72)";
const SOFT = "rgba(243,238,230,0.32)";
const stroke = { stroke: INKS, strokeWidth: LINE, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const fold = { fill: "none", stroke: SOFT, strokeWidth: 2.5, strokeLinecap: "round" as const };

/** A glass card holding a scene, with a room label and a status chip. */
export const SceneCard: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  status?: string;
  statusIcon?: GlyphKind;
  dark?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ x, y, w, h, label, status, statusIcon = "bolt", dark = 0, children, style }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      boxSizing: "border-box",
      borderRadius: 40,
      overflow: "hidden",
      border: `${LINE}px solid rgba(243,238,230,0.24)`,
      background: `linear-gradient(170deg, rgba(255,255,255,${0.07 - 0.05 * dark}), rgba(5,6,16,${0.1 + 0.45 * dark}))`,
      boxShadow: "0 30px 80px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
      fontFamily: fonts.sans,
      color: P.ink,
      ...style,
    }}
  >
    {children}
    <div
      style={{
        position: "absolute",
        left: 34,
        top: 28,
        fontSize: 22,
        fontWeight: 500,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: P.dim,
      }}
    >
      {label}
    </div>
    {status ? (
      <div
        style={{
          position: "absolute",
          right: 26,
          top: 20,
          height: 52,
          padding: "0 22px 0 16px",
          borderRadius: 26,
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 26,
          fontWeight: 600,
          border: `${LINE}px solid rgba(243,238,230,0.4)`,
          background: "rgba(11,12,20,0.45)",
        }}
      >
        <Glyph kind={statusIcon} size={28} />
        {status}
      </div>
    ) : null}
  </div>
);

/** Side view of a couch under a warm lamp: the left cushion dented, a blanket slipping off onto the floor. 720 × 400. */
export const CouchScene: React.FC<{ w: number; lamp?: number }> = ({ w, lamp = 1 }) => {
  const s = useSurface();
  return (
    <svg width={w} height={(w * 400) / 720} viewBox="0 0 720 400" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <radialGradient id="couchLamp" cx="0.5" cy="0" r="1">
          <stop offset="0" stopColor="#F3EEE6" stopOpacity={0.22 * lamp} />
          <stop offset="1" stopColor="#F3EEE6" stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* Lamp light pooling over the couch. */}
      <path d="M 610 128 L 330 372 L 720 372 L 668 128 Z" fill="url(#couchLamp)" />
      <line x1={30} y1={372} x2={700} y2={372} stroke={SOFT} strokeWidth={2} strokeLinecap="round" />
      {/* Floor lamp. */}
      <line x1={640} y1={128} x2={640} y2={366} {...stroke} />
      <path d="M 620 366 H 662" {...stroke} />
      <path d="M 604 128 L 618 70 H 662 L 676 128 Z" fill={s(0.3 * lamp + 0.1, 0.1)} {...stroke} />
      {/* Couch: back, arms, seat, base. */}
      <rect x={92} y={150} width={460} height={130} rx={44} fill={s(0.06, 0.3)} {...stroke} />
      <rect x={62} y={196} width={74} height={140} rx={34} fill={s(0.08, 0.28)} {...stroke} />
      <rect x={508} y={196} width={74} height={140} rx={34} fill={s(0.08, 0.28)} {...stroke} />
      <rect x={124} y={290} width={396} height={46} rx={18} fill={s(0.04, 0.34)} {...stroke} />
      {/* Seat cushions; the left one dented where someone was. */}
      <path d="M 136 300 V 262 Q 136 240 158 240 Q 230 262 318 240 Q 324 240 324 262 V 300 Z" fill={s(0.1, 0.26)} {...stroke} />
      <path d="M 324 300 V 262 Q 324 240 346 240 H 488 Q 508 240 508 262 V 300 Z" fill={s(0.1, 0.26)} {...stroke} />
      <path d="M 170 254 Q 230 274 296 254" {...fold} />
      {/* A cushion slumped against the left arm. */}
      <path d="M 120 252 Q 112 196 150 176 Q 196 166 214 196 Q 226 236 196 252 Q 156 266 120 252 Z" fill={s(0.16, 0.22)} {...stroke} transform="rotate(-14 168 214)" />
      {/* Blanket: over the right cushion, down the front, pooling on the floor. */}
      <path
        d="M 352 246 Q 420 232 470 244 Q 500 250 506 276 Q 512 320 540 344 Q 566 366 520 372 L 392 372 Q 360 370 372 346 Q 386 320 372 300 Q 356 276 352 246 Z"
        fill={s(0.2, 0.18)}
        {...stroke}
      />
      <path d="M 404 252 Q 420 300 410 370" {...fold} />
      <path d="M 452 250 Q 474 300 470 372" {...fold} />
      <path d="M 498 300 Q 520 340 548 356" {...fold} />
      {/* Legs. */}
      <path d="M 150 336 V 362 M 494 336 V 362" {...stroke} />
    </svg>
  );
};

/** Side view of a bed in a dark room: twisted duvet, pillow knocked crooked, a corner hanging off. 720 × 420. */
export const BedScene: React.FC<{ w: number; awake?: number; calm?: boolean }> = ({ w, awake = 1, calm }) => {
  const s = useSurface();
  return (
    <svg width={w} height={(w * 420) / 720} viewBox="0 0 720 420" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <radialGradient id="bedMoon" cx="0.5" cy="0" r="1">
          <stop offset="0" stopColor="#F3EEE6" stopOpacity={0.13} />
          <stop offset="1" stopColor="#F3EEE6" stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* Window with moonlight falling across the bed. */}
      <rect x={430} y={20} width={180} height={140} rx={18} fill={s(0.05, 0.4)} stroke={SOFT} strokeWidth={LINE} />
      <path d="M 520 20 V 160 M 430 90 H 610" stroke={SOFT} strokeWidth={2} />
      <path d="M 430 160 L 300 396 H 700 L 610 160 Z" fill="url(#bedMoon)" />
      <line x1={20} y1={396} x2={700} y2={396} stroke={SOFT} strokeWidth={2} strokeLinecap="round" />
      {/* Headboard, mattress, base, legs. */}
      <rect x={40} y={140} width={56} height={232} rx={26} fill={s(0.06, 0.32)} {...stroke} />
      <rect x={96} y={284} width={590} height={56} rx={22} fill={s(0.08, 0.3)} {...stroke} />
      <path d="M 130 340 V 376 M 650 340 V 376" {...stroke} />
      {calm ? (
        <>
          {/* Smoothed: pillow straight, duvet flat and heavy. */}
          <rect x={114} y={234} width={168} height={54} rx={26} fill={s(0.18, 0.2)} {...stroke} />
          <path d="M 250 288 Q 252 262 290 260 H 672 Q 692 262 690 290 V 318 Q 690 336 672 336 H 266 Q 250 336 250 318 Z" fill={s(0.14, 0.24)} {...stroke} />
          <path d="M 300 262 Q 304 274 300 286" {...fold} />
        </>
      ) : (
        <>
          {/* Pillow knocked crooked. */}
          <rect x={116} y={222} width={168} height={54} rx={26} fill={s(0.18, 0.2)} {...stroke} transform="rotate(-11 200 249)" />
          <path d="M 150 238 Q 196 254 240 228" {...fold} transform="rotate(-11 200 249)" />
          {/* Duvet: twisted into a ridge, one corner hanging off the end. */}
          <path
            d="M 236 290 Q 240 258 282 252 Q 330 246 356 214 Q 388 178 424 206 Q 452 230 494 216 Q 548 196 578 232 Q 606 262 650 260 Q 688 262 694 300 Q 700 352 676 380 Q 660 394 650 372 Q 640 340 610 336 L 280 336 Q 240 334 236 310 Z"
            fill={s(0.14, 0.24)}
            {...stroke}
          />
          <path d="M 300 268 Q 350 278 384 236" {...fold} />
          <path d="M 392 222 Q 420 262 470 252" {...fold} />
          <path d="M 470 290 Q 520 242 572 248" {...fold} />
          <path d="M 340 320 Q 420 300 470 316 Q 520 330 590 304" {...fold} />
          <path d="M 664 300 Q 676 336 664 366" {...fold} />
          {/* Awake: small lines radiating from the pillow. */}
          <g opacity={awake} stroke={P.ink} strokeWidth={LINE} strokeLinecap="round">
            <path d="M 196 196 L 190 166" />
            <path d="M 236 202 L 254 176" />
            <path d="M 156 206 L 132 186" />
          </g>
        </>
      )}
    </svg>
  );
};

export type Spot = "bed" | "couch" | "kitchen" | "chair" | "fridge" | "door";
export const SPOTS: Record<Spot, [number, number]> = {
  bed: [560, 240],
  couch: [230, 750],
  kitchen: [190, 200],
  chair: [610, 650],
  fridge: [300, 170],
  door: [440, 360],
};
/** A label pinned near a spot; `dx, dy` (plan units) move it off the furniture. Centred on the point. */
export type PlanTag = { at: Spot | [number, number]; text: string; icon?: GlyphKind; dx?: number; dy?: number; amber?: boolean; opacity?: number; scale?: number };

/** Close-up framings (plan units) for each room; the camera moves between them. */
export const VIEWS = {
  bedroom: { x: 374, y: 4, w: 342, h: 452 },
  kitchen: { x: 4, y: 4, w: 380, h: 452 },
  living: { x: 4, y: 446, w: 712, h: 410 },
  couch: { x: 20, y: 470, w: 420, h: 384 },
  chair: { x: 396, y: 446, w: 320, h: 410 },
  all: { x: 0, y: 0, w: 720, h: 860 },
};
export type View = { x: number; y: number; w: number; h: number };

// Room outlines in plan units (720 × 860), for the tiles variant.
const ROOMS = {
  kitchen: { x: 10, y: 10, w: 370, h: 440, dx: -18, dy: -18 },
  bedroom: { x: 380, y: 10, w: 330, h: 440, dx: 18, dy: -18 },
  living: { x: 10, y: 450, w: 700, h: 400, dx: 0, dy: 18 },
};
// Angled view: rotate 25° and squash vertically, like an architect's model.
const ISO = { a: 0.906, b: 0.262, c: -0.4226, d: 0.562 };
const ISO_BOX = { x: -380, y: -50, w: 1045, h: 735 };
const WALL_H = 34;

const pt = (at: Spot | [number, number]): [number, number] => (typeof at === "string" ? SPOTS[at] : at);

/**
 * Top-down plan of a small flat: kitchen, bedroom, living room with couch and a dim armchair. 720 × 860 plan units.
 * No people: a glow marks where you are and how alert you feel (`heat` 0..1+), and `rings` stack up like tree rings,
 * one per night the bed "learned" it. `view` frames one room (VIEWS); interpolate it to move the camera.
 * Props: `fridge` 0..1 opens the fridge and spills its light; `lamp` lights the dim lamp by the armchair; `book` 0..1 drops
 * a dull book on the side table; `route` is a dotted path (plan units) that `routeDraw` 0..1 draws on; `ghost` leaves a
 * dashed ring where you were; `pulse` 0..1 sends one alarm ring out from the glow; `ringsAt` pins the rings to a spot.
 * `variant` "tiles" / "iso" were explored for the style pick; the video uses the plain plan.
 */
export const FloorPlan: React.FC<{
  w: number;
  glow?: Spot | [number, number] | null;
  heat?: number;
  rings?: number;
  path?: boolean;
  route?: string;
  routeDraw?: number;
  routeOpacity?: number;
  ghost?: Spot | [number, number];
  ghostOpacity?: number;
  pulse?: number;
  ringsAt?: Spot | [number, number];
  fridge?: number;
  lamp?: number;
  book?: number;
  variant?: "plan" | "tiles" | "iso";
  view?: View;
  tags?: PlanTag[];
  tagSize?: number;
}> = ({ w, glow = "bed", heat = 1, rings = 0, path, route, routeDraw = 1, routeOpacity = 1, ghost, ghostOpacity = 1, pulse, ringsAt, fridge = 0, lamp = 0, book = 0, variant = "plan", view, tags = [], tagSize = 28 }) => {
  const s = useSurface();
  const iso = variant === "iso";
  const tiles = variant === "tiles";
  const box = iso ? ISO_BOX : view ?? VIEWS.all;
  const k = w / box.w;
  const h = box.h * k;
  const project = ([x, y]: [number, number]): [number, number] =>
    iso ? [(ISO.a * x + ISO.c * y - box.x) * k, (ISO.b * x + ISO.d * y - box.y) * k] : [(x - box.x) * k, (y - box.y) * k];
  const wall = { fill: "none", stroke: "rgba(243,238,230,0.8)", strokeWidth: 7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const label = { fill: "rgba(243,238,230,0.45)", fontFamily: fonts.sans, fontSize: 20, fontWeight: 500, letterSpacing: "0.12em" };
  const G = glow ? pt(glow) : null;
  const room = (r: keyof typeof ROOMS, children: React.ReactNode) =>
    tiles ? <g transform={`translate(${ROOMS[r].dx} ${ROOMS[r].dy})`}>{children}</g> : children;
  const walls = (
    <>
      <path d="M 44 10 H 676 Q 710 10 710 44 V 816 Q 710 850 676 850 H 44 Q 10 850 10 816 V 44 Q 10 10 44 10 Z" {...wall} />
      <path d="M 380 10 V 330 M 380 410 V 450 M 10 450 H 150 M 250 450 H 470 M 590 450 H 710" {...wall} />
    </>
  );
  const isoM = `matrix(${ISO.a} ${ISO.b} ${ISO.c} ${ISO.d} 0 0)`;
  const routeD = route ?? (path ? "M 230 700 C 260 560, 400 520, 430 420 C 450 340, 480 300, 530 270" : undefined);
  const floor = (
    <>
      {tiles ? (
        (Object.keys(ROOMS) as Array<keyof typeof ROOMS>).map((r) => {
          const o = ROOMS[r];
          return <rect key={r} x={o.x + o.dx + 8} y={o.y + o.dy + 8} width={o.w - 16} height={o.h - 16} rx={30} fill={s(0.05, 0.35, 0.75)} stroke="rgba(243,238,230,0.55)" strokeWidth={LINE} />;
        })
      ) : (
        <rect x={10} y={10} width={700} height={840} rx={34} fill={s(0.03, 0.4, 0.6)} />
      )}
      {iso ? <g opacity={0.35}>{walls}</g> : tiles ? null : walls}
      {room(
        "kitchen",
        <>
          {/* Fridge light spilling across the floor. */}
          <path d="M 282 100 L 200 300 L 420 300 L 360 100 Z" fill="url(#fridgeLight)" opacity={fridge} />
          <path d="M 30 30 H 360 V 100 H 100 V 300 H 30 Z" fill={s(0.07, 0.3)} {...stroke} />
          {[0, 1].map((i) => [0, 1].map((j) => <circle key={`${i}${j}`} cx={180 + i * 44} cy={50 + j * 32} r={12} fill="none" stroke={SOFT} strokeWidth={2.5} />))}
          <rect x={42} y={150} width={46} height={80} rx={14} fill="none" stroke={SOFT} strokeWidth={2.5} />
          <rect x={282} y={30} width={78} height={70} rx={10} fill={s(0.14 + 0.25 * fridge, 0.22)} {...stroke} />
          {/* Fridge door swinging open. */}
          <path d={`M 360 100 L ${360 - 78 * Math.cos(fridge * 1.3)} ${100 + 78 * Math.sin(fridge * 1.3)}`} {...stroke} opacity={fridge > 0.01 ? 1 : 0} />
          <text x={130} y={420} {...label}>KITCHEN</text>
        </>,
      )}
      {room(
        "bedroom",
        <>
          <rect x={470} y={60} width={180} height={330} rx={20} fill={s(0.08, 0.28)} {...stroke} />
          <rect x={486} y={74} width={70} height={46} rx={16} fill={s(0.18, 0.2)} {...stroke} transform="rotate(-8 521 97)" />
          <rect x={566} y={74} width={70} height={46} rx={16} fill={s(0.18, 0.2)} {...stroke} />
          <path d="M 470 150 Q 520 170 560 140 Q 600 116 650 160 V 370 Q 650 390 630 390 H 490 Q 470 390 470 370 Z" fill={s(0.14, 0.24)} {...stroke} />
          <path d="M 500 200 Q 560 240 540 300 M 590 180 Q 610 260 630 300" {...fold} />
          <rect x={410} y={60} width={46} height={46} rx={10} fill="none" stroke={SOFT} strokeWidth={2.5} />
          <rect x={664} y={60} width={34} height={46} rx={10} fill="none" stroke={SOFT} strokeWidth={2.5} />
          <path d="M 400 330 A 80 80 0 0 1 380 410" fill="none" stroke={SOFT} strokeWidth={2} strokeDasharray="0.1 8" strokeLinecap="round" />
          <text x={470} y={420} {...label}>BEDROOM</text>
        </>,
      )}
      {room(
        "living",
        <>
          {/* The dim lamp by the armchair. */}
          <circle cx={670} cy={560} r={170} fill="url(#lampLight)" opacity={lamp} />
          <ellipse cx={300} cy={650} rx={200} ry={110} fill="none" stroke="rgba(243,238,230,0.12)" strokeWidth={2.5} strokeDasharray="0.1 10" strokeLinecap="round" />
          <path d="M 60 820 V 720 Q 60 700 80 700 H 108 V 790 H 352 V 700 H 380 Q 400 700 400 720 V 820 Z" fill={s(0.08, 0.28)} {...stroke} />
          <path d="M 108 790 V 712 H 352 V 790" fill={s(0.12, 0.25)} {...stroke} />
          <path d="M 230 712 V 790" stroke={SOFT} strokeWidth={2.5} />
          <path d="M 250 718 Q 300 740 330 726 L 344 786 L 262 786 Z" fill={s(0.2, 0.18)} stroke={SOFT} strokeWidth={2.5} strokeLinejoin="round" />
          <rect x={180} y={560} width={180} height={64} rx={20} fill="none" {...stroke} />
          <rect x={560} y={600} width={100} height={100} rx={30} fill={s(0.08, 0.3)} {...stroke} />
          <rect x={578} y={618} width={64} height={56} rx={18} fill={s(0.12, 0.25)} stroke={SOFT} strokeWidth={2.5} />
          <circle cx={670} cy={560} r={20} fill={lamp > 0.3 ? s(0.3, 0.1) : "none"} stroke={SOFT} strokeWidth={2.5} />
          {/* Side table, and the dull book on it. */}
          <rect x={490} y={620} width={52} height={64} rx={12} fill="none" stroke={SOFT} strokeWidth={2.5} />
          {book > 0 ? (
            <rect x={498} y={630} width={36} height={44} rx={4} fill={s(0.22, 0.16)} {...stroke} strokeWidth={2.5} opacity={Math.min(1, book * 2)} transform={`rotate(${-8 - 20 * (1 - book)} 516 652) translate(516 652) scale(${0.6 + 0.4 * book}) translate(-516 -652)`} />
          ) : null}
          <text x={36} y={490} {...label}>LIVING ROOM</text>
        </>,
      )}
      {routeD && routeOpacity > 0 ? (
        <>
          {/* Dotted route, drawn on through a mask that grows along the path. */}
          <mask id="routeMask" maskUnits="userSpaceOnUse" x={-200} y={-200} width={1200} height={1300}>
            <path d={routeD} pathLength={1} fill="none" stroke="#fff" strokeWidth={30} strokeLinecap="round" strokeDasharray={`${routeDraw} 2`} />
          </mask>
          <path d={routeD} fill="none" stroke={P.dim} strokeWidth={LINE} strokeLinecap="round" strokeDasharray="0.1 14" mask="url(#routeMask)" opacity={routeOpacity} />
        </>
      ) : null}
      {ghost ? <circle cx={pt(ghost)[0]} cy={pt(ghost)[1]} r={56} fill="none" stroke="rgba(243,238,230,0.3)" strokeWidth={LINE} strokeDasharray="0.1 12" strokeLinecap="round" opacity={ghostOpacity} /> : null}
      {/* Where you are, and how alert you feel. Each night the bed learned it leaves a ring. */}
      {G ? (
        <>
          <circle cx={G[0]} cy={G[1]} r={110 + 60 * heat} fill="url(#planGlow)" opacity={Math.min(1, 0.35 + 0.65 * heat)} />
          {pulse !== undefined ? (
            <circle cx={G[0]} cy={G[1]} r={40 + 150 * pulse} fill="none" stroke="#F3EEE6" strokeWidth={LINE} opacity={0.45 * (1 - pulse) * Math.min(1, heat)} />
          ) : null}
          {Array.from({ length: Math.ceil(rings) }, (_, i) => (
            <circle key={i} cx={pt(ringsAt ?? G)[0]} cy={pt(ringsAt ?? G)[1]} r={68 + i * 14} fill="none" stroke={`rgba(243,238,230,${0.32 - i * 0.022})`} strokeWidth={2} opacity={Math.min(1, rings - i)} />
          ))}
          <circle cx={G[0]} cy={G[1]} r={36 + 20 * heat} fill="none" stroke="rgba(243,238,230,0.55)" strokeWidth={LINE} />
          {rings ? null : <circle cx={G[0]} cy={G[1]} r={60 + 32 * heat} fill="none" stroke="rgba(243,238,230,0.25)" strokeWidth={2} />}
          <circle cx={G[0]} cy={G[1]} r={16} fill={P.ink} />
        </>
      ) : null}
    </>
  );
  return (
    <div style={{ position: "relative", width: w, height: h }}>
      {/* A close-up sits in a rounded map window, so cropped walls read as framing, not as unfinished edges. */}
      {view ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 40,
            border: `${LINE}px solid rgba(243,238,230,0.22)`,
            background: "linear-gradient(170deg, rgba(255,255,255,0.05), rgba(5,6,16,0.35))",
            boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
          }}
        />
      ) : null}
      <svg width={w} height={h} viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`} style={{ position: "relative", display: "block", overflow: view ? "hidden" : "visible", borderRadius: view ? 40 : undefined }}>
        <defs>
          <radialGradient id="planGlow">
            <stop offset="0" stopColor="#F3EEE6" stopOpacity={0.45} />
            <stop offset="1" stopColor="#F3EEE6" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="fridgeLight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F3EEE6" stopOpacity={0.4} />
            <stop offset="1" stopColor="#F3EEE6" stopOpacity={0} />
          </linearGradient>
          <radialGradient id="lampLight">
            <stop offset="0" stopColor="#F3EEE6" stopOpacity={0.18} />
            <stop offset="1" stopColor="#F3EEE6" stopOpacity={0} />
          </radialGradient>
        </defs>
        {iso ? (
          <>
            <g transform={isoM}>{floor}</g>
            {/* Raised walls: the wall plan again, lifted. */}
            <g transform={`translate(0 ${-WALL_H}) ${isoM}`}>{walls}</g>
          </>
        ) : (
          floor
        )}
      </svg>
      {tags.map((t) => {
        const [sx, sy] = pt(t.at);
        const [x, y] = project([sx + (t.dx ?? 0), sy + (t.dy ?? 0)]);
        const c = t.amber ? P.amber : P.ink;
        return (
          <div key={t.text} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${t.scale ?? 1})`, opacity: t.opacity ?? 1 }}>
            <div
              style={{
                height: tagSize * 2,
                padding: `0 ${tagSize * 0.85}px 0 ${tagSize * 0.65}px`,
                borderRadius: tagSize,
                display: "flex",
                alignItems: "center",
                gap: tagSize * 0.36,
                fontFamily: fonts.sans,
                fontSize: tagSize,
                fontWeight: 600,
                color: c,
                whiteSpace: "nowrap",
                border: `${LINE}px solid ${t.amber ? P.amber : "rgba(243,238,230,0.5)"}`,
                background: t.amber ? "rgba(40,24,10,0.75)" : "rgba(11,12,20,0.6)",
                boxShadow: "0 14px 30px rgba(0,0,0,0.4)",
              }}
            >
              <Glyph kind={t.icon ?? "bolt"} size={tagSize * 1.07} color={c} />
              {t.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Rooms that morph into each other (user, Oct 15): each room is its own small scene in one rounded window, drawn from
// seven soft pieces. Piece i of one room morphs into piece i of the next (couch base → bed frame → kitchen counter …),
// so the video flows from room to room instead of panning across one flat. Few lines: no labels, walls, folds or dots.

export type RoomKey = "couch" | "bed" | "kitchen" | "chair" | "fridge";
/** A rounded piece of furniture in window units (640 × 760). `fill` lifts toward ink; `o` hides it. */
type Piece = { x: number; y: number; w: number; h: number; r: number; fill: number; rot?: number; o?: number; line?: number };
const pc = (x: number, y: number, w: number, h: number, r: number, fill: number, rot = 0, o = 1): Piece => ({ x, y, w, h, r, fill, rot, o });
const HIDE = (x: number, y: number) => pc(x, y, 0, 0, 0, 0.1, 0, 0);

export const ROOM_W = 640;
export const ROOM_H = 760;

/** Seven pieces per room, in draw order (0 is the bottom layer); `glow` is where you are in that room. */
export const ROOMS_MORPH: Record<RoomKey, { pieces: Piece[]; glow: [number, number] }> = {
  couch: {
    pieces: [
      pc(210, 230, 220, 110, 26, 0.03), // coffee table
      pc(100, 560, 440, 80, 30, 0.06), // couch back
      pc(156, 452, 164, 116, 22, 0.12), // left seat cushion
      pc(324, 452, 160, 116, 22, 0.12), // right seat cushion
      pc(100, 440, 56, 200, 28, 0.08), // arm rest
      pc(484, 440, 56, 200, 28, 0.08), // arm rest
      pc(258, 448, 236, 128, 44, 0.24, 3), // blanket
    ],
    glow: [182, 512],
  },
  bed: {
    pieces: [
      pc(70, 120, 80, 80, 20, 0.05), // nightstand
      pc(170, 110, 300, 540, 28, 0.06), // bed
      pc(170, 250, 300, 400, 28, 0.14), // duvet
      pc(324, 132, 124, 80, 28, 0.2), // pillow
      pc(192, 132, 124, 80, 28, 0.2, -8), // pillow, knocked crooked
      pc(404, 562, 110, 104, 26, 0.14, 16), // duvet corner hanging off
      pc(490, 120, 80, 80, 20, 0.05), // nightstand
    ],
    glow: [254, 170],
  },
  kitchen: {
    pieces: [
      pc(220, 580, 70, 70, 35, 0.1), // stool
      pc(50, 60, 540, 110, 22, 0.07), // counter
      pc(170, 370, 300, 150, 28, 0.07), // island
      pc(320, 80, 110, 70, 22, 0.03), // sink
      pc(130, 80, 150, 70, 18, 0.03), // hob
      pc(350, 580, 70, 70, 35, 0.1), // stool
      pc(470, 50, 120, 160, 18, 0.14), // fridge
    ],
    glow: [480, 300],
  },
  chair: {
    pieces: [
      HIDE(340, 447),
      pc(220, 330, 240, 230, 64, 0.07), // armchair
      pc(262, 372, 156, 150, 44, 0.12), // seat cushion
      HIDE(340, 447),
      HIDE(340, 447),
      HIDE(340, 447),
      pc(80, 400, 110, 110, 28, 0.05), // side table
    ],
    glow: [340, 420],
  },
  // Just the fridge, between two stretches of counter; the door and its light are drawn by RoomMorph.
  fridge: {
    pieces: [
      HIDE(320, 400),
      pc(200, 110, 240, 190, 22, 0.14), // fridge
      pc(40, 110, 150, 120, 18, 0.04), // counter
      pc(450, 110, 150, 120, 18, 0.04), // counter
      HIDE(320, 400),
      HIDE(320, 400),
      HIDE(320, 400),
    ],
    glow: [320, 500],
  },
};

/** The pieces that carry each room (drawn brighter); the rest stay quiet so there is one clear focal point. */
const HERO: Record<RoomKey, number[]> = { couch: [1, 2, 3, 4, 5, 6], bed: [1, 2, 3, 4, 5], kitchen: [6], chair: [1, 2], fridge: [1] };


/** A tag in window units, centred on (x, y). */
export type RoomTag = { x: number; y: number; text: string; icon?: GlyphKind; amber?: boolean; opacity?: number; scale?: number };

/**
 * One rounded window showing room `a` morphing into room `b` (`k` 0..1). `glow` (window units) and `heat` place "you".
 * `fridge` spills the fridge light, `lamp` lights the reading lamp, `book` drops a book on the side table; each only shows
 * while its room is on screen.
 */
export const RoomMorph: React.FC<{
  w: number;
  a: RoomKey;
  b?: RoomKey;
  k?: number;
  glow?: [number, number] | null;
  heat?: number;
  fridge?: number;
  lamp?: number;
  book?: number;
  /** 0..1: the glow swells to fill the window (the transition between rooms), then shrinks into the next room. */
  iris?: number;
  /** The right nightstand grows into a ticking clock: `p` 0..1, `minutes` sets the hands. */
  clock?: { p: number; minutes: number };
  /** Overall opacity of the furniture (the week grid dims nights that haven't happened yet). */
  dim?: number;
  /**
   * Room-to-room move (`k` 0..1): room `from` slides away by `dir` (window units) and fades while room `a` slides in from
   * the other side; you (the glow) are drawn once on top, so you can glide between them without a cut.
   */
  slide?: { from: RoomKey; k: number; dir: [number, number]; ks?: number[] };
  /** Per-piece morph progress for a → b (springs with a stagger); overrides `k` for the furniture. */
  ks?: number[];
  /** Where the glow sits when it trails behind the dot (window units). */
  halo?: [number, number];
  /** The dot stretches along its direction of travel: `angle` in degrees, `amount` 0..~0.4. */
  stretch?: { angle: number; amount: number };
  tags?: RoomTag[];
  tagSize?: number;
}> = ({ w, a, b = a, k = 0, glow, heat = 1, fridge = 0, lamp = 0, book = 0, iris = 0, clock, dim = 1, slide, ks, halo, stretch, tags = [], tagSize = 28 }) => {
  const s = useSurface();
  const z = w / ROOM_W;
  const G = glow ?? null;
  const radius = Math.max(18, 40 * z);
  /** Everything in room `ra` (morphing into `rb` by `kk`) except you: furniture, lights, door, lamp, book. */
  // `pks` gives each piece its own morph progress (springs with a stagger); `shift` slides pieces in or out one by one.
  type Shift = { dir: [number, number]; ks: number[]; k: number; out: boolean };
  const content = (ra: RoomKey, rb: RoomKey, kk: number, pks?: number[], shift?: Shift) => {
    const here = (r: RoomKey) => (ra === r ? 1 - kk : 0) + (rb === r ? kk : 0);
    const pieces = ROOMS_MORPH[ra].pieces.map((p, i) => {
      const ki = pks?.[i] ?? kk;
      const L = (u: number, v: number) => u + (v - u) * ki;
      const q = ROOMS_MORPH[rb].pieces[i];
      const lineOf = (r: RoomKey, x: Piece) => x.line ?? (HERO[r].includes(i) ? 0.62 : 0.28);
      const si = shift ? shift.ks[i] : 0;
      const off = shift ? (shift.out ? -si : 1 - si) : 0;
      const fade = shift ? Math.min(1, Math.max(0, shift.out ? 1 - si : si)) : 1;
      return {
        x: L(p.x, q.x) + (shift ? shift.dir[0] * off : 0),
        y: L(p.y, q.y) + (shift ? shift.dir[1] * off : 0),
        w: Math.max(0, L(p.w, q.w)),
        h: Math.max(0, L(p.h, q.h)),
        r: L(p.r, q.r),
        fill: L(p.fill, q.fill),
        rot: L(p.rot ?? 0, q.rot ?? 0),
        o: Math.min(1, Math.max(0, L(p.o ?? 1, q.o ?? 1))) * fade,
        line: L(lineOf(ra, p), lineOf(rb, q)),
      };
    });
    const door = fridge * here("fridge");
    // Lights, door, lamp and book travel with the room as a whole.
    const gk = shift ? Math.min(1, Math.max(0, shift.k)) : 0;
    const extras = shift
      ? { opacity: shift.out ? 1 - gk : gk, transform: `translate(${shift.dir[0] * (shift.out ? -shift.k : 1 - shift.k)} ${shift.dir[1] * (shift.out ? -shift.k : 1 - shift.k)})` }
      : {};
    return (
      <>
        <g {...extras}>
        {/* Fridge light spilling across the kitchen floor. */}
        <path d="M 470 210 L 360 560 L 640 560 L 590 210 Z" fill="url(#roomFridge)" opacity={fridge * here("kitchen")} />
        {/* The fridge's light falling out of its open door. */}
        <path d="M 200 318 L 90 760 L 550 760 L 440 318 Z" fill="url(#roomFridge)" opacity={door} />
        {/* The reading lamp's dim pool by the armchair. */}
        <circle cx={560} cy={260} r={260} fill="url(#roomLamp)" opacity={lamp * here("chair")} />
        </g>
        <g opacity={dim}>
        {pieces.map((p, i) =>
          p.o > 0.01 && p.w > 1 ? (
            <rect
              key={i}
              x={p.x}
              y={p.y}
              width={p.w}
              height={p.h}
              rx={Math.min(p.r, p.w / 2, p.h / 2)}
              fill={s(p.fill + (i === 6 ? 0.3 * fridge * here("kitchen") : 0), 0.28)}
              stroke={`rgba(243,238,230,${p.line})`}
              strokeWidth={LINE}
              opacity={p.o}
              transform={`rotate(${p.rot} ${p.x + p.w / 2} ${p.y + p.h / 2})`}
            />
          ) : null,
        )}
        </g>
        <g {...extras}>
        {/* Fridge door, hinged at the right front corner, swinging open toward you. */}
        <rect
          x={200}
          y={300}
          width={240}
          height={18}
          rx={9}
          fill={s(0.2, 0.2)}
          stroke="rgba(243,238,230,0.62)"
          strokeWidth={LINE}
          opacity={here("fridge")}
          transform={`rotate(${-95 * door} 440 309)`}
        />
        {/* Reading lamp and the dull book: only in the armchair corner. */}
        <circle cx={560} cy={260} r={34} fill={s(0.1 + 0.3 * lamp, 0.2)} stroke="rgba(243,238,230,0.6)" strokeWidth={LINE} opacity={here("chair")} />
        {book > 0 ? (
          <rect
            x={108}
            y={420}
            width={54}
            height={70}
            rx={6}
            fill={s(0.24, 0.16)}
            stroke="rgba(243,238,230,0.6)"
            strokeWidth={LINE}
            opacity={Math.min(1, book * 2) * here("chair")}
            transform={`rotate(${-10 - 20 * (1 - book)} 135 455) translate(135 455) scale(${0.6 + 0.4 * book}) translate(-135 -455)`}
          />
        ) : null}
        </g>
      </>
    );
  };
  return (
    <div style={{ position: "relative", width: w, height: ROOM_H * z }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          border: `${LINE}px solid rgba(243,238,230,0.22)`,
          background: "linear-gradient(170deg, rgba(255,255,255,0.05), rgba(5,6,16,0.35))",
          boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
        }}
      />
      <svg width={w} height={ROOM_H * z} viewBox={`0 0 ${ROOM_W} ${ROOM_H}`} style={{ position: "relative", display: "block", overflow: "hidden", borderRadius: radius }}>
        <defs>
          <radialGradient id="roomGlow">
            <stop offset="0" stopColor="#F3EEE6" stopOpacity={0.45} />
            <stop offset="1" stopColor="#F3EEE6" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="roomFridge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F3EEE6" stopOpacity={0.4} />
            <stop offset="1" stopColor="#F3EEE6" stopOpacity={0} />
          </linearGradient>
          <radialGradient id="roomIris">
            <stop offset="0" stopColor="#F3EEE6" stopOpacity={0.7} />
            <stop offset="0.45" stopColor="#F3EEE6" stopOpacity={0.3} />
            <stop offset="1" stopColor="#F3EEE6" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="roomLamp">
            <stop offset="0" stopColor="#F3EEE6" stopOpacity={0.22} />
            <stop offset="1" stopColor="#F3EEE6" stopOpacity={0} />
          </radialGradient>
        </defs>
        {slide ? (
          <>
            {content(slide.from, slide.from, 0, undefined, { dir: slide.dir, ks: slide.ks ?? Array(7).fill(slide.k), k: slide.k, out: true })}
            {content(a, b, k, ks, { dir: slide.dir, ks: slide.ks ?? Array(7).fill(slide.k), k: slide.k, out: false })}
          </>
        ) : (
          content(a, b, k, ks)
        )}
        {/* You: a soft glow and a dot. */}
        {G ? (
          <>
            <circle cx={(halo ?? G)[0]} cy={(halo ?? G)[1]} r={100 + 70 * heat} fill="url(#roomGlow)" opacity={Math.min(1, 0.35 + 0.65 * heat)} />
            <ellipse
              cx={G[0]}
              cy={G[1]}
              rx={27 * (1 + (stretch?.amount ?? 0))}
              ry={27 / (1 + (stretch?.amount ?? 0))}
              fill={P.ink}
              transform={`rotate(${stretch?.angle ?? 0} ${G[0]} ${G[1]})`}
            />
          </>
        ) : null}
        {/* The transition: the glow swells until it fills the window. */}
        {iris > 0 && G ? <circle cx={G[0]} cy={G[1]} r={60 + 780 * iris * iris} fill="url(#roomIris)" opacity={Math.min(1, iris * 1.4)} /> : null}
      </svg>
      {clock && clock.p > 0.001 ? (
        <div
          style={{
            position: "absolute",
            // Starts exactly over the nightstand (530, 160) and grows a little down and in, clear of the window edge.
            left: (530 - 10 * clock.p - (80 + 150 * clock.p) / 2) * z,
            top: (160 + 45 * clock.p - (80 + 150 * clock.p) / 2) * z,
            filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.5))",
          }}
        >
          <Clock size={(80 + 150 * clock.p) * z} minutes={clock.minutes} />
        </div>
      ) : null}
      {tags.map((t) => {
        const c = t.amber ? P.amber : P.ink;
        return (
          <div key={t.text} style={{ position: "absolute", left: t.x * z, top: t.y * z, transform: `translate(-50%, -50%) scale(${t.scale ?? 1})`, opacity: t.opacity ?? 1 }}>
            <div
              style={{
                height: tagSize * 2,
                padding: `0 ${tagSize * 0.85}px 0 ${tagSize * 0.65}px`,
                borderRadius: tagSize,
                display: "flex",
                alignItems: "center",
                gap: tagSize * 0.36,
                fontFamily: fonts.sans,
                fontSize: tagSize,
                fontWeight: 600,
                color: c,
                whiteSpace: "nowrap",
                border: `${LINE}px solid ${t.amber ? P.amber : "rgba(243,238,230,0.5)"}`,
                background: t.amber ? "rgba(40,24,10,0.75)" : "rgba(11,12,20,0.6)",
                boxShadow: "0 14px 30px rgba(0,0,0,0.4)",
              }}
            >
              <Glyph kind={t.icon ?? "bolt"} size={tagSize * 1.07} color={c} />
              {t.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// "Picture a place" (PictureAPlace, Oct 16): your mind as a bedroom seen from above. Sheep hop over the bed, worry
// notes slip in on top of everything, and a beach picture on the wall above the bed folds down and grows until the
// scene fills the whole room. Same window (640 × 760), piece style and dot as RoomMorph.

export type BeachFx = {
  /** 0..1 footprints press into the sand along `STEPS`, behind you. */
  steps?: number;
  /** 0..1 a wave washes up the sand and slides back (0 and 1 = at rest). */
  wave?: number;
  /** 0..1 salt spray drifts off the water. */
  salt?: number;
  /** 0..1 light glints on the water (the video's one amber moment). */
  light?: number;
  /** A worry note drifting onto the sand (`p` 0..1), then carried off by the water (`out` 0..1). */
  drift?: { p: number; out?: number; text: string };
  /** Moves the wave lines along (frames or any running value). */
  phase?: number;
};

/** Spots in window units. */
export const DREAM = {
  pillow: [266, 174] as [number, number],
  sand: [300, 330] as [number, number],
  shore: [220, 478] as [number, number],
  /** The beach picture on the top wall above the bed, folded down over it (flat against the wall it is a thin line). */
  card: { x: 220, y: 18, w: 200, h: 238 },
  /** The middle of the sheep on the right of the bed, where the glow goes for "a corner of your mind". */
  flock: [540, 360] as [number, number],
};
/** The footprint trail, from the top of the beach down to where you stand on the sand. */
const STEPS: Array<[number, number]> = [
  [150, 60],
  [175, 110],
  [195, 160],
  [225, 205],
  [250, 250],
  [272, 292],
];
const WORRIES: Array<{ text: string; x: number; y: number; rot: number; from: [number, number] }> = [
  { text: "Rent's due", x: 24, y: 236, rot: 5, from: [-240, 0] },
  { text: "Reply to Sam", x: 70, y: 410, rot: -4, from: [-300, 0] },
  { text: "Did I sound weird?", x: 40, y: 590, rot: -3, from: [0, 240] },
  { text: "Is my job safe?", x: 318, y: 676, rot: 4, from: [0, 200] },
];
const noteW = (t: string) => Math.round(t.length * 14.2 + 46);

/** A small paper note with a worry on it, in window units (top-left at 0, 0). */
const WorryNote: React.FC<{ text: string; lit?: number }> = ({ text, lit = 0 }) => {
  const s = useSurface();
  const w = noteW(text);
  return (
    <g>
      <rect x={4} y={10} width={w} height={58} rx={16} fill="rgba(0,0,0,0.3)" />
      <rect x={0} y={0} width={w} height={58} rx={16} fill={s(0.2 + 0.1 * lit, 0.2)} stroke={`rgba(243,238,230,${0.55 + 0.3 * lit})`} strokeWidth={LINE} />
      <text x={23} y={38} fontFamily={fonts.sans} fontWeight={600} fontSize={26} fill={P.ink} letterSpacing="-0.01em">
        {text}
      </text>
    </g>
  );
};

/** A sheep from above: a cloud of wool and a small dark head. `lie` 0..1 tips it over, done with it all. */
const Sheep: React.FC<{ x: number; y: number; scale?: number; lie?: number; o?: number }> = ({ x, y, scale = 1, lie = 0, o = 1 }) => {
  const s = useSurface();
  const wool = s(0.62, 0.1);
  const puffs: Array<[number, number, number]> = [
    [-14, -10, 16],
    [10, -12, 16],
    [-16, 10, 15],
    [8, 12, 16],
    [0, 0, 18],
  ];
  return (
    <g transform={`translate(${x} ${y}) rotate(${80 * lie}) scale(${scale})`} opacity={o}>
      <ellipse cx={3} cy={8} rx={34} ry={28} fill="rgba(0,0,0,0.28)" />
      {puffs.map(([px, py, r], i) => (
        <circle key={i} cx={px} cy={py} r={r} fill={wool} stroke="rgba(243,238,230,0.55)" strokeWidth={2} />
      ))}
      {puffs.map(([px, py, r], i) => (
        <circle key={`f${i}`} cx={px} cy={py} r={r - 1} fill={wool} />
      ))}
      <ellipse cx={32} cy={0} rx={12} ry={9.5} fill={s(0.05, 0.8)} stroke="rgba(243,238,230,0.5)" strokeWidth={2} />
    </g>
  );
};

/** The beach, top-down, drawn into a 640 × 760 box: sand above, the sea along the bottom with a foam edge. */
const Beach: React.FC<BeachFx & { id: string }> = ({ steps = 0, wave = 0, salt = 0, light = 0, drift, phase = 0, id }) => {
  const s = useSurface();
  const wash = Math.sin(Math.PI * Math.min(1, Math.max(0, wave))) * 120;
  const edge = (dy: number) =>
    `M 0 ${548 - dy} C 110 ${520 - dy}, 200 ${578 - dy}, 320 ${546 - dy} S 540 ${518 - dy}, 640 ${552 - dy}`;
  const sea = `${edge(wash)} L 640 760 L 0 760 Z`;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sea`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={s(0.06, 0.45)} />
          <stop offset="1" stopColor={s(0, 0.8)} />
        </linearGradient>
        <radialGradient id={`${id}sand`} cx="0.45" cy="0.35" r="0.8">
          <stop offset="0" stopColor={s(0.34, 0.05)} />
          <stop offset="1" stopColor={s(0.2, 0.18)} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={640} height={760} fill={`url(#${id}sand)`} />
      {/* Soft ripples in the sand. */}
      {[150, 250, 380].map((y, i) => (
        <path key={i} d={`M ${60 + i * 30} ${y} q 90 -16 180 0 t 180 0`} fill="none" stroke="rgba(243,238,230,0.12)" strokeWidth={2.5} strokeLinecap="round" />
      ))}
      {/* Wet sand the wave leaves behind. */}
      <path d={`${edge(wash * 1.15 + 14)} L 640 760 L 0 760 Z`} fill={s(0.05, 0.4, 0.5)} />
      <path d={sea} fill={`url(#${id}sea)`} />
      <path d={edge(wash)} fill="none" stroke="rgba(243,238,230,0.7)" strokeWidth={LINE} strokeLinecap="round" />
      {/* Wave lines out on the water, rolling in. */}
      {[0, 1, 2].map((i) => {
        const y = 760 - ((phase * 1.1 + i * 70) % 210);
        return (
          <path
            key={i}
            d={`M ${40 + i * 50} ${y} q 70 -14 140 0 t 140 0`}
            fill="none"
            stroke="rgba(243,238,230,0.3)"
            strokeWidth={2.5}
            strokeLinecap="round"
            opacity={Math.min(1, (760 - y) / 60) * Math.min(1, (y - 560) / 40)}
          />
        );
      })}
      {/* The light on the water: glints in a path across the sea (amber, once). */}
      {light > 0
        ? Array.from({ length: 11 }, (_, i) => {
            const y = 600 + i * 15;
            const flick = 0.55 + 0.45 * Math.sin(phase * 0.25 + i * 1.9);
            const w = 26 + ((i * 37) % 60);
            return (
              <rect key={i} x={430 - w / 2 + ((i * 23) % 40) - 20} y={y} width={w} height={6} rx={3} fill={P.amber} opacity={light * flick * (0.4 + i * 0.05)} />
            );
          })
        : null}
      {/* Salt spray drifting up off the water. */}
      {salt > 0
        ? Array.from({ length: 16 }, (_, i) => {
            const t = ((phase * 0.6 + i * 23) % 120) / 120;
            const x = 40 + ((i * 97) % 560) + 40 * t;
            const y = 560 - 260 * t * salt - (i % 3) * 20;
            return <circle key={i} cx={x} cy={y} r={3 + (i % 3)} fill={P.ink} opacity={salt * 0.55 * Math.sin(Math.PI * t)} />;
          })
        : null}
      {/* Footprints, pressed in one after another behind you. */}
      {STEPS.map(([x, y], i) => {
        const k = Math.min(1, Math.max(0, steps * STEPS.length - i));
        const side = i % 2 ? 12 : -12;
        return (
          <ellipse
            key={i}
            cx={x + side}
            cy={y}
            rx={9}
            ry={15}
            fill={s(0.02, 0.5, 0.75)}
            opacity={k}
            transform={`rotate(-30 ${x + side} ${y})`}
          />
        );
      })}
      {drift ? (
        <g
          transform={`translate(${640 - 300 * drift.p + 60 * (drift.out ?? 0)} ${170 + 380 * (drift.out ?? 0)}) rotate(${8 - 12 * drift.p + 20 * (drift.out ?? 0)})`}
          opacity={Math.min(1, drift.p * 3) * (1 - (drift.out ?? 0))}
        >
          <WorryNote text={drift.text} lit={1} />
        </g>
      ) : null}
    </g>
  );
};

/**
 * Your mind as a bedroom, from above. The bed sits in the middle; `pen`/`jumped`/`bored` run the sheep, who come in
 * from the left edge, hop over the bed (rising toward you mid-air) and gather on its right; `corner` puts a glow around
 * them; `worries` slides notes in on top of everything (they're thoughts). The beach picture hangs on the top wall:
 * `swing` folds it down over the bed (0 is a thin line against the wall), and `card` grows it to fill the whole room (1),
 * with the bed showing through again. `fx` animates the beach.
 */
export const Daydream: React.FC<{
  w: number;
  glow?: [number, number] | null;
  heat?: number;
  room?: number;
  pen?: number;
  /** How many sheep have hopped (fractional = mid-hop), or each sheep's own hop progress 0..1 (hops may overlap). */
  jumped?: number | number[];
  bored?: number;
  corner?: number;
  /** How many notes have slid in (fractional), or each note's own progress (springs). */
  worries?: number | number[];
  card?: number;
  /** 0 hides the picture altogether. */
  cardIn?: number;
  swing?: number;
  fx?: BeachFx;
  /** Clock grown out of the room's top-right corner, for the study (`minutes` sets the hands). */
  clock?: number;
}> = ({ w, glow, heat = 1, room = 1, pen = 0, jumped = 0, bored = 0, corner = 0, worries = 0, card = 0, cardIn = 1, swing = 0, fx = {}, clock }) => {
  const s = useSurface();
  const id = `dd${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const z = w / ROOM_W;
  const radius = Math.max(18, 40 * z);
  // The picture: hinged on the top wall, it folds down over the bed (its height grows, and it widens a touch as it
  // passes closest to you), then grows to fill the room.
  const C = DREAM.card;
  const sw = Math.sin((Math.PI / 2) * Math.min(1, Math.max(0, swing)));
  const g = Math.min(1, Math.max(0, card));
  const L = (a: number, b: number) => a + (b - a) * g;
  const open = Math.max(sw, g);
  const ph = 8 + (C.h - 8) * open;
  const near = 1 + 0.1 * Math.sin(Math.PI * Math.min(1, Math.max(0, swing))) * (1 - g);
  const pw0 = C.w * near;
  const cx = L(C.x + (C.w - pw0) / 2, 0);
  const cy = L(C.y, 0);
  const cw = L(pw0, 640);
  const ch = L(ph, 760);
  const cr = L(Math.min(10, ph / 2), 40);
  const border = L(6 * open, 0);
  const piece = (x: number, y: number, ww: number, h: number, r: number, fill: number, line: number, rot = 0) => (
    <rect
      x={x}
      y={y}
      width={ww}
      height={h}
      rx={r}
      fill={s(fill, 0.28)}
      stroke={`rgba(243,238,230,${line})`}
      strokeWidth={LINE}
      transform={`rotate(${rot} ${x + ww / 2} ${y + h / 2})`}
    />
  );
  // Sheep: each one runs in from the left edge, takes off at the bed, sails over it at mid-height (rising toward you, so
  // it grows and its shadow falls away on the duvet), lands on the right and trots to its spot. None wait on the left.
  const Y = 360;
  const LANDED: Array<[number, number]> = [
    [528, 318],
    [576, 392],
    [514, 420],
  ];
  // The jump over the bed uses easeInOutQuart (user, Oct 16): a slow take-off, a quick crossing, a soft landing.
  const inOutQuart = (u: number) => (u < 0.5 ? 8 * u ** 4 : 1 - (-2 * u + 2) ** 4 / 2);
  const outC = (u: number) => 1 - Math.pow(1 - u, 3);
  const hop = (t: number, to: [number, number]) => {
    if (t < 0.2) return { x: -60 + (172 + 60) * outC(t / 0.2), y: Y, up: 0 };
    if (t < 0.85) {
      const u = inOutQuart((t - 0.2) / 0.65);
      return { x: 172 + (470 - 172) * u, y: Y - 10 * Math.sin(Math.PI * u), up: Math.sin(Math.PI * u) };
    }
    const u = outC((t - 0.85) / 0.15);
    return { x: 470 + (to[0] - 470) * u, y: Y + (to[1] - Y) * u, up: 0 };
  };
  const hops = Array.isArray(jumped) ? jumped : LANDED.map((_, i) => Math.min(1, Math.max(0, jumped - i)));
  const sheep = () =>
    LANDED.map((to, i) => {
      const t = Math.min(1, Math.max(0, hops[i] ?? 0));
      if (t <= 0) return null;
      if (t >= 1) return <Sheep key={i} x={to[0]} y={to[1]} lie={i === LANDED.length - 1 ? bored : 0} />;
      const h = hop(t, to);
      return (
        <g key={i}>
          <ellipse cx={h.x + 26 * h.up} cy={h.y + 40 * h.up} rx={36 - 6 * h.up} ry={28 - 5 * h.up} fill={`rgba(0,0,0,${0.3 - 0.12 * h.up})`} />
          <Sheep x={h.x} y={h.y} scale={1 + 0.45 * h.up} />
        </g>
      );
    });
  const you = (o: number) =>
    glow && o > 0.001 ? (
      <g opacity={o}>
        <circle cx={glow[0]} cy={glow[1]} r={100 + 70 * heat} fill={`url(#${id}glow)`} opacity={Math.min(1, 0.35 + 0.65 * heat)} />
        <circle cx={glow[0]} cy={glow[1]} r={27} fill={P.ink} opacity={Math.min(1, 0.45 + heat)} />
      </g>
    ) : null;
  const bed = (o: number) =>
    o > 0.001 ? (
      <g opacity={o}>
        {piece(462, 140, 72, 72, 18, 0.05, 0.28)}
        {piece(200, 120, 240, 460, 28, 0.06, 0.62)}
        {piece(200, 262, 240, 318, 28, 0.14, 0.62)}
        {piece(322, 140, 104, 72, 26, 0.2, 0.62)}
        {piece(214, 140, 104, 72, 26, 0.2, 0.62, -7)}
        {piece(352, 494, 96, 86, 24, 0.14, 0.62, 14)}
      </g>
    ) : null;
  return (
    <div style={{ position: "relative", width: w, height: ROOM_H * z }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          border: `${LINE}px solid rgba(243,238,230,0.22)`,
          background: "linear-gradient(170deg, rgba(255,255,255,0.05), rgba(5,6,16,0.35))",
          boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
        }}
      />
      <svg width={w} height={ROOM_H * z} viewBox={`0 0 ${ROOM_W} ${ROOM_H}`} style={{ position: "relative", display: "block", overflow: "hidden", borderRadius: radius }}>
        <defs>
          <radialGradient id={`${id}glow`}>
            <stop offset="0" stopColor="#F3EEE6" stopOpacity={0.45} />
            <stop offset="1" stopColor="#F3EEE6" stopOpacity={0} />
          </radialGradient>
          <clipPath id={`${id}clip`}>
            <rect x={cx} y={cy} width={cw} height={ch} rx={cr} />
          </clipPath>
        </defs>
        {/* The bed and you, under the picture while it's folded down over the head of the bed. */}
        {bed(room)}
        {you(1 - g)}
        {/* The beach picture: a line on the top wall, folded down over the bed, or grown to fill the room. */}
        {cardIn > 0 ? (
          <g opacity={cardIn}>
            {sw > 0 && g < 0.3 ? <rect x={cx + 6 * sw * (1 - g)} y={cy + 26 * sw * (1 - g)} width={cw} height={ch} rx={cr} fill={`rgba(0,0,0,${0.35 * sw * (1 - g / 0.3)})`} /> : null}
            <rect x={cx} y={cy} width={cw} height={ch} rx={cr} fill={s(0.75, 0.05)} />
            <g clipPath={`url(#${id}clip)`}>
              <g transform={`translate(${cx + border} ${cy + border}) scale(${Math.max(0.001, (cw - 2 * border) / 640)} ${(ch - 2 * border) / 760})`}>
                <Beach {...fx} id={id} />
              </g>
            </g>
            <rect x={cx} y={cy} width={cw} height={ch} rx={cr} fill="none" stroke={`rgba(243,238,230,${0.7 * (1 - g) + 0.2})`} strokeWidth={LINE} />
          </g>
        ) : null}
        {/* Once the picture fills the room, the bed shows on top of the beach again. */}
        {bed(room * g)}
        {you(g)}
        {/* "A corner of your mind": the glow moves off your head and onto the sheep. */}
        {corner > 0 && pen > 0 ? <circle cx={DREAM.flock[0]} cy={DREAM.flock[1]} r={190} fill={`url(#${id}glow)`} opacity={corner * pen * (1 - g)} /> : null}
        {pen > 0.001 ? <g opacity={pen * (1 - g)}>{sheep()}</g> : null}
        {/* Worries slip in on top of everything: they are thoughts. The beach covers them. */}
        {WORRIES.map((n, i) => {
          const k = Array.isArray(worries) ? worries[i] ?? 0 : Math.min(1, Math.max(0, worries - i));
          if (k <= 0.001) return null;
          return (
            <g key={n.text} transform={`translate(${n.x + n.from[0] * (1 - k)} ${n.y + n.from[1] * (1 - k)}) rotate(${n.rot * k})`} opacity={Math.min(1, Math.max(0, k * 2)) * (1 - g)}>
              <WorryNote text={n.text} />
            </g>
          );
        })}
      </svg>
      {clock !== undefined ? (
        <div style={{ position: "absolute", right: -18 * z, top: -18 * z, filter: "drop-shadow(0 14px 24px rgba(0,0,0,0.5))" }}>
          <Clock size={190 * z} minutes={clock} />
        </div>
      ) : null}
    </div>
  );
};

// "Warm shower" (WarmShower, Oct 29): a bathroom from above that morphs into the bedroom (same seven-piece morph as
// RoomMorph, piece i of the bathroom → piece i of the bed). You are the dot; heat is your glow plus a shimmer rising off
// you. Heat flows out along dotted paths to four small radiators around you (your hands and feet: the super names them,
// no body is drawn), which shimmer it away. A clock grows out of the basin (or the bedside table), and the mirror on the
// bottom wall swings up and fills the room, fogged, with the quiz written in the steam.

/** Spots in window units. */
export const WARM = {
  shower: [320, 262] as [number, number],
  pillow: ROOMS_MORPH.bed.glow,
  /** The four radiators around you, in the shower. */
  radiators: [
    [190, 176],
    [450, 176],
    [206, 380],
    [434, 380],
  ] as Array<[number, number]>,
};

const BATH: Piece[] = [
  pc(56, 596, 256, 124, 22, 0.05), // vanity counter → nightstand
  pc(146, 70, 348, 380, 30, 0.06), // shower tray → bed
  pc(226, 494, 188, 104, 26, 0.14), // bath mat → duvet
  pc(288, 84, 64, 34, 17, 0.22), // shower head → pillow
  pc(108, 618, 148, 80, 40, 0.12), // basin → crooked pillow
  pc(146, 462, 232, 12, 6, 0.2), // glass screen → duvet corner
  pc(528, 404, 60, 236, 18, 0.08), // towel radiator → nightstand
];
const BATH_HERO = [1, 3];
const BED_HERO = [1, 2, 3, 4, 5];

export type WarmClock = {
  p: number;
  minutes: number;
  /** Grows out of the basin (bathroom) or the right bedside table (bedroom). */
  from: "basin" | "nightstand";
  moon?: number;
  wedge?: { from: number; to: number; amber?: boolean; o?: number };
  ghost?: number;
};

/** A small radiator, drawn face-on so it reads at a glance: rounded body, fins, two feet. `warm` lifts it. */
const Radiator: React.FC<{ x: number; y: number; scale?: number; warm?: number }> = ({ x, y, scale = 1, warm = 0 }) => {
  const s = useSurface();
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x={-40} y={-26} width={80} height={52} rx={14} fill={s(0.12 + 0.3 * warm, 0.2)} stroke={`rgba(243,238,230,${0.6 + 0.3 * warm})`} strokeWidth={LINE} />
      {[-20, 0, 20].map((fx) => (
        <line key={fx} x1={fx} y1={-14} x2={fx} y2={14} stroke={`rgba(243,238,230,${0.45 + 0.3 * warm})`} strokeWidth={LINE} strokeLinecap="round" />
      ))}
      <line x1={-28} y1={26} x2={-28} y2={34} stroke="rgba(243,238,230,0.5)" strokeWidth={LINE} strokeLinecap="round" />
      <line x1={28} y1={26} x2={28} y2={34} stroke="rgba(243,238,230,0.5)" strokeWidth={LINE} strokeLinecap="round" />
    </g>
  );
};

/** Heat rising off something: three wavy lines drifting up and fading. */
const Shimmer: React.FC<{ x: number; y: number; o: number; phase: number; spread?: number; len?: number }> = ({ x, y, o, phase, spread = 22, len = 46 }) =>
  o > 0.01 ? (
    <g opacity={o} fill="none" stroke="rgba(243,238,230,0.75)" strokeWidth={LINE} strokeLinecap="round">
      {[-1, 0, 1].map((i) => {
        const t = ((phase * 0.9 + (i + 1) * 13) % 40) / 40;
        const yy = y - 18 * t;
        return <path key={i} d={`M ${x + i * spread} ${yy} q 8 ${-len / 4} 0 ${-len / 2} t 0 ${-len / 2}`} opacity={Math.sin(Math.PI * t)} />;
      })}
    </g>
  ) : null;

export const ShowerRoom: React.FC<{
  w: number;
  /** 0 bathroom … 1 bedroom; `ks` gives each piece its own progress (springs with a stagger). */
  bed?: number;
  ks?: number[];
  glow?: [number, number] | null;
  /** 0 cool … 1 hot: the size of your glow and the shimmer off you. */
  heat?: number;
  /** 0..1 your glow goes out (asleep). */
  asleep?: number;
  spray?: number;
  steam?: number;
  /** Running value (frames) that moves the water, steam, shimmer and the dots along the heat paths. */
  phase?: number;
  /** 0..1 the radiators appear around you and heat flows out to them along dotted paths. */
  radiators?: number;
  flow?: number;
  /** 0..1 the radiators shimmer the heat away. */
  radiate?: number;
  clock?: WarmClock;
  /** The mirror on the bottom wall: `swing` folds it up from a line, `grow` fills the room, `write` writes the quiz in the fog. */
  mirror?: { swing: number; grow: number; write: number };
  /** 0..1 dims the room (the week-style grid of tiny copies). */
  dim?: number;
}> = ({ w, bed = 0, ks, glow, heat = 1, asleep = 0, spray = 0, steam = 0, phase = 0, radiators = 0, flow = 0, radiate = 0, clock, mirror, dim = 1 }) => {
  const s = useSurface();
  const id = `sr${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const z = w / ROOM_W;
  const radius = Math.max(14, 40 * z);
  const bath = 1 - Math.min(1, Math.max(0, bed));
  const pieces = BATH.map((p, i) => {
    const q = ROOMS_MORPH.bed.pieces[i];
    const k = Math.min(1.05, Math.max(-0.05, ks?.[i] ?? bed));
    const L = (u: number, v: number) => u + (v - u) * k;
    const line = L(BATH_HERO.includes(i) ? 0.62 : 0.28, BED_HERO.includes(i) ? 0.62 : 0.28);
    return { x: L(p.x, q.x), y: L(p.y, q.y), w: Math.max(0, L(p.w, q.w)), h: Math.max(0, L(p.h, q.h)), r: L(p.r, q.r), fill: L(p.fill, q.fill), rot: L(p.rot ?? 0, q.rot ?? 0), line };
  });
  const G = glow ?? null;
  const hot = Math.max(0, heat) * (1 - asleep);
  // Mirror on the bottom wall, above the vanity: a line, folded up, or grown to fill the room.
  const M = mirror ?? { swing: 0, grow: 0, write: 0 };
  const sw = Math.sin((Math.PI / 2) * Math.min(1, Math.max(0, M.swing)));
  const mg = Math.min(1, Math.max(0, M.grow));
  const ML = (a: number, b: number) => a + (b - a) * mg;
  const mh0 = 8 + 230 * sw;
  const mx = ML(66, 0);
  const mw = ML(236, 640);
  const mh = ML(mh0, 760);
  const my = ML(752 - mh0, 0);
  const mr = ML(Math.min(12, mh0 / 2), 40);
  const showMirror = mirror && (M.swing > 0 || M.grow > 0 || bath > 0.5);
  // Lines written in the fog, each wiped in left to right (a finger in the steam).
  const lines: Array<{ y: number; size: number; text: string; weight: number }> = [
    { y: 250, size: 86, text: "Take the", weight: 600 },
    { y: 344, size: 86, text: "sleep quiz", weight: 600 },
    { y: 440, size: 34, text: "See what's keeping you up", weight: 600 },
    { y: 620, size: 46, text: "Link in bio", weight: 600 },
  ];
  const clockAt = clock
    ? clock.from === "basin"
      ? { x0: 182, y0: 658, x1: 196, y1: 592, s0: 70, s1: 260 }
      : { x0: 530, y0: 160, x1: 512, y1: 214, s0: 80, s1: 230 }
    : null;
  return (
    <div style={{ position: "relative", width: w, height: ROOM_H * z }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          border: `${LINE}px solid rgba(243,238,230,0.22)`,
          background: "linear-gradient(170deg, rgba(255,255,255,0.05), rgba(5,6,16,0.35))",
          boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
        }}
      />
      <svg width={w} height={ROOM_H * z} viewBox={`0 0 ${ROOM_W} ${ROOM_H}`} style={{ position: "relative", display: "block", overflow: "hidden", borderRadius: radius }}>
        <defs>
          <radialGradient id={`${id}glow`}>
            <stop offset="0" stopColor="#F3EEE6" stopOpacity={0.45} />
            <stop offset="1" stopColor="#F3EEE6" stopOpacity={0} />
          </radialGradient>
          <radialGradient id={`${id}fog`} cx="0.5" cy="0.45" r="0.75">
            <stop offset="0" stopColor={s(0.5, 0.05)} />
            <stop offset="1" stopColor={s(0.3, 0.15)} />
          </radialGradient>
          <clipPath id={`${id}mclip`}>
            <rect x={mx} y={my} width={mw} height={mh} rx={mr} />
          </clipPath>
          <filter id={`${id}soft`} x="-5%" y="-20%" width="110%" height="140%">
            <feGaussianBlur stdDeviation={1.4} />
          </filter>
        </defs>
        <g opacity={dim}>
          {pieces.map((p, i) =>
            p.w > 1 ? (
              <rect
                key={i}
                x={p.x}
                y={p.y}
                width={p.w}
                height={p.h}
                rx={Math.min(p.r, p.w / 2, p.h / 2)}
                fill={s(p.fill, 0.28)}
                stroke={`rgba(243,238,230,${p.line})`}
                strokeWidth={LINE}
                transform={`rotate(${p.rot} ${p.x + p.w / 2} ${p.y + p.h / 2})`}
              />
            ) : null,
          )}
          {/* Bathroom details: drain, rails on the towel radiator, the tap. They go as the room turns into the bedroom. */}
          <g opacity={Math.max(0, 1 - 2.5 * (1 - bath))}>
            <circle cx={320} cy={370} r={16} fill="none" stroke="rgba(243,238,230,0.35)" strokeWidth={2.5} />
            <line x1={312} y1={370} x2={328} y2={370} stroke="rgba(243,238,230,0.35)" strokeWidth={2.5} strokeLinecap="round" />
            {[440, 480, 520, 560, 600].map((y) => (
              <line key={y} x1={540} y1={y} x2={576} y2={y} stroke="rgba(243,238,230,0.35)" strokeWidth={2.5} strokeLinecap="round" />
            ))}
            <circle cx={182} cy={706} r={9} fill={s(0.2, 0.2)} stroke="rgba(243,238,230,0.5)" strokeWidth={2.5} />
          </g>
        </g>
        {/* Steam drifting off the shower. */}
        {steam > 0.01
          ? Array.from({ length: 9 }, (_, i) => {
              const t = ((phase * 0.45 + i * 31) % 140) / 140;
              const a = i * 2.3;
              const x = 320 + Math.cos(a) * (50 + 180 * t);
              const y = 250 + Math.sin(a) * (40 + 150 * t) - 60 * t;
              return <circle key={i} cx={x} cy={y} r={50 + 70 * t} fill={`url(#${id}glow)`} opacity={steam * 0.9 * Math.sin(Math.PI * t)} />;
            })
          : null}
        {/* Heat flowing out to the radiators: dotted paths with the dots moving outward. */}
        {G && flow > 0.01
          ? WARM.radiators.map(([rx, ry], i) => {
              const mx2 = (G[0] + rx) / 2 + (i % 2 ? 24 : -24);
              const my2 = (G[1] + ry) / 2 - 20;
              return (
                <path
                  key={i}
                  d={`M ${G[0]} ${G[1]} Q ${mx2} ${my2} ${rx} ${ry}`}
                  fill="none"
                  stroke="rgba(243,238,230,0.7)"
                  strokeWidth={6}
                  strokeLinecap="round"
                  strokeDasharray="0.1 18"
                  strokeDashoffset={-phase * 1.2}
                  opacity={flow}
                />
              );
            })
          : null}
        {radiators > 0.01
          ? WARM.radiators.map(([rx, ry], i) => {
              const k = Math.min(1, Math.max(0, radiators * 1.6 - i * 0.2));
              return (
                <g key={i} opacity={Math.min(1, k * 2)}>
                  <Radiator x={rx} y={ry} scale={0.6 + 0.4 * k} warm={radiate} />
                  <Shimmer x={rx} y={ry - 36} o={radiate} phase={phase + i * 7} spread={18} len={40} />
                </g>
              );
            })
          : null}
        {/* You: a soft glow and a dot. Hot: a bigger glow and heat rising off you. */}
        {G ? (
          <>
            <circle cx={G[0]} cy={G[1]} r={90 + 110 * hot} fill={`url(#${id}glow)`} opacity={Math.min(1, 0.25 + 0.75 * hot) * (1 - 0.8 * asleep)} />
            <Shimmer x={G[0]} y={G[1] - 44} o={Math.max(0, hot - 0.35) * 1.4} phase={phase} />
            <circle cx={G[0]} cy={G[1]} r={27} fill={P.ink} opacity={1 - 0.45 * asleep} />
          </>
        ) : null}
        {/* The water: drops falling from the shower head onto you. */}
        {spray > 0.01
          ? Array.from({ length: 20 }, (_, i) => {
              const t = ((phase * 1.6 + i * 11) % 36) / 36;
              const dir = ((i * 7) % 20) / 10 - 1;
              const x = 320 + dir * 120 * t;
              const y = 124 + 230 * t;
              return (
                <line key={i} x1={x} y1={y} x2={x + dir * 6} y2={y + 14} stroke="rgba(243,238,230,0.7)" strokeWidth={2.5} strokeLinecap="round" opacity={spray * Math.sin(Math.PI * t)} />
              );
            })
          : null}
        {/* The mirror. */}
        {showMirror ? (
          <g opacity={mirror && M.swing === 0 && M.grow === 0 ? bath : 1}>
            {sw > 0 && mg < 0.3 ? <rect x={mx - 6} y={my - 22 * sw} width={mw} height={mh} rx={mr} fill={`rgba(0,0,0,${0.3 * sw})`} /> : null}
            <rect x={mx} y={my} width={mw} height={mh} rx={mr} fill={`url(#${id}fog)`} />
            <g clipPath={`url(#${id}mclip)`}>
              {/* Drops of condensation on the fog. */}
              {Array.from({ length: 26 }, (_, i) => (
                <circle key={i} cx={mx + ((i * 97) % 100) / 100 * mw} cy={my + ((i * 61) % 100) / 100 * mh} r={2 + (i % 3)} fill="rgba(243,238,230,0.35)" />
              ))}
              {mg > 0.95
                ? lines.map((l, i) => {
                    const k = Math.min(1, Math.max(0, M.write * lines.length - i));
                    if (k <= 0) return null;
                    const wl = l.text.length * l.size * 0.56;
                    return (
                      <g key={i}>
                        <clipPath id={`${id}w${i}`}>
                          <rect x={320 - wl / 2 - 20} y={l.y - l.size} width={(wl + 40) * k} height={l.size * 1.4} />
                        </clipPath>
                        <g clipPath={`url(#${id}w${i})`} filter={`url(#${id}soft)`}>
                          <text x={320} y={l.y} textAnchor="middle" fontFamily={fonts.sans} fontWeight={l.weight} fontSize={l.size} letterSpacing="-0.02em" fill={s(0, 0.82)}>
                            {l.text}
                          </text>
                        </g>
                      </g>
                    );
                  })
                : null}
            </g>
            <rect x={mx} y={my} width={mw} height={mh} rx={mr} fill="none" stroke="rgba(243,238,230,0.7)" strokeWidth={LINE} />
          </g>
        ) : null}
      </svg>
      {clock && clockAt && clock.p > 0.001 ? (
        (() => {
          const size = clockAt.s0 + (clockAt.s1 - clockAt.s0) * clock.p;
          const cx = clockAt.x0 + (clockAt.x1 - clockAt.x0) * clock.p;
          const cy = clockAt.y0 + (clockAt.y1 - clockAt.y0) * clock.p;
          return (
            <div style={{ position: "absolute", left: (cx - size / 2) * z, top: (cy - size / 2) * z, opacity: Math.min(1, clock.p * 3), filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.5))" }}>
              <Clock size={size * z} minutes={clock.minutes} moon={clock.moon} wedge={clock.wedge} ghost={clock.ghost} />
            </div>
          );
        })()
      ) : null}
    </div>
  );
};

// "Try staying awake" (StayAwake, Oct 29): the bedroom from above, you (the dot) on the pillow. Sleep is the moon,
// floating over the bed just out of reach: chase it and it slips away; stop trying and it drifts in to you on its own.
// Trying is the bedside lamp clicking on (effort keeps the room lit); a worry note lands on the bed. The right bedside
// table grows into a clock ("a little longer") and then into a note to self that fills the room (the quiz).

/** Spots in window units. */
export const DARK = {
  pillow: ROOMS_MORPH.bed.glow,
  /** Where the moon floats at the start: over the foot of the bed, out of reach. */
  foot: [320, 548] as [number, number],
  /** Where it slips to when you chase it: the far corner. */
  corner: [566, 686] as [number, number],
  /** Where it settles in the end, on the bed just below you (clear of the clock). */
  near: [300, 340] as [number, number],
  /** Where you stop when you chase it. */
  chase: [306, 404] as [number, number],
  lamp: [110, 160] as [number, number],
  worry: { x: 196, y: 300, rot: -5 },
};
export const DARK_WORRY = "What if I can't sleep?";

export type DarkMoon = { x: number; y: number; o?: number; amber?: number; size?: number; ghost?: [number, number]; arrow?: number };

/** Sleep: a soft crescent with a halo, in window units. */
const SleepMoon: React.FC<DarkMoon & { id: string }> = ({ x, y, o = 1, amber = 0, size = 96, id }) => {
  const k = size / 40;
  const a = Math.min(1, Math.max(0, amber));
  const path = "M27 5 A16 16 0 1 0 35 27 A13 13 0 1 1 27 5 Z";
  return (
    <g opacity={o}>
      <circle cx={x} cy={y} r={size * 1.3} fill={`url(#${id}glow)`} opacity={0.7 * (1 - a)} />
      <circle cx={x} cy={y} r={size * 1.3} fill={`url(#${id}amb)`} opacity={0.7 * a} />
      <g transform={`translate(${x - size / 2} ${y - size / 2}) scale(${k})`}>
        <path d={path} fill={P.ink} opacity={1 - a} />
        <path d={path} fill={P.amber} opacity={a} />
      </g>
    </g>
  );
};

/** A note to self: the quiz, with a box that ticks. Drawn in a 560 × 600 box. */
const QuizNote: React.FC<{ tick: number }> = ({ tick }) => {
  const s = useSurface();
  return (
    <g>
      <rect x={10} y={22} width={560} height={600} rx={34} fill="rgba(0,0,0,0.35)" />
      <rect x={0} y={0} width={560} height={600} rx={34} fill={s(0.22, 0.08)} stroke="rgba(243,238,230,0.7)" strokeWidth={LINE} />
      <text x={56} y={96} fontFamily={fonts.sans} fontWeight={500} fontSize={26} letterSpacing="0.12em" fill={P.dim}>
        NOTE TO SELF
      </text>
      <rect x={56} y={160} width={58} height={58} rx={16} fill="none" stroke="rgba(243,238,230,0.75)" strokeWidth={LINE} />
      {tick > 0 ? (
        <path
          d="M 70 190 L 82 204 L 102 172"
          fill="none"
          stroke={P.ink}
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={60}
          strokeDashoffset={60 * (1 - Math.min(1, tick))}
        />
      ) : null}
      <text fontFamily={fonts.sans} fontWeight={600} fontSize={74} letterSpacing="-0.03em" fill={P.ink}>
        <tspan x={140} y={214}>Take the</tspan>
        <tspan x={140} y={296}>sleep quiz</tspan>
      </text>
      <text x={140} y={360} fontFamily={fonts.sans} fontWeight={500} fontSize={32} fill="rgba(243,238,230,0.75)">
        See what's keeping you up
      </text>
      <line x1={56} y1={448} x2={504} y2={448} stroke="rgba(243,238,230,0.25)" strokeWidth={2} />
      <text x={56} y={530} fontFamily={fonts.sans} fontWeight={600} fontSize={46} letterSpacing="-0.02em" fill={P.ink}>
        Link in bio
      </text>
    </g>
  );
};

export const DarkRoom: React.FC<{
  w: number;
  /** Where you are (window units); `trail` draws fading copies back toward `trailFrom` (chasing). */
  glow?: [number, number] | null;
  trail?: { from: [number, number]; o: number };
  /** 0 calm … 1 wide awake and trying: the size and brightness of your glow. `pulse` breathes it (frames). */
  awake?: number;
  pulse?: number;
  /** 0..1 your glow goes out: asleep. */
  asleep?: number;
  moon?: DarkMoon;
  /** 0..1 the bedside lamp is on and its light fills the room. */
  lamp?: number;
  /** The worry note on the bed: `p` lands it (0..1), `scale` shrinks it (the study). */
  worry?: { p: number; scale?: number };
  /** The right bedside table grows into a clock. */
  clock?: { p: number; minutes: number; wedge?: { from: number; to: number; o?: number } };
  /** The right bedside table grows into the note to self (`p`), and its box ticks (`tick`). */
  note?: { p: number; tick: number };
  dim?: number;
  /** Tiny copies: drop the shadow. */
  mini?: boolean;
}> = ({ w, glow = DARK.pillow, trail, awake = 1, pulse = 0, asleep = 0, moon, lamp = 0, worry, clock, note, dim = 1, mini }) => {
  const s = useSurface();
  const id = `dr${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const z = w / ROOM_W;
  const radius = Math.max(12, 40 * z);
  const G = glow;
  const breathe = 1 + 0.06 * awake * Math.sin(pulse / 4.5);
  const on = Math.min(1, Math.max(0, lamp));
  // The note grows from the right bedside table to fill the room.
  const np = note ? Math.min(1, Math.max(0, note.p)) : 0;
  const nScale = 0.12 + 0.88 * np;
  const nx = 530 + (40 - 530) * np - 280 * nScale * (1 - np);
  const ny = 160 + (80 - 160) * np - 300 * nScale * (1 - np);
  return (
    <div style={{ position: "relative", width: w, height: ROOM_H * z }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          border: `${mini ? 2 : LINE}px solid rgba(243,238,230,0.22)`,
          background: "linear-gradient(170deg, rgba(255,255,255,0.05), rgba(5,6,16,0.35))",
          boxShadow: mini ? undefined : "0 30px 80px rgba(0,0,0,0.35)",
        }}
      />
      <svg width={w} height={ROOM_H * z} viewBox={`0 0 ${ROOM_W} ${ROOM_H}`} style={{ position: "relative", display: "block", overflow: "hidden", borderRadius: radius }}>
        <defs>
          <radialGradient id={`${id}glow`}>
            <stop offset="0" stopColor="#F3EEE6" stopOpacity={0.45} />
            <stop offset="1" stopColor="#F3EEE6" stopOpacity={0} />
          </radialGradient>
          <radialGradient id={`${id}amb`}>
            <stop offset="0" stopColor={P.amber} stopOpacity={0.5} />
            <stop offset="1" stopColor={P.amber} stopOpacity={0} />
          </radialGradient>
          <radialGradient id={`${id}lamp`}>
            <stop offset="0" stopColor="#FFF4DE" stopOpacity={0.5} />
            <stop offset="0.45" stopColor="#FFF4DE" stopOpacity={0.18} />
            <stop offset="1" stopColor="#FFF4DE" stopOpacity={0} />
          </radialGradient>
        </defs>
        {/* The lamp's light, under the furniture so the pieces read against it. */}
        <circle cx={DARK.lamp[0]} cy={DARK.lamp[1]} r={640} fill={`url(#${id}lamp)`} opacity={on} />
        <g opacity={dim}>
          {ROOMS_MORPH.bed.pieces.map((p, i) => (
            <rect
              key={i}
              x={p.x}
              y={p.y}
              width={p.w}
              height={p.h}
              rx={Math.min(p.r, p.w / 2, p.h / 2)}
              fill={s(p.fill + 0.08 * on, 0.28)}
              stroke={`rgba(243,238,230,${(HERO.bed.includes(i) ? 0.62 : 0.28) + 0.15 * on})`}
              strokeWidth={LINE}
              transform={`rotate(${p.rot ?? 0} ${p.x + p.w / 2} ${p.y + p.h / 2})`}
            />
          ))}
          {/* The bedside lamp: a round shade on the left table, bright when it's on. */}
          <circle cx={DARK.lamp[0]} cy={DARK.lamp[1]} r={24} fill={on > 0.01 ? `rgba(255,244,222,${0.25 + 0.7 * on})` : s(0.12, 0.2)} stroke="rgba(243,238,230,0.6)" strokeWidth={LINE} />
        </g>
        {/* You: a soft glow and a dot; the trail when you chase. */}
        {G && trail && trail.o > 0.01
          ? [0.2, 0.4, 0.6, 0.8].map((t) => (
              <circle key={t} cx={trail.from[0] + (G[0] - trail.from[0]) * t} cy={trail.from[1] + (G[1] - trail.from[1]) * t} r={27 * (0.5 + 0.4 * t)} fill={P.ink} opacity={trail.o * 0.35 * t} />
            ))
          : null}
        {G ? (
          <>
            <circle cx={G[0]} cy={G[1]} r={(90 + 120 * awake) * breathe} fill={`url(#${id}glow)`} opacity={Math.min(1, 0.35 + 0.65 * awake) * (1 - 0.85 * asleep)} />
            <circle cx={G[0]} cy={G[1]} r={27} fill={P.ink} opacity={1 - 0.45 * asleep} />
          </>
        ) : null}
        {/* The worry: a note that lands on the bed, over you (thoughts sit on top). */}
        {worry && worry.p > 0.01 ? (
          <g
            transform={`translate(${DARK.worry.x - (mini ? 90 : 0)} ${DARK.worry.y - 60 * (1 - worry.p)}) rotate(${DARK.worry.rot}) scale(${(worry.scale ?? 1) * (0.8 + 0.2 * worry.p) * (mini ? 1.5 : 1)})`}
            opacity={Math.min(1, worry.p * 1.5)}
          >
            <WorryNote text={DARK_WORRY} lit={on} />
          </g>
        ) : null}
        {/* Sleep, and where it was before it slipped away. */}
        {moon?.ghost ? (
          <g opacity={(moon.o ?? 1) * 0.6}>
            <circle cx={moon.ghost[0]} cy={moon.ghost[1]} r={46} fill="none" stroke="rgba(243,238,230,0.45)" strokeWidth={LINE} strokeDasharray="8 10" />
            {moon.arrow ? (
              <path
                d={`M ${moon.ghost[0] + 50} ${moon.ghost[1] + 30} Q ${(moon.ghost[0] + moon.x) / 2 + 40} ${(moon.ghost[1] + moon.y) / 2 - 30} ${moon.x - 50} ${moon.y - 34}`}
                fill="none"
                stroke="rgba(243,238,230,0.6)"
                strokeWidth={5}
                strokeLinecap="round"
                strokeDasharray="0.1 16"
                opacity={moon.arrow}
              />
            ) : null}
          </g>
        ) : null}
        {moon ? <SleepMoon {...moon} id={id} /> : null}
        {/* The note to self, grown out of the right bedside table. */}
        {np > 0.001 ? (
          <g transform={`translate(${nx} ${ny}) scale(${nScale}) rotate(${-2 * np} 280 300)`} opacity={Math.min(1, np * 4)}>
            <QuizNote tick={note?.tick ?? 0} />
          </g>
        ) : null}
      </svg>
      {clock && clock.p > 0.001 ? (
        <div
          style={{
            position: "absolute",
            left: (530 - 26 * clock.p - (80 + 150 * clock.p) / 2) * z,
            top: (160 + 50 * clock.p - (80 + 150 * clock.p) / 2) * z,
            opacity: Math.min(1, clock.p * 3),
            filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.5))",
          }}
        >
          <Clock size={(80 + 150 * clock.p) * z} minutes={clock.minutes} wedge={clock.wedge} />
        </div>
      ) : null}
    </div>
  );
};

// "Try staying awake", second take (StayAwake, Oct 29; the bed-and-moon version was rejected as unclear and static).
// Sleep is your pillow. Your head (the dot) on the pillow is sleep; the pillow squeezes out from under you and slides
// around the room like wet soap, and you follow it one step behind. Lie still on the bare bed and it slides back under
// your head on its own. The bedside table grows into a clock, then into the note to self (the quiz).

/** Where things are in the pillow room (window units). `path` is the route the pillow slides along, as waypoints. */
export const PILLOW_ROOM = {
  head: [226, 126] as [number, number],
  bed: { x: 64, y: 52, w: 330, h: 470, r: 36 },
  duvet: { x: 64, y: 216, w: 330, h: 306, r: 36 },
  nightstand: { x: 418, y: 62, w: 100, h: 100, r: 24 },
  chair: { x: 424, y: 528, w: 166, h: 166, r: 54 },
  rug: { x: 84, y: 588, w: 250, h: 136, r: 68 },
  path: [
    [226, 126],
    [354, 152],
    [506, 300],
    [380, 556],
    [216, 652],
    [84, 600],
    [250, 548],
    [420, 470],
    [566, 404],
    [574, 250],
  ] as Array<[number, number]>,
};

/** A point along a route of waypoints (default: the pillow's): `u` is a float index (Catmull-Rom through them), plus its heading. */
export const routeAt = (u: number, W: Array<[number, number]> = PILLOW_ROOM.path): { p: [number, number]; angle: number } => {
  const n = W.length - 1;
  const uu = Math.min(n, Math.max(0, u));
  const i = Math.min(n - 1, Math.floor(uu));
  const t = uu - i;
  const P0 = W[Math.max(0, i - 1)];
  const P1 = W[i];
  const P2 = W[i + 1];
  const P3 = W[Math.min(n, i + 2)];
  const cr = (a: number, b: number, c: number, d: number) =>
    0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t);
  const dcr = (a: number, b: number, c: number, d: number) => 0.5 * (-a + c + 2 * (2 * a - 5 * b + 4 * c - d) * t + 3 * (-a + 3 * b - 3 * c + d) * t * t);
  const dx = dcr(P0[0], P1[0], P2[0], P3[0]);
  const dy = dcr(P0[1], P1[1], P2[1], P3[1]);
  return { p: [cr(P0[0], P1[0], P2[0], P3[0]), cr(P0[1], P1[1], P2[1], P3[1])], angle: (Math.atan2(dy, dx) * 180) / Math.PI };
};

/** The bedside lamp sits on the nightstand. */
const LAMP: [number, number] = [468, 112];

export const PILLOW_W = 170;
export const PILLOW_H = 92;

/** The pillow, squeezed along its direction of travel (`v`, units per frame) like soap slipping out of a hand. */
const SlipPillow: React.FC<{ p: [number, number]; v: [number, number]; rot: number; o?: number; lit?: number }> = ({ p, v, rot, o = 1, lit = 0 }) => {
  const s = useSurface();
  const speed = Math.hypot(v[0], v[1]);
  const squeeze = Math.min(0.28, speed / 70);
  const dir = (Math.atan2(v[1], v[0]) * 180) / Math.PI;
  return (
    <g opacity={o} transform={`translate(${p[0]} ${p[1]}) rotate(${dir}) scale(${1 + squeeze} ${1 - squeeze * 0.6}) rotate(${-dir}) rotate(${rot})`}>
      <rect x={-PILLOW_W / 2 + 6} y={-PILLOW_H / 2 + 12} width={PILLOW_W} height={PILLOW_H} rx={34} fill="rgba(0,0,0,0.3)" />
      <rect x={-PILLOW_W / 2} y={-PILLOW_H / 2} width={PILLOW_W} height={PILLOW_H} rx={34} fill={s(0.3 + 0.08 * lit, 0.12)} stroke={`rgba(243,238,230,${0.8 + 0.2 * lit})`} strokeWidth={LINE} />
      {/* The seam down the middle: what makes a soft rectangle read as a pillow from above. */}
      <path d={`M ${-PILLOW_W / 2 + 26} 0 Q 0 -6 ${PILLOW_W / 2 - 26} 0`} fill="none" stroke="rgba(243,238,230,0.35)" strokeWidth={2.5} strokeLinecap="round" />
    </g>
  );
};

export type PillowState = { p: [number, number]; v?: [number, number]; rot?: number };

export const PillowRoom: React.FC<{
  w: number;
  pillow: PillowState;
  /** Faint copies of the pillow behind it while it slips away (older first). */
  trail?: PillowState[];
  you: [number, number];
  /** Where you were a few frames ago: draws a short trail while you move. */
  youLag?: [number, number];
  /** 0 calm … 1 wide awake (above 1 while chasing): your glow. `pulse` breathes it (frames). */
  awake?: number;
  pulse?: number;
  asleep?: number;
  /** 0..1 the room goes dark around you (lie in the dark). */
  dark?: number;
  /** 0..1 everything but the pillow dims (it's the focal piece). */
  focus?: number;
  clock?: { p: number; minutes: number; wedge?: { from: number; to: number; o?: number } };
  note?: { p: number; tick: number };
  /** The bedside lamp: `show` 0..1 grows it onto the nightstand, `on` 0..1 lights it and the room. */
  lamp?: { show: number; on: number };
  /** A tag on the bed under your head, in amber (the video's one amber moment). */
  tag?: { text: string; o: number };
  mini?: boolean;
}> = ({ w, pillow, trail = [], you, youLag, awake = 1, pulse = 0, asleep = 0, dark = 0, focus = 0, clock, note, lamp, tag, mini }) => {
  const s = useSurface();
  const id = `pr${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const z = w / ROOM_W;
  const radius = Math.max(12, 40 * z);
  const R = PILLOW_ROOM;
  const piece = (q: { x: number; y: number; w: number; h: number; r: number }, fill: number, line: number) => (
    <rect x={q.x} y={q.y} width={q.w} height={q.h} rx={q.r} fill={s(fill, 0.28)} stroke={`rgba(243,238,230,${line})`} strokeWidth={LINE} />
  );
  const breathe = 1 + 0.06 * awake * Math.sin(pulse / 4.5);
  const lag = youLag ?? you;
  const ySpeed = Math.hypot(you[0] - lag[0], you[1] - lag[1]);
  const yTrail = Math.min(1, Math.max(0, (ySpeed - 6) / 30));
  // The note grows from the bedside table to fill the room.
  const np = note ? Math.min(1, Math.max(0, note.p)) : 0;
  const nScale = 0.12 + 0.88 * np;
  const nx = 468 + (40 - 468) * np - 280 * nScale * (1 - np);
  const ny = 112 + (80 - 112) * np - 300 * nScale * (1 - np);
  return (
    <div style={{ position: "relative", width: w, height: ROOM_H * z }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          border: `${mini ? 2 : LINE}px solid rgba(243,238,230,0.22)`,
          background: "linear-gradient(170deg, rgba(255,255,255,0.05), rgba(5,6,16,0.35))",
          boxShadow: mini ? undefined : "0 30px 80px rgba(0,0,0,0.35)",
        }}
      />
      <svg width={w} height={ROOM_H * z} viewBox={`0 0 ${ROOM_W} ${ROOM_H}`} style={{ position: "relative", display: "block", overflow: "hidden", borderRadius: radius }}>
        <defs>
          <radialGradient id={`${id}glow`}>
            <stop offset="0" stopColor="#F3EEE6" stopOpacity={0.45} />
            <stop offset="1" stopColor="#F3EEE6" stopOpacity={0} />
          </radialGradient>
          <radialGradient id={`${id}lamp`}>
            <stop offset="0" stopColor="#FFF4DE" stopOpacity={0.5} />
            <stop offset="0.45" stopColor="#FFF4DE" stopOpacity={0.16} />
            <stop offset="1" stopColor="#FFF4DE" stopOpacity={0} />
          </radialGradient>
        </defs>
        {/* The lamp's light, under the furniture so the pieces read against it. */}
        {lamp && lamp.on > 0.01 ? <circle cx={LAMP[0]} cy={LAMP[1]} r={700} fill={`url(#${id}lamp)`} opacity={lamp.on * lamp.show} /> : null}
        <g opacity={(1 - 0.4 * dark) * (1 - 0.45 * focus)}>
          {piece(R.rug, 0.02, 0.18)}
          {/* The armchair stays under the pillow and you (user, Oct 29: sliding under it looked weird). */}
          {piece(R.chair, 0.07, 0.28)}
          <rect x={R.chair.x + 32} y={R.chair.y + 32} width={102} height={102} rx={34} fill={s(0.12, 0.2)} stroke="rgba(243,238,230,0.28)" strokeWidth={LINE} />
          {piece(R.nightstand, 0.05, 0.28)}
          {piece(R.bed, 0.06, 0.62)}
          {piece(R.duvet, 0.14, 0.62)}
        </g>
        {/* The bedside lamp from above: a round shade with the bulb showing through the top, bright when it's on. */}
        {lamp && lamp.show > 0.01 ? (
          <g transform={`translate(${LAMP[0]} ${LAMP[1]}) scale(${lamp.show})`}>
            <circle r={36} fill="rgba(0,0,0,0.3)" transform="translate(4 8)" />
            <circle r={36} fill={lamp.on > 0.01 ? `rgba(255,244,222,${0.2 + 0.65 * lamp.on})` : s(0.14, 0.18)} stroke="rgba(243,238,230,0.75)" strokeWidth={LINE} />
            <circle r={13} fill={lamp.on > 0.01 ? `rgba(255,250,240,${0.4 + 0.6 * lamp.on})` : s(0.25, 0.1)} stroke="rgba(243,238,230,0.5)" strokeWidth={2} />
          </g>
        ) : null}
        {trail.map((q, i) => (
          <SlipPillow key={i} p={q.p} v={q.v ?? [0, 0]} rot={q.rot ?? 0} o={(0.3 * (i + 1)) / (trail.length + 1)} />
        ))}
        <SlipPillow p={pillow.p} v={pillow.v ?? [0, 0]} rot={pillow.rot ?? 0} lit={focus} />
        {/* You: a short trail while moving, a soft glow and a dot. */}
        {yTrail > 0.01
          ? [0.25, 0.5, 0.75].map((t) => (
              <circle key={t} cx={lag[0] + (you[0] - lag[0]) * t} cy={lag[1] + (you[1] - lag[1]) * t} r={27 * (0.5 + 0.4 * t)} fill={P.ink} opacity={yTrail * 0.35 * t} />
            ))
          : null}
        <circle cx={you[0]} cy={you[1]} r={(90 + 120 * awake) * breathe} fill={`url(#${id}glow)`} opacity={Math.min(1, 0.35 + 0.65 * awake) * (1 - 0.85 * asleep)} />
        <circle cx={you[0]} cy={you[1]} r={27} fill={P.ink} opacity={1 - 0.45 * asleep} />
        {tag && tag.o > 0.01 ? (
          <g opacity={Math.min(1, tag.o)} transform={`translate(${320} ${R.head[1] + 128 - 14 * (1 - Math.min(1, tag.o))})`}>
            <rect x={-(tag.text.length * 18.6 + 56) / 2} y={-38} width={tag.text.length * 18.6 + 56} height={76} rx={38} fill={s(0.1, 0.4)} stroke={P.amber} strokeWidth={LINE} />
            <text y={12} textAnchor="middle" fontFamily={fonts.sans} fontWeight={600} fontSize={35} fill={P.amber} letterSpacing="-0.01em">
              {tag.text}
            </text>
          </g>
        ) : null}
        {np > 0.001 ? (
          <g transform={`translate(${nx} ${ny}) scale(${nScale}) rotate(${-2 * np} 280 300)`} opacity={Math.min(1, np * 4)}>
            <QuizNote tick={note?.tick ?? 0} />
          </g>
        ) : null}
      </svg>
      {clock && clock.p > 0.001 ? (
        <div
          style={{
            position: "absolute",
            left: (468 + 30 * clock.p - (90 + 150 * clock.p) / 2) * z,
            top: (112 + 70 * clock.p - (90 + 150 * clock.p) / 2) * z,
            opacity: Math.min(1, clock.p * 3),
            filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.5))",
          }}
        >
          <Clock size={(90 + 150 * clock.p) * z} minutes={clock.minutes} wedge={clock.wedge} />
        </div>
      ) : null}
    </div>
  );
};
