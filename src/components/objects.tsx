// Illustrated objects for script metaphors: calendar, event block, worry pill, inbox, two-column page, folded note, quiz invite.
// Thin strokes, rounded corners, ink on the night palette. Everything is positioned absolutely in reel pixels.
import { createContext, useContext } from "react";
import type { RGB } from "../brand/photos";
import { fonts } from "../brand/theme";
import { P } from "./premium";

export const LINE = 3;

/**
 * Solid object surfaces (pills, folded note, invite, guest dots) are mixed from the background photo's tint so they sit
 * in its light. Provide the photo's `tint` with <SurfaceTint.Provider>; the default reproduces the original navy.
 */
export const SurfaceTint = createContext<RGB>([20, 27, 75]);
const GROUND: RGB = [11, 12, 20];
const INK: RGB = [243, 238, 230];
const mix = (a: RGB, b: RGB, k: number): RGB =>
  [0, 1, 2].map((i) => a[i] + (b[i] - a[i]) * k) as RGB;
/** `ink` lifts toward the type colour, `ground` sinks toward the night ground. */
export const useSurface = () => {
  const tint = useContext(SurfaceTint);
  return (ink: number, ground: number, alpha = 1) => {
    const [r, g, b] = mix(mix(tint, GROUND, ground), INK, ink).map(Math.round);
    return `rgba(${r},${g},${b},${alpha})`;
  };
};
export const STROKE = "rgba(243,238,230,0.28)";
const card = {
  position: "absolute" as const,
  boxSizing: "border-box" as const,
  border: `${LINE}px solid ${STROKE}`,
  background:
    "linear-gradient(170deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
  boxShadow:
    "0 30px 80px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
  fontFamily: fonts.sans,
  color: P.ink,
};
const small = {
  fontSize: 22,
  fontWeight: 500,
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: P.dim,
};

export const Moon: React.FC<{
  size: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ size, color = P.ink, style }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={style}>
    <path d="M27 5 A16 16 0 1 0 35 27 A13 13 0 1 1 27 5 Z" fill={color} />
  </svg>
);

export const Tick: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <circle cx={20} cy={20} r={19} fill={P.ink} />
    <path
      d="M12 20.5 l5.5 5.5 l10.5 -11"
      fill="none"
      stroke={P.ground}
      strokeWidth={3.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Seven faceless "attendee" circles, overlapping like an invite's guest list. */
export const Attendees: React.FC<{
  count?: number;
  size?: number;
  extra?: string;
}> = ({ count = 5, size = 30, extra = "+2" }) => {
  const surface = useSurface();
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          style={{
            width: size,
            height: size,
            borderRadius: size,
            marginLeft: i === 0 ? 0 : -size * 0.3,
            background: `rgba(243,238,230,${0.85 - i * 0.13})`,
            border: `3px solid ${surface(0.05, 0.35)}`,
          }}
        />
      ))}
      <span
        style={{ marginLeft: 10, fontSize: 22, color: P.dim, fontWeight: 500 }}
      >
        {extra}
      </span>
    </div>
  );
};

export type CalEvent = {
  row: number;
  span?: number;
  title: string;
  sub?: string;
  attendees?: boolean;
  state?: "solid" | "ghost" | "lifted";
  dy?: number;
  /** 0..1: picked up (tilt, scale, shadow). "lifted" state is lift 1. */
  lift?: number;
  opacity?: number;
  /** Scale about the block's centre (pop-in). */
  scale?: number;
};

/** Tonight's calendar: header with a moon, evening rows on top, darker night rows below. No clock times. */
export const Calendar: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  events?: CalEvent[];
  labels?: Record<number, string>;
  free?: number;
  rows?: number;
  nightFrom?: number;
  freeOpacity?: number;
  style?: React.CSSProperties;
}> = ({
  x,
  y,
  w,
  h,
  events = [],
  labels = { 0: "Evening", 4: "Lights out" },
  free,
  rows = 6,
  nightFrom = 4,
  freeOpacity = 1,
  style,
}) => {
  const head = 120;
  const rowH = (h - head) / rows;
  const gutter = 150;
  return (
    <div
      style={{
        ...card,
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 40,
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          height: head,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          borderBottom: `2px solid ${P.hair}`,
        }}
      >
        <div>
          <div style={{ ...small }}>Calendar</div>
          <div
            style={{
              fontSize: 42,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              marginTop: 4,
            }}
          >
            Tonight
          </div>
        </div>
        <Moon size={46} />
      </div>
      <div style={{ position: "relative", height: h - head }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: nightFrom * rowH,
            bottom: 0,
            background:
              "linear-gradient(180deg, rgba(5,6,16,0.35), rgba(5,6,16,0.6))",
          }}
        />
        {Array.from({ length: rows }, (_, r) => (
          <div
            key={r}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: r * rowH,
              height: rowH,
              borderTop: r ? `2px solid ${P.hair}` : undefined,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: gutter,
                right: 0,
                top: rowH / 2,
                borderTop: `2px dashed rgba(243,238,230,0.05)`,
              }}
            />
            {labels[r] ? (
              <div
                style={{
                  ...small,
                  fontSize: 19,
                  position: "absolute",
                  left: 32,
                  top: 18,
                }}
              >
                {labels[r]}
              </div>
            ) : null}
            {r === nightFrom ? (
              <Moon
                size={22}
                color={P.dim}
                style={{ position: "absolute", left: 34, top: 50 }}
              />
            ) : null}
          </div>
        ))}
        {free !== undefined ? (
          <div
            style={{
              position: "absolute",
              left: gutter,
              right: 24,
              top: free * rowH + 12,
              height: rowH - 24,
              display: "flex",
              alignItems: "center",
              ...small,
              fontSize: 24,
              opacity: freeOpacity,
            }}
          >
            Free
          </div>
        ) : null}
        {events.map((e) => (
          <EventBlock
            key={e.title + (e.state ?? "")}
            e={e}
            top={e.row * rowH + 8 + (e.dy ?? 0)}
            left={gutter}
            right={24}
            height={(e.span ?? 1) * rowH - 16}
          />
        ))}
      </div>
    </div>
  );
};

