// Floor-plan iterations for BedLearnedIt, all on the hook beat: A refined plan, B angled model, C room tiles, D bedroom close-up.
// (Lived-in rooms and room + rule card were the other two directions; the user picked the plan, Oct 15.)
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PhotoBackground } from "../components/PhotoBackground";
import { SurfaceTint } from "../components/objects";
import { FloorPlan } from "../components/rooms";
import { HeadlineIn } from "../templates/motion";
import { PHOTO, TINT } from "./BedLearnedItBoard";

export const STYLE_OPTIONS = 4;
const HOOK = "Couch: sleepy. *Bed: wide awake.*";

const TAGS = [
  { at: "couch" as const, text: "Drifting off", icon: "moon" as const, dy: -88 },
  { at: "bed" as const, text: "Wide awake", dy: 100 },
];

const options: Array<() => React.ReactNode> = [
  // A. Refined plan with map tags.
  () => (
    <div style={{ position: "absolute", left: 166, top: 640 }}>
      <FloorPlan w={680} glow="bed" path tags={TAGS} />
    </div>
  ),
  // B. Angled model with raised walls.
  () => (
    <div style={{ position: "absolute", left: 40, top: 700 }}>
      <FloorPlan w={900} glow="bed" path variant="iso" tags={TAGS} />
    </div>
  ),
  // C. Separate room tiles, like a smart-home room map.
  () => (
    <div style={{ position: "absolute", left: 166, top: 650 }}>
      <FloorPlan w={680} glow="bed" variant="tiles" tags={TAGS} />
    </div>
  ),
  // D. Bedroom only, close up; zooms out to the full plan later.
  () => (
    <div style={{ position: "absolute", left: 196, top: 640 }}>
      <FloorPlan w={620} glow="bed" view={{ x: 374, y: 4, w: 342, h: 452 }} tags={[TAGS[1]]} />
    </div>
  ),
];

export const BedLearnedItStyles: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SurfaceTint.Provider value={TINT}>
      <AbsoluteFill>
        <PhotoBackground photo={PHOTO} blur={44} calm={0.5} saturation={0.7} />
        <AbsoluteFill style={{ background: "linear-gradient(170deg, rgba(255,255,255,0.05), rgba(5,6,16,0.3))" }} />
        {options[Math.min(frame, options.length - 1)]()}
        <HeadlineIn y={360} size={100} text={HOOK} at={-3} align="center" />
      </AbsoluteFill>
    </SurfaceTint.Provider>
  );
};
