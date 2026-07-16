# MVP quality baseline

Recorded 2026-07-16 against release candidate `MAI-5` on a local loopback server, Node 20-compatible checks.

## Automated critical path

`node --test *.test.js` covers:

- the static topic → lesson → attempt → explanation → progress path and its links;
- answer scoring and revision-bound progress validation;
- ordered, deduplicated funnel counters and bounded error counts;
- semantic form, skip-link, live-region, language, viewport, and reduced-motion guardrails;
- a 100 KiB first-party asset budget, no remote script/style dependencies, and `connect-src 'none'`.

Baseline: 11/11 checks pass in about 0.6 seconds. The first-party HTML/CSS/JS transfer is 25,255 uncompressed bytes, excluding HTTP headers. A local request returned HTTP 200 with 8,193 HTML bytes, 5.4 ms time-to-first-byte, and 6.0 ms total. Loopback timing is a reproducibility check, not a real-user latency claim.

## Accessibility baseline and limits

The automated baseline verifies source-level WCAG support, including keyboard-operable native controls, visible focus styles, semantic fieldset/legend/labels, status/error announcements, responsive layout, and reduced motion. It does **not** replace testing with a browser accessibility engine, keyboard-only manual review, screen readers, zoom/reflow, or learners. Before a public release, run those checks on the deployed URL and record defects.

## Performance baseline and limits

The site has no build step, fonts, images, third-party JavaScript, API calls, or analytics requests. CI fails if the six first-party runtime assets exceed 100 KiB. The next deployed-URL review should record Lighthouse mobile performance/accessibility and a throttled low-bandwidth load; no Lighthouse score is claimed from the source-only baseline.

## Privacy-minimizing observability

Observability is first-party and device-only:

- `sessionStorage` holds only schema version, ordered completed funnel-step names, validation/client-error counts capped at 99, and a coarse load bucket.
- It stores no answer, correctness, exact duration, error message, stack, URL, timestamp, identity, fingerprint, or persistent session ID.
- CSP blocks outbound connections (`connect-src 'none'`). Nothing is transmitted.
- Inspect during a consenting pilot with `MainObservability.snapshot()` in the browser console. Closing the tab clears the session data.

This is sufficient to debug a facilitated MVP pilot without collecting student data. The event dictionary, consent boundary, facilitator workflow, and aggregation rules are in [`PILOT.md`](PILOT.md). Aggregated remote monitoring is deliberately deferred until there is evidence it is needed and an approved privacy/vendor design.
