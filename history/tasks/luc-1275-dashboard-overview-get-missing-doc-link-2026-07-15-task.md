# Task

## Header
- ID: LUC-1275
- Title: Dashboard overview GET / missing-doc-link closure
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Product Docs Agent
- Depends on: LUC-1271
- Priority: P1
- Module Confidence Rows: Dashboard overview / API root dashboard probe
- Requirement Rows: not applicable
- Quality Scenario Rows: documentation discoverability
- Risk Rows: project truth missing-doc-link routing
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-1275-dashboard-root-doc-link
- Mission Status: VERIFIED

## Context
Project truth routed the first Dashboard overview gap to
`apps/api/src/router/dashboard.routes.ts#/` as `missing_doc_link` immediately
after the proof-link closure in `LUC-1271`. The repo already had
`docs/modules/api-root.md` as the owner doc family for dashboard router
composition, but it lacked a direct documentation relation for the exact route
root and an explicit note describing the root payload contract.

## Goal
Close the generated doc-link gap for the dashboard root route without changing
runtime behavior.

## Constraints
- reuse existing API root documentation ownership
- change only docs, graph relations, evidence, and state
- no runtime code, test, deploy, push, or credential activity

## Definition of Done
- [x] `docs/modules/api-root.md` documents the `GET /dashboard` root probe
- [x] direct generator-readable documentation linkage exists for `apps/api/src/router/dashboard.routes.ts#/`
- [x] regenerated project-truth outputs advance past the scoped `missing_doc_link` row

## Forbidden
- runtime behavior changes
- new parallel doc system or duplicate owner docs
- temporary generator bypasses without durable relation updates
- deploy, push, or protected environment mutation

## Validation Evidence
- Tests: not applicable; documentation closure only
- Manual checks: focused readback of generated `app-completion` and `project-truth` outputs
- Screenshots/logs: not applicable
- High-risk checks: none
- Module confidence ledger updated: yes
- Module confidence rows closed or changed: Dashboard overview / API root dashboard probe
- Requirements matrix updated: not applicable
- Requirement rows closed or changed: none
- Quality scenarios updated: not applicable
- Quality scenario rows closed or changed: none
- Risk register updated: not applicable
- Risk rows closed or changed: none
- Reality status: verified

## Result Report
- Affected files:
  `docs/modules/api-root.md`,
  `docs/architecture/relations/documentation-links.csv`,
  `docs/architecture/scanner-overrides.json`,
  `docs/status/app-completion-index.{json,md}`,
  `docs/status/project-truth-index.{json,md}`,
  `.agents/state/module-confidence-ledger.md`,
  `.codex/context/TASK_BOARD.md`,
  `history/evidence/luc-1275-dashboard-overview-get-missing-doc-link-2026-07-15.md`.
- Verification commands:
  `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`;
  `pnpm run architecture:graph:drift:strict`;
  `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`;
  `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`;
  `rg -n "Dashboard overview: GET /|missing_doc_link|USE /backtests" docs/status/app-completion-index.md docs/status/project-truth-index.md -S`;
  `git diff --check`.
- Outcome:
  the scoped Dashboard overview `GET /` doc-link gap is closed and project
  truth advances to `USE /backtests`.
