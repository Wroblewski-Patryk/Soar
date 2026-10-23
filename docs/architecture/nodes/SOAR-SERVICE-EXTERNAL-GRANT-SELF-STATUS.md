---
id: SOAR-SERVICE-EXTERNAL-GRANT-SELF-STATUS
name: "External grant self-status reader"
type: service
status: partially_verified
layer: backend
module: api-external-client-grants
feature: external-client-authorization
risk_level: high
completion_percent: 70
last_verified_at: 2026-10-19
verification_status: verified_local
tags: [soar-map, service, backend, partially_verified]
---

# External grant self-status reader

| Field | Value |
| --- | --- |
| Description | Read-only secret hash owner scope entitlement and limit validation for one grant. |
| File path | apps/api/src/modules/externalClientGrants/externalClientGrantSelfStatus.service.ts |
| Related files | apps/api/src/modules/externalClientGrants/externalClientGrants.service.ts, apps/api/src/modules/externalClientGrants/externalClientGrantSelfStatus.e2e.test.ts, docs/modules/api-externalClientGrants.md |
| Parent | [[SOAR-SERVICE-EXTERNAL-CLIENT-GRANTS]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-EXTERNAL-CLIENT-GRANTS]], [[SOAR-SERVICE-SUBSCRIPTION-ENTITLEMENTS]] |
| Used by | [[SOAR-API-EXTERNAL-GRANT-SELF-STATUS]] |
| UI related |  |
| API related |  |
| Database related |  |
| Tests related | [[SOAR-TEST-EXTERNAL-GRANT-SELF-STATUS]] |
| Docs related |  |
| Agent related |  |
| Notes | No database writes or grant domain execution. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
