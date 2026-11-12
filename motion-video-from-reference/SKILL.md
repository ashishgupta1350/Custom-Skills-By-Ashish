---
name: motion-video-from-reference
description: 'Make a premium motion graphics video (product launch film, promo, explainer, feature teaser, social ad) that follows a reference video the user supplies, beat for beat, with the user''s own product, story and assets. Use this whenever the user shares a video link or file and wants "a video like this", "in this style", "recreate this for my app", or asks for a motion graphics / launch / promo video at all, including follow-ups such as adding sound effects, music or a voice-over to such a video, or exporting it to MP4. Covers studying the reference frame by frame, mapping every scene to the user''s product, gathering or creating assets, building the animation in code, sound design, voice-over, and rendering.'
---

# Motion video from a reference

The user gives you a sample video and a product. You deliver a finished video that a viewer would place in the same family as the sample: same structure, pacing, visual devices and polish, but about the user's product and made from the user's assets.

The reference is the director. Do not invent a story structure and then decorate it in the reference's colours. Take the reference apart shot by shot, and rebuild each shot with new content. Where you depart from it, do so on purpose and say why.

## Workflow

Work through these in order. Steps 1 to 3 are cheap and decide the quality of everything after them, so do not rush to code.

### 1. Intake

Find out what you have before asking anything. Look in the working folder for product documents, an assets folder, earlier videos, and notes from previous sessions. Then ask, in one message, only for what is missing:

- **The reference:** link or file. More than one is fine; ask which one leads.
- **The product:** what it is, who it is for, and what the video should make the viewer do. A feature document or website link is enough.
- **Assets:** logo, mascot or characters, product screenshots, photos, fonts, brand colours. See step 3 for what to do when these are thin.
- **Format:** length and aspect ratio. Default to the reference's length and 16:9 at 1920x1080, 60 fps.
- **Audio:** sound effects (default yes), music (user supplies the track), voice-over (optional).

If the user has already answered some of these, do not ask again.

### 2. Study the reference and write the shot list

Read `references/study-reference.md` for how to pull frames out of a hosted video when you cannot download it.

Sample densely: about one still per second across the whole video, then extra stills around every cut and every fast move. You cannot hear the audio; say so rather than guessing at it.

Produce two things and show both to the user:

**The shot list**, one row per beat:

| Time | Background | On screen | Motion | Transition out |
|---|---|---|---|---|

**The style system**, a short list: colour roles (not just hex values: which colour is the ground, which is the accent, when they swap), type (weight, size relative to frame, case), the recurring devices (for example "inline icon pushes words apart", "question on pale ground, answer on dark"), the motion vocabulary (how things enter, hold and leave), and the rhythm (typical beat length, where it speeds up).

### 3. Map every beat to the user's product

Write a mapping table and get the user's approval before building. This is the single most important checkpoint, because a wrong story costs a full rebuild.

| Ref time | What the reference does | What ours does | Assets needed |
|---|---|---|---|

Rules for the mapping:

- **Keep the beat count, order and durations** unless the requested length differs; then scale durations proportionally and drop whole beats rather than squeezing all of them.
- **Keep each beat's device.** If the reference shows a phone rising from the bottom beside a two-word line, ours does too, with our screen and our words.
- **Replace all content.** New words, new screens, new imagery. Never reuse the reference's copy, logo, product shots, characters or music. Borrowing structure and motion language is normal craft; lifting their material is not.
- **Write copy at the reference's length.** If their lines are three words, ours are three words. Long lines break the rhythm.
- **Mark invented content.** Example chats, numbers and names you make up for demo screens must be flagged to the user as illustrative. Do not invent performance claims ("10x faster", "saves 5 hours") or facts about the product.

### 4. Assets

List what each beat needs, then fill gaps in this order:

1. **What the user has.** Copy what you use into an `assets/` folder next to the video file with short names; leave originals untouched.
2. **Build it in code.** App screens, chat threads, cards, icons and charts are usually better drawn in HTML, CSS and SVG than screenshotted: they stay sharp at any zoom and can animate internally.
3. **The product's own website.** Official logos and artwork can be collected from the user's own site. Downloading needs the user's go-ahead; record where each file came from.
4. **Generated images.** If this session has an image-generation tool, use it. If not, write an asset brief the user can run in whatever image tool they have (ChatGPT, Codex, Midjourney and so on): one entry per image with file name, size, transparent or solid background, and a full prompt that states the style so the set matches. Tell them to save the results into `assets/`, then continue.
5. **Stock or internet images** only when the licence clearly allows the use, and never another brand's assets or photos of identifiable people without permission.

Do not stall on assets. Build with labelled placeholders of the right size and swap real files in later.

### 5. Build

Start from `assets/template.html` in this skill. It is a working, seek-driven engine: a fixed-size stage, helpers for common moves, a synthesised sound-effects track, and a player. Copy it next to the user's assets and build the scenes into it.

Why this approach: every animation is paused and driven by one `seek(t)` function, so any frame can be shown exactly. That makes the video scrubbable while you work, lets you screenshot any moment to check it, and makes the final render frame-exact with no dropped frames.

Read `references/craft.md` before writing scenes. It holds the quality bar and the mistakes that make a video look cheap.

Build one beat at a time in shot-list order, and keep the timings in one place so retiming is easy.

### 6. Check against the reference

Render stills of your video at the same timestamps you sampled from the reference (see `references/study-reference.md`, "Stills of your own video") and compare them beat by beat. For each beat ask: same composition logic? same amount on screen? same energy? is all text readable for long enough? Fix what is off before adding audio. Show the user a contact sheet or the playable page at this point.

### 7. Audio

Read `references/audio.md`. In short: sound effects are synthesised in the page and timed from the same numbers as the animation; music is the user's track, trimmed, levelled low and faded; voice-over is scripted to the beats, approved by the user, recorded, cut line by line and placed on its scenes.

### 8. Render and deliver

`scripts/capture.ps1` renders every frame through headless Chrome and `scripts/audio.ps1` exports the sound-effects track; FFmpeg encodes and mixes. Commands are in `references/audio.md` under "Render and mix". These scripts are for Windows PowerShell with Chrome or Edge installed and need nothing else; on a machine with Node, Playwright or Puppeteer doing the same seek-and-screenshot loop is equally good.

Before saying it is done, check the file itself: frame count and duration match, a contact sheet pulled from the MP4 looks right, and audio levels are measured. You cannot hear the result, so tell the user that audio was checked by measurement and ask them to listen.

Deliver the MP4, the editable HTML, and a short note of what is illustrative and what needs their check (licences, claims, pronunciation).

## Working with the user

- Show the shot list and the mapping before building, a visual check before audio, and the voice-over script before recording. These are the points where a correction is cheap.
- Installing software, downloading files, spending credits on a paid service and signing in to accounts all need the user. Ask once, clearly, and carry on with whatever does not depend on the answer.
- When the user asks for a change, change the timing data or the scene, re-check the affected frames, and re-render. Do not rebuild from scratch.
