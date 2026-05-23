# V1TRUTH-A - LIVE Exchange Truth Hardening Plan

Status: Closed
Owner: Codex Execution Agent
Stage: release
Last Updated: 2026-04-29

## Context

Fresh analysis of the user-reported real-account behavior confirms that the
remaining risk is no longer broad feature completeness. The strongest
money-impacting drifts are concentrated in one final `LIVE exchange truth`
slice:

1. manual exchange orders can still appear too early in local position truth,
   especially around same-symbol DCA intent versus confirmed fill timing;
2. dashboard manual-order sizing for `LIVE FUTURES` still mixes exchange
   notional checks with free-funds validation that should be leverage-aware;
3. manual close from the app is still tied too tightly to runtime-session
   context and local lifecycle inputs instead of one explicit exchange-backed
   close authority;
4. recent `DCA/TTP/TSL` hardening closed broad parity gaps, but the user's
   exact protection expectation still needs one explicit truth lock:
   `DCA first`, then close protection, with `TTP` considering DCA only when
   configured DCA thresholds are themselves on the profit side.

The approved direction on 2026-04-29 is staged:

- keep the canonical singular architecture for now:
  `1 bot = 1 wallet + 1 symbol-group market scope + 1 strategy`;
- close `V1` on truthful `LIVE` order/position/control behavior first;
- defer multi-strategy-per-bot architecture to a post-`V1` wave.

## Goal

Close the last confirmed real-money drifts in `LIVE` order truth, futures
manual sizing, and manual close control so Soar reaches a production-honest
`V1` without mixing this work with the deferred multi-strategy architecture
change.

## Scope

- `apps/api/src/modules/orders/`
- `apps/api/src/modules/positions/`
- `apps/api/src/modules/bots/`
- `apps/api/src/modules/engine/`
- `apps/api/src/modules/exchange/`
- `apps/web/src/features/dashboard-home/`
- focused API and web tests covering manual order, manual close,
  reconciliation, and runtime protection truth
- canonical planning/context files for queue and closure sync

## Non-Goals

- no multi-strategy-per-bot implementation in this wave
- no new exchange family rollout
- no broad dashboard redesign outside operator-truth surfaces needed for the
  fixes
- no synthetic or fallback-only path that hides unresolved exchange truth

## Architecture Alignment

Reviewed authorities:

- `docs/architecture/03_domain-model.md`
- `docs/architecture/04_runtime-contexts.md`
- `docs/architecture/06_execution-lifecycle.md`
- `docs/architecture/reference/live-runtime-lifecycle-parity-contract.md`
- `docs/architecture/reference/position-lifecycle-parity-matrix.md`

Confirmed architecture-aligned target:

- `Order` and `Position` remain separate until exchange-confirmed fill truth
- `LIVE` manual control stays fail-closed and exchange-authoritative
- the canonical bot model remains singular through this wave

Confirmed drifts versus target:

- futures manual-order free-funds validation is not yet leverage-aware end to
  end
- manual close authority is still coupled to runtime-session/actionability
  state more than the approved exchange boundary
- order-versus-position truth still lacks one locked proof for manual exchange
  pending order scenarios
- the exact user-desired `DCA/TTP/TSL` rule needs one explicit frozen contract

## Execution Plan

1. `V1TRUTH-00 planning(queue): publish final LIVE exchange-truth packet`
   - Publish this packet and sync queue/context.

2. `V1TRUTH-01 audit(api+web+exchange): freeze the exact remaining money-path failure matrix`
   - Reproduce and lock the reported scenarios:
     - manual exchange DCA submitted but not filled
     - dashboard position/order separation under pending external order
     - manual app close failure in `LIVE`
     - futures manual-order leverage-versus-margin drift
   - Publish exact ownership points and expected truth transitions.

3. `V1TRUTH-02 fix(web+api-contract): align futures manual-order sizing and free-funds validation`
   - Reuse one canonical margin estimate contract between backend context and
     dashboard controller.
   - Keep exchange min-notional truth separate from leverage-aware required
     margin validation.

