# LUC-2650 Route-Reachable i18n Audit Script Missing-Test Links - 2026-06-07

## Header
- ID: LUC-2650
- Title: [Soar][Architecture QA][LUC-2647] Cover route-reachable i18n audit script missing-test links
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: [LUC-2647](/LUC/issues/LUC-2647)
- Priority: P1
- Module Confidence Rows: Web i18n / Copy; Architecture Evidence Graph relation confidence
- Requirement Rows: REQ-I18N-022; REQ-DOC-031
- Quality Scenario Rows: local i18n audit tooling confidence
- Risk Rows: RISK-034; no new production risk
- Operation Mode: TESTER
- Mission ID: LUC-2650-ROUTE-REACHABLE-I18N-AUDIT-SCRIPT-MISSING-TEST-LINKS-2026-06-07
- Mission Status: VERIFIED

## Context
[LUC-2647](/LUC/issues/LUC-2647) delegated this Test Automation child after the
current architecture-awareness report still showed function-level missing-test
links for `scripts/auditRouteReachableI18n.mjs`. The script already had
aggregate command coverage through reusable audit tooling, but helper-level
anchors were not directly linked to focused local tests.

## Goal
Provide focused local proof for the route-reachable i18n audit helpers and add
scanner-readable relation rows that connect current helper anchors to that
proof.

## Scope
- `scripts/auditRouteReachableI18n.mjs`
- `scripts/auditRouteReachableI18n.test.mjs`
- `docs/architecture/relations/priority-test-links.csv`
- generated graph and route-audit artifacts produced by existing commands
- Soar state/context files updated for this issue

## Implementation Plan
1. Make the route-reachable i18n audit script import-safe and export existing helper logic.
2. Add a focused `node:test` file using temporary mini-app fixtures.
3. Add direct `LUC-2650` rows to `priority-test-links.csv`.
4. Run focused proof, the real route-reachable i18n audit, graph generation, and guardrails.
5. Record durable evidence and update source-of-truth state.

## Acceptance Criteria
- `node --test scripts/auditRouteReachableI18n.test.mjs` passes.
- `pnpm run i18n:audit:route-reachable:web` reports `0` findings.
- `pnpm run architecture:graph:generate` passes.
- `pnpm run quality:guardrails` passes.
- No deploy, push, restart, rollback, production smoke, account, secret,
  exchange, database, or live-trading mutation occurs.

## Definition of Done
- Focused helper proof exists and passes.
- Architecture relation rows map current helper anchors to focused proof.
- Existing route-reachable i18n audit and architecture graph contracts remain passing.
- Task evidence and project state are updated.

## Result Report
Implemented and verified local Test Automation proof for
`scripts/auditRouteReachableI18n.mjs`.

Changed:
- Made `scripts/auditRouteReachableI18n.mjs` import-safe with a direct-run
  guard and exported focused helpers including `parseArgs`, `listSourceFiles`,
  `readImports`, `resolveCandidateFile`, `resolveImport`,
  `collectAncestorLayouts`, `analyzeFileSource`, `buildRouteReachability`, and
  `run`.
- Added `scripts/auditRouteReachableI18n.test.mjs` covering CLI parsing,
  source discovery, TypeScript import reading, relative and alias import
  resolution, ancestor layout reachability, source finding scoring, audit
  exclusions, and JSON artifact output on fixture routes.
- Added direct `LUC-2650` rows to
  `docs/architecture/relations/priority-test-links.csv`.

Verification:
- `node --test scripts/auditRouteReachableI18n.test.mjs` PASS (`5/5`).
- `pnpm run i18n:audit:route-reachable:web` PASS (`findings=0`, `localCopy=0`,
  `fallbackPl=0`, `hardcoded=0`).
- `pnpm run architecture:graph:generate` PASS (`653` nodes / `842` relations /
  `27` chains).
- `pnpm run quality:guardrails` PASS.

Boundary:
- Local tooling proof and scanner-readable traceability only.
- No deploy, push, restart, rollback, production smoke, account, secret,
  exchange, database, or live-trading mutation occurred.

Residual risk:
- Exact external architecture-awareness top-sample removal is not claimed from
  this checkout; this lane proves focused local helper tests, the live
  route-reachable i18n audit, graph generation, and repository guardrails.

Next owner:
- No follow-up owner is required for [LUC-2650](/LUC/issues/LUC-2650).
- Future refreshed architecture-awareness regressions should route through the
  architecture tooling/coordinator lane.
