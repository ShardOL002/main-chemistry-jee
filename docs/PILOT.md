# Facilitated learner pilot runbook

Status: ready for a CEO-authorized, consented pilot; no participant data is required by the product.

## Scope and acceptance criteria

Run 3–5 individual sessions of at most 20 minutes on the participant's own or a facilitator device. The product hypothesis is that a learner can discover a topic, study the clearly marked draft lesson, attempt the question, read the explanation, and recognize saved progress without assistance.

Pilot success is evidence, not a launch gate:

- at least 80% reach `explanation_viewed`;
- median facilitator-recorded completion time is at most 5 minutes;
- no participant is blocked by a client error or accessibility failure;
- no participant mistakes the demo content for SME-approved guidance after seeing its trust labels;
- all confusion and content-trust concerns are captured verbatim for qualified review, not silently “fixed” by engineering.

These thresholds are assumptions selected to make the pilot falsifiable. They are not yet observed baselines.

## Privacy and consent boundary

The CEO owns participant authorization and consent policy. Before starting, the facilitator must use the approved consent language. Do not record names, email addresses, phone numbers, school/coaching institute, precise age, device identifiers, IP addresses, audio, video, or screen recordings. Do not recruit through the application.

The application stores only this tab's ordered completed step names, two bounded counts, and one coarse load bucket. It stores no answer, correctness, timestamps, URLs, error text/stacks, identity, or durable session ID, and transmits nothing. Closing the tab clears the pilot record. Device-local learning progress is separate and can be reset visibly.

Use a random worksheet row such as `P01`; never keep a participant-code lookup table. Report only aggregates and de-identified quotes. Suppress quotes that could identify a learner.

## Instrumentation dictionary

All fields are tab-local in `sessionStorage` under `main:v1:session-observability` and available through `MainObservability.snapshot()`.

| Field/event | Trigger | Allowed analysis | Explicitly excluded |
|---|---|---|---|
| `topic_opened` | learner activates Open lesson | discovery completion | identity, timestamp |
| `lesson_viewed` | learner activates Try the question | lesson-to-practice completion | reading behavior/content inference |
| `attempt_submitted` | valid answer submitted | attempt completion | answer or correctness |
| `explanation_viewed` | result is rendered | loop completion | answer, score |
| `validationErrorCount` | submit with no option | form friction, capped at 99 | field value |
| `clientErrorCount` | uncaught error/rejection | reliability count, capped at 99 | message, stack, URL |
| `loadBucket` | window load Navigation Timing duration | `under_1s`, `1_to_3s`, `over_3s`, `unknown` | exact duration, network/device details |

Events are ordered and deduplicated. A later funnel event is rejected unless preceding steps exist. The facilitator may record elapsed completion time with a stopwatch only as a coarse whole-session value; do not copy a timestamp into the worksheet.

## Before each session

1. Confirm CEO authorization/consent procedure and use the approved staging URL/revision.
2. Open a fresh private tab; confirm the “V1 demo” and “SME review pending” labels are visible.
3. In the console, run `MainObservability.snapshot()` and confirm an empty funnel, zero counts, and a valid load bucket (or `unknown`).
4. If storage from a prior learning session appears, use **Reset progress**. Do not inspect unrelated browser storage.
5. Assign the next unlinked row code (`P01`, `P02`, …) and start a stopwatch.

## Neutral facilitator script

> We are testing this prototype, not you. It contains draft Chemistry content that has not yet been approved by a subject expert, so please do not rely on it as study guidance. Please use it as you naturally would and say what you expect or find confusing. You may stop at any time. I will not record your name or your answer.

Then ask: **“Starting from this page, please choose the available topic, study it, attempt the question, inspect the explanation, and tell me how you know whether progress was saved.”**

Do not teach the interface. If the learner is blocked for 30 seconds, give the smallest neutral prompt and record it as assistance. After completion ask, in order:

1. “What, if anything, was hard to find or understand?”
2. “What did you expect after checking your answer?”
3. “What tells you whether this Chemistry content is trustworthy?”
4. “Did you notice that it is draft and awaiting expert review?”
5. “What is the single most important improvement?”

Do not ask for exam score, school, demographic details, or contact information.

## Observation template

One row per session; enter categories plus short de-identified notes.

```csv
row_code,revision,furthest_step,completed,elapsed_bucket,assistance_count,validation_error_count,client_error_count,load_bucket,progress_recognized,draft_status_recognized,trust_feedback,top_friction,accessibility_or_support_note
P01,commit-or-release-ref,explanation_viewed,yes,under_5m,0,0,0,under_1s,yes,yes,"de-identified quote","none","none"
```

Allowed `elapsed_bucket`: `under_3m`, `3_to_5m`, `over_5m`, `not_completed`. Allowed yes/no fields: `yes`, `no`, `not_asked`. Copy the tab snapshot counts and bucket, but never the browser console history. Record whether assistance was needed and the observable point of friction. Treat Chemistry content feedback as an SME review input, never as permission for engineering to alter curriculum claims.

## Support and incident handling

- **No option selected:** allow the inline error to appear; record the count. Do not select for the learner.
- **Storage unavailable:** continue; the visible notice explains tab-only progress. Record it as a support note.
- **Client error or broken path:** record only the stage and observable outcome; do not copy console messages if they might contain data. Refresh once in a fresh tab. Stop the session if still blocked.
- **Accessibility barrier:** stop asking the learner to work around it. Record the interaction/control and impact, not a diagnosis or personal condition.
- **Content concern:** reiterate that content is draft, capture a de-identified verbatim concern, and route it for qualified Chemistry JEE SME review. Do not adjudicate correctness during the session.
- **Privacy/consent concern:** stop collection immediately, close the tab, and escalate to the CEO. Exclude the row until the CEO confirms whether it may be retained.
- **Severe or repeated failure:** pause further sessions. Roll back using `docs/RELEASE.md` when caused by the release, and retain only aggregate/redacted incident evidence.

After each session, copy the allowed fields, close the private tab, and verify the tab-local record is gone. Keep worksheets in the approved company workspace only.

## Analysis procedure

1. Validate that every row uses allowed values and contains no direct identifier.
2. Report denominator and missingness for every measure.
3. Build a funnel count for each step and calculate step-to-step and overall completion.
4. Report median elapsed bucket descriptively; do not manufacture exact times from buckets.
5. Sum sessions with assistance, validation friction, client errors, slow loads, unrecognized progress, and unrecognized draft status.
6. Cluster observed friction by interface stage. Keep de-identified learner wording separate from facilitator interpretation.
7. Route all chemistry/trust claims to an SME review queue with the exact demo revision.
8. In findings, label statements **Observed**, **Participant-reported**, **Facilitator interpretation**, or **Assumption**. Small-sample results are directional and must not be generalized to JEE learners.

## Exit checklist

- [ ] Participant authorization and consent procedure confirmed by CEO
- [ ] No direct identifiers or unnecessary personal data collected
- [ ] Revision and denominator reported
- [ ] Funnel, errors, performance, friction, accessibility, and trust synthesized
- [ ] Chemistry claims queued for domain review rather than edited silently
- [ ] Evidence distinguished from assumptions
- [ ] Raw tab data cleared and worksheet stored only in approved location
