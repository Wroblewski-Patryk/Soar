# Architecture Awareness Report

Generated: 2026-06-04T17:00:33.358Z
Project: Soar
Root: C:/Personal/Projekty/Aplikacje/Soar

## Counts By Type

| Type | Count |
| --- | ---: |
| agent | 52 |
| api_endpoint | 37 |
| component | 97 |
| document | 3450 |
| feature | 221 |
| function | 8239 |
| migration | 56 |
| model | 275 |
| module | 15 |
| project | 1 |
| route | 346 |
| task | 940 |
| test | 372 |

## Counts By Status

| Status | Count |
| --- | ---: |
| blocked | 19 |
| deprecated | 7 |
| implemented | 12492 |
| in_progress | 9 |
| tested | 646 |
| verified | 928 |

## Health Signals

- Raw implementation entities without inferred tests: 7681
- Actionable implementation entities without inferred tests: 940
- Raw implementation entities without inferred docs: 976
- Actionable implementation entities without inferred docs: 241
- Classified inferred-link noise: 7322
- Entities without owner attribution: 0
- Disconnected entities: 0

## Top Actionable Missing Test Links

- component: AppLogoLink.tsx (apps/web/src/ui/components/AppLogoLink.tsx)
- component: ConfirmModal.tsx (apps/web/src/ui/components/ConfirmModal.tsx)
- component: DataTable.tsx (apps/web/src/ui/components/DataTable.tsx)
- component: FooterPreferencesSwitchers.tsx (apps/web/src/ui/components/FooterPreferencesSwitchers.tsx)
- component: FormModal.tsx (apps/web/src/ui/components/FormModal.tsx)
- component: InlinePager.tsx (apps/web/src/ui/components/InlinePager.tsx)
- component: SkeletonCardBlock.tsx (apps/web/src/ui/components/loading/SkeletonCardBlock.tsx)
- component: SkeletonFormBlock.tsx (apps/web/src/ui/components/loading/SkeletonFormBlock.tsx)
- component: SkeletonKpiRow.tsx (apps/web/src/ui/components/loading/SkeletonKpiRow.tsx)
- component: SkeletonTableRows.tsx (apps/web/src/ui/components/loading/SkeletonTableRows.tsx)
- component: ProfileButton.tsx (apps/web/src/ui/components/ProfileButton.tsx)
- component: SkipToContentLink.tsx (apps/web/src/ui/components/SkipToContentLink.tsx)
- component: useAsyncConfirm.tsx (apps/web/src/ui/components/useAsyncConfirm.tsx)
- component: FormAlert.tsx (apps/web/src/ui/forms/FormAlert.tsx)
- component: FormField.tsx (apps/web/src/ui/forms/FormField.tsx)
- component: FormGrid.tsx (apps/web/src/ui/forms/FormGrid.tsx)
- component: FormMobileActionBar.tsx (apps/web/src/ui/forms/FormMobileActionBar.tsx)
- component: FormPageShell.tsx (apps/web/src/ui/forms/FormPageShell.tsx)
- component: FormSectionCard.tsx (apps/web/src/ui/forms/FormSectionCard.tsx)
- component: FormValidationSummary.tsx (apps/web/src/ui/forms/FormValidationSummary.tsx)
- component: Footer.tsx (apps/web/src/ui/layout/dashboard/Footer.tsx)
- component: Header.tsx (apps/web/src/ui/layout/dashboard/Header.tsx)
- component: PageTitle.tsx (apps/web/src/ui/layout/dashboard/PageTitle.tsx)
- component: Footer.tsx (apps/web/src/ui/layout/public/Footer.tsx)
- component: Header.tsx (apps/web/src/ui/layout/public/Header.tsx)
- feature: strategyThresholdItems.ts (apps/web/src/features/strategies/utils/strategyThresholdItems.ts)
- feature: api.ts (apps/web/src/lib/api.ts)
- feature: cloneNaming.ts (apps/web/src/lib/cloneNaming.ts)
- feature: forms.ts (apps/web/src/lib/forms.ts)
- feature: getAxiosMessage.ts (apps/web/src/lib/getAxiosMessage.ts)
- feature: handleError.ts (apps/web/src/lib/handleError.ts)
- feature: marketStream.ts (apps/web/src/lib/marketStream.ts)
- feature: storage.ts (apps/web/src/lib/storage.ts)
- feature: symbols.ts (apps/web/src/lib/symbols.ts)
- feature: text.ts (apps/web/src/lib/text.ts)
- feature: time.ts (apps/web/src/lib/time.ts)
- feature: themeBootstrap.ts (apps/web/src/security/themeBootstrap.ts)
- feature: tabContentFrame.ts (apps/web/src/ui/components/tabContentFrame.ts)
- feature: useDetailsDropdown.ts (apps/web/src/ui/hooks/useDetailsDropdown.ts)
- feature: dashboardRoutes.ts (apps/web/src/ui/layout/dashboard/dashboardRoutes.ts)

