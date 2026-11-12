# Posts: hooks → plan → produce → QA → deliver

## 2. Hooks and the fact sheet

Collect true things to post about, in this order:
1. **News:** press coverage of the brand, industry reports that quote it, awards, rankings. Keep the headline, publication, date and link.
2. **Upcoming:** launches, releases, events, webinars, store openings, policy dates, the brand's own series.
3. **Calendar:** national and industry days that fit the brand and that it marked last year. Check each date.
4. **Evergreen:** numbers, features and certifications from its site and posts.

Write one fact sheet: claim → source link. Rules:
- No prices, distances or statistics unless they're public.
- Never fake quotes from real people, clippings, partners or real third-party tenants.
- Proposals (an event, an offer) get a note saying the client must confirm them.

## 3. Plan

For each post, set:
- `id`, date, time (local), account;
- format: image, carousel (n slides) or reel;
- `ref`: the IDs of the real posts it copies, with a note on what is copied;
- type (one from the taxonomy) and the hook;
- the look (the layout of the reference, new content);
- the caption (their voice and hashtags);
- the facts as `[claim, sourceKey]`;
- how it's made: `html` (real photos + text) or `codex` (concept art + text);
- a note (anything for the client to confirm).

Rules:
- Same format as the reference. Festive copies festive.
- Their mix, their pace. Spread accounts (main, sub-brands, collabs) as they do.
- **Approval page:** each post card with the reference thumbnails (from the Instagram download) on the right, linking to Instagram, plus the Codex image count. Ask "approve and build?"

## 4. Produce

1. **Photo sources map** (`photos-example.cjs` pattern): key → `{ file or video + time, crop [w,h,x,y] }`.
   - Take frames from 1080p video and crop past any burned-in captions and logos.
   - Use Instagram slides from their own posts.
   - Wikimedia Commons is fine for non-brand scenery (log the licence and author).
   - Don't use any one photo more than twice in the month.
2. **Logo assets:** `logo-light.png`, `logo-dark.png` and `emblem.png`. Sub-brand lockups are real emblem + text in the exact arrangement of their posts. Place the logo where their posts do (top-right on photos and series slides, top-centre on greetings and cards).
3. **Codex concept art** (see `codex-imagegen.md`): for greetings and concept posts only. Leave empty sky or space where the text goes. No text.
4. **Templates per post type** (`compose-example.cjs`): one function per reference layout. Text comes from the plan, in brand-matching fonts (downloaded locally). Shading is added under text over photos. Render with headless Chrome at 1080x1350 (feed) or 1080x1920 (story or reel cover), one Chrome profile per render.
5. **Rendering:** carousels are `id-1..n`, images are `id-1`.

## 5. QA: look at every slide (contact strips of 7–8 slides)

Check every one of these:
- [ ] No burned-in caption, watermark or logo from the source inside the crop.
- [ ] The right frame (video timings can differ between the 360p and 1080p versions; check the actual frame).
- [ ] No bad crops (heads, text, a lockup cut off).
- [ ] Text readable over the photo (add a gradient band); no text overlapping the key art.
- [ ] The real logo, sharp, in the right place, not doubled with a logo already in the photo.
- [ ] No misleading pairing: no person photo above someone else's name, award or quote. Use crowd shots instead.
- [ ] Facts and names match the fact sheet. Headlines are quoted exactly.
- [ ] Next to the reference post, it reads as the same family.
- [ ] Variety across the month (photos, colours, layouts).

Fix, re-render, and look again. Report what was fixed.

## 6. Deliver

Use `build-calendar-example.cjs` with `pres.css` and `pres.js`:
- one self-contained HTML file with a month grid, a list, a feed-grid preview and a "▶ Present all posts" button;
- the presenter: ↑/↓ or Space for posts, ←/→ through carousel slides and on to the next post, C toggles the caption, F for full screen, Esc to close, plus a thumbnail strip;
- films embedded as base64 (compress to 720p, CRF 26 first) and played via a blob URL;
- each post shows its caption, sources and a client-facing note.

Test it with `test-presenter.cjs` (open, step through, play, close; no console errors), then send the file.

Wording: for "next month, ready to publish", use no mock-up labels and give honest credits ("Photography: <brand>'s own; concept artwork AI-assisted"). For a pitch, label it as a mock-up.

---

## Worked examples (MET City, Nov 2026)

| Their post (reference) | Our post (same format, new content) |
|---|---|
| Image: Haldiram's "Opening Tomorrow" on a cloth banner over a real roundabout photo | Image: "Where India Stores What It Makes": gold type over a real factory aerial, built on that week's Knight Frank warehouse report |
| Image: "We Hit Century" in script over a grass texture | Image: "Made for the World", script over a real aerial of their star-shaped green roundabout, with "600+ companies · 10+ countries" |
| Carousel: 16 press clippings on a navy blueprint background | Carousel: real Half Marathon headlines (Tribune, ANI, Outlook Business, Aryan Age) as clipping cards on the same blueprint |
| Carousel: "Power of Five", a royal-blue cover, then one slide per pillar with a photo | Carousel: "Why Celeste", a navy cover, then one slide per reason (one apartment per floor, 3BHK+3T, terrace, stilt parking) |
| Carousel: a split white/blue explainer, "What are we?" | Carousel: "Japan Industrial Township, explained" (What is a JIT? Why MET City? Who's here? What's next?) |
| Image: Energy Day 2025, a power icon made of grass on the sky | Image: Pollution Control Day, lungs made of tree canopy (Codex art, no text) with their serif line set in HTML |
| Image: the Navratri invite (festive frame, "You are cordially invited") | Image: Club Christmas Eve invite in the same structure (a proposal; the client confirms) |

What made the user call the first version dumb:
- static posts cut from video thumbnails;
- AI renders of the brand's own factories;
- the brand name typed instead of the logo;
- generic topics;
- planned reels with no footage to make them.
