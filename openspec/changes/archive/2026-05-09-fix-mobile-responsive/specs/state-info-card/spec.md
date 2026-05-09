## MODIFIED Requirements

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
