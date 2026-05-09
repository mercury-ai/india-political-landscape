## Phase Boundary

**Phase 1** produces: `src/data/states.json`, `src/data/governments.json`, `src/data/parties.json`, `src/data/elections/*.json`, `scripts/india-states-source.svg`, `scripts/wikimedia-id-map.json`, `src/map/statePaths.ts`.

**Phase 2** starts from those files and builds everything else. The Vite project scaffold, all React components, and deployment configuration are Phase 2 only.

---

## Context

Greenfield static website. No existing codebase, no backend, no database. The entire application is read-only data visualization — state never mutates at runtime. All political and election data lives in local JSON files committed to the repository.

The reference aesthetic is `sanjayio.github.io/bjp-nda-kerala-election-analysis-2026`: dark background (`#0f0f0f`), saffron/orange accents, bottom-drawer mobile interaction, fast micro-transitions. That site uses Leaflet + tile maps; we use inline SVG instead (36 static shapes vs 140 constituency polygons — no pan/zoom needed).

**Boundary editorial policy**: GoI-compliant. Source SVG is Wikimedia Commons `India_states_and_union_territories_map.svg` (CC BY-SA 3.0). Shows Aksai Chin within Ladakh, Arunachal Pradesh as a full Indian state, J&K and Ladakh as separate UTs (post-Oct 2019 bifurcation). Attribution required in footer.

## Goals / Non-Goals

**Goals:**
- Render all 36 states + UTs on a single responsive SVG map
- Color each region by current ruling alliance (NDA / INDIA / Other)
- Show a rich info card on hover (desktop) and bottom drawer (mobile)
- Info card contains: state name, ruling party/alliance, CM name + Wikipedia link, in-power-since year, vote-share pie chart (top 5 + Others)
- UTs without a legislature inherit the color of the central government's ruling party
- Hand-rolled SVG pie chart — zero chart library dependency
- Mobile-first responsive layout, bottom-sheet interaction on touch devices
- Fully static — GitHub Pages / Netlify deployable, no backend or API calls
- Fast: target ~55 KB gzipped JS bundle

**Non-Goals:**
- Dynamic data fetching or real-time updates (static JSON only for now)
- Constituency-level map detail
- Historical map (only current governments shown)
- Pan/zoom on the map
- User accounts or persistence
- Automated data refresh pipeline (future phase)

## Decisions

### D1: Inline SVG with extracted path data (not Leaflet, not react-simple-maps)

**Choice**: Download the Wikimedia India SVG, run a one-time Node.js extraction script to produce `statePaths.ts` (a map of `stateId → SVG path "d" string`), then render a single `<svg>` in React with one `<path>` per state.

**Why not Leaflet**: Leaflet adds ~150 KB and is designed for tile-based pan/zoom maps. 36 static shapes don't need it.

**Why not react-simple-maps**: Adds d3-geo (~40 KB) and fights us on custom hover styling. Not justified for a fixed-projection, no-zoom map.

**Why not TopoJSON + d3-geo**: Same reasoning — d3-geo is runtime overhead for a static map. The path `d` strings baked into `statePaths.ts` are a one-time cost paid at build time via the extraction script.

**Trade-off**: `statePaths.ts` is not human-editable geometry. Any map update requires re-running the extraction script. Acceptable given GoI boundaries change rarely.

---

### D2: Wikimedia Commons SVG as geometry source

**Choice**: `File:India_states_and_union_territories_map.svg` from Wikimedia Commons.

**Why**: GoI-compliant boundaries, updated post-2019 J&K/Ladakh bifurcation, CC BY-SA 3.0 license (attribution only), SVG format is directly usable, maintained by active Wikipedia editors.

**License compliance**: Footer must include "Map data © Wikimedia Commons contributors, CC BY-SA 3.0".

---

### D3: Separate data files, joined by stateId

```
src/data/
├── states.json          # { id, name, isoCode, isUT }
├── governments.json     # { stateId, rulingPartyId, allianceTag, inPowerSince, cm { name, wikipediaUrl }, latestElectionId }
├── parties.json         # { id, name, allianceTag, displayColor, abbreviation }
└── elections/
    ├── KA-2023.json     # { id, stateId, year, results: [{ partyId, voteSharePct }] }
    └── ...
```

**`allianceTag`** on `governments.json` is the editorial field that drives map color — separate from the party's default alliance in `parties.json`. This handles mid-term coalition flips (e.g., a party switches alliances; only `governments.json` needs updating, not the party's identity).

**`inPowerSince`**: ISO date string of the current CM's swearing-in, not the alliance's original ascent.

**UTs without legislature**: `governments.json` entry sets `allianceTag` to match central government. No special-casing in rendering code.

**President's Rule**: `allianceTag: "OTHER"` → renders white/neutral. No fourth color.

---

### D4: Three-color map model

| Alliance tag | Hex | Tailwind approx |
|---|---|---|
| `NDA` | `#f97316` | orange-500 |
| `INDIA` | `#2563eb` | blue-600 |
| `OTHER` | `#e5e7eb` with `#374151` stroke | gray-200 |

State stroke: `#1f2937` (gray-800) at 0.5px normally, `#ffffff` at 1.5px on hover.

---

### D5: Hand-rolled SVG pie chart

