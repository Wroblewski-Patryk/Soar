# 09 Integrations, Deployment, and Runtime Services

## Purpose
Define how Soar integrates with exchanges and how runtime services are deployed and exposed.

## Exchange Integration Model
- exchange-specific behavior lives behind adapters
- the browser never owns direct exchange transport
- server-side infrastructure owns live stream fan-out and execution commands

## Stream Contract
Current frontend live-stream transport is:
- exchange ingest in worker layer
- server-owned SSE fan-out to clients

The canonical dashboard stream endpoint is:
- `GET /dashboard/market-stream/events`

## Runtime Service Baseline
- `market-data`
- `market-stream`
- `backtest`
- `execution`

Each service has explicit ownership. Worker responsibilities must not be implicit in web or API code.

## Health and Readiness
Canonical health surfaces:
- `/health`
- `/ready`
- `/metrics`
- `/workers/health`

## Deployment Baseline
Primary deployment target:
- Coolify on VPS

Canonical environment split:
- local `DEV`
- VPS `STAGE`
- VPS `PROD`

## Process Ownership
- `web` and `api` are separate deployable services
- workers remain separate from API for runtime clarity and production safety
- persistent stores are `postgres` and `redis`

## Deployment Safety Rules
- keep environment ownership explicit
- keep rollback path explicit
- keep health checks and smoke checks versioned with operations docs

## Canonical Runtime Freshness Rule
Operator surfaces may degrade when stream or polling freshness is lost, but they must expose that degradation explicitly.

## Out of Scope
- CI workflow specifics
- incident evidence packs
- per-wave rollout sequencing

## Supporting References
- `reference/stream-transport-contract.md`
- `archive/tech-stack.md`

## Related Files
- [02 System Topology](./02_system-topology.md)
- [08 Operator Surfaces and Routing](./08_operator-surfaces-and-routing.md)
