---
id: SOAR-PAGE-LOGIN
name: "Login page"
type: page
status: verified
layer: frontend
module: web-auth
feature: auth-session
risk_level: medium
completion_percent: 100
last_verified_at: 2026-05-14
verification_status: verified
tags: [soar-map, page, frontend, verified]
---

# Login page

| Field | Value |
| --- | --- |
| Description | Public login route and form entrypoint. |
| File path | apps/web/src/features/auth/components/LoginForm.tsx |
| Related files | apps/web/src/app/(public)/auth/login/page.tsx |
| Parent | [[SOAR-FEATURE-AUTH-SESSION]] |
| Children |  |
| Depends on | [[SOAR-COMP-LOGIN-FORM]] |
| Used by | [[SOAR-FEATURE-AUTH-SESSION]] |
| UI related | [[SOAR-COMP-LOGIN-FORM]] |
| API related | [[SOAR-API-AUTH-LOGIN]] |
| Database related |  |
| Tests related | [[SOAR-TEST-AUTH-SESSION]] |
| Docs related | [[SOAR-DOC-WEB-AUTH]] |
| Agent related |  |
| Notes | Represents route plus primary feature component. |

## Relations

- contains -> [[SOAR-COMP-LOGIN-FORM]] (verified)
- links_to <- [[SOAR-PAGE-PUBLIC-HOME]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