A pie slice is `M cx,cy L x1,y1 A r,r 0 largeArc,1 x2,y2 Z`. Computing arc endpoints from vote-share percentages is ~30 lines of TypeScript. Zero library dependency, zero bundle cost, full color control.

**Threshold**: Top 5 parties by `voteSharePct` rendered individually; remainder summed as "Others" in gray (`#6b7280`). Parties with < 0.5% collapsed into Others even if they would be top-5 (edge case for very small parties).

Party colors come from `parties.json[partyId].displayColor`. These are visually distinct brand colors (BJP saffron, INC blue, AAP blue-green, DMK red, etc.) — **not** the alliance map colors.

---

### D6: @floating-ui/react for desktop tooltip positioning

**Choice**: `@floating-ui/react` (~10 KB) for the desktop floating card.

**Why**: Handles viewport-edge collision (flip + shift middleware) automatically. Without it, the card clips at right/bottom edges. This is the modern Popper.js replacement.

**Mobile**: At `(pointer: coarse)` — no floating card. Tap fires `openDrawer(stateId)` instead. Bottom drawer slides up with `transform: translateY(0)`, transition `0.3s cubic-bezier(0.32, 0.72, 0, 1)` (matching reference site).

---

### D7: Pointer events unify mouse + touch

Use `onPointerEnter` / `onPointerLeave` on each `<path>` for hover preview (desktop). Use `onClick` for "pin the card" (desktop) and "open drawer" (mobile). `pointer: coarse` media query detection in JS to switch modes.

---

### D8: Data loading strategy — static imports + lazy election files

**Choice**: `states.json`, `governments.json`, and `parties.json` are statically imported at bundle time. Individual `elections/*.json` files are loaded via dynamic `import()` on demand.

**Why static for core files**: These three files are tiny (~10 KB combined), always needed on page load, and never change at runtime. Static imports mean zero latency and no loading states for the map itself.

**Why dynamic for election files**: There will be ~30 election files. Loading all upfront adds unnecessary weight (~150 KB) when the user only ever views one state at a time. Vite automatically code-splits dynamic imports, so each `elections/KA-2023.json` becomes its own chunk loaded only when that state is opened. The info card shows a brief spinner while the file loads (typically <100ms on a modern connection, cached on subsequent opens).

**Implementation**: `dataLoader.ts` exposes `getStateViewModel(stateId: string): Promise<StateViewModel>`, which statically resolves government/party data and dynamically imports the election file if `latestElectionId` is non-null.

---

## Component tree

```
App
├── Header
│   └── LastUpdatedBadge
├── MapContainer
│   ├── IndiaMap (the <svg>)
│   │   └── StatePath × 36 (each <path>, owns pointer events)
│   └── MapLegend
├── StateInfoCard (floating, desktop only, @floating-ui)
│   └── VoteSharePie (hand-rolled <svg>)
└── StateDrawer (bottom sheet, mobile only)
    └── VoteSharePie
```

---

## Folder structure

```
/
├── scripts/
│   └── extract-svg-paths.ts     # one-time geometry extraction
├── src/
│   ├── components/
│   │   ├── map/
│   │   │   ├── IndiaMap.tsx
│   │   │   ├── StatePath.tsx
│   │   │   └── MapLegend.tsx
│   │   ├── card/
│   │   │   ├── StateInfoCard.tsx
│   │   │   ├── StateDrawer.tsx
│   │   │   └── VoteSharePie.tsx
│   │   └── layout/
│   │       └── Header.tsx
│   ├── data/
│   │   ├── states.json
│   │   ├── governments.json
│   │   ├── parties.json
│   │   └── elections/
│   ├── lib/
│   │   ├── types.ts
│   │   ├── colors.ts            # allianceTag → hex, partyId → hex
│   │   ├── dataLoader.ts        # joins JSONs into view models
│   │   └── pieGeometry.ts       # arc math for VoteSharePie
│   ├── map/
│   │   └── statePaths.ts        # generated by extract-svg-paths.ts
│   └── App.tsx
├── public/
└── index.html
```

---

## Risks / Trade-offs

**[SVG path extraction complexity]** → Wikimedia SVGs have Inkscape-generated IDs (e.g., `path9482`), not state names. The extraction script needs a manual mapping table (`inkscape-id → stateId`). One-time cost, but fragile if the Wikimedia SVG is regenerated with new IDs. Mitigation: commit both the source SVG and the mapping table so the script is reproducible.

**[Political data staleness]** → JSON files will drift from reality as governments change. Mitigation: `lastUpdated` field in `governments.json` surfaced in the footer; clear README instructions for updating data.

**[CC BY-SA share-alike]** → The license technically requires derivative works to be CC BY-SA. For a website (not a packaged library), this means the site's content must carry attribution. Source code can remain MIT. Mitigation: footer attribution, README note.

**[Disputed territory rendering]** → Using GoI boundaries means the map will differ from international norms on Aksai Chin and Arunachal Pradesh. This is intentional and should be documented in README for transparency.

**[Small UT clickability on mobile]** → Chandigarh, D&NH, Lakshadweep are tiny on a full-India map. Tap targets will be sub-10px on mobile. Mitigation: show a UT sidebar list in the header/legend for the five smallest UTs as a fallback access point.

## Open Questions

_None — all key decisions resolved during exploration phase._
