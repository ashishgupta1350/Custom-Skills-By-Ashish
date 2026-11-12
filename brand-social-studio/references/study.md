# Phase 1: study the brand (deep, with numbers and pictures)

The goal is a taxonomy of the brand's real post types, each with 2–3 reference post IDs, plus its look, voice and rhythm. Everything later copies from this.

## 1. Instagram, the main source

**Without a login** only 12 posts per account show. yt-dlp can still download public reels with captions:

```bash
yt-dlp -o "%(id)s.%(ext)s" --write-info-json "https://www.instagram.com/<acct>/reel/<code>/"
```

It fails on photo posts and profiles.

**With the user's login in the browser pane:** Instagram's private `/api/v1/` endpoints return 404 from the pane. Instead, capture the feed data the page itself loads:

1. Open `https://www.instagram.com/<account>/`.
2. Run `scripts/ig-export-snippet.js` part A to install the hook.
3. Scroll to the bottom in short chunks (each javascript-tool call must finish in under 45 s): `window.scrollTo(0, document.body.scrollHeight)` with about 1.5 s waits.
4. Run part B to parse the posts.
5. Ask the user before saving the file. Then part C saves `<acct>-posts-N.json` to Downloads via a Blob link. A second download in the same tab can be blocked silently, so check that it arrived and retry.

The first ~12 posts load before the hook exists. To get them, reload the profile, install the hook immediately, and scroll again. Save each batch to a separate file.

**Then:**
```bash
node scripts/ig-pull.cjs <exports...>
```
Downloads every slide (signed CDN links expire within days, so download straight away). Then:
```bash
node scripts/ig-sheets.cjs
```
Builds labelled sheets: images, carousels (one row per carousel, every slide), reels, and collabs.

Also include **collab posts in the grid** (sub-brand accounts, event pages, local pages). They are often the best performers and have their own looks: partner cards, deadline posters, pop-art festive posters.

**Look at every sheet.** Then classify:
- **Image post types**, for example:
  - day greetings with one concept visual;
  - announcements on a real photo (openings, services);
  - milestones in big type;
  - partner or new-client welcomes;
  - speaker and leadership cards;
  - press clippings on a branded background;
  - project or product cards.
- **Carousel types**, for example:
  - event photo recaps (no text on the slides);
  - concept series (one line per photo);
  - campaign carousels (cover, then one slide per reason);
  - split-panel explainers;
  - press collages;
  - year-in-review.
- **Reel types:** hooks, pacing, text style, end cards.

**Measure:**
- counts per format and year;
- the mix since the same month last year;
- median and average likes per type;
- the top 10 posts and why they worked (real people and events and collabs usually win; abstract concept posts usually lose).

**Captions:**
- dump the last ~100 non-reel captions;
- note hook style, length, emoji, CTA phrasing, the hashtag set and the language mix;
- note grid tricks (for example 3-post triptychs).

**Same season last year:** list every post in the target window a year ago, with its date, type and topic. That gives the recurring dates and series.

## 2. Website

```bash
node scripts/pull-site.cjs
```
Run it with the key pages edited in. It saves pages and media, and `site-media.json` records which page each file came from. Extract page text for facts:
- numbers;
- features;
- certifications;
- clients and partners;
- addresses;
- RERA or other licence numbers.

**Logo:**
- check `<header>` img/svg sources, `logo.svg` (often a base64 PNG wrapper; extract it) and the favicon;
- check brochures and PDFs linked from the site: `pdfpage.cjs` renders any page at scale 10 to find a vector logo;
- check Wikimedia Commons, but watch for different group companies with similar names;
- check the Instagram HD profile picture (often only 500 px).

Make light, dark and emblem-only versions (FFmpeg `geq` recolour, crop). If no vector exists, say so and ask for the brand kit.

## 3. YouTube

- List uploads with `yt-dlp --flat-playlist --print "%(id)s|%(title)s" <channel or uploads playlist>`. Download the last 6 weeks and the same season last year with `--write-info-json`, which gives dates, views and descriptions full of usable facts.
- For footage you'll reuse, download 1080p: `-f "bv*[height<=1920][vcodec^=avc1]"`, video only. Shorts are often 1080x1920.
- Run `bash scripts/sheet.sh <videos>` (24 frames each with timestamps). Find clean frames without burned-in captions or logos; captions usually sit in the top 25% or the lower third. Note crop windows as `[w,h,x,y]`.

## 4. News and press

Use web search in extended mode ("<brand> news <month year>") and the brand's own press-release or blog page. Keep real headlines with their publication names and links. They can be quoted as headlines; never invent mastheads or clippings.

## 5. Write it down

Write `IG-ANALYSIS.md` with:
- the mix table;
- what wins and loses;
- image post types (with reference links);
- carousel types (with links);
- reel patterns;
- collab poster types;
- rules for this calendar.

Also write `SOURCES.md` listing every file, its URL and its licence.
