# SAFEV1-A Live/Paper Runtime Safety Plan (2026-04-22)

Status: Active  
Wave: `SAFEV1-A`

## Objective

Close the remaining V1 runtime safety gaps so `LIVE` and `PAPER` share one
truthful lifecycle while exchange-derived state, capital context, ownership,
and safeguard degradation remain explicit and fail closed.

## Why This Wave Exists

The latest production review confirmed four remaining V1 risks:

1. exchange reconciliation can still create or refresh open positions with zero
   entry price,
2. live capital context can still fall back to the latest user API key on the
   same exchange,
3. external exchange-position ownership still relies on broad symbol-level
   heuristics,
4. production rate limiting can silently settle into per-process in-memory mode
   after Redis failures.

## Governing Sources

- `docs/operations/safev1-a-live-paper-runtime-safety-audit-2026-04-22.md`
- `docs/architecture/reference/execution-lifecycle-parity-contract.md`
- `docs/architecture/reference/live-paper-runtime-safety-contract.md`
- `docs/architecture/reference/live-safety-and-contract-truth-remediation-contract.md`
- `docs/architecture/reference/exchange-access-ownership-matrix.md`

## Task Packets

### SAFEV1-01 docs(contract): freeze live/paper runtime safety scope for zero-entry, capital truth, ownership, and limiter degradation

Reason:

- the next executor needs one explicit V1-safety family instead of spreading
  these findings across review notes

Primary files:

- this plan
- new runtime safety contract
- canonical queue/context files

Acceptance:

- in-scope workstreams are limited to reconciliation entry truth, live capital
  truth, external ownership truth, and rate-limit degradation contract
- non-goals are explicit: no new exchange rollout, no dashboard redesign, no
  assistant feature work

Validation:

- docs sanity review

### SAFEV1-02 test(api-red): lock incomplete exchange snapshot handling so reconciliation cannot persist zero-entry open positions

Reason:

- zero-entry reintroduction through reconciliation is the fastest way to poison
  runtime truth again

Primary files:

- `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`
- adjacent focused positions tests if needed

Must validate:

- reconciliation does not create or update open positions when both
  `entryPrice` and `markPrice` are unavailable or invalid
- unresolved exchange state stays explicit instead of becoming a tradable local
  open position

Validation:

- `pnpm --filter api run test -- --run <focused reconciliation pack>`

### SAFEV1-03 refactor(api-reconciliation): make exchange-synced open position creation fail closed on missing canonical entry truth

Reason:

- exchange reconciliation must obey the same no-zero-entry rule already frozen
  for canonical lifecycle paths

Primary files:

- `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
- touched reconciliation helpers/tests

Acceptance:

- no new or updated open synced position can persist `entryPrice <= 0`
- unresolved snapshot rows remain explicit unresolved truth rather than local
  synthetic positions
- no touched path weakens existing ownership or sync-state semantics

Validation:

- focused reconciliation pack
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`

### SAFEV1-04 test(api-red): lock fail-closed live capital context when canonical wallet/bot credential ownership is missing

Reason:

- sizing and DCA checks are safety-critical and must not depend on unrelated
  user exchange keys

Primary files:

- `apps/api/src/modules/engine/runtimeCapitalContext.service.test.ts`
- adjacent runtime sizing/DCA tests if needed

Must validate:

- live reference balance does not resolve through latest user API key fallback
- wallet-scoped and bot-scoped live capital remains explicit unresolved when no
  canonical credential is attached
- `PAPER` behavior remains unchanged and still uses the shared lifecycle
  semantics

Validation:

- `pnpm --filter api run test -- --run <focused runtime capital pack>`

### SAFEV1-05 refactor(api-runtime): remove forbidden live capital fallback to unrelated recent API keys

Reason:

- live capital context must obey the same ownership discipline already enforced
  for live order execution

Primary files:

- `apps/api/src/modules/engine/runtimeCapitalContext.service.ts`
- touched tests and narrow consumers if needed

Acceptance:

- live capital context resolves only wallet-owned or bot-owned credentials
- unresolved live capital remains explicit fail-closed state
- touched runtime sizing and DCA paths do not silently become permissive on
  missing live credential ownership

Validation:

- focused runtime capital pack
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`

### SAFEV1-06 test(api-red): lock canonical external-position ownership under overlapping symbol coverage

Reason:

- runtime takeover and manual close cannot rely on broad symbol heuristics when
  two live bots overlap

Primary files:

- `apps/api/src/modules/bots/runtimeExternalPositionOwner.service.test.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionCommand.service.test.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts`

Must validate:

- overlapping symbol coverage becomes explicit ambiguity unless canonical owner
  scope resolves it
- legacy strategy bridges do not outrank canonical wallet/bot scope
- manual close and runtime reads fail closed on ambiguous external ownership

Validation:

- `pnpm --filter api run test -- --run <focused external ownership pack>`

### SAFEV1-07 refactor(api-runtime): replace symbol-level ownership heuristics with one deterministic canonical owner contract

Reason:

- V1 live takeover must be deterministic and safe even when legacy
  compatibility data still exists

Primary files:

- `apps/api/src/modules/bots/runtimeExternalPositionOwner.service.ts`
- touched runtime readers/commands that consume it

Acceptance:

- canonical wallet/bot scope outranks legacy symbol-only bridges
- ambiguity stays explicit and fail closed
- no touched path silently auto-claims an external position for the wrong bot

Validation:

- focused external ownership pack
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`

