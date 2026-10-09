import { createContext, useContext } from "react";
import { interpolate } from "remotion";
import type { EasingFunction } from "remotion";
import { ease, palettes } from "../brand/theme";
import type { Palette } from "../brand/theme";

export const PaletteContext = createContext<Palette>(palettes.night);
export const usePalette = () => useContext(PaletteContext);

// Turns supers off for the textless deliverable.
export const SupersContext = createContext(true);

export type Key = [frame: number, value: number, easing?: EasingFunction];

// Multi-segment keyframes; each key's easing applies to the segment arriving at it.
export const keyframes = (frame: number, keys: Key[]): number => {
  if (frame <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [f0, v0] = keys[i - 1];
    const [f1, v1, easing] = keys[i];
    if (frame <= f1) {
      return interpolate(frame, [f0, f1], [v0, v1], { easing: easing ?? ease.inOut });
    }
  }
  return keys[keys.length - 1][1];
};

export const progress = (frame: number, start: number, duration: number, easing: EasingFunction = ease.out) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
