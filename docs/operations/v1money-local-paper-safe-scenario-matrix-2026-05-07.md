# V1MONEY Local And Paper-Safe Scenario Matrix

Date: 2026-05-07
Operator: Codex
Branch: `codex/v1-app-function-check`
Local HEAD before docs commit: `4901dd7b`

## Purpose

Define the deterministic local, paper-safe, read-only production, and explicit
operator/live-money evidence path for the remaining `V1MONEY-A` rows. This
matrix prevents V1 closure from depending on vague "try it in prod" steps.

## Fresh Local Evidence

Command:

```powershell
pnpm --filter api run test -- src/modules/engine/orderTypes.service.test.ts src/modules/engine/preTrade.service.test.ts src/modules/engine/preTrade.e2e.test.ts src/modules/engine/runtimePositionLifetime.service.test.ts src/modules/engine/runtimeOrderLifetime.service.test.ts src/modules/engine/strategyLifetimePolicy.test.ts src/modules/engine/runtimeLifecycleMarkPrice.service.test.ts src/modules/engine/lifecycleCloseParity.golden.test.ts --run --sequence.concurrent=false --pool forks --poolOptions.forks.singleFork=true
```

Result: PASS (`49/49`).

Covered files:

- `apps/api/src/modules/engine/orderTypes.service.test.ts`
- `apps/api/src/modules/engine/preTrade.service.test.ts`
- `apps/api/src/modules/engine/preTrade.e2e.test.ts`
- `apps/api/src/modules/engine/runtimePositionLifetime.service.test.ts`
- `apps/api/src/modules/engine/runtimeOrderLifetime.service.test.ts`
- `apps/api/src/modules/engine/strategyLifetimePolicy.test.ts`
- `apps/api/src/modules/engine/runtimeLifecycleMarkPrice.service.test.ts`
- `apps/api/src/modules/engine/lifecycleCloseParity.golden.test.ts`

## Scenario Matrix

| Row | Required V1 proof | Local/paper-safe evidence now | Production evidence still needed | Risk control |
| --- | --- | --- | --- | --- |
| `ENGINE-ORDER-TYPES-001` | Paper/live-safe order-type matrix or explicit unsupported-type block | `orderTypes.service.test.ts` covers `MARKET`, `LIMIT`, `STOP`, `TAKE_PROFIT`, `STOP_LIMIT`, and `TRAILING`; fresh PASS | Optional read-only operator confirmation that production UI/API exposes only supported order types for the active flow | Do not place live orders just to prove order-type math; live mutation requires explicit operator intent |
| `ENGINE-PRETRADE-001` | Production pre-trade block event or safe paper proof | `preTrade.service.test.ts` and `preTrade.e2e.test.ts` cover allow/block decisions, audit logs, kill-switch block, LIVE opt-in, canonical futures venue, open-position caps, stale local orphan exclusion, and imported LIVE ownership counts; fresh PASS | Redacted production `PRETRADE_BLOCKED` or paper-safe event on current SHA | Blocks must be fail-closed and operator-visible; no bypasses |
| `ENGINE-LIFETIME-001` | Manual matrix scenarios for lifetime disabled/enabled behavior | `runtimePositionLifetime.service.test.ts`, `runtimeOrderLifetime.service.test.ts`, and `strategyLifetimePolicy.test.ts` cover disabled policy, stale position/order closure orchestration, stale local orphan exclusion, and mark-price fail-closed behavior; fresh PASS | Paper-safe runtime sample or operator-accepted manual matrix for enabled/disabled lifetime behavior | Do not force-close live positions for evidence without explicit tiny-size operator intent |
| `MARKETDATA-FUT-001` | Production evidence showing futures price source fields for live runtime | `runtimeLifecycleMarkPrice.service.test.ts` and lifecycle parity coverage prove mark-price selection and lifecycle close parity locally; fresh PASS | Read-only production runtime payload showing futures price source fields on current SHA | Use read-only payload/screenshot; no trading mutation required |
| `BOT-LIVE-CLOSE-001` | Fresh post-fix automated close sample with `strategyId`, close reason, and initiator | Lifecycle close parity and runtime position automation packs provide local path coverage from prior tasks; not re-run in this matrix except lifecycle parity | Production or paper-safe close sample with redacted payload | Prefer paper-safe close first; live close requires explicit operator intent |
| `BOT-LIVE-CLOSE-002` | Live DCA-first close boundary sample proving affordable DCA is not bypassed by `SL/TSL` | Covered by prior runtime automation/DCA-focused packs, not sufficient for production closure | Paper-safe or tiny live scenario with DCA affordability and close boundary evidence | Never create live exposure just for matrix coverage without operator approval |
| `BOT-LIVE-CLOSE-003` | `SIGNAL_DECISION` or `PRETRADE_BLOCKED` evidence for exhausted/unaffordable DCA close | Pre-trade block path covered locally; fresh PASS for pre-trade block logging | Production/paper-safe event evidence tying exhausted/unaffordable DCA to block/decision telemetry | Prefer paper-safe event; live mutation requires explicit operator intent |
| `STRAT-BASIC-TP-001` | Basic TP close sample | Lifecycle close parity proves close event shape locally | Paper-safe TP close sample or accepted production event | Avoid live TP manipulation without operator approval |
| `STRAT-BASIC-SL-001` | Basic SL close sample | Lifecycle close parity proves close event shape locally | Paper-safe SL close sample or accepted production event | Avoid live SL manipulation without operator approval |
| `STRAT-ADV-TSL-001` | TSL arm/close event and dashboard display proof | Prior runtime automation coverage exists; not closed by this matrix | Paper-safe or production TSL event plus dashboard display proof | Require redacted evidence and clear position sizing if live |

## Interpretation

The local V1 money-engine foundation is green for order-type evaluation,
pre-trade fail-closed behavior, lifetime enforcement, and lifecycle mark-price
selection. This moves `V1MONEY-A` from "needs scenario design" to "needs
operator or paper-safe execution evidence for the remaining close/strategy
samples."

The matrix does not close live-money rows by itself. It explicitly prevents
unsafe shortcuts: production evidence for live close, DCA-first, TP, SL, and TSL
must come from paper-safe samples, existing production events, or explicit
operator-approved tiny live mutations.

## Next Safe Slice

Run an authenticated read-only/paper-safe evidence pass for:

1. `ENGINE-PRETRADE-001` production or paper-safe block event.
2. `MARKETDATA-FUT-001` production runtime payload with futures price source.
3. Paper-safe TP/SL/TSL close samples if stage remains blocked.

If a scenario fails, convert only that row into a narrow fix task.
