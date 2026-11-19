# Leonida Legend — GTA VI Trophy Guide & Tracker

[![make.fun bounty](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/erlansyahm90-code/gta6-trophy-guide-01/rank.svg)](https://make.fun/c/gta6-trophy-guide-01/)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/erlansyahm90-code/gta6-trophy-guide-01/reward.svg)](https://make.fun/c/gta6-trophy-guide-01/)

An offline guide and tracker for all **55 Grand Theft Auto VI trophies** on PlayStation 5 (1 platinum, 2 gold, 6 silver, 46 bronze), built for the [make.fun bounty](https://make.fun/bounty/gta6-trophy-guide-01) — see the [competition page](https://make.fun/c/gta6-trophy-guide-01/).

## What it is

- **Every trophy, official and complete** — names, descriptions and grades as PlayStation publishes them, including the 28 hidden until earned, with a guide in our own words for each one that names its sources beside it.
- **A tracker** — a checklist whose progress saves in the browser (localStorage), exportable to a file and importable back; filters by kind (story, side missions, collectibles, activities, missable, online) and by grade; search; sort by official order, grade or roadmap stage.
- **A spoiler setting** that hides the names and descriptions of story trophies until they are earned.
- **A roadmap to the platinum** in 5 stages, built from the official descriptions — story chapters and missions, collectibles and counts, in order — plus a table comparing each trophy's target against the 100% completion checklist.
- **Missable flags** — Positive Mental Attitude (the Chapter 1 balcony meditation) is flagged as the one reported missable trophy, and the stranger chains as time-sensitive, each with its source.
- **Confidence labels** — guides whose method is still unconfirmed at launch carry an UNCONFIRMED badge and say so in plain words (6 trophies).

The app is static files under `app/` with no build step. It works with the network off and makes no network request at run time; source links open only when the reader follows them. It uses no Rockstar Games logo, artwork, box art or screenshot of the game.

## Try it

```sh
node serve.ts
```

Then open http://localhost:8080.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Sources

Names, descriptions and grades from [Exophase](https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies) and PSNProfiles, which agree on all 55. Methods and counts checked 18–19 November 2026 against [PowerPyx](https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/), [GTABase](https://www.gtabase.com/articles/gta-6/gta-6-achievements-trophies-list-ps5-xbox-series), [EGamers](https://egamers.io/gta-6-trophy-list-all-55-trophies-and-achievements-plus-the-hardest-ones/), [GTA VI Vice City Hub](https://www.gtavicecityhub.com/achievements), [GTA Zone](https://gta-zone.com/news/gta-6-trophies-achievements/) and [Output Lag](https://outputlag.com/guides/gta-6-trophy-list/).

## License

MIT — see [LICENSE](LICENSE).
