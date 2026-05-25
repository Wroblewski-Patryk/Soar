---
id: SOAR-TEST-WEB-RESIDUAL-SURFACES
name: "Web residual surface tests"
type: test
status: verified_local
layer: testing
module: web
feature: web-residual-surfaces
risk_level: high
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Web residual surface tests

| Field | Value |
| --- | --- |
| Description | Aggregate Web residual tests for bot alias pages offline page bots monitoring aggregate icons shared components and i18n/lib utilities. |
| File path | apps/web/src/app/dashboard/bots/new/page.test.tsx |
| Related files | apps/web/src/app/dashboard/bots/[id]/page.test.tsx, apps/web/src/app/offline/page.test.tsx, apps/web/src/features/bots/services/botsMonitoringAggregate.service.test.ts, apps/web/src/features/bots/utils/runtimeSignalLabelKeys.test.ts, apps/web/src/features/bots/utils/runtimeSurfaceTruth.test.ts, apps/web/src/features/bots/utils/trailingStopDisplay.test.ts, apps/web/src/features/shared/dcaLadderCell.test.tsx, apps/web/src/features/shared/runtimeMonitoringFormatters.test.ts, apps/web/src/i18n/guardrails.test.ts, apps/web/src/i18n/I18nProvider.route-loading.test.tsx, apps/web/src/i18n/I18nProvider.test.tsx, apps/web/src/i18n/namespaceRegistry.test.ts, apps/web/src/i18n/routeLocaleSmoke.test.ts, apps/web/src/i18n/translations.test.ts, apps/web/src/i18n/useLocaleFormatting.test.tsx, apps/web/src/i18n/useOptionalI18n.test.tsx, apps/web/src/lib/api.test.ts, apps/web/src/lib/async.test.ts, apps/web/src/lib/errorResolver.test.ts, apps/web/src/lib/navigation.test.ts, apps/web/src/lib/numericInput.test.ts, apps/web/src/lib/publicApiBaseUrl.test.ts, apps/web/src/ui/components/AssetSymbol.test.tsx, apps/web/src/ui/components/data-table/useDataTableColumnVisibilityState.test.ts, apps/web/src/ui/components/DataTable.test.tsx, apps/web/src/ui/components/StatusBadge.test.tsx |
| Parent | [[SOAR-FEATURE-WEB-RESIDUAL-SURFACES]] |
| Children |  |
| Depends on | [[SOAR-PAGE-BOT-NEW-ALIAS]], [[SOAR-PAGE-BOT-DETAIL-ALIAS]], [[SOAR-PAGE-OFFLINE]], [[SOAR-SERVICE-BOTS-MONITORING-AGGREGATE]], [[SOAR-SERVICE-WEB-ICONS]], [[SOAR-HOOK-COIN-ICON-LOOKUP]], [[SOAR-COMP-SORTABLE-THRESHOLD-LIST-EDITOR]] |
| Used by | [[SOAR-FEATURE-WEB-RESIDUAL-SURFACES]] |
| UI related | [[SOAR-PAGE-BOTS-LIST]], [[SOAR-PAGE-BOT-RUNTIME]], [[SOAR-PAGE-OFFLINE]] |
| API related | [[SOAR-API-BOT-LIST]], [[SOAR-API-BOT-RUNTIME-AGGREGATE]], [[SOAR-API-ICON-LOOKUP]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-STRATEGY]] |
| Tests related | [[SOAR-TEST-WEB-RUNTIME-SURFACES]], [[SOAR-TEST-BOT-SETUP-WEB]] |
| Docs related | [[SOAR-DOC-WEB-BOTS]], [[SOAR-DOC-WEB-ICONS]], [[SOAR-DOC-WEB-SHARED]] |
| Agent related |  |
| Notes | Aggregate residual Web proof. |

## Relations

- verified_by <- [[SOAR-FEATURE-WEB-RESIDUAL-SURFACES]] (verified_local)
- verified_by <- [[SOAR-PAGE-BOT-NEW-ALIAS]] (verified_local)
- verified_by <- [[SOAR-PAGE-BOT-DETAIL-ALIAS]] (verified_local)
- verified_by <- [[SOAR-PAGE-OFFLINE]] (verified_local)
- verified_by <- [[SOAR-SERVICE-BOTS-MONITORING-AGGREGATE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
