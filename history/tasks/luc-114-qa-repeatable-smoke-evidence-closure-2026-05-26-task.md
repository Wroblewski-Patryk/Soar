# Task

## Header
- ID: LUC-114
- Title: [Soar][LUC-103-P5C] QA repeatable smoke evidence closure
- Task Type: verification
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Priority: P1
- Mission Status: VERIFIED

## Context
`LUC-103` partition `P5C` required fresh, repeatable QA smoke evidence closure for current date.

## Goal
Refresh repeatable smoke evidence for QA critical path and close the QA evidence gap with durable artifacts.

## Scope
- Run repeatable smoke runner for `web`.
- Run repeatable smoke runner for `api`.
- Capture dated artifact and evidence packet.
- Sync project source-of-truth status.

## Constraints
- QA lane only (no feature/runtime implementation changes).
- No deploy mutation.
- No secret material in artifacts.

## Definition of Done
- [x] Repeatable smoke command executed for selected QA checks.
- [x] Dated artifact and evidence file generated.
- [x] PASS/FAIL status is explicit and reproducible.
- [x] TASK_BOARD and PROJECT_STATE reflect closure.

## Validation Evidence
- `pnpm run qa:smoke-e2e:repeatable -- --checks web --today 2026-05-26` -> PASS
- `pnpm run qa:smoke-e2e:repeatable -- --checks api --today 2026-05-26` -> PASS
- Artifact: `history/artifacts/qa-repeatable-smoke-e2e-2026-05-26.json`
- Evidence: `history/evidence/qa-repeatable-smoke-e2e-2026-05-26.md`
- Reality status: verified

## Result Report
- Task summary: repeatable QA smoke evidence is refreshed and closed for `LUC-114`.
- Files changed: task packet + source-of-truth status updates + dated QA artifact/evidence output.
- How tested: two repeatable smoke executions (`web`, `api`) on 2026-05-26.
- What is incomplete: none in this QA-evidence lane.
- Next steps: downstream lanes may consume this PASS evidence for `LUC-103` owner-scoped closure.
