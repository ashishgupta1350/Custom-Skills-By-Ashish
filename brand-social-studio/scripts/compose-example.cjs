// [brand-social-studio] Working example from the Reliance MET City calendar (Nov 2026). Paths, brand names, layouts and data are MET City specific: copy into the project and adapt.
// Renders every calendar-v2 slide (1080x1350) in @reliance_met's own layouts, with exact text set in HTML.
// Photos: photos2.cjs (MET City's own). Concept art: codex/c-*.png. Output: out/<post>-<n>.png
//   node compose2.cjs            → all      node compose2.cjs p05 p09   → only these posts
const fs = require("fs"), path = require("path"), { execFileSync, spawnSync } = require("child_process");
const D = __dirname, RES = path.join(D, "../research"), REAL = path.join(D, "../real/photos");
for (const d of ["photos", "pages", "out"]) fs.mkdirSync(path.join(D, d), { recursive: true });
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PH = require("./photos2.cjs");
const grab = (k) => {
  const s = PH[k]; if (!s) throw new Error("photo " + k);
  if (s.r) return "../../real/photos/" + s.r;
  const out = path.join(D, "photos", k + ".jpg");
  if (!fs.existsSync(out)) {
    const a = s.t != null ? ["-ss", String(s.t), "-i", path.join(RES, s.f), "-frames:v", "1"] : ["-i", path.join(RES, s.f)];
    execFileSync("ffmpeg", ["-loglevel", "error", "-y", ...a, ...(s.crop ? ["-vf", `crop=${s.crop.join(":")}`] : []), "-q:v", "2", out]);
  }
  return "../photos/" + k + ".jpg";
};
const art = (n) => `../codex/c-${n}.png`;
const LOCK = (cls = "", st = "") => `<img class="logo ${cls}" src="../assets/${/dk/.test(cls) ? "logo-dark" : "logo-light"}.png" style="${st}" alt="MET CITY">`;
const EMB = (w, st = "") => `<img src="../assets/emblem.png" style="width:${w}px;${st}" alt="">`;
// Sub-brand lockups built from the real emblem, as on their posts: Celeste, Club, Half Marathon
const CELLOCK = (top = 70) => `<div style="position:absolute;left:0;right:0;top:${top}px;display:flex;justify-content:center;z-index:5"><div style="display:grid;grid-template-columns:auto auto;align-items:center;column-gap:12px">${EMB(54)}<div style="font-family:'Libre Caslon Text';font-size:27px;letter-spacing:.05em;color:#fff">MET CITY</div><div style="grid-column:1/3;font-family:'Libre Caslon Text';font-size:82px;line-height:1;color:#fff;margin-top:2px">Celeste</div></div></div>`;
const CLUBLOCK = (pos, scale = 1, color = "#fff") => `<div style="position:absolute;${pos};display:flex;align-items:center;gap:${12 * scale}px;z-index:5;color:${color}">${EMB(64 * scale)}<div style="font-family:'Libre Caslon Text';font-size:${24 * scale}px;line-height:1.05;letter-spacing:.04em">MET<br>CITY</div><div><div style="font-family:'Libre Caslon Text';font-size:${60 * scale}px;line-height:1">Club</div><div style="font-family:'Libre Caslon Text';font-size:${13 * scale}px;letter-spacing:.06em;margin-top:2px">&amp; Convention Centre</div></div></div>`;
const HMLOCK = (pos, color = "#fff") => `<div style="position:absolute;${pos};display:flex;align-items:center;gap:12px;z-index:5;color:${color}">${EMB(58)}<div style="font-family:'Libre Caslon Text';line-height:1.08"><div style="font-size:28px;letter-spacing:.04em">MET CITY</div><div style="font-size:15px;letter-spacing:.1em">INTERNATIONAL</div><div style="font-size:20px;letter-spacing:.06em">HALF MARATHON</div></div></div>`;
const bg = (u, pos = "50% 50%", extra = "") => `<div class="bg" style="background-image:url(${u});background-position:${pos};${extra}"></div>`;
const CSS = `*{box-sizing:border-box;margin:0;padding:0}html,body{width:1080px;height:1350px;overflow:hidden}
.c{position:relative;width:1080px;height:1350px;overflow:hidden;font-family:Poppins,sans-serif;color:#fff;background:#0b1a40}
.bg{position:absolute;inset:0;background-size:cover;background-repeat:no-repeat}
.lock{position:absolute;text-align:center;font-family:Cinzel,serif;color:#d9b96e;line-height:1;z-index:5}
.lock b{display:block;font-weight:700;letter-spacing:.04em}.lock i{display:block;height:1.5px;margin:.2em auto .18em;background:currentColor;opacity:.8;width:5.2em}
.lock span{display:block;font-family:"Libre Caslon Text",serif;font-size:.36em}
.lock.tr{right:52px;top:46px;font-size:34px}.lock.tc{left:0;right:0;top:56px;font-size:50px}
.logo{position:absolute;z-index:5}.logo.tr{right:44px;top:38px;width:190px}.logo.tc{left:50%;transform:translateX(-50%);top:44px;width:290px}.logo.sh{filter:drop-shadow(0 2px 10px rgba(0,0,0,.45))}
.t{position:absolute;left:80px;right:80px;text-align:center}
.serif{font-family:"Libre Caslon Text",serif}.cin{font-family:Cinzel,serif}.osw{font-family:Oswald,sans-serif;text-transform:uppercase}.mont{font-family:Montserrat,sans-serif}.gv{font-family:"Great Vibes",cursive}
.gold{background:linear-gradient(180deg,#f6e2a6,#d4b05f 55%,#a8843e);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.sp{font-family:Quicksand,sans-serif;font-weight:600;letter-spacing:.28em;text-transform:uppercase}
.navyBP{position:absolute;inset:0;background:radial-gradient(120% 80% at 50% 0%,#1d4fb8 0%,#123a8f 40%,#0a2363 100%)}
.royal{position:absolute;inset:0;background:radial-gradient(120% 90% at 50% 40%,#123a9c 0%,#0b2a7a 45%,#061848 100%)}
.celeste{position:absolute;inset:0;background:radial-gradient(90% 60% at 50% 30%,#18306a,#0e1f45 60%,#08132c)}
.sage{position:absolute;inset:0;background:#7b8a5f}
`;
// Blueprint lines like their press-clipping posts
const BLUE = `<div class="navyBP"></div><svg style="position:absolute;inset:0" width="1080" height="1350"><g stroke="rgba(170,205,255,.32)" fill="none" stroke-width="2">
<path d="M0 1350 L0 1080 L60 1080 L60 980 L140 980 L140 1120 L200 1120 L200 900 L300 900 L300 1350"/><path d="M780 1350 L780 1060 L860 1060 L860 940 L960 940 L960 1100 L1080 1100"/>
<path d="M40 1000 L130 1000 M40 1040 L130 1040 M210 940 L290 940 M210 980 L290 980 M210 1020 L290 1020 M870 980 L950 980 M870 1020 L950 1020"/>
<path d="M-50 260 L540 40 L1130 260" stroke="rgba(255,220,140,.35)"/><path d="M-50 330 L540 60 L1130 330" stroke="rgba(255,220,140,.22)"/></g></svg>`;

