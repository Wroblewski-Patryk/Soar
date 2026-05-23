# Review-B Runtime/Exchange Production Closure (2026-04-22)

Status: Closed
Wave: `REVIEW-B`

## Scope Closed

`REVIEW-B` closed the four production-readiness gaps found by the post-`XLIFE-A`
review:

1. DCA/add-leg execution no longer mutates local runtime truth before canonical
   fill confirmation.
2. Submitted runtime dedupe no longer becomes terminal before canonical order
   outcome is known.
3. Generic exchange position snapshots no longer silently choose an ambiguous
   API key when multiple supported credentials exist.
4. Runtime watchdog symbol coverage now matches its explicit Binance-futures
   scope instead of implying broader exchange coverage.

## Delivered Changes

### DCA/add-leg lifecycle truth

- Added canonical DCA position update computation and execution path in
  `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`.
- Removed the synthetic local `runtime_dca_finalize` shortcut that tried to
  close pending live DCA orders before fill truth existed.
- DCA now:
  - submits one canonical market order tied to the existing `positionId`
  - writes local position quantity/entry price only after `FILLED`
  - derives DCA trade price and quantity from canonical fill data instead of
    request `markPrice`
  - keeps runtime-management state unchanged when the order remains
    `PENDING`/`OPEN`/`PARTIALLY_FILLED`

### Submitted dedupe truth

- Extended `runtimeExecutionDedupe` to support non-terminal submitted state via
  `markSubmitted`.
- `acquire()` now inspects linked order truth:
  - `PENDING/OPEN/PARTIALLY_FILLED` => reuse as `submitted`
  - `FILLED` => auto-heal to `completed`
  - `CANCELED/REJECTED/EXPIRED` => reopen execution eligibility safely
- `executionOrchestrator` now marks submitted `OPEN` and `CLOSE` paths as
  submitted, not succeeded.

### Deterministic exchange snapshot ownership

- `GET /dashboard/positions/exchange-snapshot` is now fail-closed when the user
  has multiple supported API keys.
- Operators can request deterministic ownership by passing `apiKeyId` query
  parameter.

### Explicit watchdog scope

- Runtime watchdog symbol inventory now includes only supported Binance futures
  ownership contexts.
- Added explicit helper coverage so future changes cannot silently widen
  watchdog scope again.

## Validation

- `pnpm --filter api exec vitest run src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimeCrashRetry.regression.test.ts src/modules/engine/runtimeExecutionDedupe.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/engine/runtimeScanLoop.service.test.ts src/modules/positions/positions.exchangeSnapshot.e2e.test.ts`
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`
- `pnpm run typecheck`
- `pnpm run build`
- `pnpm run quality:guardrails`

All listed validations passed on 2026-04-22.

## Residual Risk

- `REVIEW-B` closes the review-derived runtime/exchange gaps that were still
  open after `XLIFE-A`.
- No new active blocker was discovered in this wave.
