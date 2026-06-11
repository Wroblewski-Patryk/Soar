# ARCH-GRAPH-OPS-CONFIG-PIPELINE-BACKFILL-2026-05-24

## Architecture Links

- Primary feature/module: Operations config and pipeline graph coverage.
- Architecture nodes: SOAR-FEATURE-OPS-CONFIG-PIPELINE; SOAR-CONFIG-ROOT-PACKAGE; SOAR-CONFIG-GITHUB-CI; SOAR-DOC-LOCAL-DEVELOPMENT; SOAR-DOC-TESTING.
- Function chains: docs/architecture/chains/CHAIN-OPS-CONFIG-PIPELINE.md.
- Affected files: docs/architecture/registry/nodes.csv; docs/architecture/relations/dependencies.csv; docs/architecture/chains/chains.csv; graph generation and drift scripts; generated graph/status exports.
- Tests/proof: `pnpm run architecture:graph:generate`; `pnpm run architecture:graph:drift` recorded in this task's Validation section.
- Docs updated: architecture graph registries, Ops Config Pipeline chain output, generated graph exports, and source-of-truth state files.

## Context

The architecture evidence graph drift audit showed `configAndPipelines` at
`0/9` coverage before this slice. The current workspace stores the project
documentation tree under `docs`, so graph tooling also needed to resolve
that active documentation root while preserving logical `docs/...` references.

## Goal

Represent repository operations configuration and pipeline topology in the
architecture graph: root/workspace package manifests, package manifests,
compose files, GitHub CI, guardrail proof, and local/deployment/testing docs.

## Constraints

- Do not change runtime behavior.
- Do not rename or revert the current documentation directory.
- Do not claim remote CI status or protected production deployment proof.
- Keep graph outputs reproducible from CSV records.

## Definition Of Done

- Add operations config/pipeline nodes and relations.
- Add `CHAIN-OPS-CONFIG-PIPELINE`.
- Update graph tooling to resolve the active documentation root.
- Regenerate graph outputs.
- Re-run drift audit and verify `configAndPipelines` coverage improves.

## Result Report

- Added graph nodes for root package, pnpm workspace, API/Web/Mobile/Shared
  package manifests, local/VPS compose files, GitHub CI, guardrails, and
  local/testing/Coolify documentation.
- Added `CHAIN-OPS-CONFIG-PIPELINE`.
- Added `REL-OPSCFG-*` relations.
- Updated graph generation and drift audit scripts to use `docs` when
  the canonical `docs` folder is not present in the working tree.
- Drift audit now reports `configAndPipelines` as `9/9` covered.

## Validation

- `pnpm run architecture:graph:generate` PASS:
  - `426` nodes
  - `519` relations
  - `19` chains
- `pnpm run architecture:graph:drift` PASS:
  - `796` inventoried files
  - `404` covered by graph CSV path references
  - `392` missing graph path references
  - `configAndPipelines`: `9/9` covered

## Residual Risk

This is graph traceability proof only. It does not replace a fresh remote CI
run, protected production deployment proof, or a decision about whether the
documentation directory should remain `docs` or return to `docs`.
