---
name: website-strategy
description: Plan and build a marketing/landing page for a product or service (agency site, SaaS landing page, campaign page, etc). Triggers on requests like "build a landing page", "make a website for my [product/service]", "I want a page to run ads on", or "redesign our landing page" — especially when the user has reference sites they like and real content (case studies, testimonials, brand assets) to draw from. Plans before writing code — gathers references, asks clarifying questions, and gets the plan approved before writing any files.
---

# Website Strategy — Plan-First Landing Page Builder

Build a landing page the way a strategist would: understand references and real content first, ask the handful of questions only the user can answer, get a written plan approved, *then* build. Never jump straight to code on a website request — the planning pass is the point of this skill.

## Step 1 — Gather references (before anything else)

If the user hasn't already shared reference sites, ask for **3–5 links** to pages they like (competitors, aspirational brands, or pages in the same category). Ask what they like about each — design, content/structure, or both — don't assume.

For every reference given:
- Open it (Browser tools) and actually look at it — don't guess from the URL or domain name.
- Note the **visual system**: color palette (get real hex/approximate values), typography (font families, any distinctive accent treatment like italic serif call-outs), layout patterns (hero style, card shapes, badge/pill usage, spacing rhythm).
- Note the **content structure**: section order, what each section is trying to do, headline/CTA patterns, proof-point placement, form placement.
- If the user liked multiple references for different reasons (e.g., "design from A, content from B"), keep that split explicit — don't blend indiscriminately.

## Step 2 — Gather the user's actual content

