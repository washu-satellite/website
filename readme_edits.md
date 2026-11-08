# Fall 2026 site revamp audit

**Compared against:** commit `388d236` (`main` / `origin/main`)  
**Scope:** changes in this feature branch relative to `main`. This file cross-checks the implementation against `edits.rtf`; pending items below have not been implemented.

## Changes currently made locally

- **Dark-only public site presentation:** The root document always applies the Tailwind `dark` class. The footer no longer shows the light/dark/system theme selector and always uses the dark logo. The navbar no longer selects a light logo or theme-dependent styling. The Zustand store still defines a theme setting, but the public site UI no longer offers the theme toggle.
- **All Missions page:** Added `/projects`, with clickable cards populated from the project data. Each card shows the mission icon, title, summary, phase, and date. Added an **All Missions** entry to the **Missions** dropdown and generated the TanStack route-tree entry. SPINOR is excluded from this index; its individual page and other project data remain available.
- **Spreadshop appearance:** Added CSS scoped to Spreadshop links whose product URL contains `dark+banner`. It applies a light blue, star-speckled gradient to matching product image areas and a translucent background to matching product text areas. This changes presentation only; it does not change the sticker artwork or product catalog.
- **Partners page:** Replaced the full-width white band and white cards with dark site surfaces, standard bordered cards, and theme-aware text. Partner logos remain on small light tiles to preserve their supplied brand colors and legibility.
- **Team roster:** Removed Luis Garcia and Cole Smith from `src/const/content/members.json`; Josh Smith remains on the roster.
- **SCALAR page:** Updated the expansion to “Stabilized CubeSat for Advanced Low-Earth Attitude Regulation,” changed the planned launch window to Spring 2027, removed the unsupported reprogrammable-laboratory/Mission Operations Framework claims, and removed the unverified 47-contributor and Design-phase labels. Replaced unconfirmed mission and technical descriptions with update placeholders.
- **README deployment note:** The existing README now says production deploys from `main`, and has a short summary of the dark theme, All Missions page, and shop background styling.

## Cross-check against `edits.rtf`

### Addressed by the current local changes

- “The site looks really good in dark mode but not so good in light mode”: the public site presentation is now fixed to dark mode and the visible theme selector is removed.
- “Have a similar page for all missions”: `/projects` now provides a mission index similar in purpose to the All Disciplines page.

### Still pending or not verified

- **Shop:** The local background styling does not make “WashU” more visible on the sticker and does not add more technical designs/products. The requested sticker/artwork/catalog change remains outstanding.
- **Partnership page:** The visual style now uses the site's dark surfaces. The partnership copy itself was not changed; whether it sounds too AI-written is subjective and remains unreviewed.
- **Team page:** The layout is unchanged. Luis Garcia and Cole Smith were removed from the roster, but whether any additional new members should be added is not verified against an authoritative roster.
- **News:** No local edit adds newsletter content. The current main content already has April 2026 and November 2026 editions; any additional news content remains outstanding.
- **Remove SPINOR from All Missions:** Done; the index filters out SPINOR without deleting its project page or data.
- **SCALAR corrections:** Applied per the notes. You confirmed Spring 2027; unsupported payload/framework details were replaced with placeholders, and the unverified contributor and phase labels were omitted. The planned launch timing and placeholder text should still be confirmed against the mission team before publishing.
- **Member removals:** Luis Garcia and Cole Smith have been removed from the roster as requested. Josh Smith remains listed.

## Local files changed relative to `388d236`

- `readme_edits.md` (this audit)
- `README.md`
- `src/components/Footer.tsx`
- `src/components/NavBar.tsx`
- `src/routeTree.gen.ts` (generated route metadata for `/projects`)
- `src/routes/__root.tsx`
- `src/routes/partners.tsx`
- `src/const/content/members.json`
- `src/const/content/projects.tsx`
- `src/routes/projects/$project_slug.tsx`
- `src/routes/projects/index.tsx` (new)
- `src/types/data.ts`
- `src/routes/shop.tsx`

No local changes to the newsletter content are included in this set. The team roster change is limited to removing Luis Garcia and Cole Smith.
