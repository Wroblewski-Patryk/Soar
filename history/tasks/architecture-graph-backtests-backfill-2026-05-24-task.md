# Architecture Graph Backtests Backfill - 2026-05-24

## Context

The architecture evidence graph mission is incrementally backfilling critical
Soar modules into CSV source-of-truth records, Obsidian Markdown nodes, JSON
graph export, and function-chain mappings. After Strategies and Markets were
mapped, Backtests became the next critical consumer because it snapshots both
strategy and market-universe truth and feeds report/history surfaces.

## Goal

Backfill the Backtests run lifecycle and replay slice into the architecture
evidence graph without changing application runtime behavior.

## Constraints

- Keep repository artifacts in English.
- Do not modify runtime behavior, production data, or LIVE exchange behavior.
- Do not run heavy replay/performance proof as part of this graph-only slice.
- Do not claim full repository graph coverage.
- Every graph reference must pass generator validation.

## Implementation Plan

1. Inspect Backtests API/Web module docs, route files, service files,
   queue/job/replay files, components, hooks, utilities, and tests.
2. Add Backtests records to typed registries and canonical `nodes.csv`.
3. Add relations for UI, Web service, API routes, controller, DTOs, service,
   range resolver, queue/job, data gateway, replay core, fill model, report
   lifecycle, snapshots, DB models, tests, docs, and consumers.
4. Add `CHAIN-BACKTESTS`.
5. Refresh generated outputs and source-of-truth state.

## Acceptance Criteria

- Backtests has feature, page, component, service/controller/validation, API
  route, test, docs, workflow, relation, and chain records.
- The chain links backtest UI through Web/API/backend/queue/replay/DB/test/doc
  evidence.
- `pnpm run architecture:graph:generate` passes with zero missing targets or
  missing file references.
- State files record the new graph counts and residual non-claims.

## Definition of Done

- CSV registries updated.
- Generated Markdown/JSON/status outputs refreshed.
- Project state, task board, active mission, delivery map, risk register,
  requirement matrix, quality scenarios, and module confidence updated.
- Relevant validation commands pass or residual risk is recorded.

## Result Report

- Added Backtests graph coverage across backtest list/create/detail routes,
  list/create/details components, Web backtests service, details view-model and
  presenter utilities, backtest API routes, controller, DTOs, backtests
  service, range resolver, run queue/job, data gateway, replay core, fill
  model, report lifecycle, immutable strategy/market snapshot resolver,
  BacktestRun/BacktestTrade/BacktestReport DB models, API/replay/Web tests,
  and module docs.
- Added `CHAIN-BACKTESTS`.
- Validation: `pnpm run architecture:graph:generate` passed with `324` nodes,
  `371` relations, and `14` chains.
- Residual risk: this is graph traceability proof only. It is not fresh
  authenticated browser proof, heavy replay performance proof, or full
  repository graph coverage.

