# Task

## Header
- ID: UXFIX-2026-04-30-B
- Title: Derive LIVE percent wallet delta from runtime equity and net PnL
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Depends on: runtime positions capital summary
- Priority: P2

## Context
The dashboard wallet panel renders `Delta from start` from a wallet baseline.
PAPER bots have a paper baseline, and LIVE fixed-allocation bots have a fixed
allocation value. LIVE percent-allocation bots did not have a fixed baseline,
so the web showed `-` even when runtime equity and net PnL were available.

## Goal
Render a truthful LIVE percent-allocation wallet delta in the dashboard web
layer without changing the API/runtime capital contract.

## Scope
- `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSidebarSection.tsx`
- `apps/web/src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx`
- source-of-truth sync in `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`, and `docs/planning/mvp-next-commits.md`

## Implementation Plan
1. Keep existing PAPER and LIVE fixed-allocation baseline behavior.
2. For LIVE percent allocation, derive the delta denominator from
   `runtime portfolio - selected net PnL` when runtime portfolio is available.
3. Keep the row as `-` when runtime portfolio is not available.
4. Add focused regression coverage for LIVE percent allocation.

## Acceptance Criteria
- LIVE percent allocation no longer renders `Delta from start` as `-` when
  runtime equity and selected net PnL are available.
- Missing runtime capital fields are not masked with wallet allocation fallback.
- PAPER and LIVE fixed-allocation behavior remains unchanged.

## Definition of Done
- [x] Existing runtime capital summary fields reused.
- [x] No API/runtime contract change.
- [x] Focused regression added.
- [x] Relevant validations passed.
- [x] Source-of-truth files synchronized.

## Forbidden
- Backend workaround paths.
- Fake baseline values when runtime equity is missing.
- Changing wallet allocation or account-balance semantics.

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx`
- Typecheck: `pnpm --filter web run typecheck`
- Guardrails: `pnpm run quality:guardrails`
- Manual checks: not run in browser; focused component regression verifies the affected row.

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: user-provided dashboard wallet section HTML.
- Existing shared pattern reused: existing `RuntimeSidebarSection` wallet KPI rows.
- New shared pattern introduced: no
- Required states: available runtime equity, missing runtime equity.
- Responsive checks: no layout behavior changed.
- Accessibility checks: row text semantics unchanged.
- Parity evidence: focused test asserts LIVE percent delta content.

## Result Report
- Task summary: LIVE percent wallet delta now renders from runtime equity and net PnL.
- Files changed: listed in Scope.
- How tested: listed in Validation Evidence.
- What is incomplete: no browser screenshot captured for this data-only fix.
- Next steps: verify against protected production dashboard after deploy if available.
