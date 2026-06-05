---
id: SOAR-TOOL-ROUTE-API-MATRIX-PARITY
name: "Route API matrix parity checker"
type: validator
status: verified_local
layer: tooling
module: architecture
feature: release-audit-tooling
risk_level: high
completion_percent: 100
last_verified_at: 2026-06-05
verification_status: verified_local
tags: [soar-map, validator, tooling, verified_local]
---

# Route API matrix parity checker

| Field | Value |
| --- | --- |
| Description | Generated guardrail comparing Next page routes and Express API endpoints with traceability matrix and dashboard route map coverage patterns. |
| File path | scripts/checkRouteApiMatrixParity.mjs |
| Related files | package.json, docs/automation/guardrail-commands.md, docs/architecture/traceability-matrix.md, docs/architecture/reference/dashboard-route-map.md |
| Parent | [[SOAR-FEATURE-RELEASE-AUDIT-TOOLING]] |
| Children | [[SOAR-TEST-ROUTE-API-MATRIX-PARITY]] |
| Depends on | [[SOAR-DOC-TRACEABILITY]], [[SOAR-DOC-DASHBOARD-ROUTE-MAP]] |
| Used by | [[SOAR-WORKFLOW-RELEASE-AUDIT-TOOLING-CHAIN]] |
| UI related |  |
| API related |  |
| Database related | [[SOAR-ROUTER-API-ROOT]] |
| Tests related |  |
| Docs related | [[SOAR-TEST-ROUTE-API-MATRIX-PARITY]] |
| Agent related | [[SOAR-DOC-TRACEABILITY]], [[SOAR-DOC-DASHBOARD-ROUTE-MAP]] |
| Notes | Added for LUC-2107 route/API matrix parity guardrail. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
