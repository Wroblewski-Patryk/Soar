---
id: SOAR-UTIL-RUNTIME-UI-HELPERS
name: "Dashboard runtime UI helpers"
type: utility
status: verified_local
layer: frontend
module: web-dashboard-home
feature: web-runtime-surfaces
risk_level: high
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, utility, frontend, verified_local]
---

# Dashboard runtime UI helpers

| Field | Value |
| --- | --- |
| Description | Dashboard runtime UI helper utilities for status pills actions and presentation semantics. |
| File path | apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeUiHelpers.tsx |
| Related files | apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeUiHelpers.test.ts |
| Parent | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| Children |  |
| Depends on | [[SOAR-UTIL-RUNTIME-FORMATTERS]] |
| Used by | [[SOAR-COMP-RUNTIME-ONBOARDING-SECTION]], [[SOAR-COMP-RUNTIME-SIGNALS-SECTION]] |
| UI related | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related |  |
| Tests related | [[SOAR-TEST-DASHBOARD-RUNTIME-HELPERS]] |
| Docs related | [[SOAR-DOC-WEB-DASHBOARD-HOME]] |
| Agent related |  |
| Notes | Runtime UI helper utility. |

## Relations

- uses <- [[SOAR-COMP-RUNTIME-SIGNALS-SECTION]] (verified_local)
- uses <- [[SOAR-COMP-RUNTIME-ONBOARDING-SECTION]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
