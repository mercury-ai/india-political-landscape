## ADDED Requirements

### Requirement: Map renders all Indian states and UTs
The system SHALL render a single SVG-based political map of India containing all 28 states and 8 union territories as individually interactive `<path>` elements. The map SHALL use GoI-compliant boundaries sourced from the Wikimedia Commons India states and union territories SVG.

#### Scenario: All 36 regions visible on load
- **WHEN** the page loads
- **THEN** all 36 states and UTs are rendered as filled SVG paths within a single `<svg>` element

#### Scenario: Map scales to viewport
- **WHEN** the browser viewport changes width
- **THEN** the map SVG scales responsively using `viewBox` and `width: 100%` without distortion or clipping

---

### Requirement: Alliance-based fill color
The system SHALL fill each state/UT path with a color determined by the `allianceTag` field in `governments.json`:
- `NDA` → `#f97316` (saffron-orange)
- `INDIA` → `#2563eb` (blue)
- `OTHER` → `#e5e7eb` (neutral gray)

#### Scenario: NDA-ruled state is saffron
- **WHEN** a state's `allianceTag` is `"NDA"`
- **THEN** its SVG path fill is `#f97316`

#### Scenario: INDIA-ruled state is blue
- **WHEN** a state's `allianceTag` is `"INDIA"`
- **THEN** its SVG path fill is `#2563eb`

#### Scenario: Unaligned state is neutral
- **WHEN** a state's `allianceTag` is `"OTHER"`
- **THEN** its SVG path fill is `#e5e7eb`

---

### Requirement: UTs inherit central government color
Union Territories without a state legislature SHALL display the same alliance color as the central government, not a separate color.

#### Scenario: UT color matches central govt
- **WHEN** a UT has no elected legislature (e.g., Ladakh, Chandigarh)
- **THEN** its fill color reflects the `allianceTag` of the party ruling at the Centre, as set in its `governments.json` entry

---

### Requirement: Hover highlight on desktop
The system SHALL highlight a state's border and increase its fill opacity when a pointer device hovers over it.

#### Scenario: State highlights on hover
- **WHEN** a mouse pointer enters a state's `<path>` on a device with `pointer: fine`
- **THEN** the state's stroke color changes to `#ffffff`, stroke weight increases to 1.5px, and fill opacity increases to 0.9

#### Scenario: State un-highlights on pointer leave
- **WHEN** the mouse pointer leaves the state's `<path>`
- **THEN** the state's stroke and opacity return to their default values with a CSS transition of `0.15s`

---

### Requirement: Map legend
The system SHALL display a static legend showing the three alliance color swatches and their labels.

#### Scenario: Legend is always visible
- **WHEN** the map is rendered
- **THEN** a legend with NDA (saffron), INDIA (blue), and Other (gray) swatches is visible in the bottom-left of the map area
