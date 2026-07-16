(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.MainObservabilityCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const SCHEMA_VERSION = 2;
  const SESSION_KEY = 'main:v1:session-observability';
  const FUNNEL_STEPS = ['topic_opened', 'lesson_viewed', 'attempt_submitted', 'explanation_viewed'];
  const LOAD_BUCKETS = ['under_1s', '1_to_3s', 'over_3s', 'unknown'];

  function emptySnapshot() {
    return {
      schemaVersion: SCHEMA_VERSION,
      funnel: [],
      validationErrorCount: 0,
      clientErrorCount: 0,
      loadBucket: 'unknown'
    };
  }

  function parseSnapshot(raw) {
    if (!raw) return emptySnapshot();
    let value;
    try { value = JSON.parse(raw); } catch { return emptySnapshot(); }
    if (!value || value.schemaVersion !== SCHEMA_VERSION || !Array.isArray(value.funnel)) return emptySnapshot();
    const funnel = FUNNEL_STEPS.filter((step) => value.funnel.includes(step));
    const boundedCount = (candidate) => Number.isInteger(candidate) && candidate >= 0
      ? Math.min(candidate, 99)
      : 0;
    const loadBucket = LOAD_BUCKETS.includes(value.loadBucket) ? value.loadBucket : 'unknown';
    return {
      schemaVersion: SCHEMA_VERSION,
      funnel,
      validationErrorCount: boundedCount(value.validationErrorCount),
      clientErrorCount: boundedCount(value.clientErrorCount),
      loadBucket
    };
  }

  function recordStep(snapshot, step) {
    if (!FUNNEL_STEPS.includes(step)) return snapshot;
    const next = parseSnapshot(JSON.stringify(snapshot));
    const stepIndex = FUNNEL_STEPS.indexOf(step);
    const prerequisitesMet = FUNNEL_STEPS.slice(0, stepIndex).every((item) => next.funnel.includes(item));
    if (prerequisitesMet && !next.funnel.includes(step)) next.funnel.push(step);
    return next;
  }

  function increment(snapshot, field) {
    const next = parseSnapshot(JSON.stringify(snapshot));
    next[field] = Math.min(next[field] + 1, 99);
    return next;
  }

  function recordValidationError(snapshot) {
    return increment(snapshot, 'validationErrorCount');
  }

  function recordError(snapshot) {
    return increment(snapshot, 'clientErrorCount');
  }

  function setLoadDuration(snapshot, milliseconds) {
    const next = parseSnapshot(JSON.stringify(snapshot));
    next.loadBucket = !Number.isFinite(milliseconds) || milliseconds < 0
      ? 'unknown'
      : milliseconds < 1000 ? 'under_1s' : milliseconds <= 3000 ? '1_to_3s' : 'over_3s';
    return next;
  }

  return {
    SCHEMA_VERSION,
    SESSION_KEY,
    FUNNEL_STEPS,
    LOAD_BUCKETS,
    emptySnapshot,
    parseSnapshot,
    recordStep,
    recordValidationError,
    recordError,
    setLoadDuration
  };
});
