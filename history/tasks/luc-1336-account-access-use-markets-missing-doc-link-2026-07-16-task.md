# Task

## Header
- ID: `LUC-1336`
- Title: `Account access USE /markets missing-doc-link closure`
- Task Type: `fix`
- Current Stage: `verification`
- Status: `DONE`
- Owner: `Documentation Steward`
- Depends on: `LUC-1332`
- Priority: `P1`
- Module Confidence Rows: `Account access / dashboard markets router mount documentation`
- Requirement Rows: `not applicable`
- Quality Scenario Rows: `documentation discoverability`
- Risk Rows: `project truth missing-doc-link routing`
- Iteration: `1`
- Operation Mode: `BUILDER`
- Mission ID: `LUC-1336-account-access-use-markets-doc-link`
- Mission Status: `VERIFIED`

## Context
`LUC-1332` closed the Dashboard overview proof-link lane for
`apps/api/src/router/dashboard.routes.ts#/markets`, which advanced the same
endpoint into the docs-owned Account access `missing_doc_link` queue. The
canonical markets API doc already described the `/dashboard/markets` mount and
route surface, but the generator-readable documentation relation was missing
from the relation sources that feed architecture-awareness and app-completion
readback.

## Goal
Close the generated doc-link gap for `USE /markets` without changing runtime
behavior.

## Constraints
- reuse existing markets module documentation ownership
- change only docs, graph relations, generated indexes, evidence, and state
- no runtime code, test creation, deploy, push, or credential activity

## Definition of Done
- [x] direct generator-readable documentation linkage exists for
      `apps/api/src/router/dashboard.routes.ts#/markets`
- [x] regenerated app-completion output removes `USE /markets` from
      `missing_doc_link`
- [x] regenerated project-truth output advances past the scoped docs gap

## Forbidden
- runtime behavior changes
- new parallel doc system or duplicate owner docs
- temporary generator bypasses without durable relation updates
- deploy, push, or protected environment mutation

## Validation Evidence
- Tests: `not applicable`; documentation closure only
- Manual checks: focused readback of generated `app-completion` and
  `project-truth` outputs
- Screenshots/logs: `not applicable`
- High-risk checks: `none`
- Module confidence ledger updated: `not applicable`
- Module confidence rows closed or changed:
  `Account access / dashboard markets router mount documentation`
- Requirements matrix updated: `not applicable`
- Requirement rows closed or changed: `none`
- Quality scenarios updated: `not applicable`
- Quality scenario rows closed or changed: `none`
- Risk register updated: `not applicable`
- Risk rows closed or changed: `none`
- Reality status: `verified`

## Result Report
- Affected files:
  `docs/architecture/scanner-overrides.json`,
  `docs/architecture/relations/documentation-links.csv`,
  `docs/graphs/architecture-awareness.{json,csv}`,
  `docs/graphs/architecture-proof-register.csv`,
  `docs/graphs/architecture-graph.md`,
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
  `history/evidence/luc-1336-account-access-use-markets-missing-doc-link-2026-07-16.md`.
- Verification commands:
  `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`;
  `pnpm run architecture:graph:drift:strict`;
  `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`;
  `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`;
  `rg -n "USE /markets|missing_doc_link|dashboard.routes.ts#/markets" docs/status/app-completion-index.json docs/status/app-completion-index.md`;
  `git diff --check`.
- Outcome:
  the scoped Account access `USE /markets` doc-link gap is closed and project
  truth advances to `USE /orders` as the first overall `missing_test_link`
  row. Remaining docs-owned gaps are now `GET /alerts` and `GET /metrics`
  under Unclassified user workflow.
