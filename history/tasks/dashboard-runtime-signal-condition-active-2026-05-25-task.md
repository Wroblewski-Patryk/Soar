# Task

## Header
- ID: `DASH-RUNTIME-SIGNAL-CONDITION-ACTIVE-2026-05-25`
- Title: Show matched strategy conditions on Dashboard signal cards when execution is blocked
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Priority: P1
- Module Confidence Rows: `SOAR-DASHBOARD-001`, `SOAR-FEATURE-WEB-RUNTIME-SURFACES`
- Iteration: 2026-05-25 Paperclip repair lane
- Operation Mode: BUILDER
- Mission ID: `SOAR-FULL-READINESS-COORDINATION-2026-05-23`
- Mission Status: VERIFIED

## Context
User feedback reported that Dashboard Home active bot signal cards should show
raw/current strategy condition direction when conditions such as `RSI(14) > 75`
or `RSI(14) < 20` are satisfied, even when existing position, no funds,
no-flip, or exchange/pre-trade constraints block opening a new position. The
reason for no execution must stay visible separately through existing runtime
event/read-model diagnostics.

Historical audit `history/audits/runtime-signal-vote-recovery-audit-plan-2026-05-02.md`
already repaired backend vote and pre-trade block visibility. The remaining
gap was Dashboard Home visual/count semantics.

## Goal
Make Dashboard Home signal cards and header count derive condition-active
LONG/SHORT truth from backend `lastSignalConditionLines[].matched === true`,
while preserving final runtime state and block reason as separate API truth.

## Scope
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeSignalConditionState.ts`
- Focused tests for the helper and signal section.
- Minimal docs/graph/state updates required by repository contracts.

## Implementation Plan
1. Add a small Dashboard Home helper that recognizes only explicit matched
   `LONG`/`SHORT` condition lines as strategy-condition-active.
2. Use that helper for the signal header count instead of accepted execution
   state only.
3. Use scoped matched condition state to keep the matching LONG/SHORT side
   visually active in the signal card even when runtime market state is
   `POSITION_OPEN` or `EVALUATED_NO_TRADE`.
4. Keep `runtimeMarketState`, context-source badge, `lastSignalMessage`, and
   `lastSignalReason` unchanged.
5. Add focused regression coverage and update architecture/module memory.

## Acceptance Criteria
- A card with `lastSignalDirection=null`, `runtimeMarketState=POSITION_OPEN`,
  and a matched SHORT condition visually marks SHORT active.
- Header signal count counts symbols with explicit matched LONG/SHORT
  condition lines.
- `n/a`, `matched=null`, unknown backend values, and false conditions do not
  count as active.
- Existing runtime state badges and runtime detail reason text remain visible.

## Validation Evidence
- PASS: `pnpm --filter web exec vitest run src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx src/features/dashboard-home/components/home-live-widgets/runtimeSignalConditionState.test.ts`
  (`2` files / `9` tests).
- PASS: `pnpm --filter web run typecheck`.
- PASS: `pnpm --filter web run lint`.
- PASS: `pnpm run architecture:graph:generate` (`645` nodes / `804`
  relations / `27` chains).
- PASS: `pnpm run architecture:graph:drift:strict` (`809/809` covered, `0`
  missing).
- PASS: `git diff --check -- <touched files>` with LF/CRLF warnings only.
- FAIL unrelated: `pnpm run quality:guardrails` is blocked by existing dirty
  `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts` at
  `1003` lines over the `1000` production monolith line budget.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/modules/web-dashboard-home.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
  - `history/audits/runtime-signal-vote-recovery-audit-plan-2026-05-02.md`
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Follow-up architecture doc updates: graph registry and Web Dashboard Home
  signal contract updated.

## UX/UI Evidence
- Design source type: existing dashboard implementation and operator feedback.
- Existing shared pattern reused: backend read-model condition lines,
  runtime state badges, context source badges, runtime detail text.
- New shared pattern introduced: no.
- Required states: blocked/evaluated runtime states covered by focused test.
- Accessibility checks: active state is reflected in deterministic DOM state
  for testability; visible badges/reason text remain unchanged.
- Parity evidence: Dashboard Home now follows backend read-model truth for
  matched condition lines without claiming an order opened.

## Result Report
- Task summary: Dashboard signal presentation now separates strategy-condition
  activity from accepted execution state.
- Files changed:
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.tsx`
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeSignalConditionState.ts`
  - focused tests and required docs/graph/state records.
- How tested: focused Vitest, Web typecheck, Web lint, diff check.
- What is incomplete: no live authenticated browser screenshot or production
  readback was run in this lane.
- Next steps: add a cheap link/button to the existing runtime logs/detail
  surface if product wants navigation beyond the current visible reason text.
