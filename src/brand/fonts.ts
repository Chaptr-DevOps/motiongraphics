// Load brand fonts from public/brand/fonts. Example once files exist:
//
// import { staticFile, continueRender, delayRender } from "remotion";
// const handle = delayRender("font");
// new FontFace("NightShiftHeading", `url(${staticFile("brand/fonts/Heading-Bold.woff2")})`)
//   .load()
//   .then((f) => { document.fonts.add(f); continueRender(handle); });
//
// Then set fonts.heading = "NightShiftHeading" in theme.ts.
export {};
