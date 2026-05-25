---
id: SOAR-FEATURE-AUTH-SESSION
name: "Auth session"
type: feature
status: verified
layer: fullstack
module: auth
feature: auth-session
risk_level: high
completion_percent: 100
last_verified_at: 2026-05-14
verification_status: verified
tags: [soar-map, feature, fullstack, verified]
---

# Auth session

| Field | Value |
| --- | --- |
| Description | Login logout current-user and protected-route session lifecycle. |
| File path | docs/architecture/traceability-matrix.md |
| Related files | docs/modules/api-auth.md, docs/modules/web-auth.md |
| Parent |  |
| Children | [[SOAR-PAGE-LOGIN]], [[SOAR-API-AUTH-LOGIN]], [[SOAR-API-AUTH-ME]] |
| Depends on | [[SOAR-DOC-TRACEABILITY]] |
| Used by | [[SOAR-FEATURE-DASHBOARD-RUNTIME]] |
| UI related | [[SOAR-PAGE-LOGIN]] |
| API related | [[SOAR-API-AUTH-LOGIN]], [[SOAR-API-AUTH-ME]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-AUTH-SESSION]] |
| Docs related | [[SOAR-DOC-TRACEABILITY]] |
| Agent related |  |
| Notes | Seeded from traceability matrix and module confidence ledger. |

## Relations

- has_entrypoint -> [[SOAR-PAGE-PUBLIC-HOME]] (verified_local)
- verified_by -> [[SOAR-TEST-WEB-AUTH-FORMS]] (verified_local)
- verified_by -> [[SOAR-TEST-WEB-AUTH-HOOKS]] (verified_local)
- verified_by -> [[SOAR-TEST-API-AUTH-SESSION-DEEP]] (verified_local)
- documented_by -> [[SOAR-DOC-API-AUTH]] (verified_local)
- documented_by -> [[SOAR-DOC-WEB-AUTH]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