// ---- Slides -----------------------------------------------------------------------------------------------------
const S = {};
// p01 · Press coverage (their clipping carousel, June 2026)
const clip = (pub, color, head, body, date) => `${BLUE}${LOCK("tc")}
  <div style="position:absolute;left:110px;right:110px;top:250px;bottom:190px;background:#fff;border-radius:18px;box-shadow:0 20px 50px rgba(0,0,0,.35);padding:60px 58px;color:#1b1712;display:flex;flex-direction:column">
  <div style="font-family:'Libre Caslon Text',serif;font-weight:700;font-size:68px;color:${color};text-align:center;border-bottom:2px solid #e5e0d6;padding-bottom:26px">${pub}</div>
  <div style="font-family:Poppins;font-weight:600;font-size:50px;line-height:1.25;margin-top:44px"><span style="background:#fff200">${head[0]}</span>${head[1]}</div>
  <div style="font-family:Poppins;font-size:33px;line-height:1.55;color:#4a443c;margin-top:36px">${body}</div>
  <div style="margin-top:auto;font-size:24px;color:#8a8076;border-top:2px solid #e5e0d6;padding-top:18px">${date} · Reliance MET City, Jhajjar</div></div>`;
const H1 = ["Reliance MET City's", " Inaugural International Half Marathon Brings Together 2,500 Runners from Across India and Overseas"];
S["p01-1"] = () => `${bg(grab("mar1"), "50% 50%", "bottom:560px")}<div style="position:absolute;left:0;right:0;top:680px;height:140px;background:linear-gradient(180deg,rgba(10,35,99,0),#0a2363)"></div>
  <div style="position:absolute;left:0;right:0;top:790px;bottom:0;background:#0a2363"></div>${LOCK("tr sh")}
  <div class="t" style="top:860px"><div class="sp" style="font-size:24px;color:#f0d9a6">MET City International Half Marathon</div><div class="cin gold" style="font-size:96px;font-weight:700;margin-top:18px;line-height:1.05">In the<br>Headlines</div><div class="serif" style="font-size:30px;margin-top:22px;opacity:.92">2,500 runners. One city. Swipe for the coverage.</div></div>`;
