// Night Shift brand tokens. PLACEHOLDERS — replace with values from docs/ design doc.
export const colors = {
  bg: "#0B0F1F",
  bgAlt: "#141A33",
  primary: "#7C8CFF",
  accent: "#FFC86B",
  text: "#F3F4FA",
  textMuted: "#9AA0BC",
};

// Swap to the brand font once it's in public/brand/fonts (see src/brand/fonts.ts).
export const fonts = {
  heading: "system-ui, -apple-system, sans-serif",
  body: "system-ui, -apple-system, sans-serif",
};

// Reel format: 9:16, 1080x1920 @ 30fps.
export const reel = { width: 1080, height: 1920, fps: 30 };

// Keep text and key UI inside this box; IG/TikTok overlay UI covers the edges.
export const safeArea = { top: 220, bottom: 380, left: 60, right: 140 };
