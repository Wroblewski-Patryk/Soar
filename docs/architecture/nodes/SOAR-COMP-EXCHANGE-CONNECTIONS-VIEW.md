---
id: SOAR-COMP-EXCHANGE-CONNECTIONS-VIEW
name: "ExchangeConnectionsView"
type: component
status: verified_local
layer: frontend
module: web-exchanges
feature: exchange-adapter
risk_level: high
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, component, frontend, verified_local]
---

# ExchangeConnectionsView

| Field | Value |
| --- | --- |
| Description | Exchange connections view for operator exchange capability and connection visibility. |
| File path | apps/web/src/features/exchanges/components/ExchangeConnectionsView.tsx |
| Related files | apps/web/src/features/exchanges/components/ExchangeConnectionsView.test.tsx |
| Parent | [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Children |  |
| Depends on | [[SOAR-UTIL-WEB-EXCHANGE-CAPABILITIES]] |
| Used by | [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| UI related | [[SOAR-PAGE-PROFILE]] |
| API related | [[SOAR-SERVICE-EXCHANGE-CAPABILITIES]] |
| Database related |  |
| Tests related | [[SOAR-TEST-WEB-EXCHANGE-CONNECTIONS]] |
| Docs related | [[SOAR-DOC-WEB-EXCHANGES]] |
| Agent related |  |
| Notes | Web exchange connection surface. |

## Relations

- uses -> [[SOAR-UTIL-WEB-EXCHANGE-CAPABILITIES]] (verified_local)
- verified_by -> [[SOAR-TEST-WEB-EXCHANGE-CONNECTIONS]] (verified_local)
- has_ui <- [[SOAR-FEATURE-EXCHANGE-ADAPTER]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
