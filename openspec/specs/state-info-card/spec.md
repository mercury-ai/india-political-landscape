# State Info Card

The state-info-card capability defines the floating info panel (desktop) and bottom drawer (mobile) that surface political details for the hovered/tapped state — name, alliance, ruling party, Chief Minister, and election vote share.

## Requirements

### Requirement: Desktop floating info card on hover
On devices with a fine pointer (mouse), the system SHALL display a floating info card when hovering over a state. The card SHALL be positioned using fixed CSS coordinates derived from the Leaflet `mouseover` event's `containerPoint`, offset 12px to the right. The card SHALL apply manual flip logic to avoid viewport overflow.

#### Scenario: Card appears on state hover
- **WHEN** a mouse pointer enters a state polygon on desktop
- **THEN** a floating info card appears near the cursor within 150ms containing the state's name, ruling party/alliance, CM name, and in-power-since year

#### Scenario: Card repositions at viewport edge
- **WHEN** the cursor is near the right or bottom viewport edge
- **THEN** the floating card repositions to the left of the cursor or shifts upward to remain fully visible

#### Scenario: Card persists during mouse transit
- **WHEN** the pointer leaves the state polygon
- **THEN** the card remains visible for at least 200ms (see hover-tooltip spec)

---

### Requirement: Mobile bottom drawer on tap
On touch devices (`pointer: coarse`), the system SHALL display a bottom sheet drawer when a state is tapped. The drawer SHALL slide up from the bottom of the **visible viewport** (not the layout viewport). The app root MUST use `h-dvh` so that `position: fixed; bottom: 0` anchors to the visible bottom on iOS Safari.

#### Scenario: Drawer opens on state tap
- **WHEN** a user taps a state on a touch device
- **THEN** the bottom drawer slides up with `transform: translateY(0)` transition `0.3s cubic-bezier(0.32, 0.72, 0, 1)` and displays the state's info **within the visible viewport**

#### Scenario: Drawer is visible without scrolling on iOS Safari
- **WHEN** a user taps a state on an iPhone running iOS Safari
- **THEN** the bottom drawer SHALL be fully visible without the user needing to scroll the page

#### Scenario: Drawer closes on background tap
- **WHEN** the user taps outside the drawer or on the map background
- **THEN** the drawer slides back down and is hidden

#### Scenario: Drawer is scrollable for long content
- **WHEN** the drawer content exceeds 60% of the viewport height
- **THEN** the content area scrolls independently without scrolling the page

---

### Requirement: Info card content — state name and alliance
The info card/drawer SHALL display the state's full name and current ruling alliance prominently.

#### Scenario: State name is displayed
- **WHEN** the info card is shown for any state
- **THEN** the full state name (e.g., "Maharashtra") is the primary heading

#### Scenario: Alliance name is displayed
- **WHEN** the info card is shown
- **THEN** the ruling alliance name (e.g., "NDA", "INDIA Alliance", "Regional") is displayed with its associated color

---

### Requirement: Info card content — Chief Minister
The info card/drawer SHALL display the current Chief Minister's name as a tappable/clickable link that opens their Wikipedia page in a new tab.

#### Scenario: CM name is a Wikipedia link
- **WHEN** the info card is displayed
- **THEN** the CM's name is rendered as an `<a>` element with `href` set to `chiefMinister.wikipediaUrl` and `target="_blank" rel="noopener noreferrer"`

#### Scenario: In-power-since year is shown
- **WHEN** the info card is displayed
- **THEN** the year portion of `inPowerSince` ISO date is displayed (e.g., "Since 2023")

---

### Requirement: Info card content — ruling party
The info card SHALL display the name of the ruling party (not just the alliance) alongside the CM's name.

#### Scenario: Ruling party name shown
- **WHEN** the info card is displayed
- **THEN** the `rulingPartyId` is resolved to the party's full name from `parties.json` and displayed
