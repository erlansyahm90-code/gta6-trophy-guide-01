// Trophy list rendering: the checklist, its filters, the spoiler setting and
// the progress header. A trophy's official name and description are shown as
// PlayStation publishes them; with spoiler mode on, story trophies stay masked
// until earned. Every open card shows its guide and its sources.

export const KINDS = [
  { key: 'all', label: 'All' },
  { key: 'story', label: 'Story' },
  { key: 'side', label: 'Side missions' },
  { key: 'collectibles', label: 'Collectibles' },
  { key: 'activities', label: 'Activities' },
  { key: 'missable', label: 'Missable' },
  { key: 'online', label: 'Online' },
];

const GRADE_ORDER = { platinum: 0, gold: 1, silver: 2, bronze: 3 };
const GRADE_LABEL = { platinum: 'Platinum', gold: 'Gold', silver: 'Silver', bronze: 'Bronze' };
const KIND_LABEL = {
  meta: 'Platinum',
  story: 'Story',
  side: 'Side mission',
  collectibles: 'Collectible',
  activities: 'Activity',
};

function formatCount(trophy) {
  if (trophy.count == null) return null;
  const number = trophy.count >= 1000 ? trophy.count.toLocaleString('en-US') : String(trophy.count);
  return `${number} ${trophy.countLabel}`;
}

function isSpoilerMasked(trophy, state) {
  return state.spoiler && trophy.kind === 'story' && !state.earned.has(trophy.id);
}

export function trophyMatchesKind(trophy, kind) {
  if (kind === 'all') return true;
  if (kind === 'missable') return trophy.missable === 'yes' || trophy.missable === 'watch';
  if (kind === 'online') return false;
  return trophy.kind === kind;
}

export function filterTrophies(trophies, state) {
  const query = state.query.trim().toLowerCase();
  return trophies.filter((trophy) => {
    if (!trophyMatchesKind(trophy, state.kind)) return false;
    if (state.grade !== 'all' && trophy.grade !== state.grade) return false;
    if (state.hideEarned && state.earned.has(trophy.id)) return false;
    if (!query) return true;
    const haystack = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
    return haystack.includes(query);
  });
}

export function sortTrophies(trophies, order) {
  const sorted = [...trophies];
  if (order === 'grade') {
    sorted.sort((a, b) => GRADE_ORDER[a.grade] - GRADE_ORDER[b.grade] || a.id - b.id);
  } else if (order === 'stage') {
    sorted.sort((a, b) => a.stage - b.stage || a.id - b.id);
  } else {
    sorted.sort((a, b) => a.id - b.id);
  }
  return sorted;
}

function badge(text, className) {
  const span = document.createElement('span');
  span.className = `badge ${className}`;
  span.textContent = text;
  return span;
}

function renderTrophyCard(trophy, sources, state, onToggle, onOpen) {
  const masked = isSpoilerMasked(trophy, state);
  const earned = state.earned.has(trophy.id);
  const article = document.createElement('article');
  article.className = 'trophy';
  article.id = `trophy-${trophy.id}`;
  if (earned) article.classList.add('earned');
  if (masked) article.classList.add('spoiled');
  if (state.expanded.has(trophy.id)) article.classList.add('open');

  const head = document.createElement('div');
  head.className = 'trophy-head';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = earned;
  checkbox.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
  // The checkbox sits inside the card header, which toggles the card open on
  // click. Stop the click here, or the header's handler re-renders the list
  // and detaches this checkbox before its change event fires.
  checkbox.addEventListener('click', (event) => event.stopPropagation());
  checkbox.addEventListener('change', () => {
    onToggle(trophy.id, checkbox.checked);
  });

  const main = document.createElement('div');
  main.className = 'trophy-main';

  const name = document.createElement('h3');
  name.className = 'trophy-name';
  if (masked) {
    const hidden = document.createElement('span');
    hidden.className = 'spoiler-name';
    hidden.textContent = 'Hidden story trophy — earn it to reveal its name';
    name.append(hidden);
  } else {
    name.textContent = trophy.name;
  }

  const desc = document.createElement('p');
  desc.className = 'trophy-desc';
  desc.textContent = masked
    ? 'Spoiler hidden — its official description stays hidden until you earn it.'
    : `\u201c${trophy.description}\u201d`;

  const badges = document.createElement('div');
  badges.className = 'trophy-badges';
  badges.append(badge(GRADE_LABEL[trophy.grade], trophy.grade));
  badges.append(badge(KIND_LABEL[trophy.kind] ?? trophy.kind, ''));
  badges.append(badge(`Stage ${trophy.stage}`, ''));
  if (trophy.hidden) badges.append(badge('Hidden on PSN', 'hidden-badge'));
  if (trophy.missable === 'yes') badges.append(badge('Missable', 'missable-badge'));
  if (trophy.missable === 'watch') badges.append(badge('Time-sensitive', 'watch-badge'));
  if (trophy.confidence === 'unconfirmed') badges.append(badge('Unconfirmed', 'unconfirmed-badge'));
  const count = formatCount(trophy);
  if (count) badges.append(badge(count, 'count-badge'));

  main.append(name, desc, badges);

  const chev = document.createElement('span');
  chev.className = 'trophy-chev';
  chev.textContent = '\u203a';
  chev.setAttribute('aria-hidden', 'true');

  head.append(checkbox, main, chev);
  head.addEventListener('click', () => onOpen(trophy.id));

  const detail = document.createElement('div');
  detail.className = 'trophy-detail';
  if (!masked) {
    const guide = document.createElement('p');
    guide.className = 'trophy-guide';
    guide.textContent = trophy.guide;
    detail.append(guide);

    if (trophy.need100) {
      const meta = document.createElement('p');
      meta.className = 'trophy-meta';
      const strong = document.createElement('strong');
      strong.textContent = '100% checklist: ';
      meta.append(strong, document.createTextNode(trophy.need100));
      detail.append(meta);
    }

    const sourcesLine = document.createElement('p');
    sourcesLine.className = 'trophy-sources';
    sourcesLine.append(document.createTextNode('Sources: '));
    trophy.src.forEach((key, index) => {
      const source = sources[key];
      if (!source) return;
      if (index > 0) sourcesLine.append(document.createTextNode(' · '));
      if (source.url) {
        const link = document.createElement('a');
        link.href = source.url;
        link.textContent = source.name;
        link.target = '_blank';
        link.rel = 'noopener';
        sourcesLine.append(link);
      } else {
        const plain = document.createElement('span');
        plain.className = 'source-plain';
        plain.textContent = source.name;
        sourcesLine.append(plain);
      }
    });
    detail.append(sourcesLine);
  } else {
    const note = document.createElement('p');
    note.className = 'trophy-guide';
    note.textContent = 'This is a story trophy. Turn spoiler mode off, or earn it, to read its official name, description and guide.';
    detail.append(note);
  }

  article.append(head, detail);
  return article;
}

