# Phase 1: Data Collection & Geometry

Phase 1 is complete when every state/UT has a verified government entry, every election file exists, and the SVG geometry is extracted and committed. Phase 2 does not begin until Phase 1 output is fully populated and reviewed.

## 1. Schema Definition

- [x] 1.1 Create `src/data/states.json` with all 36 states and UTs (id, name, isUT) — this is the master list that all other files must have complete coverage for
- [x] 1.2 Create `src/data/parties.json` — research and list all major national and state-level parties that appear in results across any state; include id, name, abbreviation (≤5 chars), displayColor (visually distinct hex)
- [x] 1.3 Create `src/data/README.md` documenting the schema for each JSON file and instructions for future data updates

## 2. SVG Geometry

- [x] 2.1 Download Wikimedia Commons `India_states_and_union_territories_map.svg` and save to `scripts/india-states-source.svg`
- [x] 2.2 Open the SVG in a text editor and list all `<path>` element IDs; identify which path corresponds to which state/UT (use visual inspection or inkscape labels)
- [x] 2.3 Create `scripts/wikimedia-id-map.json` mapping each Inkscape path ID → two-letter state code for all 36 regions
- [x] 2.4 Install `tsx` as a dev dependency for running TypeScript scripts (`npm install -D tsx`)
- [x] 2.5 Write `scripts/extract-svg-paths.ts` — reads source SVG + mapping file, outputs `src/map/statePaths.ts` as a typed `Record<string, string>` named `STATE_PATHS`
- [x] 2.6 Run the script and verify `STATE_PATHS` has exactly 36 entries with valid SVG path strings
- [x] 2.7 Commit `scripts/india-states-source.svg`, `scripts/wikimedia-id-map.json`, and `src/map/statePaths.ts`

## 3. Government Data — All 36 States & UTs

For each entry: verify current CM, ruling party, alliance classification, swearing-in date, and Wikipedia URL. Cross-reference ECI and Wikipedia.

- [x] 3.1 Fill `governments.json` for the 5 large NDA states: UP, MP, Rajasthan, Gujarat, Assam
- [x] 3.2 Fill `governments.json` for the 5 large INDIA/opposition states: TN, Kerala, Karnataka, Telangana, Himachal Pradesh
- [x] 3.3 Fill `governments.json` for Maharashtra, Bihar, Jharkhand, Odisha, West Bengal (complex coalition states — verify alliance tag carefully)
- [x] 3.4 Fill `governments.json` for remaining states: Andhra Pradesh, Chhattisgarh, Punjab, Uttarakhand, Goa, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, Tripura, Arunachal Pradesh, Haryana
- [x] 3.5 Fill `governments.json` for North-East small states and all 8 UTs: Delhi, J&K, Ladakh, Chandigarh, Puducherry, Andaman & Nicobar, Lakshadweep, D&NH and D&D
- [x] 3.6 Review all 36 entries: confirm every `lastUpdated` date is set, every `chiefMinister.wikipediaUrl` resolves to the correct person's page, and every `allianceTag` is editorially correct

## 4. Election Data — All 36 States & UTs

For each state: source the most recent Vidhan Sabha election results from ECI (eci.gov.in) and enter vote share per party. UTs without a legislature get `latestElectionId: null`.

- [x] 4.1 Create election files for states in task 3.1 (UP-2022, MP-2023, RJ-2023, GJ-2022, AS-2021)
- [x] 4.2 Create election files for states in task 3.2 (TN-2021, KL-2021, KA-2023, TS-2023, HP-2022)
- [x] 4.3 Create election files for Maharashtra (MH-2024), Bihar (BR-2020), Jharkhand (JH-2024), Odisha (OD-2024), West Bengal (WB-2021)
- [x] 4.4 Create election files for remaining states: AP-2024, CG-2023, PB-2022, UK-2022, GA-2022, and North-East states
- [x] 4.5 Create election file for Delhi (DL-2025); set `latestElectionId: null` for UTs without legislatures (Ladakh, Chandigarh, A&N, Lakshadweep, D&NH and D&D)
- [x] 4.6 Validate all election files: vote shares sum to 99.5–100.5, all `partyId` values exist in `parties.json`

## 5. Phase 1 Review

- [x] 5.1 Run a completeness check: every state in `states.json` has an entry in `governments.json` and either an election file or `latestElectionId: null`
- [x] 5.2 Spot-check 5 random states end-to-end: government entry → election file → all partyIds resolve in parties.json
- [x] 5.3 Confirm `statePaths.ts` covers all 36 stateIds present in `governments.json`

---

# Phase 2: Frontend Build

Phase 2 starts only after Phase 1 is fully complete. All data is treated as stable and correct.

## 6. Project Scaffold

