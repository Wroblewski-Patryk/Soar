# LUC-1940 API data/N-A semantics for medium graph gaps

## Header
- ID: LUC-1940
- Title: [Soar][Backend] Resolve API data/N-A semantics for medium graph gaps
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend API Engineer
- Priority: P2
- Mission ID: LUC-1940-API-DATA-NA-SEMANTICS-2026-06-04
- Mission Status: PARTIALLY_VERIFIED

## Context
[LUC-1940](/LUC/issues/LUC-1940) was created from [LUC-1938](/LUC/issues/LUC-1938) cleanup queue to clear ambiguous `no_data_or_explicit_na` medium graph gaps for:

- `SOAR-API-STRATEGY-INDICATORS`
- `SOAR-API-MARKET-CATALOG`
- `SOAR-API-ICON-LOOKUP`
- `SOAR-API-MARKET-STREAM-EVENTS`

The scoped wake had no pending comments and checkout was already claimed by the harness, so checkout was not repeated.

## Goal
Make API data/source semantics explicit for the four medium graph candidates without changing runtime behavior.

## Scope
- `scripts/generateFunctionJourneyIndexes.mjs`
- `docs/architecture/relations/dependencies.csv`
- generated architecture graph and journey index outputs
- focused module docs:
  - `docs/modules/api-strategies.md`
  - `docs/modules/api-markets.md`
  - `docs/modules/api-icons.md`
  - `docs/modules/api-market-stream.md`

## Implementation Plan
1. Inspect route/service source and existing graph records.
2. Add explicit source relations where missing.
3. Teach the journey index generator to treat outgoing data/source relations as API data semantics.
4. Regenerate journey and architecture graph artifacts.
5. Run focused API/service tests and graph guardrails.
6. Record residual environment limits.

## Result Report
- `SOAR-API-STRATEGY-INDICATORS` now records static registry metadata through `SOAR-SERVICE-STRATEGY-INDICATORS`.
- `SOAR-API-MARKET-CATALOG` now records exchange public catalog metadata through `SOAR-SERVICE-EXCHANGE-MARKET-CATALOG`.
- `SOAR-API-ICON-LOOKUP` now records icon resolver/cache/provider/fallback source semantics through `SOAR-SERVICE-ICONS`.
- `SOAR-API-MARKET-STREAM-EVENTS` now resolves through existing fanout and worker source relations because the generator recognizes `subscribes_to` and `observes`.
- Runtime API behavior was not changed.

## Acceptance Criteria
- The four target API surfaces no longer emit `no_data_or_explicit_na`.
- Graph source-of-truth records explain non-DB/read-only/stream-backed semantics.
- Focused API/source tests or targeted proof are recorded.
- No deploy, restart, rollback, secret, account, database, or live-trading mutation occurs.

## Validation Evidence
- `node --check scripts/generateFunctionJourneyIndexes.mjs` -> PASS.
- `pnpm run architecture:journey:index` -> PASS; generated 27 chains, 36 web journeys, 96 API surfaces, 0 critical gaps, 28 high gaps.
- Direct JSON check of `docs/graphs/function-journey-index.json` -> PASS:
  - `SOAR-API-STRATEGY-INDICATORS data=SOAR-SERVICE-STRATEGY-INDICATORS gaps=""`
  - `SOAR-API-MARKET-CATALOG data=SOAR-SERVICE-EXCHANGE-MARKET-CATALOG gaps=""`
  - `SOAR-API-ICON-LOOKUP data=SOAR-SERVICE-ICONS gaps=""`
  - `SOAR-API-MARKET-STREAM-EVENTS data=SOAR-SERVICE-MARKET-STREAM-FANOUT; SOAR-WORKER-MARKET-STREAM-SUBSCRIPTIONS gaps=""`
- `pnpm run architecture:graph:generate` -> PASS; generated 647 nodes, 810 relations, 27 chains.
- `pnpm run architecture:graph:drift:strict` -> PASS; 816/816 covered, 0 missing.
- `pnpm run architecture:journey:index:strict` -> PASS; 0 critical gaps, user action index 0 critical gaps and 0 medium gaps.
- `pnpm --filter api test -- src/modules/strategies/indicators/indicators.service.test.ts src/modules/market-stream/marketStream.routes.contract.test.ts src/modules/exchange/exchangeMarketCatalog.service.test.ts --run` -> PASS; 3 files, 10 tests.
- `git diff --check` -> PASS with LF/CRLF warnings only.

## Blocked Verification
The DB-backed e2e command was attempted:

```powershell
pnpm --filter api test -- src/modules/strategies/indicators/indicators.service.test.ts src/modules/markets/markets.e2e.test.ts src/modules/icons/icons.e2e.test.ts src/modules/market-stream/marketStream.routes.contract.test.ts src/modules/market-stream/marketStream.routes.e2e.test.ts --run
```

Result: blocked by local infrastructure. `markets.e2e.test.ts`, `icons.e2e.test.ts`, and `marketStream.routes.e2e.test.ts` fail before route assertions because Prisma cannot reach PostgreSQL at `localhost:5432`. `docker compose ps` also fails because Docker Desktop Linux engine pipe is missing. No local database/container was started.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-evidence-graph-system.md`, API registry rows, dependency relations, module docs.
- Fits approved architecture: yes.
- Mismatch discovered: no runtime mismatch; only graph/index semantics were ambiguous.
- Decision required from user: no.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert graph/doc/generator changes; no runtime state was mutated.

## Review Checklist
- [x] Existing systems reused.
- [x] No workaround path introduced.
- [x] No runtime logic duplication introduced.
- [x] Architecture graph regenerated after relation changes.
- [x] Focused verification run and environment blocker recorded.

## Next Step
[LUC-1941](/LUC/issues/LUC-1941) can verify medium graph cleanup queue closure with the regenerated artifacts. DB-backed e2e can be rerun when local Postgres/Docker is available.
