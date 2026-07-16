'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { HEADERS, parseCsv, validateAndAnalyze } = require('./pilot-analysis.js');

function worksheet(rows) {
  return `${HEADERS.join(',')}\n${rows.join('\n')}\n`;
}

const complete = 'P01,abc123,explanation_viewed,yes,3_to_5m,0,1,0,under_1s,yes,yes,"Clear, but draft","none","none"';
const partial = 'P02,abc123,lesson_viewed,no,not_completed,1,0,1,over_3s,no,no,"Needs review","question hard to find","keyboard barrier"';

test('parses quoted commas and escaped quotes', () => {
  assert.deepEqual(parseCsv('a,b\n"x, y","said ""ok"""\n'), [['a', 'b'], ['x, y', 'said "ok"']]);
});

test('validates and aggregates the bounded pilot worksheet', () => {
  const result = validateAndAnalyze(worksheet([complete, partial]));
  assert.equal(result.denominator, 2);
  assert.deepEqual(result.funnel, { topic_opened: 2, lesson_viewed: 2, attempt_submitted: 1, explanation_viewed: 1 });
  assert.equal(result.completed, 1);
  assert.equal(result.sessionsWithAssistance, 1);
  assert.equal(result.totalValidationErrors, 1);
  assert.equal(result.totalClientErrors, 1);
  assert.equal(result.progressNotRecognized, 1);
  assert.equal(result.draftStatusNotRecognized, 1);
  assert.equal(result.textReviewRequired, true);
});

test('rejects extra columns that could collect unnecessary data', () => {
  const csv = `name,${HEADERS.join(',')}\nLearner,${complete}\n`;
  assert.throws(() => validateAndAnalyze(csv), /privacy-approved worksheet schema/);
});

test('rejects inconsistent completion and malformed bounded counts', () => {
  assert.throws(
    () => validateAndAnalyze(worksheet([complete.replace('explanation_viewed,yes', 'lesson_viewed,yes')])),
    /completed must agree/
  );
  assert.throws(
    () => validateAndAnalyze(worksheet([complete.replace(',0,1,0,', ',100,1,0,')])),
    /assistance_count/
  );
});
