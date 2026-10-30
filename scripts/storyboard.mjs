// Usage: node scripts/storyboard.mjs <CompositionId> <board.json> [columns, default 5]
// board.json: [{ "sec": 0, "at": 12.5, "vo": "line spoken", "move": "what happens" }, ...]
// `sec` is the frame to render; optional `at` is the VO time shown on the label (for boards with one frame per panel).
// Renders one still per panel and lays them out with timing, VO and motion notes: out/storyboard/<id>.png.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const [id, boardPath, colsArg] = process.argv.slice(2);
if (!id || !boardPath) {
  console.error("Usage: node scripts/storyboard.mjs <CompositionId> <board.json>");
  process.exit(1);
}
const panels = JSON.parse(readFileSync(boardPath, "utf8"));
const outDir = path.resolve("out/storyboard");
mkdirSync(outDir, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id });
for (const [i, p] of panels.entries()) {
  p.frame = Math.min(Math.round(p.sec * composition.fps), composition.durationInFrames - 1);
  p.file = path.join(outDir, `${id}-${String(i + 1).padStart(2, "0")}.png`);
  await renderStill({ serveUrl, composition, frame: p.frame, output: p.file, scale: 0.4 });
  console.log(`${i + 1}: ${p.sec}s -> ${p.file}`);
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const cols = Number(colsArg) || 5;
const html = `<html><body style="margin:0;background:#16171d;color:#eee;font:15px/1.35 -apple-system,sans-serif;padding:24px">
<div style="font-size:26px;font-weight:600;margin-bottom:18px">${esc(id)} · storyboard</div>
<div style="display:grid;grid-template-columns:repeat(${cols},400px);gap:22px">${panels
  .map(
    (p, i) => `<div><img src="file://${p.file}" style="width:400px;display:block;border-radius:6px">
<div style="margin-top:8px;font-weight:600">${i + 1} · ${(p.at ?? p.sec).toFixed(1)}s</div>
<div style="color:#aab;font-style:italic;margin-top:4px">“${esc(p.vo)}”</div>
<div style="margin-top:4px">${esc(p.move)}</div></div>`,
  )
  .join("")}</div></body></html>`;
const htmlPath = path.join(outDir, `${id}.html`);
writeFileSync(htmlPath, html);
const width = cols * 422 + 48;
const height = 90 + Math.ceil(panels.length / cols) * 1000;
execFileSync("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
  "--headless", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files",
  `--screenshot=${path.join(outDir, `${id}.png`)}`, `--window-size=${width},${height}`, `file://${htmlPath}`,
], { stdio: "ignore" });
console.log(`Storyboard: out/storyboard/${id}.png`);
