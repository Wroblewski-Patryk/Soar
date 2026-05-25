---
id: SOAR-PAGE-PUBLIC-HOME
name: "Public landing page"
type: page
status: verified_local
layer: frontend
module: web-public
feature: auth-session
risk_level: medium
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, page, frontend, verified_local]
---

# Public landing page

| Field | Value |
| --- | --- |
| Description | Public landing page that links unauthenticated users toward auth entrypoints. |
| File path | apps/web/src/app/(public)/page.tsx |
| Related files |  |
| Parent | [[SOAR-FEATURE-AUTH-SESSION]] |
| Children |  |
| Depends on | [[SOAR-PAGE-LOGIN]], [[SOAR-PAGE-REGISTER]] |
| Used by | [[SOAR-FEATURE-AUTH-SESSION]] |
| UI related | [[SOAR-PAGE-LOGIN]], [[SOAR-PAGE-REGISTER]] |
| API related |  |
| Database related |  |
| Tests related | [[SOAR-TEST-WEB-AUTH-PUBLIC]] |
| Docs related | [[SOAR-DOC-WEB-AUTH]] |
| Agent related |  |
| Notes | Public entrypoint included in auth/public surface mapping. |

## Relations

- links_to -> [[SOAR-PAGE-LOGIN]] (verified_local)
- links_to -> [[SOAR-PAGE-REGISTER]] (verified_local)
- has_entrypoint <- [[SOAR-FEATURE-AUTH-SESSION]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
