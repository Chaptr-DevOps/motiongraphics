import { useCurrentFrame } from "remotion";
import { motion, type } from "../brand/theme";
import { progress, usePalette } from "../lib/animation";
import { GlassPanel, Label, Pill } from "./Glass";
import { parse } from "./Super";

/** The closing call to action: label, two-tone headline (*key* words), "Join the waitlist" pill with a soft tap. */
export const WaitlistPanel: React.FC<{ headline?: string; tapAt?: number }> = ({
  headline = "A calmer way *back to sleep.*",
  tapAt = 36,
}) => {
  const frame = useCurrentFrame();
  const palette = usePalette();
  const textP = progress(frame, motion.panelIn - 3, motion.wordReveal + 3);
  const pillP = progress(frame, motion.panelIn + 6, motion.wordReveal + 3);

  return (
    <GlassPanel>
      <div style={{ opacity: textP }}>
        <Label>NightShift waitlist</Label>
        <div style={{ ...type.body, fontSize: 84, marginBottom: 64 }}>
          {parse(headline).map((w, i) => (
            <span
              key={i}
              style={{ display: "inline-block", color: w.key ? palette.primary : palette.muted, marginRight: "0.24em" }}
            >
              {w.text}
            </span>
          ))}
        </div>
      </div>
      <div style={{ opacity: pillP, transform: `translateY(${(1 - pillP) * 12}px)` }}>
        <Pill label="Join the waitlist" tapAt={tapAt} />
      </div>
    </GlassPanel>
  );
};
