---
id: SOAR-COMP-RUNTIME-ONBOARDING-SECTION
name: "RuntimeOnboardingSection"
type: component
status: verified_local
layer: frontend
module: web-dashboard-home
feature: web-runtime-surfaces
risk_level: high
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, component, frontend, verified_local]
---

# RuntimeOnboardingSection

| Field | Value |
| --- | --- |
| Description | Dashboard runtime onboarding section and configuration for missing setup states. |
| File path | apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeOnboardingSection.tsx |
| Related files | apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeOnboardingConfig.tsx |
| Parent | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| Children |  |
| Depends on | [[SOAR-UTIL-RUNTIME-UI-HELPERS]] |
| Used by | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| UI related | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-WALLET]] |
| Tests related | [[SOAR-TEST-DASHBOARD-RUNTIME-HELPERS]] |
| Docs related | [[SOAR-DOC-WEB-DASHBOARD-HOME]] |
| Agent related |  |
| Notes | Onboarding surface for runtime setup gaps. |

## Relations

- uses -> [[SOAR-UTIL-RUNTIME-UI-HELPERS]] (verified_local)
- composes <- [[SOAR-COMP-HOME-LIVE-WIDGETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
