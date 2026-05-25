---
id: SOAR-WORKFLOW-API-SUPPORT-ROUTES-CHAIN
name: "API support routes workflow"
type: workflow
status: verified_local
layer: backend
module: api
feature: api-support-routes
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, workflow, backend, verified_local]
---

# API support routes workflow

| Field | Value |
| --- | --- |
| Description | Workflow from root router through dashboard/admin aggregate routers support routes services tests and module docs. |
| File path | docs/architecture/chains/chains.csv |
| Related files | docs/architecture/chains/CHAIN-API-SUPPORT-ROUTES.md |
| Parent | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| Children |  |
| Depends on | [[SOAR-ROUTER-API-ROOT]], [[SOAR-ROUTER-DASHBOARD]], [[SOAR-ROUTER-ADMIN]], [[SOAR-API-ICON-LOOKUP]], [[SOAR-API-MARKET-STREAM-EVENTS]], [[SOAR-API-PROFILE-BASIC-GET]], [[SOAR-API-PROFILE-SECURITY-PASSWORD]], [[SOAR-API-UPLOAD-AVATAR]] |
| Used by | [[SOAR-AGENT-COORDINATOR]] |
| UI related |  |
| API related | [[SOAR-API-ICON-LOOKUP]], [[SOAR-API-MARKET-STREAM-EVENTS]], [[SOAR-API-PROFILE-BASIC-GET]], [[SOAR-API-PROFILE-SECURITY-PASSWORD]], [[SOAR-API-UPLOAD-AVATAR]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-API-SUPPORT-ROUTES]] |
| Docs related | [[SOAR-DOC-API-ROOT]], [[SOAR-DOC-API-PROFILE]], [[SOAR-DOC-API-ICONS]], [[SOAR-DOC-API-MARKET-STREAM]], [[SOAR-DOC-API-UPLOAD]], [[SOAR-DOC-API-ADMIN]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Backfill workflow node for API support route drift slice. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
