## Context

The app uses a full-screen map layout (React-Leaflet) with a fixed header and a bottom-sheet drawer (`StateDrawer`) for touch devices. The root layout uses `min-h-screen` (= `100vh`) which on iOS Safari is calculated to include browser chrome (URL bar + toolbar), making the page body taller than the visible area by ~84px on iPhone 13. Since the page is scrollable, `position: fixed; bottom: 0` on `StateDrawer` anchors to the layout viewport bottom — off-screen. Users can't see the drawer on tap.

Tailwind 3.4.17 (current) supports `h-dvh` / `min-h-dvh` natively. No new dependencies are needed.

## Goals / Non-Goals

**Goals:**
- Fix StateDrawer appearing off-screen on iOS Safari
- Prevent the page from being scrollable (map should fill exactly the visible viewport)
- Account for iPhone home indicator (safe area inset) in the drawer
- Better initial map zoom on small screens
- Hide MapLegend when drawer is open to avoid overlap

**Non-Goals:**
- Tablet-specific layout optimizations
- Landscape orientation redesign (drawer still used, just smaller)
- PWA / installable app behaviour
- Any changes to desktop behaviour

## Decisions

### 1. `h-dvh` over `min-h-dvh` on the root div

`h-dvh` sets the root to exactly the dynamic viewport height. `min-h-dvh` would allow the div to grow if content is taller — we explicitly don't want that (no scroll).

**Alternative considered:** CSS `height: 100svh` (small viewport height, always excludes chrome). Rejected because `svh` is the most conservative value — it stays at the small-chrome size even when chrome hides, so the map would have a gap at the bottom when the user scrolls to hide the address bar. `dvh` tracks the actual current visible size, which is the right behaviour for a full-screen map.

### 2. Safe area insets via inline CSS `env()` rather than Tailwind plugin

The iOS home indicator is ~34px. Tailwind doesn't have built-in `pb-safe` without a plugin. We use `paddingBottom: 'env(safe-area-inset-bottom, 0px)'` inline on the drawer's scrollable content — this is zero on Android/desktop and correct on iPhone, with no new dependencies.

**Alternative considered:** `@tailwindcss/nesting` + custom CSS variable. Rejected as overkill for a single use.

### 3. Responsive initial zoom via `window.innerWidth` at mount

Leaflet's `zoom` prop sets the initial zoom. We read `window.innerWidth` once at component mount (inside `useEffect` or via a simple utility) to pick zoom level:
- `< 640px` → zoom 4
- `640–1024px` → zoom 4.5 (Leaflet rounds to nearest integer; use `zoomSnap={0.5}` to allow half-steps)
- `> 1024px` → zoom 5

**Alternative considered:** CSS breakpoint detection via `matchMedia`. Same result, more code.

### 4. MapLegend hidden when drawer open

Pass `drawerOpen` boolean from App state (already tracked) down to `MapLegend` as a `hidden` prop. When `true`, return `null`. Simple, no animation needed — the legend is covered by the drawer anyway so no jarring hide.

**Alternative considered:** Position legend at top-left on mobile. Adds layout complexity; hiding is cleaner and the legend is less useful when a state is selected.

## Risks / Trade-offs

- **`dvh` browser support** → All modern iOS Safari (15.4+) and Android Chrome support `dvh`. iPhone 13 running iOS 16+ is covered. For older browsers it degrades to `100vh` — same as before. No regression.
- **`zoomSnap={0.5}` on Leaflet** → Enables fractional zoom. Minor visual change on desktop (zoom 5 stays integer). Low risk.
- **`window.innerWidth` at mount** → Static read; won't recompute on resize. Acceptable: users don't resize phones and desktop resize is not a concern for this feature. If needed later, a `useWindowSize` hook can replace it.

## Migration Plan

No data migration. Client-side CSS/layout change only. Deploy directly; rollback by reverting the commit if needed.

## Open Questions

- None — all decisions have been made. Ready to implement.
