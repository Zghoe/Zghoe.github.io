# zghoe.github.io — Mohammad Zghoul

Personal cybersecurity portfolio. Static site (HTML / CSS / vanilla JS), no build
step required, designed for GitHub Pages at the root URL **https://zghoe.github.io**.

## What's inside

- **`index.html`** — single-page portfolio: hero, career journey, interactive
  capability map, six real field reports (PDFs), coursework, contact.
- **`knowledge/index.html`** — interactive Knowledge Base: 581 skills/tools/
  standards across both terms, filterable by term, domain, type, and free text.
- **`assets/reports/`** — the actual graded report PDFs + first-page thumbnails.
- **`assets/data/knowledge.json`** — the merged skills dataset (Term 1 + Term 2).
- **`assets/css/style.css`**, **`assets/js/*`** — design system + interactions.
- **`_build/build_knowledge.py`** — regenerates `knowledge.json` (optional, dev only).

## Deploy (first time)

1. Create a **new** GitHub repo named exactly **`Zghoe.github.io`** (must match your
   username `Zghoe` — that's what makes it serve at the root URL).
2. Push this folder's contents to the `main` branch (see steps below).
3. On GitHub: **Settings → Pages → Build and deployment → Source = GitHub Actions**.
4. The included workflow (`.github/workflows/deploy.yml`) publishes on every push.
   Your site goes live at **https://zghoe.github.io** in a minute or two.

```bash
# from inside this folder
git init -b main
git add .
git commit -m "Portfolio: operator-console redesign + Term 2 + field reports"
git remote add origin https://github.com/Zghoe/Zghoe.github.io.git
git push -u origin main
```

> Prefer zero-config? You can instead set **Settings → Pages → Source =
> Deploy from a branch → `main` / `(root)`** and skip the Action entirely —
> the `.nojekyll` file is already here so everything serves as-is.

## Update the Knowledge Base later

```bash
python3 _build/build_knowledge.py <path-to-csa_taxonomy.json> assets/data/knowledge.json
```

## Local preview

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

© 2026 Mohammad Zghoul · Ottawa / NCR
