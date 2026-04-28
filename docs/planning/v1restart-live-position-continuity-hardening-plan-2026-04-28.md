# V1RESTART LIVE Position Continuity and Restart Recovery Hardening Plan (2026-04-28)

## Status

Queued

## Why This Wave Exists

Fresh user-reported production behavior on 2026-04-28 exposed a higher-order
LIVE lifecycle gap that remains unresolved even after the `V1TAKE-A`,
`V1LIVE-A`, and `V1CLOSE-A` hardening waves:

- an exchange position can exist before bot shutdown,
- still exist on the exchange after bot restart,
- yet fail to reappear under the bot runtime surface,
- or reappear without enough lifecycle context for safe post-restart
  management.

This is a critical money-path problem, not a cosmetic dashboard defect.

The target is not a narrow "make DOGE show again" patch. The target is one
canonical restart-safe continuity model for `LIVE` positions across:

- worker restart,
- runtime downtime,
- first reconciliation after restart,
- delayed or partial exchange snapshots,
- exchange-event lag,
- manual exchange intervention during downtime,
- liquidation or exchange-forced close,
- post-restart recovery of DCA and trailing automation.

## Product-Level Intent

For critical real-money `LIVE` operation, bot shutdown must mean:

- the bot temporarily stops managing the position,
- but the system does not lose the continuity of the position,
- and the system does not guess closure from one weak post-restart signal.

After restart:

- if the position still exists on the exchange, it must return into canonical
  runtime truth and remain or become safely bot-manageable,
- if the position was closed during downtime, local history must remain
  continuous and explainable,
- if evidence is incomplete, the state must stay explicit and non-destructive
  until stronger proof exists.

## Frozen Invariants

### 1. Restart must not break LIVE position continuity

Worker restart or bot restart must not by itself:

- close an open `LIVE` position,
- erase or permanently downgrade ownership truth,
- remove the position from local truth because one startup reconcile was weak.

Restart is an execution-state interruption, not authoritative market truth.

### 2. Exchange events are the strongest close/open evidence

For supported adapter families, normalized exchange events are stronger than a
single REST snapshot for lifecycle truth.

Canonical priority for post-restart recovery:

1. confirmed exchange order/account/position events
2. durable local lifecycle state already persisted before restart
3. repeated authenticated exchange snapshot confirmation
4. repair-only actions with explicit attribution

REST reconciliation remains necessary, but it must act as:

- confirmation,
- recovery,
- repair,

not as a one-pass destroy-or-close authority after restart.

### 3. Missing from one snapshot is not equal to closed

If a previously known open `LIVE` position is not present in one post-restart
snapshot, the system must first enter an explicit intermediate recovery state.

It must not immediately:

- mark the position closed,
- downgrade it to generic orphan cleanup,
- remove bot ownership permanently,
- hide it from operator surfaces without an explicit degraded marker.

### 4. Restart recovery must preserve management context

If a `LIVE` position remains bot-owned after restart, recovery must restore the
canonical management context required for future automation:

- `botId`
- `walletId`
- `strategyId`
- execution context
- management policy

Recovered visibility without recovered lifecycle context is insufficient for
safe DCA, TSL, TTP, SL, or close authority.

### 5. Manual exchange close, liquidation, and repair cleanup are distinct truths

The system must distinguish at least:

- still open on exchange after restart
- temporarily unconfirmed after restart
- manually closed on exchange during downtime
- exchange-forced close or liquidation
- system repair cleanup of legacy or inconsistent local debt

`V1CLOSE-A` already separated `closeReason` and `closeInitiator`. This wave
must extend that contract so restart recovery does not collapse these cases
back into weak `missing -> closed` semantics.

### 6. UI must expose recovery certainty honestly

Operator surfaces must not make a position simply disappear when continuity is
not yet resolved.

The system must support explicit visibility states such as:

