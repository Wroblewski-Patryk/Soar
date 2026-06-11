# LUC-3506 Classify NUL Workspace Artifact Before Source-Control Closure

## Header
- ID: LUC-3506
- Title: Classify NUL workspace artifact before source-control closure
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Priority: P2
- Mission ID: LUC-3506-CLASSIFY-NUL-WORKSPACE-ARTIFACT-2026-06-11
- Mission Status: VERIFIED

## Context
`LUC-3506` was assigned to DRE to classify the untracked `NUL` workspace
artifact before source-control closure proceeds. The wake payload had no pending
comments and `fallbackFetchNeeded=false`, so the inline issue scope was used as
the authoritative heartbeat context.

## Goal
Determine whether `NUL` is product/runtime code, evidence that needs to be
committed, a secret-bearing artifact, or disposable workspace residue; remove it
only if the classification proves that is safe.

## Scope
- Exact artifact: `NUL` at repository root.
- Exact filesystem path checked with Windows extended path:
  `\\?\C:\Personal\Projekty\Aplikacje\Soar\NUL`.
- Source-control surface: `git status -- NUL`, `git ls-files --others -- NUL`,
  and `git hash-object --no-filters -- NUL`.
- Exclusions: no product code, runtime scripts, deployment, restart, rollback,
  protected smoke, secret/account readback, database mutation, exchange action,
  order, position, payment, subscription, or live-trading action.

## Implementation Plan
1. Confirm Git sees the root `NUL` path as untracked.
2. Check normal Win32 path behavior and extended-path behavior.
3. Verify size/content classification before any cleanup.
4. Remove only if the artifact is untracked, zero-byte, and not ignored or
   tracked source.
5. Recheck Git status for `NUL` and record source-control disposition.

## Acceptance Criteria
- `NUL` classification is explicit.
- Cleanup happens only if content is empty and untracked.
- `git status -- NUL` is clean after cleanup.
- Source-control closure owner has commit/push/deploy disposition.

## Definition of Done
- [x] Artifact classified.
- [x] Artifact cleanup completed or blocker recorded.
- [x] Verification evidence recorded.
- [x] Source-control disposition recorded.

## Validation Evidence
- `git status --short` initially reported `?? NUL`.
- `git ls-files --others --exclude-standard -- NUL` returned `NUL`.
- `git check-ignore -v NUL` returned no ignore rule.
- Normal PowerShell and `cmd dir` did not resolve `.\NUL`, consistent with a
  Windows reserved-device-name trap.
- Exact Git path bytes from `git ls-files -z`: `4E 55 4C 00`.
- Extended-path file info found a real file:
  - exists: `true`
  - length: `0`
  - created: `2026-06-07T22:18:43.7399036Z`
  - last write: `2026-06-07T22:18:43.7399036Z`
  - attributes: `Archive`
- `git hash-object --no-filters -- NUL` returned the empty blob hash
  `e69de29bb2d1d6434b8b29ae775ad8c2e48c5391`.
- Cleanup command deleted only
  `\\?\C:\Personal\Projekty\Aplikacje\Soar\NUL` after confirming length `0`.
- `git status --porcelain=v1 -- NUL` returned no output after cleanup.

## Architecture Evidence
- Architecture source reviewed: not applicable; this was workspace hygiene for
  source-control closure.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: no runtime rollback needed; cleanup removed a zero-byte
  untracked reserved-name artifact from the local workspace only.
- Observability or alerting impact: none.

## Security / Privacy Evidence
- Data classification: empty local workspace artifact.
- Secret handling: no secret, token, cookie, account data, log, or screenshot
  content was read or stored.
- Fail-closed behavior: cleanup refused to proceed unless the extended-path
  file existed and had length `0`.
- Residual risk: none for `NUL`; broader dirty worktree remains owned by the
  parent source-control closure batch.

## Result Report
- Task summary: classified `NUL` as a zero-byte, untracked Windows
  reserved-device-name workspace artifact and removed it using a narrow
  extended-path delete.
- Files changed: this evidence packet and source-truth state entries only.
- Commit status: not committed; this task is a classification/cleanup lane
  inside a broader dirty source-control closure batch.
- Push status: not needed.
- Deploy impact: none.
- What is incomplete: broader source-control closure still owns the remaining
  dirty tree.
- Next owner: parent source-control closure owner can proceed without the
  `NUL` artifact in the worktree.
