# Gal Binyamin portfolio

A hand-built static site: `index.html`, `styles.css`, `main.js`, and an `assets/` folder. No build step, no dependencies.

```
portfolio/
├── index.html          all page content
├── styles.css          design tokens (light + dark), layout, motion
├── main.js             theme toggle, scroll reveals, copy-email button
├── favicon.svg
├── apple-touch-icon.png
├── og-image.png        1200x630 LinkedIn / social preview
├── .nojekyll           tells GitHub Pages to serve files as-is
└── assets/
    ├── fonts/          Geist + Geist Mono (self-hosted, SIL Open Font License)
    ├── icons.svg       Phosphor icon sprite (MIT)
    └── work/           real screenshots of the live projects
```

## Preview locally

```bash
python3 -m http.server 4173 --directory portfolio
```

Then open http://localhost:4173.

## Deploy to GitHub Pages (about 3 minutes, no terminal needed)

This publishes the site at **https://glbnymyn123-galbi.github.io/**. MarinePulse keeps working at `/marinepulse/` because it lives in its own repository.

1. On github.com, create a **new public repository** named exactly `glbnymyn123-galbi.github.io` (GitHub needs the user-site name in lowercase).
2. On the empty repo page, click **uploading an existing file**.
3. Drag in **everything inside** the `portfolio` folder (not the folder itself), including `assets/`. On a Mac, press `Cmd+Shift+.` in Finder to show the hidden `.nojekyll` file so you can drag it in too.
4. Click **Commit changes**.
5. Go to **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
6. Wait about a minute and open https://glbnymyn123-galbi.github.io/.

Prefer the terminal? From inside the `portfolio` folder:

```bash
git init -b main && git add -A && git commit -m "Portfolio" && git remote add origin https://github.com/glbnymyn123-GALBI/glbnymyn123-galbi.github.io.git && git push -u origin main
```

## Before you share it on LinkedIn

- **Add your LinkedIn link:** search `index.html` for `LinkedIn: paste`, put your profile URL in, and remove the comment markers.
- **Fill the metric slots when you have real numbers:** search for `METRIC SLOT`. Each comment says which number belongs there (orders per week, WhatsApp inquiries per month, minutes saved per item). The page reads complete without them, so nothing looks unfinished in the meantime.
- **Refresh LinkedIn's preview cache** after deploying: paste the URL into https://www.linkedin.com/post-inspector/ so LinkedIn picks up `og-image.png`.
- **Hide the "Edit with Lovable" badge** on the Esther and MyCan sites (Lovable project settings, available on the Pro plan) so they look fully custom when people click through.

## Editing

- All copy is in `index.html`, grouped by section with comments.
- Colors, type and spacing are CSS variables at the top of `styles.css`. Light and dark themes follow the visitor's system setting, and the moon/sun button lets them switch manually.
- To swap a screenshot, replace the file in `assets/work/` with one of the same name and size: desktop shots are 2160x1350 with a 1200x750 `-1200` copy, phone shots are 780x1688.
- To regenerate `og-image.png`, edit `extras/og-card.html` (outside this folder) and render it at 1200x630.

## House style

The copy avoids em-dashes and invented statistics on purpose. Every number on the page comes from the live projects: MarinePulse's dataset, the IMMRAC pipeline, and the monitoring stack.
