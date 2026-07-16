'use strict';

(function () {
  const core = window.MainObservabilityCore;
  let snapshot = core.emptySnapshot();
  let storageAvailable = true;

  try {
    snapshot = core.parseSnapshot(sessionStorage.getItem(core.SESSION_KEY));
  } catch {
    storageAvailable = false;
  }

  function persist() {
    if (!storageAvailable) return;
    try {
      sessionStorage.setItem(core.SESSION_KEY, JSON.stringify(snapshot));
    } catch {
      storageAvailable = false;
    }
  }

  function recordStep(step) {
    snapshot = core.recordStep(snapshot, step);
    persist();
  }

  function recordValidationError() {
    snapshot = core.recordValidationError(snapshot);
    persist();
  }

  function recordError() {
    snapshot = core.recordError(snapshot);
    persist();
    console.warn('Main recorded a redacted client error. No error text or personal data was retained.');
  }

  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    snapshot = core.setLoadDuration(snapshot, navigation ? navigation.duration : NaN);
    persist();
  }, { once: true });

  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-funnel-step]');
    if (target) recordStep(target.dataset.funnelStep);
  });
  window.addEventListener('error', recordError);
  window.addEventListener('unhandledrejection', recordError);

  window.MainObservability = {
    recordStep,
    recordValidationError,
    snapshot: function () { return JSON.parse(JSON.stringify(snapshot)); }
  };
})();
