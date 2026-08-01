# Website TODO

Working list for the sat-official-website refresh. Each item: what needs to change,
which files it touches, and what is blocking it.

Status key: `[ ]` not started, `[~]` in progress, `[x]` done, `[!]` blocked on outside input.

---

## 1. Exec update + titles for everyone on the Persons page

`[~]` Mostly done. Titles applied from the Role Breakdown sheet.

Source: [Role Breakdown sheet](https://docs.google.com/spreadsheets/d/1nkZ18ai0bizpokKvjZ13AqYPYUIxIgFudQyAOcaoEr4/edit)

Done:
- 34 of 60 members now have a `role` in `src/const/content/members.json` (was 2).
- Format: Exec members show the bare title ("Chief Systems Engineer (CSE)"); everyone else shows
  "Role — Project" ("Structures Module RE — GS-2").
- Title picked by priority when someone holds several: Exec title > project lead / admin >
  module RE > component owner. Andrew Press holds 8 current roles, shows "Project Manager".
- Chief Physicist conflict resolved in Kian Eghtesady's favor; Sophie Fendler now shows
  "Imaging Module RE — AIRIS".
- Skipped roles under "GS-1 (closed FL25)" — the project is closed, so those rows are stale.
  This is why Lilian Lu and Joshua Lee get no title from the sheet.

Still open:
- 26 members have no title because the sheet assigns them no current role. The sheet tracks role
  assignments, not membership, so they were kept on the site untitled. Confirm they are all still
  in the club: Sachin Agrawal, Jonas Kim, Aman Verma, Sophie Yokoo, Zachary Dang, William Fang,
  Jackson Shurman, Paul Fleck, Nickalus Bui, Tyler Zhang, Allen Maldonado, Ananyaa Srivastan,
  Luis Garcia, Cole Smith, Ruby Corzine, Ethan Silver, Dory Dugal, Quan Do, Luke Gardiner,
  Keith Bass, Jeremy Friedman-Wellisch, Khoa Vu Ngoc, Matt Dunn, Kelvin Han, Ben Veiel, Lilian Lu.
- Three people hold a current role in the sheet but are deliberately not on the site:
  Geoffrey Goffman (GS-2 Frame), Jack Galloway (SCALAR RIDE & Contract), and Nathaniel Bowman
  (listed as Chief Electrical Engineer, removed at Caden's direction). Their sheet rows are still
  open — close them out so the sheet stops reporting them as current.
- Nothing on the site currently shows a Chief Electrical Engineer. Confirm who holds CEE, or
  whether the position is vacant.
- Still missing headshots: Andrew Press, Aman Verma, Qihan Wang, Nick Jarmuz, Isaac Gutierrez,
  Sophie Yokoo, Zachary Dang, Travis Kuo, Julia Hannon, Warren Schindler, William Fang,
  Jackson Shurman, Nickalus Bui, and others.
- No member has `gradYear` or `linkedin` set, though both fields are supported and rendered.

Sheet data issues worth fixing at the source:
- "Transient Identificaiton" and "RIDE&Contract" were corrected on the way in; fix in the sheet too.
- Assignee cells with two names ("Preston Lopez / Nathaniel Bowman", "Drew Sims/Vanya",
  "Mawin / Nathaniel Bowman") were split on "/". Cleaner to give each their own row.
- "Jesse M" should be "Jesse Myoung"; "Isaac Gutierez" / "Issac Gutierrez" should be
  "Isaac Gutierrez". Aliased on import, but the sheet should be canonical.
- SCALAR "Ground RE — Aidan Moriarty" is marked `<--- Delete` in the notes column but still active.

## 2. "Who are we" update

`[!]` Blocked: need new copy.

- Current text: `src/const/content/homepage.tsx` -> `aboutUs`.
- It is stale: says "Fall of 2024 ... grew from 12 members to more than 40". Roster is now 59.
- Rendered at `src/routes/index.tsx:130`.
- Also review `missionStatement` and `tagline` in the same file while we are in there.

## 3. Timeline update

`[ ]` Not blocked on content decisions, but needs new milestones.

- Two sources of truth exist and they disagree — fix this as part of the update:
  - Homepage timeline is hardcoded JSX, `src/routes/index.tsx:184-233` (4 entries, newest Oct 2024).
  - `src/const/content/roadmap.ts` has a richer, newer list (through 2026) used by `/roadmap`.
- Plan: make the homepage timeline render from `roadmap.ts` so there is one list to maintain,
  then add the missing 2025-2026 milestones.

Needed from the team: milestones since Oct 2024 with dates.

## 4. Countdown to RIDE requirements for SCALAR

`[!]` Blocked: need the RIDE deadline date and what exactly we are counting down to.

- Countdown component: `src/components/LaunchCountdown.tsx`, entries in `LAUNCHES` at line 14.
- Currently two entries: AIRIS (2026-12-01) and SCALAR (2027-02-01, "planned 1U CubeSat launch").
- The component supports `target: undefined` to render a TBD state, so we can ship the card
  before the date firms up.

Needed:
- The RIDE requirements submission/deadline date (ISO).
- Whether this replaces the SCALAR launch countdown or is a third entry alongside it.

## 5. All missions need to be updated

`[!]` Blocked: need per-mission current status from mission leads.

- Content: `src/const/content/projects.tsx`. Missions defined: `airis` (line 57), `scalar` (141),
  `vector` (190), `spinor` (257), plus Ground Station 1 (line 8) and Small Balloon 1 (line 310).
- SCALAR copy and exec roster were partially corrected in commit `afafeb3`; the rest is unreviewed.
- Rendered by `src/routes/projects/$project_slug.tsx` and `src/components/ProjectPage.tsx`.

Needed from each mission lead: current phase, updated objectives, and any changed subsystem list.

## 6. Sync page scrolling to a wireframe explode graphic

`[!]` Blocked: need the original CAD/wireframe source files.

- No implementation exists yet — nothing in `src/` references a wireframe or scroll-driven graphic.
- Ask MechE for the source: ideally a CAD exploded-view animation exported as an image sequence
  or a single SVG with separable layers. A baked video is workable but harder to scrub smoothly.
- Preferred approach once assets land: scroll-linked frame sequence on canvas, or CSS
  `animation-timeline: scroll()` if we can keep it to layer transforms.

Needed: which mission's wireframe (SCALAR bus? AIRIS payload?), and the source files.

## 7. Discipline subpages

`[!]` Blocked: waiting on write-ups from each discipline leader.

- Today `/team` groups by team but there are no per-discipline pages.
- Teams present in the data: Exec, Mission Ops, Physics, Mechanical, Electrical, Software,
  Systems, Business.
- Plan: add `src/routes/team/$team_slug.tsx` plus a `disciplines.ts` content file holding
  the blurb, what the team does, current projects, and how to join.

Needed: 1-3 paragraphs from each discipline leader. Chase these individually — this is the
item most likely to stall.

## 8. Roadmap

`[ ]`

- Page exists: `src/routes/roadmap.tsx`, data in `src/const/content/roadmap.ts`.
- Needs the same refresh as the timeline (item 3) — statuses are stale (GS-1 still "active",
  SCALAR design freeze "active" for 2026).
- Decide the relationship between roadmap and timeline: one dataset, two views, or two datasets.
  Recommendation: one dataset.

## 9. Sponsorships page

`[~]` CTA version shipped. Sponsor list intentionally not rendered yet.

Done:
- `src/routes/sponsors.tsx` rebuilt as a CTA page: pitch + "Become a sponsor" mailto in the
  header, a "What your support funds" section, and a closing CTA block at the bottom with the
  email and a link through to `/contact`.
- Both mailto links carry the subject "Sponsorship inquiry — WashU Satellite" so inquiries are
  filterable in the inbox.
- Link paths verified in the browser: `/sponsors` -> `/contact` -> footer "Sponsors" -> `/sponsors`
  all route correctly. Footer entry already existed at `src/components/Footer.tsx:92`.
- The current sponsor list in `src/const/content/sponsors.ts` is left in place but no longer
  rendered, per Caden — waiting on a confirmed list.

Still open:
- Confirmed sponsor list, then re-render the tier sections (the `SponsorTile` markup is in git
  history at commit `ad2a7ae` if it is worth restoring rather than rewriting).
- Sponsor logo files under `public/sponsors/` — the `logo` field has never been populated.
- Sponsorship packet PDF. The closing CTA promises one by email; either produce it or soften
  that line.
- `/sponsors` is in the footer but not the top nav. Decide whether it belongs there too.

---

## Consolidated asks (things to chase from other people)

1. ~~Roster spreadsheet with titles~~ — received, item 1 applied. Still need: confirmation of the
   26 untitled members, status of Geoffrey Goffman and Jack Galloway, and missing headshots.
2. New "who are we" copy — unblocks item 2.
3. Milestones since Oct 2024 — unblocks items 3 and 8.
4. RIDE deadline date for SCALAR — unblocks item 4.
5. Mission status updates from each lead — unblocks item 5.
6. Wireframe / CAD source files — unblocks item 6.
7. Discipline write-ups from each team lead — unblocks item 7.
8. Confirmed sponsor list, logos, and the sponsorship packet PDF — finishes item 9.

## Suggested order

Do the unblocked structural work first so content drops in cleanly:

1. ~~Item 9 — sponsors page CTA~~ done.
2. Item 3 — unify timeline and roadmap onto `roadmap.ts` (no outside input needed).
3. Item 8 — roadmap page cleanup, falls out of item 3.
4. Item 7 — scaffold discipline subpages with placeholder copy.
5. Items 1, 2, 4, 5 — pure content edits, fast once the data arrives.
6. Item 6 — largest unknown, start only after the source files exist.