S["p01-2"] = () => clip("The Tribune", "#1a3a7a", H1, "About 2,500 runners from across India and overseas took part across three categories on an AIMS-certified, traffic-free course at Reliance MET City, Jhajjar.", "27 October 2026");
S["p01-3"] = () => clip("ANI", "#c8102e", H1, "The inaugural edition also saw 85 Special Olympics Bharat delegates run, highlighting the event's focus on sporting excellence and inclusion.", "27 October 2026");
S["p01-4"] = () => clip("Outlook Business", "#b0181e", H1, "Mohit and Priti won the men's and women's 21.1K titles, while Aavkash and Pooja topped the 10K categories.", "October 2026");
S["p01-5"] = () => clip("Aryan Age", "#0d5c3b", ["Reliance MET City", " Hosts Inaugural International Half Marathon in Jhajjar With 2,500 Runners"], "A day of personal bests, international cheering zones and a whole township out on the road for the first MET City International Half Marathon.", "October 2026");

// p02 · Warehouse news (their gold-type announcement over a real aerial)
S["p02-1"] = () => `${bg(grab("factoryV2"), "50% 70%")}<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,14,30,.86) 0%,rgba(8,14,30,.55) 40%,rgba(8,14,30,0) 62%)"></div>${LOCK("tr sh")}
  <div class="t" style="top:170px"><div class="mont gold" style="font-weight:800;font-size:92px;line-height:1.02;filter:drop-shadow(0 4px 10px rgba(0,0,0,.4))">WHERE INDIA<br>STORES WHAT<br>IT MAKES</div>
  <div class="mont" style="font-weight:700;font-size:30px;margin-top:26px;letter-spacing:.02em">Mumbai &amp; NCR took 99% of India's<br>new warehouse demand</div><div style="font-size:20px;margin-top:10px;opacity:.85">Source: Knight Frank, November 2026</div></div>
  <div style="position:absolute;left:90px;right:90px;bottom:70px;background:#fff;color:#1b1712;border-radius:999px;padding:20px 30px;text-align:center;font-size:23px;font-weight:600;box-shadow:0 10px 30px rgba(0,0,0,.3)">Logistics at Reliance MET City · Reliance Retail · Jio · IndoSpace · AllCargo · FM Logistics</div>`;

// Concept day greetings (their Energy Day / Gandhi Jayanti / Vijay Diwas posts): concept art + serif text
const day = (n, top, bottom, opts = {}) => `${bg(art(n), opts.pos || "50% 50%")}${LOCK(opts.lock || "tr", opts.lockSt || "")}
  <div class="t" style="top:${opts.top || 150}px;color:${opts.ink || "#13234a"}">${top}</div>${bottom ? `<div style="position:absolute;left:0;right:0;bottom:0;height:300px;background:linear-gradient(0deg,rgba(0,0,0,.55),rgba(0,0,0,0))"></div><div class="t" style="bottom:${opts.bottom || 70}px;color:${opts.ink2 || opts.ink || "#13234a"}">${bottom}</div>` : ""}`;
