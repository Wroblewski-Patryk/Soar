---
id: SOAR-TEST-WEB-AUTH-PUBLIC
name: "Web public auth route tests"
type: test
status: verified_local
layer: testing
module: web-auth
feature: auth-session
risk_level: medium
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Web public auth route tests

| Field | Value |
| --- | --- |
| Description | Public auth route cache and landing behavior tests. |
| File path | apps/web/src/app/(public)/auth/authPageCacheContract.test.ts |
| Related files | apps/web/src/app/(public)/page.tsx |
| Parent | [[SOAR-FEATURE-AUTH-SESSION]] |
| Children |  |
| Depends on | [[SOAR-PAGE-PUBLIC-HOME]], [[SOAR-PAGE-LOGIN]], [[SOAR-PAGE-REGISTER]] |
| Used by | [[SOAR-FEATURE-AUTH-SESSION]] |
| UI related | [[SOAR-PAGE-PUBLIC-HOME]] |
| API related |  |
| Database related |  |
| Tests related | [[SOAR-TEST-AUTH-SESSION]] |
| Docs related | [[SOAR-DOC-WEB-AUTH]] |
| Agent related |  |
| Notes | Public route proof. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
