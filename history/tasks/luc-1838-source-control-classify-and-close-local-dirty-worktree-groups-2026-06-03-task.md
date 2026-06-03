# LUC-1838 Source Control Dirty Worktree Classification And Closure

## Header

- ID: `LUC-1838`
- Title: `[Soar][Source Control] Classify and close local dirty worktree groups`
- Task Type: source-control
- Current Stage: verification
- Status: DONE
- Owner: CTO Architect
- Parent: [LUC-1173](/LUC/issues/LUC-1173)
- Priority: P0
- Mission ID: `LUC-1838-SOURCE-CONTROL-CLASSIFY-CLOSE-DIRTY-WORKTREE-2026-06-03`
- Mission Status: VERIFIED

## Context

Paperclip assigned [LUC-1838](/LUC/issues/LUC-1838) after the control tick
detected local Soar dirty groups that needed source-control classification and
closure. Protected delivery was not allowed; local source-control closure was
allowed.

## Goal

Classify the local dirty worktree groups, verify they are factual evidence and
source-of-truth updates, and close them with a local commit or an explicit
blocker.

## Scope

- `history-evidence:6`
- `codex-context:2`
- `agent-state:1`
- `project-docs:1`
- Closure evidence for [LUC-1838](/LUC/issues/LUC-1838)

## Implementation Plan

1. Read scoped wake and source-control closure contract.
2. Inspect `git status --short`, diff, sampled evidence/task files, and secret
   redaction patterns.
3. Post baseline classification to [LUC-1838](/LUC/issues/LUC-1838) before
   mutating project files.
4. Add closure report and source-of-truth state entries.
5. Run minimal validation and commit the coherent docs/evidence set locally.
6. Update [LUC-1838](/LUC/issues/LUC-1838) and parent [LUC-1173](/LUC/issues/LUC-1173).

## Acceptance Criteria

- Dirty groups are factually classified.
- Sampled history/evidence files have issue linkage and no secret-pattern hits.
- Codex context, agent state, and operations doc are classified as current or
  stale.
- Closure records files changed, verification, commit SHA, push status, deploy
  impact, residual risk, and next owner.

## Definition Of Done

- [x] Baseline classification posted to [LUC-1838](/LUC/issues/LUC-1838).
- [x] Runtime/product code dirty count confirmed as `0`.
- [x] History/evidence, Codex context, agent state, and project docs classified.
- [x] Secret-pattern scan completed for changed/sampled files with no hits.
- [x] Local commit created.
- [x] Push and deploy explicitly not performed.

## Forbidden

- Push Soar.
- Deploy, restart, rollback, or mutate production.
- Run protected smoke without a fresh accepted gate fact.
- Disclose secrets, tokens, cookies, private screenshots, or live account data.
- Revert unrelated work.

## Classification

| Group | Files | Classification | Disposition |
| --- | ---: | --- | --- |
| `history-evidence` | 6 | Current redacted Coolify status-access evidence/task artifacts for [LUC-1822](/LUC/issues/LUC-1822), [LUC-1828](/LUC/issues/LUC-1828), and [LUC-1831](/LUC/issues/LUC-1831). | Commit locally. |
| `codex-context` | 2 | Current source-of-truth updates in `.codex/context/PROJECT_STATE.md` and `.codex/context/TASK_BOARD.md`. | Commit locally. |
| `agent-state` | 1 | Current active mission update for the same Coolify status checkpoints. | Commit locally. |
| `project-docs` | 1 | Current operations contract update moving the latest read-only access checkpoint to [LUC-1831](/LUC/issues/LUC-1831). | Commit locally. |
| `runtime/product code` | 0 | No runtime/product source changes. | No action. |

## Validation Evidence

- `git status --short` before closure: matched `history-evidence:6`,
  `codex-context:2`, `agent-state:1`, `project-docs:1`.
- `git diff --stat`: docs/state only; no runtime/product files.
- Secret-pattern scan across changed/sampled files: no hits.
- `git diff --check`: PASS.

## Result Report

- Commit: recorded in [LUC-1838](/LUC/issues/LUC-1838) closure comment.
- Push status: not needed / not pushed.
- Deploy impact: none.
- Residual risk: protected V1 release evidence remains governed by existing
  parent blockers; this task only closed local source-control evidence drift.
- Next owner: none for this source-control issue after commit and Paperclip
  closure.
