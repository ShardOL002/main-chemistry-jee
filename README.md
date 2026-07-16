# Main — Chemistry JEE website v1

A dependency-free, mobile-first prototype for Main’s Chemistry JEE learning loop.

## What is included

- Topic discovery leading into one focused concept lesson
- One-question practice, worked explanation, and selected-option rationale
- Revision-bound device-local progress with visible reset and in-memory fallback
- Responsive layout, keyboard focus, reduced-motion support, and semantic form controls
- Explicit draft status, provenance, revision metadata, and persistent non-authoritative warning
- Dependency-free core tests and GitHub Pages deployment workflow

> **Content boundary:** learner-visible Chemistry copy is demo material pending review by a qualified Chemistry JEE SME. It is not presented as authoritative study material.

## Run locally

```bash
python3 -m http.server 4173
# open http://localhost:4173
```

No build step or dependencies are required.

## Verify

Requires Node.js 20 or newer:

```bash
node --test app-core.test.js
node --check app-core.js
node --check app.js
```

The tests cover answer scoring plus valid, corrupt, stale, and tampered progress records. Chemistry correctness is deliberately **not** asserted by engineering tests; the demo answer key and explanation require qualified Chemistry JEE review before authoritative use.

## Local data behavior

Completed progress is stored under `main:v1:learner-state` in browser `localStorage`, bound to the exact demo release and content revisions. Invalid or stale data is discarded. If storage is unavailable, the learning loop continues in memory for the current tab and displays a notice. Reset removes the app’s single local key.

## Deploy to GitHub Pages

1. Push the repository to GitHub.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. The included `pages.yml` workflow deploys every push to `main`.

## Structure

- `index.html` — landing, lesson, quiz, trust metadata
- `styles.css` — responsive visual system
- `app-core.js` — scoring and revision-bound state validation
- `app.js` — accessible practice interaction and storage fallback
- `app-core.test.js` — dependency-free core behavior tests
- `.github/workflows/pages.yml` — checks and Pages deployment

## License

MIT
