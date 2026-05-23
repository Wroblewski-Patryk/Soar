# V1AUTO-03 Closure - Imported DCA Visibility

Status: closed
Date: 2026-04-30
Owner: Codex Execution Agent

## What Closed

Runtime positions payload no longer under-reports executed `DCA` on imported
managed positions that still lack historical local `OPEN` trade truth.

Before this fix, `dcaCount` was derived mainly as:

- `entryLegs.length - 1`

That worked for ordinary bot-opened positions, but failed for imported
lifecycles where the first locally persisted trade might already be
`lifecycleAction='DCA'`.

The read-model now derives `dcaCount` from the strongest available canonical
signals:

1. explicit `DCA` trades
2. runtime state `currentAdds`
3. legacy entry-leg inference

This restores truthful `dcaCount` and `dcaExecutedLevels` without inventing
missing historical `OPEN` trades.

## Files

- `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts`

## Validation

- `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts`
- `pnpm --filter api run typecheck`
- `pnpm run quality:guardrails`

## Remaining Follow-up

- protected post-deploy verification on the active `LIVE DOGEUSDT` flow
- potential follow-up only if production shows another visibility seam beyond
  `dcaCount` and `dcaExecutedLevels`
