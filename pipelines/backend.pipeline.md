# Backend Pipeline

## Purpose

Implement backend behavior that matches architecture, contracts, and tasks.

## Inputs

- Active task.
- Module and API architecture.
- Data-flow requirements.
- Existing backend code and tests.

## Steps

1. Read affected architecture and module docs.
2. Identify existing patterns and dependencies.
3. Implement the smallest scoped backend change.
4. Update unit and integration tests.
5. Update API/data-flow/module docs when behavior changes.
6. Hand off to testing.

## Outputs

- Backend code changes.
- Updated tests.
- Updated architecture/docs as needed.

## Dependencies

- Receives from `planning.pipeline.md`.
- Feeds `testing.pipeline.md`, `deploy.pipeline.md`, and `iteration.pipeline.md`.
