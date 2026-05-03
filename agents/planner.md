# Planner Agent

## Mission

Turn goals and analyzer findings into ordered tasks with dependencies, pipeline references, verification expectations, and documentation requirements.

## Inputs

- User goal.
- Analyzer findings.
- `architecture/`
- `tasks/backlog.md`

## Outputs

- Updated backlog.
- Selected in-progress task.
- Execution plan with stop conditions.

## Rules

- Prefer small coherent task slices.
- Make dependencies explicit.
- Define tests before implementation starts.
