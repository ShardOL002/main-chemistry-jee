# Main — Chemistry JEE website v1

A dependency-free, mobile-first prototype for Main’s Chemistry JEE learning loop.

## What is included

- Topic discovery leading into one focused concept lesson
- One-question practice, worked explanation, and selected-option rationale
- Revision-bound device-local progress with visible reset and in-memory fallback
- Responsive layout, keyboard focus, reduced-motion support, and semantic form controls
- Explicit draft status, provenance, revision metadata, and persistent non-authoritative warning
- Dependency-free learning-path, accessibility, performance, privacy, and core checks
- Device-only, redacted pilot observability with outbound connections blocked
- GitHub Pages staging workflow with immutable-ref rollback

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
node --test *.test.js
node --check app-core.js && node --check app.js
node --check observability-core.js && node --check observability.js
```

The tests cover answer scoring plus valid, corrupt, stale, and tampered progress records. Chemistry correctness is deliberately **not** asserted by engineering tests; the demo answer key and explanation require qualified Chemistry JEE review before authoritative use.

## Local data behavior

Completed progress is stored under `main:v1:learner-state` in browser `localStorage`, bound to the exact demo release and content revisions. Invalid or stale data is discarded. If storage is unavailable, the learning loop continues in memory for the current tab and displays a notice. Reset removes the progress key.

For a facilitated pilot, `sessionStorage` keeps only ordered funnel-step names and a bounded redacted error count. It records no answers, identity, timestamps, error text, or stacks; it is cleared with the tab and never transmitted. See [`docs/QUALITY.md`](docs/QUALITY.md).

## Deploy staging to GitHub Pages

1. Push the repository to GitHub.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. The included `pages.yml` workflow tests and deploys every push to `main`.
4. To roll back, dispatch the workflow with a previous green commit as `release_ref`.

This Pages environment is a pilot staging target, not an authoritative curriculum release. See [`docs/RELEASE.md`](docs/RELEASE.md) for gates, backup assessment, and rollback evidence.

## Structure

- `index.html` — landing, lesson, quiz, trust metadata
- `styles.css` — responsive visual system
- `app-core.js` — scoring and revision-bound state validation
- `app.js` — accessible practice interaction and storage fallback
- `observability*.js` — privacy-minimized, tab-local funnel/error counters and tests
- `*.test.js` — dependency-free core and quality checks
- `docs/QUALITY.md` — accessibility, performance, and privacy baseline
- `docs/RELEASE.md` — staging, release, backup, and rollback controls
- `.github/workflows/pages.yml` — checks, selected-ref deployment, and rollback

## License

MIT
