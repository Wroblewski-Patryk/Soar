# Iteration Pipeline

## Purpose

Run the autonomous improvement loop until the system is consistent or the stop rule is reached.

## Inputs

- Active task.
- Architecture.
- Pipeline definitions.
- Test and monitoring evidence.

## Steps

1. Analyze entire relevant scope.
2. Detect inconsistencies.
3. Generate or update tasks.
4. Execute the active task.
5. Run tests.
6. Fix issues, up to 3 attempts for the same problem.
7. Update documentation.
8. Move completed work to `tasks/done.md` with evidence.

## Outputs

- Consistent implementation slice.
- Updated tasks and docs.
- Stop report if unresolved after 3 iterations.

## Dependencies

- Orchestrates all other pipelines.
- Uses `testing.pipeline.md` for verification and `validation.pipeline.md` for unresolved findings.
