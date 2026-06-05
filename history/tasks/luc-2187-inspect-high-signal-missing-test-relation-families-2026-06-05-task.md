# LUC-2187 Inspect High-Signal Missing-Test Relation Families

## Header
- ID: LUC-2187
- Title: Inspect remaining high-signal missing-test relation families
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Priority: P1
- Module Confidence Rows: SOAR-POSITIONS-001; SOAR-PROFILE-API-KEYS-001; SOAR-ORDERS-001; SOAR-MANUAL-ORDERS-001
- Mission ID: LUC-2187-HIGH-SIGNAL-MISSING-TEST-RELATION-FAMILIES-2026-06-05
- Mission Status: VERIFIED

## Context
`LUC-2175` classified `896` actionable missing-test rows as mostly aggregate tooling/protected proof boundaries, with only three high-signal follow-up candidates left for owner inspection: API positions helpers, API-key crypto helpers, and order fill/math helpers.

The previous heartbeat failed during Codex adapter setup (`EEXIST` symlink for `auth.json`), not during Soar validation.

## Goal
Inspect the three named helper families and either add focused coverage or record why existing aggregate proof is sufficient.

## Scope
- `apps/api/src/modules/positions/livePositionReconciliation.helpers.ts`
- `apps/api/src/utils/crypto.ts`
- `apps/api/src/modules/orders/positionFillMath.ts`
- `docs/architecture/relations/priority-test-links.csv`
- `docs/modules/api-orders.md`
- `docs/modules/api-positions.md`
- `docs/modules/api-profile.md`

## Implementation Plan
1. Inspect current code and tests for the named helper families.
2. Add the narrowest focused coverage only where absent.
3. Add scanner-readable direct test relation rows for the inspected families.
4. Run focused DB-free tests and architecture graph validation.
5. Record family evidence states and residual blockers.

## Acceptance Criteria
- Each inspected family has evidence state: verified, implemented not verified, missing, or blocked by error.
- If coverage is missing, add the narrowest focused test or direct graph relation.
- Run focused validation and record exact results.
- Avoid production auth/session, protected smoke, secret readback, exchange mutation, live-trading action, deploy, restart, rollback, and non-fixture DB mutation.

## Definition of Done
- [x] API positions helpers classified with focused proof.
- [x] API-key crypto helpers classified with focused proof.
- [x] Order fill/math helpers covered by a new focused unit test.
- [x] Direct test relation rows added for the three inspected families.
- [x] Focused validation recorded.
- [x] Source-of-truth docs/state updated.

## Validation Evidence
- `pnpm --filter api exec vitest run src/modules/orders/positionFillMath.test.ts src/utils/crypto.test.ts --pool=forks --maxWorkers=1 --minWorkers=1 --testTimeout=30000` -> PASS (`2` files / `8` tests).
- `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts -t "imported external position id helpers" --pool=forks --maxWorkers=1 --minWorkers=1 --testTimeout=30000` -> PASS (`1/1`, `33` skipped).
- Full targeted positions reconciliation file attempt was blocked by local DB availability: six DB-backed cases failed before assertions with Prisma `Can't reach database server at localhost:5432`.
- `pnpm run architecture:graph:generate` -> PASS (`651` nodes / `842` relations / `27` chains).
- `pnpm run architecture:graph:drift:strict` -> PASS (`823/823` covered / `0` missing).
- `git diff --check -- apps/api/src/modules/orders/positionFillMath.test.ts docs/architecture/relations/priority-test-links.csv` -> PASS.
- `node --check scripts/build-architecture-awareness-index.mjs` -> blocked by error: script is not present in this checkout.

## Family Evidence States
| Family | State | Evidence | Residual Risk |
| --- | --- | --- | --- |
| API positions helpers | verified for DB-free helper relation; DB-backed aggregate proof blocked by local DB | Existing `livePositionReconciliation.service.test.ts` covers imported external id helper behavior; direct relation added to `priority-test-links.csv`; focused subset passed `1/1`. | Full reconciliation default-deps cases still require local Postgres. |
| API-key crypto helpers | verified | Existing `crypto.test.ts` passed `4/4`; direct relation added to `priority-test-links.csv`. | No protected secret readback was attempted. |
| Order fill/math helpers | verified | Added `positionFillMath.test.ts` with weighted average, empty position, invalid fill price, and negative normalization coverage; direct relation added to `priority-test-links.csv`; focused test passed `4/4`. | DB-backed order lifecycle tests remain separate aggregate proof. |

## Architecture Evidence
- Architecture source reviewed: `docs/status/architecture-awareness-report.md`, `docs/architecture/indices/function-chain-evidence-index.csv`, module docs, and existing focused tests.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: direct helper-to-test relations added in `docs/architecture/relations/priority-test-links.csv`.

## Security / Privacy Evidence
- Data classification: local test fixtures and source metadata only.
- Secret handling: no secret values, cookies, API keys, or protected credentials were read or stored.
- Fail-closed behavior: crypto helper coverage remains local/unit only; protected secret readback remains outside scope.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Runtime or database mutation: none outside attempted DB-backed tests, which failed before fixture writes because local Postgres was unreachable.

## Result Report
- Task summary: classified the three high-signal missing-test relation families and closed the only confirmed focused gap by adding `positionFillMath.test.ts`.
- Files changed:
  - `apps/api/src/modules/orders/positionFillMath.test.ts`
  - `docs/architecture/relations/priority-test-links.csv`
  - `docs/modules/api-orders.md`
  - `docs/modules/api-positions.md`
  - `docs/modules/api-profile.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.agents/state/system-health.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- What is incomplete: full DB-backed `livePositionReconciliation.service.test.ts` remains blocked in this runner by missing local Postgres at `localhost:5432`.
- Next steps: none for `LUC-2187`; DB-backed reconciliation proof stays an environment/runtime follow-up when local Postgres is restored.
