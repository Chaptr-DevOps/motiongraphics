import "./brand/fonts";
import { Composition } from "remotion";
import { reel, sec } from "./brand/theme";
import { CANT_FALL_BACK_ASLEEP_SECONDS, CantFallBackAsleep } from "./compositions/CantFallBackAsleep";
import { SLEEP_TRACKERS_SECONDS, SleepTrackers } from "./compositions/SleepTrackers";
import { CharacterSheet, SHEET } from "./compositions/CharacterSheet";
import { StyleFrames } from "./compositions/StyleFrames";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="StyleFrames" component={StyleFrames} durationInFrames={4} {...reel} />
      <Composition id="CharacterSheet" component={CharacterSheet} durationInFrames={30} fps={30} {...SHEET} />
      <Composition
        id="SleepTrackers"
        component={SleepTrackers}
        durationInFrames={sec(SLEEP_TRACKERS_SECONDS)}
        {...reel}
        defaultProps={{ supers: true }}
      />
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
