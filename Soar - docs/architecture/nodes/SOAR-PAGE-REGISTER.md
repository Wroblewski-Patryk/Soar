---
id: SOAR-PAGE-REGISTER
name: "Register page"
type: page
status: verified_local
layer: frontend
module: web-auth
feature: auth-session
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, page, frontend, verified_local]
---

# Register page

| Field | Value |
| --- | --- |
| Description | Public register route and form entrypoint. |
| File path | apps/web/src/app/(public)/auth/register/page.tsx |
| Related files | apps/web/src/features/auth/pages/RegisterPage.tsx |
| Parent | [[SOAR-FEATURE-AUTH-SESSION]] |
| Children |  |
| Depends on | [[SOAR-COMP-REGISTER-FORM]] |
| Used by | [[SOAR-FEATURE-AUTH-SESSION]] |
| UI related | [[SOAR-COMP-REGISTER-FORM]] |
| API related | [[SOAR-API-AUTH-REGISTER]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-WEB-AUTH-FORMS]] |
| Docs related | [[SOAR-DOC-WEB-AUTH]] |
| Agent related |  |
| Notes | Backfilled from auth route/component drift. |

## Relations

- contains -> [[SOAR-COMP-REGISTER-FORM]] (verified_local)
- links_to <- [[SOAR-PAGE-PUBLIC-HOME]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
