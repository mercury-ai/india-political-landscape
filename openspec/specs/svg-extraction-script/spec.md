## ADDED Requirements

### Requirement: Script extracts path data from Wikimedia SVG
The system SHALL include a Node.js script at `scripts/extract-svg-paths.ts` that reads the Wikimedia India SVG file and outputs `src/map/statePaths.ts` containing a typed map of `stateId → SVG path "d" string`.

#### Scenario: Script produces valid TypeScript output
- **WHEN** the script is run with `npx tsx scripts/extract-svg-paths.ts`
- **THEN** `src/map/statePaths.ts` is created or overwritten with a valid TypeScript `Record<string, string>` export named `STATE_PATHS`

#### Scenario: All 36 states are present in output
- **WHEN** the script completes successfully
- **THEN** `STATE_PATHS` contains exactly 36 entries, one per state/UT id from `states.json`

---

### Requirement: Script uses a mapping table for ID normalization
The Wikimedia SVG uses Inkscape-generated path IDs (e.g., `path9482`) rather than state codes. The script SHALL use a committed mapping file `scripts/wikimedia-id-map.json` (format: `{ "path9482": "MH", ... }`) to normalize IDs to ISO state codes.

#### Scenario: Mapping file resolves all paths
- **WHEN** the script runs and the mapping file is present
- **THEN** every `<path>` element in the SVG that represents a state/UT is mapped to a two-letter state code with no unmapped entries

#### Scenario: Unknown path ID is reported, not silently skipped
- **WHEN** the SVG contains a `<path>` not present in the mapping file
- **THEN** the script logs a warning with the unknown ID and continues (non-fatal)

---

### Requirement: Source SVG is committed to the repository
The Wikimedia India SVG source file SHALL be committed at `scripts/india-states-source.svg` to ensure reproducibility of the extraction step.

#### Scenario: Script is reproducible from committed files
- **WHEN** a developer clones the repository and runs the extraction script
- **THEN** the output `statePaths.ts` is byte-for-byte identical to the committed version