const EventBlock: React.FC<{
  e: CalEvent;
  top: number;
  left: number;
  right: number;
  height: number;
}> = ({ e, top, left, right, height }) => {
  const ghost = e.state === "ghost";
  const l = e.lift ?? (e.state === "lifted" ? 1 : 0);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        right,
        height,
        boxSizing: "border-box",
        borderRadius: 22,
        border: ghost
          ? `${LINE}px dashed rgba(243,238,230,0.25)`
          : `${LINE}px solid rgba(243,238,230,0.55)`,
        background: ghost
          ? "transparent"
          : "linear-gradient(160deg, rgba(243,238,230,0.20), rgba(243,238,230,0.08))",
        boxShadow:
          l > 0
            ? `0 ${40 * l}px ${60 * l}px rgba(0,0,0,${0.55 * l})`
            : undefined,
        transform: `translate(${-8 * l}px, ${-6 * l}px) rotate(${-2 * l}deg) scale(${(1 + 0.04 * l) * (e.scale ?? 1)})`,
        opacity: e.opacity ?? 1,
        padding: "16px 22px 16px 34px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 8,
      }}
    >
      {ghost ? null : (
        <div
          style={{
            position: "absolute",
            left: 12,
            top: 14,
            bottom: 14,
            width: 6,
            borderRadius: 3,
            background: P.ink,
          }}
        />
      )}
      <div
        style={{
          fontSize: 30,
          fontWeight: 600,
          letterSpacing: "-0.01em",
          color: ghost ? P.dim : P.ink,
          whiteSpace: "nowrap",
        }}
      >
        {e.title}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {e.sub ? (
          <div
            style={{
              fontSize: 22,
              color: ghost ? P.faint : P.dim,
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            {e.sub}
          </div>
        ) : (
          <span />
        )}
        {e.attendees ? <Attendees count={4} size={28} /> : null}
      </div>
    </div>
  );
};

