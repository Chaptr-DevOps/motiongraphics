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
const useSurface = () => {
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
  style?: React.CSSProperties;
}> = ({ x, y, w, h, accepted, press, style }) => {
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
      <div style={{ ...small }}>New invite · Organizer: you</div>
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
        Find out what's keeping you up
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
          text={accepted ? "Accepted" : "Accept"}
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
