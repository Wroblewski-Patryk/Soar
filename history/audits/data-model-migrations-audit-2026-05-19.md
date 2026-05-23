# Data Model And Migrations Audit - 2026-05-19

Audit ID: `AUD-07`
Status: current local with mitigated test-isolation finding
Environment: local Postgres/Redis via `corepack pnpm run go-live:infra:up`

## Scope

This audit compares the current Prisma schema and migration behavior against the
implemented app contracts for user-scoped trading data, wallets/capital,
backtests/reports, runtime telemetry, exchange-scoped market data, subscriptions,
and audit logs.

No production database, production journey, LIVE order/cancel/close,
exchange-side mutation, or existing production data mutation was performed.

## Evidence Run

| Check | Result | Evidence |
| --- | --- | --- |
| Prisma schema validation | PASS | `corepack pnpm --filter api exec prisma validate` |
| Local migration status | PASS | `corepack pnpm --filter api exec prisma migrate status`; `54` migrations found and database schema is up to date |
| Full local migration replay | PASS | `corepack pnpm --filter api exec prisma migrate reset --force --skip-seed`; all `54` migrations applied successfully |
| Schema diff generation | PASS | `corepack pnpm --filter api exec prisma migrate diff --from-empty --to-schema-datamodel prisma\schema.prisma --script` |
| Wallet data-contract e2e isolated | PASS | `corepack pnpm --filter api exec vitest run src/modules/wallets/wallets.e2e.test.ts`; `1` file / `24` tests |
| Backtests data-contract e2e isolated | PASS | `corepack pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts`; `1` file / `15` tests |
| Runtime repository contract | PASS | `corepack pnpm --filter api exec vitest run src/modules/engine/runtimeSignalLoop.repository.test.ts`; `1` file / `2` tests |
| Shared-DB parallel DB pack | FAIL, finding recorded | Running wallets/backtests DB e2e together against one local database caused FK cleanup conflicts such as `BacktestRun_userId_fkey`; isolated reset-and-run passes confirmed this is a test isolation/run-policy issue, not a failed migration replay |
| Canonical isolated DB audit runner | PASS | `corepack pnpm run audit:data:db-isolated` passed after local infra startup: schema validation PASS, migration status PASS, reset before each pack, wallets `24/24`, backtests `15/15`, runtime repository `2/2`. |

## Data-Model Truth

- `MarketCandleCache` is exchange/source-scoped through
  `@@unique([marketType, source, symbol, timeframe, openTime])` and matching
  hot-path indexes.
- Open position uniqueness is owned by manual partial indexes in
  `20260426003000_scope_open_position_uniqueness_by_wallet_or_bot`, separating
  wallet-owned, bot-owned, and unowned open positions.
- Active market-group scope is owned by the manual partial unique index in
  `20260503013000_enforce_single_active_bot_market_group`.
- Runtime idempotency is represented by `RuntimeExecutionDedupe.dedupeKey`
  uniqueness and TTL/status indexes.
- Wallet/capital state has user/wallet/time indexes for snapshots and cashflow,
  plus a wallet/exchange event/source uniqueness key for cashflow events.
- Logs have user/time and filter indexes for source, actor, and severity.
- Subscription and payment intent uniqueness/idempotency keys are present.

## Findings

| ID | Severity | Status | Finding | Evidence / Next Action |
| --- | --- | --- | --- | --- |
| AUD-DATA-001 | P0 | passed | Prisma schema is valid and local migration history replays cleanly. | `prisma validate`, `prisma migrate status`, and full local `migrate reset` all passed. |
| AUD-DATA-002 | P1 | passed with manual ownership | Critical invariants that Prisma cannot express directly are owned by manual migrations rather than the schema DSL. | Keep `20260426003000_scope_open_position_uniqueness_by_wallet_or_bot` and `20260503013000_enforce_single_active_bot_market_group` in audit scope for every future migration review. |
| AUD-DATA-003 | P1 | passed | Exchange/source-scoped market candle cache prevents Binance/non-Binance candle collisions at the storage layer. | Schema and `20260513223000_scope_market_candle_cache_by_source` agree. |
| AUD-DATA-004 | P1 | mitigated | DB-backed e2e packs are not safe to run in parallel on the same local database. | Wallet/backtest combined runs failed with FK cleanup conflicts and cross-test state effects; isolated reset-and-run passed. `corepack pnpm run audit:data:db-isolated` now provides the canonical sequential reset-and-run path. |
| AUD-DATA-005 | P2 | open freshness follow-up | Production migration status/backup/restore freshness was not rerun in this local audit. | Keep production DB proof under `AUD-19`; do not infer production deploy readiness from local migration replay alone. |

## Result

`AUD-07` is current for local schema validity, local migration replay, critical
data invariants, and representative wallet/backtest/runtime data contracts.
The DB-backed parallel execution finding is mitigated by a canonical isolated
runner. A separate production freshness lane remains under operations.
