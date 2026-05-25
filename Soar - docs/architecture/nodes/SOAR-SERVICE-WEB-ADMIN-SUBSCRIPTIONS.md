---
id: SOAR-SERVICE-WEB-ADMIN-SUBSCRIPTIONS
name: "Web admin subscription plans service"
type: service
status: verified_local
layer: frontend
module: web-admin
feature: subscriptions-admin
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, frontend, verified_local]
---

# Web admin subscription plans service

| Field | Value |
| --- | --- |
| Description | Typed frontend API service for admin subscription plan list and update calls. |
| File path | apps/web/src/features/admin/subscriptions/services/adminSubscriptionPlan.service.ts |
| Related files | apps/web/src/features/admin/subscriptions/types/adminSubscriptionPlan.type.ts |
| Parent | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| Children |  |
| Depends on | [[SOAR-API-ADMIN-SUBSCRIPTION-PLANS-LIST]], [[SOAR-API-ADMIN-SUBSCRIPTION-PLAN-UPDATE]] |
| Used by | [[SOAR-COMP-ADMIN-SUBSCRIPTIONS-PAGE]] |
| UI related | [[SOAR-COMP-ADMIN-SUBSCRIPTIONS-PAGE]] |
| API related | [[SOAR-API-ADMIN-SUBSCRIPTION-PLANS-LIST]], [[SOAR-API-ADMIN-SUBSCRIPTION-PLAN-UPDATE]] |
| Database related | [[SOAR-DB-SUBSCRIPTION-PLAN]] |
| Tests related | [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-WEB]] |
| Docs related | [[SOAR-DOC-WEB-ADMIN]] |
| Agent related |  |
| Notes | Frontend-to-admin-subscription API contract node. |

## Relations

- calls -> [[SOAR-API-ADMIN-SUBSCRIPTION-PLANS-LIST]] (verified_local)
- calls -> [[SOAR-API-ADMIN-SUBSCRIPTION-PLAN-UPDATE]] (verified_local)
- calls <- [[SOAR-COMP-ADMIN-SUBSCRIPTIONS-PAGE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