### SAFEV1-08 test(api-red): lock explicit degraded-state contract for production rate limiting

Reason:

- auth and trading safeguards need one explicit behavior when Redis is
  unavailable

Primary files:

- `apps/api/src/middleware/rateLimit.test.ts`
- adjacent auth/trading limiter tests if needed

Must validate:

- production Redis bootstrap/runtime failures do not silently settle into
  indefinite local-only mode
- degraded behavior is explicit and deterministic

Validation:

- `pnpm --filter api run test -- --run <focused rate-limit pack>`

### SAFEV1-09 refactor(api-ops): harden rate-limit degradation policy for production-sensitive endpoints

Reason:

- infra partial failure must not quietly weaken global protection

Primary files:

- `apps/api/src/middleware/rateLimit.ts`
- any touched config/test helper in scope

Acceptance:

- production limiter degradation is explicit, bounded, and operator-visible
- limiter bootstrap/runtime errors do not get cached into indefinite local-only
  enforcement without signal
- local/dev ergonomics remain practical where that behavior is intentionally
  allowed

Validation:

- focused rate-limit pack
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`

### SAFEV1-10 qa(closure): run focused V1 runtime safety pack and publish closure evidence

Reason:

- this wave must end with executable evidence, not only reasoning

Acceptance:

- focused validation packs for reconciliation, runtime capital, external
  ownership, and limiter degradation all pass
- closure evidence is published under `docs/operations/`
- canonical queue/context/docs are synchronized

Validation:

- `pnpm run quality:guardrails`
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`
- focused `vitest` packs for touched modules

## Execution Order

1. `SAFEV1-01`
2. `SAFEV1-02`
3. `SAFEV1-03`
4. `SAFEV1-04`
5. `SAFEV1-05`
6. `SAFEV1-06`
7. `SAFEV1-07`
8. `SAFEV1-08`
9. `SAFEV1-09`
10. `SAFEV1-10`

## Non-Goals

- no new exchange support rollout,
- no dashboard UX redesign,
- no assistant/runtime feature expansion,
- no speculative refactor outside touched runtime, positions, bots, and
  middleware seams.

## Progress Log

- 2026-04-22: Queued `SAFEV1-A` after the post-`RELEASE-HARDEN-A` review
  confirmed four remaining V1 safety gaps: zero-entry exchange reconciliation,
  forbidden live capital fallback to unrelated user API keys, heuristic
  external ownership under overlapping symbol coverage, and silent production
  limiter degradation to per-process state. Published audit evidence in
  `docs/operations/safev1-a-live-paper-runtime-safety-audit-2026-04-22.md`
  and froze the permanent rules in
  `docs/architecture/reference/live-paper-runtime-safety-contract.md`.
- 2026-04-22: Closed `SAFEV1-01..SAFEV1-03` by adding a focused regression for
  missing entry truth in exchange reconciliation and hardening
  `livePositionReconciliation.service.ts` so incomplete snapshots no longer
  create or update open synced positions with zero entry price. Validation
  PASS: focused reconciliation test, `api typecheck`, `api build`.
- 2026-04-22: Closed `SAFEV1-04..SAFEV1-05` by adding fail-closed live capital
  regressions and hardening `runtimeCapitalContext.service.ts` so live
  reference balance and DCA affordability no longer resolve through unrelated
  recent user API keys on the same exchange. Validation PASS: focused runtime
  capital test, `api typecheck`, `api build`.
- 2026-04-22: Closed `SAFEV1-06..SAFEV1-07` by adding focused ownership
  regressions and hardening `runtimeExternalPositionOwner.service.ts` to
  return explicit `OWNED/AMBIGUOUS` truth, with canonical market-group scope
  outranking legacy-only symbol bridges and manual runtime close staying fail
  closed on ambiguous ownership. Validation PASS: focused ownership/close
  tests, `api typecheck`, `api build`.
- 2026-04-22: Closed `SAFEV1-08..SAFEV1-09` by adding degraded-state rate-limit
  regressions and hardening `middleware/rateLimit.ts` so production requests
  fail closed with explicit degraded-state signaling when Redis is unavailable,
  while local fallback remains bounded and reconnect attempts retry after
  cooldown. Validation PASS: focused rate-limit test, `api typecheck`,
  `api build`.
