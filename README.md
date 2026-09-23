# kaszub.ski

Michal Kaszubski's personal portfolio. A static Astro 7 site: an editorial catalogue of
eight works with dated, contextualised evidence. Every claim on the site traces to
`/var/www/kaszubski/BRIEF.md`; the remaining open questions are in `CONTENT_CHECKLIST.md`.

## Local development

Node 24 LTS is required (the system Node 20 cannot run Astro 7):

```sh
export PATH=/opt/node-lts/bin:$PATH
npm install          # once; keeps the compiler override pinned to 0.4.0
npm run fonts        # copies the woff2 subsets from the fontsource packages into public/fonts
npm run images       # crops the source assets in /var/www/kaszubski/assets into src/assets/work, public/media and public/code
npm run favicons     # regenerates the favicon set from the SVG in scripts/favicons.mjs
npm run dev          # http://localhost:4321
```

`npm run fonts`, `images` and `favicons` are one-off steps; their outputs are kept in the source tree
(the project is not a git repository).

## Editing content

Everything a future edit touches is data, not markup.

- **Case studies**: one `.mdx` per work in `src/content/work/`. The frontmatter carries every
  card field (title, editorialTitle, summary, category, role, years, status, evidence,
  technologies, result, links, cover/coverAlt/coverCaption/coverPosition/coverFit or a typographic
  `plate`, compact, order, featured, flagship, metrics, schemaType, plus `seoDescription`, a meta
  description of at most 160 characters that falls back to `summary`). `years` is optional: leave it out
  while a year is unknown and nothing is printed in its place. A link with `download: true` gets the
  `download` attribute wherever it renders. `coverFit: natural` shows a whole screenshot at its own
  ratio, never cropped. The schema in
  `src/content.config.ts` is strict: the build fails on a missing field, an unknown evidence
  label or a category outside research / products / experiments.
- **Site-wide data**: `src/data/site.ts` (person, links, navigation, the homepage ledger of three entries,
  the "now" line, the homepage "also" row, category copy, homepage order). The contact email is kept as
