# 11 Assistant Runtime

## Purpose
Define the place of the assistant layer inside Soar without letting it override core runtime safety.

## Current Implementation Scope
The current audited implementation is an assistant foundation, not a trading
hot-path authority.

It supports:
- bot-scoped assistant configuration
- one main assistant plus bounded subagent slots
- deterministic orchestration contracts and isolated orchestrator tests
- owner-scoped dry-run diagnostics

It does not currently claim an audited BACKTEST, PAPER, or LIVE trading
decision-loop call site. Hot-path assistant orchestration is future/gated scope
until implemented with fail-closed runtime integration, persisted traces, and
AI red-team evidence.

## Assistant Role
The assistant layer is currently a constrained assistant foundation. A future
approved slice may promote it into a constrained runtime orchestration layer.

It may:
- analyze structured context
- coordinate bounded subagent roles
- produce one deterministic proposal

It may not:
- bypass safety guards
- mutate source-of-truth ownership rules
- invent execution authority outside the bot mandate

## Topology
- one main assistant per bot
- up to four subagents
- bot-scoped configuration

## Canonical Roles
- `TREND`
- `MOMENTUM`
- `RISK`
- `MICROSTRUCTURE`
- `GENERAL`

## Input Contract
Assistant input contains, for dry-run/foundation paths today and future
hot-path paths after approval:
- request identifiers
- user and bot scope
- symbol and interval window
- market snapshot
- strategy context
- risk context
- execution mode

## Output Contract
Assistant output contains:
- role
- proposal
- confidence
- rationale
- structured signals
- policy flags
- latency

## Merge and Safety Rules
These rules are mandatory for current dry-run/foundation behavior and for any
future hot-path assistant integration:

- safety guards remain first
- deterministic merge remains mandatory
- tie or invalid merge resolves to `NO_TRADE`
- assistant timeouts degrade safely
- runtime can continue in strategy-only mode when assistant logic is unavailable

## Degradation Rules
- partial subagent failure does not automatically kill the cycle
- main-assistant failure must degrade safely
- all failures remain traceable in audit metadata

## Non-Goals
- runtime self-training in the hot path
- free-form unstructured action authority
- cross-user memory writes inside synchronous trading execution

## Supporting Reference
- `reference/assistant-runtime-contract.md`

## Related Files
- [05 Strategy, Signal, and Decision Flow](./05_strategy-signal-and-decision-flow.md)
- [10 Safety, Entitlements, and Risk](./10_safety-entitlements-and-risk.md)
