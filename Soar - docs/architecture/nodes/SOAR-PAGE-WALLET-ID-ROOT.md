---
id: SOAR-PAGE-WALLET-ID-ROOT
name: "Wallet detail redirect"
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

# Wallet detail redirect

| Field | Value |
| --- | --- |
| Description | Dashboard wallet id route redirecting to the canonical edit route. |
| File path | apps/web/src/app/dashboard/wallets/[id]/page.tsx |
| Related files | apps/web/src/app/dashboard/wallets/[id]/edit/page.tsx |
| Parent | [[SOAR-FEATURE-WALLETS]] |
| Children |  |
| Depends on | [[SOAR-PAGE-WALLET-EDIT]] |
| Used by | [[SOAR-FEATURE-WALLETS]] |
| UI related | [[SOAR-PAGE-WALLET-EDIT]] |
| API related |  |
| Database related |  |
| Tests related | [[SOAR-TEST-WALLETS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-WALLETS]] |
| Agent related |  |
| Notes | Canonical route normalization node. |

## Relations

- redirects_to -> [[SOAR-PAGE-WALLET-EDIT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
