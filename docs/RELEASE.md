# MVP release controls

## Deployment posture

The static prototype is reproducibly served with `python3 -m http.server 4173` and deployed by `.github/workflows/pages.yml`. The workflow tests the selected ref before publishing it to the protected `github-pages` environment. This environment is **staging for the pilot**, not an authoritative public curriculum release.

No Git remote or hosting credentials are available in this workspace, so a live staging URL cannot be created here. Activation is an explicit repository-owner decision: connect this source repository, enable GitHub Pages with GitHub Actions, and run the workflow. This requires no paid vendor. Do not promote the site beyond a controlled demo until Chemistry SME review and deployed accessibility checks are complete.

## Release checklist

- [ ] Chemistry SME approved every learner-visible claim, answer key, and rationale; revision IDs updated.
- [ ] `node --test *.test.js` passes at the exact release ref.
- [ ] `node --check app-core.js && node --check app.js && node --check observability-core.js && node --check observability.js` passes.
- [ ] Keyboard, screen-reader, 200% zoom/reflow, and mobile checks pass on the deployed URL.
- [ ] Deployed mobile Lighthouse/accessibility and throttled-load baseline recorded.
- [ ] Persistent draft warning, provenance, content-report link, and privacy text are visible.
- [ ] No secrets, learner records, remote trackers, or unexpected network requests are present.
- [ ] Release commit SHA, Pages URL, reviewer, and UTC deployment time are recorded in the release issue.
- [ ] Previous green commit SHA is known and rollback operator is named.

## Backup needs assessment

There is no server database, account, uploaded learner work, or authoritative chemistry content, so there is no learner-data backup requirement. Device-local progress and tab-local observability are intentionally disposable and must not be backed up centrally. Git history is the recovery source for code and static content. Before public use, protect the default branch and retain the repository through the organization’s normal source-control recovery policy. Reassess backups before adding any API, CMS, authentication, or reviewed content store.

## Rollback procedure

1. Find the previous green commit SHA in workflow history.
2. Run **Deploy static site to Pages** manually and set `release_ref` to that immutable SHA.
3. The workflow checks out and tests that SHA, then republishes its exact static files.
4. Open the reported Pages URL, complete topic → lesson → question → explanation, refresh to confirm progress, and verify the displayed revision.
5. Record the failed SHA, restored SHA, reason, operator, and UTC time in the release issue.

Rollback configuration was dry-tested locally on 2026-07-16 by serving the candidate from a clean HTTP process, requesting the document and all five runtime assets, and running all 11 quality tests. Result: HTTP 200; all assets available; all tests passed. A live Pages rollback remains untestable until a remote repository and Pages environment exist; the workflow's `release_ref` input makes that operation reproducible once activated.
