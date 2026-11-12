// Presenter: shows every post one at a time. Inlined into the calendars by build-calendar.cjs.
// Needs IMGS (name → data URI), VIDS (film → base64 mp4) and POSTS from the page.
// Keys: ← / → move through carousel slides, then on to the previous / next post; ↑ ↓, PageUp/PageDown, Space = previous / next post;
// C = caption panel on/off; F = full screen; Esc = close.
(function () {
  document.querySelectorAll("img[data-s]").forEach(function (im) { im.src = IMGS[im.dataset.s]; });
  var FMT = { image: "Image", carousel: "Carousel", video: "Reel" };
  var SRCLBL = { photo: "Real photo", render: "MET City render", ai: "AI image" };
  var esc = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); };
  var urls = {};
  function filmUrl(k) {
    if (!urls[k]) {
      var bin = atob(VIDS[k]), arr = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      urls[k] = URL.createObjectURL(new Blob([arr], { type: "video/mp4" }));
    }
    return urls[k];
  }
  var P = document.getElementById("pres"), cur = 0, at = 0;
  var media = P.querySelector(".pmedia"), info = P.querySelector(".pinfo"), head = P.querySelector(".ph-h"), count = P.querySelector(".count"), strip = P.querySelector(".strip");
  strip.innerHTML = POSTS.map(function (p, i) { return '<button data-go="' + i + '" title="' + esc(p.title) + '">' + (p.slides[0] ? '<img src="' + IMGS[p.slides[0]] + '" alt="">' : "") + "</button>"; }).join("");

  function dateLong(d) { return new Date(d + "T12:00:00Z").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }); }
  function stopVideo() { var v = media.querySelector("video"); if (v) { v.pause(); } }

  function show() {
    stopVideo();
    var p = POSTS[cur], n = p.slides.length, acct = p.account.slice(1);
    count.innerHTML = "Post " + (cur + 1) + " of " + POSTS.length + " <small>· " + dateLong(p.date) + "</small>";
    head.innerHTML = '<span class="av">MET<br>CITY</span><span><b>' + acct + "</b><small>" + dateLong(p.date) + " · " + p.time + " IST</small></span>";
    var m = "";
    if (p.film) {
      m = '<video src="' + filmUrl(p.film) + '" poster="' + IMGS[p.slides[0]] + '" controls playsinline></video><span class="rl">▶ ' + esc(p.filmLabel) + "</span>";
    } else {
      m = p.slides[at] ? '<img src="' + IMGS[p.slides[at]] + '" alt="">' : '<div style="color:#fff">Image pending</div>';
      if (p.format === "video") m += '<span class="rl">Reel · starting frame</span>';
      if (n > 1) m += '<button class="nav prev" aria-label="Previous slide">‹</button><button class="nav next" aria-label="Next slide">›</button><span class="snum">' + (at + 1) + "/" + n + '</span><div class="dots">' + p.slides.map(function (_, i) { return '<i class="' + (i === at ? "on" : "") + '"></i>'; }).join("") + "</div>";
    }
    media.innerHTML = m;
    var v = media.querySelector("video");
    if (v) { v.play().catch(function () {}); }
    // Phone width follows the media's shape (4:5 feed, 9:16 reel).
    var ratio = p.format === "video" ? 9 / 16 : 4 / 5;
    var phone = P.querySelector(".phone"), h = media.parentElement.clientHeight - head.offsetHeight;
    phone.style.width = Math.round(Math.max(200, h * ratio)) + "px";

    var chips = '<span class="g">' + FMT[p.format] + (n > 1 ? " · " + n + " slides" : "") + "</span><span>" + esc(p.project) + "</span>" + (p.tag ? "<span>" + esc(p.tag) + "</span>" : "") +
      (p.film ? '<span class="r">Finished film</span>' : p.kept ? "<span>November plan</span>" : p.real && p.real[at] ? '<span class="' + (p.real[at] === "ai" ? "" : "r") + '">' + SRCLBL[p.real[at]] + "</span>" : "");
    var s = '<div class="when">' + dateLong(p.date) + " · " + p.time + " IST · " + esc(p.account) + "</div><h2>" + esc(p.title) + '</h2><div class="chips">' + chips + "</div>" +
      '<div class="capt"><b>' + acct + "</b>" + esc(p.caption) + "</div>";
    if (p.script) {
      s += '<table><tr><th>Time (s)</th><th>Visual</th><th>Text on screen</th></tr>' + p.script.beats.map(function (b) { return "<tr><td>" + b[0] + "</td><td>" + esc(b[1]) + "</td><td><b>" + esc(b[2]) + "</b></td></tr>"; }).join("") + "</table>" +
        '<div class="meta2"><b>Length:</b> ' + esc(p.script.length) + " · <b>Voice-over:</b> " + esc(p.script.vo) + "<br><b>Music:</b> " + esc(p.script.music) + "</div>";
    }
    if (p.facts && p.facts.length) s += '<div class="fx"><b>Facts used:</b> ' + p.facts.map(function (f) { return esc(f[0]) + ' (<a href="' + f[2] + '" target="_blank" rel="noopener">' + esc(f[1]) + "</a>)"; }).join("; ") + "</div>";
    if (p.note) s += '<div class="nt">' + esc(p.note) + "</div>";
    info.innerHTML = s; info.scrollTop = 0;
    [].forEach.call(strip.children, function (b, i) { b.classList.toggle("on", i === cur); });
    var on = strip.children[cur]; if (on) on.scrollIntoView({ block: "nearest", inline: "center" });
  }
  function go(i) { cur = (i + POSTS.length) % POSTS.length; at = 0; show(); }
  function slide(d) {
    var n = POSTS[cur].film ? 1 : POSTS[cur].slides.length;
    if (at + d >= 0 && at + d < n) { at += d; show(); }
    else if (d > 0) go(cur + 1);
    else { go(cur - 1); var m = POSTS[cur].film ? 1 : POSTS[cur].slides.length; at = m - 1; show(); }
  }
  function open(i) { P.classList.add("on"); document.body.style.overflow = "hidden"; go(i || 0); }
  function close() { stopVideo(); P.classList.remove("on"); document.body.style.overflow = ""; if (document.fullscreenElement) document.exitFullscreen(); }

  P.addEventListener("click", function (e) {
    var t = e.target;
    if (t.closest(".nav.prev")) slide(-1);
    else if (t.closest(".nav.next")) slide(1);
    else if (t.closest("[data-go]")) go(+t.closest("[data-go]").dataset.go);
    else if (t.closest("[data-act]")) {
      var a = t.closest("[data-act]").dataset.act;
      if (a === "prev") go(cur - 1); if (a === "next") go(cur + 1); if (a === "close") close();
      if (a === "cap") { P.classList.toggle("nocap"); show(); }
      if (a === "fs") { if (document.fullscreenElement) document.exitFullscreen(); else P.requestFullscreen().catch(function () {}); }
    }
  });
  document.addEventListener("click", function (e) {
    if (P.classList.contains("on")) return;
    var b = e.target.closest("[data-i]"); if (b) { open(+b.dataset.i); return; }
    if (e.target.closest("[data-present]")) open(0);
  });
  document.addEventListener("keydown", function (e) {
    if (!P.classList.contains("on")) return;
    var k = e.key;
    if (k === "ArrowRight") { e.preventDefault(); slide(1); }
    else if (k === "ArrowLeft") { e.preventDefault(); slide(-1); }
    else if (k === "ArrowDown" || k === "PageDown" || k === " ") { e.preventDefault(); go(cur + 1); }
    else if (k === "ArrowUp" || k === "PageUp") { e.preventDefault(); go(cur - 1); }
    else if (k === "Escape") close();
    else if (k === "c" || k === "C") { P.classList.toggle("nocap"); show(); }
    else if (k === "f" || k === "F") { if (document.fullscreenElement) document.exitFullscreen(); else P.requestFullscreen().catch(function () {}); }
  });
  // Swipe on the image: left/right = slides (then posts).
  var x0 = null;
  media.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  media.addEventListener("touchend", function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) slide(dx < 0 ? 1 : -1); x0 = null; });
  window.addEventListener("resize", function () { if (P.classList.contains("on")) show(); });
  window.presentPost = open;
})();
