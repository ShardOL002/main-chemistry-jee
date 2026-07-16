# Learner pilot findings — readiness baseline

Date: 2026-07-16  
Revision: pending deployed immutable commit  
Participant sessions completed: **0**

## Executive readout

**Observed (engineering):** The pilot package, privacy-minimized instrumentation, facilitated script, observation schema, support paths, and analysis method are implemented. Automated tests exercise the four-stage funnel, bounded friction/error counters, coarse load bucketing, field allow-listing, and critical learning path.

**Not observed (learner):** No authorized participant sessions or learner feedback were available for this report. Completion, comprehension, usability, accessibility-in-use, content trust, and real-device performance therefore have no learner evidence. Zero sessions must not be reported as zero failures or 100% completion.

**Decision:** Pilot readiness is complete; learner-dependent analysis remains blocked on CEO recruitment/authorization and consent-policy confirmation. Do not make an evidence-led product iteration from this readiness baseline alone.

## Evidence table

| Question | Evidence available | Result | Classification |
|---|---|---|---|
| Can the source represent the full learning loop? | automated ordered-funnel and critical-path tests | yes | Observed (engineering) |
| Does instrumentation retain only allowed fields? | parser allow-list tests and CSP `connect-src 'none'` | yes | Observed (engineering) |
| Are friction/error counts bounded? | unit tests at cap 99 | yes | Observed (engineering) |
| Is performance privacy-minimized? | exact duration reduced to four buckets | yes | Observed (engineering) |
| Can learners complete without help? | no sessions | unknown | Assumption awaiting pilot |
| Do learners recognize saved progress? | no sessions | unknown | Assumption awaiting pilot |
| Do learners recognize draft/non-authoritative status? | no sessions | unknown | Assumption awaiting pilot |
| Is the Chemistry explanation correct/trusted? | no qualified SME approval | unknown; draft only | Domain review required |
| Is deployed low-bandwidth performance acceptable? | source budget and loopback only | unknown for learners | Assumption awaiting pilot |

## Empty pilot scorecard

Denominator: 0 sessions. All rates and medians: **not calculable**.

- funnel completion: not calculable;
- time-to-complete: not calculable;
- assistance or validation friction: not calculable;
- client errors: not calculable;
- load buckets on participant devices: not observed;
- progress recognition: not calculable;
- draft-status recognition/content-trust feedback: not observed;
- accessibility barriers: not observed.

## Risks and next evidence

1. **Participant availability and consent — owner: CEO.** Authorize/recruit 3–5 participants and confirm consent language/retention policy before any session.
2. **Chemistry authority — owner: qualified Chemistry JEE SME.** Review the exact lesson/question/explanation revision before it is treated as study guidance. Pilot trust feedback is not a correctness review.
3. **Small-sample bias.** Report individual counts and denominator; treat themes as directional, not population estimates.
4. **Facilitator bias.** Use the neutral script and record every prompt/assistance instance.
5. **Real-device uncertainty.** Include participant load bucket and observable failures; do not infer field performance from loopback timing.

After authorized sessions, replace this baseline with a dated report that preserves the evidence classifications, aggregated scorecard, de-identified themes, revision, missingness, decision, and remaining risks.
