# LUC-3726 Production UI Audit Helper Test Repair

Date: 2026-06-13

## Context

[LUC-3726](/LUC/issues/LUC-3726) repaired the source-promotion blocker from
[LUC-3720](/LUC/issues/LUC-3720): the production UI module clickthrough audit
option helper exposed placeholder admin email/password environment values even
when CLI admin token auth was provided.

## Change

- `scripts/runProdUiModuleClickthroughAudit.mjs` now treats a provided token as
  the complete auth method for that role and ignores unused credential
  fallbacks.
- `scripts/runProdUiModuleClickthroughAudit.test.mjs` now reproduces the
  placeholder admin env case and verifies credential fallbacks are preserved
  only when no token is present.

## Verification

- `node --test scripts/runProdUiModuleClickthroughAudit.test.mjs` PASS (`4`
  tests).
- `node --test scripts/auditArchitectureGraphDrift.test.mjs scripts/runProdUiModuleClickthroughAudit.test.mjs scripts/runProdUxA11yMobileProof.test.mjs scripts/collectNonGateioRuntimeReadback.test.mjs scripts/collectSloEvidence.test.mjs scripts/dev-backend.test.mjs scripts/dev-workers.test.mjs scripts/evaluateRollbackGuard.test.mjs scripts/generateFunctionJourneyIndexes.test.mjs scripts/generateUserActionIndex.test.mjs scripts/goLiveSmoke.test.mjs scripts/resolveOpsAuthToken.test.mjs scripts/runLocalExternalGatesPipeline.test.mjs scripts/runRcRefreshSummaryStrict.test.mjs scripts/waitForWebBuildInfo.test.mjs` PASS (`89` tests).

## Release Impact

- Deploy impact: none; helper/test-only source repair.
- Push status: held for parent source-control gate.
- Residual risk: full repo test was not rerun in this task; parent already
  recorded broader passing checks and this issue scoped the targeted blocker.
