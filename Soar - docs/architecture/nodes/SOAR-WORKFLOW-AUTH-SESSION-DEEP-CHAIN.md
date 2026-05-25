---
id: SOAR-WORKFLOW-AUTH-SESSION-DEEP-CHAIN
name: "Auth session deep workflow"
type: workflow
status: verified_local
layer: fullstack
module: auth
feature: auth-session
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, workflow, fullstack, verified_local]
---

# Auth session deep workflow

| Field | Value |
| --- | --- |
| Description | Workflow from public auth routes through Web forms hooks services AuthContext API routes controller service cookie JWT errors User model tests and docs. |
| File path | docs/architecture/chains/chains.csv |
| Related files | docs/architecture/chains/CHAIN-AUTH-SESSION-DEEP.md |
| Parent | [[SOAR-FEATURE-AUTH-SESSION]] |
| Children |  |
| Depends on | [[SOAR-PAGE-LOGIN]], [[SOAR-PAGE-REGISTER]], [[SOAR-CONTEXT-WEB-AUTH]], [[SOAR-API-AUTH-LOGIN]], [[SOAR-API-AUTH-REGISTER]], [[SOAR-SERVICE-AUTH]] |
| Used by | [[SOAR-AGENT-COORDINATOR]] |
| UI related | [[SOAR-PAGE-LOGIN]], [[SOAR-PAGE-REGISTER]] |
| API related | [[SOAR-API-AUTH-LOGIN]], [[SOAR-API-AUTH-REGISTER]], [[SOAR-API-AUTH-ME]], [[SOAR-API-AUTH-LOGOUT]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-API-AUTH-SESSION-DEEP]], [[SOAR-TEST-WEB-AUTH-FORMS]], [[SOAR-TEST-WEB-AUTH-HOOKS]], [[SOAR-TEST-WEB-AUTH-CONTEXT]] |
| Docs related | [[SOAR-DOC-API-AUTH]], [[SOAR-DOC-WEB-AUTH]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Backfill workflow node for auth session/public entrypoint drift slice. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
