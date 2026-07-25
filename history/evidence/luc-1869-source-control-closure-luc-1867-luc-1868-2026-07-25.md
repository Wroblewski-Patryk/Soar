# LUC-1869 Source-Control Closure For LUC-1867 And LUC-1868 (2026-07-25)

## Wake And Scope
- Wake reason: `issue_assigned`.
- Issue:
  `LUC-1869 [Soar][Source Control Closure] Classify and close local dirty state for LUC-1867-LUC-1868`.
- Inline wake payload was sufficient (`fallbackFetchNeeded=false`, pending comments `0/0`).
- Role scope: Soar Product Manager; local source-control classification and closure only.

## Baseline
- Command: `git status --short --branch`.
- Result: branch `main...origin/main [ahead 4]` with one coherent dirty packet:
  - source-of-truth file: `.codex/context/PROJECT_STATE.md`
  - evidence artifacts:
    `history/evidence/luc-1867-soar-coolify-workers-backtest-recovery-2026-07-25.md`,
    `history/evidence/luc-1868-soar-coolify-workers-market-data-recovery-2026-07-25.md`
  - task artifacts:
    `history/tasks/luc-1867-soar-coolify-diagnose-and-recover-workers-backtest-exited-unhealthy-2026-07-25-task.md`,
    `history/tasks/luc-1868-soar-coolify-diagnose-and-recover-workers-market-data-exited-unhealthy-2026-07-25-task.md`
- Command: `git rev-parse --short HEAD`.
- Result: captured during verification after authored updates.

## Classification
| Scope | Current dirty count | Classification | Owner action |
| --- | ---: | --- | --- |
| `.codex/context/PROJECT_STATE.md` | 1 | durable project-state append that records the two Coolify worker recovery lanes | include in closure commit |
| `history/evidence/luc-1867*` + `history/evidence/luc-1868*` | 2 | intended runtime evidence artifacts for the completed/backlogged worker recovery issues | include in closure commit |
| `history/tasks/luc-1867*` + `history/tasks/luc-1868*` | 2 | required task-contract artifacts that match the same worker recovery issues | include in closure commit |
| Runtime/product code | 0 | no residual app/config/runtime drift in the local worktree | none |

## Classification Decision
- The local dirty state is a coherent docs/state/history-only packet produced by
  `LUC-1867` and `LUC-1868`.
- `LUC-1867` is already complete and `LUC-1868` is already blocked on an
  external Coolify permission boundary, so no further local editing is needed to
  clarify ownership.
- The correct closure action is one local reversible commit under `LUC-1869`.

## Hygiene Checks
- `git diff --stat` -> `.codex/context/PROJECT_STATE.md` only before authored
  closure updates; no runtime/product code paths.
- `git diff --numstat` -> `.codex/context/PROJECT_STATE.md` only before authored
  closure updates; untracked history packet aligns with `LUC-1867/LUC-1868`.
- `git diff --check` -> PASS after the closure packet was authored.
- Bounded credential-signature scan over authored closure/state files:
  - scanned:
    `.agents/state/active-mission.md`,
    `.codex/context/PROJECT_STATE.md`,
    `.codex/context/TASK_BOARD.md`,
    `history/evidence/luc-1867-soar-coolify-workers-backtest-recovery-2026-07-25.md`,
    `history/evidence/luc-1868-soar-coolify-workers-market-data-recovery-2026-07-25.md`,
    `history/evidence/luc-1869-source-control-closure-luc-1867-luc-1868-2026-07-25.md`,
    `history/tasks/luc-1867-soar-coolify-diagnose-and-recover-workers-backtest-exited-unhealthy-2026-07-25-task.md`,
    `history/tasks/luc-1868-soar-coolify-diagnose-and-recover-workers-market-data-exited-unhealthy-2026-07-25-task.md`,
    `history/tasks/luc-1869-source-control-close-luc-1867-luc-1868-2026-07-25-task.md`
  - signatures checked: private-key headers, AWS access-key format, GitHub token format, OpenAI-style `sk-` key prefix
  - result: PASS, no matches

## Decision
- Commit: required.
- Push: not needed.
- Deploy impact: none.

## Residual Risk
- This closes local source control only.
- `LUC-1868` remains blocked on the named external owner action: grant Coolify
  deploy/start permission for `workers-market-data` or execute the exact
  targeted start/restart path and rerun the reconciler plus acceptance-ledger
  refresh.
