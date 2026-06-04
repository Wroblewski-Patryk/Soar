# LUC-1992 Task Contract - Source Control Closure For LUC-1987-LUC-1990

Date: 2026-06-04
Owner: Soar Project Manager
Stage: verification

## Context

[LUC-1992](/LUC/issues/LUC-1992) asked for source-control closure of local
dirty state produced by [LUC-1987](/LUC/issues/LUC-1987) and
[LUC-1990](/LUC/issues/LUC-1990). The issue contract allowed local diff
inspection, local validation, and one local source-control closure commit when
the dirty set was docs/history/evidence/context/agent-state only and the
redaction check found no secrets.

## Goal

Classify the dirty worktree, align source-of-truth docs where the newer
[LUC-1990](/LUC/issues/LUC-1990) checkpoint superseded
[LUC-1987](/LUC/issues/LUC-1987), run bounded local verification, and preserve
the closure in a local commit without push or deploy.

## Constraints

- Do not push, deploy, restart, roll back, edit production environment
  variables, mutate databases, change accounts, run protected smoke, disclose
  secrets, or touch live trading.
- Do not revert, overwrite, or stage unrelated work.
- Commit only a coherent docs/state/evidence closure set when validation
  supports it.

## Definition of Done

- Dirty paths are classified by ownership and layer.
- Stale/out-of-scope/runtime-code/secret-risk paths are either absent or named
  with an owner/blocker.
- Source-of-truth docs agree on the latest Coolify read-only checkpoint.
- `git diff --check` and a targeted redaction scan pass.
- A local commit is created if the dirty set remains closure-safe.
- The Paperclip issue is closed with files, verification, commit SHA, push
  status, deploy impact, residual risk, and next owner.

## Forbidden

- Production mutation or protected smoke.
- Secret value disclosure in repo files, issue comments, command output, or
  screenshots.
- Push or deploy from this closure issue.

## Result Report

Status: verified.

- Dirty set classification:
  - state/context files: `.agents/state/active-mission.md`,
    `.agents/state/system-health.md`, `.codex/context/PROJECT_STATE.md`,
    `.codex/context/TASK_BOARD.md`;
  - operations docs/ledger: `docs/operations/coolify-vps-deployment-contract.md`,
    `docs/operations/runtime-config-ledger.csv`;
  - history evidence/tasks:
    `history/evidence/luc-1987-coolify-read-only-production-status-access-2026-06-04.md`,
    `history/evidence/luc-1990-coolify-read-only-production-status-access-2026-06-04.md`,
    `history/tasks/luc-1987-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md`,
    `history/tasks/luc-1990-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md`,
    and this task contract.
  - runtime/product code: none.
  - stale/out-of-scope paths: none after parity correction.
- Closure edit aligned the operations contract and runtime config ledger to name
  [LUC-1990](/LUC/issues/LUC-1990) as the latest Coolify read-only production
  status access checkpoint at `2026-06-04T14:05:13Z`.
- Verification passed:
  - `git diff --check`;
  - targeted dirty-path redaction scan for token/password/secret/key/cookie/url
    patterns.
- No push, deploy, restart, rollback, env edit, database action, team setting
  change, account action, protected smoke, secret value readback, raw resource
  id storage, generated DB suffix storage, or live-trading action occurred.

Commit: recorded in [LUC-1992](/LUC/issues/LUC-1992) final comment.
Push status: not needed.
Deploy impact: none.
Residual risk: this is source-control/docs closure only; application readiness,
protected worker readiness, and release smoke remain separate release gates.
