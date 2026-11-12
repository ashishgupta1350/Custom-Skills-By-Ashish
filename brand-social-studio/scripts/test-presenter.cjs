// [brand-social-studio] Working example from the Reliance MET City calendar (Nov 2026). Paths, brand names, layouts and data are MET City specific: copy into the project and adapt.
// Drives the calendar's presenter in headless Chrome over CDP: open, step through posts/slides, play a film, screenshot.
const { spawn } = require("child_process");
const fs = require("fs"), path = require("path");
const FILE = process.argv[2], OUT = process.argv[3];
const port = 9333;
const prof = path.join(__dirname, "cdp-prof");
const ch = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, "--window-size=1440,900", "--autoplay-policy=no-user-gesture-required", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  let tabs;
  for (let i = 0; i < 40; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(250); } }
  const ws = new WebSocket(tabs.find((t) => t.type === "page").webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; const pend = {}; const logs = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend[d.id]) { pend[d.id](d); delete pend[d.id]; } if (d.method === "Runtime.exceptionThrown") logs.push("EXC " + d.params.exceptionDetails.exception?.description); if (d.method === "Runtime.consoleAPICalled" && d.params.type === "error") logs.push("ERR " + d.params.args.map((a) => a.value).join(" ")); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => (await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
  const key = async (k, vk) => { await send("Input.dispatchKeyEvent", { type: "rawKeyDown", key: k, code: k, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk }); await send("Input.dispatchKeyEvent", { type: "keyUp", key: k, code: k, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk }); await sleep(250); };
  const shot = async (name) => { const r = await send("Page.captureScreenshot", { format: "jpeg", quality: 70 }); fs.writeFileSync(path.join(OUT, name + ".jpg"), Buffer.from(r.result.data, "base64")); };
  await send("Runtime.enable"); await send("Page.enable");
  await send("Page.navigate", { url: "file:///" + FILE.replace(/\\/g, "/") });
  await sleep(6000);
  console.log("posts", await ev("POSTS.length"), "films", await ev("Object.keys(VIDS).join(',')"));
  await ev("document.querySelector('[data-present]').click()");
  await sleep(800);
  console.log("open", await ev("document.getElementById('pres').classList.contains('on')"), await ev("document.querySelector('#pres .count').textContent"));
  await shot("p1");
  // ArrowDown to the 23 Nov film (post index of v01)
  const iAd = await ev("POSTS.findIndex(p=>p.id==='v01')");
  for (let i = 0; i < iAd; i++) await key("ArrowDown", 40);
  await sleep(1500);
  console.log("at", await ev("document.querySelector('#pres .count').textContent"), "video", await ev("(()=>{const v=document.querySelector('#pres video');return v?{paused:v.paused,t:v.currentTime,dur:v.duration,rs:v.readyState}:null})()"));
  await shot("p2-film");
  // carousel: go to d02, then ArrowRight through slides
  const iC = await ev("POSTS.findIndex(p=>p.id==='p05')");
  await ev(`window.presentPost(${iC})`); await sleep(400);
  await key("ArrowRight", 39); await key("ArrowRight", 39);
  console.log("carousel", await ev("document.querySelector('#pres .snum')?.textContent"), await ev("document.querySelector('#pres .count').textContent"));
  await shot("p3-carousel");
  await key("ArrowRight", 39);
  console.log("after last slide", await ev("document.querySelector('#pres .count').textContent"));
  // a scripted reel
  const iR = await ev("POSTS.findIndex(p=>p.id==='n12')");
  await ev(`window.presentPost(${iR})`); await sleep(500);
  await shot("p4-reel");
  await key("Escape", 27);
  console.log("closed", !(await ev("document.getElementById('pres').classList.contains('on')")));
  console.log(logs.length ? logs.join("\n") : "no console errors");
  ws.close(); ch.kill();
})().catch((e) => { console.error(e); ch.kill(); process.exit(1); });
