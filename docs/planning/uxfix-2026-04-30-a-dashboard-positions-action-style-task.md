# Task

## Header
- ID: UXFIX-2026-04-30-A
- Title: Align dashboard Positions row actions with shared table action styles
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Depends on: shared `TableUi` action contract
- Priority: P2

## Context
The dashboard runtime `Positions` table used local `btn-outline` classes for
row-level edit and close actions, while other dashboard tables use the shared
`TableUi` action button contract.

## Goal
Make `Positions` row actions visually match the default dashboard table action
style while preserving the existing position-specific action behavior.

## Scope
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx`
- source-of-truth sync in `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`, and `docs/planning/mvp-next-commits.md`

## Implementation Plan
1. Reuse the existing `TableIconButtonAction` component for open-position row
   edit and close actions.
2. Keep current icons, labels, disabled state, and callbacks.
3. Add a focused presenter regression for shared table action tone classes.
4. Run focused web validation and repository guardrails.

## Acceptance Criteria
- Edit action uses shared table `info` tone styling.
- Close action uses shared table `danger` tone styling.
- Position actions no longer use the ad-hoc `btn-outline` styling.
- Existing edit and close callbacks remain unchanged.

## Definition of Done
- [x] Existing shared table action system reused.
- [x] No new visual pattern introduced.
- [x] Focused regression added.
- [x] Relevant validations passed.
- [x] Source-of-truth files synchronized.

## Forbidden
- New table action styling system.
- Runtime/API behavior changes.
- Temporary CSS overrides or duplicated style strings.

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx`
- Typecheck: `pnpm --filter web run typecheck`
- Guardrails: `pnpm run quality:guardrails`
- Manual checks: not run locally in browser; focused DOM regression verifies the shared classes and accessible labels.

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: user-provided wallet table action HTML and existing `TableUi` contract.
- Existing shared pattern reused: `TableIconButtonAction`.
- New shared pattern introduced: no
- Required states: default, disabled/closing, unavailable
- Responsive checks: no layout behavior changed; buttons retain fixed shared table dimensions.
- Accessibility checks: actions keep accessible `aria-label` through shared button component.
- Parity evidence: focused test asserts `info`/`danger` shared tones and absence of `btn-outline`.

## Result Report
- Task summary: Dashboard `Positions` row actions now match shared table action styling.
- Files changed: listed in Scope.
- How tested: listed in Validation Evidence.
- What is incomplete: no browser screenshot captured for this tiny style-only fix.
- Next steps: none.
