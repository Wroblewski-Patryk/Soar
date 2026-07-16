# Task

## Header
- ID: `LUC-1313`
- Title: `Account access USE /logs missing-doc-link closure`
- Task Type: `fix`
- Current Stage: `verification`
- Status: `DONE`
- Owner: `Documentation Steward`
- Depends on: `LUC-1303`
- Priority: `P1`
- Module Confidence Rows: `Account access / dashboard logs router mount documentation`
- Requirement Rows: `not applicable`
- Quality Scenario Rows: `documentation discoverability`
- Risk Rows: `project truth missing-doc-link routing`
- Iteration: `1`
- Operation Mode: `BUILDER`
- Mission ID: `LUC-1313-account-access-use-logs-doc-link`
- Mission Status: `VERIFIED`

## Context
`LUC-1303` closed the Dashboard overview proof-link lane for
`apps/api/src/router/dashboard.routes.ts#/logs`, which advanced the same
endpoint into the first docs-owned Account access `missing_doc_link` row.
The logs owner doc already covered `/dashboard/logs`, but it lacked a direct
generator-readable documentation relation for the dashboard router mount and an
explicit mount note tying the shared auth gate to the delegated logs surface.

## Goal
Close the generated doc-link gap for `USE /logs` without changing runtime
behavior.

## Constraints
- reuse existing logs module documentation ownership
- change only docs, graph relations, generated indexes, evidence, and state
- no runtime code, test creation, deploy, push, or credential activity

## Definition of Done
- [x] `docs/modules/api-logs.md` documents the dashboard `USE /logs` mount
- [x] direct generator-readable documentation linkage exists for `apps/api/src/router/dashboard.routes.ts#/logs`
- [x] regenerated project-truth outputs advance past the scoped `missing_doc_link` row

## Forbidden
- runtime behavior changes
- new parallel doc system or duplicate owner docs
- temporary generator bypasses without durable relation updates
- deploy, push, or protected environment mutation

## Validation Evidence
- Tests: `not applicable`; documentation closure only
- Manual checks: focused readback of generated `app-completion` and `project-truth` outputs
- Screenshots/logs: `not applicable`
- High-risk checks: `none`
- Module confidence ledger updated: `yes`
- Module confidence rows closed or changed: `Account access / dashboard logs router mount documentation`
- Requirements matrix updated: `not applicable`
- Requirement rows closed or changed: `none`
- Quality scenarios updated: `not applicable`
- Quality scenario rows closed or changed: `none`
- Risk register updated: `not applicable`
- Risk rows closed or changed: `none`
- Reality status: `verified`

## Result Report
- Affected files:
  `docs/modules/api-logs.md`,
  `docs/architecture/relations/documentation-links.csv`,
  `docs/architecture/scanner-overrides.json`,
  `docs/graphs/architecture-awareness.{json,csv}`,
  `docs/graphs/architecture-proof-register.csv`,
  `docs/graphs/architecture-graph.{md,mmd}`,
  `docs/graphs/architecture-health.json`,
  `docs/status/app-completion-index.{json,md}`,
  `docs/status/project-truth-index.{json,md}`,
  `docs/status/event-chain-index.{json,md}`,
  `docs/status/operational-readiness-index.{json,md}`,
  `docs/status/runtime-error-index.{json,md}`,
  `docs/status/architecture-awareness-report.md`,
  `docs/status/architecture-dependency-report.md`,
  `docs/status/architecture-ownership-report.md`,
  `docs/status/task-synchronization-report.md`,
  `.agents/state/module-confidence-ledger.md`,
  `.codex/context/PROJECT_STATE.md`,
  `.codex/context/TASK_BOARD.md`,
  `history/evidence/luc-1313-account-access-use-logs-missing-doc-link-2026-07-16.md`.
- Verification commands:
  `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`;
  `pnpm run architecture:graph:drift:strict`;
  `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`;
  `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`;
  `rg -n "USE /logs|USE /market-stream|missing_doc_link|missing_test_link" docs/status/app-completion-index.md docs/status/project-truth-index.md -S`;
  `git diff --check`.
- Outcome:
  the scoped Account access `USE /logs` doc-link gap is closed and project
  truth advances to `USE /market-stream` as the next first overall
  `missing_test_link` row. Remaining docs-owned gaps are now
  `GET /alerts` and `GET /metrics`.
