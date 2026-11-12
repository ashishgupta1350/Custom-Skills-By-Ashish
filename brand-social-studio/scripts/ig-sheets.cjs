// [brand-social-studio] Working example from the Reliance MET City calendar (Nov 2026). Paths, brand names, layouts and data are MET City specific: copy into the project and adapt.
// Contact sheets of the @reliance_met grid (ig-full/): image posts, carousels (every slide), reel covers, collabs.
// Each tile is labelled with date, likes and post code. Output: ig-full/sheets/*.jpg
const fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");
const D = path.join(__dirname, "ig-full"), S = path.join(D, "sheets"), T = path.join(D, "tiles");
fs.mkdirSync(S, { recursive: true }); fs.mkdirSync(T, { recursive: true });
const P = require(path.join(D, "posts.json"));
const FONT = "../../sheets/font.ttf"; // relative to tiles/ (ffmpeg runs there)
const tile = (file, label, w, h, out) => {
  if (fs.existsSync(path.join(T, out))) return out;
  const lab = label.replace(/[':\\%,]/g, " ");
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", path.join(D, file), "-vf",
    `scale=${w - 2}:${h - 2}:force_original_aspect_ratio=decrease,pad=${w}:${h}:-1:-1:color=0x111111,format=yuvj420p,drawtext=fontfile=${FONT}:text='${lab}':x=3:y=${h - 16}:fontsize=12:fontcolor=yellow:box=1:boxcolor=black@0.75`, path.join(T, out)], { cwd: T });
  return out;
};
const sheet = (name, tiles, cols) => {
  const list = path.join(T, name + ".txt");
  fs.writeFileSync(list, tiles.map((t) => `file '${t}'`).join("\n"));
  const rows = Math.ceil(tiles.length / cols);
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-r", "1", "-i", list, "-vf", `tile=${cols}x${rows}`, "-frames:v", "1", path.join(S, name + ".jpg")], { cwd: T });
};
const lbl = (p) => `${p.date.slice(2, 10)} L${p.likes ?? "?"} ${p.code.slice(0, 6)}`;
const own = P.filter((p) => p.owner === "reliance_met");

// 1. Image posts, newest first, 7x5 per sheet
const imgs = own.filter((p) => p.type === "image");
for (let i = 0; i < imgs.length; i += 35) sheet(`images-${i / 35 + 1}`, imgs.slice(i, i + 35).map((p) => tile(p.slides[0].file, lbl(p), 260, 325, `i_${p.code}.jpg`)), 7);
// 2. Carousels: one row per carousel (up to 8 slides), 6 carousels per sheet
const cars = own.filter((p) => p.type === "carousel");
for (let i = 0; i < cars.length; i += 6) {
  const t = [];
  for (const p of cars.slice(i, i + 6)) for (let k = 0; k < 8; k++) t.push(p.slides[k] ? tile(p.slides[k].file, k === 0 ? lbl(p) + ` x${p.slides.length}` : `${k + 1}`, 220, 275, `c_${p.code}_${k}.jpg`) : tile(p.slides[0].file, "", 220, 275, "blank.jpg"));
  sheet(`carousels-${i / 6 + 1}`, t, 8);
}
// 3. Reel covers, 10x4 per sheet
const reels = own.filter((p) => p.type === "reel");
for (let i = 0; i < reels.length; i += 40) sheet(`reels-${i / 40 + 1}`, reels.slice(i, i + 40).map((p) => tile(p.slides[0].file, lbl(p), 180, 320, `r_${p.code}.jpg`)), 10);
// 4. Collab posts in the grid (other owners)
const col = P.filter((p) => p.owner !== "reliance_met");
for (let i = 0; i < col.length; i += 40) sheet(`collabs-${i / 40 + 1}`, col.slice(i, i + 40).map((p) => tile(p.slides[0].file, `${p.owner.slice(0, 14)} L${p.likes ?? "?"}`, 180, 320, `x_${p.code}.jpg`)), 10);
console.log("images", imgs.length, "carousels", cars.length, "reels", reels.length, "collabs", col.length);