S["p03-1"] = () => day("p03", `<div class="serif" style="font-size:38px">The light that shows the way.</div><div class="cin" style="font-size:84px;font-weight:700;margin-top:18px;color:#7a3d0c">Happy Gurpurab</div><div class="sp" style="font-size:24px;margin-top:16px;color:#6b4b1e">Guru Nanak Jayanti · 24th November</div>`, "", { lock: "tc dk", top: 270, ink: "#3b2410" });
S["p06-1"] = () => day("p06", `<div class="serif" style="font-size:46px;line-height:1.3">A cleaner tomorrow<br>starts with every tree.</div>`, `<div class="serif" style="font-size:30px">#NationalPollutionControlDay</div><div class="sp" style="font-size:20px;margin-top:10px">2nd December, 2026</div>`, { top: 190, ink: "#13234a", ink2: "#fff", lock: "tr dk" });
S["p08-1"] = () => day("p08", `<div class="serif" style="font-size:46px;line-height:1.3">Every city grows<br>from the ground up.</div>`, `<div class="serif" style="font-size:30px">#WorldSoilDay</div><div class="sp" style="font-size:20px;margin-top:10px">5th December, 2026</div>`, { top: 190, ink: "#13234a", ink2: "#fff", lock: "tr dk" });
S["p12-1"] = () => day("p12", `<div class="serif" style="font-size:46px;line-height:1.3">Every unit saved<br>powers tomorrow.</div>`, `<div class="serif" style="font-size:30px">#NationalEnergyConservationDay</div><div class="sp" style="font-size:20px;margin-top:10px">14th December, 2026</div>`, { top: 190, ink: "#13234a", ink2: "#fff", lock: "tr dk" });
S["p13-1"] = () => day("p13", `<div class="cin" style="font-size:88px;font-weight:700;color:#fff;text-shadow:0 3px 16px rgba(0,0,0,.35)">VIJAY DIWAS</div><div class="sp" style="font-size:24px;margin-top:10px;color:#fff">16th December 1971</div><div style="width:120px;height:2px;background:#e9d3a0;margin:22px auto"></div><div class="serif" style="font-size:30px;color:#fff;line-height:1.4">Honouring the courage, spirit and<br>sacrifice of our soldiers.</div>`, "", { top: 190, lock: "tr sh" });
S["p17-1"] = () => day("p17", `<div class="serif" style="font-size:38px">To the hands that feed the nation.</div><div class="cin" style="font-size:80px;font-weight:700;margin-top:16px;color:#1d3b1e">Happy Kisan Diwas</div><div class="sp" style="font-size:22px;margin-top:14px">23rd December</div>`, "", { lock: "tc dk", top: 270, ink: "#24331f" });
S["p18-1"] = () => day("p18", `<div class="gv gold" style="font-size:112px;line-height:1.05">Merry Christmas</div><div class="serif" style="font-size:30px;margin-top:0;color:#f3ead7">Wishing you a season of joy and togetherness.</div>`, "", { lock: "tc", top: 258 });

// p16 · Club Christmas Eve invite (their Navratri invite)
S["p16-1"] = () => `${bg(art("p16"))}
  ${CLUBLOCK("left:50%;top:150px;transform:translateX(-50%)", 1.25, "#f0d9a6")}
  <div class="t" style="top:330px"><div class="cin" style="font-size:30px;letter-spacing:.12em;color:#f0d9a6">THE SEASON OF JOY BEGINS.</div><div class="gv gold" style="font-size:150px;line-height:1.05;margin-top:20px">Merry Christmas</div>
  <div class="serif" style="font-size:32px;margin-top:40px;color:#f6efe0;line-height:1.45">You are cordially invited to celebrate<br>Christmas Eve with us.</div>
  <div class="sp" style="font-size:24px;margin-top:44px;color:#f0d9a6">24th December, 2026 · 7 PM onwards</div><div class="serif" style="font-size:26px;margin-top:14px;color:#f6efe0">MET City Club &amp; Convention Centre</div></div>`;

// p04 · Champions (Half Marathon sage + photo frame look)
const HM = HMLOCK("left:72px;top:66px");
S["p04-1"] = () => `<div class="sage"></div><div style="position:absolute;inset:40px;border:2px solid rgba(255,255,255,.55)"></div>${HM}
  <div class="t" style="top:380px"><div class="serif" style="font-size:118px;line-height:1.05">Meet the<br>Champions</div><div class="cin" style="font-size:36px;margin-top:40px;color:#f3ead7;letter-spacing:.08em">INAUGURAL EDITION · 25 OCT 2026</div><div class="serif" style="font-size:30px;margin-top:22px;opacity:.9">One city. One run. Four champions.</div></div>`;
const champ = (photo, pos, cat, name) => `${bg(grab(photo), pos, "bottom:420px")}<div style="position:absolute;left:0;right:0;top:0;height:260px;background:linear-gradient(180deg,rgba(0,0,0,.6),rgba(0,0,0,0))"></div><div style="position:absolute;left:0;right:0;bottom:0;height:420px;background:#7b8a5f"></div><div style="position:absolute;inset:40px;border:2px solid rgba(255,255,255,.6)"></div>${HM}
  <div class="t" style="bottom:120px"><div class="osw" style="font-weight:700;font-size:34px;letter-spacing:.06em;color:#eef0e4">${cat}</div><div class="serif" style="font-size:110px;line-height:1.05;margin-top:6px">${name}</div></div>`;
