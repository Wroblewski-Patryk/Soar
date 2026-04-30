# V1AUTO-A Closure - Imported LIVE Runtime-State Rebase

Date: 2026-04-30
Status: Closed

## Summary

Closed the runtime continuity seam where an imported `EXCHANGE_SYNC` `LIVE`
position could keep the same `positionId` while canonical exchange truth
changed, but runtime automation still reused stale persisted local management
state.

The runtime engine now rebases imported position state to canonical
exchange-synced `quantity + entryPrice` truth before evaluating `DCA/TTP/TSL`
when the persisted basis drift is material.

## Scope

- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- `apps/api/src/modules/engine/runtimePositionAutomationStateRebase.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.test.ts`

## Validation

- `pnpm --filter api exec vitest run src/modules/engine/runtimePositionAutomation.service.test.ts`
- `pnpm --filter api run typecheck`
- `pnpm run quality:guardrails`

## Result

- imported `LIVE` runtime automation no longer trusts stale persisted
  `currentAdds`, quantity basis, or entry basis when canonical exchange-sync
  truth changed in place
- focused regression now proves stale imported DCA state cannot suppress a valid
  first DCA on the new canonical basis
- no architecture drift or workaround path introduced
