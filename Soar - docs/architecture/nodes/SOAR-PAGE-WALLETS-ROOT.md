---
id: SOAR-PAGE-WALLETS-ROOT
name: "Wallets root redirect"
type: page
status: verified_local
layer: frontend
module: web-wallets
feature: wallets
risk_level: medium
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, page, frontend, verified_local]
---

# Wallets root redirect

| Field | Value |
| --- | --- |
| Description | Dashboard wallets root route redirecting to the canonical wallet list. |
| File path | apps/web/src/app/dashboard/wallets/page.tsx |
| Related files | apps/web/src/app/dashboard/wallets/list/page.tsx |
| Parent | [[SOAR-FEATURE-WALLETS]] |
| Children |  |
| Depends on | [[SOAR-PAGE-WALLETS-LIST]] |
| Used by | [[SOAR-FEATURE-WALLETS]] |
| UI related | [[SOAR-PAGE-WALLETS-LIST]] |
| API related |  |
| Database related |  |
| Tests related | [[SOAR-TEST-WALLETS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-WALLETS]] |
| Agent related |  |
| Notes | Canonical route normalization node. |

## Relations

- redirects_to -> [[SOAR-PAGE-WALLETS-LIST]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
