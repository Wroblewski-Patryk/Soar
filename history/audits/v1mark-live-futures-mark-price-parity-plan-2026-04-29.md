# V1MARK-A - LIVE Futures Mark-Price Parity Plan

Status: Active
Owner: Codex Execution Agent
Stage: planning
Last Updated: 2026-04-29

## Context

The active canonical queue is empty after `V1COVER-A`, but a fresh
repository-level audit still shows one money-impacting `LIVE FUTURES` drift:
runtime protection and position-lifetime enforcement resolve lifecycle price
from ticker `lastPrice` or candle close fallback, while Binance Futures risk
and liquidation semantics are driven by mark price.

The current repository already has one lifecycle-price seam
(`runtimeLifecycleMarkPrice.service.ts`), but that seam still resolves ticker
`lastPrice` only because the stream contract does not carry futures mark-price
truth yet. This weakens parity between:

- runtime `LIVE` protection (`DCA`, `TTP`, `TSL`, lifetime close),
- exchange-side futures risk semantics,
- and the architecture requirement that money-impacting `LIVE` paths use the
  strongest approved truth available.

## Goal

Upgrade `LIVE FUTURES` lifecycle-price truth so runtime protection and lifetime
automation prefer canonical futures mark price when available, while preserving
explicit fail-soft fallback for non-futures or temporarily degraded stream
conditions.

## Scope

- `apps/api/src/modules/market-stream/binanceStream.types.ts`
- `apps/api/src/modules/market-stream/binanceStream.service.ts`
- `apps/api/src/modules/engine/runtimeTickerStore.ts`
- `apps/api/src/modules/engine/runtimeLifecycleMarkPrice.service.ts`
- `apps/api/src/modules/engine/runtimeSignalLoop.service.ts`
- focused regression tests under:
  - `apps/api/src/modules/market-stream/`
  - `apps/api/src/modules/engine/`
- canonical planning/context sync files

## Non-Goals

- no exchange-native protective-order rollout
- no liquidation-engine redesign
- no change to `SPOT` ticker semantics
- no new stream family beyond the approved Binance futures market-stream
  boundary

## Architecture Alignment

Reviewed authorities:

- `docs/architecture/reference/execution-lifecycle-parity-contract.md`
- `docs/architecture/reference/exchange-access-ownership-matrix.md`
- `docs/architecture/reference/live-protection-state-parity-contract.md`
- `docs/architecture/06_execution-lifecycle.md`

Confirmed repository drift:

- runtime lifecycle-price resolution is centralized, but its best available
  truth for `LIVE FUTURES` is still ticker `lastPrice`
- futures market-stream ingestion does not yet subscribe to or persist mark
  price, so downstream runtime automation cannot prefer it
- position-lifetime automation inherits the same weaker price truth through the
  shared resolver

## Execution Plan

1. Publish the packet and queue the work in canonical planning/context docs.
2. Freeze the lifecycle-price hierarchy for `LIVE FUTURES` in architecture:
   prefer stream mark price, then ticker last price, then recent close fallback.
3. Add focused regression coverage for:
   - futures mark-price stream normalization
   - futures subscription including mark-price channels
   - lifecycle-price resolver preferring mark price over last price
   - runtime automation and position lifetime consuming the stronger price truth
4. Implement the stream/ticker/resolver changes without creating a second price
   authority.
5. Run focused tests, API typecheck, and guardrails; publish closure evidence.

## Acceptance Criteria

- Binance futures market-stream worker subscribes to per-symbol mark-price
  streams alongside existing ticker/kline streams.
- Normalized futures ticker state can carry mark price without changing spot
  requirements.
- `resolveRuntimeLifecycleMarkPrice` prefers futures mark price when available
  and degrades explicitly to last price or recent close only when needed.
- `RuntimePositionAutomationService` and runtime position-lifetime enforcement
  consume the stronger lifecycle-price truth through the shared seam.
- Focused regression tests prove the new hierarchy and keep fallback behavior
  deterministic.

## Risks

- stream-shape expansion must remain backward compatible for existing ticker
  consumers
- futures-only mark-price preference must not leak into spot semantics
- fallback logic must remain explicit so runtime does not silently stop when
  mark-price updates are briefly absent

## Validation Plan

- `pnpm --filter api exec vitest run src/modules/market-stream/binanceStream.service.test.ts src/modules/engine/runtimeLifecycleMarkPrice.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/engine/runtimePositionLifetime.service.test.ts`
- `pnpm --filter api run typecheck`
- `pnpm run quality:guardrails`

## Result Report

- Task summary: pending implementation
- Files changed: planning packet only
- How tested: `pnpm run quality:guardrails`
- What is incomplete: architecture, stream/runtime implementation, closure
  evidence
- Next steps: `V1MARK-01..05`
