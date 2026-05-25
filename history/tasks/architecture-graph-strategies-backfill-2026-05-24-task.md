# Architecture Graph Strategies Backfill - 2026-05-24

## Context

The operator requested a living Obsidian-first architecture evidence graph for
Soar, with CSV as source of truth and Markdown/JSON graph outputs. The graph
foundation and earlier backfills already covered manual orders, positions, bot
runtime, exchange adapter, wallets, profile API keys, and bot setup. Bot Setup
exposed Strategies as a critical dependency leaf for runtime topology and
future impact analysis.

## Goal

Backfill the Strategies authoring and indicator catalog slice into the
architecture evidence graph without changing application runtime behavior.

## Constraints

- Keep repository artifacts in English.
- Do not modify runtime behavior, production data, or LIVE exchange behavior.
- Treat the graph as incremental; do not claim full repository coverage.
- Every graph reference must resolve through generator validation.

## Implementation Plan

1. Inspect existing strategy module docs, route files, frontend API service,
   component structure, and test files.
2. Add Strategies nodes to typed CSV registries and the canonical
   `nodes.csv`.
3. Add explicit relations for UI, Web service, API routes, controller,
   validation, service, DB guards, tests, and docs.
4. Add `CHAIN-STRATEGIES` and generated Obsidian-compatible outputs.
5. Update project source-of-truth files and validation evidence.

## Acceptance Criteria

- Strategies has feature, page, component, service/controller/validation,
  API route, test, docs, workflow, relation, and chain records.
- The chain links Strategy UI through Web/API/backend/DB/test/doc evidence.
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

- Added Strategies graph coverage across list/create/edit UI, `StrategiesList`,
  `StrategyForm`, form sections, `StrategyPresetPicker`, Web strategies API
  client, form mapping, presets, strategy API routes, controller, DTO/config
  validation, strategy service, indicator catalog, `Strategy`/`Bot`/
  `MarketGroupStrategyLink` DB guards, Bot Setup and Bot Runtime consumers,
  API/Web/indicator/utility tests, and module docs.
- Added `CHAIN-STRATEGIES`.
- Validation: `pnpm run architecture:graph:generate` passed with `261` nodes,
  `293` relations, and `12` chains.
- Residual risk: this is graph traceability proof only. It is not fresh
  authenticated browser proof, production strategy mutation proof, or full
  repository graph coverage.

