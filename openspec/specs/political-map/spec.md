# Political Map

The political-map capability provides the core interactive map of India where each state and UT is colored by the political alliance currently in power. It defines the rendering contract (Leaflet + GeoJSON), color scheme, hover interactions, and legend.

## Requirements

### Requirement: Map renders all Indian states and UTs
The system SHALL render a Leaflet-based political map of India containing all 28 states and 8 union territories as individually interactive GeoJSON polygon features. The map SHALL use boundaries sourced from a bundled India states GeoJSON file (open-data, CC0 license).

#### Scenario: All 36 regions visible on load
- **WHEN** the page loads and the GeoJSON is fetched
- **THEN** all 36 states and UTs are rendered as filled Leaflet GeoJSON polygon features on the world map

#### Scenario: Map scales to viewport
- **WHEN** the browser viewport changes size
- **THEN** the Leaflet map container scales responsively using CSS `width: 100%; height: 100%` without distortion

---

### Requirement: Alliance-based fill color
The system SHALL fill each state/UT GeoJSON feature with a color determined by the `allianceTag` field in `governments.json`:
- `NDA` → `#f97316` (saffron-orange)
- `INDIA` → `#2563eb` (blue)
- `OTHER` → `#6b7280` (neutral gray)

#### Scenario: NDA-ruled state is saffron
- **WHEN** a state's `allianceTag` is `"NDA"`
- **THEN** its GeoJSON feature fill is `#f97316`

#### Scenario: INDIA-ruled state is blue
- **WHEN** a state's `allianceTag` is `"INDIA"`
- **THEN** its GeoJSON feature fill is `#2563eb`

#### Scenario: Unaligned state is neutral
- **WHEN** a state's `allianceTag` is `"OTHER"`
- **THEN** its GeoJSON feature fill is `#6b7280`

---

### Requirement: UTs inherit central government color
Union Territories without a state legislature SHALL display the same alliance color as the central government, not a separate color.

#### Scenario: UT color matches central govt
- **WHEN** a UT has no elected legislature (e.g., Ladakh, Chandigarh)
- **THEN** its fill color reflects the `allianceTag` of the party ruling at the Centre, as set in its `governments.json` entry

---

### Requirement: Hover highlight on desktop
The system SHALL highlight a state's border and increase its fill opacity when a pointer device hovers over its GeoJSON feature.

#### Scenario: State highlights on hover
- **WHEN** a mouse pointer enters a state's GeoJSON polygon on a device with `pointer: fine`
- **THEN** the state's stroke color changes to `#ffffff`, stroke weight increases to 2px, and fill opacity increases to 0.9

#### Scenario: State un-highlights on pointer leave
- **WHEN** the mouse pointer leaves the state's GeoJSON polygon
- **THEN** the stroke and opacity return to their default values

---

### Requirement: Map legend
The system SHALL display a static legend showing the three alliance color swatches and their labels. The legend SHALL render as a Leaflet custom control or as an absolutely-positioned React overlay — not as part of the GeoJSON layer.

#### Scenario: Legend is always visible
- **WHEN** the map is rendered
- **THEN** a legend with NDA (saffron), INDIA (blue), and Other (gray) swatches is visible on the map
