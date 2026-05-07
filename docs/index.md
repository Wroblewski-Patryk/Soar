# Soar Engineering Documentation Index

Updated: 2026-05-03

This is the engineering entrypoint for Soar documentation. It is a system map:
start here when you need to understand how a feature moves through product
intent, frontend routes, API modules, services, data models, runtime pipelines,
tests, deployment, and operator evidence.

## Fast Reading Path
1. [Product overview](./product/overview.md)
2. [Architecture source of truth](./architecture/architecture-source-of-truth.md)
3. [Architecture README](./architecture/README.md)
4. [Codebase map](./architecture/codebase-map.md)
5. [Traceability matrix](./architecture/traceability-matrix.md)
6. [Pipeline registry](./pipelines/index.md)
7. [Module registry](./modules/index.md)
8. [Agent operating system](../.agents/core/operating-system.md)
9. [Documentation drift report](./analysis/documentation-drift.md)
10. [Documentation maintenance rules](./CONTRIBUTING-DOCS.md)

## Canonical Folders
| Folder | Role | Start Here |
|---|---|---|
| `docs/architecture/` | Canonical runtime, ownership, data, parity, and safety truth. | [Architecture README](./architecture/README.md) |
| `docs/modules/` | Implementation-facing module ownership, dependencies, routes, and tests. | [Module registry](./modules/index.md) |
| `docs/pipelines/` | End-to-end system flows across UI, API, services, data, workers, and tests. | [Pipeline registry](./pipelines/index.md) |
| `docs/flows/` | Agent-readable flow entrypoint that points back to canonical pipelines. | [Flow memory](./flows/README.md) |
| `docs/contracts/` | Agent-readable contract entrypoint that points back to canonical architecture references. | [Contract memory](./contracts/README.md) |
| `docs/testing/` | Agent-readable testing and validation memory. | [Testing memory](./testing/README.md) |
| `docs/analysis/` | Audits, inventories, and drift reports. | [Documentation inventory](./analysis/documentation-inventory.md) |
| `docs/product/` | Product scope, vision, glossary, and known limits. | [Product overview](./product/overview.md) |
| `docs/planning/` | Active queue, execution plans, and unresolved decisions. | [MVP next commits](./planning/mvp-next-commits.md) |
| `docs/operations/` | Deployment, smoke checks, rollback, incidents, evidence, and runbooks. | [Post-deploy smoke checklist](./operations/post-deploy-smoke-checklist.md) |
| `docs/security/` | Secure development, risk, API key, and secrets policy. | [Secure development lifecycle](./security/secure-development-lifecycle.md) |
| `docs/ux/` | Dashboard design system, quality bars, parity evidence, and anti-patterns. | [Dashboard design system](./ux/dashboard-design-system.md) |
| `docs/governance/` | Repository, agent, and delivery rules. | [Autonomous engineering loop](./governance/autonomous-engineering-loop.md) |

## Agent Operating Memory
- [Agent operating system](../.agents/core/operating-system.md)
- [Execution loop](../.agents/core/execution-loop.md)
- [Anti-regression system](../.agents/core/anti-regression.md)
- [Quality gates](../.agents/core/quality-gates.md)
- [Current focus](../.agents/state/current-focus.md)
- [Known issues](../.agents/state/known-issues.md)
- [Regression log](../.agents/state/regression-log.md)
- [System health](../.agents/state/system-health.md)
- [Next steps](../.agents/state/next-steps.md)

## System Map Artifacts
- [Documentation inventory](./analysis/documentation-inventory.md) lists the
  documentation tree, purpose, related code areas, suspected outdated files,
  and missing areas.
- [Codebase map](./architecture/codebase-map.md) maps backend modules,
  frontend features, routes, services, data models, workers, integrations, and
  runtime structure.
- [Traceability matrix](./architecture/traceability-matrix.md) maps core
  features from frontend entry to backend route, service/module, data model,
  pipeline, tests, and related docs.
- [Pipeline registry](./pipelines/index.md) is the canonical list of system
  flows and their trigger, involved files, data read/write, failure points, and
  tests.
- [Module registry](./modules/index.md) connects active API and web modules to
  deep dives, pipeline usage, routes, data models, and known gaps.
- [Documentation drift report](./analysis/documentation-drift.md) records
  known doc/code gaps and marks unverified areas explicitly.

## Maintenance Rule
Every feature, route, module, database model, pipeline, deployment behavior, or
test coverage change must update the matching traceability and registry docs in
the same task. See [CONTRIBUTING-DOCS](./CONTRIBUTING-DOCS.md).