- **Components** in `src/components/`: Nav, Footer, EvidenceLabel, MetaBlock, ProjectCard
  (image or typographic plate with optional `plate.lines`; `layout="halves"` on the category pages sets truthful
  `sizes`, the Gallery passes each mixed-layout cell its own `sizes` and the halves value the JS filter switches to, `brief` drops the Built-with row on a phone except on the two experiments, a `compact` card prints only the first clause of `role` and of `result` (up to the first semicolon, so write the result with its lead fact first), a work with `evidence: []` prints "None yet verified", `cardCaption` captions a flagship screenshot), Gallery (filters with a no-JS
  fallback), GalleryPage (the shared body of /work and the three category pages), Ledger, Figure, Placeholder, ExternalLink, VideoFacade (YouTube nocookie, click to
  load), LocalVideo (preload none; the player is inert and out of the tab order while its cover is shown), Schematic
  (shared by the per-study schematics: Miqa, Rsna, RsnaKaggleModel, Neuralkite, Chefbot, CashNova; the NeuralTake and AI Zuzi pages draw their own with NeuraltakeMethod and AizuziPipeline, inline SVG in two drawings, wide and narrow, and set their tables with NeuraltakeServices, NeuraltakeStack (`kind="stack"` or `"infra"`) and AizuziStack; `columns` fixes the row
  length so no arrow hangs off a row end, and a down arrow marks each row break; MultilingualShorts draws its own vertical spine), Artworks, ShortsPair and
  MultilingualShortsCode (a code excerpt set in Instrument Sans with tabular figures and no ligatures; the site has
  no monospace face; `white-space: pre` at every width, scrolling inside its plate; the text content keeps the
  file's real indentation and newlines) and EvidenceBand (a full-bleed evidence section; `tone="ink"` or `"shade"`; `items` may be empty, as on ChefBot and RSNA, where the band carries prose or a table alone).
- **Case-study rhythm**: every decisions section is a two-column `<dl class="decisions">` (serif term, sans
  reasoning); figure captions are always stacked, tag over text, with the tag in ink (cobalt is kept for links and
  evidence labels). Rhythm comes from the bands and widths instead. Prose helpers in `src/styles/global.css`:
  `.decisions`, `.inkband` with the class `ink` (an ink-dark full-bleed band), `.xwide` (to the right edge of the
  page grid from 1200px), `.spread` (two columns from 1200px), `.pairs`, `.hide-narrow`, `.offset` with `.pull` (a narrow closing column with one
  serif pull line), `width="wide"` on Figure or the class `wide` (runs past the text column on large
  screens), `table-wrap--nums` (right-aligned tabular figures). Wrap every table in
  `<div class="table-wrap" role="region" aria-label="..." tabindex="0">`. Below 640px a prose table is restacked row by
  row (first two cells on one line, context beneath) and never scrolled sideways; `table-wrap--nums` tables stay
  tables. `scripts/postbuild.mjs` writes `scope="col"` and explicit table roles into the built HTML.
- **Images**: authentic assets only, under `src/assets/work/` (one folder per study where a study
  has several). `public/media/` holds the NeuralKite recording, its poster and `portrait.jpg` (the stable URL that the
  is the analytics exporter offered for download, copied unchanged from `/var/www/kaszubski/assets/code/`.
- **Open Graph cards**: `scripts/og-template.html` is the editable template; `scripts/og.mjs`
  renders one 1200x630 PNG per page into `public/og/` (and `dist/og/`) with Playwright.

Voice and rules: concise British English, no em dashes, no invented figures, evidence labels
from the fixed vocabulary only, dates on every figure that changes over time.

- **NeuralTake and AI Zuzi are two works** (BRIEF.md §13). `/work/neuraltake` is the consultancy: method, nine service
  lines, stack and infrastructure; it never states a contract value, a client name or count, or the user figure.
  `/work/aizuzi` is the client platform, described at product level only until the client confirms it may be named
  (BRIEF.md §14.4): what it does, the stack, the seven integrations by platform name, the zero-data-loss live migration,
  the security work at CV-bullet level, about 50 business users. No implementation tallies (row, view, model, test or
  file counts), lifetimes, limits, endpoints or changelog history anywhere on the site (BRIEF.md §14.2). The client
  company and pilot users are never named. Its cover is `src/assets/work/aizuzi/panel.png`, cropped by `npm run images`.
- **Prominence** (BRIEF.md §14.1). The homepage shows four works: MIQA and AI Zuzi as the two large plates, then
  NeuralKite and ChefBot, then a quiet "also" row linking NeuralTake and the RSNA entry (`homeAlso`); the experiments
  are not on the homepage and their figures are not in the ledger. `homeOrder` in `src/data/site.ts` lists the four;
  catalogue order is `order` in each `.mdx` (1 to 8, the four featured works first), used by `/work` and the category pages.
- **CV** (BRIEF.md §14.5). `src/pages/cv.astro` is built from the facts on Michal's own CV, in its order: education,
  experience (NeuralTake, WorldQuant Brain), projects (MIQA, ChefBot, AI Zuzi, NeuralKite), skills, languages and
  No email, phone number or PDF is published: contact is via LinkedIn and the CV is available on request.

## Build

```sh
npm run build        # astro check (zero errors required) + astro build + postbuild shim + OG images
npm run build:fast   # astro build + postbuild (no type check, no OG images)
```

Output is `dist/` with `build.format: 'file'` and no trailing slashes. Never copy the output of a bare
`npx astro build` to a preview or to staging: it lacks the steps below. The sitemap `lastmod` is read from
`site.revisedISO` in `src/data/site.ts`, the same date as the JSON-LD `dateModified`. `scripts/postbuild.mjs` then:

- writes `scope="col"` and ARIA table roles into every built table;
- writes `dist/work/index.html`. The nginx `try_files` order (`$uri $uri/ $uri.html`) sends `/work` to
  `/work/` with a 301 because the `work/` directory exists for the case studies; the copy makes `/work/`
  render the index instead of a 403. **The 301 itself remains** until the server is changed (see below);
- copies `sitemap-index.xml` to `sitemap.xml`;
- deletes any image in `dist/_astro` that no built page references (unused full-size originals);
- checks every `<img>`: each `src` and `srcset` candidate must have the aspect ratio its `width` and `height`
  attributes claim, and **the build fails if one does not**. astro:assets never upscales, so a crop requested
  wider than its source silently falls back to the uncropped original. `ProjectCard.astro` caps every request
  at what the source can yield for the slot's ratio; this check is the backstop.

Three behaviours chosen deliberately:

- **YouTube facades.** Without JavaScript each still is a plain link to the video on YouTube. With JavaScript it
  becomes a button that swaps in the youtube-nocookie player. The embed URL carries `autoplay=1`: playback starts
  on the visitor's own press and at no other time, so nothing on the site plays unasked. Dropping it would cost
  a second click inside the iframe.
- **External links** open in a new tab and say so to assistive technology through a visually hidden
  "(opens in a new tab)" suffix written by `ExternalLink.astro`. The visible marker is an inline box, not an
  inline-block, so it can never wrap onto a line of its own.
- **The NeuralKite recording** has no direct file link: it is only offered under its "not real data" caption.

## Quality gates

```sh
# serve a build locally (ports 3201 and 3210 are taken by nginx previews; pick a free one)
node /var/www/kaszubski/tools/serve.js dist 3290
# screenshots + errors.json (desktop, phone, reduced motion)
node /var/www/kaszubski/tools/shots.js http://127.0.0.1:3290 /var/www/kaszubski/shots/a \
  --pages=/,/work,/research,/products,/experiments,/about,/cv,/404.html,/work/miqa,/work/neuraltake,/work/aizuzi,/work/neuralkite,/work/chefbot,/work/rsna-kaggle,/work/cash-nova,/work/multilingual-shorts
```

`errors.json` must be empty. The font audit (`node /var/www/kaszubski/tools/fonts.js <baseUrl> <pages>`)
must list exactly two families, Newsreader and Instrument Sans, and no uppercase or tracked text. Before a release,
grep `dist/` (html, js, xml, json) for the strings that must never appear: `£5`, `GDPR compliant`, `mechanism`,
any email address or phone number, `Red Light`, and the removed tallies (`75 API`, `82 URL`, `26 models`, `84 files`, `76 tests`);
a bare `563` still matches two SVG coordinates in the shorts charts, which is fine.
Page weight, measured in Playwright as transferred bytes on the preview after the 18 September 2026 fix round
(uncompressed CSS, as the preview serves it): the homepage's first load was 244 KB on desktop and 228 KB on a
phone; after scrolling the whole page 310 KB on desktop and 337 KB on a phone (the limit is about 600 KB). The two
font files are 159 KB of that, and the click-to-load video is excluded. That is two font files on the
homepage; pages with Polish text add the 11 KB Instrument Sans latin-ext subset. Four woff2 files ship, no
italics (no page sets italic text). Re-measure after changing imagery.

## Release flow

1. `npm run build` with zero errors.
2. Preview: `rm -rf /var/www/kaszubski/build/a/* && cp -a dist/. /var/www/kaszubski/build/a/`, served at
   http://127.0.0.1:3201 and https://a.kaszub.ski. Run the harness and the font audit against it.
3. Publish: copy `dist/` to `/var/www/kaszubski/staging`, then run `/var/www/kaszubski/tools/deploy.sh`,
   which swaps staging into `/var/www/kaszubski/public` atomically and keeps one backup
   (`deploy.sh rollback` restores it).

Server settings the release depends on (owner actions; the build cannot change nginx):

- `/work` currently answers **301 to `/work/`**, while the canonical, the sitemap and the nav all say
  `/work`. Fix in the kaszub.ski server block and the previews: `location / { try_files $uri.html $uri $uri/ =404; }`.
  After that the `/work` shim in `scripts/postbuild.mjs` can go. Treat as a release blocker for SEO and
  verify with `curl -sI https://kaszub.ski/work` (expect 200).
- The custom 404 page is only shown if the server block has `error_page 404 /404.html;`. Smoke check:
  `curl -s https://kaszub.ski/no-such-page | grep -c "Nothing at this address"` should print 1.
- Also wanted: `charset utf-8;`, `gzip_types text/css application/javascript application/json image/svg+xml text/xml
  application/manifest+json;`, `Cache-Control "public, max-age=31536000, immutable"` on `/_astro/` and `/fonts/`,
  `types { application/manifest+json webmanifest; text/plain py; }`, a www to apex redirect, and
  `add_header X-Robots-Tag noindex;` on the a/b/c preview hosts.
- `tools/deploy.sh` still checks `/assets/og.png`, which does not exist in this build, so a correct deploy
  prints one 404. The URLs worth checking are `/sitemap-index.xml` (or `/sitemap.xml`), `/og/home.png`,

Standing content rules (BRIEF.md §10): the two experiments are described as automated API
pipelines, at the level of detail Michal has stated and no further; one Cash Nova album is never
named or shown (the build output is grepped for it before release); the Cash Nova card stays compact.

## Motion

`src/scripts/motion.ts` and `src/styles/motion.css`, no dependencies, about 2.4 KB gzipped. Attributes: `data-reveal`
(`block`, `fade`, `mask`, `off`), `data-reveal-group`, `data-rule`, `data-count`, `data-draw`, `data-parallax`, `data-slide`.
Case-study prose, tables, lists and figure-sized SVGs animate automatically. Hidden states apply only under the `js` class set
in the head, are withdrawn after 2 s if the observer never reports, and are disabled under `prefers-reduced-motion` and in print.
Page transitions use CSS `@view-transition`, not `<ClientRouter />`, so component scripts run on every page load.
