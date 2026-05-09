## ADDED Requirements

### Requirement: World map renders as Leaflet instance
The system SHALL render a Leaflet map instance as the primary map component, replacing the static SVG. The map SHALL display a world tile layer as background and India state GeoJSON as an interactive overlay.

#### Scenario: Map mounts with world tile layer
- **WHEN** the page loads
- **THEN** a Leaflet map is mounted with the Carto Dark Matter tile layer visible, showing the world at the initial viewport

#### Scenario: India is centered on initial load
- **WHEN** the page loads
- **THEN** the map is centered at approximately lat 22, lng 78 with zoom level 5, showing India prominently with surrounding countries visible

#### Scenario: Map fills the available layout area
- **WHEN** the Leaflet map container is mounted
- **THEN** it fills 100% of the parent container's width and height, consistent with the previous SVG behavior

---

### Requirement: India state GeoJSON overlay with political coloring
The system SHALL load India state boundaries from a bundled GeoJSON file and render each feature as a filled, interactive Leaflet GeoJSON layer using the same alliance-color mapping as the existing `colors.ts`.

#### Scenario: All 36 states and UTs render from GeoJSON
- **WHEN** the GeoJSON loads successfully
- **THEN** all 28 states and 8 UTs are rendered as Leaflet polygon features on the map

#### Scenario: States are colored by alliance
- **WHEN** a GeoJSON feature is rendered
- **THEN** its fill color matches the `allianceTag` of the corresponding state in `governments.json` via `allianceToColor()`

#### Scenario: Island territories appear at correct geographic coordinates
- **WHEN** the GeoJSON is rendered
- **THEN** Andaman & Nicobar Islands and Lakshadweep appear at their real geographic positions, not as summary chips or simplified ovals

---

### Requirement: Full zoom and pan gesture support
The system SHALL support zoom and pan via scroll wheel, pinch-to-zoom (trackpad and touch screen), and click-drag. These are provided natively by Leaflet and SHALL not be disabled.

#### Scenario: Scroll wheel zooms the map
- **WHEN** the user scrolls the mouse wheel over the map
- **THEN** the map zooms in or out centered on the cursor position

#### Scenario: Pinch-to-zoom works on trackpad
- **WHEN** the user performs a pinch gesture on a laptop trackpad
- **THEN** the map zooms in or out smoothly

#### Scenario: Click-drag pans the map
- **WHEN** the user clicks and drags on the map background
- **THEN** the map pans in the direction of the drag

---

### Requirement: Tile layer attribution
The system SHALL display the Carto tile layer attribution as required by the Carto usage terms.

#### Scenario: Attribution is visible
- **WHEN** the map is rendered
- **THEN** the Leaflet attribution control shows the Carto and OpenStreetMap attribution text in the bottom-right corner
