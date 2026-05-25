# Dashboard Design System (V1)

This document defines the shared UI foundation used across dashboard modules.

## Core Principles
- Risk-first hierarchy: safety/status signals appear before action controls.
- Consistent state handling: loading, empty, degraded, error, success use shared components.
- Reusable semantics: mode/risk badges and page-header patterns remain uniform.
- Responsive parity: every core module supports desktop/tablet/mobile layouts.

## Visual Direction
- Soar should feel like an operator cockpit, not a casino-style crypto app.
- Favor high-signal hierarchy, premium restraint, and technical sharpness.
- Use contrast in layout, typography, and density before reaching for louder
  color.
- Dense data should feel deliberate and scannable, never cluttered.
- New screens should look strong enough for marketing screenshots while still
  being credible during real trading operations.

## Shared Components
- `ViewState` (`LoadingState`, `EmptyState`, `ErrorState`, `SuccessState`)
- `StatusBadge` (mode + risk variants)
- `PageTitle` (title + breadcrumb + optional action)
- `SafetyBar` (mode/connectivity/heartbeat/emergency context)
- Dashboard shell (`Header`, `Footer`, language/theme toggles)

## Visual Tokens
- Execution mode tokens:
  - `mode-paper`
  - `mode-live`
  - `mode-local`
- Risk tokens:
  - `risk-safe`
  - `risk-warning`
  - `risk-danger`
- State components must use semantic tokens instead of custom one-off colors.
- Accent colors should reinforce mode, status, or urgency, not decorate empty
  space.
- Avoid novelty glow, glassmorphism overuse, or gradients without operational
  meaning.

## Interaction Standards
- LIVE-affecting actions require explicit confirmation.
- Long lists/tables require filtering and refresh controls.
- Audit-heavy workflows should provide trace drill-down (metadata context).
- Critical status changes should be visible without page reload.
- Desktop layouts should use width for monitoring and comparison, not centered
  mobile-style stacks.
- Tablet layouts should preserve touch comfort while exposing more context than
  mobile.

## Accessibility Standards
- Keyboard focus visible on all interactive controls.
- Landmark usage for major navigation regions.
- Screen-reader updates for dynamic operational status (heartbeat/connectivity).
- Labels for selectors, toggles, and destructive actions.

## Module Conformance Checklist
1. Uses shared shell and page title pattern.
2. Uses shared state components for async/loading states.
3. Uses `StatusBadge` for mode/risk presentation.
4. Includes responsive behavior for narrow viewports.
5. Provides accessible labels and focus handling.
