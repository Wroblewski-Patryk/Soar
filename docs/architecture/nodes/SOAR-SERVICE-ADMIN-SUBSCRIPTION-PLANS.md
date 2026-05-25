---
id: SOAR-SERVICE-ADMIN-SUBSCRIPTION-PLANS
name: "Admin subscription plans service"
type: service
status: verified_local
layer: backend
module: api-admin
feature: subscriptions-admin
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Admin subscription plans service

| Field | Value |
| --- | --- |
| Description | Admin subscription catalog read/update service with bootstrap consistency. |
| File path | apps/api/src/modules/admin/subscriptionPlans/subscriptionPlans.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-SUBSCRIPTIONS]], [[SOAR-DB-SUBSCRIPTION-PLAN]] |
| Used by | [[SOAR-CONTROLLER-ADMIN-SUBSCRIPTION-PLANS]] |
| UI related |  |
| API related | [[SOAR-API-ADMIN-SUBSCRIPTION-PLANS-LIST]], [[SOAR-API-ADMIN-SUBSCRIPTION-PLAN-UPDATE]] |
| Database related | [[SOAR-DB-SUBSCRIPTION-PLAN]] |
| Tests related | [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-API]] |
| Docs related | [[SOAR-DOC-API-ADMIN]] |
| Agent related |  |
| Notes | Service owns admin catalog mutation truth. |

## Relations

- uses -> [[SOAR-SERVICE-SUBSCRIPTIONS]] (verified_local)
- reads_writes -> [[SOAR-DB-SUBSCRIPTION-PLAN]] (verified_local)
- calls <- [[SOAR-CONTROLLER-ADMIN-SUBSCRIPTION-PLANS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
