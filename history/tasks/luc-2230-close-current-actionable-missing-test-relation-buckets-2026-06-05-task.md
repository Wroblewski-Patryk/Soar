# LUC-2230 Close Current Actionable Missing-Test Relation Buckets

## Header
- ID: LUC-2230
- Title: [Soar][Test Automation] Close current actionable missing-test relation buckets
- Task Type: test automation / architecture repair
- Current Stage: verification
- Status: DONE
- Owner: Test Automation Engineer
- Depends on: [LUC-2227](/LUC/issues/LUC-2227)
- Priority: P1
- Module Confidence Rows: Architecture Evidence Graph; API Bots; API Engine
- Requirement Rows: REQ-DOC-029; REQ-DOC-030
- Risk Rows: RISK-DOC-005
- Iteration: 2026-06-05
- Operation Mode: TESTER
- Mission ID: LUC-2230-CURRENT-ACTIONABLE-MISSING-TEST-RELATION-BUCKET-CLOSURE-2026-06-05
- Mission Status: VERIFIED

## Context
The scoped Paperclip wake assigned [LUC-2230](/LUC/issues/LUC-2230) directly
to Test Automation with no pending comments and `fallbackFetchNeeded=false`.
[LUC-2227](/LUC/issues/LUC-2227) converted the architecture-awareness backlog
into executable repair work. The source report generated
`2026-06-05T12:40:45.169Z` showed `859` actionable implementation entities
without inferred tests.

## Goal
Close the next safe local missing-test relation slice without converting
protected production proof collectors into false local confidence.

## Constraints
- Do not touch production, secrets, deploy, protected smoke, accounts,
  exchange state, or live trading.
- Do not add scanner suppressions or workaround paths.
- Link only rows with focused local proof or honest aggregate helper coverage.
- Keep protected/prod collector rows separate.

## Definition of Done
- [x] Current actionable missing-test count is recorded before and after.
- [x] Selected relation rows reference existing graph entities and test files.
- [x] Focused tests proving the linked helper families pass.
- [x] Architecture-awareness exports are refreshed.
- [x] Architecture graph generation and strict drift pass.
- [x] Residual protected/prod rows remain explicitly outside this local closure.

## Implementation
Added `24` direct scanner-readable rows to
`docs/architecture/relations/priority-test-links.csv` for focused local helper
families:

- `runtimeSessionPositionDcaCount.ts#resolveRuntimePositionDcaCount`
- `runtimeStrategyProtectionFallbackDisplay.ts#canUseStrategyProtectionFallbackForDisplay`
- `runtimeExchangeSyncedPositionPrice.ts` helper functions
- `runtimeSignalMarketDataGateway.ts` store/candle/order-book helper functions
- `sharedCandlePatternSeries.ts` pattern helper functions
- `strategyIndicatorRegistry.ts` registry helper functions
- selected `strategySignalAnalysis.ts` helper relation

No runtime code changed.

## Validation Evidence
- Targeted relation readback for `LUC-2230` rows:
  - `24` rows
  - `0` missing entity/test paths
  - `0` duplicate exact pairs
- Focused API tests:
  - `pnpm --filter api exec vitest run src/modules/bots/runtimeSessionPositionsRead.service.test.ts src/modules/engine/runtimeLifecycleMarkPrice.service.test.ts src/modules/engine/runtimeSignalMarketDataGateway.test.ts src/modules/engine/sharedCandlePatternSeries.test.ts src/modules/engine/strategyIndicatorRegistryParity.test.ts src/modules/engine/strategySignalAnalysis.test.ts --run --reporter=dot`
  - PASS: `6` files / `39` tests
- Softwarehouse architecture-awareness refresh:
  - command: `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - PASS: `14342` entities / `22490` relations
  - generated: `2026-06-05T16:02:05.428Z`
- Before/after scanner counts:
  - raw missing tests: `7654` -> `7630`
  - actionable missing tests: `859` -> `835`
  - actionable missing docs: `0` -> `0`
  - `LUC-2230` target rows remaining in actionable missing-test samples: `0`
- `pnpm run architecture:graph:generate`:
  - PASS: `651` nodes / `842` relations / `27` chains
- `pnpm run architecture:graph:drift:strict`:
  - PASS: `824/824`, `0` missing

## Architecture Evidence
- Affected chains:
  - `CHAIN-RUNTIME-SUPPORT-SERVICES`
  - `CHAIN-ENGINE-RUNTIME-CORE`
  - Architecture Evidence Graph
- Fits approved architecture: yes.
- Reused existing relation ingestion through `priority-test-links.csv`.
- No workaround or parallel scanner mechanism was introduced.

## Security / Deployment Evidence
- Deploy impact: none.
- Secret/account/protected-smoke impact: none.
- Database impact: none.
- Exchange/live-trading impact: none.
- Browser/dev-server processes started: none.

## Result Report
- Task summary: closed the current local helper relation bucket by adding `24`
  focused `tests` relations and refreshing the architecture-awareness exports.
- Files changed:
  - `docs/architecture/relations/priority-test-links.csv`
  - `docs/graphs/architecture-awareness.json`
  - `docs/graphs/architecture-awareness.csv`
  - `docs/graphs/architecture-proof-register.csv`
  - `docs/graphs/architecture-health.json`
  - `docs/status/architecture-awareness-report.md`
  - generated status exports under `docs/status/`
  - `history/tasks/luc-2230-close-current-actionable-missing-test-relation-buckets-2026-06-05-task.md`
- What is incomplete:
  - `835` actionable missing-test rows remain after this local closure.
  - Top residual rows still include protected production proof collectors,
    script/tooling rows without focused local tests, local/release/Ops aggregate
    scripts, and API script/helper functions.
  - Protected production proof remains outside this issue and still requires
    approved Security/Ops/QA gates where applicable.
- Commit: not committed in this heartbeat.
- Push: not needed.
- Deployment impact: none.
