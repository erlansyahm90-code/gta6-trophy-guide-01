// Roadmap to the platinum, built from the official trophy descriptions: which
// story chapters and missions, which collectibles and counts, in what order.
// Hours are PowerPyx's estimates; the stage order is this guide's own, shaped
// by the descriptions (story first, strangers early, collectibles and
// activities next, the 100% checklist last). The 100% comparison table sits
// beside it: trophy targets against the checklist's numbers.

export const ROADMAP_STAGES = [
  {
    stage: 1,
    title: 'Story first — Chapters 1–5',
    hours: '60–80 h',
    blurb:
      'Play the story in order. All 12 story trophies unlock here, and so does the one reported missable: meditate with Lucia on the balcony at Jason\u2019s house in Chapter 1 before the chapter ends. Start the stranger chains as soon as they unlock, scan vehicles as you go, and keep a manual save at the start of every chapter — there is no mission replay.',
    trophyIds: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 28],
  },
  {
    stage: 2,
    title: 'Strangers & side characters',
    hours: 'part of ~10 h cleanup',
    blurb:
      'Finish the stranger mission strands: Andy, Kenton, Billy, Randy and Tyrone each end with a trophy, and three more strands make the 8 for Strangers & Freaks. Beat Cal at fishing and hunt Bret\u2019s unique animal. One guide warns the stranger chains have windows tied to story progress, so begin them early rather than after the credits.',
    trophyIds: [20, 22, 23, 24, 25, 26, 27, 29],
  },
  {
    stage: 3,
    title: 'Collectibles & exploration',
    hours: 'inside the ~100 h checklist',
    blurb:
      'Cards, WAiNK scans, vehicles, areas, garages. WAiNK scanning does triple duty: 100 locations for You WAiNKer!, 100 vehicles for Whip It Good, and 200 base-model vehicles for the 100% checklist. Buy the 8 garages in the Vice City Real Estate app and clear the map fog from the air.',
    trophyIds: [30, 31, 35, 42, 54, 55],
  },
  {
    stage: 4,
    title: 'Activities, crime & combat',
    hours: 'inside the ~100 h checklist',
    blurb:
      'The long middle: 250 stunts, 42 shooting-range golds, 14 drone-race locations, 20 race wins, 50 challenges, the robberies (5 bank vaults, armored trucks, 9 gangs) and the one-off feats. Most of it feeds the 100% checklist, so work the checklist and the trophies together.',
    trophyIds: [15, 16, 17, 18, 19, 21, 32, 33, 34, 36, 37, 38, 39, 40, 41, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53],
  },
  {
    stage: 5,
    title: '100% & the platinum',
    hours: 'final cleanup',
    blurb:
      'After the credits the 100% checklist appears under Progress > Stats. Finish what is left of it — it is roughly 60% of true completion, so the thresholds are lenient — and A Long Road pops. The platinum, Vice Got a Price!, follows the moment every other trophy is earned.',
    trophyIds: [14, 1],
  },
];

// Trophy target against the 100% checklist target, from the list Press-Start
// published on 18 November 2026 (as reported by EGamers). Where the two
// sources disagree — meditation spots, 18 against 15 — both numbers are shown.
export const HUNDRED_COMPARE = [
  { trophy: 'Cunning Stunts', trophyNeed: '250 stunts', hundredNeed: '300 stunts' },
  { trophy: 'Earn Cash, Not Kudos', trophyNeed: '20 different races won', hundredNeed: '30 unique races won' },
  { trophy: 'One Last Thing', trophyNeed: '50 challenges', hundredNeed: '70 of 80 challenges' },
  { trophy: 'You WAiNKer!', trophyNeed: '100 WAiNK locations', hundredNeed: '100 WAiNK locations' },
  { trophy: 'The Shootist', trophyNeed: 'gold in all 42 challenges', hundredNeed: '42 gold medals' },
  { trophy: 'Don\u2019t Touch My Deck', trophyNeed: '3 card sets', hundredNeed: '15 card sets' },
  { trophy: 'Positive Mental Attitude', trophyNeed: '18 meditation spots (GTABase)', hundredNeed: '15 meditation spots' },
  { trophy: 'Maximum Withdrawal', trophyNeed: '5 bank vaults', hundredNeed: '8 bank vaults' },
  { trophy: 'Whip It Good', trophyNeed: '100 vehicles discovered', hundredNeed: '200 base model vehicles scanned' },
  { trophy: 'Pest Control', trophyNeed: '1 illegal operation per gang (9)', hundredNeed: 'all 39 gang operations' },
  { trophy: 'Dime on the Dollar', trophyNeed: '$250,000 laundered', hundredNeed: '$250,000 laundered' },
  { trophy: 'Top Fun', trophyNeed: 'win at all 14 locations', hundredNeed: '42 drone time trials' },
];

export function renderRoadmap(trophiesById, earned, onJumpToTrophy) {
  const stagesEl = document.getElementById('stages');
  stagesEl.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const li = document.createElement('li');
    li.className = 'stage';

    const head = document.createElement('div');
    head.className = 'stage-head';
    const title = document.createElement('h3');
    const num = document.createElement('span');
    num.className = 'stage-num';
    num.textContent = `Stage ${stage.stage}`;
    title.append(num, document.createTextNode(stage.title));
    const hours = document.createElement('span');
    hours.className = 'stage-hours';
    hours.textContent = stage.hours;
    head.append(title, hours);

    const earnedCount = stage.trophyIds.filter((id) => earned.has(id)).length;
    const count = document.createElement('p');
    count.className = 'stage-count';
    count.textContent = `${earnedCount} of ${stage.trophyIds.length} trophies earned`;

    const blurb = document.createElement('p');
    blurb.textContent = stage.blurb;

    const list = document.createElement('ul');
    list.className = 'stage-trophies';
    for (const id of stage.trophyIds) {
      const trophy = trophiesById.get(id);
      if (!trophy) continue;
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = trophy.name;
      if (earned.has(id)) button.classList.add('earned');
      button.addEventListener('click', () => onJumpToTrophy(trophy));
      item.append(button);
      list.append(item);
    }

    li.append(head, count, blurb, list);
    stagesEl.append(li);
  }
}

export function renderHundredCompare() {
  const rows = document.getElementById('compareRows');
  rows.replaceChildren();
  for (const row of HUNDRED_COMPARE) {
    const tr = document.createElement('tr');
    const name = document.createElement('td');
    name.textContent = row.trophy;
    const need = document.createElement('td');
    need.textContent = row.trophyNeed;
    const hundred = document.createElement('td');
    hundred.textContent = row.hundredNeed;
    tr.append(name, need, hundred);
    rows.append(tr);
  }
}
