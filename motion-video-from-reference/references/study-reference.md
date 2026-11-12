# Studying a reference video

Goal: enough stills, at known timestamps, to write a shot list. You do not need the file on disk; a browser can seek a video and paint its frames onto a canvas, and you screenshot the canvas.

## Find the video source

Open the page in a browser tool and look for the real media URL:

- a `<video>` element's `currentSrc`, or a `<source>` child
- JSON-LD in the page (`"contentUrl"`) or other embedded JSON containing `.mp4` / `.m3u8`
- gallery sites often lazy-load: the `<video>` has no `src` until played, but the URL is in the page data

If the page only links out to a social post, open that post; its player is usually a `<video>` you can seek directly.

## Contact sheets in the browser

Run this in the page (adjust the URL). It builds a grid of frames with timestamps burned in, on a canvas fixed to the top-left of the page.

```js
const v = document.createElement('video'); v.muted = true; v.preload = 'auto'; v.src = VIDEO_URL;
await new Promise((ok, bad) => { v.onloadedmetadata = ok; v.onerror = () => bad(new Error('video error')); });
const c = document.createElement('canvas'); c.width = 800; c.height = 600;
c.style.cssText = 'position:fixed;left:0;top:0;z-index:2147483647;background:#000;width:800px;height:600px';
document.body.appendChild(c);
window.sheet = async (t0, step, n, cols) => {
  const g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, 800, 600);
  const w = 800 / cols, h = w * v.videoHeight / v.videoWidth;
  for (let i = 0; i < n; i++) {
    const t = Math.min(v.duration - .05, t0 + i * step); v.currentTime = t;
    await new Promise(r => v.onseeked = r); await new Promise(r => setTimeout(r, 80));
    const x = (i % cols) * w, y = Math.floor(i / cols) * h;
    g.drawImage(v, x, y, w, h);
    g.fillStyle = 'rgba(0,0,0,.7)'; g.fillRect(x, y, 44, 16);
    g.fillStyle = '#ff0'; g.font = 'bold 12px monospace'; g.fillText(t.toFixed(1), x + 3, y + 12);
  }
};
[v.duration, v.videoWidth, v.videoHeight]
```

Then call `await sheet(0.4, 1.15, 12, 3)` and take a screenshot; repeat with a later `t0` until the video is covered. Use fewer columns (2, or 1) to read small text.

Things that go wrong:

- **Set the browser viewport to the canvas size** (800x600 here) before screenshotting, so the screenshot maps 1:1.
- **Screenshots can lag the canvas.** Wait a second after drawing, and if a sheet shows missing tiles, screenshot again.
- **A cross-origin video still draws**; the canvas is merely unreadable from script, which does not matter because you screenshot it.
- **Some players change `videoWidth` after the first seek**; read it at draw time, as the snippet does.
- Remove the canvas and reset the viewport when finished, since the user can see this browser.

## What to record

One still per second is the baseline. Add stills at every cut, at the start and end of every move, and wherever text is too small to read in the sheet.

For each beat note: start and end time, background, exact on-screen words, what elements are present, how each element arrives and leaves (direction, overshoot, blur, stagger), any camera move, and the transition. Count how many seconds text stays fully readable; you will match that.

State plainly that you sampled stills, how many, and that you did not hear the audio.

## Stills of your own video

The template accepts `?clean&t=SECONDS`, which hides the player and freezes on that frame. Headless Chrome can screenshot it with no extra tooling:

```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --window-size=1920,1080 --hide-scrollbars --virtual-time-budget=6000 --screenshot="still-12.5.png" "file:///C:/path/video.html?clean&t=12.5"
```

Join several into a contact sheet with FFmpeg (`-filter_complex "...xstack=..."` or the `tile` filter) and place it beside the reference's sheet for the same timestamps.
