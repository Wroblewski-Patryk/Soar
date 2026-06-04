# LUC-1986 Task Contract - Source Control Close Local Dirty State For LUC-1977-LUC-1982

Date: 2026-06-04
Owner: Soar Project Manager
Stage: verification

## Context

[LUC-1986](/LUC/issues/LUC-1986) asked to classify and close local dirty state
for the [LUC-1977](/LUC/issues/LUC-1977) through
[LUC-1982](/LUC/issues/LUC-1982) source-control lane. The scoped wake payload
had no pending comments, said `fallbackFetchNeeded=false`, and said checkout
was already claimed by the harness, so checkout was not repeated.

## Goal

Classify the dirty tree, verify it contains only coherent docs/state/evidence
for the Coolify read-only production status access lane, and preserve it with a
local source-control closure commit.

## Scope

- Classify current dirty files in the Soar workspace.
- Verify no runtime/product code is included.
- Run the smallest relevant checks for docs/state/evidence closure.
- Commit only the classified closure set and this
  [LUC-1986](/LUC/issues/LUC-1986) task artifact.

## Implementation Plan

1. Inspect `git status --short`, `git diff --stat`, and `git diff --name-status`.
2. Post a baseline note to [LUC-1986](/LUC/issues/LUC-1986) before editing.
3. Record closure evidence in project state and this task artifact.
4. Run `git diff --check`, a targeted dirty-path redaction scan, and
   `pnpm run quality:guardrails`.
5. Commit the coherent dirty set locally with the required Paperclip co-author.
6. Mark [LUC-1986](/LUC/issues/LUC-1986) done with commit, verification, push,
   deploy impact, and residual risk.

## Acceptance Criteria

- Dirty state is classified by category and issue ownership.
- No product/runtime code is included.
- No secret values, tokens, cookies, raw resource identifiers, generated DB
  suffixes, env files, logs, screenshots, or dumps are committed.
- Relevant checks pass or are explicitly blocked.
- Local commit SHA is recorded in the issue closure.

## Definition of Done

- Source-control status for the dirty state is resolved by local commit.
- Verification evidence is recorded in this artifact and the issue.
- Push and deploy are explicitly not performed.

## Forbidden

- Reverting, overwriting, or staging unrelated work.
- Push, deploy, restart, rollback, env edit, database action, team/account
  setting change, protected smoke, secret disclosure, raw resource id storage,
  generated DB suffix storage, or live-trading mutation.
- Broad test/build runs not required by this docs/state closure.

## Result Report

Status: verified.

Dirty-state classification before closure:

- State/control files: `.agents/state/active-mission.md`,
  `.agents/state/system-health.md`, `.codex/context/PROJECT_STATE.md`, and
  `.codex/context/TASK_BOARD.md`.
- Operations docs/ledger files:
  `docs/operations/coolify-vps-deployment-contract.md` and
  `docs/operations/runtime-config-ledger.csv`.
- History evidence/task files:
  `history/evidence/luc-1977-coolify-read-only-production-status-access-2026-06-04.md`,
  `history/evidence/luc-1982-coolify-read-only-production-status-access-2026-06-04.md`,
  `history/tasks/luc-1977-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md`,
  `history/tasks/luc-1982-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md`,
  and this [LUC-1986](/LUC/issues/LUC-1986) closure artifact.
- Runtime/product code files: none.
- Stale or out-of-scope files: none.
- Current dirty paths for [LUC-1978](/LUC/issues/LUC-1978),
  [LUC-1979](/LUC/issues/LUC-1979), [LUC-1980](/LUC/issues/LUC-1980), and
  [LUC-1981](/LUC/issues/LUC-1981): none observed in this closure pass.

Verification:

- `git diff --check` passed; only line-ending normalization warnings were
  reported by Git.
- Targeted dirty-path redaction scan found no secret-value/key-material hits.
- `pnpm run quality:guardrails` passed.

Commit: pending at artifact creation; final SHA is recorded in the
[LUC-1986](/LUC/issues/LUC-1986) issue closure comment.
Push status: not needed.
Deploy impact: none.
Residual risk: none for source-control closure; this does not authorize any
production mutation, protected smoke, or release action.
