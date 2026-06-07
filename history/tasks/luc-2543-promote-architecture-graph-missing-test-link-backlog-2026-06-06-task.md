# Task

## Header
- ID: LUC-2543
- Title: [Soar][Docs] Promote architecture graph missing-test-link backlog
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Documentation Steward
- Depends on: Architecture awareness missing-test relation backlog
- Priority: P1
- Module Confidence Rows: Architecture Evidence Graph; API Bots; API Engine; API Positions
- Requirement Rows: not applicable
- Quality Scenario Rows: maintainability / traceability
- Risk Rows: not applicable
- Iteration: 2026-06-06
- Operation Mode: BUILDER
- Mission ID: LUC-2543-ARCHITECTURE-GRAPH-MISSING-TEST-LINK-BACKLOG-2026-06-06
- Mission Status: VERIFIED

## Context
The scoped Paperclip wake assigned [LUC-2543](/LUC/issues/LUC-2543) to the
Documentation Steward with no pending comments and `fallbackFetchNeeded=false`.
The current architecture-awareness report generated
`2026-06-06T16:24:34.647Z` still listed `804` actionable implementation
entities without inferred tests, led by bots e2e helpers, bot projection
repository functions, runtime symbol-stats repository helpers, engine indicator
period handling, and imported position-id helpers.

## Goal
Promote the high-signal missing-test-link backlog rows that already have real
focused or aggregate test proof into scanner-readable architecture graph
relations without inventing new tests or claiming production proof.

## Scope
- `docs/architecture/relations/priority-test-links.csv`
- generated architecture-awareness and graph/status outputs under `docs/graphs/`
  and `docs/status/`
- source-of-truth state/context files for this checkpoint
- this task packet

## Implementation Plan
1. Read the current architecture-awareness missing-test samples.
2. Match top samples to existing real tests only.
3. Add direct `priority-test-links.csv` rows for the verified relation set.
4. Refresh architecture-awareness outputs.
5. Run graph generation, strict graph drift, and focused API test proof.
6. Record evidence and disposition.

## Acceptance Criteria
- Added scanner-readable priority test links for the selected missing-test rows.
- Architecture-awareness refresh succeeds and lowers actionable missing-test
  count.
- Architecture graph generation and strict drift pass.
- Focused API proof for linked pure/helper surfaces passes.
- No runtime behavior, production, deploy, push, restart, env/account, secret,
  protected-smoke, exchange, or live-trading mutation occurs.

## Definition of Done
- [x] Relation rows added only for existing tests.
- [x] Architecture-awareness refresh passed.
- [x] Strict architecture graph drift passed.
- [x] Focused API validation passed.
- [x] Source-of-truth files and task evidence updated.

## Forbidden
- Do not add fake tests for scanner satisfaction.
- Do not weaken graph or awareness inference rules.
- Do not mutate runtime behavior or production.
- Do not touch secrets, accounts, exchange state, or LIVE trading state.

## Validation Evidence
- Architecture-awareness refresh:
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - PASS: `14683` entities / `23274` relations, generated
    `2026-06-06T19:47:09.571Z`.
- Readback:
  - actionable missing-test rows moved from `804` to `763`;
  - actionable missing-doc rows remained `0`;
  - disconnected entities remained `0`;
  - linked bots, strategy-analysis, runtime symbol-stats, and imported
    position-id rows no longer lead the top actionable missing-test sample.
- Architecture graph:
  - `pnpm run architecture:graph:generate` PASS (`653` nodes / `842`
    relations / `27` chains).
  - `pnpm run architecture:graph:drift:strict` PASS (`837/837`, `0` missing).
- Focused tests:
  - `pnpm --filter api exec vitest run src/modules/bots/bots.e2e.shared.test.ts src/modules/bots/botsRuntimeRead.repository.test.ts src/modules/bots/runtimeSessionSymbolStatsRead.service.test.ts src/modules/engine/strategySignalAnalysis.test.ts src/modules/engine/strategyIndicatorRegistryParity.test.ts src/modules/engine/strategySignalEvaluator.test.ts src/modules/positions/livePositionReconciliation.service.test.ts -t "bots.e2e.shared|botsRuntimeRead.repository|runtimeSessionSymbolStatsRead.service|strategySignalAnalysis|strategyIndicatorRegistry parity|strategySignalEvaluator|imported external position id helpers"`
  - PASS: `7` files, `39` passed, `33` skipped by filter.
- `git diff --check` PASS with line-ending warnings only.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/status/architecture-awareness-report.md`
  - `docs/architecture/relations/priority-test-links.csv`
  - `docs/graphs/architecture-awareness.json`
  - `docs/graphs/architecture-graph.json`
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates:
  - Direct priority test links added for selected top missing-test relation
    rows.

## Result Report
- Task summary: promoted a high-signal architecture-awareness missing-test-link
  backlog slice by linking existing tests to the selected top rows.
- Files changed:
  - `docs/architecture/relations/priority-test-links.csv`
  - generated architecture-awareness/graph/status outputs
  - source-of-truth state/context files
  - `history/tasks/luc-2543-promote-architecture-graph-missing-test-link-backlog-2026-06-06-task.md`
- How tested: awareness refresh, graph generate, strict graph drift, focused API
  proof, and diff check.
- What is incomplete: remaining `763` actionable missing-test rows are outside
  this slice; current top is led by `apps/api/prisma/seed.ts#main`,
  runtime-position state helper, positions helper/history, crypto/util,
  worker, and Web build-info/layout rows.
- Next steps: create or route follow-up owner lanes for the remaining families
  only when a real test or owner-backed proof exists.
- Decisions made: no new tests were added in this docs lane; relation promotion
  was limited to existing proof.
