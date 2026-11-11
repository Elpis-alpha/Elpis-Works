# Elpis Works

A collection of small web apps built from scratch in vanilla HTML, CSS and JavaScript (no frameworks, no build step), presented on a single landing page with search and tag filters.

**Live site:** https://little-works.elpis.cc

## Projects

Book List, Chuck Norris Joke Generator, Elpis Dictionary, Loan Calculator, Number Guesser, Task List, Form Validation and Tracalorie. Each lives in its own folder under `elpis_designs/`.

## Structure

```
index.html      landing page (SEO metadata, JSON-LD, noscript fallback)
style.css       theme tokens (dark/light), layout, components
app.js          project data, card rendering, search/filter, theme toggle
elpis_designs/  one folder per demo app
images/         card screenshots and brand assets
Fonts/          display fonts
docs/PLAN.md    upgrade plan
```

To add a project, put it in `elpis_designs/`, add a screenshot to `images/`, and add an entry to the `projects` array in `app.js` (plus `index.html` noscript list, JSON-LD and `sitemap.xml`). Set its `color` to the screenshot's edge color; it fills the card behind the screenshot.

## Run locally

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## License

MIT, see [LICENSE](LICENSE).
