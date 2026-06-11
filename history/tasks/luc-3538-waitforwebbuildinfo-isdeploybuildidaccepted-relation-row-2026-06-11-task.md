# LUC-3538 waitForWebBuildInfo isDeployBuildIdAccepted relation row

## Context

- Issue: `[Soar][QA] waitForWebBuildInfo isDeployBuildIdAccepted relation row`
- Role: `09 QVE (QA & Verification Engineer)`
- Stage: `verification`
- Scope: close the scanner-readable relation gap for
  `scripts/waitForWebBuildInfo.mjs#isDeployBuildIdAccepted`.

## Goal

Add a direct architecture relation from the deploy build-id acceptance helper to
the focused local test that proves matching SHA metadata fails closed when the
production build id is not real.

## Constraints

- Do not run deploy, restart, rollback, protected smoke, production account,
  secret, database/Redis, exchange, order, position, payment/subscription, or
  live-trading actions.
- Preserve unrelated dirty worktree state.
- Use the smallest local proof for the script helper.

## Implementation Plan

1. Inspect the existing `waitForWebBuildInfo` script/test relation coverage.
2. Add a direct row in `docs/architecture/relations/priority-test-links.csv`.
3. Run focused local proof and exact relation readback.

## Acceptance Criteria

- [x] `priority-test-links.csv` contains a row for
  `scripts/waitForWebBuildInfo.mjs#isDeployBuildIdAccepted`.
- [x] The row points to `scripts/waitForWebBuildInfo.test.mjs`.
- [x] Focused local test proof passes.
- [x] No protected/runtime/deploy mutation is performed.

## Verification

- `node --test scripts/waitForWebBuildInfo.test.mjs` -> PASS (`4/4`).
- `rg -n "scripts/waitForWebBuildInfo\\.mjs#isDeployBuildIdAccepted,scripts/waitForWebBuildInfo\\.test\\.mjs,LUC-3538" docs/architecture/relations/priority-test-links.csv`
  -> PASS at line `861`.

## Result Report

- Status: implemented and verified.
- Files changed by this heartbeat:
  - `docs/architecture/relations/priority-test-links.csv`
  - `history/tasks/luc-3538-waitforwebbuildinfo-isdeploybuildidaccepted-relation-row-2026-06-11-task.md`
- Residual risk: the full architecture-awareness graph was not regenerated in
  this QA heartbeat; this relation row is scanner-readable and can be consumed
  by the next architecture-awareness refresh.
- Deploy impact: none.
