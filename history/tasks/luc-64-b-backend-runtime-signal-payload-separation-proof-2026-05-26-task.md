# Task

## Header
- ID: LUC-64-B
- Title: [Soar][Backend] Runtime signal payload separation proof (strategy-condition truth vs execution outcome)
- Task Type: verification
- Current Stage: verification
- Status: READY
- Owner: Backend API Engineer
- Depends on: DASH-RUNTIME-SIGNAL-CONDITION-ACTIVE-2026-05-25, LUC-67
- Priority: P0
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: IN_PROGRESS

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
- Pending backend owner execution.
