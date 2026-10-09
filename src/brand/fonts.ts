// Loads Instrument Sans (variable font) from public/brand/fonts before any frame renders.
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

const faces = [
  new FontFace("Instrument Sans", `url(${staticFile("brand/fonts/InstrumentSans.ttf")}) format("truetype")`, {
    weight: "400 700",
    stretch: "75% 100%",
  }),
];

const handle = delayRender("Loading brand fonts");

Promise.all(faces.map((f) => f.load()))
  .then((loaded) => {
    loaded.forEach((f) => document.fonts.add(f));
    continueRender(handle);
  })
  .catch((err) => cancelRender(err));
