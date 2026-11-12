// [brand-social-studio] Working example from the Reliance MET City calendar (Nov 2026). Paths, brand names, layouts and data are MET City specific: copy into the project and adapt.
// Final calendar, 20 Nov – 31 Dec 2026: month grid, list, profile grid and the full-screen presenter (../pres.css, ../pres.js),
// with the two finished films embedded. Output: ../MET-City-Calendar-Dec-2026.html (one self-contained file).
const fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");
const { POSTS, SRC } = require("./posts2.cjs");
const NOVP = require("../../nov-calendar/posts.cjs").POSTS;
const D = __dirname, P = path.join(D, ".."), IMG = path.join(D, "img");
fs.mkdirSync(IMG, { recursive: true });
const src = {}, missing = [];
const load = (name, file) => {
  const jpg = path.join(IMG, name + ".jpg");
  if (!fs.existsSync(file)) { missing.push(name); return; }
  if (!fs.existsSync(jpg) || fs.statSync(jpg).mtimeMs < fs.statSync(file).mtimeMs) execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", file, "-vf", "scale=864:-2", "-q:v", "3", jpg]);
  src[name] = "data:image/jpeg;base64," + fs.readFileSync(jpg).toString("base64");
};
const FILMS = {
  growth: { file: `${P}/video/metcity-growth-30s-9x16-720.mp4`, cover: `${P}/video/metcity-growth-30s-9x16-cover.jpg`, label: "30 s growth reel (Hinglish)" },
  ad: { file: `${P}/video/metcity-ad-45s-9x16-720.mp4`, cover: `${P}/video/metcity-ad-45s-9x16-cover.jpg`, label: "45 s industrial ad film" },
};
const VIDS = {};
for (const [k, f] of Object.entries(FILMS)) { VIDS[k] = fs.readFileSync(f.file).toString("base64"); load("film-" + k, f.cover); }
const CAP = { v01: NOVP.find((x) => x.id === "n06").caption, n12: NOVP.find((x) => x.id === "n12").caption };
const PROJECT = { p01: "MET City International Half Marathon", p02: "Industrial & logistics", p04: "MET City International Half Marathon", p05: "MET City Celeste", p07: "Reliance MET City", p10: "Industrial plots", p11: "MET City Club & Convention Centre", p14: "Japan Industrial Township", p15: "Sector 8 premium plots", p16: "MET City Club & Convention Centre", v01: "Industrial plots" };
const data = POSTS.map((p) => {
  let slides = [];
  if (p.film) slides = ["film-" + p.film];
  else { const n = p.format === "carousel" ? p.n : 1; for (let i = 1; i <= n; i++) { const name = `${p.id}-${i}`; load(name, path.join(D, "out", name + ".png")); slides.push(name); } }
  return { id: p.id, date: p.date, time: p.time, account: p.account, title: p.title, project: PROJECT[p.id] || "Reliance MET City", tag: p.type, format: p.format,
    caption: p.caption || CAP[p.id] || "", kept: false, slides: slides.filter((s) => src[s]), nslides: slides.length, real: slides.map(() => (p.make === "codex" ? "concept" : "photo")),
    script: null, facts: (p.facts || []).filter(([, k]) => SRC[k]).map(([f, k]) => [f || SRC[k][0], SRC[k][0], SRC[k][1]]), note: p.note || "",
    film: p.film || null, filmLabel: p.film ? FILMS[p.film].label : "", extra: false, ref: (p.ref || []).filter((r) => !/YouTube/.test(r)) };
});
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const FMT = { image: "Image", carousel: "Carousel", video: "Reel" };
const cnt = (f) => data.filter((p) => p.format === f).length;
const days = [];
for (let d = new Date("2026-11-16T12:00:00Z"); d <= new Date("2027-01-03T12:00:00Z"); d.setUTCDate(d.getUTCDate() + 1)) days.push(d.toISOString().slice(0, 10));
const byDate = {}; data.forEach((p, i) => (byDate[p.date] = byDate[p.date] || []).push(i));
const inWin = (d) => d >= "2026-11-20" && d <= "2026-12-31";
const MON = { "11": "Nov", "12": "Dec", "01": "Jan" };
const ACC = { "@reliance_met": "main", "@reliancemetcityclub": "club", "@metcityhalfmarathon": "run" };
const label = (d) => new Date(d + "T12:00:00Z").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
const cell = (d) => {
  const n = +d.slice(8), mon = n === 1 || d === days[0] ? " " + MON[d.slice(5, 7)] : "";
  const ps = (byDate[d] || []).map((i) => { const p = data[i]; return `<button class="pc ${p.format} ${ACC[p.account]}" data-i="${i}"><span class="th">${p.slides[0] ? `<img data-s="${p.slides[0]}" alt="">` : ""}<em>${p.format === "carousel" ? "⧉ " + p.nslides : p.format === "video" ? "▶" : ""}</em></span><span class="ti">${esc(p.title)}</span></button>`; }).join("");
  return `<div class="day${inWin(d) ? "" : " out"}"><span class="dn">${n}${mon}</span>${ps}</div>`;
};
const mainIdx = data.map((p, i) => [p, i]).filter(([p]) => p.account === "@reliance_met").map(([, i]) => i).reverse();
const PCSS = fs.readFileSync(path.join(P, "pres.css"), "utf8").replace(/\.pmedia img,\.pmedia video\{/, ".pmedia img,.pmedia video{");
const PJS = fs.readFileSync(path.join(P, "pres.js"), "utf8").replace('var SRCLBL = { photo: "Real photo", render: "MET City render", ai: "AI image" };', 'var SRCLBL = { photo: "MET City photography", concept: "Concept artwork", ai: "AI image", render: "MET City render" };');
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Reliance MET City · Content calendar, December 2026</title>
<style>
:root{--ink:#1b1712;--ink2:#5a5148;--ink3:#8a8076;--line:rgba(50,45,39,.12);--gold:#a8843e;--gold2:#c9a55c;--brown:#322d27;--cream:#f6f1e7;--navy:#0e1f45}
*{box-sizing:border-box}body{margin:0;font:15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;color:var(--ink);background:var(--cream)}
.wrap{max-width:1200px;margin:0 auto;padding:22px 16px 64px}
header{background:var(--brown);color:#fff;border-radius:24px;padding:24px 26px;display:flex;gap:18px;align-items:center;flex-wrap:wrap}
header .lk{font-family:Georgia,serif;color:var(--gold2);text-align:center;line-height:1.05}header .lk b{display:block;font-size:24px;letter-spacing:.06em}header .lk small{font-size:12px}
header h1{margin:0;font-size:clamp(22px,3.4vw,32px)}header p{margin:4px 0 0;color:#e6dccb;max-width:760px}
.stats{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}.stats span{background:#fff;border-radius:999px;padding:6px 12px;font-weight:600;font-size:13.5px;box-shadow:0 1px 0 var(--line)}
section{background:#fff;border-radius:22px;padding:18px;margin-top:14px;box-shadow:0 6px 24px rgba(40,30,20,.06)}h2{margin:0 0 12px;font-size:19px}
.grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}.dow{font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--ink3);text-align:center}
.day{min-height:70px;border-radius:14px;background:#faf7f1;padding:6px;display:flex;flex-direction:column;gap:5px}.day.out{opacity:.35}.dn{font-size:12.5px;font-weight:700;color:var(--ink3)}
.pc{border:0;padding:4px;border-radius:10px;background:#fff;box-shadow:inset 0 0 0 1px var(--line);font:inherit;color:inherit;text-align:left;cursor:pointer;display:flex;flex-direction:column;gap:4px}
.pc:hover{box-shadow:inset 0 0 0 2px var(--gold2)}.pc.club{background:#f7eef6}.pc.run{background:#eaf4ec}
.th{position:relative;display:block;border-radius:7px;overflow:hidden;background:#eee6d8;aspect-ratio:4/5}.pc.video .th{aspect-ratio:9/16}
.th img{width:100%;height:100%;object-fit:cover;display:block}.th em{position:absolute;top:4px;right:4px;font-style:normal;font-size:10.5px;font-weight:800;color:#fff;background:rgba(0,0,0,.55);border-radius:6px;padding:1px 5px}.th em:empty{display:none}
.ti{font-size:12px;font-weight:650;line-height:1.2}
.legend{display:flex;gap:14px;flex-wrap:wrap;font-size:12.5px;color:var(--ink2);margin-top:10px}.legend i{display:inline-block;width:12px;height:12px;border-radius:3px;vertical-align:-2px;margin-right:4px;box-shadow:inset 0 0 0 1px var(--line)}
.two{display:grid;grid-template-columns:1.4fr 1fr;gap:14px}@media(max-width:900px){.two{grid-template-columns:1fr}}
.list{display:grid;gap:7px}.row{display:grid;grid-template-columns:96px 52px 1fr auto;gap:12px;align-items:center;padding:7px;border-radius:14px;background:#faf7f1;border:0;font:inherit;text-align:left;cursor:pointer;color:inherit}
.row:hover{background:#f2ead9}.row img{width:52px;height:65px;object-fit:cover;border-radius:8px}.row .d{font-weight:700;font-size:13.5px}.row .d small{display:block;color:var(--ink3);font-weight:500}.row .pj{font-size:12px;color:var(--ink3)}
.chip{font-size:12px;font-weight:700;padding:3px 9px;border-radius:999px;background:#efe6d3;color:#7a5d24;white-space:nowrap}.chip.video{background:#e7ecf7;color:#2a4a8a}.chip.carousel{background:#e3efe4;color:#24552f}
.ig{display:grid;grid-template-columns:repeat(3,1fr);gap:3px;max-width:420px}.ig button{border:0;padding:0;aspect-ratio:4/5;overflow:hidden;cursor:pointer;background:#eee}.ig img{width:100%;height:100%;object-fit:cover}
.foot{font-size:12.5px;color:var(--ink3);margin-top:16px}
@media(max-width:700px){.grid{gap:2px}.day{min-height:54px;padding:3px}.pc{padding:2px}.ti{display:none}.row{grid-template-columns:76px 46px 1fr}.row .chip{display:none}}
${PCSS}
</style></head><body><div class="wrap">
<header><div class="lk"><b>MET CITY</b><small>Growth is Life</small></div><div><h1>Your content calendar · 20 Nov – 31 Dec 2026</h1><p>${data.length} posts for @reliance_met, @reliancemetcityclub and @metcityhalfmarathon, designed in your house style and ready to publish. Built from your own posts, your news coverage and the dates that matter this season.</p><button class="present" data-present>▶ Present all posts</button></div></header>
<div class="stats"><span>${data.length} posts</span><span>${cnt("image")} image posts</span><span>${cnt("carousel")} carousels · ${data.filter((p) => p.format === "carousel").reduce((n, p) => n + p.nslides, 0)} slides</span><span>${cnt("video")} reels</span><span>3 accounts</span></div>
<section><h2>Calendar</h2><div class="grid">${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => `<div class="dow">${d}</div>`).join("")}${days.map(cell).join("")}</div>
<div class="legend"><span><i style="background:#fff"></i>@reliance_met</span><span><i style="background:#f7eef6"></i>@reliancemetcityclub</span><span><i style="background:#eaf4ec"></i>@metcityhalfmarathon</span></div></section>
<div class="two">
<section><h2>Every post</h2><div class="list">${data.map((p, i) => `<button class="row" data-i="${i}"><span class="d">${label(p.date)}<small>${p.time} IST</small></span>${p.slides[0] ? `<img data-s="${p.slides[0]}" alt="">` : "<span></span>"}<span><b>${esc(p.title)}</b><br><span class="pj">${esc(p.account)} · ${esc(p.tag)}</span></span><span class="chip ${p.format}">${FMT[p.format]}${p.format === "carousel" ? " · " + p.nslides : ""}</span></button>`).join("")}</div></section>
<section><h2>@reliance_met grid preview</h2><p style="margin:-6px 0 10px;color:var(--ink3);font-size:13px">How the main feed looks once the month is live, newest first.</p><div class="ig">${mainIdx.map((i) => `<button data-i="${i}">${data[i].slides[0] ? `<img data-s="${data[i].slides[0]}" alt="">` : ""}</button>`).join("")}</div></section>
</div>
<p class="foot">Photography: Reliance MET City's own photos and films; two landscape photos from Wikimedia Commons (Sultanpur, mustard field; credits on request). Concept artwork for the day greetings is AI-assisted. Facts and headlines link to their sources in each post.</p>
</div>
<div id="pres" role="dialog" aria-label="Post presenter">
<div class="pt"><span class="brand">MET CITY</span><span class="count"></span><span class="sp"></span><span class="hint">← → slides · ↑ ↓ posts · C caption · F full screen</span><button data-act="cap">Caption</button><button data-act="fs">Full screen</button><button data-act="close">✕ Close</button></div>
<div class="pm"><div class="phone"><div class="ph-h"></div><div class="pmedia"></div></div><div class="pinfo"></div></div>
<div class="pb"><button class="big" data-act="prev">‹ Previous post</button><div class="strip"></div><button class="big" data-act="next">Next post ›</button></div>
</div>
<script>
const IMGS = ${JSON.stringify(src)};
const VIDS = ${JSON.stringify(VIDS)};
const POSTS = ${JSON.stringify(data)};
${PJS}
</script></body></html>`;
const OUT = path.join(P, "MET-City-Calendar-Dec-2026.html");
fs.writeFileSync(OUT, html);
console.log(path.basename(OUT), (html.length / 1e6).toFixed(1), "MB; posts", data.length, "; images", Object.keys(src).length, "; missing", missing.join(" ") || "none");
