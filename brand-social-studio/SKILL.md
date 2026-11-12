---
name: brand-social-studio
description: 'Make a brand''s social media content that looks like the brand made it, for any business (real estate, SaaS, agency, D2C, B2B, anything). Covers monthly content calendars of image posts and carousels, festive and day posts, announcement and news posts, reel and ad-film scripts, and short videos (16:9 ads, 9:16 reels) with voice-over, captions, glass overlays and music. Uses a deep study of the brand''s own Instagram, website and YouTube, the brand''s real photos, footage and logo, Codex CLI image generation only for concept art, HTML-set text, and a full-screen presenter file. Use whenever the user asks for social media posts, a content calendar, carousels, festive or greeting posts, reels, an ad film, a promo video or "posts for <company>", or wants a client pitch of ready-to-publish content.'
---

# Brand social studio

Turn a company's own social presence into a month of ready-to-publish posts and videos that look like the company made them.

This skill was built from the Reliance MET City work (Nov 2026).
- **The first attempt** invented a "brand style" from a few thumbnails. It felt generic, and the user called it dumb.
- **The second attempt** studied all 372 of the brand's posts and copied their actual formats with true new content, real photos and the real logo. The user said it was "much, much better".

This skill is the second way.

**Core idea:** don't invent a style. Find the brand's own post formats, reproduce them with true new content, and use the brand's real assets.

## Non-negotiables (each one exists because it went wrong once)

1. **Study the whole account before planning.** Pull every post, slide and caption, with engagement. *Why:* 12 visible posts and some video thumbnails gave a fake picture of the brand.
2. **Every post copies a real post of the same format.** Image posts copy image posts, carousels copy carousels, reels copy reels, festive posts copy festive posts. Name the reference post's ID in the plan. *Why:* static posts made from video thumbnails looked "plain dumb" to the user.
3. **Use the brand's real visuals for real things:** its places, products, people and events, from its own photos, its own video frames and product screenshots. *Why:* AI renders of the brand's own factories looked fake next to the real thing.
4. **Use the real logo file.** Take it from the website (SVG or transparent PNG), the brand kit or a brochure, at or below its native size. Never type the brand name as a stand-in, never redraw it, never upscale it. *Why:* "use the real logos man", "high quality logo, since I am making this for Reliance".
5. **No text written by the image model.** Set every word in HTML/CSS in fonts matching the brand, then render. Codex makes art only. *Why:* misspellings and invented facts.
6. **Every fact has a source link.** No invented prices, statistics, quotes from real people, fake press, or claims about real outside companies. Made-up content (an event, an offer, a partner slot) is allowed only as a proposal the client confirms. *Why:* the client will check.
7. **Plan first, get approval, then produce.** Show each planned post next to the thumbnail of the post it copies. *Why:* Codex time and the user's plan quota cost real usage, and the user wants control.
8. **Check every slide and frame by eye before saying done.** *Why:* each round had burned-in source captions, wrong frames, text you couldn't read, and person photos paired with someone else's name.

## Defaults (follow unless the brand or the user says otherwise; the reason is given so you can adapt)

- **Mix and pace:** match the same season last year and the last 6 weeks, typically 3–4 posts a week. If the user restricts formats (for example "only the 2 reels we made"), that wins.
- **Hooks:** real news first (press, reports that mention the brand, awards), then upcoming launches, events and releases, then the dates the brand marked last year, then evergreen facts.
- **Real versus AI:**
  - real photos wherever the brand used real photos (announcements, recaps, project and product posts);
  - Codex concept art (with no text) only where the brand itself uses concept art: greetings, abstract ideas.
- **Presentation:** one self-contained HTML file with a month grid, post list, feed preview and a full-screen presenter (↑↓ posts, ←→ carousel slides, films playing inline). Use client-ready wording and honest credits.
- **Captions:** the brand's own structure, emoji level and hashtag set (taken from the study). Their voice, not ours.

## Workflow

Read the reference file for each phase when you get there.

| Phase | What | Reference |
|---|---|---|
| 0. Intake | Brand, accounts, window, formats in or out, assets on hand, logins (Instagram, ElevenLabs), how it will be presented | below |
| 1. Study | Export the full Instagram grid, pull the website and YouTube, contact sheets, post-type taxonomy, captions, same season last year | `references/study.md` |
| 2. Hooks and facts | News search, upcoming items, brand facts → a fact sheet with sources | `references/posts.md` §2 |
| 3. Plan | Post-by-post: format + reference ID + hook + look + caption + facts; side-by-side approval page | `references/posts.md` §3 |
| 4. Produce posts | Real-photo crops, official logo assets, Codex concept art, HTML templates per post type, render at 1080x1350 | `references/posts.md` §4, `references/codex-imagegen.md` |
| 5. Videos (if asked) | Script angles, reference-video study, footage sourcing, VO, captions, overlays, music; build with `motion-video-from-reference` / `hyperframes` | `references/videos.md` |
| 6. QA | Every slide and video beat checked by eye; fix and re-render | `references/posts.md` §5, `references/videos.md` §6 |
| 7. Deliver | Presenter HTML with films embedded; sources; short summary of what to confirm | `references/posts.md` §6 |

Industry notes (SaaS, agency, D2C, B2B, real estate, healthcare, education) are in `references/industries.md`. Worked examples from MET City are at the end of `references/posts.md`.

## Intake questions

Ask only what you can't find yourself:
1. Which accounts (main and sub-brands) and what date window?
2. Formats in and out? Any finished videos or assets to include?
3. Is the Instagram login available in the browser pane? Is ElevenLabs logged in (for videos)?
4. How will it be shown: a pitch mock-up, or "your next month, ready to publish"? This changes labelling.
5. Anything to avoid (topics, competitors, prices)?

## Scripts in this skill (`scripts/`)

These worked on Windows 11 with Node 26, FFmpeg, yt-dlp, headless Chrome and Codex CLI. Paths inside are examples, so adapt them.
- `ig-export-snippet.js`: run in the logged-in Instagram tab (javascript tool). It hooks the feed requests, collects every post as you scroll, and saves a JSON file to Downloads (ask the user before saving).
- `ig-pull.cjs`: downloads every image, slide and reel cover from that JSON. `ig-sheets.cjs`: labelled contact sheets per format.
- `pull-site.cjs`: website photos, videos and pages. `sheet.sh`: 24-frame study sheet per video.
- `pdfpage.cjs` + `render.html`: render any page of a PDF (brochures) at high scale, for example to get a vector logo.
- `run-codex.sh`: Codex image generation from a `prompts.tsv`, 5 at a time.
- `compose-example.cjs` + `photos-example.cjs`: the HTML slide compositor (templates per post type, real logo lockups, crop map) used for MET City. Copy it and rewrite the templates for the new brand.
- `build-calendar-example.cjs` + `pres.css` + `pres.js`: the final calendar and full-screen presenter, with films embedded. `test-presenter.cjs`: CDP test (open, step, play, close, console errors).

Fonts: download the brand-matching Google Fonts locally and `<link>` them. A CSS `@import` placed after other rules is ignored.
