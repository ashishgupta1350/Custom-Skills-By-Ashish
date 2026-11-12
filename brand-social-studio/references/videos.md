# Videos: from script to a finished film

This is how the two MET City films were made, generalised for any business. One was a 45 s English industrial ad at 16:9, then 9:16; the other a 30 s Hinglish growth reel at 9:16. The build itself (animation, render, mix) follows the `motion-video-from-reference` skill, plus `hyperframes` and `media-use` for components, captions and audio. This file covers what goes into them, and the lessons from the user's feedback.

## 1. Script ideation: the path the user took

The user's own prompts, in order, which led to two good scripts:
1. "give me video scripts … that you have ideated in the content calendar", then "no, write a proper 25–30 second ad".
2. "give me links of videos that are something similar to this, posted on social media of Indian <industry> companies": find 5 or more real reference videos from the same industry and market.
3. "analyse scripts for 5 videos shared here and come up with a script": take structure from the references (problem → solution opening, map zoom, named clients as proof, parent brand for trust, clear CTA). Note their weak points (tiny captions, clichés, no CTA) and fix them.
4. "try some other angle", then "inspired by India's growth story and how <brand> is becoming part of that". A second film should take a different angle and format: a mobile 30 s piece, emotional and national, in Hinglish.

**So, for any brand:** offer 2–3 angles. One rational/B2B ("where do you build a factory that has to run 30 years?"), one emotional/bigger-story ("India's next chapter has an address"), and optionally one product demo. Write each as a timed table:

| Time | Picture | Voice-over | On-screen text |
|---|---|---|---|

Add:
- **voice direction:** tone, accent and language, for example "confident business owner, not poetic" or "warm, proud Hinglish";
- **music direction**, with the turn points (tense strings → break at 0:08 → building pulse → warm resolve);
- **one visual device** that runs through the film (for example a thin gold line that rises like a growth chart, becomes the road on the map, and closes into the end-card frame);
- **an end card** in brand colours with a CTA (website, "tap to enquire").

Facts only from the brand's site. No prices, drive times or growth rankings unless they're public.

## 2. Reference study (frame by frame)

Follow `motion-video-from-reference`. Download the reference videos (yt-dlp) and make storyboard sheets. Write down:
- the shot list with timings and the cut rhythm;
- camera moves (drone reveals, push-ins, low-angle façades);
- how text appears, the colour grade and the music;
- how the end card is built.

Use the references for craft and structure only. **Never use their footage.**

## 3. Footage and assets

- **The brand's own footage first:** its YouTube channel at 1080p (`yt-dlp`, video only, `--write-info-json`), website videos, and Instagram reels. Make scene-cut and strip sheets and pick clean windows with no burned-in titles.
- **Generic shots** (national montage, problem scenes) come from properly licensed stock: Pixabay, Pexels or Wikimedia Commons with a suitable licence. Log every file in `SOURCES.md`.
- **Never fake the brand's footage. Never redraw logos.** Use the real logo file throughout (a corner bug plus the end card). Make in India or other symbols must be the real mark, drawn correctly.
- **Maps** must show the real geography. If the user sends a map, match it exactly (the KMP Expressway was drawn wrong the first time).

## 4. Voice, captions, overlays, music

- **Voice-over:** ElevenLabs in the browser pane, with the user logged in; the credits are fine for this user. Pick a voice that fits and say which one you picked. Voices that worked: "Satyam Singh – Indian Business Narrator" (English B2B) and "Yatin" (Hinglish). Type one line at a time. Split the take with silencedetect and place each line on the beat.
- **Captions:** professional and word-synced (word timings by forced alignment, or System.Speech per piece). **Show numbers as numerals** in captions ("8,250 acres", not the spoken words).
- **Overlays:** glass-morphism, Apple-style info cards (HyperFrames premium components) that show the fact being spoken. Keep them non-intrusive.
- **Music:** licensed (Mixkit free licence; Pixabay tracks with no Content ID, not AI-made). Ask before downloading and state the licence. Mix: music at about 25%, voice about 11 dB above it, final level about −14 LUFS.

## 5. Lessons from the user's feedback (apply up front)

| The user said | So always |
|---|---|
| "First 8 seconds use real visuals instead of this to show the idea; it's looking very bad" | Open on real, concrete footage (people, places, problems), not abstract motion graphics |
| "Add the logo throughout" | Real logo bug on every shot, plus the logo end card |
| "Low quality pixelated visuals … use cleaner clearer visuals" | Only 1080p+ sources at native or lower scale; drop any shot that has to be upscaled more than 1.3× |
| "Voice and visual are not aligned at places" | Cut each shot to its VO line; check the sync on a frame sheet at every line start |
| "This visual cuts MET City out" / "source video is low quality, use some other relevant visual" | Each shot must show the brand subject clearly; replace weak sources rather than grading them |
| "A little more optimistic" / "use visuals of industrial areas here" / "sky view of the industrial area" | The problem beat should be real but not grim; the solution beat should show the brand's own place from the air |
| "Make in India → add the sher" / "show the numbers in numerical format" / "you have not drawn KMP right" | Real national marks; numerals on screen; true maps |
| "Just render the phone aspect ratio one" | Ask which aspect ratio is needed before spending render time; mobile 9:16 is usually enough for social |
| "Move both videos to Downloads" | Deliver final MP4s to Downloads, named clearly |

## 6. Video QA

Before saying a film is done:
- Make a frame contact sheet at every VO line start and every cut. Check the subject, sharpness, logo, caption timing and that no stock or brand captions leak through.
- Listen through: VO level over the music, no clipping, the music resolves at the end card.
- Confirm the specs: 1080x1920 (or 1920x1080), 30 or 60 fps, H.264 plus AAC, size under 50 MB for sending (keep a 720p copy for embedding in the calendar).
- Check `SOURCES.md` is complete, with every footage, music and stock licence.

## 7. Running two films in parallel (two sessions)

- One browser pane is shared. Message the other session and wait for "pane free" before using it (ElevenLabs, stock sites). Close your tabs and say "pane done" afterwards.
- Reuse the other film's downloaded footage and components read-only: copy them into your own folder, never edit theirs.
- Give each headless Chrome render its own `--user-data-dir`.

## 8. Including films in the calendar

Compress them to 720p (CRF 26, AAC 112k, `+faststart`), grab a strong cover frame (a title or hook frame, not a black frame), and embed them in the presenter (`build-calendar-example.cjs` FILMS block). Put them on empty dates on the main account. If a film is also scheduled elsewhere, say so.