/** A worry as a small labelled pill. `x, y` is its centre. */
export const Pill: React.FC<{
  x: number;
  y: number;
  text: string;
  rot?: number;
  opacity?: number;
  scale?: number;
  tick?: boolean;
  tickScale?: number;
}> = ({ x, y, text, rot = 0, opacity = 1, scale = 1, tick, tickScale = 1 }) => {
  const surface = useSurface();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`,
        opacity,
        height: 68,
        padding: tick ? "0 14px 0 30px" : "0 30px",
        borderRadius: 34,
        boxSizing: "border-box",
        border: `${LINE}px solid rgba(243,238,230,0.4)`,
        background: surface(0.06, 0.3, 0.92),
        boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        gap: 14,
        fontFamily: fonts.sans,
        fontSize: 30,
        fontWeight: 500,
        color: P.ink,
        whiteSpace: "nowrap",
      }}
    >
      {tick ? null : (
        <span
          style={{ width: 10, height: 10, borderRadius: 5, background: P.ink }}
        />
      )}
      {text}
      {tick ? (
        <span style={{ display: "flex", transform: `scale(${tickScale})` }}>
          <Tick size={42} />
        </span>
      ) : null}
    </div>
  );
};

/** Inbox: unread dots, titles, grey preview lines, and a count badge. */
/** `rows` (fractional) is how many rows have landed; each row's unread dot pops as it lands. */
export const Inbox: React.FC<{
  x: number;
  y: number;
  w: number;
  items: string[];
  count: number;
  rows?: number;
  style?: React.CSSProperties;
}> = ({ x, y, w, items, count, rows = items.length, style }) => (
  <div
    style={{
      ...card,
      left: x,
      top: y,
      width: w,
      borderRadius: 40,
      overflow: "hidden",
      ...style,
    }}
  >
    <div
      style={{
        height: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        borderBottom: `2px solid ${P.hair}`,
      }}
    >
      <div>
        <div style={{ ...small }}>Since this morning</div>
        <div
          style={{
            fontSize: 42,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            marginTop: 4,
          }}
        >
          Inbox
        </div>
      </div>
      <div
        style={{
          minWidth: 60,
          height: 60,
          borderRadius: 30,
          background: P.ink,
          color: P.ground,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 30,
          fontWeight: 700,
        }}
      >
        {count}
      </div>
    </div>
    {items.map((t, i) => (
      <div
        key={t}
        style={{
          height: 96,
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "0 40px",
          borderTop: i ? `2px solid ${P.hair}` : undefined,
        }}
      >
        <span
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            background: P.ink,
            flex: "none",
            transform: `scale(${Math.min(1, Math.max(0, rows - i) * 1.6)})`,
          }}
        />
        <div style={{ flex: 1, opacity: Math.min(1, Math.max(0, rows - i)) }}>
          <div style={{ fontSize: 30, fontWeight: 600 }}>{t}</div>
          <div
            style={{
              marginTop: 10,
              height: 9,
              borderRadius: 5,
              width: `${70 - ((i * 17) % 35)}%`,
              background: "rgba(243,238,230,0.13)",
            }}
          />
        </div>
      </div>
    ))}
  </div>
);

export type Entry = { worry: string; step: string };

/** The two-column page: what's on your mind, and one small next step for each. */
/**
 * The two-column page. `worries` and `steps` (fractional counts) write entries in left to right, one after another;
 * `chrome` fades the divider and column labels.
 */
export const Page: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  entries: Entry[];
  worries?: number;
  steps?: number;
  chrome?: number;
  style?: React.CSSProperties;
}> = ({
  x,
  y,
  w,
  h,
  entries,
  worries = entries.length,
  steps = entries.length,
  chrome = 1,
  style,
}) => (
  <div
    style={{
      ...card,
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 34,
      border: `${LINE}px solid rgba(243,238,230,0.6)`,
      background:
        "linear-gradient(170deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))",
      ...style,
    }}
  >
    <PageHalf
      w={w}
      h={h}
      entries={entries}
      worries={worries}
      steps={steps}
      chrome={chrome}
    />
  </div>
);

/** Reveals text left to right, like it is being written. */
const writeIn = (t: number): React.CSSProperties => ({
  clipPath: `inset(-20% ${(1 - Math.min(1, Math.max(0, t))) * 100}% -20% 0)`,
});

const PageHalf: React.FC<{
  w: number;
  h: number;
  entries: Entry[];
  worries?: number;
  steps: number;
  chrome?: number;
}> = ({ w, h, entries, worries = entries.length, steps, chrome = 1 }) => {
  const col = (w - LINE * 2) / 2;
  const rowH = (h - 150) / entries.length;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: col,
          top: 26,
          height: (h - 52) * chrome,
          width: LINE,
          borderRadius: 2,
          background: "rgba(243,238,230,0.5)",
        }}
      />
      <div
        style={{
          ...small,
          fontSize: 20,
          position: "absolute",
          top: 44,
          left: 0,
          width: col,
          textAlign: "center",
          opacity: chrome,
        }}
      >
        On my mind
      </div>
      <div
        style={{
          ...small,
          fontSize: 20,
          position: "absolute",
          top: 44,
          left: col,
          width: col,
          textAlign: "center",
          opacity: chrome,
        }}
      >
        Next step
      </div>
      {entries.map((e, i) => (
        <div
          key={e.worry}
          style={{
            position: "absolute",
            top: 120 + i * rowH,
            height: rowH,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: col,
              padding: "0 30px",
              boxSizing: "border-box",
              fontSize: 28,
              fontWeight: 600,
              lineHeight: 1.15,
              ...writeIn(worries - i),
            }}
          >
            {e.worry}
          </div>
          <div
            style={{
              width: col,
              padding: "0 30px",
              boxSizing: "border-box",
              fontSize: 26,
              fontWeight: 500,
              lineHeight: 1.15,
              color: "rgba(243,238,230,0.75)",
              ...writeIn(steps - i),
            }}
          >
            {e.step}
          </div>
        </div>
      ))}
    </>
  );
};

/** The page folding in half top to bottom. `fold` 0 = flat, 1 = closed. The back of the folding half is amber. */
export const FoldingPage: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  entries: Entry[];
  fold: number;
  amber?: number;
  worries?: number;
  steps?: number;
  chrome?: number;
  style?: React.CSSProperties;
}> = ({
  x,
  y,
  w,
  h,
  entries,
  fold,
  amber = 1,
  worries,
  steps = entries.length,
  chrome,
  style,
}) => {
  const surface = useSurface();
  const half = h / 2;
  const face = {
    position: "absolute" as const,
    left: 0,
    width: w,
    height: half,
    boxSizing: "border-box" as const,
    border: `${LINE}px solid rgba(243,238,230,0.6)`,
    background: `linear-gradient(180deg, ${surface(0.12, 0.2)}, ${surface(0.09, 0.25)})`,
    overflow: "hidden",
  };
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        fontFamily: fonts.sans,
        color: P.ink,
        ...style,
      }}
    >
      {/* Bottom half stays flat. */}
      <div
        style={{
          ...face,
          top: half,
          borderRadius: "0 0 34px 34px",
          borderTop: "none",
          background: `linear-gradient(180deg, ${surface(0.09, 0.25)}, ${surface(0.06, 0.35)})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -half,
            left: 0,
            width: w,
            height: h,
          }}
        >
          <PageHalf
            w={w}
            h={h}
            entries={entries}
            worries={worries}
            steps={steps}
            chrome={chrome}
          />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, rgba(0,0,0,${0.5 * fold}), transparent 60%)`,
          }}
        />
      </div>
      {/* Top half swings down over it around the crease: squashed through zero, then flipped to show its back. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: w,
          height: half,
          transformOrigin: "50% 100%",
          transform: `scale(${1 + 0.05 * Math.sin(Math.PI * fold)}, ${Math.cos(Math.PI * fold)})`,
          filter:
            fold > 0.5
              ? "drop-shadow(0 -18px 30px rgba(0,0,0,0.45))"
              : undefined,
        }}
      >
        {fold <= 0.5 ? (
          <div
            style={{
              ...face,
              top: 0,
              borderRadius: "34px 34px 0 0",
              borderBottom: "none",
            }}
          >
            <PageHalf
              w={w}
              h={h}
              entries={entries}
              worries={worries}
              steps={steps}
              chrome={chrome}
            />
          </div>
        ) : (
          <div
            style={{
              ...face,
              top: 0,
              borderRadius: "34px 34px 0 0",
              border: "none",
              background: `linear-gradient(170deg, ${surface(0.25, 0.1)}, ${surface(0.17, 0.15)})`,
            }}
          >
            {/* The back is amber at the fold, and cools to ink afterwards. */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: amber,
                background: "linear-gradient(170deg, #F6BC7C, #E89A4E)",
                boxShadow: "inset 0 -30px 40px rgba(120,60,10,0.25)",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

/** Button pill: filled ink with dark text, or outlined. `press` 0..1 squashes it; `done` adds a tick. */
export const Button: React.FC<{
  text: string;
  filled?: boolean;
  press?: number;
  done?: boolean;
  size?: number;
}> = ({ text, filled, press = 0, done, size = 30 }) => (
  <div
    style={{
      height: size * 2.1,
      padding: `0 ${size}px`,
      borderRadius: size * 1.05,
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      gap: 12,
      fontFamily: fonts.sans,
      fontSize: size,
      fontWeight: 600,
      whiteSpace: "nowrap",
      color: filled ? P.ground : P.ink,
      background: filled ? P.ink : "transparent",
      border: filled ? "none" : `${LINE}px solid rgba(243,238,230,0.35)`,
      transform: `scale(${1 - 0.06 * press})`,
      boxShadow: filled
        ? `0 ${14 * (1 - press)}px 30px rgba(0,0,0,${0.35 * (1 - press)})`
        : undefined,
    }}
  >
    {text}
    {done ? <Tick size={size * 1.1} /> : null}
  </div>
);

/** A soft ring where a finger tapped; `x, y` is its centre. */
export const TapRing: React.FC<{
  x: number;
  y: number;
  r: number;
  opacity?: number;
}> = ({ x, y, r, opacity = 1 }) => (
  <svg
    width={x + r + 40}
    height={y + r + 40}
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      opacity,
      overflow: "visible",
    }}
  >
    <circle
      cx={x}
      cy={y}
      r={r}
      fill="rgba(243,238,230,0.10)"
      stroke="rgba(243,238,230,0.55)"
      strokeWidth={LINE}
    />
    <circle
      cx={x}
      cy={y}
      r={r + 26}
      fill="none"
      stroke="rgba(243,238,230,0.18)"
      strokeWidth={2}
    />
  </svg>
);

/** The sleep quiz as a calendar invite you'd actually accept. Calls back to the opening meeting's "Organizer: your brain". */
export const Invite: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  accepted?: boolean;
  press?: number;
  label?: string;
  sub?: string;
  action?: string;
  done?: string;
  style?: React.CSSProperties;
}> = ({
  x,
  y,
  w,
  h,
  accepted,
  press,
  label = "New invite · Organizer: you",
  sub = "Find out what's keeping you up",
  action = "Accept",
  done = "Accepted",
  style,
}) => {
  const surface = useSurface();
  return (
    <div
      style={{
        ...card,
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 40,
        border: `${LINE}px solid rgba(243,238,230,0.4)`,
        background: `linear-gradient(170deg, ${surface(0.1, 0.2, 0.97)}, ${surface(0.04, 0.4, 0.97)})`,
        boxShadow:
          "0 40px 90px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
        padding: "34px 40px",
        ...style,
      }}
    >
      <div style={{ ...small }}>{label}</div>
      <div
        style={{
          fontSize: 60,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          marginTop: 12,
        }}
      >
        Take the sleep quiz
      </div>
      <div style={{ fontSize: 32, fontWeight: 500, marginTop: 10 }}>
        {sub}
      </div>
      <div
        style={{ fontSize: 28, fontWeight: 500, color: P.dim, marginTop: 8 }}
      >
        2 minutes · link in bio
      </div>
      <div
        style={{
          position: "absolute",
          left: 40,
          bottom: 34,
          display: "flex",
          gap: 18,
        }}
      >
        <Button
          text={accepted ? done : action}
          filled
          press={press}
          done={accepted}
        />
        {accepted ? null : <Button text="Later" />}
      </div>
    </div>
  );
};
/** Centre of the Invite's Accept button, relative to the invite's top-left. */
export const inviteAccept = (h: number) => ({ x: 40 + 128, y: h - 34 - 32 });

/** The accepted quiz, booked as a calendar block. */
export const QuizBlock: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  style?: React.CSSProperties;
}> = ({ x, y, w, h, style }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      boxSizing: "border-box",
      borderRadius: 22,
      border: `${LINE}px solid rgba(243,238,230,0.55)`,
      background:
        "linear-gradient(160deg, rgba(243,238,230,0.20), rgba(243,238,230,0.08))",
      padding: "0 22px 0 34px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: 8,
      fontFamily: fonts.sans,
      color: P.ink,
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 12,
        top: 14,
        bottom: 14,
        width: 6,
        borderRadius: 3,
        background: P.ink,
      }}
    />
    <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-0.01em" }}>
      Sleep quiz · 2 min
    </div>
    <div style={{ fontSize: 22, fontWeight: 500, color: P.dim }}>
      Organizer: you
    </div>
  </div>
);

// Automations: a habit as a rule your brain set up ("When you get into bed → Wide awake"). Used by BedLearnedIt.

export type GlyphKind = "pin" | "bolt" | "moon" | "up" | "check";

/** Line icons for rule fields, drawn in the same thin stroke. */
export const Glyph: React.FC<{ kind: GlyphKind; size?: number; color?: string }> = ({ kind, size = 34, color = P.ink }) => {
  const s = { fill: "none", stroke: color, strokeWidth: 3.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ flex: "none" }}>
      {kind === "pin" ? (
        <>
          <path d="M20 36 C20 36 8 25 8 16 A12 12 0 0 1 32 16 C32 25 20 36 20 36 Z" {...s} />
          <circle cx={20} cy={16} r={4.2} {...s} />
        </>
      ) : kind === "bolt" ? (
        <path d="M23 4 L9 23 H19 L17 36 L31 17 H21 Z" {...s} />
      ) : kind === "moon" ? (
        <path d="M27 6 A15 15 0 1 0 34 26 A12 12 0 1 1 27 6 Z" {...s} />
      ) : kind === "check" ? (
        <path d="M9 21 L17 29 L32 12" {...s} />
      ) : (
        <path d="M20 34 V8 M10 18 L20 8 L30 18" {...s} />
      )}
    </svg>
  );
};

/** Round chip holding a glyph. */
const GlyphChip: React.FC<{ kind: GlyphKind; size?: number; bright?: number }> = ({ kind, size = 66, bright = 0 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      flex: "none",
      boxSizing: "border-box",
      border: `${LINE}px solid rgba(243,238,230,${0.25 + 0.5 * bright})`,
      background: `rgba(243,238,230,${0.05 + 0.12 * bright})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Glyph kind={kind} size={size * 0.52} />
  </div>
);

