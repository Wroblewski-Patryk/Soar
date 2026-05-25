# 09 Integrations, Deployment, and Runtime Services

## Purpose
Define how Soar integrates with exchanges and how runtime services are deployed and exposed.

## Exchange Integration Model
- exchange-specific behavior lives behind adapters
- the browser never owns direct exchange transport
- server-side infrastructure owns live stream fan-out and execution commands

The canonical integration key is `ExchangeContext = (exchange, marketType)`.
All exchange-owned behavior must resolve through that exact pair.

### Canonical Adapter Family Model
The approved scalable model is a family of narrow adapters behind one registry,
not one growing generic service and not feature modules importing exchange SDKs
directly.

Approved adapter families:
- `ExchangeMarketDataAdapter`
- `ExchangeMetadataAdapter`
- `ExchangeAccountAdapter`
- `ExchangeExecutionAdapter`

The registry key is the exact `(exchange, marketType)` pair.

Examples:
- `BINANCE + FUTURES`
- `BINANCE + SPOT`
- `BYBIT + FUTURES`

These pairs are different market domains. They must not share pricing,
indicator input, symbol rules, or account-read assumptions unless an adapter
explicitly owns that normalization.

### Canonical Boundary Rule
Feature modules outside `modules/exchange` must not import exchange SDKs or
exchange-specific constructors directly.

This includes:
- `ccxt`
- hardcoded `binance` or `binanceusdm` clients
- exchange REST endpoints embedded directly in non-exchange modules

`engine`, `markets`, `wallets`, `orders`, and other consumers must depend on
the exchange adapter families instead of low-level exchange clients.

For V1 capability truth:
- authenticated exchange reads and write-side execution are separate support
  families
- `LIVE_EXECUTION` alone is not enough to imply account-read or cancel support
- the canonical support matrix lives in
  `reference/exchange-access-ownership-matrix.md`
- older exchange-level flags remain compatibility-stage truth only and must not
  override narrower operation contracts

The next-step scalable matrix must resolve support by:
- `exchange`
- `marketType`
- `operation family`

Not just by a broad exchange-level flag.

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

Worker health and readiness must model the full deployed topology rather than a
partial subset. The canonical topology is:
- `market-data`
- `market-stream`
- `backtest`
- `execution`

Health/readiness surfaces must not imply full split-worker conformity if only a
subset of those worker families is being checked.

## Health and Readiness
Canonical health surfaces:
- `/health`
- `/ready`
- `/ready/details` for protected admin/ops diagnostics
- `/metrics`
- `/workers/health`

Protected readiness diagnostics may expose non-secret runtime safety state,
such as LIVE no-order guard booleans, but must not expose secrets,
credentials, or raw environment values. Public `/ready` remains intentionally
minimal.

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
