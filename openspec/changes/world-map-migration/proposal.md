## Why

The current map is a hand-extracted SVG of India with messy state borders, islands reduced to rough ovals, and no zoom/pan. Switching to a Leaflet-based world map with GeoJSON state boundaries fixes all of these problems in one architectural move and gives users global geographic context for India's political landscape.

## What Changes

- **BREAKING**: Remove `src/map/statePaths.ts` (hand-extracted SVG bezier paths, no longer needed)
- **BREAKING**: Remove `src/components/map/SmallUTChips.tsx` (all UTs render on the geo map natively)
- **BREAKING**: Replace `src/components/map/IndiaMap.tsx` SVG approach with a React-Leaflet `WorldMap` component
- Add `leaflet` + `react-leaflet` dependencies
- Bundle India state-level GeoJSON (simplified, ~500KB) as a static asset
- Carto Dark Matter tile layer for world map background (free, no API key)
- Full zoom/pan with scroll-wheel, pinch-to-zoom, and click-drag pan
- Fix hover tooltip: info card no longer disappears when mouse moves from state to card
- Fix data bug: West Bengal `allianceTag` corrected from `"OTHER"` to `"INDIA"`

## Capabilities

### New Capabilities

- `world-map`: Leaflet-based world map with India state GeoJSON overlay, political alliance coloring, zoom/pan gesture support, and Carto Dark Matter tile background
- `hover-tooltip`: Persistent hover card that stays visible when mouse moves from a state to the info card, enabling Wikipedia link clicks

### Modified Capabilities

- `political-map`: Core map interaction (hover → info card, click → drawer) moves from SVG event handlers to Leaflet GeoJSON layer events — same UX contract, different rendering engine
- `state-info-card`: No behavior changes; positioning adapts from floating-ui SVG anchor to a fixed screen position derived from the Leaflet mouse event

## Impact

- **Removed**: `src/map/statePaths.ts`, `src/components/map/SmallUTChips.tsx`
- **Replaced**: `src/components/map/IndiaMap.tsx` (SVG → Leaflet)
- **New deps**: `leaflet`, `react-leaflet`, `@types/leaflet`
- **New asset**: `public/india-states.geojson` (or `src/data/india-states.geojson`)
- **Unchanged**: All `src/data/` JSON files, `StateInfoCard.tsx`, `StateDrawer.tsx`, `MapLegend.tsx`, `Header.tsx`, `Footer.tsx`, `colors.ts`, `types.ts`, `dataLoader.ts`
- **Data fix**: `src/data/governments.json` — WB entry `allianceTag: "INDIA"`
