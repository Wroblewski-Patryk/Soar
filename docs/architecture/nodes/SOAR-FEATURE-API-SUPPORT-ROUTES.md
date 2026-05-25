---
id: SOAR-FEATURE-API-SUPPORT-ROUTES
name: "API support routes feature"
type: feature
status: verified_local
layer: backend
module: api
feature: api-support-routes
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, feature, backend, verified_local]
---

# API support routes feature

| Field | Value |
| --- | --- |
| Description | Dashboard/admin aggregate routers and support modules for profile basics security icon lookup market stream and avatar upload. |
| File path | docs/modules/api-root.md |
| Related files | docs/modules/api-profile.md, docs/modules/api-icons.md, docs/modules/api-market-stream.md, docs/modules/api-upload.md, docs/modules/api-admin.md |
| Parent |  |
| Children | [[SOAR-ROUTER-API-ROOT]], [[SOAR-ROUTER-DASHBOARD]], [[SOAR-ROUTER-ADMIN]], [[SOAR-API-ICON-LOOKUP]], [[SOAR-API-MARKET-STREAM-EVENTS]], [[SOAR-API-PROFILE-BASIC-GET]], [[SOAR-API-PROFILE-BASIC-UPDATE]], [[SOAR-API-PROFILE-BASIC-DELETE]], [[SOAR-API-PROFILE-SECURITY-PASSWORD]], [[SOAR-API-PROFILE-SECURITY-ACCOUNT]], [[SOAR-API-UPLOAD-AVATAR]] |
| Depends on | [[SOAR-FEATURE-AUTH-SESSION]], [[SOAR-DB-USER]] |
| Used by | [[SOAR-FEATURE-PROFILE-API-KEYS]], [[SOAR-FEATURE-MARKETS]], [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| UI related |  |
| API related | [[SOAR-API-ICON-LOOKUP]], [[SOAR-API-MARKET-STREAM-EVENTS]], [[SOAR-API-PROFILE-BASIC-GET]], [[SOAR-API-PROFILE-SECURITY-PASSWORD]], [[SOAR-API-UPLOAD-AVATAR]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-API-SUPPORT-ROUTES]] |
| Docs related | [[SOAR-DOC-API-ROOT]], [[SOAR-DOC-API-PROFILE]], [[SOAR-DOC-API-ICONS]], [[SOAR-DOC-API-MARKET-STREAM]], [[SOAR-DOC-API-UPLOAD]], [[SOAR-DOC-API-ADMIN]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Backfilled from drift audit missing API route files. |

## Relations

- has_source -> [[SOAR-ROUTER-API-ROOT]] (verified_local)
- verified_by -> [[SOAR-TEST-API-SUPPORT-ROUTES]] (verified_local)
- documented_by -> [[SOAR-DOC-API-ROOT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
