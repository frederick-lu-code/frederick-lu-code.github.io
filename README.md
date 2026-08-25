# Freddie

A personal site. Guitar covers, essays, and the things worth being obsessive
about. Built with Astro, Tailwind 4 and MDX.

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
npm run preview    # serve the built site
```

## Before you deploy

The site ships with no covers and no essays, on purpose. The sections that hold
them are still there, showing an empty slot until you add a file.

Placeholders to replace:

1. `src/config.ts` — tagline, email, socials, and the `url`. The URL also has to
   be updated in `astro.config.mjs` and `public/robots.txt`, since neither can
   import TypeScript. `NOW` and `MARQUEE` are empty arrays; the homepage strip
   and the scrolling band only render once they have entries.
2. `public/portrait.svg` — replace with a real photo and point the `src` at it
   in `src/pages/index.astro` and `src/pages/about.mdx`.
3. `src/pages/about.mdx` — scaffolding, waiting to be written.

While the collections are empty, `astro build` prints `The collection "covers"
does not exist or is empty`. That is expected and stops once a file exists.

Any static host works. Vercel and Cloudflare Pages both detect Astro with no
configuration; `public/_headers` sets cache lifetimes for the ones that read it.

## Adding things

**A guitar cover.** Drop a markdown file in `src/content/covers/`:

```yaml
---
title: Blackbird
artist: The Beatles
youtubeId: dQw4w9WgXcQ # the bit after v= in the URL
date: 2026-08-01
featured: false # pins it to the top of /music
tags: [fingerstyle, capo 2]
note: Why you learned it. One or two sentences, in your voice.
---
```

**A project.** Drop a markdown file in `src/content/projects/`:

```yaml
---
title: The thing
deck: What it is, in a sentence or two.
href: https://example.com
date: 2026-08-01
featured: false
tags: [ios, rust]
---
```

**An essay.** Drop an `.mdx` file in `src/content/musings/`. It needs `title`,
`deck` and `date`; `tags`, `updated` and `draft` are optional. Drafts show up in
`npm run dev` and are excluded from the build. Two components are available
inside MDX:

```mdx
import Aside from "../components/Aside.astro";
import Figure from "../components/Figure.astro";

<Aside label="A thing I believe">Something off to one side.</Aside>
<Figure src="/photo.jpg" alt="..." caption="..." tilt={-1.5} />
```

Footnotes, tables and strikethrough work out of the box via GitHub-flavoured
markdown.

## Design system

Everything lives in `src/styles/global.css`.

The palette is `paper #eae7e0`, `paper-light #f7f5ef`, `ink #1a1a1a`,
`stone #676460`, `rust #a8481f` and `marigold #d9962b`. One accent does the
work; resist adding a second.

Type is a typewriter face for body and a display face for headlines, set by
`--font-body` and `--font-display`. To try other pairings, run `npm run dev` and
open **`/type-lab`**, which renders real prose in every combination with live
size, measure and line-height controls. It is excluded from the sitemap, carries
a `noindex`, and redirects to the homepage in a production build.

The display candidates are grouped by the voice they give the site: **loud**
(Anton, Big Shoulders, Unbounded), **odd** (Bricolage Grotesque, Syne), **warm**
(Young Serif, Zilla Slab, Newsreader), **sharp** (Bodoni Moda, Gloock), and
**none**, which sets headlines in the typewriter face at display size. Young
Serif is the current default.

Switching the display face means three edits kept in sync: `--font-display` in
`src/styles/global.css`, the `@fontsource` import in `src/layouts/Base.astro`,
and the `fonts` array in `src/pages/og/[...route].ts`, which needs a TTF or OTF
in `src/assets/og-fonts/` rather than a package.

`npm run fonts` renders the name specimen once per candidate into
`.screenshots/fonts/`, for comparing them all at once. It needs the dev server,
since `/type-lab` redirects in a production build.

Once you have settled on a pairing, the losing candidates can go: uninstall the
unused `@fontsource` packages, drop their imports from `src/pages/type-lab.astro`,
and delete `public/fonts/` plus the TT2020 `@font-face` blocks if TT2020 did not
win. They cost visitors nothing today (nothing links them, so nothing fetches
them) but they add about 2.5MB to the deploy.

Colours are held to WCAG AA. `stone`, `stone-warm` and `rust` were each darkened
from the values on Igweze's site, which sit between 2.9:1 and 4.0:1 against this
paper. `rust-bright` fails as text and is for decoration only. `npm run a11y`
checks this; run it after any palette change.

### TT2020

The randomised-typewriter option is subset from
[ctrlcctrlv/TT2020](https://github.com/ctrlcctrlv/TT2020). Upstream ships about
1.8MB per weight because every letter carries dozens of alternates that the
`calt` feature cycles through, which is what makes repeated letters differ.
`scripts/subset-tt2020.sh` trims that to roughly 440KB while keeping the effect.
It needs `pip install fonttools brotli`.

## Checks

```sh
npm run check                          # astro + TypeScript diagnostics
npm run shots  -- http://localhost:4321   # screenshot every route, desktop and mobile
npm run a11y   -- http://localhost:4321   # axe-core, WCAG 2.1 AA, exits non-zero on failure
node scripts/weigh.mjs http://localhost:4321/   # transfer weight by resource type
```

`shots` and `a11y` read the route list out of `dist/`, so run `npm run build`
first and point them at `npm run preview`. Screenshots land in `.screenshots/`,
which is gitignored.

## Licences

Courier Prime, TT2020, and every display candidate (Anton, Big Shoulders
Display, Unbounded, Bricolage Grotesque, Syne, Young Serif, Zilla Slab,
Newsreader, Bodoni Moda, Gloock) are under the SIL Open Font License.