Don't invent copy or stats. Before planning, collect what's real:
- **Brand assets**: logo (ask if not provided — check Downloads/Desktop or a connected drive if the user mentions uploading one but you don't have a file path; a logo shared only as a chat image needs to be found on disk or re-requested), name, tagline, contact details (phone/WhatsApp/email/address), any existing brand colors.
- **Proof content**: case studies, testimonials, stats, client logos, screenshots. If the user mentions these live in Google Drive/Notion/a CRM, use the connected tool to search and read them rather than asking the user to paste everything manually.
- **Flag anything that shouldn't be published**: internal strategy docs, practice/learning exercises on dummy data, unverified numbers, or anything that reads as sensitive/financial — call these out explicitly and exclude them rather than silently using them.
- If real proof content is thin, say so plainly rather than padding with generic claims.

## Step 3 — Ask the clarifying questions (use AskUserQuestion)

Ask a compact set of genuinely decision-blocking questions — don't interview endlessly. At minimum, cover:

1. **Primary conversion action** — lead form, calendar booking, WhatsApp/chat-first, phone-first, or a mix. This shapes the hero and every CTA.
2. **Site structure** — single long-scroll page (standard for ad-traffic landing pages) vs. a multi-page site with navigation.
3. **How proof/case-study content should be presented** — featured grid with detail modals, a filterable section, or minimal (logo + one-line stat).
4. **Visual direction** — match a reference palette as-is, use it as a starting point with a different accent color, or the user already has brand colors to use instead.
5. **Deployment platform** — always ask this explicitly if not stated: Netlify, Vercel, GitHub Pages, a different host, or "not sure yet." The answer affects the tech-stack choice (see Step 5) and the deployment packaging (see Step 8).

Use `AskUserQuestion` for these — they're genuine multiple-choice decisions, not open text. Anything open-ended (agency name, contact info, which case studies to feature, exact copy preferences) belongs in plain chat, not the question tool.

## Step 4 — Enter Plan Mode and write the plan

Use `EnterPlanMode` before writing any files. Write the plan to the plan file with:

- **Context**: why this page exists, who it's for, what it needs to do (e.g. "destination for paid Google/Meta ads, needs to convert cold traffic").
- **What was gathered**: summarize the references (design source vs. content source), the real brand assets and proof content found, with enough specifics (actual numbers, actual case study outcomes) that the plan reads as grounded, not generic.
- **Page structure**: section-by-section breakdown in the order they'll appear, each with what it contains and why.
- **Visual system**: colors (with approximate hex), typography, motion/interaction notes, imagery approach (real assets vs. abstract/illustrative — say which and why).
- **Tech stack**: see Step 5 for how to decide this. State the choice and the reason.
- **File structure**: the actual file/folder layout.
- **Open items**: anything that needs the user's input before or during build (missing assets, tracking IDs, exact subdomain name, etc.) — don't let these block the plan, just flag them.
- **Verification plan**: how you'll confirm it actually works (breakpoints to check, interactions to test).

Call `ExitPlanMode` when the plan is ready. Do not start building on your own judgment that the plan is "obviously fine" — get the explicit approval this tool requires.

## Step 5 — Choose the tech stack based on what's actually available

Don't default to a heavy toolchain reflexively. Check what's actually on the machine first:

```
node -v
npm -v
python --version
```

- **If Node/npm is available** and the user wants a richer build (framework, component structure, bundling): Vite + a lightweight stack (vanilla JS or a framework only if genuinely warranted — a single landing page rarely needs React) is reasonable.
- **If nothing is available**, or the deploy target is a plain static host (Netlify, GitHub Pages, S3, etc.) with no build step configured: build **dependency-free static HTML/CSS/JS**. This is not a fallback compromise — it's often the *better* choice for a single landing page: zero build config, deploys by dragging a folder, nothing to break. Prefer it unless there's a concrete reason not to.
- Either way, keep external runtime dependencies minimal. Load web fonts via a direct `<link>`, write interactivity in plain JS (accordion, modal, scroll-reveal, counters, mobile nav) rather than pulling in a framework for a handful of behaviors.
- Wire up lead capture appropriately for the host: Netlify Forms (`data-netlify="true"` + honeypot field) for Netlify, or note the equivalent for other hosts (Vercel needs a serverless function or third-party form service; GitHub Pages needs a third-party form service since it's fully static).
- Include GTM/pixel placeholder + `dataLayer` push points on form submit, call-click, and WhatsApp-click if this is going to run paid ads — conversion tracking is usually the single highest-leverage thing a marketing landing page needs and is easy to forget.

## Step 6 — Process assets

- If a needed asset (logo, etc.) was shared as a chat upload rather than a file path, search likely local folders (Downloads, Desktop) for a matching filename before asking the user to re-supply it.
- If a logo file has excess whitespace/padding, crop it. On Windows without image-editing tools installed, `System.Drawing` via PowerShell can do this: load the bitmap, scan pixel bytes via `LockBits` to find the bounding box of non-white/non-transparent content, crop with padding, and optionally chroma-key white backgrounds to transparent. Generate favicon sizes (32×32, 180×180 apple-touch-icon) and an Open Graph share image (1200×630) the same way if no other tooling is available.
- Prefer separate logo variants (icon-only, wordmark-only, full lockup) over forcing one asset into every placement — a header usually wants something more compact than a footer.

## Step 7 — Build, then preview and verify for real

Don't report a landing page done without actually looking at it rendered.

- If there's no Node/Python to run a dev server and the target is a local preview, `file://` previews in a sandboxed browser tool often silently drop external CSS/JS (rendered as an unstyled snapshot) — don't mistake that for a real bug in the page. Stand up a minimal local static server instead. On Windows with nothing installed, `System.Net.HttpListener` via a small PowerShell script works with zero dependencies (serve by path + MIME-type lookup, run it in the background, preview against `http://localhost:<port>/`).
- Check the page at mobile (~375px), tablet (~768px), and desktop widths.
- Click through every interactive element: nav, accordion, modals, forms (validation at least), sticky/floating elements.
- Check the browser console for errors and check for horizontal overflow (`document.documentElement.scrollWidth` vs `clientWidth`).
- If a screenshot renders unexpectedly blank or partial, don't assume the page is broken — verify with computed styles / DOM queries (opacity, `is-visible` classes, bounding rects) before concluding there's a real bug; browser-automation screenshot tools can have their own transient rendering/timing quirks.

## Step 8 — Package for deployment correctly

If delivering a zip for the user to upload:

- **On Windows, do not use `Compress-Archive` for anything with nested folders that will be extracted on a non-Windows host.** It has been observed writing zip entry names with backslash path separators (`assets\images\logo.png`) instead of the forward slashes the ZIP spec requires. Windows tools normalize this back into real folders, but a Linux-based host (Netlify, Vercel, etc.) extracts it as one flat file with a literal backslash in the filename — every nested asset then 404s while root-level files work fine. This is easy to miss because the zip *looks* correct when listed on Windows.
- Build the zip with `System.IO.Compression.ZipFile` directly instead, writing explicit entry names with `/` separators (replace `\` in relative paths before creating each entry). **Verify** by reading the zip's entries back before sending it — confirm every path uses forward slashes and `index.html` sits at the zip root (not nested inside a wrapper folder).
- After the user deploys and reports something broken, check the *actual* live URL yourself (network requests, response headers, fetch the specific failing paths) rather than guessing from a screenshot alone. A few things worth knowing:
  - Deploy-preview URLs with a long hash prefix (`<hash>--sitename.netlify.app`) are frozen to that specific deploy forever — a newer deploy won't update them. If something looks stale, confirm you're checking the current production URL, not an old preview link.
  - Right after a deploy that fixes a prior broken one, different CDN edge nodes can serve inconsistent results for a short window (some still cached the old 404, some have the fix) — this shows up as the same path randomly returning 200 or 404 across repeated requests. That's edge-cache propagation lag, not a new bug; a "clear cache and redeploy" (Netlify: Deploys → trigger-deploy dropdown → "Clear cache and deploy site") forces it to settle immediately instead of waiting it out.

## Notes on working style

- Real data over generic claims, always. If the user's own case studies/docs have specific numbers, use those verbatim rather than writing marketing-generic stat-strip filler.
- Keep the palette/type choices traceable to a stated reference or the user's own brand assets — "premium" should mean something specific (a named font pairing, a named palette source), not just an adjective.
- Confirm scope explicitly if the user's services are narrower than what a reference site covers (e.g., they only want to advertise two of five services a reference agency lists) — don't let the reference's scope leak into the plan unchecked.
