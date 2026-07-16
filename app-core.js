(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.MainLearning = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const SCHEMA_VERSION = 1;
  const STORAGE_KEY = 'main:v1:learner-state';
  const RELEASE_ID = 'demo-2026-07-16';
  const QUESTION_REVISION_ID = 'periodicity-q1-demo-r1';
  const LESSON_REVISION_ID = 'periodicity-lesson-demo-r1';
  const VALID_ANSWERS = ['a', 'b', 'c', 'd'];

  function scoreAnswer(answer) {
    return VALID_ANSWERS.includes(answer) && answer === 'b' ? 1 : 0;
  }

  function createCompletedState(answer, now) {
    if (!VALID_ANSWERS.includes(answer)) throw new Error('Invalid answer');
    const timestamp = now || new Date().toISOString();
    return {
      schemaVersion: SCHEMA_VERSION,
      releaseId: RELEASE_ID,
      savedAt: timestamp,
      progress: {
        topicId: 'periodicity-demo',
        lessonRevisionId: LESSON_REVISION_ID,
        questionRevisionId: QUESTION_REVISION_ID,
        state: 'completed',
        lastUpdatedAt: timestamp,
        selectedOptionId: answer,
        score: scoreAnswer(answer)
      }
    };
  }

  function parseState(raw) {
    if (!raw) return null;
    let value;
    try { value = JSON.parse(raw); } catch { return null; }
    const progress = value && value.progress;
    if (
      value.schemaVersion !== SCHEMA_VERSION ||
      value.releaseId !== RELEASE_ID ||
      !progress || progress.state !== 'completed' ||
      progress.lessonRevisionId !== LESSON_REVISION_ID ||
      progress.questionRevisionId !== QUESTION_REVISION_ID ||
      !VALID_ANSWERS.includes(progress.selectedOptionId) ||
      progress.score !== scoreAnswer(progress.selectedOptionId)
    ) return null;
    return value;
  }

  return {
    SCHEMA_VERSION,
    STORAGE_KEY,
    RELEASE_ID,
    QUESTION_REVISION_ID,
    LESSON_REVISION_ID,
    VALID_ANSWERS,
    scoreAnswer,
    createCompletedState,
    parseState
  };
});
