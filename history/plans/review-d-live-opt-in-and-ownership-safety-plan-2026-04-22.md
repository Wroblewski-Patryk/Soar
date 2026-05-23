# REVIEW-D Live Opt-In and Ownership Safety Plan (2026-04-22)

Status: Closed  
Wave: `REVIEW-D`

## Objective

Close the remaining post-`SAFEV1-A` production-safety gaps where runtime
admission, orphan ownership, and release readiness can still drift from the
canonical V1 contract.

## Why This Wave Exists

The latest review confirmed four remaining truth gaps:

1. runtime topology still admits active `LIVE` bots even when `liveOptIn` is
   false,
2. runtime automation can still operate orphan `BOT` positions through
   env-default manual context,
3. takeover rebind can assign orphan bot-origin positions without canonical
   ownership proof,
4. release readiness still accepts legacy `API_KEY_ENCRYPTION` fallback as if
   it were the canonical keyring contract.

## Governing Sources

- `history/audits/review-d-live-opt-in-and-ownership-safety-audit-2026-04-22.md`
- `docs/architecture/reference/execution-lifecycle-parity-contract.md`
- `docs/architecture/reference/live-paper-runtime-safety-contract.md`
- `docs/operations/v1-release-gate-runbook.md`

## Task Packets

### REVIEW-D-01 docs(contract): freeze live opt-in, orphan-position, and readiness-truth closure scope

Reason:

- the next executor needs one explicit task family instead of reconstructing
  intent from audit findings

Primary files:

- this plan
- canonical queue/context files

Acceptance:

- runtime admission, orphan automation, takeover rebind, and readiness truth
  are the only in-scope workstreams
- non-goals are explicit: no new exchange rollout, no UI redesign, no unrelated
  cleanup

Validation:

- docs sanity review

### REVIEW-D-02 test(api-red): lock runtime admission so non-opted-in LIVE bots cannot enter signal topology

Reason:

- `liveOptIn` must be a real runtime gate, not only a write-path guard

Primary files:

- `apps/api/src/modules/engine/runtimeSignalLoop.service.test.ts`
- `apps/api/src/modules/engine/runtimeSignalLoop.repository.ts`
- adjacent focused runtime tests if needed

Must validate:

- `LIVE` bots with `liveOptIn=false` are excluded from runtime topology
- signal routing does not evaluate or emit execution-side activity for
  non-opted-in live bots
- `PAPER` behavior stays unchanged

Validation:

- `pnpm --filter api run test -- --run <focused runtime topology pack>`

### REVIEW-D-03 refactor(api-runtime): enforce live opt-in admission across runtime topology and automation candidate selection

Reason:

- runtime topology and automation must share the same admission truth

Primary files:

- `apps/api/src/modules/engine/runtimeSignalLoop.repository.ts`
- `apps/api/src/modules/engine/runtimeSignalLoopDefaults.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`

Acceptance:

- live topology excludes `LIVE` bots without `liveOptIn=true`
- runtime automation candidate selection does not operate positions belonging to
  non-opted-in live bots
- touched paths remain unchanged for `PAPER` and opted-in `LIVE`

Validation:

- focused runtime topology/automation pack
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`

### REVIEW-D-04 test(api-red): lock fail-closed handling for orphan bot-origin positions

Reason:

- bot-origin orphan state must not inherit manual env defaults

Primary files:

- `apps/api/src/modules/engine/runtimePositionAutomation.service.test.ts`
- adjacent engine/runtime regression tests if needed

Must validate:

- orphan `origin='BOT'` positions with `botId=null` are skipped by automation
- no DCA or close command is attempted for orphan bot-origin positions
- env-default manual runtime context is not used for bot-origin orphan state

Validation:

- `pnpm --filter api run test -- --run <focused runtime automation pack>`

### REVIEW-D-05 refactor(api-runtime): keep orphan bot-origin positions unresolved until canonical bot context exists

Reason:

- ownership drift on money-impacting state must stay explicit and fail closed

Primary files:

- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- touched runtime ownership helpers if extraction is needed

Acceptance:

- bot-origin orphan positions are skipped before any mode/exchange fallback is
  applied
- manual env-default context remains available only for genuinely manual
  runtime flows
- touched paths do not reintroduce hidden ownership inference

Validation:

- focused runtime automation pack
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`

### REVIEW-D-06 test(api-red): lock canonical takeover-rebind ownership for orphan bot-origin positions

Reason:

- rebind endpoints must be safer than the drift they are trying to heal

Primary files:

- `apps/api/src/modules/positions/positions.exchangeSnapshot.e2e.test.ts`
- `apps/api/src/modules/positions/positions.service.ts`
- any focused takeover-status/rebind tests in scope

Must validate:

- `origin='BOT'` orphan positions are not rebound just because one eligible bot
  exists
- exchange-synced rebind still honors api-key truth where canonical
- ambiguous or ownerless bot-origin positions remain unresolved

Validation:

- `pnpm --filter api run test -- --run <focused takeover pack>`

### REVIEW-D-07 refactor(api-positions): canonicalize takeover rebind to explicit ownership proof or unresolved state

Reason:

- bot-origin orphan positions need stricter provenance than exchange-synced
  imports

Primary files:

