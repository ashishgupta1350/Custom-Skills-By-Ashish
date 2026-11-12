// [brand-social-studio] Working example from the Reliance MET City calendar (Nov 2026). Paths, brand names, layouts and data are MET City specific: copy into the project and adapt.
// Downloads every image / carousel slide / reel cover listed in the two @reliance_met exports (saved from the
// logged-in Instagram tab on 10 Nov 2026) into ig-full/img/<code>_<n>.jpg, and writes ig-full/posts.json (merged).
// Run: node ig-pull.cjs <export1.json> <export2.json>
const fs = require("fs"), path = require("path");
const OUT = path.join(__dirname, "ig-full"), IMG = path.join(OUT, "img");
fs.mkdirSync(IMG, { recursive: true });
const all = new Map();
for (const f of process.argv.slice(2)) for (const p of JSON.parse(fs.readFileSync(f, "utf8"))) all.set(p.code, p);
const posts = [...all.values()].sort((a, b) => b.date.localeCompare(a.date));
const jobs = [];
posts.forEach((p) => p.slides.forEach((s, i) => { s.file = `img/${p.code}_${i + 1}.jpg`; if (s.img) jobs.push([s.img, path.join(OUT, s.file)]); }));
// Keep the merged list without the signed URLs (they expire anyway).
fs.writeFileSync(path.join(OUT, "posts.json"), JSON.stringify(posts.map((p) => ({ ...p, slides: p.slides.map(({ img, video, ...s }) => ({ ...s, hasVideo: !!video })) })), null, 1));
(async () => {
  let k = 0, ok = 0, fail = 0;
  await Promise.all(Array.from({ length: 8 }, async () => {
    while (k < jobs.length) {
      const [u, f] = jobs[k++];
      if (fs.existsSync(f)) { ok++; continue; }
      try { const r = await fetch(u); if (!r.ok) throw new Error(r.status); fs.writeFileSync(f, Buffer.from(await r.arrayBuffer())); ok++; } catch (e) { fail++; }
    }
  }));
  console.log("posts", posts.length, "slides", jobs.length, "ok", ok, "failed", fail);
})();
