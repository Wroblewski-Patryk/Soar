---
id: SOAR-API-EXTERNAL-GRANT-SELF-STATUS
name: "GET /external-client/grants/:id/status"
type: api_route
status: partially_verified
layer: backend
module: api-external-client-grants
feature: external-client-authorization
risk_level: high
completion_percent: 70
last_verified_at: 2026-10-19
verification_status: verified_local
tags: [soar-map, api_route, backend, partially_verified]
---

# GET /external-client/grants/:id/status

| Field | Value |
| --- | --- |
| Description | Opaque Bearer read-only grant self-status route with uniform denial and IP rate limiting. |
| File path | apps/api/src/modules/externalClientGrants/externalClientGrantSelfStatus.routes.ts |
| Related files | apps/api/src/modules/externalClientGrants/externalClientGrantSelfStatus.service.ts, apps/api/src/modules/externalClientGrants/externalClientGrantSelfStatus.e2e.test.ts, docs/modules/api-externalClientGrants.md |
| Parent |  |
| Children |  |
| Depends on | [[SOAR-SERVICE-EXTERNAL-GRANT-SELF-STATUS]], [[SOAR-MIDDLEWARE-RATE-LIMIT]] |
| Used by |  |
| UI related |  |
| API related |  |
| Database related |  |
| Tests related | [[SOAR-TEST-EXTERNAL-GRANT-SELF-STATUS]] |
| Docs related |  |
| Agent related |  |
| Notes | Local isolated HTTP proof only; no domain action or deployed acceptance. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
