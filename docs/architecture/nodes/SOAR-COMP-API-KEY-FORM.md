---
id: SOAR-COMP-API-KEY-FORM
name: "ApiKeyForm"
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

# ApiKeyForm

| Field | Value |
| --- | --- |
| Description | Profile API key form for add edit and provided-credential connection tests. |
| File path | apps/web/src/features/profile/components/ApiKeyForm.tsx |
| Related files | apps/web/src/features/profile/types/apiKeyForm.type.ts |
| Parent | [[SOAR-PAGE-PROFILE]] |
| Children |  |
| Depends on | [[SOAR-HOOK-USE-API-KEYS]] |
| Used by | [[SOAR-PAGE-PROFILE]] |
| UI related | [[SOAR-PAGE-PROFILE]] |
| API related | [[SOAR-API-PROFILE-APIKEY-CREATE]], [[SOAR-API-PROFILE-APIKEY-UPDATE]], [[SOAR-API-PROFILE-APIKEY-TEST]] |
| Database related | [[SOAR-DB-API-KEY]] |
| Tests related | [[SOAR-TEST-PROFILE-API-KEYS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-PROFILE]] |
| Agent related |  |
| Notes | Form submits credential data only through authenticated API client. |

## Relations

- uses -> [[SOAR-HOOK-USE-API-KEYS]] (verified_local)
- contains <- [[SOAR-PAGE-PROFILE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
