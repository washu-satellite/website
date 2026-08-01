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

`[x]` Done. Homepage timeline and `/roadmap` now share one dataset.

- `src/const/content/roadmap.ts` is the single source of truth. `/roadmap` renders everything;
  the homepage timeline renders the entries flagged `featured`.
- The hardcoded JSX timeline in `src/routes/index.tsx` is gone. Adding a milestone is now a
  one-file edit. Icons are set per item by a string key (`icon: "antenna"`) so the data file
  stays free of JSX; the key maps to a lucide component in `index.tsx`.
- Added a "See the full roadmap" button under the homepage timeline.
- Milestones rebuilt from the Notion Missions DB export: SCALAR's RIDE waves (Apr, Jun, Aug,
  Sep, Oct 2026), GS-2 and AIRIS in development, and VECTOR's Fall 2026 / Feb 2027 narrative.

Deliberately left off the public site: task-level "BLOCKED" and overdue states from Notion.
Statuses are flattened to done / in progress / planned. If you want the site to mirror internal
status more closely, say so — but broadcasting a blocked FCC filing publicly is a choice, not
an oversight.

## 4. Countdown to RIDE requirements for SCALAR

`[x]` Done.

- SCALAR now counts down to **23 Oct 2026**, the final RIDE deliverable (satellite environmental
  test report), instead of the invented 2027 launch date.
- `LaunchCountdown.tsx` gained a `kind: "deliverable"` variant: file icon instead of a rocket,
  "Due" instead of "Target", and "Submitted" instead of "Launched" once the date passes.
- Fixed an off-by-one in the displayed date. Targets were written as UTC midnight (`...T00:00:00Z`),
  which renders as the previous day anywhere west of UTC — the tile read "Oct 22" for a 23 Oct
  target. Targets are now local-time, and the SCALAR one is end-of-day since a deliverable is not
  late until the due date is over.

Still open:
- **AIRIS's countdown target (1 Dec 2026) is not backed by anything.** The Missions DB has an
  empty launch date for all eight missions. The blurb hedges with "pending NASA decision", but
  either confirm the date or set `target: undefined` to render "T-minus TBD".

## 5. All missions need to be updated

`[~]` Ground stations done. AIRIS, SCALAR, VECTOR, SB-1 still need lead review.

Done:
- **GS-2 page created** (`src/const/content/projects.tsx`, `gs2` entry). It did not exist before,
  despite being the active project. Sourced from Slack `#ground-station` and `#exec`.
- **GS-1 moved to past missions** — `phase: 'success'`, status line rewritten from the stale
  "pending end-to-end software and rotator-control testing" to completed-and-superseded, plus a
  "Why GS-1 closed" section explaining the handoff to GS-2.
- The Missions dropdown now lists GS-2 first under Active Projects and GS-1 under Past Missions.
- SPINOR left at Proposal Phase, per Caden.

**Notion MCP is not connected in this session** — only Slack. Everything on the GS-2 page came
from Slack, so anything that lives only in Notion (requirement IDs, module-level task status, the
GS test plan deck) is not reflected. Connect Notion if you want that pulled in.

GS-2 facts sourced from Slack, worth verifying before this goes to production:
- Site: Crow Hall rooftop, chosen Jun 2026 for sightlines, access, grounding, and power. Still
  being finalized with the Physics Department — the page says "planned site" for that reason.
- Pointing: 5° minimum elevation for RF safety, full 360° azimuth with partial obstruction.
- Deadline: Preston's "fully functional by February at the latest", with an assembled and
  semi-functional prototype before fall break.
- Software: fprime-gds, commands defined flight-side and picked up automatically; operator
  sign-in logging requested by Mission Ops.
- Licensing: FCC Part 5 Conventional License being pursued over amateur; ham operator recruitment
  is running in `#ham-radio`.

Deliberately left off the page:
- **Operating frequency.** Warren asked "what frequency are we tuning our gs to detect scalar?"
  in July and I found no answer. The page says "UHF" only. GS-1's page still states 437.5 MHz.
