# LUC-1976 Task Contract - Source Control Close Local Dirty State For LUC-1973

Date: 2026-06-04
Owner: Soar Project Manager
Stage: verification

## Context

[LUC-1976](/LUC/issues/LUC-1976) asked to classify and close the local dirty
state left by [LUC-1973](/LUC/issues/LUC-1973). The wake payload was scoped to
this issue, had no pending comments, and said checkout was already claimed by
the harness.

## Goal

Classify the dirty tree, verify it contains only coherent
[LUC-1973](/LUC/issues/LUC-1973) docs/state/evidence, and preserve it in source
control with closure evidence.

## Scope

- Classify dirty files in the Soar workspace.
- Verify the dirty set has no runtime/product code changes.
- Run the smallest relevant repository checks for documentation/state closure.
- Commit only the classified [LUC-1973](/LUC/issues/LUC-1973) closure set plus
  this [LUC-1976](/LUC/issues/LUC-1976) source-control closure record.

## Implementation Plan

1. Inspect `git status --short` and `git diff --stat`.
2. Review modified and untracked files for scope, secrets, and ownership.
3. Run `git diff --check`, targeted redaction search, and
   `pnpm run quality:guardrails`.
4. Update source-of-truth state for this closure.
5. Commit the coherent dirty set locally with the required Paperclip co-author.
6. Mark [LUC-1976](/LUC/issues/LUC-1976) done with commit, verification, push,
   deploy impact, and residual risk.

## Acceptance Criteria

- Dirty state is classified by category.
- No product/runtime code is included.
- No secret values, tokens, cookies, raw resource identifiers, generated DB
  suffixes, env files, logs, screenshots, or dumps are committed.
- Relevant checks pass or are explicitly blocked.
- Local commit SHA is recorded.

## Definition of Done

- Source-control status for the [LUC-1973](/LUC/issues/LUC-1973) dirty state is
  resolved by local commit.
- Verification evidence is recorded in this artifact and the issue.
- Push and deploy are explicitly not performed.

## Forbidden

- Reverting, overwriting, or staging unrelated work.
- Push, deploy, restart, rollback, env edit, database action, team/account
  setting change, protected smoke, secret disclosure, or live-trading mutation.
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
  `history/evidence/luc-1973-coolify-read-only-production-status-access-2026-06-04.md`,
  `history/tasks/luc-1973-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md`,
  and this [LUC-1976](/LUC/issues/LUC-1976) closure artifact.
- Runtime/product code files: none.
- Stale or out-of-scope files: none.

Verification:

- `git diff --check` passed; only line-ending normalization warnings were
  reported by Git.
- Targeted redaction search found names-only/negative-policy references and
  existing historical ledger lines, not secret values or key material.
- `pnpm run quality:guardrails` passed.

Commit: pending at artifact creation; final SHA is recorded in the
[LUC-1976](/LUC/issues/LUC-1976) issue closure comment.
Push status: not needed.
Deploy impact: none.
Residual risk: none for source-control closure; this does not authorize any
production mutation or release smoke.
