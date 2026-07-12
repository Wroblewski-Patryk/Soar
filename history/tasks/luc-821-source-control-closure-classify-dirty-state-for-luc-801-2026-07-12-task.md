# LUC-821 Source-Control Closure: Classify Dirty State for LUC-801 Before Close

## Header
- ID: LUC-821
- Title: [Soar][Source Control Closure] Classify dirty project state before closing LUC-801
- Task Type: coordination
- Current Stage: verification
- Status: DONE
- Owner: Soar Project Manager
- Priority: high
- Mission ID: LUC-821-SOURCE-CONTROL-CLOSE-LUC-801-2026-07-12
- Mission Status: VERIFIED

## Context
[LUC-821](/LUC/issues/LUC-821) is the local source-control closure sidecar for the completed api-bots ingestion repair bundle in [LUC-801](/LUC/issues/LUC-801). The wake arrived as `issue_assigned`, with `fallbackFetchNeeded=false` and no pending comments, so the lane stayed local and actionable in this heartbeat.

## Goal
Classify the current dirty worktree and record which local paths are explicitly attributable to `LUC-801` before a board-side close is attempted.

## Scope
- `git status --short`
- `git diff --check`
- Dirty-path category classification
- Explicit `LUC-801` attribution scan across dirty paths
- Repo-side source-of-truth updates for this closure packet only

## Implementation Plan
1. Capture the baseline dirty tree before mutating local closure artifacts.
2. Group dirty paths into state/control, task/evidence, docs/generated, and runtime/product code.
3. Scan dirty paths for explicit `LUC-801` references and record exact files.
4. Persist the classification in `history/tasks/*`, `history/evidence/*`, and project truth docs.

## Acceptance Criteria
- [x] Baseline dirty-tree counts are recorded.
- [x] Explicit `LUC-801` references in the current dirty tree are listed.
- [x] Residual mixed-lane workspace state is called out without over-claiming closure.
- [x] A durable repo-side evidence packet exists for `LUC-821`.

## Constraints
- Stay inside local source-control closure scope.
- Do not push, deploy, restart, rollback, or mutate credentials/accounts.
- Do not alter runtime/product behavior as part of this closure lane.

## Classification

### Baseline Dirty Tree

- Baseline captured before this `LUC-821` artifact mutation: `58` dirty paths.
- Category counts:

| Category | Count | Paths |
| --- | ---: | --- |
| State/control | 6 | `.agents/state/active-mission.md`, `.agents/state/module-confidence-ledger.md`, `.agents/state/next-steps.md`, `.codex/context/LEARNING_JOURNAL.md`, `.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md` |
| Task/evidence | 24 | `history/evidence/*` and `history/tasks/*` for the active Account-access repair/closure sequence |
| Docs/generated state | 27 | `docs/architecture/*`, `docs/graphs/*`, `docs/modules/*`, `docs/status/*` |
| Runtime/product code | 1 | `apps/api/src/modules/bots/botOwnership.service.test.ts` |
| Stale/out-of-scope for this lane | 0 | none |

### Explicit LUC-801 Attribution

- Explicit `LUC-801` references were found in 6 dirty paths:
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `history/evidence/luc-801-api-bots-doc-link-ingestion-repair-2026-07-12.md`
  - `history/evidence/luc-802-source-control-closure-2026-07-12.md`
  - `history/tasks/luc-801-repair-api-bots-doc-link-ingestion-2026-07-12-task.md`
  - `history/tasks/luc-802-source-control-closure-classify-dirty-state-for-luc-790-2026-07-12-task.md`
- Explicit `LUC-821` references before this mutation: `0` dirty paths.

### Residual Mixed Bundle

- The workspace remains a coherent mixed bundle from adjacent account-access and source-control lanes, including `LUC-722`, `LUC-734`, `LUC-743`, `LUC-755`, `LUC-789`, `LUC-790`, `LUC-798`, `LUC-799`, `LUC-800`, `LUC-801`, and `LUC-802`.
- The single runtime/product file in the bundle is `apps/api/src/modules/bots/botOwnership.service.test.ts`; this closure lane did not modify or validate runtime behavior.

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/bots/botOwnership.service.test.ts --run --reporter=dot` -> `1` file / `4` tests passed
- Manual checks:
  - `git status --short`
  - `git diff --check`
  - explicit dirty-path scan for `LUC-801` and `LUC-821`
  - lightweight redaction scan over dirty paths
- High-risk checks:
  - secret-pattern scan returned only prose/process references in docs/state, with no evident raw secret values
- Reality status:
  - verified

## Result Report
- Task summary:
  - classified the pre-mutation dirty worktree for `LUC-801` close-readiness and recorded exact local attribution.
- Files changed:
  - `history/tasks/luc-821-source-control-closure-classify-dirty-state-for-luc-801-2026-07-12-task.md`
  - `history/evidence/luc-821-source-control-closure-2026-07-12.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested:
  - baseline `git status --short`, `git diff --check`, dirty-path reference scan, redaction scan, and targeted vitest coverage for `apps/api/src/modules/bots/botOwnership.service.test.ts`
- What is incomplete:
  - no Paperclip control-plane mutation tool is available in this session, so live board status transition is not performed from this workspace
- Next steps:
  - use this closure packet as the repo-side evidence for board close-readiness on `LUC-801`
- Decisions made:
  - treated `LUC-821` as the source-control sidecar for `LUC-801` because the current dirty tree contains direct `LUC-801` evidence and no competing `LUC-821` baseline references
  - local commit is appropriate because the dirty set is a coherent sidecar bundle and the only behavior-impacting file passed targeted validation
