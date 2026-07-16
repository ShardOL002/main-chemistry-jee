'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const learning = require('./app-core.js');
const telemetry = require('./observability-core.js');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const assetNames = ['index.html', 'styles.css', 'app-core.js', 'app.js', 'observability-core.js', 'observability.js'];

function count(pattern) {
  return (html.match(pattern) || []).length;
}

test('critical path is linked and instrumented from topic to saved progress', () => {
  for (const id of ['topics', 'lesson', 'practice', 'quiz-form', 'result', 'progress-status']) {
    assert.match(html, new RegExp(`id="${id}"`), `missing #${id}`);
  }
  assert.match(html, /href="#lesson" data-funnel-step="topic_opened"/);
  assert.match(html, /href="#practice" data-funnel-step="lesson_viewed"/);
  assert.match(html, /<form id="quiz-form"/);
  assert.match(html, /<progress value="100" max="100">/);
  assert.match(fs.readFileSync(path.join(root, 'app.js'), 'utf8'), /createCompletedState\(answer\)/);
});

test('critical path produces an explanation event and durable valid progress', () => {
  let session = telemetry.emptySnapshot();
  for (const step of telemetry.FUNNEL_STEPS) session = telemetry.recordStep(session, step);
  const saved = learning.createCompletedState('b', '2026-07-16T12:00:00.000Z');
  assert.deepEqual(session.funnel, ['topic_opened', 'lesson_viewed', 'attempt_submitted', 'explanation_viewed']);
  assert.deepEqual(learning.parseState(JSON.stringify(saved)), saved);
  assert.equal(saved.progress.state, 'completed');
  assert.equal(saved.progress.score, 1);
});

test('static accessibility guardrails are present', () => {
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<meta name="viewport"/);
  assert.match(html, /class="skip-link" href="#main"/);
  assert.match(html, /<main id="main">/);
  assert.match(html, /<fieldset>[\s\S]*<legend>/);
  assert.equal(count(/<input type="radio"/g), 4);
  assert.equal(count(/<label class="option">/g), 4);
  assert.match(html, /role="alert"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(fs.readFileSync(path.join(root, 'styles.css'), 'utf8'), /prefers-reduced-motion: reduce/);
});

test('performance and privacy budgets prevent accidental regressions', () => {
  const bytes = assetNames.reduce((sum, file) => sum + fs.statSync(path.join(root, file)).size, 0);
  assert.ok(bytes < 100 * 1024, `first-party assets are ${bytes} bytes; budget is 102400`);
  assert.doesNotMatch(html, /<(script|link)[^>]+https?:\/\//);
  assert.match(html, /connect-src 'none'/);
  assert.match(html, /No analytics leave this device/);
});
