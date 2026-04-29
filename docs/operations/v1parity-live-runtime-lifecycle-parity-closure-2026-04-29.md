# V1PARITY-A Closure Evidence

Date: 2026-04-29
Wave: `V1PARITY-A`
Status: Closed

## Scope Closed

`V1PARITY-A` closed the remaining confirmed repository drifts behind the
reported `PAPER DCA works / LIVE DCA does not` symptom:

- confirmed existing-position `LIVE` fills now reprice canonical
  `position.quantity` and `position.entryPrice` through the same add-update
  lifecycle authority used elsewhere
- add-leg `LIVE` fills now persist explicit `DCA` trade semantics instead of
  collapsing into generic `OPEN`
- `ACCOUNT_UPDATE` application is constrained to the canonical owned LIVE
  position scope instead of broad `userId + symbol + side` mutation
- runtime read models no longer imply DCA/TSL strategy truth through
  symbol-level fallback when canonical `position.strategyId` is missing
- fail-closed `LIVE` runtime automation skips now emit operator-visible
  `PRETRADE_BLOCKED` diagnostics for the covered degraded-state classes

## Canonical Artifacts

- Planning packet:
  `docs/planning/v1parity-live-runtime-lifecycle-parity-hardening-plan-2026-04-29.md`
- Task packet:
  `docs/planning/v1parity-00-analysis-task-2026-04-29.md`
- Architecture contract:
  `docs/architecture/reference/live-runtime-lifecycle-parity-contract.md`

## Implementation Evidence

- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/bots.runtime-strategy-context.e2e.test.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- `apps/api/src/modules/engine/runtimePositionAutomationSkipTelemetry.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.test.ts`

## Validation Pack

- `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.service.test.ts`
- `pnpm --filter api exec vitest run src/modules/engine/runtimePositionAutomation.service.test.ts`
- `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-strategy-context.e2e.test.ts`
- `pnpm --filter api exec vitest run src/modules/bots/bots.e2e.test.ts -t "maps DCA ladder levels for basic repeated, advanced, and legacy strategy configs"`
- `pnpm --filter api run typecheck`
- `pnpm run quality:guardrails`

## Result

The repository now matches the approved architecture for the covered `LIVE`
runtime parity slice: `LIVE` add fills, account-update ownership scope,
runtime/read-model strategy truth, and operator-visible fail-closed skip
diagnostics all share one canonical meaning instead of splitting between
exchange-event side effects, optimistic UI fallback, and console-only logs.
