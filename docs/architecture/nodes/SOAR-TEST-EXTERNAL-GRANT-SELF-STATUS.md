---
id: SOAR-TEST-EXTERNAL-GRANT-SELF-STATUS
name: "External grant self-status HTTP tests"
type: test
status: verified_local
layer: testing
module: api-external-client-grants
feature: external-client-authorization
risk_level: high
completion_percent: 90
last_verified_at: 2026-10-19
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# External grant self-status HTTP tests

| Field | Value |
| --- | --- |
| Description | Isolated HTTP proof for opaque Bearer authentication scope denials no leak and no mutation. |
| File path | apps/api/src/modules/externalClientGrants/externalClientGrantSelfStatus.e2e.test.ts |
| Related files | apps/api/src/middleware/rateLimit.test.ts, apps/api/src/middleware/requestLogger.test.ts |
| Parent |  |
| Children |  |
| Depends on | [[SOAR-API-EXTERNAL-GRANT-SELF-STATUS]], [[SOAR-SERVICE-EXTERNAL-GRANT-SELF-STATUS]] |
| Used by |  |
| UI related |  |
| API related |  |
| Database related |  |
| Tests related |  |
| Docs related |  |
| Agent related |  |
| Notes | Local tests do not prove deployment or MCP capability. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
