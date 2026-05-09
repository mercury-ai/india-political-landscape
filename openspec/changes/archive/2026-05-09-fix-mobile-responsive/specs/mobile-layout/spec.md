## ADDED Requirements

### Requirement: App root uses dynamic viewport height
The application root container SHALL use `h-dvh` (100dvh) instead of `min-h-screen` (100vh) to prevent the page from overflowing the visible viewport on iOS Safari, where 100vh includes hidden browser chrome.

#### Scenario: No page scroll on iOS Safari
- **WHEN** the app loads on an iOS Safari browser (iPhone 13 or later)
- **THEN** the page SHALL NOT be scrollable — the root container height equals the visible viewport height exactly

#### Scenario: Layout fills viewport on Android Chrome
- **WHEN** the app loads on Android Chrome
- **THEN** the root container SHALL fill the full visible viewport height with no scroll

---

### Requirement: StateDrawer respects iPhone home indicator
The StateDrawer bottom sheet SHALL add bottom padding equal to `env(safe-area-inset-bottom, 0px)` so its scrollable content is not hidden behind the iPhone home indicator bar.

#### Scenario: Content not clipped by home bar on iPhone
- **WHEN** the StateDrawer is open on an iPhone with a home indicator (iPhone X and later)
- **THEN** the bottom of the scrollable content area SHALL have at least 34px clearance from the screen edge

#### Scenario: No extra padding on Android
- **WHEN** the StateDrawer is open on an Android device with no system gesture bar
- **THEN** `env(safe-area-inset-bottom, 0px)` SHALL resolve to 0px and add no extra space

---

### Requirement: Map initial zoom is responsive to screen width
The Leaflet map SHALL use an initial zoom level appropriate to the screen width so India is well-framed on small screens.

#### Scenario: Small screen zoom
- **WHEN** the map loads on a screen narrower than 640px
- **THEN** the initial zoom level SHALL be 4

#### Scenario: Medium screen zoom
- **WHEN** the map loads on a screen between 640px and 1024px wide
- **THEN** the initial zoom level SHALL be 4.5

#### Scenario: Large screen zoom
- **WHEN** the map loads on a screen wider than 1024px
- **THEN** the initial zoom level SHALL be 5

---

### Requirement: MapLegend is hidden when StateDrawer is open
The MapLegend SHALL NOT be visible while the StateDrawer is open, to prevent overlap between the legend and the drawer on mobile.

#### Scenario: Legend hides when drawer opens
- **WHEN** the StateDrawer opens on a touch device
- **THEN** the MapLegend SHALL be removed from the viewport immediately

#### Scenario: Legend restores when drawer closes
- **WHEN** the StateDrawer closes
- **THEN** the MapLegend SHALL reappear