## Top Actionable Missing Doc Links

- component: I18nProvider.tsx (apps/web/src/i18n/I18nProvider.tsx)
- component: AppLogoLink.tsx (apps/web/src/ui/components/AppLogoLink.tsx)
- component: AssetSymbol.tsx (apps/web/src/ui/components/AssetSymbol.tsx)
- component: ConfirmModal.tsx (apps/web/src/ui/components/ConfirmModal.tsx)
- component: DataTable.tsx (apps/web/src/ui/components/DataTable.tsx)
- component: FooterPreferencesSwitchers.tsx (apps/web/src/ui/components/FooterPreferencesSwitchers.tsx)
- component: FormModal.tsx (apps/web/src/ui/components/FormModal.tsx)
- component: InlinePager.tsx (apps/web/src/ui/components/InlinePager.tsx)
- component: SkeletonCardBlock.tsx (apps/web/src/ui/components/loading/SkeletonCardBlock.tsx)
- component: SkeletonFormBlock.tsx (apps/web/src/ui/components/loading/SkeletonFormBlock.tsx)
- component: SkeletonKpiRow.tsx (apps/web/src/ui/components/loading/SkeletonKpiRow.tsx)
- component: SkeletonTableRows.tsx (apps/web/src/ui/components/loading/SkeletonTableRows.tsx)
- component: ProfileButton.tsx (apps/web/src/ui/components/ProfileButton.tsx)
- component: SkipToContentLink.tsx (apps/web/src/ui/components/SkipToContentLink.tsx)
- component: StatusBadge.tsx (apps/web/src/ui/components/StatusBadge.tsx)
- component: TableUi.tsx (apps/web/src/ui/components/TableUi.tsx)
- component: Tabs.tsx (apps/web/src/ui/components/Tabs.tsx)
- component: ThemeSwitch.tsx (apps/web/src/ui/components/ThemeSwitch.tsx)
- component: useAsyncConfirm.tsx (apps/web/src/ui/components/useAsyncConfirm.tsx)
- component: ViewState.tsx (apps/web/src/ui/components/ViewState.tsx)
- component: FormAlert.tsx (apps/web/src/ui/forms/FormAlert.tsx)
- component: FormField.tsx (apps/web/src/ui/forms/FormField.tsx)
- component: FormFields.tsx (apps/web/src/ui/forms/FormFields.tsx)
- component: FormGrid.tsx (apps/web/src/ui/forms/FormGrid.tsx)
- component: FormMobileActionBar.tsx (apps/web/src/ui/forms/FormMobileActionBar.tsx)
- component: FormPageShell.tsx (apps/web/src/ui/forms/FormPageShell.tsx)
- component: FormSectionCard.tsx (apps/web/src/ui/forms/FormSectionCard.tsx)
- component: FormValidationSummary.tsx (apps/web/src/ui/forms/FormValidationSummary.tsx)
- component: DashboardRouteProgress.tsx (apps/web/src/ui/layout/dashboard/DashboardRouteProgress.tsx)
- component: Footer.tsx (apps/web/src/ui/layout/dashboard/Footer.tsx)
- component: Header.tsx (apps/web/src/ui/layout/dashboard/Header.tsx)
- component: IsometricModeToggle.tsx (apps/web/src/ui/layout/dashboard/IsometricModeToggle.tsx)
- component: LanguageSwitcher.tsx (apps/web/src/ui/layout/dashboard/LanguageSwitcher.tsx)
- component: PageTitle.tsx (apps/web/src/ui/layout/dashboard/PageTitle.tsx)
- component: RiskNoticeFooter.tsx (apps/web/src/ui/layout/dashboard/RiskNoticeFooter.tsx)
- component: SafetyBar.tsx (apps/web/src/ui/layout/dashboard/SafetyBar.tsx)
- component: Footer.tsx (apps/web/src/ui/layout/public/Footer.tsx)
- component: Header.tsx (apps/web/src/ui/layout/public/Header.tsx)
- component: ServiceWorkerRegistration.tsx (apps/web/src/ui/pwa/ServiceWorkerRegistration.tsx)
- feature: runtimeOpenPositionDerivations.ts (apps/web/src/features/bots/utils/runtimeOpenPositionDerivations.ts)

## Classified Inferred-Link Noise

- config_only_file: 65
- curated_graph_covered: 1481
- generated_vendor_docs_vault_plugin: 5775
- top_level_app_mount: 1

## Top Classified Noise Samples

