## ADDED Requirements

### Requirement: SVG pie chart rendered without a chart library
The system SHALL render vote-share data as a pie chart using hand-authored SVG `<path>` elements with arc math computed in TypeScript. No external chart library (Recharts, Chart.js, Visx, d3) SHALL be used.

#### Scenario: Pie chart renders from election data
- **WHEN** the info card/drawer is shown for a state with a `latestElectionId`
- **THEN** a pie chart is rendered showing the vote-share distribution from that election

#### Scenario: No chart if no election data
- **WHEN** a state has no `latestElectionId` in `governments.json`
- **THEN** the info card shows a "No election data available" message instead of a chart

---

### Requirement: Top-5 parties plus Others bucketing
The system SHALL show the top 5 parties by `voteSharePct` as individual slices, and sum all remaining parties into a single "Others" slice.

#### Scenario: More than 5 parties in election results
- **WHEN** an election result has 8 parties
- **THEN** the pie shows 5 named slices + 1 "Others" slice totalling 6 slices

#### Scenario: 5 or fewer parties in election results
- **WHEN** an election result has 4 parties
- **THEN** the pie shows 4 named slices with no "Others" slice

#### Scenario: Micro-parties collapsed
- **WHEN** a party would be in the top 5 but has less than 0.5% vote share
- **THEN** it is collapsed into "Others" regardless of rank

---

### Requirement: Party-specific colors independent of alliance
Each pie slice SHALL use the `displayColor` from `parties.json` for that party, NOT the alliance map colors. "Others" slice SHALL use `#6b7280` (gray-500).

#### Scenario: INC slice is Congress color in a state chart
- **WHEN** INC appears in a state's pie chart
- **THEN** its slice uses INC's `displayColor` from `parties.json` (not the INDIA alliance blue `#2563eb`)

#### Scenario: Two parties from the same alliance have distinct slice colors
- **WHEN** two alliance partners both appear in the top 5
- **THEN** each slice has its own distinct `displayColor` from `parties.json`

---

### Requirement: Pie chart includes a legend
The pie chart SHALL include a compact legend listing each visible party's abbreviation and vote share percentage.

#### Scenario: Legend matches slices
- **WHEN** the pie chart is rendered with 5 parties + Others
- **THEN** the legend lists 6 entries, each with a color swatch, party abbreviation, and vote share to one decimal place (e.g., "BJP 36.2%")
