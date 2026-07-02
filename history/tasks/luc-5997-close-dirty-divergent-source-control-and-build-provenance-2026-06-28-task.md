# Task

## Header
- ID: LUC-5997
- Title: Close Dirty/Divergent Source-Control And Build Provenance Before Deploy Claim
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: CTO
- Depends on: [LUC-6000](/LUC/issues/LUC-6000)
- Priority: P1
- Mission ID: LUC-5997-SOURCE-CONTROL-BUILD-PROVENANCE-CLOSURE-2026-06-28
- Mission Status: VERIFIED

## Context
[LUC-5997](/LUC/issues/LUC-5997) was blocked after [LUC-5995](/LUC/issues/LUC-5995)
found production smoke healthy but not release-complete because the shared Soar
checkout was dirty and branch `main` was divergent. Child [LUC-6000](/LUC/issues/LUC-6000)
completed the reconciliation into a separate release-candidate source ref.

## Goal
Close the parent CTO release gate by verifying the dirty/divergent state is no
longer the release-candidate source ref, recording the commit SHA/not-deployed
reason, and preserving the deploy prohibition.

## Scope
- Shared worktree: `C:/Personal/Projekty/Aplikacje/Soar`
- RC worktree: `C:/Personal/Projekty/Aplikacje/Soar-luc6000-rc`
- RC branch: `luc-6000-release-candidate-source-ref`
- Build-info endpoint: `https://soar.luckysparrow.ch/api/build-info`

## Implementation Plan
1. Re-read wake payload and treat [LUC-6000](/LUC/issues/LUC-6000) completion as the unblock signal.
2. Verify shared worktree branch/dirty state without mutating it.
3. Verify RC worktree branch, cleanliness, HEAD SHA, deployed-build containment, and preserved-local-tip containment.
4. Read public Web build-info to bind current production to the deployed SHA.
5. Update local source-of-truth files and Paperclip disposition.

## Acceptance Criteria
- Dirty files are classified as still present only in the shared worktree, not
  in the RC worktree.
- Branch divergence is reconciled into an explicit RC ref.
- Commit SHA is recorded.
- Build-info provenance and deploy impact are recorded.
- No push or deploy occurs.

## Verification Evidence
- Shared worktree `git status --short --branch`:
  `main...origin/main [ahead 15, behind 2]` with broad pre-existing modified
  and untracked state across `.agents`, `.codex`, `apps/api` tests/types,
  generated architecture/status docs, package files, scripts, and historical
  evidence/task artifacts.
- RC worktree `git status --short --branch`:
  `luc-6000-release-candidate-source-ref...origin/main [ahead 18]` with no
  porcelain file changes.
- RC HEAD:
  `b6e5cf1aba17b538d87ebacb5229ae2e774d05ee`.
- RC log top:
  `b6e5cf1a docs: record runtime automation budget proof`;
  `a0f065a6 test: reduce runtime position automation fixture size`;
  `7f7b2dda merge: reconcile local main into LUC-6000 release candidate`;
  `3bd65e21 fix: integrate web build metadata args`;
  `8d800ca4 test: add Soar static scan helper coverage`.
- Containment checks:
  `3bd65e21d09f294a18d3317d2f59f7a0d4e577b4` is an ancestor of RC HEAD;
  `8d800ca4` is an ancestor of RC HEAD.
- `git diff --check` in the RC worktree exited `0`.
- Public Web build-info:
  `gitSha=3bd65e21d09f294a18d3317d2f59f7a0d4e577b4`,
  `gitRef=main`, `metadataSource=env-runtime`,
  `metadataGeneratedAt=2026-06-28T06:23:59.137Z`.

## Deployment / Ops Evidence
- Deploy impact: none in this heartbeat.
- Push status: not pushed by this heartbeat.
- Deploy status: not deployed by this heartbeat.
- Current production remains deployed at
  `3bd65e21d09f294a18d3317d2f59f7a0d4e577b4`.
- Release-candidate source ref for a future release/deploy decision:
  `b6e5cf1aba17b538d87ebacb5229ae2e774d05ee`.
- Prohibition preserved: do not push or deploy from the dirty/divergent shared
  `main` checkout. Any future release must explicitly select the clean RC ref,
  confirm rollback/smoke plan, and pass the protected release gates.

## Result Report
- Task summary:
  [LUC-5997](/LUC/issues/LUC-5997) can close as `DONE / VERIFIED_RC_REF /
  NO_PUSH_NO_DEPLOY`.
- Files changed:
  evidence/state files only.
- How tested:
  git status, ancestor checks, `git diff --check`, public build-info readback.
- What is incomplete:
  no production deployment was attempted or approved; protected release/account
  gates remain separate.
- Next steps:
  Ops/Delivery may use the RC ref for a later explicit release decision only
  after branch state, rollback path, protected inputs, and smoke plan are
  approved.
- Decisions made:
  close the CTO source-control/build-provenance blocker because the dirty shared
  worktree no longer needs to be the release source; use the clean RC ref as
  the recorded source candidate.
