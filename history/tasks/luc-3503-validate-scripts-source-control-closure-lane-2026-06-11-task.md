# LUC-3503 Validate Scripts Source-Control Closure Lane

## Header
- ID: LUC-3503
- Title: [Soar][DRE/QVE] Validate scripts source-control closure lane
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Priority: P1
- Mission ID: LUC-3503-SCRIPTS-SOURCE-CONTROL-CLOSURE-2026-06-11
- Mission Status: VERIFIED

## Context
[LUC-3503](/LUC/issues/LUC-3503) is a child of [LUC-3499](/LUC/issues/LUC-3499).
[LUC-3499](/LUC/issues/LUC-3499) classified the Soar dirty worktree after the
2026-06-11 control tick and routed the scripts source-control lane for DRE/QVE
validation before any commit closure.

The lane is scoped to local source-control classification only:

- 32 modified `scripts/*.mjs` / script contract files.
- 30 untracked focused `scripts/*.test.mjs` files.
- No push, deploy, restart, protected smoke, secret disclosure, production
  account mutation, DB/Redis mutation, exchange/order/position/payment, or
  live-trading mutation.

## Goal
Validate whether the scripts dirty group is current, locally verified, and
commit-ready as part of the broader source-control closure batch.

## Scope
Reviewed script path families, without full diff replay:

- Release/Ops gates and evidence: `goLiveSmoke`, `runRcRefreshSummaryStrict`,
  `summarizeRcGates`, `syncRcChecklistFromGateStatus`,
  `releaseOpsScriptContracts`, `collectSloEvidence`,
  `evaluateRollbackGuard`, `runRestoreDrillEvidence`,
  `runRollbackProofEvidence`, `runCutoverDryRun`.
- Local runtime and worker wrappers: `dev-backend`, `dev-workers`,
  `runWebNextProductionCommand`, `start-local-prod-like`,
  `start-workers-prod`.
- Protected/public proof helpers: `runLocalProtectedRouteActionProof`,
  `runProdAuthSessionBrowserProof`, `runProdFixtureActionProof`,
  `runProdPositionsProof`, `runProdSecurityExchangeProof`,
  `runPublicReadOnlyBrowserProof`, `runControlledLiveSessionProof`.
- Known-state and traceability generators: `generateFunctionJourneyIndexes`,
  `generateUserActionIndex`, `runKnownStateRefresh`, `runV1StaticIssueScan`,
  `runQaRepeatableSmokeE2e`, `runLocalExternalGatesPipeline`.
- Utility/readback helpers: `collectNonGateioRuntimeReadback`,
  `resolveOpsAuthToken`, `runAud07IsolatedDbPacks`,
  `runBackupVerificationProfile`.

## Implementation Plan
1. Read the scoped wake and heartbeat context for [LUC-3503](/LUC/issues/LUC-3503).
2. Classify the scripts dirty group by modified and untracked path families.
3. Run safe local syntax checks for modified scripts.
4. Run focused local script tests for the corresponding untracked test files.
5. Record source-control recommendation without staging, committing, pushing,
   deploying, or mutating runtime state.

## Acceptance Criteria
- Script families are listed by path family, not full diffs.
- Syntax or focused tests are run where safe.
- The scripts group is classified as commit-ready, needs fixes, obsolete, or
  should be split.
- Commit/no-commit recommendation is explicit.

## Validation Evidence
- `git diff --name-only -- scripts` readback: 32 modified script paths.
- `git ls-files --others --exclude-standard -- scripts/*.test.mjs` readback:
  30 untracked focused test paths.
- `node --check` for all 32 modified script/contract files: PASS.
- `git diff --check -- scripts`: PASS; warnings only about LF/CRLF on Windows.
- Focused contract pack:
  `node --test scripts/releaseOpsScriptContracts.test.mjs scripts/startLocalProdLike.test.mjs scripts/startWorkersProd.test.mjs scripts/rcGateSummaryChecklist.test.mjs`
  PASS, 24/24 tests.
- Full corresponding script test pack:
  `node --test` over the 30 untracked script test files plus
  `scripts/releaseOpsScriptContracts.test.mjs` PASS, 207/207 tests.
- `Get-Process chrome-headless-shell -ErrorAction SilentlyContinue` found no
  leftover validation browser process.

## Classification
Status: `verified / commit-ready-as-part-of-broader-batch`.

The scripts group is current and tied to recent local proof lanes. The diffs
are not obsolete and do not need to be split on DRE/QVE evidence grounds. The
modified scripts and untracked focused tests should be committed together with
the matching docs/state/evidence source-control closure batch selected by the
parent closure owner.

## Source-Control Recommendation
- Commit recommendation: commit the scripts group with its corresponding tests
  as part of the coherent [LUC-3499](/LUC/issues/LUC-3499) source-control
  closure batch.
- This heartbeat did not create a commit because [LUC-3503](/LUC/issues/LUC-3503)
  is a validation/classification lane, the worktree also contains broad
  non-script dirty state owned by sibling lanes, and a partial scripts-only
  commit would risk separating code/tests from their source-of-truth evidence.
- Push status: not needed.
- Deploy impact: none.

## Definition of Done
- [x] Scripts dirty group classified.
- [x] Safe syntax and focused script tests passed.
- [x] Commit/no-commit recommendation recorded.
- [x] No protected or production mutation occurred.

## Result Report
- Task summary: validated the scripts source-control closure lane for
  [LUC-3503](/LUC/issues/LUC-3503).
- Files changed by this heartbeat: this task packet only.
- How tested: local `node --check`, `node --test`, `git diff --check`, and
  process cleanup check.
- What is incomplete: parent source-control closure commit remains outside this
  validation lane.
- Next owner: parent closure owner for [LUC-3499](/LUC/issues/LUC-3499) should
  include this scripts group in the coherent closure commit if sibling lane
  classifications also pass.
