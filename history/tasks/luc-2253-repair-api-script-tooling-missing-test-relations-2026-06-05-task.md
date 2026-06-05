# LUC-2253 Repair API Script Tooling Missing-Test Relations

## Header
- ID: LUC-2253
- Title: [Soar][Backend QA] Repair API script and tooling missing-test relations
- Task Type: backend QA / architecture-awareness relation repair
- Current Stage: verification
- Status: DONE with unrelated gate blockers recorded
- Owner: Backend API Engineer
- Priority: P1
- Module Confidence Rows: Architecture Evidence Graph; API script/tooling
- Mission ID: LUC-2253-API-SCRIPT-TOOLING-MISSING-TEST-RELATION-REPAIR-2026-06-05
- Operation Mode: BUILDER

## Context
The scoped Paperclip wake targeted [LUC-2253](/LUC/issues/LUC-2253) with no
pending comments and `fallbackFetchNeeded=false`; checkout was already claimed
by the harness and was not repeated. The issue targeted current top API script
samples from `docs/status/architecture-awareness-report.md`.

## Goal
Close direct test/proof relation gaps for named API script helper functions
without requiring local Postgres, external network calls, migrations, process
spawning, protected production smoke, or live-trading actions.

## Scope
- Make API script helper surfaces import-safe where needed.
- Export deterministic helper functions and dependency-inject DB-adjacent
  helpers so they can be tested DB-free.
- Add focused proof for API script helper behavior.
- Add scanner-readable direct `tests` rows for the assigned function-level
  architecture samples.
- Regenerate architecture graph and architecture-awareness exports.
- Exclude frontend rendering, route changes, database migrations, deploy,
  restart, rollback, env/account mutation, secret readback, exchange mutation,
  and live-trading actions.

## Constraints
- Do not execute DB/network/process-spawning wrapper behavior in local tests.
- Do not invent relations for behavior that is not represented by import-safe
  helper proof.
- Preserve CLI behavior for scripts when invoked directly.
- Leave unrelated dirty workspace changes intact.

## Definition of Done
- [x] Focused API script proof passes.
- [x] Targeted relation readback for [LUC-2253](/LUC/issues/LUC-2253) rows has
  no missing referenced files and no duplicate exact relation rows.
- [x] Architecture graph generation passes.
- [x] Architecture-awareness refresh completes and report readback shows `0`
  assigned target rows remaining in top actionable samples.
- [x] Strict graph drift is run and any blocker is exact.
- [x] Source-of-truth state and issue disposition are updated.

## Forbidden
- Runtime/product behavior changes outside import-safety and helper exports.
- Local Postgres mutation, migration execution, external market-data calls,
  process spawning from tests, protected production smoke, secret readback,
  exchange mutation, or live order/cancel/close.
- Scanner suppressions or parallel relation systems.

## Implementation
- Added `apps/api/scripts/apiScriptTooling.test.ts`.
- Made named API scripts import-safe by guarding direct CLI execution:
  `assistant-load-benchmark.ts`, `backfillBacktestVenueContext.ts`,
  `bot-v2-preflight-report.ts`, `exportPaperRuntimeSnapshot.ts`,
  `gateioMarketStreamSourceSmoke.ts`, `importPaperRuntimeSnapshot.ts`,
  `verifyWalletDbFoundation.ts`, `load-test.mjs`, and
  `start-with-migrate.mjs`.
- Exported deterministic helpers and wrapper functions for focused tests.
- Added dependency injection to `ensureUser` and `readCount` so DB-adjacent
  helper behavior is testable with fake clients.
- Added `26` direct [LUC-2253](/LUC/issues/LUC-2253) function-level relation
  rows in `docs/architecture/relations/priority-test-links.csv`.

## Validation Evidence
- `pnpm --filter api exec vitest run scripts/apiScriptTooling.test.ts --run`
  -> PASS (`1` file / `7` tests).
- Targeted relation readback for [LUC-2253](/LUC/issues/LUC-2253) rows -> PASS:
  `26` rows, `0` missing referenced paths, `0` duplicate exact pairs.
- `node --check apps/api/scripts/load-test.mjs` and
  `node --check apps/api/scripts/start-with-migrate.mjs` -> PASS.
- `pnpm run architecture:graph:generate` -> PASS (`651` nodes / `842`
  relations / `27` chains).
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  -> PASS with redirected output; `14388` entities / `22625` relations,
  generated `2026-06-05T18:23:53.329Z`.
- Report readback after refresh -> PASS: actionable missing-test rows `816`;
  `0` assigned [LUC-2253](/LUC/issues/LUC-2253) target rows remain in top
  actionable samples.
- `pnpm run architecture:graph:drift:strict` -> BLOCKED by unrelated Web page
  graph drift: `826/828` covered, missing
  `apps/web/src/app/(public)/privacy/page.tsx` and
  `apps/web/src/app/(public)/terms/page.tsx`.
- `pnpm --filter api run typecheck` -> BLOCKED by unrelated existing test
  typing failures:
  `src/modules/positions/positions.orphan-repair.contract.e2e.test.ts(77,26)`
  and `src/router/workers-health-readiness.test.ts(37,58)`.

## Security / Privacy Evidence
- Data touched: local source metadata, API script helper code, focused tests,
  relation CSV, and generated graph/status exports.
- No secret values, cookies, API keys, account data, production data,
  screenshots, or exchange credentials were read or stored.
- DB/network/process-spawning script behavior was not executed by the focused
  proof.

## Deployment / Ops Evidence
- Deploy impact: none.
- Runtime impact: direct CLI behavior preserved; import-time side effects
  removed for testability.
- Env/database/account/exchange mutation: none.
- Production smoke: not run and not claimed.

## Result Report
- Task summary: repaired the assigned API script/tooling missing-test relation
  bucket with import-safe helper exports, DB-free focused proof, and direct
  architecture relation rows.
- Files changed in this lane:
  - `apps/api/scripts/apiScriptTooling.test.ts`
  - `apps/api/scripts/assistant-load-benchmark.ts`
  - `apps/api/scripts/backfillBacktestVenueContext.ts`
  - `apps/api/scripts/bot-v2-preflight-report.ts`
  - `apps/api/scripts/exportPaperRuntimeSnapshot.ts`
  - `apps/api/scripts/gateioMarketStreamSourceSmoke.ts`
  - `apps/api/scripts/importPaperRuntimeSnapshot.ts`
  - `apps/api/scripts/load-test.mjs`
  - `apps/api/scripts/start-with-migrate.mjs`
  - `apps/api/scripts/verifyWalletDbFoundation.ts`
  - `docs/architecture/relations/priority-test-links.csv`
  - generated graph/status exports under `docs/graphs/` and `docs/status/`
  - source-of-truth state files.
- Residual risk:
  - wrapper entry points are import-safe and type-present in tests, but DB,
    network, migration, and process-spawning execution paths were deliberately
    not run in this DB-free local proof.
  - strict graph drift and API typecheck remain blocked by unrelated files
    outside this backend script relation lane.
- Commit/push/deploy disposition: no commit, push, or deploy performed because
  the workspace contains mixed cross-lane dirty state.