export function renderKindChips(trophies, state, onSelect) {
  const chips = document.getElementById('kindChips');
  chips.replaceChildren();
  for (const kind of KINDS) {
    const count = kind.key === 'all'
      ? trophies.length
      : trophies.filter((trophy) => trophyMatchesKind(trophy, kind.key)).length;
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-pressed', state.kind === kind.key ? 'true' : 'false');
    button.append(
      document.createTextNode(kind.label),
      document.createTextNode(' '),
    );
    const n = document.createElement('span');
    n.className = 'chip-count';
    n.textContent = `(${count})`;
    button.append(n);
    button.addEventListener('click', () => onSelect(kind.key));
    chips.append(button);
  }
}

export function renderProgress(trophies, state) {
  const earnedCount = state.earned.size;
  document.getElementById('earnedCount').textContent = String(earnedCount);
  const percent = Math.round((earnedCount / trophies.length) * 100);
  document.getElementById('progressFill').style.width = `${percent}%`;
  document.getElementById('progressNote').textContent =
    earnedCount === 0
      ? 'Tick a trophy off and it stays ticked — progress saves in this browser.'
      : earnedCount === trophies.length
        ? 'Every trophy earned. The platinum is yours, Leonida Legend.'
        : `${percent}% of the way to the platinum — ${trophies.length - earnedCount} to go.`;

  const breakdown = document.getElementById('gradeBreakdown');
  breakdown.replaceChildren();
  for (const grade of ['platinum', 'gold', 'silver', 'bronze']) {
    const total = trophies.filter((t) => t.grade === grade).length;
    const done = trophies.filter((t) => t.grade === grade && state.earned.has(t.id)).length;
    const li = document.createElement('li');
    const dot = document.createElement('span');
    dot.className = `dot ${grade}`;
    li.append(dot, document.createTextNode(`${GRADE_LABEL[grade]} ${done}/${total}`));
    breakdown.append(li);
  }
}

export function renderTrophyList(trophies, sources, state, handlers) {
  const list = document.getElementById('trophyList');
  const empty = document.getElementById('emptyState');
  const resultCount = document.getElementById('resultCount');
  const visible = sortTrophies(filterTrophies(trophies, state), state.sort);

  list.replaceChildren();
  for (const trophy of visible) {
    list.append(renderTrophyCard(trophy, sources, state, handlers.onToggle, handlers.onOpen));
  }

  const earnedVisible = visible.filter((t) => state.earned.has(t.id)).length;
  resultCount.textContent = `Showing ${visible.length} of ${trophies.length} trophies · ${earnedVisible} earned in this view`;

  if (visible.length === 0) {
    empty.hidden = false;
    empty.textContent = state.kind === 'online'
      ? 'No online trophies: every one of the 55 is single-player, and none needs a DLC or a multiplayer mode. (PowerPyx, GTABase.)'
      : 'No trophies match these filters. Try another kind, grade or search.';
  } else {
    empty.hidden = true;
  }
}
