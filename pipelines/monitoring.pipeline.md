# Monitoring Pipeline

## Purpose

Detect production issues, documentation drift, and architecture mismatches after release.

## Inputs

- Deployment evidence.
- Logs, metrics, traces, alerts, support notes, user reports.
- Architecture and data-flow expectations.

## Steps

1. Review health checks and critical flows.
2. Compare observed behavior with architecture and tasks.
3. Classify issues by severity and source.
4. Create validation or fixing tasks.
5. Update docs when operational knowledge changes.

## Outputs

- Monitoring report.
- Backlog tasks.
- Updated deployment or observability docs.

## Dependencies

- Receives from `deploy.pipeline.md`.
- Feeds `validation.pipeline.md`, `iteration.pipeline.md`, and `scaling.pipeline.md`.
