# Architecture Graph Markets Backfill - 2026-05-24

## Context

The architecture evidence graph mission is incrementally backfilling critical
Soar modules into CSV source-of-truth records, Obsidian Markdown nodes, JSON
graph export, and function-chain mappings. After Bot Setup and Strategies were
mapped, Markets remained the next dependency leaf because bot topology depends
on market universes and symbol scope.

## Goal

Backfill the Markets universe and catalog slice into the architecture evidence
graph without changing application runtime behavior.

## Constraints

- Keep repository artifacts in English.
- Do not modify runtime behavior, production data, or LIVE exchange behavior.
- Do not claim full repository graph coverage.
- Every graph reference must pass generator validation.

## Implementation Plan

1. Inspect Markets API/Web module docs, route files, service files, components,
   helpers, and tests.
2. Add Markets records to typed registries and canonical `nodes.csv`.
3. Add relations for UI, Web service, API routes, controller, DTOs, service,
   catalog/symbol resolver, DB guards, tests, docs, and consumers.
4. Add `CHAIN-MARKETS`.
5. Refresh generated outputs and source-of-truth state.

## Acceptance Criteria

- Markets has feature, page, component, service/controller/validation, API
  route, test, docs, workflow, relation, and chain records.
- The chain links market universe UI through Web/API/backend/DB/test/doc
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

- Added Markets graph coverage across market universe list/create/edit routes,
  table/form/multiselect components, Web markets service, frontend helpers,
  catalog endpoint, market API routes, controller, DTOs, markets service,
  exchange-catalog/symbol resolver, MarketUniverse/SymbolGroup/Bot/
  BotMarketGroup DB guards, Bot Setup and Bot Runtime consumers, API/Web
  tests, and module docs.
- Added `CHAIN-MARKETS`.
- Validation: `pnpm run architecture:graph:generate` passed with `286` nodes,
  `329` relations, and `13` chains.
- Residual risk: this is graph traceability proof only. It is not fresh
  authenticated browser proof, production market mutation proof, or full
  repository graph coverage.

