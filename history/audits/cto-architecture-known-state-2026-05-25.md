# LUC-17 CTO Architecture And Function-Chain Known-State

Date: 2026-05-25  
Issue: `LUC-17`  
Role lane: CTO Architect

## 1. Known-State Summary

- `implemented and verified`: architecture graph system exists and is actively generated (`docs/graphs/architecture-graph.md`, function/user-action indexes, strict drift gates in scripts).
- `implemented but not verified`: many protected and money-impacting journeys are local-only (`verified_local`) and still lack fresh protected production proof.
- `present in code, behavior unknown`: mobile surface is scaffold-only (`apps/mobile/src/.gitkeep`), so runtime behavior is unknown.
- `missing`: no single concise architecture index that ties current module ownership + proof status + minimum safe pre-change checks in one short operator-facing page.

## 2. Major Module Map (Code-Backed)

### Runtime architecture layers
- Web UI feature layer: `apps/web/src/features/*` (`admin`, `auth`, `backtest`, `bots`, `dashboard-home`, `orders`, `positions`, `profile`, `reports`, `wallets`, etc.).
- API module layer: `apps/api/src/modules/*` (`auth`, `bots`, `engine`, `exchange`, `orders`, `positions`, `wallets`, `subscriptions`, etc.).
- Shared code: `libs/shared`.
- Ops/tooling layer: `scripts/*.mjs` (graph generation/drift, journey indexes, deploy smoke, release gates, RC/SLO tooling).

### Top responsibility clusters
- Auth/session: login/register/session lifecycle (`auth` web+api).
- Trading runtime: bots/engine/orders/positions/exchange.
- Product operations: wallets/markets/strategies/backtests/reports.
- Governance/release: RC gates, preflight, rollout/rollback, protected proof tooling.

## 3. Key Workflow Chains (Traceability)

- Auth session chain: `CHAIN-AUTH-SESSION` and deep chain are structurally covered and linked to auth UI/API/tests/docs.
- Manual order chain: `CHAIN-MANUAL-ORDER` and `CHAIN-MANUAL-ORDER-DEEP` are mapped end-to-end, but still carry high proof-gap flags for protected/live mutation evidence.
- Positions/runtime chain: `CHAIN-POSITIONS-CORE` and `CHAIN-BOT-RUNTIME-CORE` are mapped with API/controller/service/data/test links; proof status is largely local.
- Exchange adapter chain: `CHAIN-EXCHANGE-ADAPTER-DEEP` is mapped across boundaries/connectors/capabilities with extensive test links; production mutation proof is still gated.
- Release tooling chain: `CHAIN-RELEASE-AUDIT-TOOLING` is mapped and locally verified.

Evidence source: `docs/graphs/function-journey-index.json`, `docs/graphs/user-action-index.json`, `docs/graphs/architecture-graph.md`.

## 4. Documentation Trust Status

## Accurate enough to use now
- Graph exports and journey/action indexes are current-dated (`2026-05-25`) and internally consistent with module layout.
- Root script contracts in `package.json` match architecture evidence tooling and ops workflows.

## Stale or weak-confidence
- A large portion of journeys/actions remain `verified_local_only` or `partially_verified`; docs encode this, but release confidence for protected flows is still weak.
- `docs/documentation-map.md` still has placeholder metadata (`Updated: YYYY-MM-DD`), reducing trust as a canonical “current map” entrypoint.

## Missing for safe daily execution
- A single short architecture index for “what to read + what to run before touching module X”.
- Explicit “proof freshness SLA” table per high-risk chain (money/auth/live-exchange/protected ops), derived from existing indexes.

## 5. Minimum Architecture Index Required Before Safe Coding

Minimum viable index (must exist and stay current):

1. Module ownership map:
- module id, owning directories, primary API routes/pages, data models.
2. Chain mapping:
- function-chain IDs per module, plus critical user actions bound to those chains.
3. Proof boundary table:
- status per chain/action: local verified vs protected/prod verified, last verification date, missing proof type.
4. Pre-change gate checklist:
- required commands before merge for touched scope (`architecture:graph:drift:strict`, `architecture:journey:index:strict`, relevant tests).
5. Risk escalation rules:
- if chain is money/auth/live/protected and not production-verified, require explicit blocker note before DONE.

Most raw ingredients already exist; missing part is one concise index document assembled from existing artifacts.

## 6. Risks Converted To Explicit Blockers

1. High-gap proof debt remains:
- `function-journey-index` reports high gaps; `user-action-index` reports high gaps, especially on protected/mutation actions.
2. Production confidence bottleneck:
- release/ops state still tracks infrastructure/protected-proof blockers; structural traceability is not the active blocker.
3. Mobile certainty gap:
- mobile app is scaffold-only; do not infer runtime parity from web/api evidence.

## 7. Disposition

- CTO known-state objective for `LUC-17`: `done` for architecture mapping and truth classification.
- Release-readiness objective: remains separately `blocked` by protected proof and production infrastructure gates already tracked in mission/state files.
