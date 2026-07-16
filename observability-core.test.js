'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const telemetry = require('./observability-core.js');

test('records the complete learning funnel once and in order', () => {
  let state = telemetry.emptySnapshot();
  for (const step of telemetry.FUNNEL_STEPS) state = telemetry.recordStep(state, step);
  state = telemetry.recordStep(state, 'attempt_submitted');
  assert.deepEqual(state.funnel, telemetry.FUNNEL_STEPS);
});

test('does not fabricate skipped funnel stages or retain unknown data', () => {
  const state = telemetry.recordStep(telemetry.emptySnapshot(), 'attempt_submitted');
  assert.deepEqual(state.funnel, []);
  const parsed = telemetry.parseSnapshot(JSON.stringify({
    schemaVersion: 1,
    funnel: ['topic_opened', 'email_address'],
    errorCount: 500,
    visitorId: 'must-not-survive'
  }));
  assert.deepEqual(parsed, { schemaVersion: 1, funnel: ['topic_opened'], errorCount: 99 });
});

test('error monitoring keeps only a bounded count', () => {
  const state = telemetry.recordError({ schemaVersion: 1, funnel: [], errorCount: 99 });
  assert.equal(state.errorCount, 99);
  assert.deepEqual(Object.keys(state).sort(), ['errorCount', 'funnel', 'schemaVersion']);
});