- [x] 6.1 Initialize Vite + React + TypeScript project (`npm create vite@latest`)
- [x] 6.2 Install and configure TailwindCSS v3
- [x] 6.3 Install `@floating-ui/react`
- [x] 6.4 Configure `vite.config.ts` for GitHub Pages base path
- [x] 6.5 Set up `tsconfig.json` with strict mode and path aliases (`@/` → `src/`)
- [x] 6.6 Move `src/data/`, `src/map/statePaths.ts` from Phase 1 into the new Vite project structure

## 7. Data Layer

- [x] 7.1 Create `src/lib/types.ts` defining `State`, `Government`, `Party`, `Election`, `AllianceTag` TypeScript types matching the Phase 1 JSON schemas
- [x] 7.2 Write `src/lib/dataLoader.ts` — statically import `states.json`, `governments.json`, `parties.json`; expose a `getStateViewModel(stateId)` function that lazily imports the relevant `elections/*.json` via dynamic `import()`
- [x] 7.3 Write `src/lib/colors.ts` — `allianceToColor(tag: AllianceTag): string` and `partyToColor(partyId: string): string`
- [x] 7.4 Write `src/lib/pieGeometry.ts` — pure function `buildSlices(results, parties)` returning top-5 + Others slice data with precomputed SVG arc path strings

## 8. Map Component

- [x] 8.1 Create `src/components/map/IndiaMap.tsx` — renders `<svg viewBox="..." width="100%">` with a `<StatePath>` per state
- [x] 8.2 Create `src/components/map/StatePath.tsx` — renders one `<path>`, resolves fill from `colors.ts`, handles `onPointerEnter`/`onPointerLeave`/`onClick`
- [x] 8.3 Wire hover state in `IndiaMap` — track `hoveredStateId` in `useState`, pass highlight props to `StatePath`
- [x] 8.4 Add CSS transition on `<path>`: `transition: fill 0.15s, stroke 0.15s, stroke-width 0.15s`
- [x] 8.5 Create `src/components/map/MapLegend.tsx` — three color swatches (NDA / INDIA / Other) positioned bottom-left

## 9. Info Card — Desktop

- [x] 9.1 Create `src/components/card/StateInfoCard.tsx` — floating card shell using `@floating-ui/react` (flip + shift middleware)
- [x] 9.2 Render state name, alliance badge, ruling party name, CM name as Wikipedia `<a target="_blank">`, and "Since YYYY"
- [x] 9.3 Add card open/close animation: opacity `0 → 1` over `0.15s`
- [x] 9.4 Detect touch device (`window.matchMedia('(pointer: coarse)')`) and suppress floating card on touch

## 10. Vote Share Pie Chart

- [x] 10.1 Create `src/components/card/VoteSharePie.tsx` — renders the SVG pie using slices from `pieGeometry.ts`
- [x] 10.2 Add inline legend next to pie (color swatch + abbreviation + vote %)
- [x] 10.3 Show loading state while election file lazy-imports
- [x] 10.4 Show "No election data available" if `latestElectionId` is null

## 11. Mobile Bottom Drawer

- [x] 11.1 Create `src/components/card/StateDrawer.tsx` — fixed bottom sheet, `transform: translateY(100%)` when closed
- [x] 11.2 Implement open/close: `transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)`
- [x] 11.3 Render same content as desktop card inside the drawer
- [x] 11.4 Close drawer on map background tap
- [x] 11.5 Make drawer content area scrollable when it exceeds 60% viewport height

## 12. Layout, Header & Footer

- [x] 12.1 Create `src/components/layout/Header.tsx` — 54px fixed dark header with site title
- [x] 12.2 Add "Last updated: YYYY-MM-DD" badge sourcing the most-recent `lastUpdated` date from `governments.json`
- [x] 12.3 Add footer with Wikimedia attribution: "Map data © Wikimedia Commons contributors, CC BY-SA 3.0"
- [x] 12.4 Create `App.tsx` composing Header + IndiaMap + StateInfoCard + StateDrawer + Footer
- [x] 12.5 Set global background `#0f0f0f` in `index.css`

## 13. Small UTs Accessibility

- [x] 13.1 Identify the 5 smallest UTs by rendered SVG path area
- [x] 13.2 Add a compact UT chip list in the legend area so users can tap them even if the map path is too small to hit

## 14. Polish & Deploy

- [ ] 14.1 Test on mobile viewport (375px) — drawer, touch, map scaling
- [ ] 14.2 Test on desktop (1280px+) — floating card positioning at all four map edges
- [x] 14.3 Verify bundle: `vite build --report`, confirm gzipped JS under 80 KB
- [x] 14.4 Configure GitHub Pages deployment (GitHub Actions workflow)
- [x] 14.5 Write `README.md`: data update instructions, map source attribution, disputed boundary policy
