---
id: SOAR-PAGE-PROFILE
name: "Profile page"
type: page
status: verified_local
layer: frontend
module: web-profile
feature: profile-api-keys
risk_level: high
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, page, frontend, verified_local]
---

# Profile page

| Field | Value |
| --- | --- |
| Description | Authenticated profile route hosting basic security subscription and API-key panels. |
| File path | apps/web/src/app/dashboard/profile/page.tsx |
| Related files | apps/web/src/features/profile/pages/ProfilePage.tsx |
| Parent | [[SOAR-FEATURE-PROFILE-API-KEYS]] |
| Children |  |
| Depends on | [[SOAR-COMP-API-KEYS-LIST]], [[SOAR-COMP-API-KEY-FORM]] |
| Used by | [[SOAR-FEATURE-PROFILE-API-KEYS]], [[SOAR-FEATURE-WALLETS]] |
| UI related | [[SOAR-COMP-API-KEYS-LIST]], [[SOAR-COMP-API-KEY-FORM]] |
| API related | [[SOAR-API-PROFILE-APIKEY-LIST]], [[SOAR-API-PROFILE-APIKEY-CREATE]], [[SOAR-API-PROFILE-APIKEY-TEST]] |
| Database related | [[SOAR-DB-API-KEY]] |
| Tests related | [[SOAR-TEST-PROFILE-API-KEYS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-PROFILE]] |
| Agent related |  |
| Notes | Hash-synced profile tabs host API-key management. |

## Relations

- contains -> [[SOAR-COMP-API-KEYS-LIST]] (verified_local)
- contains -> [[SOAR-COMP-API-KEY-FORM]] (verified_local)
- contains -> [[SOAR-COMP-PROFILE-BASIC-FORM]] (verified_local)
- contains -> [[SOAR-COMP-PROFILE-SECURITY]] (verified_local)
- verified_by -> [[SOAR-TEST-WEB-PROFILE-BASIC-SECURITY]] (verified_local)
- has_entrypoint <- [[SOAR-FEATURE-PROFILE-API-KEYS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
