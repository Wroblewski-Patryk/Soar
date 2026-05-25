---
id: SOAR-TEST-PROFILE-API-KEYS-WEB
name: "Profile API-key Web tests"
type: test
status: verified_local
layer: testing
module: web-profile
feature: profile-api-keys
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Profile API-key Web tests

| Field | Value |
| --- | --- |
| Description | Profile API-key form list and service tests. |
| File path | apps/web/src/features/profile/components/ApiKeyForm.test.tsx |
| Related files | apps/web/src/features/profile/components/ApiKeysList.test.tsx, apps/web/src/features/profile/services/apiKeys.service.test.ts, apps/web/src/app/dashboard/profile/page.test.tsx |
| Parent | [[SOAR-FEATURE-PROFILE-API-KEYS]] |
| Children |  |
| Depends on | [[SOAR-COMP-API-KEY-FORM]], [[SOAR-COMP-API-KEYS-LIST]], [[SOAR-SERVICE-WEB-API-KEYS]] |
| Used by | [[SOAR-FEATURE-PROFILE-API-KEYS]] |
| UI related | [[SOAR-PAGE-PROFILE]] |
| API related | [[SOAR-SERVICE-WEB-API-KEYS]] |
| Database related | [[SOAR-DB-API-KEY]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-WEB-PROFILE]] |
| Agent related |  |
| Notes | UI proof for API-key lifecycle and probe UX. |

## Relations

- verified_by <- [[SOAR-FEATURE-PROFILE-API-KEYS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
