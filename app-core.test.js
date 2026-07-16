'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const learning = require('./app-core.js');

test('scores only the reviewed demo answer key', () => {
  assert.equal(learning.scoreAnswer('b'), 1);
  for (const answer of ['a', 'c', 'd', 'unknown', null]) {
    assert.equal(learning.scoreAnswer(answer), 0);
  }
});

test('round-trips a completed revision-bound progress record', () => {
  const state = learning.createCompletedState('c', '2026-07-16T00:00:00.000Z');
  assert.deepEqual(learning.parseState(JSON.stringify(state)), state);
});

test('rejects corrupt, stale, and tampered local state', () => {
  assert.equal(learning.parseState('{oops'), null);
  const stale = learning.createCompletedState('b');
  stale.releaseId = 'old-release';
  assert.equal(learning.parseState(JSON.stringify(stale)), null);
  const tampered = learning.createCompletedState('a');
  tampered.progress.score = 1;
  assert.equal(learning.parseState(JSON.stringify(tampered)), null);
});

test('refuses unknown option IDs', () => {
  assert.throws(() => learning.createCompletedState('z'), /Invalid answer/);
});
