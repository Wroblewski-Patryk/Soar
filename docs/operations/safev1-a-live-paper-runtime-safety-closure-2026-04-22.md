# SAFEV1-A Live/Paper Runtime Safety Closure (2026-04-22)

Status: Closed  
Wave: `SAFEV1-A`

## Scope Closed

This closure pack covers the full `SAFEV1-A` remediation family:

- `SAFEV1-01..03`: zero-entry reconciliation truth closure,
- `SAFEV1-04..05`: fail-closed live capital truth,
- `SAFEV1-06..07`: canonical external ownership resolution,
- `SAFEV1-08..09`: production rate-limit degraded-mode hardening,
- `SAFEV1-10`: focused closure validation and evidence sync.

## What Changed

### Reconciliation Truth

- exchange reconciliation no longer creates or updates open synced positions
  when canonical entry truth is missing,
- incomplete exchange snapshots now stay explicit unresolved state instead of
  reintroducing zero-entry local positions.

Primary files:

- `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`

### Live Capital Truth

- live runtime capital now resolves credentials only from canonical wallet-owned
  or bot-owned API key context,
- the forbidden fallback to the latest user API key on the same exchange was
  removed,
- unresolved live credential ownership now stays fail closed for reference
  balance and DCA affordability.

Primary files:

- `apps/api/src/modules/engine/runtimeCapitalContext.service.ts`
- `apps/api/src/modules/engine/runtimeCapitalContext.service.test.ts`

### External Ownership Truth

- exchange-synced external ownership now resolves through one explicit
  `OWNED/AMBIGUOUS` contract,
- canonical market-group scope outranks legacy-only symbol bridges,
- runtime read and manual close flows now fail closed on ambiguous ownership
  instead of heuristically claiming a bot.

Primary files:

- `apps/api/src/modules/bots/runtimeExternalPositionOwner.service.ts`
- `apps/api/src/modules/bots/runtimeExternalPositionOwner.service.test.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionCommand.service.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionCommand.service.test.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`

### Rate-Limit Degraded Mode

- production rate limiting no longer silently settles into indefinite
  per-process in-memory enforcement when Redis is unavailable,
- degraded production requests now fail closed with explicit `503` and
  `X-RateLimit-Degraded=redis_unavailable`,
- Redis bootstrap failures now retry after cooldown instead of requiring a full
  process restart to recover.

Primary files:

- `apps/api/src/middleware/rateLimit.ts`
- `apps/api/src/middleware/rateLimit.test.ts`

## Validation Evidence

Focused closure pack PASS:

- `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts src/modules/engine/runtimeCapitalContext.service.test.ts src/modules/bots/runtimeExternalPositionOwner.service.test.ts src/modules/bots/runtimeSessionPositionCommand.service.test.ts src/middleware/rateLimit.test.ts`
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`
- `pnpm run quality:guardrails`

## Outcome

`SAFEV1-A` is closed end-to-end. The remaining V1 runtime safety gaps identified
by the post-`RELEASE-HARDEN-A` review are now covered by explicit contracts,
focused regressions, and fail-closed runtime behavior across reconciliation,
live capital truth, external ownership resolution, and production safeguard
degradation.
