import "./brand/fonts";
import { Composition } from "remotion";
import { reel, sec } from "./brand/theme";
import { CANT_FALL_BACK_ASLEEP_SECONDS, CantFallBackAsleep } from "./compositions/CantFallBackAsleep";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CantFallBackAsleep"
        component={CantFallBackAsleep}
        durationInFrames={sec(CANT_FALL_BACK_ASLEEP_SECONDS)}
        {...reel}
        defaultProps={{ supers: true }}
      />
      <Composition
        id="CantFallBackAsleep-Textless"
        component={CantFallBackAsleep}
        durationInFrames={sec(CANT_FALL_BACK_ASLEEP_SECONDS)}
        {...reel}
        defaultProps={{ supers: false }}
      />
    </>
  );
};
