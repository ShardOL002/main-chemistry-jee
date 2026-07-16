# Main — Chemistry JEE website v1

A dependency-free, mobile-first prototype for Main’s Chemistry JEE learning loop.

## What is included

- Focused concept lesson
- One-question practice and worked explanation
- Device-local progress with visible reset
- Responsive layout, keyboard focus, reduced-motion support, and semantic form controls
- Explicit content-review status and revision metadata
- GitHub Pages deployment workflow

> **Content boundary:** learner-visible Chemistry copy is demo material pending review by a qualified Chemistry JEE SME. It is not presented as authoritative study material.

## Run locally

```bash
python3 -m http.server 4173
# open http://localhost:4173
```

No build step or dependencies are required.

## Deploy to GitHub Pages

1. Push the repository to GitHub.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. The included `pages.yml` workflow deploys every push to `main`.

## Structure

- `index.html` — landing, lesson, quiz, trust metadata
- `styles.css` — responsive visual system
- `app.js` — practice interaction and local progress
- `.github/workflows/pages.yml` — Pages deployment

## License

MIT
