// [brand-social-studio] Working example from the Reliance MET City calendar (Nov 2026). Paths, brand names, layouts and data are MET City specific: copy into the project and adapt.
// Pulls the photos and videos used on metcity.in (key pages only) into web/files/, plus each page's HTML into web/pages/.
// Skips company-logo SVGs and UI icons. Writes web/site-media.json: [{page, url, file, bytes}].
// Run: node pull-site.cjs
const fs = require("fs");
const path = require("path");
const BASE = "https://www.metcity.in";
const UA = { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36" };
const PAGES = ["/", "/met-city", "/industrial", "/japan-industrial-township", "/residential", "/commercial", "/media-gallery", "/csr-news", "/press-release", "/testimonials", "/our-partners", "/environment-compliance", "/blogs", "/newsletter"];
const OUT = path.join(__dirname, "web");
fs.mkdirSync(OUT + "/files", { recursive: true });
fs.mkdirSync(OUT + "/pages", { recursive: true });

(async () => {
  const seen = new Map();
  for (const p of PAGES) {
    let h;
    try { h = await (await fetch(BASE + p, { headers: UA })).text(); } catch (e) { console.log("page fail", p, e.message); continue; }
    fs.writeFileSync(`${OUT}/pages/${p === "/" ? "home" : p.slice(1).replace(/\W+/g, "-")}.html`, h);
    const urls = [...h.matchAll(/(?:src|data-src|poster|href|content)="([^"]+\.(?:jpe?g|png|webp|mp4|webm))(?:\?[^"]*)?"/gi)].map((m) => m[1]);
    const bg = [...h.matchAll(/url\(['"]?([^'")]+\.(?:jpe?g|png|webp))['"]?\)/gi)].map((m) => m[1]);
    for (let u of [...urls, ...bg]) {
      if (/\/icons\/|\/img\/icons|favicon/i.test(u)) continue;
      u = u.startsWith("http") ? u : BASE + (u.startsWith("/") ? "" : "/") + u;
      if (!/metcity\.in/.test(u)) continue;
      if (!seen.has(u)) seen.set(u, p);
    }
    console.log(p, "media so far", seen.size);
  }
  const out = [];
  for (const [u, page] of seen) {
    const name = decodeURIComponent(u.split("/files/")[1] || u.split("/").pop()).replace(/[\/\\ ()%]+/g, "_");
    const file = `files/${name}`;
    try {
      if (!fs.existsSync(`${OUT}/${file}`)) {
        const r = await fetch(u, { headers: UA });
        if (!r.ok) { console.log("fail", r.status, u); continue; }
        fs.writeFileSync(`${OUT}/${file}`, Buffer.from(await r.arrayBuffer()));
      }
      out.push({ page, url: u, file, bytes: fs.statSync(`${OUT}/${file}`).size });
    } catch (e) { console.log("fail", u, e.message); }
  }
  fs.writeFileSync(`${OUT}/site-media.json`, JSON.stringify(out, null, 1));
  console.log("saved", out.length, "files,", (out.reduce((n, x) => n + x.bytes, 0) / 1e6).toFixed(1), "MB");
})();
