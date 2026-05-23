---
type: docs_map
status: canonical
area: runtime
last_verified: 2026-05-23
graph_role: map
---

# Runtime Map

## Primary Runtime Path

1. [Execution lifecycle](../architecture/06_execution-lifecycle.md)
2. [Strategy, signal, and decision flow](../architecture/05_strategy-signal-and-decision-flow.md)
3. [Modes, parity, and data](../architecture/07_modes-parity-and-data.md)
4. [Module confidence ledger](../../.agents/state/module-confidence-ledger.md)

## Contracts To Check

Use these paths for exact behavior without adding every contract as a graph
edge from this map:

| Path | Use |
| --- | --- |
| `docs/architecture/reference/runtime-signal-merge-contract.md` | Signal merge and decision truth. |
| `docs/architecture/reference/execution-lifecycle-parity-contract.md` | PAPER/LIVE lifecycle parity. |
| `docs/architecture/reference/runtime-execution-idempotency-contract.md` | Dedupe and idempotency. |
| `docs/architecture/reference/live-paper-runtime-safety-contract.md` | LIVE/PAPER safety boundary. |
| `docs/architecture/reference/live-protection-state-parity-contract.md` | DCA/TTP/TSL protection truth. |

## Module Deep Dives

Start from `docs/modules/module-registry.md`, then inspect the relevant module:
API bots, engine, orders, positions, wallets, exchange, Dashboard Home, or Web
bots.

## Evidence And State

Use `history/evidence/evidence-history.md` for readable proof and
`history/audits/audit-history.md` for inspection history.

## Use This Map When

- checking live/paper/backtest parity;
- debugging trading lifecycle, order ownership, fills, DCA, TTP/TSL, or dedupe;
- deciding which tests and proof artifacts matter for runtime safety.
