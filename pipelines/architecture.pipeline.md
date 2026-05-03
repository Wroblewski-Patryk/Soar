# Architecture Pipeline

## Purpose

Keep architecture authoritative, complete, and synchronized with implementation.

## Inputs

- Validated product or technical need.
- Current `architecture/`.
- Supporting docs in `docs/architecture/`.
- Module/function coverage records.

## Steps

1. Update system boundaries and invariants.
2. Update module responsibilities and dependencies.
3. Update API contracts.
4. Update data flows and trust boundaries.
5. Update tech stack decisions.
6. Create tasks for code, tests, deployment, or docs that must change.
7. Check consistency between architecture files.

## Outputs

- Updated architecture source of truth.
- Architecture-backed task list.
- Dependency and contract changes.

## Dependencies

- Receives from `validation.pipeline.md` and `scaling.pipeline.md`.
- Feeds `planning.pipeline.md`, `backend.pipeline.md`, `frontend.pipeline.md`, `deploy.pipeline.md`, and `documentation` work inside `iteration.pipeline.md`.
