---
id: SOAR-TEST-API-SUPPORT-ROUTES
name: "API support routes aggregate tests"
type: test
status: verified_local
layer: testing
module: api
feature: api-support-routes
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# API support routes aggregate tests

| Field | Value |
| --- | --- |
| Description | Aggregate proof node for icons market-stream profile basic/security upload and router reachability tests. |
| File path | apps/api/src/modules/icons/icons.e2e.test.ts |
| Related files | apps/api/src/modules/market-stream/marketStream.routes.e2e.test.ts, apps/api/src/modules/profile/basic/basic.e2e.test.ts, apps/api/src/modules/profile/security/security.e2e.test.ts, apps/api/src/modules/upload/upload.e2e.test.ts |
| Parent | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| Children |  |
| Depends on | [[SOAR-API-ICON-LOOKUP]], [[SOAR-API-MARKET-STREAM-EVENTS]], [[SOAR-API-PROFILE-BASIC-GET]], [[SOAR-API-PROFILE-SECURITY-PASSWORD]], [[SOAR-API-UPLOAD-AVATAR]] |
| Used by | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| UI related |  |
| API related | [[SOAR-API-ICON-LOOKUP]], [[SOAR-API-MARKET-STREAM-EVENTS]], [[SOAR-API-PROFILE-BASIC-GET]], [[SOAR-API-PROFILE-SECURITY-PASSWORD]], [[SOAR-API-UPLOAD-AVATAR]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-API-ROOT]] |
| Agent related |  |
| Notes | Aggregate test evidence for support routes. |

## Relations

- verified_by <- [[SOAR-FEATURE-API-SUPPORT-ROUTES]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
