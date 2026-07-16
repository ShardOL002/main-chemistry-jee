(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.MainObservabilityCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const SCHEMA_VERSION = 1;
  const SESSION_KEY = 'main:v1:session-observability';
  const FUNNEL_STEPS = ['topic_opened', 'lesson_viewed', 'attempt_submitted', 'explanation_viewed'];

  function emptySnapshot() {
    return { schemaVersion: SCHEMA_VERSION, funnel: [], errorCount: 0 };
  }

  function parseSnapshot(raw) {
    if (!raw) return emptySnapshot();
    let value;
    try { value = JSON.parse(raw); } catch { return emptySnapshot(); }
    if (!value || value.schemaVersion !== SCHEMA_VERSION || !Array.isArray(value.funnel)) return emptySnapshot();
    const funnel = FUNNEL_STEPS.filter((step) => value.funnel.includes(step));
    const errorCount = Number.isInteger(value.errorCount) && value.errorCount >= 0
      ? Math.min(value.errorCount, 99)
      : 0;
    return { schemaVersion: SCHEMA_VERSION, funnel, errorCount };
  }

  function recordStep(snapshot, step) {
    if (!FUNNEL_STEPS.includes(step)) return snapshot;
    const next = parseSnapshot(JSON.stringify(snapshot));
    const stepIndex = FUNNEL_STEPS.indexOf(step);
    const prerequisitesMet = FUNNEL_STEPS.slice(0, stepIndex).every((item) => next.funnel.includes(item));
    if (prerequisitesMet && !next.funnel.includes(step)) next.funnel.push(step);
    return next;
  }

  function recordError(snapshot) {
    const next = parseSnapshot(JSON.stringify(snapshot));
    next.errorCount = Math.min(next.errorCount + 1, 99);
    return next;
  }

  return { SCHEMA_VERSION, SESSION_KEY, FUNNEL_STEPS, emptySnapshot, parseSnapshot, recordStep, recordError };
});
