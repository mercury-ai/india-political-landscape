## 1. Fix iOS Viewport Height

- [x] 1.1 In `src/App.tsx`, change root div class from `min-h-screen` to `h-dvh`

## 2. Fix StateDrawer Safe Area

- [x] 2.1 In `src/components/card/StateDrawer.tsx`, add `paddingBottom: 'env(safe-area-inset-bottom, 0px)'` to the scrollable content `div` (the one with `overflow-y-auto`)

## 3. Responsive Map Zoom

- [x] 3.1 In `src/components/map/WorldMap.tsx`, add `zoomSnap={0.5}` prop to `MapContainer` to allow half-step zoom levels
- [x] 3.2 In `src/components/map/WorldMap.tsx`, replace the hardcoded `zoom={5}` with a value derived from `window.innerWidth`: `< 640` → `4`, `640–1024` → `4.5`, `> 1024` → `5`

## 4. Hide MapLegend When Drawer Is Open

- [x] 4.1 In `src/App.tsx`, pass `drawerOpen` state as a `hidden` prop to `MapLegend`
- [x] 4.2 In `src/components/map/MapLegend.tsx`, accept a `hidden?: boolean` prop and return `null` when `hidden` is true
