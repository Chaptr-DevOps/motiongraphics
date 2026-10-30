import { random } from "remotion";

// Night photography library. `position` is the CSS object-position used when cropping to 9:16.
// `tint` is the photo's measured average colour (RGB); object surfaces are mixed from it so they sit in the photo's light.
export type Photo = { src: string; position: string; note: string; tint: RGB };
export type RGB = [number, number, number];

const p = (file: string, position: string, note: string, tint: RGB): Photo => ({ src: `images/${file}`, position, note, tint });

export const photos = {
  // The brief's app photos. (No night-road photo was supplied.)
  lake: p("pexels-adem-albayrak-383796555-39965276.jpg", "50% 50%", "Lake and mountains, small cabin light", [5, 41, 64]),
  moon: p("pexels-designeramit733-15204389.jpg", "58% 50%", "Crescent moon, dusk sky. Low-res landscape: keep it blurred", [30, 38, 92]),
  oliveTrees: p("pexels-hobiphotography-34768887.jpg", "50% 50%", "Lit olive trees", [17, 30, 27]),

  // Extras.
  warmTreeline: p("pexels-zeynep-sude-emek-193601188-18104906.jpg", "50% 50%", "Milky Way over trees, warm horizon glow", [48, 50, 55]),
  pines: p("pexels-debphotography-25853777.jpg", "50% 50%", "Pine silhouettes, mountain dusk", [3, 18, 41]),
  starsTreeline: p("pexels-emptymirror-29755879.jpg", "50% 50%", "Deep blue sky over trees", [14, 28, 42]),
  milkyWay: p("pexels-dzikilechu-9122578.jpg", "50% 50%", "Milky Way, tree corner", [12, 21, 25]),
  milkyWayPines: p("pexels-free-nature-stock-7524.jpg", "50% 50%", "Milky Way over pines", [36, 37, 58]),
  purpleSky: p("pexels-nuh-kostekli-3374593-14988034.jpg", "50% 50%", "Purple Milky Way. Saturated: mute it", [48, 36, 52]),
  blueSky: p("pexels-alexbph-30229789(1).jpg", "50% 50%", "Saturated blue sky, pine. Mute it", [3, 37, 96]),
  carHorizon: p("pexels-didsss-4996846.jpg", "70% 50%", "Dusk horizon from a car, mirror at left edge", [16, 39, 51]),
} satisfies Record<string, Photo>;

/** Photos whose files are in public/images (photos.moon's file is missing). */
export const backdropPhotos: Photo[] = Object.values(photos).filter((ph) => ph !== photos.moon);
/** A seeded "random" photo: each video gets its own background, but every render of it is identical. */
export const pickPhoto = (seed: string): Photo => backdropPhotos[Math.floor(random(seed) * backdropPhotos.length)];