- **Antenna type.** The team debated dropping the yagi, then an outside antenna engineer
  (Gil Schmitt) recommended reviving it. Paul Fleck's HFSS simulations were still running as of
  30 Jul. The page describes it as "a high-gain UHF antenna" in simulation rather than naming a
  type. Fill this in once the design closes.
- Internal candor from the exec thread about GS-1's tuning never converging is paraphrased
  neutrally rather than quoted.
- `contributors: 47` was copied from the other missions, which all use that number. Real per-project
  counts would be better on every page.

Still open: AIRIS, SCALAR, VECTOR, and SB-1 need current phase, objectives, and subsystem lists
from their leads. GS-2 needs a poster PDF and a hero image (`/projects/gs2.png`) — every other
mission page has both.

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

`[x]` Done as part of item 3 — one dataset, two views.

Open questions raised by the data:
- ~~GS-1 status conflict.~~ Resolved: finished and superseded by GS-2. The roadmap now carries
  "Late 2025 — GS-1 closed, GS-2 begins", "2026 — GS-2 in assembly", and "Feb 2027 — GS-2
  operational". Slack `#exec` (29 Sep 2025) has the decision thread if you need the receipts.
- **TVAC and LUNAR are absent from the roadmap.** Both are "Not started" with no dates in Notion,
  so there was nothing to put on a dated timeline. SPINOR is also absent but does have a mission
  page — worth resolving that inconsistency.
- **AIRIS's "full integration testing complete" milestone has no year in the export** (just
  "Sep 1"), so it is described without a date rather than guessed at. There is still an open
  "Create AIRIS Timeline" task on your side — that would fill the gap.
- **Recruitment dates are not on the roadmap** (Aug 17 orientation, Aug 24 activity fair, Sep 4
  applications due, Sep 13 decisions). They are publicly useful, especially the application
  deadline, but they are club-ops rather than mission milestones. Say the word and I will add
  them, either to the roadmap or to `/apply`.

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
- ~~`/sponsors` is in the footer but not the top nav.~~ Added to the top nav between Newsletter
  and Contact. Note the top-nav right-hand group is `hidden lg:flex`, so Sponsors, Newsletter,
  Contact, and Apply all vanish below 1024px with no mobile menu to replace them. Pre-existing,
  but it means the footer is the only way to reach those pages on a phone.

---

## Consolidated asks (things to chase from other people)

1. ~~Roster spreadsheet with titles~~ — received, item 1 applied. Still need: confirmation of the
   26 untitled members, status of Geoffrey Goffman and Jack Galloway, and missing headshots.
2. New "who are we" copy — unblocks item 2.
3. ~~Milestones since Oct 2024~~ — received via the Notion Missions DB export, items 3 and 8 done.
   Still need: GS-1 open-or-closed, and a year for AIRIS integration testing.
4. ~~RIDE deadline date for SCALAR~~ — 23 Oct 2026, item 4 done. Still need: confirm or clear
   AIRIS's 1 Dec 2026 countdown target.
5. Mission status updates from each lead — unblocks item 5.
6. Wireframe / CAD source files — unblocks item 6.
7. Discipline write-ups from each team lead — unblocks item 7.
8. Confirmed sponsor list, logos, and the sponsorship packet PDF — finishes item 9.

## Suggested order

Do the unblocked structural work first so content drops in cleanly:

1. ~~Item 9 — sponsors page CTA~~ done.
2. ~~Item 3 — unify timeline and roadmap onto `roadmap.ts`~~ done.
3. ~~Item 8 — roadmap page refresh~~ done.
4. ~~Item 4 — SCALAR RIDE countdown~~ done.
5. Item 7 — scaffold discipline subpages with placeholder copy. Next unblocked item.
6. Items 1, 2, 5 — pure content edits, fast once the data arrives.
7. Item 6 — largest unknown, start only after the source files exist.
