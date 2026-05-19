# Bots And Runtime Truth Audit - 2026-05-19

## Scope

Audit ID: `AUD-10`

Purpose: verify the discrepancy risk between documented bot/runtime behavior
and the current implementation.

This audit inspected and validated:

- bot lifecycle CRUD and ownership isolation
- wallet-first bot write contract
- subscription and LIVE entitlement gates
- duplicate active-bot protection
- canonical market-group and strategy-link runtime scope
- runtime graph, sessions, symbol stats, positions, trades, and aggregate
  monitoring
- runtime history parity and diagnostics
- LIVE/PAPER concurrent runtime isolation
- imported/takeover runtime visibility
- bot delete cleanup of bot-owned runtime/trading artifacts
- Web bot management and Dashboard Home runtime surfaces

Assistant config/dry-run is part of the Bots module, but assistant hot-path
runtime integration is tracked by `AUD-20` and is not reclassified here.

## Result

Status: `current local / current historical production-safe proof`

The audited bot/runtime implementation is aligned with the documented V1
contracts for local behavior. Focused API and Web proofs passed.

The latest production-safe proof remains historical 2026-05-14 evidence for
disposable bot fixture behavior and read-only runtime readback. No production
journey was rerun in this audit.

## Validation Run

| Command / Proof | Result | Notes |
| --- | --- | --- |
| `corepack pnpm --filter web exec vitest run src/features/bots/components/BotsManagement.test.tsx src/features/bots/components/BotsListTable.test.tsx src/features/bots/components/BotCreateEditForm.test.tsx src/features/bots/services/botsMonitoringAggregate.service.test.ts src/features/bots/utils/runtimeSurfaceTruth.test.ts src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.runtime-table-audit.test.tsx src/features/dashboard-home/hooks/useHomeLiveWidgetsController.test.tsx` | PASS | `8` files, `61` tests. Covers bot management, list/form behavior, runtime surface truth, monitoring aggregate mapping, and Dashboard Home runtime widgets/controller behavior. |
| `corepack pnpm run go-live:infra:up` | PASS | Started local Postgres/Redis for DB-backed API proof. |
| `corepack pnpm --filter api exec vitest run src/modules/bots/bots.e2e.test.ts src/modules/bots/bots.duplicate-guard.e2e.test.ts src/modules/bots/bots.subscription-entitlements.e2e.test.ts src/modules/bots/bots.wallet-contract.e2e.test.ts src/modules/bots/bots.runtime-scope.e2e.test.ts src/modules/bots/bots.monitoring-aggregate.e2e.test.ts src/modules/bots/bots.runtime-history-parity.e2e.test.ts src/modules/bots/bots.delete-cleanup.e2e.test.ts src/modules/bots/bots.live-paper-concurrent.e2e.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts` | PASS | `10` files, `88` tests. Covers CRUD, ownership, wallet-first write contract, duplicate/LIVE overlap guards, entitlements, runtime scope, aggregate truth, history parity, takeover visibility, LIVE/PAPER isolation, and delete cleanup. |
| `corepack pnpm run go-live:infra:down` | PASS | Local Postgres/Redis containers and network were removed after validation. |

## Architecture And Documentation Parity

Reviewed sources:

- `docs/analysis/reusable-audit-registry.md`
- `docs/modules/api-bots.md`
- `docs/modules/api-engine.md`
- `docs/modules/web-bots.md`
- `docs/architecture/03_domain-model.md`
- `docs/architecture/04_runtime-contexts.md`
- `docs/architecture/06_execution-lifecycle.md`
- `docs/architecture/08_operator-surfaces-and-routing.md`
- `.agents/state/module-confidence-ledger.md`
- `.agents/state/requirements-verification-matrix.md`
- `.agents/state/risk-register.md`

No new architecture-code mismatch was found for `AUD-10`. Current code and
tests match the documented bot/runtime V1 contracts for the audited local
scope.

## Findings

| ID | Severity | Finding | Evidence | Status |
| --- | --- | --- | --- | --- |
| AUD-BOT-001 | P0 | Bot lifecycle, ownership, wallet-first writes, duplicate guards, and entitlement gates are current locally. | API bot pack passed `10` files / `88` tests. | closed |
| AUD-BOT-002 | P0 | Runtime monitoring aggregate, selected-bot scope, runtime history, takeover visibility, and LIVE/PAPER isolation are current locally. | API bot pack passed `10` files / `88` tests; Web runtime pack passed `8` files / `61` tests. | closed |
| AUD-BOT-003 | P0 | Bot delete cleanup of bot-owned runtime/trading artifacts is current locally. | `bots.delete-cleanup.e2e.test.ts` passed inside the focused API pack. | closed |
| AUD-BOT-004 | P1 | Production proof for bot/runtime remains historical and scoped. | Latest accepted production-safe evidence is from 2026-05-14; this audit did not run production mutation or a new production readback. | open freshness follow-up |
| AUD-BOT-005 | P1 | Assistant hot-path runtime integration remains separate and unresolved. | `AUD-20` found config/dry-run foundation but no audited BACKTEST/PAPER/LIVE hot-path assistant call site. | tracked by `AUD-20` |

## Safety Notes

- No production journey was run.
- No LIVE order, cancel, close, activation, or exchange-side mutation was run.
- No existing production data was mutated.
- Local Postgres/Redis were started only for DB-backed tests and then stopped.

## Current Reusable Audit State

`AUD-10` is current for local V1 bot/runtime behavior and remains backed by
historical production-safe fixture/readback evidence from 2026-05-14.

Keep this audit open for:

1. refreshing production-safe bot/runtime proof after future deployments;
2. any approved production disposable bot action proof;
3. any future Gate.io/second-LIVE production resource-shape proof;
4. the separate `AUD-20` assistant hot-path architecture decision.
