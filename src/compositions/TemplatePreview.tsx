// Preview of the first four templates back to back, with data from the scripts. For review, not for posting.
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { ease, sec } from "../brand/theme";
import { Backdrop } from "../components/premium";
import { BedtimeWeek } from "../templates/BedtimeWeek";
import { CompareCards } from "../templates/CompareCards";
import { DialHook } from "../templates/DialHook";
import { SceneShell } from "../templates/motion";
import { StatCounter } from "../templates/StatCounter";

const SCENE = 6.5;
export const TEMPLATE_PREVIEW_SECONDS = SCENE * 4;

// The background's light source glides between positions as scenes change.
const glowKeys: Array<[number, number, number]> = [
  [0, 50, 60],
  [1, 50, 30],
  [2, 50, 55],
  [3, 70, 48],
];

const MovingBackdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / sec(SCENE);
  const i = Math.min(glowKeys.length - 2, Math.floor(t));
  const local = interpolate(t - i, [0.9, 1.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.inOutCubic });
  const [, x0, y0] = glowKeys[i];
  const [, x1, y1] = glowKeys[i + 1];
  return <Backdrop glowX={x0 + (x1 - x0) * local} glowY={y0 + (y1 - y0) * local} />;
};

export const TemplatePreview: React.FC = () => {
  const d = sec(SCENE);
  return (
    <AbsoluteFill>
      <MovingBackdrop />
      <Sequence durationInFrames={d}>
        <SceneShell duration={d} enter={false}>
          <DialHook
            eyebrow="Sleep trackers"
            headline="There's a number *more important* than REM."
            start={{ label: "Fell asleep", time: "11:48 PM", hour: 11.8 }}
            end={{ label: "Woke up", time: "7:02 AM", hour: 7.03 }}
            center={{ label: "REM", value: "1h 42m" }}
          />
        </SceneShell>
      </Sequence>
      <Sequence from={d} durationInFrames={d}>
        <SceneShell duration={d}>
          <StatCounter
            eyebrow="One study · UK Biobank"
            value={60000}
            caption="people. Steady timing predicted health *better than hours slept.*"
            citation="Windred et al., Sleep, 2024"
          />
        </SceneShell>
      </Sequence>
      <Sequence from={d * 2} durationInFrames={d}>
        <SceneShell duration={d}>
          <BedtimeWeek
            eyebrow="Your week"
            headline="Look at your *bedtimes.*"
            headlineAfter="Shrink the *swing.*"
            hours={["10 PM", "11 PM", "12 AM", "1 AM", "2 AM"]}
            days={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
            bedtimes={[1.0, 1.5, 0.75, 2.1, 1.2, 2.6, 0.9]}
            swingLabel="Swings 1h 51m"
            target={1.0}
            alignedLabel="Same time, every night"
          />
        </SceneShell>
      </Sequence>
      <Sequence from={d * 3} durationInFrames={d}>
        <SceneShell duration={d} exit={false}>
          <CompareCards
            eyebrow="Baylor sleep lab"
            headline="Write *tomorrow's list,* not today's."
            left={{ title: "What's done", items: ["Finished the report", "Gym", "Groceries"] }}
            right={{ title: "What's next", items: ["Email Sarah about Friday", "Book the dentist", "Call Mom back"] }}
            result={{ value: 9, prefix: "−", unit: "min", label: "to fall asleep" }}
          />
        </SceneShell>
      </Sequence>
    </AbsoluteFill>
  );
};
