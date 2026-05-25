# ARCH-GRAPH-REPORTS-BACKFILL-2026-05-24

## Context

Stage: verification.

The architecture evidence graph is the Obsidian-first source of truth for
systemic feature analysis. After the Backtests backfill, Reports remained a
consumer placeholder and needed a dedicated chain from dashboard route through
Web services, API, aggregation service, database read models, tests, and docs.

## Goal

Backfill the Reports performance evidence chain without changing runtime
behavior.

## Scope

- Update `docs/architecture/registry/*.csv` for Reports feature, route,
  component, Web service, API route, controller, service, aggregator, tests,
  docs, and workflow nodes.
- Update `docs/architecture/relations/dependencies.csv` with Reports
  dependency, data, verification, and documentation relations.
- Add `CHAIN-REPORTS` to `docs/architecture/chains/chains.csv`.
- Regenerate Obsidian Markdown, JSON graph, and status output.
- Update source-of-truth state files for the active architecture evidence graph
  mission.

## Constraints

- No application runtime behavior changes.
- No live production or database mutations.
- Do not duplicate the existing `SOAR-FEATURE-REPORTS` placeholder; promote it
  to the canonical Reports feature node.
- Keep graph truth cautious: this is incremental coverage, not full repository
  coverage.

## Definition of Done

- Reports chain is represented in CSV.
- Generator passes with zero missing relation targets, chain targets, and file
  references.
- Guardrails, docs parity, and diff hygiene pass.
- Mission and state ledgers are updated with exact counts and residual risk.

## Acceptance Criteria

- `CHAIN-REPORTS` maps:
  `SOAR-PAGE-REPORTS -> SOAR-COMP-PERFORMANCE-REPORTS-VIEW ->
  SOAR-SERVICE-WEB-REPORTS -> SOAR-API-REPORTS-CROSS-MODE-PERFORMANCE ->
  SOAR-CONTROLLER-REPORTS -> SOAR-SERVICE-REPORTS ->
  SOAR-SERVICE-REPORT-MODE-AGGREGATOR -> DB/test/doc nodes`.
- Reports also links to `SOAR-SERVICE-WEB-BACKTESTS`,
  `SOAR-API-BACKTEST-RUN-LIST`, and `SOAR-API-BACKTEST-RUN-REPORT` because the
  page loads completed backtest runs and per-run reports.

## Result Report

Implemented the Reports graph backfill and promoted the existing
`SOAR-FEATURE-REPORTS` placeholder into a full verified-local feature node.

Validation:

- `pnpm run architecture:graph:generate` PASS:
  `336` nodes, `396` relations, `15` chains.

Residual risk:

- This is graph traceability proof only. It does not prove fresh authenticated
  production browser behavior or live report readback.
- Full repository backfill remains open.
