# 09 Integrations, Deployment, and Runtime Services

## Purpose
Define how Soar integrates with exchanges and how runtime services are deployed and exposed.

## Exchange Integration Model
- exchange-specific behavior lives behind adapters
- the browser never owns direct exchange transport
- server-side infrastructure owns live stream fan-out and execution commands

For V1 capability truth:
- authenticated exchange reads and write-side execution are separate support
  families
- `LIVE_EXECUTION` alone is not enough to imply account-read or cancel support
- the canonical support matrix lives in
  `reference/exchange-access-ownership-matrix.md`

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

Worker ownership contract:
- deployed target (`STAGE`, `PROD`) = split workers
- allowed local/test fallback = inline ownership where explicitly chosen
- emergency degraded deploy fallback may be temporarily inline, but it must be
  treated as degraded and operator-visible rather than as canonical parity

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

The canonical deployed worker split is:
- `workers-market-data`
- `workers-market-stream`
- `workers-backtest`
- `workers-execution`

`inline` worker ownership is not the normal deployed contract. If used
temporarily outside local development, it must stay explicit in health,
readiness, and operator runbooks.

## Deployment Safety Rules
- keep environment ownership explicit
- keep rollback path explicit
- keep health checks and smoke checks versioned with operations docs
- keep worker mode truth explicit: split is healthy deployed baseline, inline
  is local/degraded-only

## Canonical Runtime Freshness Rule
Operator surfaces may degrade when stream or polling freshness is lost, but they must expose that degradation explicitly.

The same explicitness rule applies to worker ownership drift:
- split worker ownership may be reported as healthy deployed topology
- inline ownership in deployed environments must surface as degraded or
  exception-mode truth, never as silent equivalence

## Out of Scope
- CI workflow specifics
- incident evidence packs
- per-wave rollout sequencing

## Supporting References
- `reference/stream-transport-contract.md`
- `reference/exchange-access-ownership-matrix.md`
- `archive/tech-stack.md`

## Related Files
- [02 System Topology](./02_system-topology.md)
- [08 Operator Surfaces and Routing](./08_operator-surfaces-and-routing.md)
