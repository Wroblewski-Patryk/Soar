# Planning Pipeline

## Purpose

Transform validated architecture and product needs into ordered executable tasks.

## Inputs

- Architecture updates.
- Backlog.
- Test and deployment requirements.

## Steps

1. Select the smallest coherent task slice.
2. Define status, dependencies, owner agent, and pipeline reference.
3. Define expected files and verification commands.
4. Move the selected task to `tasks/in-progress.md`.
5. Record stop conditions and max 3 fix iterations.

## Outputs

- Active task.
- Execution plan.
- Verification plan.

## Dependencies

- Receives from `validation.pipeline.md` and `architecture.pipeline.md`.
- Feeds `backend.pipeline.md`, `frontend.pipeline.md`, `testing.pipeline.md`, and `iteration.pipeline.md`.
