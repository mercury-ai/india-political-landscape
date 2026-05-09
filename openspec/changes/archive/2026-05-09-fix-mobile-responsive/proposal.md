## Why

On iOS Safari (tested on iPhone 13), tapping a state on the map does not show the state info drawer — it appears hidden below the visible viewport due to iOS Safari's `100vh` bug, where `min-h-screen` makes the page taller than the visible area, and `position: fixed; bottom: 0` anchors the drawer to the layout bottom rather than the visual bottom. Users only discover the drawer by accidentally scrolling, which is a broken experience.

## What Changes

- Replace `min-h-screen` with `h-dvh` on the app root to use the dynamic viewport height (excludes browser chrome on iOS), preventing the page from overflowing the visible area
- Adjust the Leaflet map's initial zoom level to be responsive to screen size — smaller on mobile so India fills the viewport better
- Add iPhone home indicator safe area inset padding to the StateDrawer so content isn't hidden behind the bottom bar
- Hide the MapLegend when the StateDrawer is open on mobile to avoid overlap

## Capabilities

### New Capabilities

- `mobile-layout`: Mobile viewport and layout correctness — `h-dvh` root, safe area insets, responsive map zoom, and legend visibility when drawer is open

### Modified Capabilities

- `state-info-card`: Touch interaction behavior — the drawer must appear within the visible viewport on iOS Safari (currently broken)

## Impact

- `src/App.tsx`: Root div class change (`min-h-screen` → `h-dvh`), pass drawer-open state to MapLegend, responsive zoom prop to WorldMap
- `src/components/map/WorldMap.tsx`: Responsive initial zoom based on window width
- `src/components/map/MapLegend.tsx`: Accept `hidden` prop to hide when drawer is open
- `src/components/card/StateDrawer.tsx`: Add bottom safe area inset padding
- No dependency changes, no breaking changes to external APIs
