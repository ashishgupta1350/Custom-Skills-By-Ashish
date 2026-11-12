# Codex CLI image generation (concept art only)

Codex CLI is logged in with the user's ChatGPT subscription. It makes about 1 image per minute, run 5 at a time, and each image counts against the user's plan. Say how many images you'll make in the approval request.

## When to use it
- Use it for concept visuals the brand itself uses: greetings (a sunrise and diyas, a soldier silhouette at dawn, a bulb with a leaf filament, lungs made of trees, a tree made of city lights), festive frames and borders, abstract ideas.
- **Don't use it for:**
  - the brand's own places, products, people or events (use real photos);
  - logos;
  - any text;
  - real public figures' likenesses.

## Prompt rules
Start every prompt with:
> Portrait 1024x1536, final-quality, clean premium marketing visual for a <industry> brand's Instagram. Absolutely no text, letters, numbers, logos or watermarks anywhere. Keep the main subject inside the central 4:5 area.

Then say:
- **where the empty space goes**, matching your layout: "The upper 35% is empty sky" (text and logo go there);
- the subject, the palette (the brand's colours) and the mood;
- "photoreal" or "flat illustration", matching the reference post;
- any respect constraints: "no people, no religious figures", "respectful and dignified".

## Running it
`scripts/run-codex.sh` reads `prompts.tsv` (`name<TAB>prompt` per line) and runs 5 at a time:
```bash
codex exec --skip-git-repo-check --sandbox workspace-write "Generate exactly one image. <prompt> Save it as <name>.png in the current folder. Reply with the file path only." < /dev/null
```
- `< /dev/null` matters, or Codex eats the rest of the TSV.
- In PowerShell, use `codex.cmd`.
- Originals also land in `%USERPROFILE%\.codex\generated_images\`.
- Output is 1024x1536. In the HTML template, use it as a `background-size:cover` layer at 1080x1350. Its centre 4:5 is what shows.

## Afterwards
- Look at every image. Regenerate any with stray text, wrong flags or symbols, or odd anatomy.
- Text, logo and dates are added in HTML on top. Check that nothing overlaps the key art (move the text or shrink the type).