- recovered and managed
- recovered but not yet automatable
- awaiting exchange confirmation
- external close confirmed
- repair-required

## Confirmed Findings

### 1. Reconciliation still closes stale `EXCHANGE_SYNC` rows after one missing snapshot

`apps/api/src/modules/positions/livePositionReconciliation.service.ts` still:

- collects `seenExternalIds` from the current snapshot,
- then closes currently open synced positions not seen in that pass.

That behavior is too aggressive for restart safety.

### 2. Imported position ownership can still drop out of bot-scoped visibility

The repository now has stronger ownership logic, but bot-visible runtime reads
still depend on exact owned classification at read time.

If first-pass recovery after restart produces a temporary ownership mismatch or
degraded state, the position can disappear from the bot runtime surface even if
it still exists on the exchange and still belongs to the wallet/bot policy.

### 3. Recovered imported positions do not yet guarantee full strategy continuity

`EXCHANGE_SYNC` positions are still created/updated with `strategyId: null` in
the current reconcile path.

Runtime automation reads strategy config through `position.strategyId`, so a
recovered position can be visible but still not carry enough context for safe
post-restart DCA and trailing behavior.

### 4. Runtime automation still skips some exchange-synced positions without canonical bot ownership

That skip is correct as a fail-closed guard, but it also proves that restart
recovery must restore canonical ownership and management context before the
system can honestly claim the position is fully managed again.

### 5. Current architecture does not yet freeze restart-specific continuity semantics

The repository already freezes:

- exact exchange context,
- ownership/takeover semantics,
- event-driven lifecycle truth,
- close attribution,

but it does not yet freeze one canonical restart/downtime continuity contract
for `LIVE` positions.

## Approved Direction For This Wave

User-approved direction on 2026-04-28:

- this must be implemented as the highest-quality target model,
- not as a narrow bugfix,
- with quality and safety prioritized over the shortest path.

That means the execution target is:

- event-first recovery where supported,
- durable continuity state in local persistence,
- reconcile-as-repair/confirmation,
- explicit recovery and certainty states,
- restored strategy and automation context for recovered positions.

## Execution Plan

### Wave: `V1RESTART-A`

1. `V1RESTART-00 planning(queue): publish canonical LIVE restart continuity packet`
   - Freeze the wave scope, continuity goals, risks, and execution order.
   - Primary files:
     - `docs/planning/v1restart-live-position-continuity-hardening-plan-2026-04-28.md`
     - `docs/planning/v1restart-00-planning-task-2026-04-28.md`
     - `docs/planning/mvp-next-commits.md`
     - `docs/planning/mvp-execution-plan.md`
     - `.codex/context/TASK_BOARD.md`
     - `.codex/context/PROJECT_STATE.md`

2. `V1RESTART-01 docs(contract): freeze canonical LIVE restart and downtime continuity model`
   - Add one architecture-backed contract for:
     - restart continuity states
     - evidence priority
     - restart-safe missing-position semantics
     - ownership/context restoration rules
     - event-versus-reconcile truth priority
   - Primary files:
     - `docs/architecture/06_execution-lifecycle.md`
     - new `docs/architecture/reference/live-position-restart-continuity-contract.md`
     - `docs/architecture/reference/position-lifecycle-parity-matrix.md`
     - `docs/architecture/04_runtime-contexts.md`

3. `V1RESTART-02 test(api-red): lock non-destructive restart recovery semantics`
   - Add failing coverage for:
     - open position exists before restart, first snapshot misses it, position is not closed
     - open position exists before restart, ownership is temporarily unresolved, bot continuity is explicit rather than lost
     - repeated missing confirmations are required before external-close classification
   - Primary files:
     - `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`
     - `apps/api/src/modules/positions/positions.takeover-status.e2e.test.ts`
     - `apps/api/src/modules/bots/bots.runtime-takeover.e2e.test.ts`
     - `apps/api/src/modules/engine/runtimeCrashRetry.regression.test.ts`

