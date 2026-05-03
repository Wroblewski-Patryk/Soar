# Documentation Pipeline

## Purpose

Keep code, architecture, task state, and documentation synchronized.

## Inputs

- Code changes.
- Architecture changes.
- Test evidence.
- Task updates.
- Existing docs.

## Steps

1. Detect changed behavior, contracts, modules, data flows, or deployment steps.
2. Update architecture first when source-of-truth content changed.
3. Update supporting docs in `docs/`.
4. Validate docs against code and tests.
5. Synchronize task status and evidence.
6. Create backlog tasks for stale or missing documentation that cannot be fixed immediately.

## Outputs

- Updated documentation.
- Backlog tasks for documentation gaps.
- Done evidence for completed work.

## Dependencies

- Receives from all implementation, testing, deploy, and monitoring pipelines.
- Feeds `validation.pipeline.md` when documentation exposes a conflict.