4. `V1TRUTH-03 test(api-red): lock exchange-backed manual close parity`
   - Add failing coverage proving app-driven manual close works only through
     one canonical authority and degrades honestly when exchange execution is
     unavailable.

5. `V1TRUTH-04 fix(api-exchange+runtime): make manual close fail-closed and exchange-truthful`
   - Route manual close through the approved exchange execution boundary.
   - Keep runtime/session diagnostics explicit, but not as hidden close
     authority.

6. `V1TRUTH-05 test(api+web-red): lock pending external order versus position truth`
   - Add focused proof that an unfilled external/manual exchange order stays in
     `orders` only and does not inflate position size, margin, or automation
     state.

7. `V1TRUTH-06 fix(api+reads+web): harden order/position merge and operator presentation`
   - Ensure pending external order truth remains separated until fill.
   - Keep dashboard tables and aggregates aligned to exchange-confirmed state.

8. `V1TRUTH-07 docs+test(runtime-red): freeze and prove the final DCA/TTP/TSL rule`
   - Record the exact rule for `TTP` versus DCA thresholds.
   - Add focused proof for positive-threshold and non-positive-threshold DCA
     configurations.

9. `V1TRUTH-08 fix(api-runtime+web): align protection execution and operator truth`
   - Close any remaining implementation drift versus the newly frozen rule.

10. `V1TRUTH-09 qa(closure): run focused real-money truth pack and publish closure evidence`
    - Run the closure pack, sync docs/context, and confirm the repository is
      ready for the deferred post-`V1` architecture wave.

## Acceptance Criteria

- Manual exchange orders remain visible as `orders` until exchange-confirmed
  fill and do not prematurely inflate open position state.
- `LIVE FUTURES` manual-order sizing uses leverage-aware required margin for
  free-funds and max-size validation while keeping exchange min-notional truth
  unchanged.
- App-driven manual close in `LIVE` uses one explicit exchange-backed control
  path and degrades honestly when exchange execution is not available.
- The final `DCA/TTP/TSL` semantics are frozen in docs and proven in focused
  tests.
- Closure evidence shows API, web, and operator surfaces agree on
  order/position/control truth for the reported money-path scenarios.

## Risks

- manual close changes can affect close attribution or restart continuity, so
  focused red tests must lock the exact intended behavior first
- order-versus-position truth can regress aggregate read models if the same
  fill is accounted for twice
- futures manual-order parity must not silently change exchange min-notional
  behavior while fixing leverage-aware margin validation
- protection-rule refinement must stay within the shared lifecycle engine and
  avoid creating a special-case `LIVE` fork

## Validation Plan

- `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/positions/livePositionReconciliation.service.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts`
- `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx src/features/dashboard-home/hooks/useManualOrderController.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.aggregate-history.test.tsx`
- `pnpm --filter api run typecheck`
- `pnpm --filter web run typecheck`
- `pnpm run quality:guardrails`

## Post-V1 Follow-Up

After `V1TRUTH-A` closes and production verification remains stable, the next
architecture wave is `BOTMULTI-A`: reintroduce multi-strategy-per-bot
explicitly, with architecture updates first and implementation only afterward.
That deferred wave is planned separately in
`history/plans/botmulti-post-v1-multi-strategy-reintroduction-plan-2026-04-29.md`.

## Result Report

- Task summary: closed after completing the final `LIVE exchange truth`
  hardening wave for `V1`
- Files changed: planning packet, focused API/web/runtime fixes, architecture
  references, queue/context sync, and closure evidence
- How tested:
  - focused API closure pack (`99/99 PASS`)
  - focused web closure pack (`15/15 PASS`)
  - `pnpm --filter api run typecheck`
  - `pnpm --filter web run typecheck`
  - `pnpm run quality:guardrails`
- What is incomplete: none within `V1TRUTH-A`
- Next steps: continue only with deferred post-`V1` architecture work under
  `BOTMULTI-A`
