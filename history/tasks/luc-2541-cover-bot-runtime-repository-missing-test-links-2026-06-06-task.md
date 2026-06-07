# Task

## Header
- ID: LUC-2541
- Title: Cover Bot Runtime Repository Missing-Test Links
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Priority: P1
- Operation Mode: BUILDER
- Mission ID: LUC-2541-BOT-RUNTIME-REPOSITORY-TEST-LINKS-2026-06-06
- Mission Status: VERIFIED

## Context
The architecture awareness scanner already recognizes Bot Runtime API tests and the runtime positions/trades service nodes, but direct scanner-readable test relations were missing for the split repository files:

- `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts`
- `apps/api/src/modules/bots/runtimeSessionTradesRead.repository.ts`

This was a traceability gap, not a product behavior gap.

## Goal
Map the Bot Runtime repository files to existing focused service/e2e tests so missing-test reports stop treating them as unlinked implementation entities.

## Scope
- Modified: `docs/architecture/relations/priority-test-links.csv`
- Live issue description named-scope readback:
  - `bots.repository.ts#getBotWithStrategyProjectionById` -> `bots.e2e.test.ts`
  - `bots.repository.ts#getOwnedBotWithStrategyProjection` -> `bots.portfolio-history.e2e.test.ts`
  - `bots.repository.ts#listOwnedBotsWithStrategyProjection` -> `bots.e2e.test.ts`
  - `botsRuntimeRead.repository.ts#listMarketCandles` -> `runtimeSessionSymbolStatsRead.service.test.ts`
  - `botsRuntimeRead.repository.ts#listStrategiesByIds` -> `runtimeSessionSymbolStatsRead.service.test.ts`
- Added direct links:
  - positions repository -> `runtimeSessionPositionsRead.service.test.ts`
  - positions repository -> `bots.runtime-scope.e2e.test.ts`
  - trades repository -> `runtimeSessionPositionsRead.service.test.ts`
  - trades repository -> `bots.runtime-history-parity.e2e.test.ts`
- No source code, route, schema, runtime, or deployment surface changed.

## Implementation Plan
1. Inspect Bot Runtime repository files, architecture nodes, and existing test nodes.
2. Add direct scanner-readable priority test-link rows.
3. Verify linked paths exist.
4. Run focused non-DB test proof and graph drift.
5. Record DB-backed e2e limitation if local database is unavailable.

## Acceptance Criteria
- [x] Four `LUC-2541` priority test-link rows exist.
- [x] Each linked source/test path exists.
- [x] Architecture graph drift remains clean.
- [x] Focused non-DB Bot Runtime repository/service tests pass.
- [x] Any blocked DB-backed verification is recorded with exact cause.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations are satisfied for this no-runtime relation repair.
- [x] No temporary workaround, fake data, duplicate logic, deploy, secret, account, exchange, or live-trading action was introduced.
- [x] State and Paperclip issue disposition are updated with evidence.

## Validation Evidence
- Tests:
  - PASS: `botsRuntimeRead.repository.test.ts` (`1/1`) and `runtimeSessionPositionsRead.service.test.ts` (`22/22`) within the focused Vitest command.
  - PARTIAL/BLOCKED: the same command included DB-backed `bots.runtime-scope.e2e.test.ts` and `bots.runtime-history-parity.e2e.test.ts`; both failed before assertions because Prisma could not reach local Postgres at `localhost:5432` from `resetBotsE2eState`.
- Manual checks:
  - PASS: Node CSV readback verified `5/5` exact functions named in the live [LUC-2541](/LUC/issues/LUC-2541) description. These rows were present through the concurrent [LUC-2543](/LUC/issues/LUC-2543) relation promotion.
  - PASS: Node CSV readback verified `4/4` `LUC-2541` rows and confirmed every linked source/test path exists.
  - PASS: `pnpm run architecture:graph:drift:strict` -> `837/837 covered, 0 missing`.
- Reality status: verified for relation repair; DB-backed e2e proof partially verified due unavailable local database.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-POSITIONS-READ.md`
  - `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-TRADES.md`
  - `docs/architecture/nodes/SOAR-TEST-BOT-RUNTIME-API.md`
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.

## Autonomous Loop Evidence
1. Analyze current state: Bot Runtime API tests and service nodes already exist; split repository files lacked direct scanner-readable test links.
2. Select one priority mission objective: [LUC-2541](/LUC/issues/LUC-2541) from the Paperclip wake payload.
3. Plan implementation: add only relation rows; do not change runtime behavior.
4. Execute implementation: added four rows to `docs/architecture/relations/priority-test-links.csv`; exact live issue named-scope rows were also present through the concurrent [LUC-2543](/LUC/issues/LUC-2543) relation promotion.
5. Verify and test: named-scope CSV readback, LUC-2541 row readback, graph drift, and focused non-DB tests passed; DB-backed e2e blocked by local Postgres unavailability.
6. Self-review: no workaround, duplication, architecture drift, or runtime change introduced.
7. Update documentation and knowledge: task packet plus project state, task board, active mission, system health, and module confidence ledger updated.

## Security / Privacy Evidence
- Data classification: architecture/test traceability metadata only.
- Trust boundaries: no auth, account, secret, API key, payment, exchange, DB data, or production input read or mutated.
- Secret handling: no secret values printed or stored.
- Fail-closed behavior: DB-backed e2e proof remains partial instead of being overstated.

## Result Report
- Task summary: added four direct Bot Runtime repository test-link rows.
- Files changed: `docs/architecture/relations/priority-test-links.csv`; this task packet and state/context files.
- How tested: CSV path readback, graph drift, focused non-DB Bot Runtime tests; DB-backed e2e blocked by missing local Postgres.
- What is incomplete: no product/runtime behavior gap remains for this issue; DB-backed e2e rerun needs local Postgres available.
- Next steps: continue existing release/protected-proof lanes; no child issue needed for this relation repair.
- Decisions made: use existing service/e2e tests as relation targets rather than creating duplicate repository-only tests.
