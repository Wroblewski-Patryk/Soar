# Task

## Header
- ID: LUC-1708
- Title: Reconcile 142-commit source/deploy gap and release exact tested SHA
- Task Type: release
- Current Stage: independent release gates
- Status: BLOCKED
- Owner: Ops/Release
- Priority: P0
- Iteration: 2026-07-23
- Operation Mode: BUILDER
- Mission ID: LUC-1708-RELEASE-SHA-RECONCILIATION-2026-07-23
- Mission Status: RELEASE_PARITY_NOT_ACHIEVED

## Context
Soar production recovered operationally on Thursday, July 23, 2026, but the
local Soar `main` branch in this workspace is materially ahead of the deployed
`origin/main` line. The runtime health evidence is real, yet future release or
closeout work would be unsafe if it assumed local `HEAD` was the tested
production candidate.

## Goal
Reconcile the tested local candidate with GitHub and production through
independent review, exact governed push, separate governed deployment, and
fresh parity evidence.

## Scope
- Re-read current production public readiness/build-info endpoints.
- Re-read exact local vs deployed git lineage in the assigned Soar workspace.
- Classify the tested production SHA and the unreleased local delta.
- Update Soar evidence and state files only.
- Do not push, deploy, restart, or mutate production.

## Constraints
- Read-only release reconciliation only.
- No secret values, session material, or account data may be printed.
- No runtime code, deployment config, or infrastructure state may change.
- Reuse the accepted July 23 protected smoke evidence rather than fabricating a
  new protected proof path from an unauthorized runner.

## Implementation Plan
1. Confirm the currently deployed public SHA from production build-info.
2. Confirm the exact local `HEAD`, deployed `origin/main`, and ahead count.
3. Bind the fresh July 23 protected readiness evidence to the deployed SHA.
4. Write task/evidence packets and refresh release-truth state files.
5. Close the issue with a typed DRE evidence bundle.

## Acceptance Criteria
- Production build-info identifies the currently deployed SHA.
- Git lineage proves whether local `HEAD` matches production or not.
- The exact SHA tied to the July 23 tested runtime is stated explicitly.
- The unreleased local delta is stated explicitly.
- Local source-of-truth files no longer blur tested production with local
  unreleased commits.

## Definition of Done
- [x] The currently tested production SHA is recorded.
- [x] The 142-commit local source/deploy gap is recorded.
- [ ] Exact candidate `40cfb8f2...` passes independent CRS/QVE/Security gates.
- [ ] Exact no-force push is formally approved and GitHub parity is verified.
- [ ] Component-specific production deployment is separately approved.
- [ ] Fresh public/protected smoke proves deployment parity and rollback readiness.
- [ ] `LUC-27` receives complete typed evidence and may close.

## Validation Evidence
- Command:
  `Invoke-RestMethod https://api.soar.luckysparrow.ch/ready`
- Result:
  `PASS`; returned `{"status":"ready","service":"api"}` on Thursday,
  July 23, 2026.
- Command:
  `Invoke-RestMethod https://soar.luckysparrow.ch/api/build-info`
- Result:
  `PASS`; returned `gitSha=b0b2c2ce9477a32fcda7717f447ad46aa4327589`,
  `gitRef=main`, `metadataSource=env-runtime`,
  `checkedAt=2026-07-23T02:28:54.183Z`.
- Command:
  `git rev-parse HEAD && git rev-parse origin/main && git rev-list --count origin/main..HEAD && git merge-base HEAD origin/main`
- Result:
  local `HEAD=40cfb8f2cf913966f9c7159b49ae256b2aebbcaa`;
  deployed remote tip `origin/main=b0b2c2ce9477a32fcda7717f447ad46aa4327589`;
  local ahead count `142`;
  merge-base `b0b2c2ce9477a32fcda7717f447ad46aa4327589`.
- Evidence:
  `history/tasks/luc-1708-reconcile-142-commit-source-deploy-gap-and-release-exact-tested-sha-2026-07-23-task.md`;
  `history/evidence/luc-1708-release-sha-reconciliation-2026-07-23.md`;
  accepted July 23 runtime verification
  `history/evidence/luc-1556-redis-recovery-verification-ledger-refresh-2026-07-23.md`.

## Result Report
- Interim outcome:
  the exact Soar production SHA that was actually tested on Thursday,
  July 23, 2026 is
  `b0b2c2ce9477a32fcda7717f447ad46aa4327589`, not the local workspace `HEAD`
  `40cfb8f2cf913966f9c7159b49ae256b2aebbcaa`.
- Release classification:
  the July 23 green public/protected runtime evidence belongs to the deployed
  `origin/main` commit `b0b2c2ce...`; the 142 commits from `936b1dd0...`
  through `40cfb8f2...` remain local-only and are not release-tested on
  production.
- Files changed:
  `history/tasks/luc-1708-reconcile-142-commit-source-deploy-gap-and-release-exact-tested-sha-2026-07-23-task.md`,
  `history/evidence/luc-1708-release-sha-reconciliation-2026-07-23.md`,
  `.agents/state/active-mission.md`,
  `.agents/state/next-steps.md`,
  `.agents/state/system-health.md`,
  `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`.
- Residual risk:
  production runtime is healthy, but build provenance still reports
  `metadataSource=env-runtime`, so this lane establishes release truth by
  combining current build-info with git lineage and accepted same-day smoke
  evidence rather than by a stronger immutable provenance signal.

## Corrected Disposition

The initial `DONE` interpretation was rejected by board supervision because it
preserved the 142-commit gap rather than reconciling it. This task remains
blocked on the governed release chain above; its current artifact is blocker
evidence only.
