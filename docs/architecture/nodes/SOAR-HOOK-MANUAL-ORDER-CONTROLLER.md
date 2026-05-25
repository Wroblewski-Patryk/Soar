---
id: SOAR-HOOK-MANUAL-ORDER-CONTROLLER
name: "useManualOrderController"
type: hook
status: verified
layer: frontend
module: web-dashboard-home
feature: manual-order
risk_level: high
completion_percent: 100
last_verified_at: 2026-05-23
verification_status: verified
tags: [soar-map, hook, frontend, verified]
---

# useManualOrderController

| Field | Value |
| --- | --- |
| Description | Controller hook for manual order context state confirmation and submission. |
| File path | apps/web/src/features/dashboard-home/hooks/useManualOrderController.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-MANUAL-ORDER]] |
| Children |  |
| Depends on | [[SOAR-API-MANUAL-CONTEXT]], [[SOAR-API-ORDER-OPEN]] |
| Used by | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| UI related | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| API related | [[SOAR-API-MANUAL-CONTEXT]], [[SOAR-API-ORDER-OPEN]] |
| Database related |  |
| Tests related | [[SOAR-TEST-MANUAL-ORDER]] |
| Docs related | [[SOAR-DOC-WEB-DASHBOARD-HOME]] |
| Agent related |  |
| Notes | Risk acknowledgement paths require explicit confirmation. |

## Relations

- calls -> [[SOAR-API-MANUAL-CONTEXT]] (verified)
- calls -> [[SOAR-API-ORDER-OPEN]] (verified)
- uses <- [[SOAR-COMP-HOME-LIVE-WIDGETS]] (verified)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
