# V1COVER-A - LIVE Runtime Regression Coverage Hardening Plan

Status: Active
Owner: Codex Execution Agent
Stage: planning
Last Updated: 2026-04-29

## Context

The last `LIVE` protection waves (`V1PARITY-A`, `V1SAFE-A`, `V1GUARD-A`) closed
the strongest money-impacting runtime drifts behind `DCA`, `TTP`, and `TSL`,
but a fresh broad regression audit still shows that repository-level proof for
`LIVE exchange` behavior is not yet strong enough.

The current gap is no longer one isolated production bug. It is a mixed parity
and verification problem:

1. some runtime/order regression packs still drift from the approved singular
   bot contract and modern ownership topology;
2. some engine suites still leak shared runtime state across files because
   candle/ticker stores are module-global and not reset consistently;
3. at least one write-path proof (`orders.service.test.ts`) still fails under
   Vitest even though the equivalent flow can succeed in direct service
   execution, which means the current regression harness does not yet provide a
   trustworthy final signal;
4. helper-level cleanup drift still exists in older e2e shared helpers, which
   weakens confidence in `LIVE` ownership and runtime-close proof when files are
   run together.

This is directly relevant to the user's goal: `backtest` and `paper` are
already stronger than `live`, and the repository now needs reliable end-to-end
coverage that proves `LIVE bot + exchange` behavior under the same canonical
contracts rather than only passing narrow focused slices.

## Goal

Restore a trustworthy repository-level regression pack for `LIVE exchange`
runtime behavior by removing shared-state leaks, repairing legacy test harness
drift, and then closing any remaining real implementation gaps that survive the
stabilized proof.

## Scope

- `apps/api/src/modules/engine/runtime-flow.e2e.test.ts`
- `apps/api/src/modules/engine/runtimeSignalLoop.service.test.ts`
- `apps/api/src/modules/orders/orders.service.test.ts`
- `apps/api/src/modules/orders/orders-positions.e2e.test.ts`
- `apps/api/src/modules/bots/bots.e2e.shared.ts`
- supporting runtime/order helpers only if required by real post-stabilization
  product drift
- canonical planning/context files for queue and closure sync

## Non-Goals

- no new runtime architecture branch for `LIVE`
- no broad UX refresh
- no exchange-native protective-order redesign
- no weakening of fail-closed protections only to make tests pass

## Architecture Alignment

Reviewed authorities:

- `docs/architecture/01_overview-and-principles.md`
- `docs/architecture/04_runtime-contexts.md`
- `docs/architecture/06_execution-lifecycle.md`
- `docs/architecture/reference/live-runtime-lifecycle-parity-contract.md`
- `docs/architecture/reference/live-protection-state-parity-contract.md`
- `docs/architecture/reference/live-position-restart-continuity-contract.md`

Confirmed drift against architecture:

- regression proof still allows shared module-global runtime state to leak
  across files, which hides whether failures come from product truth or test
  noise;
- some older e2e fixtures still assume pre-singular-bot cleanup/ownership
  topology;
- final repo-level proof for `LIVE` runtime/order parity is still weaker than
  the architecture requires for money-impacting flows.

## Execution Plan

1. Freeze one canonical hardening packet and queue for the remaining
   `LIVE` regression-coverage work.
2. Remove shared-state leaks from runtime engine tests by resetting module-level
   candle/ticker stores wherever runtime events are emitted directly.
3. Repair shared e2e cleanup helpers so singular-bot plus wallet-linked test
   topology cleans deterministically.
4. Re-run the broader runtime/order pack and separate remaining failures into:
   - harness-only drift
   - real product drift
5. Fix surviving real product gaps one tiny slice at a time with focused red
   regression locks before any behavior change.
6. Publish closure evidence only after the stabilized broader pack is green or
   only real, architecture-aligned failures remain queued explicitly.

## Acceptance Criteria

- Runtime engine packs no longer fail because candle/ticker state leaked from
  another file or earlier test.
- Shared bot runtime takeover helpers clean wallets and related rows
  deterministically under the singular bot contract.
- The remaining `LIVE` runtime/order regression failures, if any, correspond to
  real implementation drift rather than cleanup or shared-state noise.
- Queue/context truth explicitly records the follow-up slices until the broader
  proof is closed.

## Risks

- broad suite stabilization can tempt over-cleaning or hidden resets that mask
  real bugs, so resets must stay at explicit canonical test boundaries only;
- helper cleanup changes can affect many files, so the first slices must stay
  tiny and reversible;
- once state leakage is removed, real product regressions may surface more
  clearly and require new focused implementation slices.

## Validation Plan

- `pnpm --filter api exec vitest run src/modules/engine/runtime-flow.e2e.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts`
- `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts src/modules/orders/orders-positions.e2e.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts`
- `pnpm --filter api run typecheck`
- `pnpm run quality:guardrails`

## Result Report

- Task summary: pending implementation
- Files changed: planning packet only
- How tested: `pnpm run quality:guardrails`
- What is incomplete: implementation and closure evidence
- Next steps: `V1COVER-01..05`
