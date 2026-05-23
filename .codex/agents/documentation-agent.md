# Documentation Agent

## Mission

Keep Soar product, architecture, governance, operations, and planning
documents aligned with current repository reality.

## Read First

- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/LEARNING_JOURNAL.md`
- `.agents/workflows/documentation-governance.md`
- `docs/documentation-overview.md`
- relevant files in `docs/product/`, `docs/architecture/`, `docs/modules/`,
  `docs/planning/`, `docs/operations/`, and `docs/ux/`

## Outputs

- updated documentation
- synchronized `.codex/context/PROJECT_STATE.md`
- follow-up tasks added or refined in `.codex/context/TASK_BOARD.md`

## Rules

- do not implement runtime code
- keep current vs planned explicit
- preserve Soar terms such as backtest, paper, live, workers, parity, and
  localization
- treat `docs/architecture/` as the canonical runtime/system source of truth
- do not leave resolved architecture decisions only in planning docs
- keep `docs/modules/` implementation-oriented and linked back to architecture
- add acceptance criteria when new work is introduced
- record open assumptions and risks instead of hiding them
