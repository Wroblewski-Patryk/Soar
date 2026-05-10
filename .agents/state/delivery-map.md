# Delivery Map

Last updated: 2026-05-11

## Current Product Target

- Product: Soar
- Current release or milestone: V1 trading/runtime confidence
- Primary user: trading operator
- Primary outcome: Core bot, backtest, exchange, wallet, dashboard, and subscription journeys work with proof.
- Top blockers: Bot delete journey is currently marked broken in module confidence.
- Next mission: Reproduce and fix `SOAR-BOTS-001`.

## Source Inputs

| ID | Type | Source | What it defines | Status |
| --- | --- | --- | --- | --- |
| SRC-001 | architecture | `docs/architecture/` | Runtime, exchange, bot, safety, and product contracts | active |
| SRC-002 | planning | `docs/planning/mvp-execution-plan.md` | Historical and active release waves | active |
| SRC-003 | UX | `docs/ux/` | Dashboard design and screen quality rules | active |

## Module / Journey Map

| ID | Module | Journey or screen | Layers needed | Current state | Evidence | Next mission |
| --- | --- | --- | --- | --- | --- | --- |
| SOAR-DM-001 | Bots | Create, edit, delete, start/stop, monitor | web, API, DB, runtime, tests | broken | `.agents/state/module-confidence-ledger.md` row `SOAR-BOTS-001` | Reproduce delete failure, fix, test, update ledger. |
| SOAR-DM-002 | Release confidence | P0 journey inventory | web, API, runtime, ops, tests | planned | none | Replace with rows for bots, backtests, exchanges, wallets, strategies, subscriptions, auth, dashboard. |

## Visual Slice Map

| ID | Reference | Screen / zone | Components | States | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| SOAR-VIS-001 | TBD | Dashboard module surfaces | TBD | loading, empty, error, success, blocked | planned | none |
