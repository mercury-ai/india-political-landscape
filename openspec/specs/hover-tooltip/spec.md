# Hover Tooltip

The hover-tooltip capability ensures the floating state info card stays visible long enough for the user to interact with its contents (e.g., click the Wikipedia link for a Chief Minister), even when the cursor moves between the state polygon and the card itself.

## Requirements

### Requirement: Hover card persists while mouse transits to it
The system SHALL keep the state info card visible for at least 200ms after the mouse leaves a state feature, allowing the user to move the mouse to the card and interact with its links. If the mouse enters the card within this window, the card SHALL remain visible indefinitely until the mouse leaves the card.

#### Scenario: Card stays visible during mouse transit
- **WHEN** the mouse leaves a state feature on desktop
- **THEN** the info card remains visible for at least 200ms before hiding

#### Scenario: Card stays visible when mouse enters it
- **WHEN** the mouse enters the info card within 200ms of leaving a state
- **THEN** the card remains visible and does not hide

#### Scenario: Card hides when mouse leaves it
- **WHEN** the mouse leaves the info card without clicking a link
- **THEN** the card hides immediately

#### Scenario: Wikipedia link is clickable
- **WHEN** the info card is visible and the user moves the mouse to the CM Wikipedia link
- **THEN** the link is reachable and clickable without the card disappearing

---

### Requirement: Hover card positioned near the hovered state
The system SHALL position the floating info card near the Leaflet mouse event's container coordinates, offset 12px to the right of the cursor. The card SHALL automatically reposition if it would overflow the viewport edges.

#### Scenario: Card appears to the right of cursor
- **WHEN** a state is hovered and there is sufficient space to the right
- **THEN** the info card appears 12px to the right of the cursor position

#### Scenario: Card flips left when near right viewport edge
- **WHEN** a state near the right edge of the screen is hovered
- **THEN** the info card appears to the left of the cursor instead

#### Scenario: Card shifts up when near bottom viewport edge
- **WHEN** a state near the bottom of the viewport is hovered
- **THEN** the info card shifts upward to remain fully within the viewport
