# LUC-1996 Task Contract - Source Control Closure For LUC-1993

Date: 2026-06-04
Owner: Soar Project Manager
Stage: verification

## Context

[LUC-1996](/LUC/issues/LUC-1996) is the source-control closure sidecar for
[LUC-1993](/LUC/issues/LUC-1993). The wake payload was scoped to this issue,
with `fallbackFetchNeeded=false`, no pending comments, and checkout already
claimed by the harness for this run.

## Goal

Classify and close the local dirty state left by the bounded Coolify read-only
production status access checkpoint, preserving only coherent source-of-truth
updates and recording commit/push/deploy disposition.

## Scope

- Dirty state inspection for the current working tree.
- Source-of-truth and evidence closure for [LUC-1993](/LUC/issues/LUC-1993).
- Local validation that does not require protected credentials.
- One local closure commit if validation and redaction checks pass.

## Constraints

- Do not revert, overwrite, or stage unrelated work.
- Do not push, deploy, restart, rollback, edit env, mutate databases, change
  team/account settings, run protected smoke, disclose secrets, or touch live
  trading.
- Do not store secret values, raw resource ids, generated database suffixes,
  cookies, tokens, screenshots, or private URLs.

## Definition of Done

- Dirty paths are classified as current, stale, or out-of-scope.
- Redaction and whitespace checks pass for the closure set.
- Relevant project source-of-truth files record the closure.
- Coherent docs/state/evidence-only set is committed locally.
- Paperclip issue is closed with files, verification, commit, push, deploy, and
  residual-risk evidence.

## Forbidden

- Push or deploy.
- Production mutation.
- Secret disclosure.
- Reverting unrelated work.
- Leaving a docs/state/evidence-only dirty set uncommitted after passing local
  validation.

## Baseline Dirty-State Note

Observed before this task mutated project files:

- Modified state/control files:
  - `.agents/state/active-mission.md`
  - `.agents/state/system-health.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- Modified operations source-of-truth files:
  - `docs/operations/coolify-vps-deployment-contract.md`
  - `docs/operations/runtime-config-ledger.csv`
- Untracked task/evidence files:
  - `history/evidence/luc-1993-coolify-read-only-production-status-access-2026-06-04.md`
  - `history/tasks/luc-1993-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md`

Ownership assumption: all observed dirty files belong to the current
[LUC-1993](/LUC/issues/LUC-1993) Coolify read-only access lane and its
[LUC-1996](/LUC/issues/LUC-1996) source-control closure sidecar. No runtime
product code, migrations, generated build artifacts, local env files, logs, or
screenshots were dirty at baseline.

Verification boundary: local diff inspection, `git diff --check`, targeted
redaction scan over the closure paths, and `pnpm run quality:guardrails`.

## Classification

| Group | Count | Paths | Classification | Disposition |
| --- | ---: | --- | --- | --- |
| State/control | 4 | `.agents/state/active-mission.md`, `.agents/state/system-health.md`, `.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md` | current | include in local closure commit |
| Operations docs/ledger | 2 | `docs/operations/coolify-vps-deployment-contract.md`, `docs/operations/runtime-config-ledger.csv` | current | include in local closure commit |
| Task/evidence | 3 | `history/evidence/luc-1993-coolify-read-only-production-status-access-2026-06-04.md`, `history/tasks/luc-1993-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md`, `history/tasks/luc-1996-source-control-close-local-dirty-state-for-luc-1993-2026-06-04-task.md` | current | include in local closure commit |
| Runtime/product code | 0 | none | not applicable | no action |
| Stale/out-of-scope | 0 | none | not applicable | no action |

## Validation Evidence

- `git status --short --branch` baseline: branch `main...origin/main`
  ahead of origin, with the current docs/state/evidence-only dirty set.
- `git diff --stat`: six tracked files changed before adding this closure
  artifact; no runtime/product code paths.
- Paperclip heartbeat context:
  [LUC-1996](/LUC/issues/LUC-1996) was `in_progress`, priority `high`, with
  zero first-class blockers.
- `git diff --check`: pass; line-ending normalization warnings only.
- Targeted redaction scan: first broad scan reported an `sk-...` class
  false-positive without printing matching lines; corrected no-content scan
  with realistic key lengths passed over `9` closure paths.
- `pnpm run quality:guardrails`: pass.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: repository-only docs/state/evidence commit can be reverted;
  no runtime rollback needed.
- Observability or alerting impact: none.

## Result Report

Status: verified after final validation and local commit.

- Task summary: classified the [LUC-1993](/LUC/issues/LUC-1993) dirty set as
  coherent current docs/state/evidence only and closed it through
  [LUC-1996](/LUC/issues/LUC-1996).
- Files changed: state/control `4`, operations docs/ledger `2`,
  task/evidence `3`, runtime/product code `0`, stale/out-of-scope `0`.
- Commit: recorded in the Paperclip closure comment after commit creation.
- Push status: not needed.
- Deploy impact: none.
- Residual risk: source-control closure only; protected production readiness
  remains governed by separate release-smoke/protected-input gates.
