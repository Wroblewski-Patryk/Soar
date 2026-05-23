# Review-B Runtime/Exchange Production Readiness Plan (2026-04-22)

Status: Closed 2026-04-22  
Wave: `REVIEW-B`

## Objective

Close the production-critical gaps found by the post-`XLIFE-A` review so V1 bot
execution remains truthful not only for `OPEN/CLOSE`, but also for DCA/add-leg
execution, submitted-order retry behavior, and operator exchange diagnostics.

## Why This Wave Exists

The latest review confirmed that the main `OPEN/CLOSE` lifecycle is much safer,
but four real gaps remain:

1. DCA/add-leg execution still mutates local position state from request data
   before canonical live fill truth exists.
2. Submitted runtime dedupe is marked terminal too early and can suppress
   legitimate retries after exchange-side failure or cancelation.
3. Generic exchange snapshot reads are ambiguous when a user has multiple API
   keys.
4. Runtime watchdog symbol selection is broader than its explicit Binance-only
   execution scope.

## Governing Sources

- `history/audits/review-b-runtime-exchange-production-audit-2026-04-22.md`
- `docs/architecture/reference/execution-lifecycle-parity-contract.md`
- `docs/architecture/reference/live-safety-and-contract-truth-remediation-contract.md`

## Task Packets

### REVIEW-B-01 docs(contract): freeze review-driven runtime/exchange closure scope and non-regression rules

Reason:

- the next executor needs one explicit task family instead of scattered review
  notes

Primary files:

- this plan
- canonical queue/context files

Acceptance:

- the review findings are translated into one executor-ready wave
- DCA lifecycle parity, submitted dedupe truth, snapshot ownership, and
  watchdog scope are explicitly named as the only in-scope workstreams

Validation:

- docs sanity review

### REVIEW-B-02 test(api-red): lock DCA pending/partial-fill failure modes before refactor

Reason:

- the highest remaining execution bug is now in add-leg lifecycle, not in basic
  open/close

Primary files:

- `apps/api/src/modules/engine/runtimePositionAutomation.service.test.ts`
- adjacent engine/runtime tests if needed

Must validate:

- `LIVE` DCA with `OPEN` result does not mutate position quantity or entry
  price
- `LIVE` DCA with `PARTIALLY_FILLED` result does not finalize local DCA truth
- DCA trade ledger does not persist request `markPrice` when canonical fill
  truth is unresolved

Validation:

- `pnpm --filter api run test -- --run <focused DCA/runtime pack>`

### REVIEW-B-03 refactor(api-runtime): move DCA/add-leg execution onto canonical fill-result lifecycle

Reason:

- add-legs must obey the same domain truth rules as opens and closes

Primary files:

- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- adjacent shared lifecycle helpers if extraction is needed

Acceptance:

- DCA no longer force-finalizes pending live orders through synthetic local
  shortcuts
- position quantity, entry price, and DCA trades are derived from canonical fill
  truth only
- `PAPER` and `LIVE` use the same touched add-leg lifecycle semantics

Validation:

- focused runtime/DCA pack
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`

### REVIEW-B-04 test(api-red): lock submitted-order retry semantics after exchange failure/cancel

Reason:

- submitted dedupe is currently terminal too early

Primary files:

- `apps/api/src/modules/engine/executionOrchestrator.service.test.ts`
- `apps/api/src/modules/engine/runtimeCrashRetry.regression.test.ts`
- `apps/api/src/modules/engine/runtimeExecutionDedupe.service.test.ts`

Must validate:

- submitted `OPEN` can be retried after canonical order failure/cancel outcome
- submitted `CLOSE` can be retried after canonical order failure/cancel outcome
- dedupe does not permanently suppress execution when no final lifecycle truth
  exists

Validation:

- `pnpm --filter api run test -- --run <focused dedupe/runtime pack>`

### REVIEW-B-05 refactor(api-runtime): make submitted dedupe non-terminal until canonical order outcome is known

Reason:

- retries must be controlled by lifecycle truth, not by the first submitted
  event

Primary files:

- `apps/api/src/modules/engine/executionOrchestrator.service.ts`
- `apps/api/src/modules/engine/runtimeExecutionDedupe.service.ts`
- any touched reconciliation helper in scope

Acceptance:

- submitted state no longer behaves like terminal success
- retry eligibility is explicit and deterministic after order cancel/failure
- close flow remains fail-closed while still permitting safe retry when needed

Validation:

- focused dedupe/runtime pack
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`

### REVIEW-B-06 audit(api-ops): inventory exchange snapshot ownership ambiguity and watchdog scope drift

Reason:

- operator tooling must be truthful, not merely technically functional

Primary files:

- `apps/api/src/modules/positions/positions.service.ts`
- `apps/api/src/modules/engine/runtimeScanLoop.service.ts`

Acceptance:

- snapshot ownership ambiguity is classified with explicit closure action
- watchdog scope mismatch is classified with explicit closure action

Validation:

- docs/code audit notes in the active task implementation

### REVIEW-B-07 refactor(api-ops): make exchange snapshots and watchdog scope explicit and deterministic

Reason:

- operator recovery flows must not rely on ambiguous account selection or fake
  watchdog coverage

Primary files:

- `apps/api/src/modules/positions/positions.service.ts`
- `apps/api/src/modules/engine/runtimeScanLoop.service.ts`
- focused tests in the same module family

Acceptance:

- generic snapshot flow becomes explicit or fail-closed when ownership is
  ambiguous
- watchdog symbol inventory matches its explicit supported scope
- docs and runtime contracts stop implying broader coverage than exists

Validation:

- focused positions/runtime watchdog tests
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`

### REVIEW-B-08 qa(closure): run focused production-readiness pack and publish closure evidence

Reason:

- this wave must end with executable evidence, not only reasoning

Acceptance:

- focused review-b validation pack passes
- closure evidence is published under `docs/operations/`
- canonical queue/context/docs are synchronized

Validation:

- `pnpm run quality:guardrails`
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`
- focused `vitest` pack for touched runtime/positions modules

## Progress Log

- 2026-04-22: Closed `REVIEW-B` end-to-end by moving DCA/add-leg execution onto
  canonical fill-result lifecycle, making submitted dedupe non-terminal until
  linked order truth is known, making exchange snapshots fail closed when
  ownership is ambiguous unless `apiKeyId` is explicit, narrowing watchdog
  symbol scope to explicit Binance-futures contexts, and publishing closure
  evidence in
  `history/plans/review-b-runtime-exchange-production-closure-2026-04-22.md`.
