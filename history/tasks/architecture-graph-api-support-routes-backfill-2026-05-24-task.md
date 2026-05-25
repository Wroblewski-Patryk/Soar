# Task: Architecture Graph API Support Routes Backfill

## Context

Stage: verification
Operation mode: BUILDER
Mission: Obsidian-first architecture evidence graph expansion.

The architecture graph drift audit still showed missing API route files after
the operations/config pipeline slice. The missing category was bounded and
covered aggregate API routers plus support route modules.

## Goal

Backfill API support route records so the architecture graph can trace root,
dashboard, and admin route mounting into icons, market stream, profile
basic/security, upload, tests, and docs.

## Scope

- Add graph records for API support routers, routes, services, tests, docs, and
  workflow chain.
- Add typed rows in `api_routes.csv`, `tests.csv`, `features.csv`, and
  `workflows.csv`.
- Add dependency relations for router mounts, route-to-controller/service
  edges, verification, and documentation proof.
- Regenerate architecture graph and drift audit.

## Constraints

- No runtime behavior changes.
- No implementation refactor.
- Preserve logical `docs/...` paths while using the current physical
  `Soar - docs` docs root.
- Do not claim full repository graph coverage.

## Definition of Done

- Graph generation succeeds.
- Drift audit shows `apiRoutes` fully covered.
- State files and mission evidence are updated.
- Residual drift is recorded honestly.

## Forbidden

- Do not invent source files.
- Do not mark untested behavior as production verified.
- Do not hide remaining missing graph coverage.

## Result Report

Implemented API support route graph backfill on 2026-05-24.

Evidence:

- `pnpm run architecture:graph:generate` passed.
- Generated graph now contains 461 nodes, 559 relations, and 20 chains.
- `pnpm run architecture:graph:drift` passed.
- Drift audit now reports 425/796 covered and 371 missing.
- `apiRoutes` category is fully covered: 22/22 covered, 0 missing.

Residual risk:

- Remaining graph drift is 371 files, mainly API services/tests, Web
  components/tests, hooks/services, and architecture/module docs.
- This was a documentation/graph backfill only; no runtime API journey was
  executed in this slice.

