# Validation Pipeline

## Purpose

Validate that a problem, architecture assumption, or implementation gap is real before building.

## Inputs

- Idea or gap report.
- Architecture files.
- Existing code, docs, and tests.

## Steps

1. Compare the claim against architecture and docs.
2. Inspect code and tests for current behavior.
3. Record evidence.
4. Decide: valid, invalid, duplicate, or needs more research.
5. Create or update tasks with dependencies.

## Outputs

- Evidence-backed validation result.
- Backlog tasks for confirmed gaps.
- Updated function/module coverage notes.

## Dependencies

- Receives from `idea.pipeline.md`, `testing.pipeline.md`, and `monitoring.pipeline.md`.
- Feeds `planning.pipeline.md`.
