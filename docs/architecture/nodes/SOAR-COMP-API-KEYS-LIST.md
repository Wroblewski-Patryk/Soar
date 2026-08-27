---
id: SOAR-COMP-API-KEYS-LIST
name: "ApiKeysList"
type: component
status: verified_local
layer: frontend
module: web-profile
feature: profile-api-keys
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, component, frontend, verified_local]
---

# ApiKeysList

| Field | Value |
| --- | --- |
| Description | Profile API keys list component for masked key rows test rotate revoke delete actions. |
| File path | apps/web/src/features/profile/components/ApiKeysList.tsx |
| Related files |  |
| Parent | [[SOAR-PAGE-PROFILE]] |
| Children |  |
| Depends on | [[SOAR-HOOK-USE-API-KEYS]] |
| Used by | [[SOAR-PAGE-PROFILE]] |
| UI related | [[SOAR-PAGE-PROFILE]] |
| API related | [[SOAR-API-PROFILE-APIKEY-LIST]], [[SOAR-API-PROFILE-APIKEY-STORED-TEST]], [[SOAR-API-PROFILE-APIKEY-ROTATE]], [[SOAR-API-PROFILE-APIKEY-REVOKE]], [[SOAR-API-PROFILE-APIKEY-DELETE]] |
| Database related | [[SOAR-DB-API-KEY]] |
| Tests related | [[SOAR-TEST-PROFILE-API-KEYS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-PROFILE]] |
| Agent related |  |
| Notes | Rows must never expose raw secrets. |

## Relations

- uses -> [[SOAR-HOOK-USE-API-KEYS]] (verified_local)
- contains <- [[SOAR-PAGE-PROFILE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
