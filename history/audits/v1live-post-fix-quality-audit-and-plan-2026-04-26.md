# V1LIVE Post-Fix Quality Audit and Architecture-Aligned Plan (2026-04-26)

## Status

Published

## Scope

This audit reflects repository truth after the real-account production fixes
for:

- manual-order lifecycle collisions,
- selected-bot manual-order UI symbol/price drift,
- wallet-scoped open-position conflict handling,
- imported live-position leverage truth,
- stale local live-position cleanup on the affected live account.

The goal is not to re-open already closed hotfixes. The goal is to identify the
highest-value remaining work that improves product quality while moving the
implementation closer to the approved architecture.

## Audit Summary

### What is now healthy

1. Dashboard manual-order UX is materially healthier on the selected-bot flow.
   - price auto-refresh and budget input work
   - stale previous-symbol submit price was fixed
   - false `blocked` UI state was removed

2. Live imported-position truth is materially healthier on the verified account.
   - stale phantom `BNBUSDT` is no longer actionable
   - imported `DOGEUSDT` now persists with truthful leverage instead of
     degrading to `1x`

3. Manual open-position conflicts now follow canonical wallet/bot scope better.
   - same-wallet same-side reuse works
   - cross-wallet same-symbol false conflicts were removed

### What still does not meet the target architecture cleanly

#### A1. Imported LIVE entry truth still falls back to `markPrice`

Code evidence:
- `apps/api/src/modules/positions/livePositionReconciliation.service.ts`

Current state:
- `resolveCanonicalEntryPrice()` still falls back from `entryPrice` to
  `markPrice`.

Architecture conflict:
- `docs/architecture/reference/execution-lifecycle-parity-contract.md`
- `history/plans/v1live-binance-execution-and-takeover-hardening-plan-2026-04-26.md`

Why this matters:
- imported live positions can still look more certain than the exchange truth
  really is
- downstream PnL, automation, and close semantics can inherit synthetic entry
  truth

#### A2. Runtime watchdog/manual LIVE helpers still carry environment-level Binance defaults

Code evidence:
- `apps/api/src/modules/engine/runtimeScanLoop.service.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`

Current state:
- several runtime/manual helpers still default unresolved exchange context to
  env-driven `BINANCE + FUTURES`

Architecture conflict:
- exact exchange context must come from selected wallet/bot context
- unsupported paths must fail closed, not resolve through a hidden default

Why this matters:
- the system can still behave correctly for Binance while staying structurally
  unsafe for future exchange expansion
- this is a classic “works today, drifts tomorrow” seam

#### A3. Runtime sidebar still contains legacy strategy fallback reads

Code evidence:
- `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSidebarSection.tsx`

Current state:
- the selected-bot runtime sidebar still falls back to
  `runtimeGraph.legacyBotStrategies`

Architecture conflict:
- approved singular bot contract says runtime/operator surfaces should consume
  inherited current bot context, not revive legacy topology as a secondary
  truth source

Why this matters:
- operator surfaces can still present legacy strategy/group context when the
  canonical singular path is incomplete or stale
- this is quality debt and a source of future dashboard confusion

#### A4. Live ownership/visibility/close parity is improved in prod but still under-proven as one contract

Evidence:
- current queue already reflects this as `V1LIVE-04..09`
- the production account now behaves much better, but the repository still
  carries separate ownership decisions across reconciliation, takeover, and
  runtime visibility/close flows

Why this matters:
- these are high-risk money-impacting flows
- we have hotfix confidence, but not yet one fully frozen architectural proof

#### A5. Live lifecycle truth is still mostly snapshot/poll based

Evidence:
- current queue `V1LIVE-10..12`
- current live path still relies mainly on authenticated REST snapshots and
  reconciliation instead of canonical Binance user-data-stream lifecycle truth

Why this matters:
- runtime correctness is still eventually-consistent rather than event-driven
- open order, fill, and imported position transitions remain more fragile than
  they should be for the first supported adapter family

#### A6. Source-of-truth docs drifted during the production hotfix run

Observed drift:
- `V1LIVE-PROD-2026-04-26-A` remained open in queue/context after it had been
  verified on production
- some older notes still described already-completed work as “remaining
  operational step”

