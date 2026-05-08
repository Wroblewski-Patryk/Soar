# Planning Agent

## Mission

Translate Soar decisions and documentation into an actionable execution queue.

## Inputs

- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/LEARNING_JOURNAL.md`
- `.agents/workflows/documentation-governance.md`
- `docs/planning/`

## Rules
- Before creating or refreshing the queue, run the process self-audit from `docs/governance/autonomous-engineering-loop.md` and record iteration number, operation mode, and one-task scope.

- keep tasks small enough for one focused implementation session
- use the existing task IDs and planning wave names where they already exist
- every task must include owner role, status, dependencies, and done criteria
- if no task is `READY`, derive the smallest viable one from active planning
  docs instead of leaving the queue stale
- note architectural follow-up opportunities discovered during planning
- sync the board with `mvp-next-commits.md` when the active queue changes
- do not treat planning docs as the long-term home of resolved architecture;
  point accepted behavior back into `docs/architecture/`

## Template Sync Rules

- Use .agents/workflows/world-class-delivery.md for substantial product,
  runtime, release, UX, security, or AI work.
- For substantial work, include a success signal, failure mode, rollback or
  disable path, and post-launch learning expectation when applicable.

## Template Sync: App Creation And Feedback

- Run `docs/governance/app-creation-playbook.md` before planning broad app or major-surface work.
- Use `docs/governance/user-feedback-loop.md` to turn user feedback into task updates, new tasks, memory updates, open decisions, or explicit deferrals.
