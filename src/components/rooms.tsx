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
