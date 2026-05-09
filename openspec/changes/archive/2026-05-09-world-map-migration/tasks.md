## 1. Dependencies and GeoJSON

- [x] 1.1 Install `leaflet`, `react-leaflet`, and `@types/leaflet` via npm
- [x] 1.2 Download India states GeoJSON (Datameet or equivalent open-data CC0 source) and place at `public/india-states.geojson`
- [x] 1.3 Inspect the GeoJSON to identify the state ID property key (e.g., `ST_CODE`, `state_code`) and verify all 36 states/UTs are present
- [x] 1.4 Build a `STATE_ID_MAP` lookup in a new file (e.g., `src/lib/geoIdMap.ts`) that normalizes GeoJSON property values to the 2-letter state codes used by `governments.json`

## 2. Fix Data Bug

- [x] 2.1 In `src/data/governments.json`, change West Bengal (`WB`) entry `allianceTag` from `"OTHER"` to `"INDIA"`

## 3. WorldMap Component

- [x] 3.1 Import `leaflet/dist/leaflet.css` in `src/main.tsx`
- [x] 3.2 Create `src/components/map/WorldMap.tsx` — a React-Leaflet `<MapContainer>` with `center={[22, 78]}`, `zoom={5}`, `style={{ height: '100%', width: '100%' }}`
- [x] 3.3 Add the Carto Dark Matter `<TileLayer>` to `WorldMap.tsx` with correct URL and attribution string
- [x] 3.4 Add a `<GeoJSON>` layer that fetches `india-states.geojson` at runtime (via `fetch` in `useEffect`), resolves each feature's state ID via `STATE_ID_MAP`, and sets fill color via `allianceToColor()` in the `style` callback
- [x] 3.5 Implement hover highlight in the GeoJSON layer: `onEachFeature` adds `mouseover`/`mouseout` event handlers that call `setStyle` to toggle the highlighted stroke and opacity
- [x] 3.6 Wire `onEachFeature` `mouseover` to fire `onStateHover(stateId, containerPoint)` and `mouseout` to start the 200ms hide timer (see Task 4)
- [x] 3.7 Wire `onEachFeature` `click` to fire `onStateClick(stateId)` for the mobile drawer flow

## 4. Hover Tooltip (Hide-Delay Logic)

- [x] 4.1 In `App.tsx`, replace the `cardAnchor` SVGPathElement ref with a `cardPos` state: `{ x: number; y: number } | null`
- [x] 4.2 Add a `hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)` to `App.tsx`
- [x] 4.3 Update `handleStateHover` to: on enter — clear any pending hide timer, set `cardPos` from the Leaflet `containerPoint`, load `cardViewModel`; on leave — start a 200ms `setTimeout` that sets `cardViewModel` and `cardPos` to null
- [x] 4.4 Add `onMouseEnter` and `onMouseLeave` props to `StateInfoCard` to cancel/restart the hide timer: entering the card clears `hideTimerRef`; leaving the card clears `cardViewModel` immediately

## 5. StateInfoCard Positioning

- [x] 5.1 Update `StateInfoCard` props: replace `anchorEl: SVGPathElement | null` with `pos: { x: number; y: number } | null`
- [x] 5.2 Replace `useFloating` positioning logic with inline `position: fixed; left: pos.x + 12; top: pos.y` style, with manual overflow guards: if `pos.x + 12 + 256 > window.innerWidth`, shift card to `pos.x - 12 - 256`; if `pos.y + cardHeight > window.innerHeight`, shift card up
- [x] 5.3 Remove `@floating-ui/react` import from `StateInfoCard.tsx` (and remove the package if unused elsewhere)

## 6. App Wiring

- [x] 6.1 In `App.tsx`, replace the `lazy(() => import('./components/map/IndiaMap'))` import with `WorldMap`
- [x] 6.2 Update `App.tsx` JSX: replace `<IndiaMap>` with `<WorldMap>`, passing `onStateHover`, `onStateClick`, `hoveredStateId`
- [x] 6.3 Update the `StateInfoCard` render in `App.tsx` to pass `pos={cardPos}` instead of `anchorEl={cardAnchor.current}`

## 7. Cleanup

- [x] 7.1 Delete `src/map/statePaths.ts`
- [x] 7.2 Delete `src/components/map/SmallUTChips.tsx`
- [x] 7.3 Delete `src/components/map/IndiaMap.tsx`
- [x] 7.4 Remove `SmallUTChips` import from any remaining files

## 8. QA

- [x] 8.1 Run `npm run dev` and verify all 36 states/UTs render with correct alliance colors
- [x] 8.2 Verify Andaman & Nicobar Islands and Lakshadweep appear at correct geographic positions
- [x] 8.3 Verify scroll-wheel zoom, pinch-to-zoom (trackpad), and click-drag pan all work
- [x] 8.4 Hover over a state → move mouse to info card → click the Wikipedia CM link — verify the card does not disappear
- [x] 8.5 Verify West Bengal shows INDIA alliance color (blue), not gray
- [x] 8.6 Test on a simulated touch device (Chrome DevTools) — verify state tap opens the drawer
- [x] 8.7 Resize the browser window to various sizes — verify map fills the layout at all sizes
- [x] 8.8 Run `npm run build` and confirm no TypeScript errors
