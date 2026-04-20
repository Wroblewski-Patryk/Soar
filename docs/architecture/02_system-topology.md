# 02 System Topology

## Purpose
Describe the high-level structure of Soar and the runtime boundaries between its major parts.

## Runtime Shape
Soar is a modular monolith with explicit runtime service separation.

Primary parts:
- `web`: Next.js operator UI
- `api`: Express application and public product API
- `workers`: background runtime services
- `postgres`: persistent system-of-record data
- `redis`: cache, coordination, and runtime support

## Runtime Service Roles
- `web`
  - renders authenticated and public UI
  - never connects directly to exchange infrastructure
- `api`
  - owns authenticated reads and commands
  - exposes SSE fan-out and runtime read models
  - applies ownership and fail-closed validation
- `market-data` worker
  - owns market-data ingestion and related caching jobs
- `market-stream` worker
  - ingests exchange WebSocket events and feeds server-side stream fan-out
- `backtest` worker
  - executes queued backtest jobs
- `execution` worker
  - owns continuous runtime signal evaluation and execution coordination

## System Flow
1. Operators configure wallets, markets, strategies, and bots in `web`.
2. `api` validates and persists configuration.
3. Workers ingest market data and runtime events.
4. The execution runtime evaluates strategies and risk gates.
5. Allowed decisions become orders, fills, positions, and telemetry.
6. `api` exposes read models for dashboard and bot monitoring.
7. `web` renders operator-facing state and guarded actions.

## Bounded Contexts
- `product configuration`
  - users, subscriptions, wallets, markets, strategies, bots
- `runtime trading`
  - signals, orders, positions, trades, lifecycle automation
- `analysis`
  - backtests, reports, replay diagnostics
- `operations`
  - deployment, smoke checks, rollback, incidents

## Canonical Boundaries
- `web` owns presentation and interaction, not trading truth.
- `api` owns contracts, validation, and read/write orchestration.
- workers own continuous runtime loops and heavy asynchronous processing.
- exchange adapters own venue-specific execution behavior.

## High-Level Invariants
- browser never talks directly to exchange WebSockets or order APIs
- runtime side effects must be replay-safe
- critical trading flows must remain fail-closed
- runtime topology must stay explicit: `User -> Bot -> Market Group -> Strategy`

## Deployment Baseline
- local development via Docker Compose
- stage and production on Coolify-managed VPS
- separate web, api, worker, postgres, and redis process ownership

## Related Files
- [04 Runtime Contexts](./04_runtime-contexts.md)
- [09 Integrations, Deployment, and Runtime Services](./09_integrations-deployment-and-runtime-services.md)
