# CLAUDE.md — Report Hub

## Project Overview

Report Hub is a static website that serves as a dashboard for sports briefings and analysis reports. It uses a manifest-driven architecture where a single JSON file (`manifest.json`) defines all site content and metadata. The dashboard (`index.html`) fetches this manifest at runtime and renders report cards that link to individual static HTML report pages.

## Tech Stack

- **Languages**: HTML, CSS, vanilla JavaScript (ES6, inline in HTML)
- **Frameworks/Libraries**: None — zero dependencies
- **Build Tools**: None — no build step, no package.json
- **Deployment**: Vercel (static hosting, configured via `vercel.json`)

## File Structure

```
/
├── CLAUDE.md              # This file
├── index.html             # Dashboard — fetches manifest.json, renders report cards
├── style.css              # Shared styles for dashboard and report pages
├── manifest.json          # Central config: site metadata, topics, report types, report list
├── vercel.json            # Vercel config (cleanUrls: true)
├── .gitignore             # Ignores .vercel/
└── reports/               # Individual report HTML files
    ├── barca-daily-2026-02-06.html
    ├── barca-daily-2026-02-07.html
    ├── barca-prematch-2026-02-07.html
    └── barca-postmatch-2026-02-07.html
```

## Architecture

### Manifest-Driven Content

`manifest.json` is the single source of truth. It contains:

- **`site`** — title and subtitle displayed in the dashboard header
- **`topics`** — category definitions with display name and color (e.g., `"barca": { "name": "FC Barcelona", "color": "#a50044" }`)
- **`reportTypes`** — report type labels (e.g., `"daily": { "label": "Daily Briefing" }`)
- **`reports`** — array of report entries, each with: `id`, `topic`, `type`, `date` (ISO), `title`, `excerpt`, `file` (path to HTML)

### Dashboard (`index.html`)

- Fetches `/manifest.json` on page load
- Renders all report cards sorted by date (newest first)
- Uses DOM manipulation with `innerHTML` and template literals — no virtual DOM

### Report Pages (`reports/*.html`)

Each report is a standalone HTML file that:
- Links to `/style.css` for shared styling
- Contains a back-navigation link (`← All Reports` pointing to `/`)
- Uses semantic markup: `<article>` with `<header class="report-header">` and `<div class="report-body">`
- Includes a highlights list (`<ul class="highlights">`) followed by body paragraphs

### Styling (`style.css`)

- System font stack (`system-ui, -apple-system, ...`)
- Light color scheme, max-width 700px centered layout
- Mobile-first with a `@media (min-width: 768px)` breakpoint
- CSS sections: Dashboard styles, Report Page styles, Responsive overrides

## Key Conventions

### Report File Naming

Reports follow the pattern: `{topic}-{type}-{date}.html`
- Example: `barca-daily-2026-02-07.html`

### Report IDs

Report IDs in `manifest.json` match the filename without extension:
- Example: `"id": "barca-daily-2026-02-07"`

### Adding a New Report

1. Create an HTML file in `reports/` following the naming convention and existing report template structure
2. Add a corresponding entry to the `reports` array in `manifest.json` with all required fields (`id`, `topic`, `type`, `date`, `title`, `excerpt`, `file`)
3. If introducing a new topic, add it to `manifest.json` under `topics` with a `name` and `color`
4. If introducing a new report type, add it under `reportTypes` with a `label`

### Report HTML Template

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{Report Title}</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <main>
    <nav class="report-nav"><a href="/">&larr; All Reports</a></nav>
    <article>
      <header class="report-header">
        <div class="report-meta">
          <span class="report-type">{Type Label}</span>
          <span class="report-topic">{Topic Name}</span>
        </div>
        <h1>{Report Title}</h1>
        <time class="date" datetime="{YYYY-MM-DD}">{Month Day, Year}</time>
      </header>
      <div class="report-body">
        <ul class="highlights">
          <li>...</li>
        </ul>
        <p>...</p>
      </div>
    </article>
  </main>
</body>
</html>
```

## Deployment

- Hosted on **Vercel** as a static site
- `vercel.json` enables `cleanUrls` — `.html` extensions are stripped from URLs
- No build step — files are deployed as-is
- Push to the git remote triggers deployment

## Development Workflow

- No build, lint, or test commands — this is a pure static site
- Edit files directly and preview locally (e.g., `python3 -m http.server` or any static file server)
- Content changes go into `manifest.json` and `reports/` directory
- Style changes go into `style.css` (shared across all pages)
- Dashboard logic is inline in `index.html`
