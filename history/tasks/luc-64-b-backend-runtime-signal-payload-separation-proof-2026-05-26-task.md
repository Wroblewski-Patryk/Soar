# Task

## Header
- ID: LUC-64-B
- Title: [Soar][Backend] Runtime signal payload separation proof (strategy-condition truth vs execution outcome)
- Task Type: verification
- Current Stage: verification
- Status: DONE
- Owner: Backend API Engineer
- Depends on: DASH-RUNTIME-SIGNAL-CONDITION-ACTIVE-2026-05-25, LUC-67
- Priority: P0
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: VERIFIED

## Context
Parent issue `LUC-64` already has frontend behavior evidence (`A`) and focused QA
evidence (`C`). Remaining closure blocker is backend proof that runtime payload
semantics still separate:
1) strategy-condition truth (`lastSignalConditionLines[].matched`), and
2) execution outcome truth (`lastSignalDirection`, `lastSignalMessage`, `lastSignalReason`, runtime market/execution states).

## Goal
Produce explicit backend-side evidence that payload semantics preserve this
separation contract and did not regress while frontend/QA lanes progressed.

## Scope
- Verification and evidence only; no feature behavior redesign.
- Source references:
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
  - runtime signal API surfaces consumed by dashboard runtime widgets
- Parent integration target:
  - `history/tasks/luc-64-dashboard-strategy-signal-truth-vs-execution-outcome-repair-2026-05-25-task.md`

## Acceptance Criteria
- Evidence explicitly confirms matched condition lines can be true while execution outcome remains blocked/no-trade/open-position.
- Evidence references concrete payload fields and the canonical runtime-signal merge contract.
- Output is sufficient for parent `LUC-64` docs/state parity closure (`LUC-64-D`).

## Required Output
- A short backend evidence note attached in this task file with:
  - checked endpoint/surface names,
  - payload field mapping proving separation,
  - command/test/readback used,
  - residual risk (if any).

## Result Report
- 2026-05-26 backend verification executed on `apps/api` runtime read-model surface:
  - file: `apps/api/src/modules/bots/runtimeSymbolStatsReadModel.service.ts`
  - separation contract fields verified:
    - strategy-condition truth: `lastSignalConditionLines`, `lastSignalConditionActive`
    - execution outcome truth: `lastSignalDirection`, `lastSignalMessage`, `lastSignalReason`, `runtimeMarketState`
- Focused proof command:
  - `pnpm --filter api exec vitest run src/modules/bots/runtimeSymbolStatsReadModel.service.test.ts`
  - result: PASS (`1` file, `6` tests).
- Explicit blocked-execution parity scenario is covered by:
  - `keeps explicit runtime block reasons attached to recovered snapshot condition matches`
  - this proves matched condition truth (`lastSignalConditionActive.long === true`) can coexist with blocked runtime decision fields (`lastSignalMessage`, `lastSignalReason`) without conflation.
- Residual risk:
  - low for this payload contract at unit/service boundary; no additional backend behavior change was introduced in this lane.