S["p04-2"] = () => champ("mar1", "50% 50%", "21.1K · Men's Champion", "Mohit");
S["p04-3"] = () => champ("mar9", "50% 50%", "21.1K · Women's Champion", "Priti");
S["p04-4"] = () => champ("mar16", "50% 50%", "10K · Men's Champion", "Aavkash");
S["p04-5"] = () => champ("mar2", "50% 50%", "10K · Women's Champion", "Pooja");

// p05 · Why Celeste (their campaign carousel structure, Celeste navy-gold look)
const CEL = CELLOCK(70);
const ICON = { floor: '<rect x="20" y="10" width="60" height="80" rx="2"/><path d="M20 37h60M20 63h60"/><rect x="34" y="42" width="32" height="16" fill="#d9b96e" stroke="none"/>', bhk: '<path d="M10 50 L50 15 L90 50"/><path d="M20 45v45h60V45"/><path d="M42 90V65h16v25"/>', terrace: '<path d="M10 40h80"/><path d="M15 40v45M85 40v45M30 40v45M50 40v45M70 40v45"/><path d="M10 85h80"/><circle cx="50" cy="18" r="9"/>', car: '<path d="M15 60l10-24h50l10 24v18H15z"/><circle cx="30" cy="80" r="7"/><circle cx="70" cy="80" r="7"/><path d="M8 92h84"/>' };
const why = (ic, title, sub, extra = "") => `<div class="celeste"></div>${bg(grab("celBuild"), "50% 60%", "top:900px;-webkit-mask-image:linear-gradient(180deg,transparent,#000 160px);opacity:.9")}<div style="position:absolute;inset:34px;border:1.5px solid rgba(217,185,110,.7)"></div>${CEL}
  <div class="t" style="top:350px"><svg width="150" height="150" viewBox="0 0 100 100" fill="none" stroke="#d9b96e" stroke-width="3">${ICON[ic]}</svg>
  <div class="serif" style="font-size:76px;line-height:1.15;color:#e3c47e;margin-top:24px">${title}</div><div class="sp" style="font-size:24px;margin-top:22px;letter-spacing:.22em">${sub}</div>${extra}</div>`;
S["p05-1"] = () => `<div class="celeste"></div><div style="position:absolute;inset:34px;border:1.5px solid rgba(217,185,110,.7)"></div>${CEL}
  <div style="position:absolute;left:270px;top:330px;width:540px;height:540px;border-radius:50%;background:url(${grab("celBuildSq")}) center/cover;box-shadow:0 0 0 6px #c9a55c,0 20px 60px rgba(0,0,0,.45)"></div>
  <div class="t" style="top:940px"><div class="serif" style="font-size:96px;color:#e3c47e">Why Celeste</div><div class="sp" style="font-size:24px;margin-top:20px;letter-spacing:.22em">Independent floors · Sector 8 · Swipe</div></div>`;
S["p05-2"] = () => why("floor", "One Apartment<br>Per Floor", "Privacy, by design");
S["p05-3"] = () => why("bhk", "Spacious<br>3BHK + 3T", "Room for the whole family");
S["p05-4"] = () => why("terrace", "Your Own<br>Private Terrace", "Evenings under your own sky");
S["p05-5"] = () => why("car", "The Freedom of<br>Stilt Parking", "One of only 40 exclusive residences", `<div style="margin-top:34px;display:inline-block;border:1.5px solid #d9b96e;border-radius:999px;padding:12px 28px;font-size:24px;color:#f0d9a6">Book your visit · HRERA-PKL-JJR-844-2026</div>`);

// p07 · International Day of Persons with Disabilities (real photo + navy band)
S["p07-1"] = () => `${bg(grab("so"), "50% 35%", "bottom:380px")}<div style="position:absolute;left:0;right:0;bottom:0;height:420px;background:#0e1f45"></div>${LOCK("tr sh")}
  <div class="t" style="bottom:110px"><div class="serif" style="font-size:54px;line-height:1.25">85 Special Olympics Bharat athletes.<br><span style="color:#e3c47e">One finish line.</span></div><div class="sp" style="font-size:21px;margin-top:26px;color:#cfd8ee">International Day of Persons with Disabilities · 3rd December</div></div>`;

