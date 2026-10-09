// Usage: node scripts/stills.mjs <CompositionId> <sec> [sec...]
// Renders stills at the given seconds into out/stills/ plus a contact sheet (out/stills/<id>-sheet.png).
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const [id, ...secs] = process.argv.slice(2);
if (!id || secs.length === 0) {
  console.error("Usage: node scripts/stills.mjs <CompositionId> <sec> [sec...]");
  process.exit(1);
}
const outDir = path.resolve("out/stills");
mkdirSync(outDir, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id });
const files = [];
for (const s of secs) {
  const frame = Math.min(Math.round(Number(s) * composition.fps), composition.durationInFrames - 1);
  const output = path.join(outDir, `${id}-${frame}.png`);
  await renderStill({ serveUrl, composition, frame, output, scale: 0.4 });
  files.push({ s, frame, output });
  console.log(`${s}s (frame ${frame}) -> ${output}`);
}

const cols = Math.min(files.length, 5);
const html = `<html><body style="margin:0;background:#222;display:grid;grid-template-columns:repeat(${cols},1fr);gap:8px;padding:8px;font:16px sans-serif;color:#fff">${files
  .map((f) => `<div><img src="file://${f.output}" style="width:100%;display:block"><div>${f.s}s · frame ${f.frame}</div></div>`)
  .join("")}</body></html>`;
const htmlPath = path.join(outDir, `${id}-sheet.html`);
writeFileSync(htmlPath, html);
const width = cols * 440;
const height = Math.ceil(files.length / cols) * 800 + 16;
execFileSync("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
  "--headless", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files",
  `--screenshot=${path.join(outDir, `${id}-sheet.png`)}`, `--window-size=${width},${height}`, `file://${htmlPath}`,
], { stdio: "ignore" });
console.log(`Contact sheet: out/stills/${id}-sheet.png`);