4. `V1RESTART-03 db(schema): add durable recovery state for restart continuity`
   - Extend persistence with canonical fields needed to represent continuity and
     certainty without destroying history.
   - Candidate field families:
     - restart recovery state
     - last exchange confirmation timestamp
     - missing-confirmation counters or equivalent explicit recovery evidence
     - restored strategy reference when canonical owner is known
   - Keep exact final field names to implementation, but the contract must avoid
     shadow systems or duplicate ownership models.
   - Primary files:
     - `apps/api/prisma/schema.prisma`
     - new Prisma migration

5. `V1RESTART-04 fix(api-events): promote exchange-event truth to restart recovery authority`
   - Reuse the existing Binance event path so restart recovery can trust:
     - confirmed close fills
     - confirmed open/update lifecycle events
     - exchange-forced closure evidence
   - Ensure post-restart event application can restore or finalize continuity
     more strongly than one REST snapshot.
   - Primary files:
     - `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
     - `apps/api/src/modules/exchange/binanceUserDataStream.service.ts`
     - any normalized exchange-event mapper used by position lifecycle

6. `V1RESTART-05 fix(api-reconciliation): convert reconciliation from one-pass close authority into staged recovery authority`
   - Replace current immediate stale-close behavior with:
     - explicit recovery staging
     - multi-confirmation or stronger-proof close semantics
     - preserved ownership/context during temporary uncertainty where safe
   - Reconcile must still close truly stale rows, but only under stronger proof
     than one weak startup pass.
   - Primary files:
     - `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
     - `apps/api/src/modules/positions/positions.service.ts`
     - `apps/api/src/modules/positions/positionCloseAttribution.ts`

7. `V1RESTART-06 fix(api-ownership): preserve or restore canonical bot/wallet/strategy continuity for recovered LIVE positions`
   - Ensure a recovered owned position does not remain a half-imported shell.
   - Required outcomes:
     - canonical bot ownership restored when deterministic
     - wallet ownership restored when deterministic
     - strategy context restored or explicitly unresolved
     - no hidden bot reassignment guessing
   - Primary files:
     - `apps/api/src/modules/bots/runtimeExternalPositionOwner.service.ts`
     - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
     - `apps/api/src/modules/bots/runtimeSessionPositionCommand.service.ts`
     - `apps/api/src/modules/positions/livePositionReconciliation.service.ts`

8. `V1RESTART-07 test(api-runtime-red): lock post-restart DCA and trailing continuity for recovered exchange-synced LIVE positions`
   - Add focused failing coverage that proves:
     - recovered `EXCHANGE_SYNC BOT_MANAGED` positions regain DCA eligibility when strategy requires it
     - recovered profitable positions regain trailing behavior when enabled
     - unresolved strategy context remains explicit and non-actionable, not silently unmanaged
   - Primary files:
     - `apps/api/src/modules/engine/runtimePositionAutomation.service.test.ts`
     - `apps/api/src/modules/orders/orders-positions.e2e.test.ts`
     - `apps/api/src/modules/bots/bots.runtime-takeover.e2e.test.ts`

