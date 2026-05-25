# Task

## Header
- ID: `ARCH-GRAPH-MANUAL-ORDER-BACKFILL-2026-05-24`
- Title: Backfill manual-order execution chain in the architecture evidence graph
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Active chat coordinator
- Priority: P1
- Module Confidence Rows: documentation/process confidence; `SOAR-MANUAL-ORDERS-001`; `SOAR-ORDERS-001`
- Requirement Rows: `REQ-DOC-006`
- Quality Scenario Rows: `QAS-DOC-006`
- Risk Rows: `RISK-DOC-005`
- Iteration: 2
- Operation Mode: BUILDER
- Mission ID: `ARCH-EVIDENCE-GRAPH-SYSTEM-2026-05-24`
- Mission Status: PARTIALLY_VERIFIED

## Context

The architecture evidence graph foundation existed with a seed manual-order
chain, but the chain was still too coarse for impact analysis. The P0 manual
order path needs finer nodes for UI action surfaces, Web API service, API
routes, controller, DTO schemas, service seams, pre-trade, lifecycle, exchange
events, data models, tests, and docs.

## Goal

Backfill one high-risk P0 slice: manual order execution and open-order action
mapping.

## Scope

- CSV graph registries under `docs/architecture/registry/`
- Relation registry `docs/architecture/relations/dependencies.csv`
- Chain registry `docs/architecture/chains/chains.csv`
- Generated graph outputs from `pnpm run architecture:graph:generate`
- State/context updates

No runtime code, deployment, production data, or LIVE exchange mutation is in
scope.

## Implementation Plan

1. Inspect orders API docs, Web orders/dashboard docs, route files, controller,
   and existing tests.
2. Add missing graph nodes for the manual-order route/controller/service/test
   seams.
3. Add directed relation rows.
4. Add a detailed execution chain.
5. Regenerate graph outputs.
6. Run graph, guardrail, and docs validation.
7. Update project memory and next-step state.

## Acceptance Criteria

- Manual-order graph has detailed UI -> Web service -> API route -> controller
  -> DTO -> service -> pre-trade/exchange/lifecycle -> DB -> tests -> docs
  coverage.
- Generator passes with no missing node or file references.
- State files record that this is one backfilled slice, not full graph
  completion.

## Definition of Done

- [x] Manual-order nodes added.
- [x] Manual-order relations added.
- [x] Detailed manual-order chain added.
- [x] Graph regenerated.
- [x] Guardrails and docs parity pass.
- [x] Residual graph backfill remains tracked.

## Validation Evidence

- Tests:
  - `pnpm run architecture:graph:generate` PASS, `67` nodes, `51` relations,
    `5` chains.
  - `pnpm run quality:guardrails` PASS.
  - `pnpm run docs:parity:check` PASS.
- Manual checks: inspected `api-orders.md`, `web-orders.md`,
  `web-dashboard-home.md`, `orders.routes.ts`, and `orders.controller.ts`.
- High-risk checks: no runtime behavior changed; LIVE mutation remains
  approval-gated.
- Reality status: partially verified.

## Architecture Evidence

- Architecture source reviewed:
  - `docs/architecture/architecture-evidence-graph-system.md`
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/modules/api-orders.md`
  - `docs/modules/web-orders.md`
  - `docs/modules/web-dashboard-home.md`
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.

## Result Report

- Task summary: backfilled the manual-order graph from coarse seed to detailed
  P0 execution chain.
- Files changed: CSV graph registries, generated node/chain/graph outputs, and
  state/context docs.
- How tested: graph generation, guardrails, docs parity.
- What is incomplete: full graph backfill for remaining modules and drift
  checks against route/test/docs inventories.
- Next steps: backfill positions or auth next; positions is the natural
  continuation because manual order close/open lifecycle depends on position
  state.
