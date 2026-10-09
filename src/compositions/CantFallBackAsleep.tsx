// "The 3 a.m. script": the brief's worked example (section 10).
// Timings are PLACEHOLDERS on the brief's beat grid. Retime to the recorded voiceover.
import { AbsoluteFill, Sequence } from "remotion";
import { photos } from "../brand/photos";
import { palettes, sec } from "../brand/theme";
import { GlassPanel, Label, StepRow } from "../components/Glass";
import { PhotoBackground } from "../components/PhotoBackground";
import { Scene } from "../components/Scene";
import { Super } from "../components/Super";
import { WaitlistPanel } from "../components/WaitlistPanel";
import { PaletteContext, SupersContext } from "../lib/animation";

export type CantFallBackAsleepProps = { supers: boolean };

export const CANT_FALL_BACK_ASLEEP_SECONDS = 34;

const moonDrift = { from: [-1.5, 1] as [number, number], to: [1.5, -1] as [number, number] };

export const CantFallBackAsleep: React.FC<CantFallBackAsleepProps> = ({ supers }) => {
  return (
    <PaletteContext.Provider value={palettes.night}>
      <SupersContext.Provider value={supers}>
        <AbsoluteFill style={{ backgroundColor: palettes.night.ground }}>
          {/* 0:00–0:12 Hook, transition, body on the crescent moon. Punch-in on "waiting". */}
          <Scene
            from={0}
            to={12.25}
            transitionOut
            zoom={[
              [3.25, 1],
              [3.65, 1.06],
              [5.7, 1.06],
              [6.0, 1],
            ]}
          >
            <PhotoBackground photo={photos.moon} blur={25} calm={0.4} drift={moonDrift} driftSeconds={14} />
            <Super from={0} to={3} variant="hook" y={1150} text="Can't fall back *asleep?*" />
            <Super from={3} to={6} y={1150} text="Stop *waiting* in bed." />
            <Super from={6} to={11.75} y={1150} text="It feels like *resting.*" />
          </Scene>

          {/* 0:12–0:30 Lake. "awake" is the video's one amber accent; slow push-in; the fix as a glass panel. */}
          <Scene
            from={11.75}
            to={30.1}
            transitionIn
            transitionOut
            zoom={[
              [6.25, 1],
              [12.25, 1.06],
              [12.85, 1],
            ]}
          >
            <PhotoBackground photo={photos.lake} blur={40} drift={{ from: [0, -1.5], to: [0, 1.5] }} driftSeconds={18} />
            <Super from={0.5} to={6.25} accent text="Bed starts to mean *awake.*" />
            <Super from={6.25} to={12.25} text="Harder to *drift off.*" />
            <Sequence from={sec(12.25)}>
              <GlassPanel>
                <Label>If you can&apos;t sleep</Label>
                <StepRow enterAt={18} text="Get up" />
                <StepRow enterAt={42} text="Lights low" />
                <StepRow enterAt={66} text="Back when heavy" />
              </GlassPanel>
            </Sequence>
          </Scene>

          {/* 0:30–0:34 Back on the opening moon framing. Loop line, then the waitlist call to action. */}
          <Scene from={29.6} to={CANT_FALL_BACK_ASLEEP_SECONDS} transitionIn>
            <PhotoBackground photo={photos.moon} blur={25} calm={0.4} drift={moonDrift} driftSeconds={14} />
            <Super from={0.5} to={1.4} y={1150} text="So *tonight...*" />
            <Sequence from={sec(1.4)}>
              <WaitlistPanel />
            </Sequence>
          </Scene>
        </AbsoluteFill>
      </SupersContext.Provider>
    </PaletteContext.Provider>
  );
};
