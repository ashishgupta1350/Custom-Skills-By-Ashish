// [brand-social-studio] Working example from the Reliance MET City calendar (Nov 2026). Paths, brand names, layouts and data are MET City specific: copy into the project and adapt.
// Renders one page of a local PDF with pdf.js in headless Chrome (over CDP) and saves it as PNG.
// node pdfpage.cjs <pdf name in this folder> <page> <scale> <out.png> [clipX clipY clipW clipH in page px at that scale]
const { spawn } = require("child_process"), fs = require("fs"), path = require("path");
const [pdf, page, scale, out, cx, cy, cw, ch] = process.argv.slice(2);
const port = 9341, prof = path.join(__dirname, "cdp-prof");
const chrome = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, "--allow-file-access-from-files", "--window-size=1200,900", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  let tabs; for (let i = 0; i < 40; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(250); } }
  const ws = new WebSocket(tabs.find((t) => t.type === "page").webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
  let id = 0; const pend = {}; ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend[d.id]) { pend[d.id](d); delete pend[d.id]; } };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (e) => (await send("Runtime.evaluate", { expression: e, returnByValue: true, awaitPromise: true })).result?.result?.value;
  await send("Page.navigate", { url: "file:///" + path.join(__dirname, "render.html").replace(/\\/g, "/") + `?f=${pdf}&p=${page}&s=${scale}` });
  for (let i = 0; i < 120; i++) { if (await ev("document.body && document.body.getAttribute('data-done')")) break; await sleep(500); }
  const dims = await ev("[document.getElementById('c').width, document.getElementById('c').height, document.title]");
  const clip = cw ? { x: +cx, y: +cy, width: +cw, height: +ch, scale: 1 } : { x: 0, y: 0, width: dims[0], height: dims[1], scale: 1 };
  const r = await send("Page.captureScreenshot", { format: "png", clip, captureBeyondViewport: true });
  fs.writeFileSync(path.join(__dirname, out), Buffer.from(r.result.data, "base64"));
  console.log("page", page, "canvas", dims.join(" "), "->", out);
  ws.close(); chrome.kill();
})().catch((e) => { console.error(e); chrome.kill(); process.exit(1); });
