# Task

## Header
- ID: LUC-963
- Title: Regression proof for DCA-before-close fix (fail-before/pass-after)
- Task Type: qa
- Current Stage: verification
- Status: DONE
- Owner: QA Regression Lead
- Depends on: fix commit `6b1d3e9a`
- Priority: High

## Context
Wake payload assigned LUC-963 to provide regression evidence that DCA-before-close protections are correctly gated (fail-before/pass-after).

## Goal
Produce deterministic proof that the DCA-before-close behavior fails on the pre-fix revision and passes on the fix revision.

## Scope
- QA-only verification lane.
- No product/runtime logic edits in main workspace.
- Historical revision checks in isolated worktrees.

## Verification Design
1. Identify candidate fix SHA.
2. Run focused existing regression tests on `before` and `after` revisions.
3. Extract the new DCA-before-close assertions from the fix and execute the same assertions on both revisions for true fail/pass proof.

## Execution Evidence
- Candidate fix commit identified:
  - `6b1d3e9a` (`fix: gate runtime protection display by DCA state`)
- Isolated revisions prepared:
  - `before`: `6b1d3e9a^` (`9c44304b`)
  - `after`: `6b1d3e9a`
- Environment normalization in both worktrees:
  - `pnpm install --frozen-lockfile`
  - `pnpm --filter api exec prisma generate`

### Focused baseline suites (both revisions)
- Command:
  - `pnpm --filter api test -- src/modules/bots/runtimePositionSerialization.service.test.ts src/modules/bots/runtimeSessionPositionsRead.service.test.ts`
- Result:
  - `before`: PASS (`2 files`, `28 tests`)
  - `after`: PASS (`2 files`, `32 tests`)

### Fail-before / Pass-after lock (same assertions both revisions)
- Added standalone proof test file in each isolated worktree:
  - `apps/api/src/modules/bots/luc963-dca-before-close-regression.test.ts`
- Command:
  - `pnpm --filter api test -- src/modules/bots/luc963-dca-before-close-regression.test.ts`
- Result:
  - `before` (`6b1d3e9a^`): FAIL (`2/2 failed`)
    - expected `dynamicTslStopLoss` to be `null`, received `99.4`
    - expected `dynamicTtpStopLoss` to be `null`, received `105`
  - `after` (`6b1d3e9a`): PASS (`2/2 passed`)

## Result Report
- Regression proof status: `implemented and verified`.
- DCA-before-close gating behavior now has deterministic fail-before/pass-after evidence on the owning fix boundary.
- Main workspace runtime code changes: none.
- Deploy impact: none.
- Commit/push: not needed (QA evidence-only lane).

## Residual Risk
1. This proof validates the local code boundary of `6b1d3e9a`; production/deploy parity still requires separate Ops smoke evidence on deployed SHA.