// p09 · What makes a city green? (their sky-blue concept series: one serif line over a real photo)
const series = (photo, pos, line, sub = "") => `${bg(grab(photo), pos)}<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,30,60,.62) 0%,rgba(10,30,60,.22) 30%,rgba(10,30,60,0) 52%)"></div>${LOCK("tr sh")}
  <div class="t" style="top:190px"><div class="serif" style="font-size:52px;line-height:1.3;text-shadow:0 2px 14px rgba(0,0,0,.45)">${line}</div>${sub ? `<div class="sp" style="font-size:21px;margin-top:20px;text-shadow:0 1px 8px rgba(0,0,0,.5)">${sub}</div>` : ""}</div>`;
S["p09-1"] = () => series("gate", "50% 60%", "What makes<br>a city green?", "Swipe through MET City");
S["p09-2"] = () => series("goldRoad", "50% 40%", "1,00,000+ trees planted.<br>And counting.");
S["p09-3"] = () => series("solar", "50% 50%", "40%+ of our energy<br>comes from the sun.");
S["p09-4"] = () => series("wtp", "50% 60%", "100% recycled water<br>for horticulture.");
S["p09-5"] = () => series("command", "50% 50%", "Air quality, monitored<br>in real time.");
S["p09-6"] = () => series("tower", "50% 40%", "At MET City,<br>green is the plan.", "North India's only IGBC Platinum-rated greenfield smart city");

// p10 · Milestone (their "We Hit Century")
S["p10-1"] = () => `${bg(grab("starRound"), "50% 55%")}<div style="position:absolute;inset:0;background:rgba(10,40,10,.28)"></div>${LOCK("tr sh")}
  <div class="t" style="top:300px"><div class="gv" style="font-size:170px;line-height:1.05;text-shadow:0 4px 24px rgba(0,0,0,.45)">Made for<br>the World</div></div>
  <div class="t" style="bottom:150px"><div class="mont" style="font-weight:800;font-size:40px;line-height:1.35;letter-spacing:.03em;text-shadow:0 2px 14px rgba(0,0,0,.55)">600+ COMPANIES<br>FROM 10+ COUNTRIES,<br>40,000+ JOBS AND GROWING.</div></div>`;

// p11 · Club winter carousel (the Club's own bold-sans look)
const clubTop = `${CLUBLOCK("left:56px;top:50px", 1)}<div style="position:absolute;right:60px;top:66px;font-family:Montserrat;font-weight:800;font-size:30px;letter-spacing:.08em">IHMS</div>`;
const club = (photo, pos, head, sub) => `${bg(grab(photo), pos)}<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,12,20,.75) 0%,rgba(10,12,20,.25) 40%,rgba(10,12,20,0) 60%,rgba(10,12,20,.6) 100%)"></div>${clubTop}
  <div style="position:absolute;left:60px;right:60px;top:200px;font-family:Montserrat;font-weight:800;font-size:96px;line-height:1;text-shadow:0 4px 24px rgba(0,0,0,.45)">${head}</div><div style="position:absolute;left:60px;right:60px;bottom:80px;font-size:34px;font-weight:600;text-shadow:0 2px 12px rgba(0,0,0,.6)">${sub}</div>`;
S["p11-1"] = () => club("clubDusk", "50% 100%", "WINTER<br>WEEKENDS,<br>SORTED", "Sunny lawns · warm meals · family time");
S["p11-2"] = () => club("clubNight", "50% 60%", "EVENINGS,<br>LIT UP.", "Dinners, music and get-togethers by the lawn");
S["p11-3"] = () => club("clubLobby", "50% 50%", "CELEBRATE<br>IN STYLE.", "Banquets and lawns for every occasion");
S["p11-4"] = () => club("clubDay", "50% 50%", "MEMBERSHIPS<br>OPEN.", "DM us to make the Club part of your winter");

// p14 · JIT explainer (their split white/blue panels with a photo below)
const split = (q, a, body, photo, pos) => `<div style="position:absolute;inset:0;background:#fff"></div><div style="position:absolute;left:330px;right:0;top:0;bottom:0;background:linear-gradient(180deg,#1f5fd1,#1849b0)"></div>
  ${bg(grab(photo), pos, "top:920px")}${LOCK("tr")}
  <div style="position:absolute;left:44px;width:260px;top:330px;font-family:Poppins;font-weight:600;font-size:52px;line-height:1.12;color:#13234a;text-align:right">${q}</div>
  <div style="position:absolute;left:380px;right:70px;top:330px"><div style="font-family:Poppins;font-weight:700;font-size:54px;line-height:1.12">${a}</div><div style="font-family:Poppins;font-size:30px;line-height:1.45;margin-top:24px;opacity:.95">${body}</div></div>`;
