# Code Quality Maintainability Closure

Date: 2026-04-21
Wave: `CQLT`
Status: Closed

## Scope Closed

- `CQLT-A` inventory and contract freeze
- `CQLT-B` maintainability guardrails
- `CQLT-C` shared i18n and fallback foundations
- `CQLT-D` shared helper extraction
- `CQLT-E` web monolith decomposition
- `CQLT-F` API monolith and exchange-adapter ownership decomposition
- `CQLT-G` fallback catalog, legacy bridge freeze, closure validation, and
  canonical sync

## Final Validation Evidence

API decomposition and regression evidence:

- `pnpm --filter api run test -- --run src/modules/orders/orders.service.test.ts`
- `pnpm --filter api run test -- --run src/modules/orders/orders-positions.e2e.test.ts`
- `pnpm --filter api run test -- --run src/modules/backtests/backtests.contract-remediation.test.ts`
- `pnpm --filter api run test -- --run src/modules/backtests/backtests.e2e.test.ts`
- `pnpm --filter api run test -- --run src/modules/bots/botOwnership.service.test.ts`
- `pnpm --filter api run test -- --run src/modules/bots/bots.e2e.test.ts`
- `pnpm --filter api run test -- --run src/modules/orders/orders.quantityRules.test.ts src/modules/bots/botStrategyProjectionDrift.service.test.ts src/modules/backtests/backtestRange.service.test.ts src/modules/exchange/exchangeConnectorFactory.service.test.ts`

Repository-wide quality gates:

- `pnpm run build`
- `pnpm run typecheck`
- `pnpm run quality:guardrails`
- `pnpm i18n:audit:route-reachable:web`

Infra preparation performed for DB-backed API suites:

- `pnpm --filter api exec prisma migrate reset --force --skip-seed`
- `pnpm --filter api exec prisma generate`

## Maintainability Delta

Confirmed architectural outcomes:

- `orders.service.ts` now delegates manual-order context, quantity rules,
  lifecycle authority, and exchange bootstrap to dedicated seams.
- `botsCommand.service.ts` no longer owns wallet-context compatibility checks
  or projection-drift reconciliation logic inline.
- `backtests.service.ts` no longer owns range resolution and report-lifecycle
  helper logic inline.
- exchange bootstrap ownership for orders now flows through one factory:
  `exchangeConnectorFactory.service.ts`.
- hidden bot update-path base-currency inference was removed; unresolved wallet
  context now fails closed instead of falling back to synthetic `USDT`.

## Residual Findings (Superseded)

At the time of `CQLT` closure, `pnpm i18n:audit:route-reachable:web` still
reported repository-wide residual findings:

- `findings=35`
- `localCopy=28`
- `fallbackPl=4`
- `hardcoded=6`

Interpretation at that time:

- these are historical/global route-reachable findings outside the specific
  CQLT slices already closed in this wave
- the audit artifact was refreshed and preserved at
  `docs/operations/_artifacts-l10nq-d-coverage-audit-latest.json`
- no new `CQLT` slice remained open after this closure; the residual follow-up
  was queued explicitly as `L10NQ-E` in
  `docs/planning/l10nq-e-residual-route-reachable-i18n-closure-plan-2026-04-21.md`
  rather than left as implicit carry-over

Superseding note:

- `L10NQ-E` is now closed and the residual route-reachable i18n debt has been
  reduced to zero actionable findings; see
  `docs/operations/l10nq-e-residual-route-reachable-i18n-closure-2026-04-21.md`
