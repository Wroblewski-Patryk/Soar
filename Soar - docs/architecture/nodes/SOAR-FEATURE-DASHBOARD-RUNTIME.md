---
id: SOAR-FEATURE-DASHBOARD-RUNTIME
name: "Dashboard runtime monitoring"
type: feature
status: partially_verified
layer: fullstack
module: dashboard-runtime
feature: dashboard-runtime
risk_level: high
completion_percent: 85
last_verified_at: 2026-05-23
verification_status: partially_verified
tags: [soar-map, feature, fullstack, partially_verified]
---

# Dashboard runtime monitoring

| Field | Value |
| --- | --- |
| Description | Selected bot runtime data across dashboard UI runtime APIs positions orders trades and market stream updates. |
| File path | docs/architecture/traceability-matrix.md |
| Related files | docs/modules/web-dashboard-home.md, docs/modules/api-bots.md |
| Parent |  |
| Children | [[SOAR-PAGE-DASHBOARD]], [[SOAR-COMP-HOME-LIVE-WIDGETS]], [[SOAR-API-BOT-RUNTIME-POSITIONS]], [[SOAR-DB-RUNTIME-SESSION]] |
| Depends on | [[SOAR-FEATURE-AUTH-SESSION]], [[SOAR-FEATURE-MANUAL-ORDER]] |
| Used by | [[SOAR-FEATURE-MANUAL-ORDER]] |
| UI related | [[SOAR-PAGE-DASHBOARD]] |
| API related | [[SOAR-API-BOT-RUNTIME-POSITIONS]] |
| Database related | [[SOAR-DB-RUNTIME-SESSION]], [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-DASHBOARD-RUNTIME]] |
| Docs related | [[SOAR-DOC-TRACEABILITY]] |
| Agent related |  |
| Notes | Protected production readback remains access-gated even with strong local proof. |

## Relations

- verified_by -> [[SOAR-TEST-DASHBOARD-RUNTIME-RESIDUAL-WEB]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