/** Switch. `on` 0..1 slides the knob and fills the track (amber with `amber`). */
export const Toggle: React.FC<{ on?: number; size?: number; amber?: boolean }> = ({ on = 1, size = 46, amber }) => {
  const w = size * 1.8;
  const pad = 6;
  const k = size - pad * 2 - LINE * 2;
  return (
    <div
      style={{
        position: "relative",
        width: w,
        height: size,
        borderRadius: size / 2,
        boxSizing: "border-box",
        flex: "none",
        border: `${LINE}px solid ${amber && on > 0.5 ? P.amber : `rgba(243,238,230,${0.35 + 0.4 * on})`}`,
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, opacity: on, background: amber ? P.amber : P.ink }} />
      <div
        style={{
          position: "absolute",
          top: pad,
          left: pad + (w - LINE * 2 - pad * 2 - k) * on,
          width: k,
          height: k,
          borderRadius: k / 2,
          background: on > 0.5 ? P.ground : P.ink,
          boxShadow: "0 3px 8px rgba(0,0,0,0.35)",
        }}
      />
    </div>
  );
};

export type AutoRow = { when: string; then: string; icon?: GlyphKind; thenIcon?: GlyphKind; on?: number; fire?: number; opacity?: number };

/** The list of automations, one row per rule with its switch. `fire` 0..1 lights a row as it runs. */
export const Automations: React.FC<{
  x: number;
  y: number;
  w: number;
  rows: AutoRow[];
  label?: string;
  title?: string;
  style?: React.CSSProperties;
}> = ({ x, y, w, rows, label = "Set up by your brain", title = "Automations", style }) => (
  <div style={{ ...card, left: x, top: y, width: w, borderRadius: 40, overflow: "hidden", ...style }}>
    <div
      style={{
        height: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        borderBottom: `2px solid ${P.hair}`,
      }}
    >
      <div>
        <div style={{ ...small }}>{label}</div>
        <div style={{ fontSize: 42, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 4 }}>{title}</div>
      </div>
      <div style={{ ...small, fontSize: 20 }}>{rows.filter((r) => (r.on ?? 1) > 0.5).length} on</div>
    </div>
    {rows.map((r, i) => {
      const fire = r.fire ?? 0;
      return (
        <div
          key={r.when}
          style={{
            height: 150,
            display: "flex",
            alignItems: "center",
            gap: 26,
            padding: "0 40px",
            borderTop: i ? `2px solid ${P.hair}` : undefined,
            background: `rgba(243,238,230,${0.07 * fire})`,
            opacity: r.opacity ?? 1,
          }}
        >
          <GlyphChip kind={r.icon ?? "pin"} bright={fire} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>{r.when}</div>
            <div
              style={{
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 28,
                fontWeight: 500,
                whiteSpace: "nowrap",
                color: fire > 0.5 ? P.ink : "rgba(243,238,230,0.6)",
              }}
            >
              <Glyph kind={r.thenIcon ?? "bolt"} size={26} color={fire > 0.5 ? P.ink : "rgba(243,238,230,0.6)"} />
              {r.then}
            </div>
          </div>
          <Toggle on={r.on ?? 1} />
        </div>
      );
    })}
  </div>
);

