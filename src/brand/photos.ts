// Night photography library. `position` is the CSS object-position used when cropping to 9:16.
export type Photo = { src: string; position: string; note: string };

const p = (file: string, position: string, note: string): Photo => ({ src: `images/${file}`, position, note });

export const photos = {
  // The brief's app photos. (No night-road photo was supplied.)
  lake: p("pexels-adem-albayrak-383796555-39965276.jpg", "50% 50%", "Lake and mountains, small cabin light"),
  moon: p("pexels-designeramit733-15204389.jpg", "58% 50%", "Crescent moon, dusk sky. Low-res landscape: keep it blurred"),
  oliveTrees: p("pexels-hobiphotography-34768887.jpg", "50% 50%", "Lit olive trees"),

  // Extras.
  warmTreeline: p("pexels-zeynep-sude-emek-193601188-18104906.jpg", "50% 50%", "Milky Way over trees, warm horizon glow"),
  pines: p("pexels-debphotography-25853777.jpg", "50% 50%", "Pine silhouettes, mountain dusk"),
  starsTreeline: p("pexels-emptymirror-29755879.jpg", "50% 50%", "Deep blue sky over trees"),
  milkyWay: p("pexels-dzikilechu-9122578.jpg", "50% 50%", "Milky Way, tree corner"),
  milkyWayPines: p("pexels-free-nature-stock-7524.jpg", "50% 50%", "Milky Way over pines"),
  purpleSky: p("pexels-nuh-kostekli-3374593-14988034.jpg", "50% 50%", "Purple Milky Way. Saturated: mute it"),
  blueSky: p("pexels-alexbph-30229789.jpg", "50% 50%", "Saturated blue sky, pine. Mute it"),
  carHorizon: p("pexels-didsss-4996846.jpg", "70% 50%", "Dusk horizon from a car, mirror at left edge"),
} satisfies Record<string, Photo>;