Why this matters:
- future execution can waste time chasing already-closed incidents
- architecture work gets harder when queue truth and repository truth diverge

## Recommended Task Plan

### Priority P0 - Architecture safety and live-trading truth

1. `V1LIVE-01 audit(api+docs): publish canonical live-execution and takeover regression packet`
   - Keep as the immediate next task.
   - Expand it with the latest production evidence from the real account.

2. `V1LIVE-02 test(api-exchange-red): lock adapter selection to exact user/bot exchange context`
   - Freeze the current remaining exchange-context seam before more fixes land.

3. `V1LIVE-03 fix(api-exchange): make adapter selection strictly follow user-selected exchange settings`
   - Remove remaining hidden Binance-default behavior from runtime/manual live
     helpers where architecture requires inherited context.

4. `V1LIVE-06 test(api-red): lock fail-closed imported entry/fill truth`
   - Move this earlier in practical priority because `entryPrice -> markPrice`
     fallback is still a direct architecture violation.

5. `V1LIVE-07 fix(api-reconciliation): remove synthetic mark-price entry fallback and keep unresolved states explicit`
   - This is the cleanest next technical improvement after leverage truth.

### Priority P1 - Runtime ownership and operator parity

6. `V1LIVE-04 test(api-red): lock one canonical ownership classifier for imported LIVE positions`
7. `V1LIVE-05 fix(api-ownership): reuse one ownership classifier across reconciliation, runtime, and takeover`
8. `V1LIVE-08 test(api-runtime-red): lock runtime visibility and close parity for owned imported LIVE positions`
9. `V1LIVE-09 fix(api-runtime): recover imported-position runtime visibility and close authority`

Reason:
- the product now looks usable again on the verified account, but this area is
  still the highest residual quality risk for live position management

### Priority P2 - Exchange-family completion and product resilience

10. `V1LIVE-10 test(api-engine-red): lock signal -> LIVE order -> position lifecycle truth`
11. `V1LIVE-11 refactor(api-exchange): complete Binance adapter family inside the existing exchange boundary`
12. `V1LIVE-12 fix(api-execution): wire Binance adapter-family events into canonical order and position lifecycle`

Reason:
- this is the path from “working after repair/reconciliation” to “structurally
  reliable first exchange family”

### Priority P3 - UX and codebase cleanup after contract closure

13. `V1LIVE-13 cleanup(api+tests+web): remove stale fallback paths, stale fixtures, and misleading manual-order semantics`
   - explicitly include removing legacy runtime-sidebar strategy fallbacks once
     the singular context path is fully proven

14. `V1LIVE-14 qa(closure): rerun focused live/paper/takeover closure pack and sync canonical docs/context`

## Concrete Queue Adjustments Recommended

1. Close `V1LIVE-PROD-2026-04-26-A` in canonical queue/context.
2. Keep `V1LIVE-01` as the next active execution task.
3. Pull `V1LIVE-06/07` up in practical execution priority right after
   `V1LIVE-02/03`, because imported entry truth is still a direct architecture
   violation.
4. Treat runtime env defaults to Binance as part of `V1LIVE-03`, not as a
   separate ad hoc hotfix.
5. Treat legacy runtime-sidebar context fallback removal as part of
   `V1LIVE-13`, not as a standalone UX-only cleanup.

## Suggested Next Execution Order

1. `V1LIVE-01`
2. `V1LIVE-02`
3. `V1LIVE-03`
4. `V1LIVE-06`
5. `V1LIVE-07`
6. `V1LIVE-04`
7. `V1LIVE-05`
8. `V1LIVE-08`
9. `V1LIVE-09`
10. `V1LIVE-10`
11. `V1LIVE-11`
12. `V1LIVE-12`
13. `V1LIVE-13`
14. `V1LIVE-14`

## Bottom Line

The dashboard and the verified production account are now much healthier than
before, but the repository is not yet at the ideal architecture-aligned
quality bar for `LIVE`.

The biggest remaining quality gaps are no longer “broken UX” bugs. They are:

- exact exchange-context truth,
- fail-closed imported entry truth,
- one ownership classifier across all live-position surfaces,
- event-driven lifecycle truth for the first Binance adapter family,
- and cleanup of remaining legacy/fallback seams after those contracts are
  proven.