const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ ...small, fontSize: 20, marginBottom: 12 }}>{children}</div>
);

/** One rule field ("When" / "Then"): an outlined box with a glyph chip and the condition. */
const Field: React.FC<{
  icon: GlyphKind;
  text: string;
  sub?: string;
  struck?: boolean;
  fire?: number;
  amber?: boolean;
  children?: React.ReactNode;
}> = ({ icon, text, sub, struck, fire = 0, amber, children }) => (
  <div
    style={{
      borderRadius: 26,
      boxSizing: "border-box",
      border: struck
        ? `${LINE}px dashed rgba(243,238,230,0.22)`
        : `${LINE}px solid ${amber ? P.amber : `rgba(243,238,230,${0.24 + 0.4 * fire})`}`,
      background: amber ? "rgba(240,169,94,0.12)" : `rgba(243,238,230,${0.04 + 0.08 * fire})`,
      boxShadow: fire ? `0 0 0 ${12 * fire}px rgba(243,238,230,${0.07 * fire})` : undefined,
      padding: "20px 24px",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
      <GlyphChip kind={icon} bright={fire} />
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
            color: struck ? P.dim : amber ? P.amber : P.ink,
            textDecoration: struck ? "line-through" : undefined,
            textDecorationThickness: 3,
          }}
        >
          {text}
        </div>
        {sub ? <div style={{ fontSize: 24, fontWeight: 500, color: P.dim, marginTop: 6, whiteSpace: "nowrap" }}>{sub}</div> : null}
      </div>
    </div>
    {children}
  </div>
);

