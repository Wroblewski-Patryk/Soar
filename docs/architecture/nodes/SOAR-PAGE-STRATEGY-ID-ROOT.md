---
id: SOAR-PAGE-STRATEGY-ID-ROOT
name: "Strategy detail redirect"
type: page
status: verified_local
layer: frontend
module: web-strategies
feature: strategies
risk_level: medium
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, page, frontend, verified_local]
---

# Strategy detail redirect

| Field | Value |
| --- | --- |
| Description | Strategy id root route that redirects to the canonical edit route. |
| File path | apps/web/src/app/dashboard/strategies/[id]/page.tsx |
| Related files | apps/web/src/app/dashboard/strategies/[id]/edit/page.tsx |
| Parent | [[SOAR-FEATURE-STRATEGIES]] |
| Children |  |
| Depends on | [[SOAR-PAGE-STRATEGY-EDIT]] |
| Used by | [[SOAR-FEATURE-STRATEGIES]] |
| UI related | [[SOAR-PAGE-STRATEGY-EDIT]] |
| API related | [[SOAR-API-STRATEGY-GET]] |
| Database related | [[SOAR-DB-STRATEGY]] |
| Tests related | [[SOAR-TEST-STRATEGIES-WEB]] |
| Docs related | [[SOAR-DOC-WEB-STRATEGIES]] |
| Agent related |  |
| Notes | Redirect keeps canonical route stable. |

## Relations

- redirects_to -> [[SOAR-PAGE-STRATEGY-EDIT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
