# LUC-2381 Resolve Dirty Runtime-Monitoring Source State Blocking 4787ee98 Promotion

## Context
[LUC-2378](/LUC/issues/LUC-2378) is the Ops push and production-promotion permit
for candidate `4787ee9859c02fc950f781eb5803d97a930aa977`. The permit failed
closed because the local checkout was dirty in Backend Bot Runtime monitoring
source files and source-of-truth artifacts from the read-model decomposition
lane.

## Goal
Resolve the dirty source state so [LUC-2378](/LUC/issues/LUC-2378) can recheck
the promotion candidate from a coherent source commit.

## Constraints
- Do not push, deploy, restart, rollback, mutate environments, touch secrets, or
  run protected production smoke from this Backend source-state closure.
- Do not revert unrelated user or agent work.
- Preserve the runtime aggregate fallback behavior from the verified
  decomposition lane.

## Definition of Done
- Runtime-monitoring dirty files are classified and either committed or
  explicitly blocked.
- Relevant Backend validation passes.
- Source-of-truth state records the closure.
- The issue thread states the resolved source commit for the Ops permit.

## Forbidden
- No production mutation.
- No secret, exchange credential, live-trading, or protected account action.
- No temporary debug logging in the runtime aggregate path.

## Stage
- Current delivery stage: `verification`.
- Expected output: source-state closure commit plus validation evidence.

## Implementation
- Classified the dirty source state as the coherent Backend read-model
  decomposition closure set from [LUC-2367](/LUC/issues/LUC-2367) /
  [LUC-2368](/LUC/issues/LUC-2368): type-only imports in extracted helper
  modules, `25000ms` aggregate subquery timeout default, source-of-truth
  records, and task evidence.
- Removed stray diagnostic `console.error` logging from the aggregate positions
  fallback path before closure; fallback behavior remains timeout/error ->
  bounded fallback projection -> empty positions payload if fallback fails.
- Preserved the known residual release-behavior gap: full DB-backed aggregate
  e2e still requires a clean local test database rerun before production release
  behavior proof is claimed.

## Verification
- PASS: `pnpm --filter api exec tsc --noEmit --pretty false`.
- PASS: `pnpm run quality:guardrails`.
- PASS: `pnpm --filter api exec vitest run src/modules/bots/runtimeMonitoringAggregateConcurrency.test.ts src/modules/bots/runtimeSessionPositionsRead.service.test.ts --run --sequence.concurrent=false` (`23/23`).
- Pending before final commit: `git diff --check`.

## Result Report
- Status: `verified local`.
- Source commit: recorded in the [LUC-2381](/LUC/issues/LUC-2381) issue update
  after commit creation.
- Deployment impact: none; this is a local source-state closure only.
- Residual risk: [LUC-2378](/LUC/issues/LUC-2378) still must apply its own Ops
  push/promotion permit gates, and runtime aggregate full e2e release-behavior
  proof remains dependent on a clean local test DB rerun.