- top_level_app_mount: api_endpoint: USE /avatars (apps/api/src/index.ts#/avatars)
- curated_graph_covered: api_endpoint: POST /login (apps/api/src/modules/auth/auth.routes.ts#/login)
- curated_graph_covered: api_endpoint: POST /logout (apps/api/src/modules/auth/auth.routes.ts#/logout)
- curated_graph_covered: api_endpoint: GET /me (apps/api/src/modules/auth/auth.routes.ts#/me)
- curated_graph_covered: api_endpoint: POST /register (apps/api/src/modules/auth/auth.routes.ts#/register)
- curated_graph_covered: api_endpoint: GET / (apps/api/src/router/admin.routes.ts#/)
- curated_graph_covered: api_endpoint: USE /subscriptions/plans (apps/api/src/router/admin.routes.ts#/subscriptions/plans)
- curated_graph_covered: api_endpoint: USE /users (apps/api/src/router/admin.routes.ts#/users)
- curated_graph_covered: api_endpoint: GET / (apps/api/src/router/dashboard.routes.ts#/)
- curated_graph_covered: api_endpoint: USE /backtests (apps/api/src/router/dashboard.routes.ts#/backtests)
- curated_graph_covered: api_endpoint: USE /bots (apps/api/src/router/dashboard.routes.ts#/bots)
- curated_graph_covered: api_endpoint: USE /icons (apps/api/src/router/dashboard.routes.ts#/icons)
- curated_graph_covered: api_endpoint: USE /logs (apps/api/src/router/dashboard.routes.ts#/logs)
- curated_graph_covered: api_endpoint: USE /market-stream (apps/api/src/router/dashboard.routes.ts#/market-stream)
- curated_graph_covered: api_endpoint: USE /markets (apps/api/src/router/dashboard.routes.ts#/markets)
- curated_graph_covered: api_endpoint: USE /orders (apps/api/src/router/dashboard.routes.ts#/orders)
- curated_graph_covered: api_endpoint: USE /positions (apps/api/src/router/dashboard.routes.ts#/positions)
- curated_graph_covered: api_endpoint: USE /profile/apiKeys (apps/api/src/router/dashboard.routes.ts#/profile/apiKeys)
- curated_graph_covered: api_endpoint: USE /profile/basic (apps/api/src/router/dashboard.routes.ts#/profile/basic)
- curated_graph_covered: api_endpoint: USE /profile/security (apps/api/src/router/dashboard.routes.ts#/profile/security)
- curated_graph_covered: api_endpoint: USE /profile/subscription (apps/api/src/router/dashboard.routes.ts#/profile/subscription)
- curated_graph_covered: api_endpoint: USE /reports (apps/api/src/router/dashboard.routes.ts#/reports)
- curated_graph_covered: api_endpoint: USE /strategies (apps/api/src/router/dashboard.routes.ts#/strategies)
- curated_graph_covered: api_endpoint: USE /wallets (apps/api/src/router/dashboard.routes.ts#/wallets)
- curated_graph_covered: api_endpoint: GET / (apps/api/src/router/index.ts#/)
- curated_graph_covered: api_endpoint: USE /admin (apps/api/src/router/index.ts#/admin)
- curated_graph_covered: api_endpoint: USE /auth (apps/api/src/router/index.ts#/auth)
- curated_graph_covered: api_endpoint: USE /dashboard (apps/api/src/router/index.ts#/dashboard)
- curated_graph_covered: api_endpoint: GET /health (apps/api/src/router/index.ts#/health)
- curated_graph_covered: api_endpoint: GET /metrics (apps/api/src/router/index.ts#/metrics)
- curated_graph_covered: api_endpoint: GET /ready (apps/api/src/router/index.ts#/ready)
- curated_graph_covered: api_endpoint: GET /ready/details (apps/api/src/router/index.ts#/ready/details)
- curated_graph_covered: api_endpoint: USE /upload (apps/api/src/router/index.ts#/upload)
- curated_graph_covered: api_endpoint: GET /workers/health (apps/api/src/router/index.ts#/workers/health)
- curated_graph_covered: api_endpoint: GET /workers/ready (apps/api/src/router/index.ts#/workers/ready)
- curated_graph_covered: api_endpoint: GET /workers/runtime-freshness (apps/api/src/router/index.ts#/workers/runtime-freshness)
- curated_graph_covered: component: PasswordVisibilityToggle.tsx (apps/web/src/features/auth/components/PasswordVisibilityToggle.tsx)
- curated_graph_covered: component: backtestRunDetailsCharts.tsx (apps/web/src/features/backtest/components/backtestRunDetailsCharts.tsx)
- curated_graph_covered: component: BacktestRunDetailsTabPanels.tsx (apps/web/src/features/backtest/components/BacktestRunDetailsTabPanels.tsx)
- curated_graph_covered: component: BacktestRunHeaderSection.tsx (apps/web/src/features/backtest/components/BacktestRunHeaderSection.tsx)

## Notes

- This is an inferred baseline. CTO/Docs Memory must promote or correct important relations.
- Curated graph coverage input: `C:/Personal/Projekty/Aplikacje/Soar/docs/graphs/architecture-graph.json` (covered paths: 954).
- Override input: `C:/Personal/Projekty/Aplikacje/Soar/docs/architecture/scanner-overrides.json` (entity entries: 0, relation entries: 0).
- Override summary: excluded files 0, entity overrides 0, relation overrides 0, critical entities tagged 0.
- `verified` still requires fresh command/browser/deploy evidence, not only file presence.