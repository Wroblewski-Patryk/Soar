# LUC-2661 Ops Request Header Helper Missing-Test Links

## Header
- ID: LUC-2661
- Title: [Soar][Architecture QA][LUC-2658] Cover ops request header helper missing-test links
- Task Type: fix
- Current Stage: verification
- Status: IN_PROGRESS
- Owner: QA/Test
- Depends on: [LUC-2658](/LUC/issues/LUC-2658)
- Priority: P1
- Operation Mode: TESTER
- Mission ID: LUC-2661-OPS-REQUEST-HEADER-HELPER-MISSING-TEST-LINKS-2026-06-07
- Mission Status: VERIFIED

## Context
Parent PM checkpoint [LUC-2658](/LUC/issues/LUC-2658) selected `scripts/buildOpsRequestHeaders.mjs` as the next small uncovered script/helper family in the architecture-awareness missing-test queue.

Baseline dirty-state before this lane was broad and pre-existing, including state/context files, generated architecture outputs, application tests, and `docs/architecture/relations/priority-test-links.csv`. This lane did not revert or stage unrelated work.

## Goal
Add focused local `node:test` proof and scanner-readable relation rows for:
- `scripts/buildOpsRequestHeaders.mjs#buildOpsRequestHeaders`
- `scripts/buildOpsRequestHeaders.mjs#normalize`
- `scripts/buildOpsRequestHeaders.mjs#resolveOpsAuthLayerOptions`

## Constraints
- Use dummy literals only; do not read or print real tokens, cookies, passwords, or protected account data.
- No deploy, push, restart, rollback, production smoke, account, secret, exchange, database, or live-trading mutation.
- Reuse the existing `node:test` pattern for local script helper tests.

## Definition of Done
- Focused helper behavior is covered by a local test file.
- Direct relation rows exist in `docs/architecture/relations/priority-test-links.csv`.
- Focused proof and architecture/guardrail proof are recorded, or blockers are named.

## Implementation Notes
- Exported the existing `normalize` helper for direct local proof.
- Added `scripts/buildOpsRequestHeaders.test.mjs` covering normalization, bearer token trimming, cookie encoding, basic auth precedence, custom header validation, partial credential/header fail-closed errors, and empty input behavior.
- Added direct `LUC-2661` relation rows for the three requested anchors.

## Validation Evidence
- Tests: `node --test scripts/buildOpsRequestHeaders.test.mjs` PASS (`6/6`).
- Architecture graph: `pnpm run architecture:graph:generate` PASS (`653` nodes / `842` relations / `27` chains).
- Guardrails: `pnpm run quality:guardrails` PASS.
- Readback: `rg -n "LUC-2661|buildOpsRequestHeaders\\.mjs#(buildOpsRequestHeaders|normalize|resolveOpsAuthLayerOptions)" docs/architecture/relations/priority-test-links.csv docs/graphs/architecture-proof-register.csv docs/status/architecture-awareness-report.md` found the three direct `LUC-2661` relation rows and the generated function proof-register anchors.
- Reality status: verified.

## Result Report
- Files changed: `scripts/buildOpsRequestHeaders.mjs`, `scripts/buildOpsRequestHeaders.test.mjs`, `docs/architecture/relations/priority-test-links.csv`, generated graph/status artifacts refreshed by `pnpm run architecture:graph:generate`, project state/context ledgers, and this task packet.
- Architecture alignment: fits approved Architecture Evidence Graph relation model; no ownership or runtime topology change.
- Exact architecture-awareness top-sample removal: not claimed; local proof covered graph generation and relation readback, but no external architecture-awareness refresh was run in this lane.
- Deploy impact: none.
- Residual risk: repository had broad pre-existing dirty state; this lane did not isolate or validate unrelated changes.

## Forbidden
- New auth systems, production probes, protected smoke, secret logging, temporary bypasses, or architecture changes.