- `apps/api/src/modules/positions/positions.service.ts`
- touched controller tests if response semantics change

Acceptance:

- `origin='BOT'` rebind requires canonical owner proof and otherwise remains
  unresolved
- exchange-synced rebind keeps deterministic api-key-based ownership
- result counters and operator-facing behavior stay explicit and reviewable

Validation:

- focused takeover pack
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`

### REVIEW-D-08 test(api+ops-red): lock readiness truth so legacy API-key encryption fallback is compatibility-only

Reason:

- production readiness should not report green on legacy-only encryption config

Primary files:

- `apps/api/src/config/criticalSecretsReadiness.test.ts`
- `apps/api/src/router/health-readiness.test.ts`
- `apps/api/src/utils/crypto.test.ts`

Must validate:

- readiness fails when only legacy `API_KEY_ENCRYPTION` exists
- versioned keyring stays the canonical ready-state
- legacy decrypt compatibility remains explicit for migration reads

Validation:

- `pnpm --filter api run test -- --run <focused readiness/crypto pack>`

### REVIEW-D-09 refactor(api-ops): separate legacy decrypt compatibility from canonical release readiness

Reason:

- migration support and readiness truth should not be the same contract

Primary files:

- `apps/api/src/config/criticalSecretsReadiness.ts`
- `apps/api/src/utils/crypto.ts`
- touched readiness/router helpers if needed

Acceptance:

- readiness requires versioned keyring material
- legacy fallback remains compatibility-only for decrypt/migration paths
- no touched release-health path reports ready from legacy-only env state

Validation:

- focused readiness/crypto pack
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`

### REVIEW-D-10 qa(closure): run focused REVIEW-D pack and publish closure evidence

Reason:

- this wave must end with executable evidence, not only reasoning

Acceptance:

- focused review-d validation pack passes
- closure evidence is published under `docs/operations/`
- canonical queue/context/docs are synchronized

Validation:

- `pnpm run quality:guardrails`
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`
- focused `vitest` pack for touched runtime, positions, and readiness modules

## Execution Order

1. `REVIEW-D-01`
2. `REVIEW-D-02`
3. `REVIEW-D-03`
4. `REVIEW-D-04`
5. `REVIEW-D-05`
6. `REVIEW-D-06`
7. `REVIEW-D-07`
8. `REVIEW-D-08`
9. `REVIEW-D-09`
10. `REVIEW-D-10`

## Non-Goals

- no new exchange support rollout,
- no dashboard feature or styling work,
- no speculative refactor outside touched runtime, positions, and readiness
  seams,
- no release-process expansion beyond the readiness truth required by this
  wave.

## Progress Log

- 2026-04-22: Queued `REVIEW-D` from the post-`SAFEV1-A` review after
  confirming four remaining production-safety gaps: non-opted-in live bots can
  still enter runtime topology, orphan bot-origin positions can still inherit
  manual env-default automation context, takeover rebind can still assign
  orphan bot-origin positions without canonical owner proof, and readiness
  still treats legacy API-key encryption fallback as production-ready key
  material. Published audit evidence in
  `history/audits/review-d-live-opt-in-and-ownership-safety-audit-2026-04-22.md`
  and this executor-ready rollout plan.
- 2026-04-22: Closed `REVIEW-D-01..REVIEW-D-03` by making runtime signal
  topology exclude `LIVE` bots unless `liveOptIn=true` at both repository and
  defaults-level admission, and by making runtime automation skip live
  positions owned by non-opted-in bots before any strategy lookup, DCA, or
  close-path execution can start. Validation PASS:
  `pnpm --filter api exec vitest run src/modules/engine/runtimeSignalLoopDefaults.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts`,
  `pnpm --filter api run typecheck`, `pnpm --filter api run build`,
  `pnpm run quality:guardrails`.
- 2026-04-22: Closed `REVIEW-D-04..REVIEW-D-05` by making runtime automation
  skip orphan `origin='BOT'` positions before any manual env-default mode,
  exchange, or market fallback can apply, keeping bot-origin orphan state
  explicit and unresolved until canonical bot ownership exists. Validation
  PASS:
  `pnpm --filter api exec vitest run src/modules/engine/runtimeSignalLoopDefaults.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts`,
  `pnpm --filter api run typecheck`, `pnpm --filter api run build`.
- 2026-04-22: Closed `REVIEW-D-06..REVIEW-D-07` by making takeover rebind for
  orphan `origin='BOT'` positions require explicit canonical ownership proof;
  without that proof, bot-origin orphan positions now stay unresolved instead
  of being rebound from the currently eligible LIVE bot set. Validation PASS:
  `pnpm --filter api exec vitest run src/modules/positions/positions.takeover-status.e2e.test.ts`,
  `pnpm --filter api run typecheck`, `pnpm --filter api run build`.
- 2026-04-22: Closed `REVIEW-D-08..REVIEW-D-10` by requiring canonical
  versioned `API_KEY_ENCRYPTION_KEYS` for readiness and new encryption writes,
  keeping legacy `API_KEY_ENCRYPTION` as compatibility-only decrypt material,
  and publishing closure evidence in
  `history/plans/review-d-live-opt-in-and-ownership-safety-closure-2026-04-22.md`.