S["p14-1"] = () => `<div style="position:absolute;inset:0;background:linear-gradient(180deg,#1f5fd1,#123a8f)"></div>${bg(grab("panAerial"), "50% 50%", "top:860px")}${LOCK("tr")}
  <div class="t" style="top:240px"><div class="sp" style="font-size:26px;color:#cfe0ff">Japan Industrial Township</div><div class="mont" style="font-weight:800;font-size:220px;line-height:1;margin-top:10px">1 of 11</div><div style="font-size:38px;font-weight:600;margin-top:10px">official JITs in India, and one is in Haryana.</div><div style="font-size:26px;margin-top:24px;opacity:.85">Swipe to see why →</div></div>`;
S["p14-2"] = () => split("What is a JIT?", "A township backed by India and Japan.", "Driven by India's DPIIT and Japan's METI, with support from Japan Plus and JETRO, to bring Japanese investment to key industrial corridors.", "japanDel", "50% 40%");
S["p14-3"] = () => split("Why MET City?", "It's ready to build.", "A 220 KV substation, wide arterial roads, plug-and-play plots, logistics support and water treatment, already in place.", "panAerial", "50% 50%");
S["p14-4"] = () => split("Who's here?", "Six leading Japanese companies.", "Including Panasonic, Denso and Nihon Kohden, across electronics, auto components and medical devices.", "nihon", "50% 50%");
S["p14-5"] = () => split("What's next?", "Your plant could be.", "Freehold industrial plots with single-window clearance support. Enquire at metcity.in", "factoryV", "50% 70%");

// p15 · Power of Five: Sustainability (their royal cover + photo slides)
S["p15-1"] = () => `<div class="royal"></div>${LOCK("tr")}<div class="t" style="top:330px"><div class="cin gold" style="font-size:70px">The Power of</div><div class="cin gold" style="font-size:230px;font-weight:700;line-height:.95">FIVE</div><div style="font-size:50px;font-weight:600;margin-top:40px">Power of Sustainability</div><div class="sp" style="font-size:24px;margin-top:20px;color:#cfd8ee">Sector 8 · Reliance MET City</div></div>`;
const five = (photo, pos, title, body) => `${bg(grab(photo), pos)}<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,24,72,.88) 0%,rgba(8,24,72,.55) 34%,rgba(8,24,72,0) 58%)"></div>${LOCK("tr sh")}
  <div class="t" style="top:170px"><div class="serif gold" style="font-size:76px">${title}</div><div style="font-size:30px;line-height:1.45;margin-top:22px;text-shadow:0 2px 10px rgba(0,0,0,.4)">${body}</div></div>`;
S["p15-2"] = () => five("golden", "50% 50%", "1,00,000+ Trees", "Tree-lined avenues and green buffers<br>across the township.");
S["p15-3"] = () => five("living", "50% 70%", "700+ Acres of Green", "Green cover all around Sector 8,<br>for cleaner air and calmer days.");
S["p15-4"] = () => five("wtp", "50% 70%", "Recycled Water", "100% recycled water for horticulture,<br>managed by SCADA.");
S["p15-5"] = () => five("sultanpurNP", "50% 60%", "A National Park<br>Next Door", "Sultanpur National Park and<br>Sarbasirpur Forest, right next to the city.");

// p19 · Tribute: the card made in the first real-photo pass
S["p19-1"] = () => `<div style="position:absolute;inset:0;background:#fbf8f1"></div><div style="position:absolute;inset:44px;border:2px solid #c9a55c"></div>
  <div style="position:absolute;left:380px;top:110px;width:320px;height:320px;border-radius:50%;background:url(${grab("dhirubhai")}) 50% 30%/cover;box-shadow:0 0 0 4px #c9a55c"></div>
  <div class="t serif" style="top:470px;color:#1f1a14;font-size:64px;line-height:1.22"><span style="color:#b08c45">“</span>Growth is life. And growth<br>must be continuous.<span style="color:#b08c45">”</span></div>
  <div style="position:absolute;left:465px;top:660px;width:150px;height:1.5px;background:#c9a55c"></div>
  <div class="t serif" style="top:690px;color:#2b241d;font-size:40px">Sh. Dhirubhai Ambani</div><div class="t serif" style="top:746px;color:#5a5148;font-size:30px">1932 – forever</div>
  <img src="../assets/logo-dark.png" style="position:absolute;left:50%;transform:translateX(-50%);top:900px;width:300px" alt="MET CITY"><div class="t serif" style="top:1120px;color:#5a5148;font-size:30px">Built on belief.</div>`;

