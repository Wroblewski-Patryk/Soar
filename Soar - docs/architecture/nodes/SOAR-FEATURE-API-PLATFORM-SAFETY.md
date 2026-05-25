---
id: SOAR-FEATURE-API-PLATFORM-SAFETY
name: "API platform safety feature"
type: feature
status: verified_local
layer: backend
module: api-platform
feature: api-platform-safety
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, feature, backend, verified_local]
---

# API platform safety feature

| Field | Value |
| --- | --- |
| Description | API config middleware and shared library safety layer for readiness proxy trust runtime execution auth rate limiting trusted origins ops network logging errors and symbols. |
| File path | docs/modules/api-root.md |
| Related files | docs/engineering/local-development.md, docs/engineering/testing.md |
| Parent |  |
| Children | [[SOAR-CONFIG-CRITICAL-SECRETS-READINESS]], [[SOAR-CONFIG-PROXY-TRUST]], [[SOAR-CONFIG-RUNTIME-EXECUTION]], [[SOAR-MIDDLEWARE-REQUIRE-AUTH]], [[SOAR-MIDDLEWARE-RATE-LIMIT]], [[SOAR-MIDDLEWARE-TRUSTED-ORIGIN]], [[SOAR-LIB-ERRORS]], [[SOAR-LIB-LOGGER]], [[SOAR-LIB-SYMBOLS]] |
| Depends on | [[SOAR-CONFIG-API-PACKAGE]] |
| Used by | [[SOAR-FEATURE-AUTH-SESSION]], [[SOAR-FEATURE-API-SUPPORT-ROUTES]], [[SOAR-FEATURE-BOT-RUNTIME]] |
| UI related |  |
| API related | [[SOAR-ROUTER-API-ROOT]] |
| Database related |  |
| Tests related | [[SOAR-TEST-API-PLATFORM-SAFETY]] |
| Docs related | [[SOAR-DOC-API-ROOT]], [[SOAR-DOC-LOCAL-DEVELOPMENT]], [[SOAR-DOC-TESTING]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Backfilled from drift audit platform/config/middleware/lib tests. |

## Relations

- has_source -> [[SOAR-CONFIG-RUNTIME-EXECUTION]] (verified_local)
- verified_by -> [[SOAR-TEST-API-PLATFORM-SAFETY]] (verified_local)
- documented_by -> [[SOAR-DOC-API-ROOT]] (verified_local)
- documented_by -> [[SOAR-DOC-LOCAL-DEVELOPMENT]] (verified_local)
- verified_by -> [[SOAR-TEST-API-RESIDUAL-EVIDENCE]] (verified_local)
- verified_by -> [[SOAR-TEST-API-INFRASTRUCTURE-RESIDUAL]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
