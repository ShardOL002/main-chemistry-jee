'use strict';

const form = document.querySelector('#quiz-form');
const result = document.querySelector('#result');
const error = document.querySelector('#form-error');
const resultLabel = document.querySelector('#result-label');
const resultTitle = document.querySelector('#result-title');
const resultCopy = document.querySelector('#result-copy');
const rationale = document.querySelector('#option-rationale');
const resetButton = document.querySelector('#reset-progress');
const progressStatus = document.querySelector('#progress-status');
const storageNotice = document.querySelector('#storage-notice');
const learning = window.MainLearning;
let memoryState = null;
let storageAvailable = true;

const rationales = {
  a: 'This does not fit the across-period pattern: the added electrons occupy the same principal shell in this simplified model.',
  b: 'This matches the demo explanation: increasing effective nuclear attraction acts on electrons in the same principal shell.',
  c: 'Atomic number, and therefore proton number, increases from left to right rather than decreasing.',
  d: 'Shielding does not completely cancel the increase in nuclear charge in this simplified explanation.'
};

function readState() {
  if (!storageAvailable) return memoryState;
  try {
    const raw = localStorage.getItem(learning.STORAGE_KEY);
    const parsed = learning.parseState(raw);
    if (raw && !parsed) localStorage.removeItem(learning.STORAGE_KEY);
    return parsed;
  } catch {
    storageAvailable = false;
    storageNotice.hidden = false;
    return memoryState;
  }
}

function writeState(state) {
  memoryState = state;
  if (!storageAvailable) return;
  try {
    localStorage.setItem(learning.STORAGE_KEY, JSON.stringify(state));
  } catch {
    storageAvailable = false;
    storageNotice.hidden = false;
  }
}

function clearState() {
  memoryState = null;
  if (!storageAvailable) return;
  try { localStorage.removeItem(learning.STORAGE_KEY); } catch {
    storageAvailable = false;
    storageNotice.hidden = false;
  }
}

function showResult(answer, persist = true) {
  const correct = learning.scoreAnswer(answer) === 1;
  resultLabel.textContent = correct ? 'CORRECT' : 'REVISIT THIS IDEA';
  resultTitle.textContent = correct ? 'You connected the key ideas.' : 'The key is effective nuclear attraction.';
  resultCopy.textContent = 'Worked explanation: in this simplified across-period model, electrons enter the same principal shell while nuclear charge rises. The resulting increase in effective attraction generally pulls the electron cloud closer.';
  rationale.textContent = `Why your option ${answer.toUpperCase()} ${correct ? 'works' : 'does not work'}: ${rationales[answer]}`;
  result.hidden = false;
  error.hidden = true;
  progressStatus.textContent = `Completed · ${correct ? '1 of 1 correct' : '0 of 1 correct'} · saved ${storageAvailable ? 'on this device' : 'for this tab only'}`;
  if (persist) writeState(learning.createCompletedState(answer));
  result.focus({ preventScroll: true });
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const answer = new FormData(form).get('answer');
  if (!answer) {
    error.hidden = false;
    error.focus();
    return;
  }
  if (window.MainObservability) window.MainObservability.recordStep('attempt_submitted');
  showResult(answer);
  if (window.MainObservability) window.MainObservability.recordStep('explanation_viewed');
});

resetButton.addEventListener('click', () => {
  clearState();
  form.reset();
  result.hidden = true;
  error.hidden = true;
  progressStatus.textContent = 'Not started · progress stays on this device';
  form.querySelector('input').focus();
});

const saved = readState();
if (saved) {
  const answer = saved.progress.selectedOptionId;
  form.elements.answer.value = answer;
  showResult(answer, false);
}
