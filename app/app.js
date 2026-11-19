// Leonida Legend — entry point. Loads the trophy data, wires the tracker
// (checklist, filters, spoiler setting, export/import) and renders the
// roadmap, the 100% table and the list. Everything runs from local files:
// the only fetch is data/trophies.json from this same app folder.

import {
  loadProgress,
  saveProgress,
  loadSpoilerSetting,
  saveSpoilerSetting,
  loadHideEarnedSetting,
  saveHideEarnedSetting,
  exportProgress,
  parseImportedProgress,
} from './js/store.js';
import { renderRoadmap, renderHundredCompare } from './js/roadmap.js';
import { renderKindChips, renderProgress, renderTrophyList } from './js/render.js';

const data = await (await fetch('data/trophies.json')).json();
const trophies = data.trophies;
const sources = data.sources;
const trophiesById = new Map(trophies.map((trophy) => [trophy.id, trophy]));
const validIds = new Set(trophies.map((trophy) => trophy.id));

const state = {
  earned: loadProgress(),
  kind: 'all',
  grade: 'all',
  sort: 'official',
  query: '',
  spoiler: loadSpoilerSetting(),
  hideEarned: loadHideEarnedSetting(),
  expanded: new Set(),
};

function renderAll() {
  renderProgress(trophies, state);
  renderKindChips(trophies, state, (kind) => {
    state.kind = kind;
    renderAll();
  });
  renderRoadmap(trophiesById, state.earned, jumpToTrophy);
  renderTrophyList(trophies, sources, state, {
    onToggle: (id, checked) => {
      if (checked) state.earned.add(id);
      else state.earned.delete(id);
      saveProgress(state.earned);
      renderAll();
    },
    onOpen: (id) => {
      if (state.expanded.has(id)) state.expanded.delete(id);
      else state.expanded.add(id);
      renderAll();
    },
  });
}

function jumpToTrophy(trophy) {
  state.kind = 'all';
  state.grade = 'all';
  state.query = '';
  document.getElementById('search').value = '';
  document.getElementById('gradeFilter').value = 'all';
  state.expanded.add(trophy.id);
  renderAll();
  document.getElementById(`trophy-${trophy.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

document.getElementById('search').addEventListener('input', (event) => {
  state.query = event.target.value;
  renderAll();
});

document.getElementById('gradeFilter').addEventListener('change', (event) => {
  state.grade = event.target.value;
  renderAll();
});

document.getElementById('sortOrder').addEventListener('change', (event) => {
  state.sort = event.target.value;
  renderAll();
});

const spoilerToggle = document.getElementById('spoilerToggle');
spoilerToggle.checked = state.spoiler;
spoilerToggle.addEventListener('change', () => {
  state.spoiler = spoilerToggle.checked;
  saveSpoilerSetting(state.spoiler);
  renderAll();
});

const hideEarnedToggle = document.getElementById('hideEarnedToggle');
hideEarnedToggle.checked = state.hideEarned;
hideEarnedToggle.addEventListener('change', () => {
  state.hideEarned = hideEarnedToggle.checked;
  saveHideEarnedSetting(state.hideEarned);
  renderAll();
});

document.getElementById('exportBtn').addEventListener('click', () => {
  exportProgress(state.earned);
});

document.getElementById('importFile').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  event.target.value = '';
  if (!file) return;
  try {
    state.earned = parseImportedProgress(await file.text(), validIds);
    saveProgress(state.earned);
    renderAll();
  } catch {
    window.alert('That file is not a Leonida Legend progress export.');
  }
});

document.getElementById('resetBtn').addEventListener('click', () => {
  if (!window.confirm('Clear all earned trophies? This cannot be undone — export first if you want a backup.')) return;
  state.earned = new Set();
  saveProgress(state.earned);
  renderAll();
});

renderHundredCompare();
renderAll();
