const form = document.querySelector('#quiz-form');
const result = document.querySelector('#result');
const error = document.querySelector('#form-error');
const label = document.querySelector('#result-label');
const title = document.querySelector('#result-title');
const copy = document.querySelector('#result-copy');
const resetButton = document.querySelector('#reset-progress');
const STORAGE_KEY = 'main-demo-v1-progress';

function showResult(answer, persist = true) {
  const correct = answer === 'b';
  label.textContent = correct ? 'CORRECT' : 'KEEP GOING';
  title.textContent = correct ? 'You connected the key ideas.' : 'The key is effective nuclear attraction.';
  copy.textContent = correct
    ? 'Electrons are added to the same principal shell while nuclear charge rises, so the electron cloud is generally pulled closer.'
    : 'Across a period, electrons enter the same principal shell while nuclear charge increases. The stronger effective attraction generally reduces atomic radius.';
  result.hidden = false;
  error.hidden = true;
  if (persist) localStorage.setItem(STORAGE_KEY, JSON.stringify({ answer, completed: true }));
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const answer = data.get('answer');
  if (!answer) {
    error.hidden = false;
    error.focus();
    return;
  }
  showResult(answer);
});

resetButton.addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  form.reset();
  result.hidden = true;
  error.hidden = true;
  form.querySelector('input').focus();
});

try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (saved?.completed && ['a', 'b', 'c', 'd'].includes(saved.answer)) {
    form.elements.answer.value = saved.answer;
    showResult(saved.answer, false);
  }
} catch {
  localStorage.removeItem(STORAGE_KEY);
}
