import { Composition } from "remotion";
import { reel } from "./brand/theme";
import { StarterReel } from "./compositions/StarterReel";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="StarterReel"
        component={StarterReel}
        durationInFrames={300}
        {...reel}
        defaultProps={{
          hook: "Can't switch off after a night shift?",
          cta: "Download free today",
        }}
      />
    </>
  );
};
