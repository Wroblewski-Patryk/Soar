# Frontend Pipeline

## Purpose

Implement user-facing behavior that matches product, architecture, UX, and task requirements.

## Inputs

- Active task.
- Product and UX docs.
- API contracts.
- Existing frontend code and tests.

## Steps

1. Read product, UX, and architecture constraints.
2. Identify existing component and state patterns.
3. Implement the smallest coherent UI change.
4. Verify responsive layout and interaction states.
5. Update unit, integration, e2e, and visual checks where applicable.
6. Update docs and module coverage.

## Outputs

- Frontend code changes.
- Updated tests or visual evidence.
- Updated docs as needed.

## Dependencies

- Receives from `planning.pipeline.md` and `architecture.pipeline.md`.
- Feeds `testing.pipeline.md`, `iteration.pipeline.md`, and `deploy.pipeline.md`.