/** Short dotted connector with a chevron, from When down to Then. */
const Connector: React.FC = () => (
  <svg width={80} height={48} style={{ display: "block", marginLeft: 33 }}>
    <path d="M 33 4 V 40" stroke="rgba(243,238,230,0.4)" strokeWidth={LINE} strokeLinecap="round" strokeDasharray="0.1 9" />
    <path d="M 24 32 L 33 42 L 42 32" fill="none" stroke="rgba(243,238,230,0.4)" strokeWidth={LINE} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export type LogRow = { day: string; text: string; sub?: string };

/**
 * One automation, opened: When → Then, an optional run log and link meter, and who made it.
 * `logRows` (fractional) writes log rows in; `link` 0..1 fills the meter (direction only, no numbers).
 * `steps` replaces the Then field with numbered actions; `stepsShown` writes them in.
 */
export const Rule: React.FC<{
  x: number;
  y: number;
  w: number;
  title: string;
  label?: string;
  on?: number;
  when: string;
  whenIcon?: GlyphKind;
  whenSub?: string;
  then: string;
  thenIcon?: GlyphKind;
  thenSub?: string;
  thenStruck?: boolean;
  thenAmber?: boolean;
  fire?: number;
  steps?: string[];
  stepsShown?: number;
  log?: LogRow[];
  logRows?: number;
  link?: number;
  linkLabel?: string;
  /** When → Then on one line, to make room for the log and meter. */
  compact?: boolean;
  by?: string;
  runs?: string;
  style?: React.CSSProperties;
}> = ({
  x,
  y,
  w,
  title,
  label = "Automation",
  on = 1,
  when,
  whenIcon = "pin",
  whenSub,
  then,
  thenIcon = "bolt",
  thenSub,
  thenStruck,
  thenAmber,
  fire,
  steps,
  stepsShown = steps?.length ?? 0,
  log,
  logRows = log?.length ?? 0,
  link,
  linkLabel = "Link",
  compact,
  by = "Created by: your brain",
  runs = "Runs every night",
  style,
}) => (
  <div style={{ ...card, left: x, top: y, width: w, borderRadius: 40, overflow: "hidden", ...style }}>
    <div
      style={{
        height: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        borderBottom: `2px solid ${P.hair}`,
      }}
    >
      <div>
        <div style={{ ...small }}>{label}</div>
        <div style={{ fontSize: 42, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 4, whiteSpace: "nowrap" }}>{title}</div>
      </div>
      <Toggle on={on} />
    </div>
    <div style={{ padding: "30px 40px 34px" }}>
      {compact ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "20px 24px",
            borderRadius: 26,
            border: `${LINE}px solid rgba(243,238,230,${0.24 + 0.4 * (fire ?? 0)})`,
            background: `rgba(243,238,230,${0.04 + 0.08 * (fire ?? 0)})`,
            fontSize: 34,
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          <GlyphChip kind={whenIcon} size={58} />
          {when}
          <svg width={54} height={24} style={{ flex: "none" }}>
            <path d="M 4 12 H 46 M 36 3 L 47 12 L 36 21" fill="none" stroke={P.dim} strokeWidth={LINE} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <GlyphChip kind={thenIcon} size={58} bright={fire} />
          {then}
        </div>
      ) : (
        <>
          <FieldLabel>When</FieldLabel>
          <Field icon={whenIcon} text={when} sub={whenSub} />
          <Connector />
          <FieldLabel>Then</FieldLabel>
        </>
      )}
      {compact ? null : steps ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {steps.map((s, i) => (
            <div
              key={s}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                height: 88,
                padding: "0 24px",
                borderRadius: 26,
                boxSizing: "border-box",
                border: `${LINE}px solid rgba(243,238,230,0.24)`,
                background: "rgba(243,238,230,0.04)",
                opacity: Math.min(1, Math.max(0, (stepsShown - i) * 2)),
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 23,
                  flex: "none",
                  background: P.ink,
                  color: P.ground,
                  fontSize: 26,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {i + 1}
              </div>
              <div style={{ fontSize: 32, fontWeight: 600, whiteSpace: "nowrap", ...writeIn(stepsShown - i) }}>{s}</div>
            </div>
          ))}
        </div>
      ) : (
        <Field icon={thenIcon} text={then} sub={thenSub} struck={thenStruck} amber={thenAmber} fire={fire} />
      )}
      {log ? (
        <div style={{ marginTop: 30 }}>
          <FieldLabel>Run log</FieldLabel>
          {log.map((r, i) => (
            <div
              key={r.day + r.text}
              style={{
                display: "flex",
                alignItems: "center",
                height: 64,
                borderTop: i ? `2px solid ${P.hair}` : undefined,
                opacity: Math.min(1, Math.max(0, (logRows - i) * 2)),
              }}
            >
              <span style={{ width: 12, height: 12, borderRadius: 6, background: P.ink, flex: "none", marginRight: 18 }} />
              <div style={{ ...small, fontSize: 20, width: 150, flex: "none" }}>{r.day}</div>
              <div style={{ fontSize: 28, fontWeight: 500, whiteSpace: "nowrap", ...writeIn(logRows - i) }}>{r.text}</div>
            </div>
          ))}
        </div>
      ) : null}
      {link !== undefined ? (
        <div style={{ marginTop: 30 }}>
          <FieldLabel>{linkLabel}</FieldLabel>
          <div style={{ position: "relative", height: 16, borderRadius: 8, background: "rgba(243,238,230,0.1)", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.max(0, Math.min(1, link)) * 100}%`, borderRadius: 8, background: P.ink }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 22, fontWeight: 500, color: P.dim }}>
            <span>Weak</span>
            <span>Strong</span>
          </div>
        </div>
      ) : null}
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "22px 40px",
        borderTop: `2px solid ${P.hair}`,
        fontSize: 24,
        fontWeight: 500,
        color: P.dim,
        whiteSpace: "nowrap",
      }}
    >
      <span>{by}</span>
      <span>{runs}</span>
    </div>
  </div>
);

/** The sleep quiz as an automation you switch on yourself. Calls back to "Created by: your brain". */
export const QuizRule: React.FC<{ x: number; y: number; w: number; h: number; on?: number; style?: React.CSSProperties }> = ({
  x,
  y,
  w,
  h,
  on = 0,
  style,
}) => {
  const surface = useSurface();
  return (
    <div
      style={{
        ...card,
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 40,
        border: `${LINE}px solid rgba(243,238,230,0.4)`,
        background: `linear-gradient(170deg, ${surface(0.1, 0.2, 0.97)}, ${surface(0.04, 0.4, 0.97)})`,
        boxShadow: "0 40px 90px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
        padding: "34px 40px",
        ...style,
      }}
    >
      <div style={{ ...small }}>New automation · Created by: you</div>
      <div style={{ fontSize: 60, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 12 }}>Take the sleep quiz</div>
      <div style={{ fontSize: 32, fontWeight: 500, marginTop: 10 }}>Find your sleep pattern</div>
      <div style={{ fontSize: 28, fontWeight: 500, color: P.dim, marginTop: 8 }}>2 minutes · link in bio</div>
      <div
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          bottom: 34,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 26,
          borderTop: `2px solid ${P.hair}`,
        }}
      >
        <div style={{ fontSize: 30, fontWeight: 600 }}>{on > 0.5 ? "On · tonight" : "Turn on"}</div>
        <Toggle on={on} size={56} />
      </div>
    </div>
  );
};
/** Centre of the QuizRule's switch, relative to the card's top-left. */
export const quizToggle = (w: number, h: number) => ({ x: w - 40 - 50, y: h - 34 - 28 });

/** Analog clock for spans of time ("staying in bed longer"). `minutes` sets the hands; tick it forward to show time passing. */
// `moon` marks bedtime at the top of the dial; `wedge` shades a span of the dial (`from`/`to` in dial hours, 0–12, amber
// once per video); `ghost` draws a dashed minute hand where it would have been (WarmShower: "ten minutes faster").
export const Clock: React.FC<{
  size: number;
  minutes: number;
  moon?: number;
  wedge?: { from: number; to: number; amber?: boolean; o?: number };
  ghost?: number;
  style?: React.CSSProperties;
}> = ({ size, minutes, moon = 0, wedge, ghost, style }) => {
  const surface = useSurface();
  const u = 200 / size; // viewBox units per pixel, so strokes stay ~LINE px on screen
  const hand = (deg: number, len: number, width: number) => (
    <line x1={100} y1={100} x2={100 + len * Math.sin((deg * Math.PI) / 180)} y2={100 - len * Math.cos((deg * Math.PI) / 180)} stroke={P.ink} strokeWidth={width} strokeLinecap="round" />
  );
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible", ...style }}>
      <circle cx={100} cy={100} r={94} fill={surface(0.06, 0.3, 0.92)} stroke="rgba(243,238,230,0.6)" strokeWidth={LINE * u} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        const r0 = i % 3 === 0 ? 72 : 78;
        return (
          <line
            key={i}
            x1={100 + r0 * Math.sin(a)}
            y1={100 - r0 * Math.cos(a)}
            x2={100 + 85 * Math.sin(a)}
            y2={100 - 85 * Math.cos(a)}
            stroke={i % 3 === 0 ? "rgba(243,238,230,0.7)" : "rgba(243,238,230,0.3)"}
            strokeWidth={(i % 3 === 0 ? LINE : 2) * u}
            strokeLinecap="round"
          />
        );
      })}
      {wedge && (wedge.o ?? 1) > 0.001 && wedge.to > wedge.from ? (
        (() => {
          const at = (h: number, r: number) => [100 + r * Math.sin((h * 30 * Math.PI) / 180), 100 - r * Math.cos((h * 30 * Math.PI) / 180)];
          const [x0, y0] = at(wedge.from, 86);
          const [x1, y1] = at(wedge.to, 86);
          const big = wedge.to - wedge.from > 6 ? 1 : 0;
          const c = wedge.amber ? P.amber : "rgba(243,238,230,1)";
          return (
            <path
              d={`M 100 100 L ${x0} ${y0} A 86 86 0 ${big} 1 ${x1} ${y1} Z`}
              fill={c}
              fillOpacity={wedge.amber ? 0.4 : 0.2}
              stroke={c}
              strokeOpacity={wedge.amber ? 0.9 : 0.5}
              strokeWidth={2 * u}
              strokeLinejoin="round"
              opacity={wedge.o ?? 1}
            />
          );
        })()
      ) : null}
      {moon > 0.001 ? (
        <path d="M27 5 A16 16 0 1 0 35 27 A13 13 0 1 1 27 5 Z" fill={P.ink} transform="translate(86 34) scale(0.7)" opacity={moon} />
      ) : null}
      {ghost !== undefined ? (
        <line
          x1={100}
          y1={100}
          x2={100 + 70 * Math.sin((ghost * 6 * Math.PI) / 180)}
          y2={100 - 70 * Math.cos((ghost * 6 * Math.PI) / 180)}
          stroke="rgba(243,238,230,0.55)"
          strokeWidth={3 * u}
          strokeLinecap="round"
          strokeDasharray={`${6 * u} ${8 * u}`}
        />
      ) : null}
      {hand(minutes * 0.5, 46, 7 * u)}
      {hand(minutes * 6, 70, 4 * u)}
      <circle cx={100} cy={100} r={7} fill={P.ink} />
    </svg>
  );
};

/** A week of nights, Mon–Sun. `marked` (fractional) marks nights awake one by one: the moon gives way to a bolt. */
export const WeekNights: React.FC<{ x: number; y: number; w: number; marked: number; label?: string; title?: string; style?: React.CSSProperties }> = ({
  x,
  y,
  w,
  marked,
  label = "This week",
  title = "Nights",
  style,
}) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div style={{ ...card, left: x, top: y, width: w, borderRadius: 40, overflow: "hidden", ...style }}>
      <div style={{ height: 96, display: "flex", alignItems: "center", padding: "0 36px", borderBottom: `2px solid ${P.hair}` }}>
        <div>
          <div style={{ ...small, fontSize: 20 }}>{label}</div>
          <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 2 }}>{title}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, padding: "22px 30px 28px" }}>
        {days.map((d, i) => {
          const m = Math.min(1, Math.max(0, marked - i));
          return (
            <div key={d} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{ ...small, fontSize: 19, letterSpacing: "0.08em" }}>{d}</div>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: 116,
                  borderRadius: 22,
                  boxSizing: "border-box",
                  border: `${LINE}px solid rgba(243,238,230,${0.16 + 0.4 * m})`,
                  background: `rgba(243,238,230,${0.03 + 0.13 * m})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ position: "absolute", opacity: 1 - m }}>
                  <Moon size={26} color={P.dim} />
                </div>
                <div style={{ position: "absolute", opacity: m, transform: `scale(${0.5 + 0.5 * m})` }}>
                  <Glyph kind="bolt" size={38} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * The back of the beach postcard (PictureAPlace's quiz CTA): stamp, message, address lines. `postmark` 0..1 thumps the
 * "Link in bio" postmark onto the stamp. Fills its parent box (the stage).
 */
export const PostcardBack: React.FC<{ w: number; h: number; postmark?: number }> = ({ w, h, postmark = 0 }) => {
  const s = useSurface();
  const pm = Math.min(1, Math.max(0, postmark));
  const ruled = (text: string, dim?: boolean) => (
    <div style={{ borderBottom: `2px solid rgba(243,238,230,0.25)`, padding: "0 0 14px", marginTop: 34, fontSize: 38, fontWeight: 500, color: dim ? P.dim : P.ink }}>
      {text}
    </div>
  );
  return (
    <div
      style={{
        position: "relative",
        width: w,
        height: h,
        borderRadius: 45,
        boxSizing: "border-box",
        border: `${LINE}px solid rgba(243,238,230,0.4)`,
        background: `linear-gradient(170deg, ${s(0.1, 0.2, 0.97)}, ${s(0.04, 0.4, 0.97)})`,
        boxShadow: "0 40px 90px rgba(0,0,0,0.5)",
        fontFamily: fonts.sans,
        color: P.ink,
        padding: "60px 60px 0",
      }}
    >
      {/* Stamp: a tiny beach behind a perforated edge. */}
      <div style={{ position: "absolute", right: 56, top: 56, width: 132, height: 160, borderRadius: 12, border: `${LINE}px dashed rgba(243,238,230,0.55)`, padding: 9, boxSizing: "border-box" }}>
        <svg width="100%" height="100%" viewBox="0 0 100 130" preserveAspectRatio="none" style={{ display: "block", borderRadius: 6 }}>
          <rect width={100} height={130} fill={s(0.2, 0.15)} />
          <path d="M 0 82 C 20 76, 40 90, 60 82 S 90 76, 100 84 L 100 130 L 0 130 Z" fill={s(0.04, 0.55)} />
          <path d="M 0 82 C 20 76, 40 90, 60 82 S 90 76, 100 84" fill="none" stroke={P.ink} strokeWidth={2.5} />
          <circle cx={50} cy={46} r={8} fill={P.ink} />
        </svg>
      </div>
      {/* Postmark, thumped on over the stamp's corner. */}
      {pm > 0 ? (
        <div
          style={{
            position: "absolute",
            right: 120,
            top: 150,
            width: 168,
            height: 168,
            borderRadius: 84,
            border: `${LINE}px solid rgba(243,238,230,0.85)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            lineHeight: 1.15,
            opacity: Math.min(1, pm * 2),
            transform: `rotate(-14deg) scale(${1.5 - 0.5 * pm})`,
            background: "rgba(11,12,20,0.35)",
          }}
        >
          Link
          <br />
          in bio
        </div>
      ) : null}
      <div style={{ ...small, fontSize: 24 }}>Wish you were asleep</div>
      <div style={{ fontSize: 76, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.02, marginTop: 150 }}>
        Take the
        <br />
        sleep quiz
      </div>
      <div style={{ fontSize: 38, fontWeight: 500, marginTop: 22 }}>See what's keeping you up.</div>
      <div style={{ marginTop: 40 }}>
        {ruled("To: you")}
        {ruled("Link in bio", true)}
      </div>
    </div>
  );
};
