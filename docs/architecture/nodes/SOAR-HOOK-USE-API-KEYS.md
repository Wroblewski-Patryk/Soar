---
id: SOAR-HOOK-USE-API-KEYS
name: "useApiKeys"
type: hook
status: verified_local
layer: frontend
module: web-profile
feature: profile-api-keys
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, hook, frontend, verified_local]
---

# useApiKeys

| Field | Value |
| --- | --- |
| Description | Profile API-key hook for list mutation and connection-test state. |
| File path | apps/web/src/features/profile/hooks/useApiKeys.ts |
| Related files | apps/web/src/features/profile/services/apiKeys.service.ts |
| Parent | [[SOAR-FEATURE-PROFILE-API-KEYS]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-WEB-API-KEYS]] |
| Used by | [[SOAR-COMP-API-KEYS-LIST]], [[SOAR-COMP-API-KEY-FORM]] |
| UI related | [[SOAR-COMP-API-KEYS-LIST]], [[SOAR-COMP-API-KEY-FORM]] |
| API related | [[SOAR-API-PROFILE-APIKEY-LIST]], [[SOAR-API-PROFILE-APIKEY-CREATE]], [[SOAR-API-PROFILE-APIKEY-TEST]] |
| Database related | [[SOAR-DB-API-KEY]] |
| Tests related | [[SOAR-TEST-PROFILE-API-KEYS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-PROFILE]] |
| Agent related |  |
| Notes | State layer for API-key lifecycle UX. |

## Relations

- calls -> [[SOAR-SERVICE-WEB-API-KEYS]] (verified_local)
- uses <- [[SOAR-COMP-API-KEYS-LIST]] (verified_local)
- uses <- [[SOAR-COMP-API-KEY-FORM]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
