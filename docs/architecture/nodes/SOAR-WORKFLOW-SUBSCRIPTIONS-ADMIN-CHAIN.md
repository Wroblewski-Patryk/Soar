---
id: SOAR-WORKFLOW-SUBSCRIPTIONS-ADMIN-CHAIN
name: "Subscriptions Admin workflow"
type: workflow
status: verified_local
layer: fullstack
module: subscriptions
feature: subscriptions-admin
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, workflow, fullstack, verified_local]
---

# Subscriptions Admin workflow

| Field | Value |
| --- | --- |
| Description | Workflow from admin/profile subscription UI through Web services API routes controllers schemas services entitlements checkout DB tests and docs. |
| File path | docs/architecture/chains/chains.csv |
| Related files | docs/architecture/chains/CHAIN-SUBSCRIPTIONS-ADMIN.md |
| Parent | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| Children |  |
| Depends on | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| Used by | [[SOAR-AGENT-COORDINATOR]] |
| UI related | [[SOAR-PAGE-ADMIN-SUBSCRIPTIONS]], [[SOAR-PAGE-ADMIN-USERS]], [[SOAR-COMP-PROFILE-SUBSCRIPTION]] |
| API related | [[SOAR-API-ADMIN-USERS-LIST]], [[SOAR-API-ADMIN-USERS-UPDATE]], [[SOAR-API-ADMIN-SUBSCRIPTION-PLANS-LIST]], [[SOAR-API-ADMIN-SUBSCRIPTION-PLAN-UPDATE]], [[SOAR-API-PROFILE-SUBSCRIPTION-GET]], [[SOAR-API-PROFILE-SUBSCRIPTION-CHECKOUT]] |
| Database related | [[SOAR-DB-SUBSCRIPTION-PLAN]], [[SOAR-DB-USER-SUBSCRIPTION]], [[SOAR-DB-PAYMENT-INTENT]], [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-API]], [[SOAR-TEST-SUBSCRIPTIONS-ENTITLEMENTS]], [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-WEB]] |
| Docs related | [[SOAR-DOC-API-ADMIN]], [[SOAR-DOC-API-SUBSCRIPTIONS]], [[SOAR-DOC-WEB-ADMIN]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Backfill workflow node for Subscriptions/Admin slice. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
