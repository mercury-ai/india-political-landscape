## Context

The app currently renders India's political map as a raw SVG using hand-extracted bezier paths from `statePaths.ts`. The SVG is static (no zoom/pan), covers India only (no world context), and uses simplified paths that produce messy borders and blob-shaped islands. Small UTs like Andaman & Nicobar and Lakshadweep are either rendered as coarse ovals or shown as sidebar chips rather than mapped at their actual geographic positions.

The replacement is a React-Leaflet map with a tiled world background and India state boundaries from GeoJSON. This is an established pattern for political/choropleth maps and resolves all known rendering and interaction issues in one change.

## Goals / Non-Goals

**Goals:**
- World map with tiled geographic background (countries, terrain context)
- Accurate India state + UT boundaries from GeoJSON (including island territories at correct coordinates)
- Scroll-wheel zoom, pinch-to-zoom, click-drag pan — full gesture support
- Political alliance coloring preserved (existing `colors.ts` logic unchanged)
- Hover info card no longer disappears when mouse transits from state to card
- All existing data JSON unchanged; no new backend or API

**Non-Goals:**
- Updating stale political data (separate task, out of scope for this change)
- Satellite imagery or terrain tiles (dark vector tiles only)
- Offline / PWA support
- Server-side rendering

## Decisions

### D1: React-Leaflet over react-simple-maps or D3-geo

**Chosen**: `leaflet` + `react-leaflet`

Leaflet provides built-in scroll/pinch/drag gestures, a mature GeoJSON layer API (`<GeoJSON>`), and a plug-and-play tile layer system. react-simple-maps is lighter but requires manual D3-zoom wiring for gestures. D3-geo offers maximum control but is significantly more complex to integrate with React. For this app's needs, Leaflet hits the right point on the complexity/capability curve.

### D2: Carto Dark Matter tile layer

**Chosen**: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`

Free, no API key, CDN-hosted, and the dark aesthetic matches the existing `#0f0f0f` background. Attribution required (included in Leaflet attribution control). Alternative considered: Mapbox — requires API key and billing setup, ruled out.

### D3: GeoJSON source — bundle vs. CDN fetch

**Chosen**: Bundle as `public/india-states.geojson`

Fetching from an external CDN (e.g., raw GitHub) adds a network dependency and potential CORS/availability issues. Bundling the GeoJSON as a static public asset makes the app self-contained and fast (Vite serves it directly, no JS parse cost). File size: a simplified India states GeoJSON with ~500 vertices/state is ~400-600KB — acceptable for a data visualization app. The GeoJSON will be sourced from the Datameet India maps project (CC0 license) or equivalent open-data source.

Each GeoJSON feature's `properties` must contain a `ST_CODE` or similar field that maps to our state IDs (AP, GJ, WB, etc.). A `STATE_ID_MAP` lookup table will normalize any naming differences.

### D4: Hover tooltip — hide delay pattern

**Chosen**: `setTimeout`-based hide with card `mouseenter` cancellation

When `mouseleave` fires on a state feature, start a 200ms timer before clearing `hoveredStateId`. If the mouse enters the info card div within that window, cancel the timer. When the mouse leaves the card, clear immediately. This is the standard pattern for hover-activated floating UIs and requires no additional libraries.

### D5: Info card positioning — fixed screen position vs. floating-ui

**Chosen**: Fixed position derived from Leaflet `MouseEvent.containerPoint`

The current floating-ui approach anchors to an SVGPathElement, which doesn't exist in Leaflet. Instead, capture the `containerPoint` (pixel offset within the map container) from the Leaflet `mouseover` event and position the card as `position: fixed` at those coordinates with a 12px offset. Apply flip logic manually (if card would overflow right, render to the left; if overflow bottom, render above). This avoids re-adding floating-ui dependency complexity against a Leaflet layer.

### D6: Mobile interaction — click-to-drawer preserved

**Chosen**: Keep existing touch/click-to-drawer pattern

On touch devices, `isTouch` detection already routes to `StateDrawer`. Leaflet's `click` event on the GeoJSON layer replaces the SVG `onClick` handler. No change to the drawer component itself.

## Risks / Trade-offs

**Tile network dependency** → If Carto CDN is unreachable, map tiles won't load. Mitigation: The GeoJSON overlay (the actual political data) is bundled locally and will still render; only the background tiles fail. Add an `errorTileUrl` fallback or a visible offline message.

**GeoJSON state ID mismatch** → The GeoJSON source may use full state names or different codes (e.g., `"Jammu & Kashmir"` vs `"JK"`). Mitigation: Build a `STATE_ID_MAP` lookup during the GeoJSON load step; validate all 36 states/UTs are matched before shipping.

**Bundle size increase** → Adding leaflet (~150KB), react-leaflet (~30KB), and the GeoJSON (~500KB) increases initial load. Mitigation: GeoJSON is fetched at runtime (not in the JS bundle); Leaflet CSS and JS can be code-split. Acceptable trade-off for the UX gains.

**Leaflet CSS conflicts** → Leaflet requires its own CSS (`leaflet/dist/leaflet.css`) which sets global styles. Mitigation: Import it once in `main.tsx`; audit for conflicts with Tailwind reset.

## Migration Plan

1. Install `leaflet`, `react-leaflet`, `@types/leaflet`
2. Source and validate India states GeoJSON → place at `public/india-states.geojson`
3. Build `WorldMap` component (replaces `IndiaMap`)
4. Wire hover/click events with hide-delay tooltip logic
5. Delete `statePaths.ts` and `SmallUTChips.tsx`
6. Update `App.tsx` to mount `WorldMap` instead of `IndiaMap`
7. Fix WB `allianceTag` data bug
8. Visual QA: verify all 36 states/UTs render and are clickable

Rollback: The old `IndiaMap` + `statePaths.ts` approach can be restored from git. No database or infrastructure changes.

## Open Questions

- **GeoJSON state ID field name**: Confirm which property key in the chosen GeoJSON source maps to our 2-letter state codes (need to inspect the file). Could be `ST_CODE`, `state_code`, `id`, etc.
- **Initial zoom level**: `zoom: 5` shows India at comfortable scale with surrounding countries visible. Needs visual confirmation — may need adjustment to `4` or `4.5` to show more world context.
