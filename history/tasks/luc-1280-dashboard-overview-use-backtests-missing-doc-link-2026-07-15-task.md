# Task

## Header
- ID: LUC-1280
- Title: Dashboard overview USE /backtests missing-doc-link closure
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Product Docs Agent
- Depends on: LUC-1275
- Priority: P1
- Module Confidence Rows: Dashboard overview / dashboard backtests router mount
- Requirement Rows: not applicable
- Quality Scenario Rows: documentation discoverability
- Risk Rows: project truth missing-doc-link routing
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-1280-dashboard-use-backtests-doc-link
- Mission Status: VERIFIED

## Context
Project truth advanced the first docs-owned Dashboard overview gap from
`GET /dashboard` to `apps/api/src/router/dashboard.routes.ts#/backtests` as
`missing_doc_link`. The backtests module already had the canonical owner doc in
`docs/modules/api-backtests.md`, but it lacked a direct generator-readable
relation for the dashboard router mount and an explicit route-mount note tying
the authenticated dashboard boundary to the backtests surface.

## Goal
Close the generated doc-link gap for `USE /backtests` without changing runtime
behavior.

## Constraints
- reuse existing backtests module documentation ownership
- change only docs, graph relations, generated indexes, evidence, and state
- no runtime code, test creation, deploy, push, or credential activity

## Definition of Done
- [x] `docs/modules/api-backtests.md` documents the dashboard `USE /backtests` mount
- [x] direct generator-readable documentation linkage exists for `apps/api/src/router/dashboard.routes.ts#/backtests`
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
- Module confidence rows closed or changed: Dashboard overview / dashboard backtests router mount
- Requirements matrix updated: not applicable
- Requirement rows closed or changed: none
- Quality scenarios updated: not applicable
- Quality scenario rows closed or changed: none
- Risk register updated: not applicable
- Risk rows closed or changed: none
- Reality status: verified

## Result Report
- Affected files:
  `docs/modules/api-backtests.md`,
  `docs/architecture/relations/documentation-links.csv`,
  `docs/architecture/scanner-overrides.json`,
  `docs/graphs/architecture-awareness.{json,csv}`,
  `docs/status/app-completion-index.{json,md}`,
  `docs/status/project-truth-index.{json,md}`,
  `.agents/state/module-confidence-ledger.md`,
  `.codex/context/PROJECT_STATE.md`,
  `.codex/context/TASK_BOARD.md`,
  `history/evidence/luc-1280-dashboard-overview-use-backtests-missing-doc-link-2026-07-15.md`.
- Verification commands:
  `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`;
  `pnpm run architecture:graph:drift:strict`;
  `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`;
  `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`;
  `rg -n "USE /backtests|USE /bots|missing_doc_link|missing_test_link" docs/status/app-completion-index.md docs/status/project-truth-index.md -S`;
  `git diff --check`.
- Outcome:
  the scoped Dashboard overview `USE /backtests` doc-link gap is closed and
  project truth advances to `USE /bots` as the next first Dashboard overview
  proof-owned `missing_test_link` row.
