## Why

India lacks a clean, publicly accessible political map that shows — at a glance — which alliance controls each state government, who the chief minister is, and how the last election played out. This project builds that: a fast, static, fully frontend visualization that anyone can open on mobile or desktop and immediately understand India's current political landscape.

## What Changes

This is a greenfield project. There is no existing codebase — everything below is net-new.

- New static website: React + TypeScript + Vite + TailwindCSS, deployable to GitHub Pages / Netlify with zero backend
- SVG-based India political map (GoI-compliant boundaries from Wikimedia Commons) with each state/UT as an individually interactive `<path>` element
- Alliance-based map coloring: NDA/BJP → saffron (`#f97316`), INDIA/INC → blue (`#2563eb`), unaligned/regional → white/neutral
- Union Territories colored by the ruling central government party
- Hover (desktop) and tap (mobile) interaction showing a floating info card / bottom drawer with: state name, ruling party, CM name (Wikipedia-linked), in-power-since year, and a vote-share pie chart for the latest assembly election
- Pie chart: top-5 parties by vote share + "Others" bucket; party colors from `parties.json`, independent of alliance colors
- All political and election data stored in local JSON files — no API calls, no backend
- `last updated` footer for data freshness transparency
- Node.js script to extract SVG path data from the Wikimedia source file and generate `statePaths.ts`
- Dark theme aesthetic: `#0f0f0f` background, `#1a1a1a` cards, inspired by reference site

## Capabilities

### New Capabilities

- `political-map`: The interactive SVG map of India — state path rendering, alliance-based fill colors, hover/tap state, responsive scaling
- `state-info-card`: The floating tooltip (desktop) and bottom drawer (mobile) showing CM, party, year-in-power, Wikipedia link
- `vote-share-chart`: Hand-rolled SVG pie chart showing top-5 + Others from latest assembly election data
- `political-data`: JSON data model for governments, parties, alliances, elections, and states — the source of truth the UI reads from
- `svg-extraction-script`: One-time Node.js script that parses the Wikimedia India SVG and outputs `statePaths.ts`

### Modified Capabilities

_None — this is a new project._

## Delivery Phases

**Phase 1 — Data & Geometry**: Collect and verify all political data (governments, CMs, election results) for all 36 states/UTs in JSON format. Extract SVG map geometry from the Wikimedia source. Phase 1 is complete when the dataset is fully populated and the geometry is committed. No frontend code is written in Phase 1.

**Phase 2 — Frontend Build**: With a complete, stable dataset in hand, build the React application. The frontend is pure wiring — it reads the Phase 1 output and renders it. No data research happens in Phase 2.

## Impact

- **New dependencies**: `react`, `react-dom`, `@floating-ui/react`, `vite`, `tailwindcss`, `typescript`
- **No runtime backend** — purely static files, CDN/GitHub Pages friendly
- **Map geometry source**: Wikimedia Commons `India_states_and_union_territories_map.svg` (CC BY-SA 3.0) — requires attribution footer
- **Data maintenance**: JSON files must be manually updated when governments change; `last updated` footer signals freshness
- **Bundle target**: ~55 KB gzipped JS (no d3, no Recharts, no react-simple-maps)