9. `V1RESTART-08 fix(api-runtime): restore safe automation context for recovered LIVE positions`
   - Make runtime automation consume recovered strategy/bot/wallet truth without
     inventing a second lifecycle path.
   - Reuse existing automation engine and strategy parsing seams.
   - Primary files:
     - `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
     - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
     - `apps/api/src/modules/bots/runtimeStrategyDisplayBySymbol.service.ts`

10. `V1RESTART-09 fix(api+read): expose honest restart recovery states and certainty to operator surfaces`
   - API and read models must distinguish:
     - recovered managed
     - recovery pending
     - external close confirmed
     - repair-only state
     - unresolved management context
   - Primary files:
     - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
     - `apps/api/src/modules/positions/positions.service.ts`
     - related DTO/read-model tests

11. `V1RESTART-10 web(runtime-truth): show continuity and recovery status explicitly instead of silent disappearance`
   - Update operator surfaces so a restart-recovering position is visible as
     degraded/recovering rather than absent.
   - Primary files:
     - `apps/web/src/features/dashboard-home/...`
     - `apps/web/src/features/bots/...`
     - `apps/web/src/features/positions/...`
     - i18n namespaces for recovery labels and help copy

12. `V1RESTART-11 qa(closure): run adversarial restart/downtime recovery pack and sync docs/context`
   - Required evidence must include:
     - open position survives bot restart when still present on exchange
     - manual exchange close during downtime becomes correct history truth
     - liquidation during downtime remains distinct from manual close
     - partial/missed first snapshot does not destroy continuity
     - recovered positions regain safe DCA/TSL behavior
     - ambiguous ownership remains fail-closed and explicit
   - Closure docs/context updates:
     - `docs/planning/mvp-next-commits.md`
     - `docs/planning/mvp-execution-plan.md`
     - `.codex/context/TASK_BOARD.md`
     - `.codex/context/PROJECT_STATE.md`
     - `docs/operations/...` smoke and recovery evidence artifacts

## Required Test Matrix

### Restart Recovery Matrix

- worker restart with position still open on exchange
- worker restart with delayed first exchange snapshot
- worker restart with first snapshot missing one symbol but second snapshot correct
- worker restart with exchange event arriving before REST snapshot
- worker restart with REST snapshot arriving before exchange event

### Downtime Outcome Matrix

- user manually closes position on exchange during downtime
- exchange liquidates position during downtime
- position partially changes size on exchange during downtime
- open order remains live during downtime
- position and open order both disappear during downtime

### Ownership Matrix

- one LIVE bot owns one symbol
- two LIVE bots share one API key but different symbol scopes
- wallet takeover disabled
- ambiguous symbol ownership
- position visible globally but not manageable by selected bot

### Automation Continuity Matrix

- recovered losing position with pending DCA
- recovered profitable position with TSL enabled
- recovered profitable position with TTP enabled
- recovered position with unresolved strategy context
- recovered position with bot ownership but disabled management policy

## Validation Requirements

Minimum closure pack for implementation wave:

- `pnpm run quality:guardrails`
- `pnpm --filter api run typecheck`
- `pnpm --filter web run typecheck`
- focused API restart/reconcile/runtime suites
- focused web runtime visibility/recovery suites
- `pnpm run build`

High-risk manual or production-like verification must include:

- authenticated exchange snapshot
- takeover status
- runtime positions view for selected bot
- restart or simulated restart recovery path
- post-restart DCA/TSL continuity proof where the fixture allows it

## Key Risks

### 1. Over-fixing into a second recovery subsystem

The implementation must not create a parallel "restart engine". Recovery must
stay inside the approved lifecycle, exchange-event, and reconciliation
boundaries.

### 2. Weakening fail-closed behavior while trying to preserve continuity

Preserving continuity must not mean blindly keeping positions actionable when
ownership or strategy truth is unresolved.

### 3. UI truth drifting from runtime truth

The web may be tempted to emulate continuity locally. It must instead render
explicit backend recovery state.

### 4. Strategy restoration becoming guesswork

Recovered positions may only regain `strategyId` when canonical owner proof is
deterministic. No first-strategy fallback or symbol-only guessing is allowed.

## Non-Goals

- no new exchange rollout beyond the currently supported family
- no rewrite of the entire runtime engine
- no opportunistic UI redesign unrelated to recovery truth
- no weakening of current ownership safety rules

## Expected Closure Outcome

After this wave:

- restart no longer destroys truthful open-position continuity,
- manual exchange actions during downtime remain explainable in history,
- recovered positions return with enough context for safe management when
  deterministic,
- unresolved cases stay visible and fail-closed,
- operator trust improves because disappearance is replaced by explicit
  recovery truth.
