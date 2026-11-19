// Progress store: the checklist lives in localStorage, and can be exported to a
// file and imported back. Settings (spoiler mode, hide-earned) live there too.
// Nothing leaves the browser unless the reader exports it.

const PROGRESS_KEY = 'leonida-legend-progress-v1';
const SPOILER_KEY = 'leonida-legend-spoiler-v1';
const HIDE_EARNED_KEY = 'leonida-legend-hide-earned-v1';

export function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id) => Number.isInteger(id)));
  } catch {
    return new Set();
  }
}

export function saveProgress(earned) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

export function loadSpoilerSetting() {
  return localStorage.getItem(SPOILER_KEY) === '1';
}

export function saveSpoilerSetting(on) {
  localStorage.setItem(SPOILER_KEY, on ? '1' : '0');
}

export function loadHideEarnedSetting() {
  return localStorage.getItem(HIDE_EARNED_KEY) === '1';
}

export function saveHideEarnedSetting(on) {
  localStorage.setItem(HIDE_EARNED_KEY, on ? '1' : '0');
}

// Export: a small JSON file the reader can keep, share or import on another
// browser. Import accepts that shape, or a bare array of trophy ids.
export function exportProgress(earned) {
  const payload = {
    app: 'leonida-legend-gta6-trophy-guide',
    version: 1,
    exportedAt: new Date().toISOString(),
    earned: [...earned].sort((a, b) => a - b),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'gta6-trophy-progress.json';
  link.click();
  URL.revokeObjectURL(url);
}

export function parseImportedProgress(text, validIds) {
  const parsed = JSON.parse(text);
  const ids = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(ids)) throw new Error('not a progress file');
  const earned = new Set();
  for (const id of ids) {
    if (Number.isInteger(id) && validIds.has(id)) earned.add(id);
  }
  return earned;
}
