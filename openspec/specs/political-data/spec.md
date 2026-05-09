## ADDED Requirements

### Requirement: states.json schema
The system SHALL maintain a `states.json` file listing all 36 states and UTs with their identifiers.

Required fields per entry:
- `id` (string): two-letter ISO 3166-2:IN code (e.g., `"MH"`, `"LA"`)
- `name` (string): full English name (e.g., `"Maharashtra"`, `"Ladakh"`)
- `isUT` (boolean): true if Union Territory

#### Scenario: All 36 regions present
- **WHEN** `states.json` is loaded
- **THEN** it contains exactly 28 state entries and 8 UT entries

---

### Requirement: governments.json schema
The system SHALL maintain a `governments.json` file representing the current ruling government for each state/UT.

Required fields per entry:
- `stateId` (string): matches an `id` in `states.json`
- `rulingPartyId` (string): matches an `id` in `parties.json`
- `allianceTag` (`"NDA"` | `"INDIA"` | `"OTHER"`): drives map color — set editorially, may differ from the party's default alliance
- `inPowerSince` (string): ISO 8601 date of current CM's swearing-in (e.g., `"2023-05-20"`)
- `chiefMinister.name` (string): current CM's full name
- `chiefMinister.wikipediaUrl` (string): full Wikipedia URL for the CM
- `latestElectionId` (string | null): references an election file in `elections/`; null if no data available
- `lastUpdated` (string): ISO date the entry was last verified

#### Scenario: Entry exists for every state
- **WHEN** `governments.json` is loaded
- **THEN** every `id` in `states.json` has a corresponding `stateId` entry in `governments.json`

#### Scenario: allianceTag drives color, not party
- **WHEN** a party switches alliances mid-term
- **THEN** only `governments.json[stateId].allianceTag` needs updating; `parties.json` is unchanged

---

### Requirement: parties.json schema
The system SHALL maintain a `parties.json` file with display metadata for political parties.

Required fields per entry:
- `id` (string): short unique identifier (e.g., `"BJP"`, `"INC"`, `"DMK"`)
- `name` (string): full party name
- `abbreviation` (string): short label for pie chart legend (≤ 5 chars)
- `displayColor` (string): hex color for pie chart slices (visually distinct, not alliance color)

#### Scenario: Party color is unique
- **WHEN** `parties.json` is loaded
- **THEN** no two parties share the same `displayColor` value

---

### Requirement: elections/*.json schema
The system SHALL maintain election result files under `src/data/elections/`, named `{stateId}-{year}.json`.

Required fields:
- `id` (string): matches the filename without `.json` (e.g., `"KA-2023"`)
- `stateId` (string): matches a state id
- `year` (number): election year
- `results` (array): each entry has `partyId` (string) and `voteSharePct` (number, 0–100)
- Vote shares in `results` MUST sum to approximately 100 (within ±0.5 rounding tolerance)

#### Scenario: Election file is loadable by ID
- **WHEN** `governments.json` references `latestElectionId: "KA-2023"`
- **THEN** the file `elections/KA-2023.json` exists and is valid

#### Scenario: Vote shares sum to ~100
- **WHEN** an election file is loaded
- **THEN** the sum of all `voteSharePct` values is between 99.5 and 100.5

---

### Requirement: Last-updated footer
The system SHALL display a "Last updated: YYYY-MM-DD" footer on the page, sourced from a `lastUpdated` field in `governments.json` (the most recent date across all entries).

#### Scenario: Footer shows most recent update date
- **WHEN** the page loads
- **THEN** the footer displays the most recent `lastUpdated` date from any entry in `governments.json`
