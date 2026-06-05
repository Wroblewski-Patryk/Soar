---
id: SOAR-TEST-SHARED-UI-PRIMITIVES
name: "Shared UI primitives tests"
type: test
status: verified_local
layer: testing
module: web-shared
feature: web-residual-surfaces
risk_level: medium
completion_percent: 85
last_verified_at: 2026-06-05
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Shared UI primitives tests

| Field | Value |
| --- | --- |
| Description | Shared UI primitive regression tests for logo link modals pager skeleton loading blocks skip link and async confirm behavior. |
| File path | apps/web/src/ui/components/SharedUiPrimitives.test.tsx |
| Related files | apps/web/src/ui/components/AppLogoLink.tsx, apps/web/src/ui/components/ConfirmModal.tsx, apps/web/src/ui/components/FormModal.tsx, apps/web/src/ui/components/InlinePager.tsx, apps/web/src/ui/components/SkipToContentLink.tsx, apps/web/src/ui/components/useAsyncConfirm.tsx, apps/web/src/ui/components/loading/SkeletonCardBlock.tsx, apps/web/src/ui/components/loading/SkeletonFormBlock.tsx, apps/web/src/ui/components/loading/SkeletonKpiRow.tsx, apps/web/src/ui/components/loading/SkeletonTableRows.tsx |
| Parent | [[SOAR-FEATURE-WEB-RESIDUAL-SURFACES]] |
| Children |  |
| Depends on | [[SOAR-DOC-WEB-SHARED]] |
| Used by | [[SOAR-TEST-WEB-RESIDUAL-SURFACES]] |
| UI related | [[SOAR-PAGE-DASHBOARD]] |
| API related |  |
| Database related |  |
| Tests related | [[SOAR-TEST-WEB-RESIDUAL-SURFACES]] |
| Docs related | [[SOAR-DOC-WEB-SHARED]] |
| Agent related |  |
| Notes | Mapped during LUC-2107 graph drift closure; source files pre-existed this task. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
