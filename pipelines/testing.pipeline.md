# Testing Pipeline

## Purpose

Prove that changes satisfy architecture, task requirements, and user behavior.

## Inputs

- Active task.
- Changed files.
- Test system in `tests/` and framework-specific test directories.
- AI behavior scenarios.

## Steps

1. Select relevant unit, integration, e2e, and AI behavior checks.
2. Run the smallest fast checks first.
3. Run broader checks for shared, release, or user-facing behavior.
4. Record failures with evidence.
5. Send failures to fixing or validation.
6. Record passing evidence in the task.

## Outputs

- Test report.
- Failure tasks or fix handoff.
- Done evidence.

## Dependencies

- Receives from `backend.pipeline.md`, `frontend.pipeline.md`, and `deploy.pipeline.md`.
- Feeds `iteration.pipeline.md` and `validation.pipeline.md`.
