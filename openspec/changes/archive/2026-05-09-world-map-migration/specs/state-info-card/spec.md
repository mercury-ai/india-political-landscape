## MODIFIED Requirements

### Requirement: Desktop floating info card on hover
On devices with a fine pointer (mouse), the system SHALL display a floating info card when hovering over a state. The card SHALL be positioned using fixed CSS coordinates derived from the Leaflet `mouseover` event's `containerPoint`, offset 12px to the right. The card SHALL apply manual flip logic to avoid viewport overflow. The previous `@floating-ui/react` SVG-anchor positioning is removed.

#### Scenario: Card appears on state hover
- **WHEN** a mouse pointer enters a state polygon on desktop
- **THEN** a floating info card appears near the cursor within 150ms containing the state's name, ruling party/alliance, CM name, and in-power-since year

#### Scenario: Card repositions at viewport edge
- **WHEN** the cursor is near the right or bottom viewport edge
- **THEN** the floating card repositions to the left of the cursor or shifts upward to remain fully visible

#### Scenario: Card persists during mouse transit
- **WHEN** the pointer leaves the state polygon
- **THEN** the card remains visible for at least 200ms (see hover-tooltip spec)
