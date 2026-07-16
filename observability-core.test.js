'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const telemetry = require('./observability-core.js');

const empty = {
  schemaVersion: 2,
  funnel: [],
  validationErrorCount: 0,
  clientErrorCount: 0,
  loadBucket: 'unknown'
};

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
    schemaVersion: 2,
    funnel: ['topic_opened', 'email_address'],
    validationErrorCount: 500,
    clientErrorCount: -1,
    loadBucket: 'precise-secret-value',
    visitorId: 'must-not-survive'
  }));
  assert.deepEqual(parsed, { ...empty, funnel: ['topic_opened'], validationErrorCount: 99 });
});

test('friction and error monitoring keep only bounded counts', () => {
  const validation = telemetry.recordValidationError({ ...empty, validationErrorCount: 99 });
  const client = telemetry.recordError({ ...empty, clientErrorCount: 99 });
  assert.equal(validation.validationErrorCount, 99);
  assert.equal(client.clientErrorCount, 99);
  assert.deepEqual(Object.keys(client).sort(), Object.keys(empty).sort());
});

test('load duration is reduced to a non-identifying performance bucket', () => {
  assert.equal(telemetry.setLoadDuration(empty, 300).loadBucket, 'under_1s');
  assert.equal(telemetry.setLoadDuration(empty, 1500).loadBucket, '1_to_3s');
  assert.equal(telemetry.setLoadDuration(empty, 4000).loadBucket, 'over_3s');
  assert.equal(telemetry.setLoadDuration(empty, NaN).loadBucket, 'unknown');
});