// p20 · 2026 year in review (their 2025 look-back: light blue, bold condensed caps)
const yrBg = `<div style="position:absolute;inset:0;background:#a9d1f2"></div><svg style="position:absolute;inset:0" width="1080" height="1350"><g fill="#8fc1ec"><rect x="-60" y="-60" width="300" height="220" rx="60"/><rect x="860" y="80" width="300" height="300" rx="80"/><rect x="-80" y="1100" width="420" height="320" rx="90"/><rect x="820" y="1150" width="300" height="260" rx="70"/></g></svg>`;
S["p20-1"] = () => `${yrBg}${LOCK("tr dk")}<div class="t" style="top:440px;color:#1d3e7a"><div class="osw" style="font-weight:600;font-size:64px">What progress</div><div class="osw" style="font-weight:600;font-size:64px">looked like in</div><div class="osw" style="font-weight:700;font-size:230px;line-height:1;color:#3b78d4">2026.</div></div>`;
const yr = (photo, pos, month, line) => `${yrBg}${LOCK("tr dk")}<div style="position:absolute;left:80px;right:80px;top:170px;height:700px;border-radius:30px;background:url(${grab(photo)}) ${pos}/cover;border:8px solid #fff;box-shadow:0 14px 40px rgba(20,50,100,.25)"></div>
  <div class="t" style="top:930px;color:#1d3e7a"><div class="osw" style="font-weight:700;font-size:44px;color:#3b78d4">${month}</div><div class="osw" style="font-weight:600;font-size:60px;line-height:1.08;margin-top:8px">${line}</div></div>`;
S["p20-2"] = () => yr("leed", "50% 62%", "February", "India's first LEED Platinum<br>pre-certified township");
S["p20-3"] = () => yr("clubDusk", "50% 70%", "May", "MET City Club &amp;<br>Convention Centre opens");
S["p20-4"] = () => yr("mou", "50% 30%", "June", "₹8,646 crore MoUs signed<br>with Haryana");
S["p20-5"] = () => yr("igbcFm", "50% 40%", "June", "Founding Member of the<br>Indian Green Building Council");
S["p20-6"] = () => yr("plots", "50% 70%", "October", "Sector 8, Pockets C &amp; E:<br>a sold-out chapter");
S["p20-7"] = () => yr("mar1", "50% 50%", "October", "2,500+ runners at our first<br>International Half Marathon");

// p21 · New Year (their navy New Year card; 2027 filled with real greenery)
S["p21-1"] = () => `<div style="position:absolute;inset:0;background:linear-gradient(180deg,#070f26,#0e1f45)"></div>${bg(grab("clubNight"), "50% 50%", "top:860px;-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 240px)")}${LOCK("tc")}
  <div class="t serif" style="top:270px;font-size:42px">Here's to a year of growing greener.</div>
  <div class="t mont" style="top:340px;font-weight:800;font-size:280px;line-height:1.1;background:url(${grab("starRound")}) center/cover;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent">2027</div>
  <div class="t serif" style="top:690px;font-size:68px">Happy New Year.</div>`;

// ---- Render -----------------------------------------------------------------------------------------------------
const only = process.argv.slice(2);
for (const [name, f] of Object.entries(S)) {
  if (only.length && !only.some((o) => name.startsWith(o))) continue;
  const out = path.join(D, "out", name + ".png");
  if (typeof f === "string") { fs.copyFileSync(path.join(D, f), out); console.log("ok", name, "(copied)"); continue; }
  const html = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="../../real/fonts.css"><style>${CSS}</style></head><body><div class="c">${f()}</div></body></html>`;
  fs.writeFileSync(path.join(D, "pages", name + ".html"), html);
  spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", `--user-data-dir=${path.join(require("os").tmpdir(), "mc2-" + name)}`, "--allow-file-access-from-files",
    "--window-size=1080,1350", "--virtual-time-budget=6000", "--run-all-compositor-stages-before-draw", `--screenshot=${out}`, "file:///" + path.join(D, "pages", name + ".html").replace(/\\/g, "/")], { stdio: "ignore" });
  console.log(fs.existsSync(out) ? "ok" : "FAIL", name);
}
