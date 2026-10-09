import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { ease, motion, sec } from "../brand/theme";
import { keyframes, progress } from "../lib/animation";

type Props = {
  /** Seconds on the master timeline. Everything inside is timed from the scene start. */
  from: number;
  to: number;
  /** Crossfade in over the previous scene with a blur dip. Off for the first scene. */
  transitionIn?: boolean;
  /** Blur up while the next scene fades in on top. */
  transitionOut?: boolean;
  /** Camera scale keys as [seconds from scene start, scale]. Punch-ins and push-ins. */
  zoom?: Array<[number, number]>;
  children: React.ReactNode;
};

const DIP_BLUR = 16;

const SceneInner: React.FC<Omit<Props, "from" | "to"> & { duration: number }> = ({
  duration,
  transitionIn,
  transitionOut,
  zoom,
  children,
}) => {
  const frame = useCurrentFrame();
  const T = motion.sceneTransition;

  const inP = transitionIn ? progress(frame, 0, T, ease.inOut) : 1;
  const outP = transitionOut ? progress(frame, duration - T, T, ease.inOut) : 0;
  const blur = (1 - inP) * DIP_BLUR + outP * DIP_BLUR;

  const scale = zoom
    ? keyframes(
        frame,
        zoom.map(([s, v]) => [sec(s), v, ease.out]),
      )
    : 1;

  return (
    <AbsoluteFill
      style={{
        opacity: inP,
        filter: blur > 0.1 ? `blur(${blur}px)` : undefined,
        transform: scale !== 1 ? `scale(${scale})` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const Scene: React.FC<Props> = ({ from, to, ...rest }) => {
  const start = sec(from);
  const duration = sec(to) - start;
  return (
    <Sequence from={start} durationInFrames={duration}>
      <SceneInner duration={duration} {...rest} />
    </Sequence>
  );
};
