# Elpis Works — Light/Mid UI Overhaul Plan

Site: static GitHub Pages portfolio at https://little-works.elpis.cc (see `CNAME`). Landing page (`index.html`, `style.css`, `app.js`) lists 8 small demo apps in `elpis_designs/*`.

## Problems found
- Horizontal-scroll card rail with a vertical "MY COLLECTION" sidebar built from `<span>`s; 5.5s forced intro animation (no skip, no reduced-motion support); tiny fonts at narrow widths.
- Heavy markup: each card has 3 links to the same URL + an overlay link; `<small><a href="">` empty links; generic `alt="Card Image"`; `title` attrs duplicated.
- `* { position: relative; animation: ... }` global hacks; implicit globals in `app.js`; `window.outerHeight`.
- Hrefs contain spaces (`elpis_designs/Book List/...`); `og:url`/`og:image` point at old `elpis-alpha.github.io` domain, not the CNAME domain.
- SEO gaps: no canonical, no twitter card, no JSON-LD, no robots.txt/sitemap.xml, no `<noscript>` content, `robots` meta non-standard, duplicate h1, no `<main>`/`<nav>` landmarks.
- Repo hygiene: README is one line, no .gitignore, no LICENSE, `og.pptx`, `.icns`, and stray unused images (`giphy.gif`, `original.gif`, `images (1).jpeg`, `images.jpeg`) in the repo.

## Design direction (modern, not heavy)
- Dark, deep-navy base (keep brand `#00192a`) with a soft aurora/gradient glow background and subtle grain; light theme via `prefers-color-scheme` + manual toggle (persisted in localStorage).
- Keep the brand display font (`Fonts/Devr.ttf`, `Fonts/Acquest.ttf`) for logo/headings only; body in system UI font stack (fast, readable).
- Layout: sticky glass header (logo, theme toggle, GitHub link) → hero (short headline, tagline, project count) → responsive CSS-grid of project cards (1/2/3/4 cols) with lazy images, hover lift + glow, tags per project → footer.
- Add a small client-side search/filter box and tag chips (core functionality upgrade: findable projects). Cards stay plain `<a>`-wrapped articles (one link per card).
- Brief (<1.2s) fade-in intro only, skipped for `prefers-reduced-motion` and repeat visits (sessionStorage). No blocking overlay.

## Work items
1. **Landing page rewrite** — semantic HTML (`header/main/section/footer`), data-driven cards from a single `projects` array in `app.js` rendered into the grid, with static fallback/`<noscript>` list so crawlers and no-JS users still get links. URL-encode hrefs. Descriptive alt text, width/height on images, `loading="lazy"`.
2. **CSS** — rewrite `style.css` with custom properties, fluid type (`clamp`), grid, focus-visible rings, `prefers-reduced-motion`, light/dark tokens. Responsive down to 320px, no horizontal scroll.
3. **JS** — `app.js` as a clean module-less script: theme toggle, filter/search, card rendering, no implicit globals.
4. **UX** — skip-to-content link, keyboard-accessible cards, visible focus, AA contrast, `aria-live` result count, empty-state message, links open in same tab (back button works) — drop `target=_blank` unless `rel="noopener"`.
5. **SEO** — correct canonical + og:url + og:image on `little-works.elpis.cc`, twitter:card, JSON-LD (`WebSite` + `ItemList`/`CreativeWork`), `robots.txt`, `sitemap.xml` (landing + 8 demos), meta description/keywords tuned, `lang`, theme-color for both schemes, manifest fixed (`name`, `description`, `start_url: "/"`, icon `purpose`). Add `<title>`/`description`/viewport to each demo page if missing and a "← Back to Elpis Works" link.
6. **Repo standard** — proper README (what, live URL, structure, run locally with `python3 -m http.server`, license), `.gitignore`, `LICENSE` (MIT, Elpis-alpha), `.editorconfig`, remove unused media (`giphy.gif`, `original.gif`, `images (1).jpeg`, `images.jpeg`, `og.pptx`, `.icns`) after confirming nothing references them (grep first). Keep `google*.html` verification files and `CNAME`.
7. **Demo apps** — leave visuals as-is (light touch). Only fix clear bugs/head metadata found while testing each one loads without console errors.

## Verification
- Serve locally (`python3 -m http.server`), use Playwright MCP to screenshot at 1440, 768, 375 widths in dark + light; check filter, theme toggle, keyboard tab order, console errors, no horizontal scroll, all 8 card links resolve (200), and each demo opens.
- Validate JSON-LD parses, sitemap/robots well-formed.

## Delivery
Commit in logical chunks on `main` (design, seo, repo hygiene) and push to `origin main`.
