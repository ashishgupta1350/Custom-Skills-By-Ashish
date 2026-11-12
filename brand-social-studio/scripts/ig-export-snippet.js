// Run in the logged-in Instagram tab (browser pane javascript tool), on https://www.instagram.com/<account>/
// Instagram's /api/v1 endpoints 404 from the pane, so this captures the feed data the page itself loads while scrolling.
// Each javascript-tool call must finish in under 45 s, so run the parts separately.

// ---- A. Install the hook (run right after the profile loads; the first ~12 posts load before it, so reload + rerun for those)
window.__cap = [];
if (!window.__hooked) {
  window.__hooked = true;
  const of = window.fetch;
  window.fetch = async function (...a) {
    const r = await of.apply(this, a);
    try { const u = String(a[0]?.url || a[0]); if (/graphql|api\/v1/.test(u)) r.clone().text().then((t) => { if (/carousel_media|image_versions2/.test(t)) window.__cap.push({ u, t }); }); } catch (e) {}
    return r;
  };
  const oo = XMLHttpRequest.prototype.open, os = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (m, u) { this.__u = u; return oo.apply(this, arguments); };
  XMLHttpRequest.prototype.send = function () { this.addEventListener("load", () => { try { if (/graphql|api\/v1/.test(this.__u) && /carousel_media|image_versions2/.test(this.responseText)) window.__cap.push({ u: this.__u, t: this.responseText }); } catch (e) {} }); return os.apply(this, arguments); };
}
"hooked";

// ---- Scroll in chunks (repeat this call until the count stops growing)
for (let i = 0; i < 12; i++) { window.scrollTo(0, document.body.scrollHeight); await new Promise((z) => setTimeout(z, 2500)); }
window.__cap.length;

// ---- B. Parse what was captured
window.__all = window.__all || new Map();
(function walk(o) { if (!o || typeof o !== "object") return; if (o.code && (o.image_versions2 || o.carousel_media) && o.taken_at) window.__all.set(o.code, o); for (const v of Object.values(o)) walk(v); })(
  window.__cap.flatMap((c) => c.t.split("\n").map((p) => { try { return JSON.parse(p); } catch { return null; } })));
const arr = [...window.__all.values()].sort((a, b) => b.taken_at - a.taken_at);
({ posts: arr.length, newest: new Date(arr[0].taken_at * 1000).toISOString().slice(0, 10), oldest: new Date(arr.at(-1).taken_at * 1000).toISOString().slice(0, 10) });

// ---- C. Save to Downloads (ask the user first; a second download in the same tab can be blocked, so check that it arrived)
const pick = (iv, w) => { const c = (iv?.candidates || []).slice().sort((a, b) => a.width - b.width); return c.find((x) => x.width >= w) || c.at(-1); };
const rec = (p) => { const sl = p.media_type === 8 ? p.carousel_media : [p]; return { code: p.code, date: new Date(p.taken_at * 1000).toISOString(), type: p.media_type === 8 ? "carousel" : p.media_type === 2 ? "reel" : "image", product: p.product_type, owner: p.user?.username, coauthors: (p.coauthor_producers || []).map((x) => x.username), likes: p.like_count, comments: p.comment_count, views: p.play_count || p.view_count || null, caption: p.caption?.text || "", slides: sl.map((s) => { const c = pick(s.image_versions2, 1080); return { img: c?.url, w: c?.width, h: c?.height, video: (s.video_versions || [])[0]?.url || null }; }) }; };
const b = new Blob([JSON.stringify([...window.__all.values()].map(rec))], { type: "application/json" });
const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "account-posts-1.json"; document.body.appendChild(a); a.click(); setTimeout(() => a.remove(), 1000);
b.size;
