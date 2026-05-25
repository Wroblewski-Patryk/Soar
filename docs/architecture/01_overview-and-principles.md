# 01 Overview and Principles

## Purpose
Define what Soar is, what this architecture set covers, and which design principles are non-negotiable.

## System Definition
Soar is a crypto-trading operations platform for:
- strategy configuration,
- market-universe management,
- backtests,
- paper trading,
- live trading,
- runtime monitoring,
- operator-safe intervention.

It is not a black-box profit engine.

## Primary Outcome
The primary system goal is reliable, explainable, and fail-closed trading automation.

Before feature expansion, Soar must preserve:
- runtime correctness,
- operator clarity,
- parity across backtest, paper, and live where parity is intended,
- explicit ownership of execution context.

## Core Principles
- Safety before convenience.
- Source-of-truth ownership must be explicit.
- Backtest, paper, and live should share one logical model wherever possible.
- Runtime decisions must be auditable.
- Operators must understand status and required actions quickly.
- No hidden fallbacks for critical trading context.

## Architecture Layers
1. System overview and topology
2. Domain entities and relationships
3. Runtime context ownership
4. Strategy, signal, and decision flow
5. Execution and lifecycle management
6. Mode parity and data model
7. Operator-facing surfaces
8. Integrations, deployment, and runtime services
9. Safety, entitlements, and risk guardrails
10. Assistant runtime
11. Documentation governance

## Canonical Non-Goals
- No financial-advice claims.
- No optimistic runtime behavior when context is incomplete.
- No architecture defined only implicitly in code.
- No plan files acting as the long-term source of runtime truth.

## Canonical Terms
- `runtime unit`: a bot operating in an execution context
- `execution context`: mode, venue context, capital context, and ownership constraints
- `venue context`: exchange + market type + base currency
- `parity`: same logical decision contract across modes, with only approved adapter differences
- `fail-closed`: reject or degrade safely instead of guessing

## MVP vs Later
### Current canonical baseline
- Binance and Gate.io exchange implementation scope, with production/live
  readiness evidence-bound by exact exchange, market type, and operation
- multi-user architecture
- responsive web as the primary product surface
- assistant foundation supported for bot-scoped configuration, deterministic
  orchestration contracts, and dry-run diagnostics; trading hot-path assistant
  orchestration remains later/gated scope

### Later extensions
- additional exchanges beyond Binance and Gate.io
- richer admin and billing surfaces
- hot-path assistant autonomy after fail-closed integration and AI red-team
  evidence
- broader observability automation

## Related Files
- [02 System Topology](./02_system-topology.md)
- [03 Domain Model](./03_domain-model.md)
- [10 Safety, Entitlements, and Risk](./10_safety-entitlements-and-risk.md)
