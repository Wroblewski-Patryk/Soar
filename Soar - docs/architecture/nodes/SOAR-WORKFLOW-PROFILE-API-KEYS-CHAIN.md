---
id: SOAR-WORKFLOW-PROFILE-API-KEYS-CHAIN
name: "Profile API Keys execution workflow"
type: workflow
status: verified_local
layer: fullstack
module: profile
feature: profile-api-keys
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, workflow, fullstack, verified_local]
---

# Profile API Keys execution workflow

| Field | Value |
| --- | --- |
| Description | Workflow from profile API-key UI through Web service API routes controller DTO service encryption probe exchange boundary DB tests and docs. |
| File path | docs/architecture/chains/chains.csv |
| Related files | docs/architecture/chains/CHAIN-PROFILE-API-KEYS.md |
| Parent | [[SOAR-FEATURE-PROFILE-API-KEYS]] |
| Children |  |
| Depends on | [[SOAR-FEATURE-PROFILE-API-KEYS]] |
| Used by | [[SOAR-AGENT-COORDINATOR]] |
| UI related | [[SOAR-PAGE-PROFILE]], [[SOAR-COMP-API-KEYS-LIST]], [[SOAR-COMP-API-KEY-FORM]] |
| API related | [[SOAR-API-PROFILE-APIKEY-LIST]], [[SOAR-API-PROFILE-APIKEY-CREATE]], [[SOAR-API-PROFILE-APIKEY-TEST]], [[SOAR-API-PROFILE-APIKEY-STORED-TEST]], [[SOAR-API-PROFILE-APIKEY-ROTATE]], [[SOAR-API-PROFILE-APIKEY-REVOKE]] |
| Database related | [[SOAR-DB-API-KEY]], [[SOAR-DB-LOG]], [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-PROFILE-API-KEYS-API]], [[SOAR-TEST-PROFILE-API-KEYS-WEB]], [[SOAR-TEST-PROFILE-API-KEY-PROBE]] |
| Docs related | [[SOAR-DOC-API-PROFILE]], [[SOAR-DOC-WEB-PROFILE]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Backfill workflow node for P0 Profile API Keys slice. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
