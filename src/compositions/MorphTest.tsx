// Motion test, no script: one dot goes through seven morphs and returns to a dot. Labels are placeholders that name the move.
// Three text layouts to compare: "left" (fixed top-left), "center" (fixed top, centred), "swap" (centred, text and hero trade places).
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { sec } from "../brand/theme";
import { Hero } from "../components/Morph";
import { Backdrop } from "../components/premium";
import { crescent, dot, line, ring, wave } from "../lib/morph";
import type { Stage } from "../lib/morph";
import { EyebrowIn, HeadlineIn } from "../templates/motion";

export const MORPH_TEST_SECONDS = 13.6;
export type MorphLayout = "left" | "center" | "swap";

const CX = 506;
const X0 = 150;
const X1 = 862;
const OUTLINE = 12;

const T = { line: 1.6, wave: 3.2, ring: 5.0, disc: 6.6, moon: 8.0, gather: 9.4, seven: 9.9, one: 11.8 };

// Where the text sits on each beat. The hero takes the other half of the frame.
const TOP = { text: 360, hero: 1100 };
const BOTTOM = { text: 1270, hero: 800 };
const FIXED = { text: 360, hero: 1060 };
const beats = (layout: MorphLayout) => {
  const [a, b] = layout === "swap" ? [TOP, BOTTOM] : [FIXED, FIXED];
  // Swaps come in uneven groups, not strict top/bottom alternation, and the last beat returns to the opening position.
  return { dot: a, line: a, wave: b, ring: b, disc: a, moon: a, seven: b, one: a };
};

const buildStages = (layout: MorphLayout): Stage[] => {
  const at = beats(layout);
  return [
    { at: 0, shape: () => dot(CX, at.dot.hero), look: { width: 72, fill: 0, dots: 0, amber: 0 } },
    {
      at: T.line,
      shape: () => line(X0, at.line.hero, X1, at.line.hero),
      look: { width: OUTLINE, fill: 0, dots: 0, amber: 0 },
      stagger: (u) => Math.abs(u - 0.5) * 4,
    },
    {
      at: T.wave,
      shape: (f) => wave(X0, X1, at.wave.hero, 150, 2, (f - sec(T.wave)) * 0.1),
      look: { width: OUTLINE, fill: 0, dots: 0, amber: 0 },
      stagger: (u) => u * 12,
    },
    {
      at: T.ring,
      // Breathes while it holds.
      shape: (f) => ring(CX, at.ring.hero, 240 * (1 + 0.05 * Math.sin(((f - sec(T.ring)) / 54) * Math.PI * 2))),
      look: { width: OUTLINE, fill: 0, dots: 0, amber: 0 },
      stagger: (u) => Math.abs(u - 0.5) * 8,
      spring: { damping: 14, stiffness: 90, mass: 1 },
    },
    { at: T.disc, shape: () => ring(CX, at.disc.hero, 200), look: { width: OUTLINE, fill: 1, dots: 0, amber: 0 } },
    {
      at: T.moon,
      shape: () => crescent(CX, at.moon.hero, 220),
      look: { width: OUTLINE, fill: 1, dots: 0, amber: 1 },
      spring: { damping: 12, stiffness: 100, mass: 1 },
    },
    // The moon pulls in to a single amber dot, so the split starts from one clean point.
    {
      at: T.gather,
      shape: () => dot(CX, at.moon.hero),
      look: { width: 60, fill: 1, dots: 0, amber: 1 },
      spring: { damping: 15, stiffness: 150, mass: 0.8 },
    },
    {
      at: T.seven,
      snap: true,
      // A ripple runs along the row so the dots keep bobbing.
      shape: (f) =>
        line(X0, at.seven.hero, X1, at.seven.hero).map(([x, y], k, all) => [
          x,
          y + Math.sin((k / all.length) * Math.PI * 2 - (f - sec(T.seven)) * 0.16) * 30,
        ]),
      look: { width: 46, fill: 0, dots: 1, amber: 0 },
      stagger: (u) => u * 8,
    },
    {
      at: T.one,
      shape: () => dot(CX, at.one.hero),
      look: { width: 72, fill: 0, dots: 1, amber: 0 },
      stagger: (u) => Math.abs(u - 0.5) * 12,
      spring: { damping: 11, stiffness: 130, mass: 0.9 },
    },
  ];
};

const buildLabels = (layout: MorphLayout): Array<{ at: number; out: number; y: number; text: string; accent?: boolean }> => {
  const at = beats(layout);
  return [
    { at: 0.3, out: T.line - 0.4, y: at.dot.text, text: "One *dot.*" },
    { at: T.line + 0.1, out: T.wave - 0.4, y: at.line.text, text: "Stretches into a *line.*" },
    { at: T.wave + 0.1, out: T.ring - 0.4, y: at.wave.text, text: "Bends into a *wave.*" },
    { at: T.ring + 0.1, out: T.disc - 0.4, y: at.ring.text, text: "Closes into a *ring.*" },
    { at: T.disc + 0.1, out: T.moon - 0.4, y: at.disc.text, text: "Fills *up.*" },
    { at: T.moon + 0.1, out: T.seven - 0.4, y: at.moon.text, text: "Turns into a *moon.*", accent: true },
    { at: T.seven + 0.1, out: T.one - 0.4, y: at.seven.text, text: "Splits into *seven.*" },
    { at: T.one + 0.1, out: MORPH_TEST_SECONDS - 0.4, y: at.one.text, text: "And back to *one.*" },
  ];
};

export const MorphTest: React.FC<{ layout: MorphLayout }> = ({ layout }) => {
  const frame = useCurrentFrame();
  const startY = beats(layout).dot.hero;
  // Entry: the dot drops in, bounces, and squashes on each landing.
  const drop = interpolate(frame, [4, 40], [0, 1], { easing: Easing.bounce, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t = interpolate(frame, [4, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const squash = [
    [0.364, 0.3],
    [0.727, 0.16],
    [0.909, 0.07],
  ].reduce((sum, [hit, amount]) => sum + amount * Math.exp(-(((t - hit) / 0.035) ** 2)), 0);
  const transform = `translateY(${(drop - 1) * 760}px) scale(${1 + squash * 0.7}, ${1 - squash})`;
  return (
    <AbsoluteFill>
      <Backdrop glowY={50} />
      <Hero stages={buildStages(layout)} transform={transform} origin={`${CX}px ${startY + 36}px`} />
      {layout === "left" ? <EyebrowIn y={300} text="Motion test" at={0.2} /> : null}
      {buildLabels(layout).map((label) => (
        <HeadlineIn
          key={label.at}
          y={label.y}
          size={100}
          text={label.text}
          at={label.at}
          out={label.out}
          accent={label.accent}
          align={layout === "left" ? "left" : "center"}
        />
      ))}
    </AbsoluteFill>
  );
};
