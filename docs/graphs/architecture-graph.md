# Architecture Graph

Generated: 2026-07-22T23:46:54.137Z

## Canonical Exports

- `architecture-awareness.json`
- `architecture-awareness.csv`
- `architecture-graph.mmd`
- `../status/architecture-awareness-report.md`

## Entity Index

| Type | Status | Name | Path | Owner |
| --- | --- | --- | --- | --- |
| agent | implemented | Agent Checklists | .agents/checklists/README.md | Engineering Delivery Lead |
| agent | implemented | Anti-Regression System | .agents/core/anti-regression.md | Engineering Delivery Lead |
| agent | implemented | Execution Loop | .agents/core/execution-loop.md | Engineering Delivery Lead |
| agent | implemented | Mission Control | .agents/core/mission-control.md | Engineering Delivery Lead |
| agent | implemented | Agent Operating System | .agents/core/operating-system.md | Engineering Delivery Lead |
| agent | implemented | Product Delivery System | .agents/core/product-delivery-system.md | Engineering Delivery Lead |
| agent | implemented | Product Intake And Decision Handshake | .agents/core/product-intake-and-decision-handshake.md | Engineering Delivery Lead |
| agent | implemented | Project Memory Index | .agents/core/project-memory-index.md | Engineering Delivery Lead |
| agent | implemented | Quality Gates | .agents/core/quality-gates.md | Engineering Delivery Lead |
| agent | implemented | Requirements Verification System | .agents/core/requirements-verification-system.md | Engineering Delivery Lead |
| agent | implemented | backend-builder | .agents/prompts/backend-builder.md | Engineering Delivery Lead |
| agent | implemented | code-reviewer | .agents/prompts/code-reviewer.md | Engineering Delivery Lead |
| agent | implemented | db-migrations | .agents/prompts/db-migrations.md | Engineering Delivery Lead |
| agent | implemented | frontend-builder | .agents/prompts/frontend-builder.md | Engineering Delivery Lead |
| agent | implemented | ops-release | .agents/prompts/ops-release.md | Engineering Delivery Lead |
| agent | implemented | planner | .agents/prompts/planner.md | Engineering Delivery Lead |
| agent | implemented | product-docs | .agents/prompts/product-docs.md | Engineering Delivery Lead |
| agent | implemented | qa-test | .agents/prompts/qa-test.md | Engineering Delivery Lead |
| agent | implemented | security-auditor | .agents/prompts/security-auditor.md | Engineering Delivery Lead |
| agent | implemented | Agent Reports | .agents/reports/README.md | Engineering Delivery Lead |
| agent | implemented | Procedure | .agents/skills/_templates/SKILL.template.md | Engineering Delivery Lead |
| agent | implemented | Adopt Template Into Existing Project | .agents/skills/adopt_template_into_existing_project/SKILL.md | Engineering Delivery Lead |
| agent | implemented | Procedure | .agents/skills/build_worker_job_pipeline/SKILL.md | Engineering Delivery Lead |
| agent | implemented | Capture Agent Learnings | .agents/skills/capture-agent-learnings/SKILL.md | Engineering Delivery Lead |
| agent | implemented | Procedure | .agents/skills/implement_exchange_api_key_flow/SKILL.md | Engineering Delivery Lead |
| agent | implemented | Skills Index | .agents/skills/README.md | Engineering Delivery Lead |
| agent | implemented | Procedure | .agents/skills/run_release_gate_checks/SKILL.md | Engineering Delivery Lead |
| agent | implemented | Procedure | .agents/skills/scaffold_api_module/SKILL.md | Engineering Delivery Lead |
| agent | implemented | Procedure | .agents/skills/ship_dashboard_feature_slice/SKILL.md | Engineering Delivery Lead |
| agent | implemented | 2026-07-02 LUC-6750 Gap Register And Repair Lane Refresh | .agents/state/active-mission.md | Engineering Delivery Lead |
| agent | implemented | Agent Process Evals | .agents/state/agent-evals.md | Engineering Delivery Lead |
| agent | implemented | Current Focus | .agents/state/current-focus.md | Engineering Delivery Lead |
| agent | implemented | Decision Register | .agents/state/decision-register.md | Engineering Delivery Lead |
| agent | implemented | Delivery Map | .agents/state/delivery-map.md | Engineering Delivery Lead |
| agent | implemented | Known Issues | .agents/state/known-issues.md | Engineering Delivery Lead |
| agent | implemented | 2026-06-28 LUC-5862 App-Completion Browser Review Triage | .agents/state/module-confidence-ledger.md | Engineering Delivery Lead |
| agent | implemented | 2026-06-29 LUC-6102 Production Watch Closure | .agents/state/next-steps.md | Engineering Delivery Lead |
| agent | implemented | Quality Attribute Scenarios | .agents/state/quality-attribute-scenarios.md | Engineering Delivery Lead |
| agent | implemented | Regression Log | .agents/state/regression-log.md | Engineering Delivery Lead |
| agent | implemented | 2026-07-01 LUC-6662 Gap Register And Repair Lane Refresh | .agents/state/requirements-verification-matrix.md | Engineering Delivery Lead |
| agent | implemented | Responsibility Learning | .agents/state/responsibility-learning.md | Engineering Delivery Lead |
| agent | implemented | Risk Register | .agents/state/risk-register.md | Engineering Delivery Lead |
| agent | implemented | 2026-06-28 LUC-5809 Protected Worker Readiness | .agents/state/system-health.md | Engineering Delivery Lead |
| agent | implemented | Agent Tasks | .agents/tasks/README.md | Engineering Delivery Lead |
| agent | implemented | Agent Hierarchy | .agents/workflows/agent-hierarchy.md | Engineering Delivery Lead |
| agent | implemented | Codex Power Use Workflow | .agents/workflows/codex-power-use.md | Engineering Delivery Lead |
| agent | implemented | Documentation Governance Workflow | .agents/workflows/documentation-governance.md | Engineering Delivery Lead |
| agent | implemented | General Workspace Rules | .agents/workflows/general.md | Engineering Delivery Lead |
| agent | implemented | Responsibility Lanes | .agents/workflows/responsibility-lanes.md | Engineering Delivery Lead |
| agent | implemented | Subagent Orchestration Workflow | .agents/workflows/subagent-orchestration.md | Engineering Delivery Lead |
| agent | implemented | User Collaboration Workflow | .agents/workflows/user-collaboration.md | Engineering Delivery Lead |
| agent | implemented | World-Class Delivery Workflow | .agents/workflows/world-class-delivery.md | Engineering Delivery Lead |
| api_endpoint | implemented | USE /avatars | apps/api/src/index.ts#/avatars | Engineering Delivery Lead |
| api_endpoint | implemented | USE /webhooks/stripe | apps/api/src/index.ts#/webhooks/stripe | Engineering Delivery Lead |
| api_endpoint | implemented | POST /login | apps/api/src/modules/auth/auth.routes.ts#/login | Engineering Delivery Lead |
| api_endpoint | implemented | POST /logout | apps/api/src/modules/auth/auth.routes.ts#/logout | Engineering Delivery Lead |
| api_endpoint | implemented | GET /me | apps/api/src/modules/auth/auth.routes.ts#/me | Engineering Delivery Lead |
| api_endpoint | implemented | POST /register | apps/api/src/modules/auth/auth.routes.ts#/register | Engineering Delivery Lead |
| api_endpoint | implemented | GET / | apps/api/src/router/admin.routes.ts#/ | Engineering Delivery Lead |
| api_endpoint | implemented | USE /subscriptions/plans | apps/api/src/router/admin.routes.ts#/subscriptions/plans | Engineering Delivery Lead |
| api_endpoint | verified | USE /users | apps/api/src/router/admin.routes.ts#/users | Test Automation Engineer |
| api_endpoint | implemented | GET / | apps/api/src/router/dashboard.routes.ts#/ | Engineering Delivery Lead |
| api_endpoint | implemented | USE /backtests | apps/api/src/router/dashboard.routes.ts#/backtests | Engineering Delivery Lead |
| api_endpoint | verified | USE /bots | apps/api/src/router/dashboard.routes.ts#/bots | Test Automation Engineer |
| api_endpoint | verified | USE /icons | apps/api/src/router/dashboard.routes.ts#/icons | Test Automation Engineer |
| api_endpoint | verified | USE /logs | apps/api/src/router/dashboard.routes.ts#/logs | Test Automation Engineer |
| api_endpoint | verified | USE /market-stream | apps/api/src/router/dashboard.routes.ts#/market-stream | Test Automation Engineer |
| api_endpoint | verified | USE /markets | apps/api/src/router/dashboard.routes.ts#/markets | Test Automation Engineer |
| api_endpoint | implemented | USE /orders | apps/api/src/router/dashboard.routes.ts#/orders | Engineering Delivery Lead |
| api_endpoint | verified | USE /positions | apps/api/src/router/dashboard.routes.ts#/positions | Test Automation Engineer |
| api_endpoint | verified | USE /profile/apiKeys | apps/api/src/router/dashboard.routes.ts#/profile/apiKeys | Test Automation Engineer |
| api_endpoint | verified | USE /profile/basic | apps/api/src/router/dashboard.routes.ts#/profile/basic | Test Automation Engineer |
| api_endpoint | verified | USE /profile/security | apps/api/src/router/dashboard.routes.ts#/profile/security | Test Automation Engineer |
| api_endpoint | implemented | USE /profile/subscription | apps/api/src/router/dashboard.routes.ts#/profile/subscription | Engineering Delivery Lead |
| api_endpoint | verified | USE /reports | apps/api/src/router/dashboard.routes.ts#/reports | Test Automation Engineer |
| api_endpoint | verified | USE /strategies | apps/api/src/router/dashboard.routes.ts#/strategies | Test Automation Engineer |
| api_endpoint | verified | USE /wallets | apps/api/src/router/dashboard.routes.ts#/wallets | Test Automation Engineer |
| api_endpoint | implemented | GET / | apps/api/src/router/index.ts#/ | Engineering Delivery Lead |
| api_endpoint | verified | USE /admin | apps/api/src/router/index.ts#/admin | QA Regression Lead |
| api_endpoint | implemented | GET /alerts | apps/api/src/router/index.ts#/alerts | Engineering Delivery Lead |
| api_endpoint | implemented | USE /auth | apps/api/src/router/index.ts#/auth | Engineering Delivery Lead |
| api_endpoint | verified | USE /dashboard | apps/api/src/router/index.ts#/dashboard | Test Automation Engineer |
| api_endpoint | implemented | GET /health | apps/api/src/router/index.ts#/health | Engineering Delivery Lead |
| api_endpoint | implemented | GET /metrics | apps/api/src/router/index.ts#/metrics | Engineering Delivery Lead |
| api_endpoint | implemented | GET /ready | apps/api/src/router/index.ts#/ready | Engineering Delivery Lead |
| api_endpoint | implemented | GET /ready/details | apps/api/src/router/index.ts#/ready/details | Engineering Delivery Lead |
| api_endpoint | implemented | USE /upload | apps/api/src/router/index.ts#/upload | Engineering Delivery Lead |
| api_endpoint | implemented | GET /workers/health | apps/api/src/router/index.ts#/workers/health | Engineering Delivery Lead |
| api_endpoint | implemented | GET /workers/ready | apps/api/src/router/index.ts#/workers/ready | Engineering Delivery Lead |
| api_endpoint | implemented | GET /workers/runtime-freshness | apps/api/src/router/index.ts#/workers/runtime-freshness | Engineering Delivery Lead |
| component | implemented | AuthContext.tsx | apps/web/src/context/AuthContext.tsx | Engineering Delivery Lead |
| component | implemented | AdminLayoutShell.tsx | apps/web/src/features/admin/layout/AdminLayoutShell.tsx | Engineering Delivery Lead |
| component | implemented | LoginForm.tsx | apps/web/src/features/auth/components/LoginForm.tsx | Engineering Delivery Lead |
| component | implemented | PasswordVisibilityToggle.tsx | apps/web/src/features/auth/components/PasswordVisibilityToggle.tsx | Engineering Delivery Lead |
| component | implemented | RegisterForm.tsx | apps/web/src/features/auth/components/RegisterForm.tsx | Engineering Delivery Lead |
| component | implemented | BacktestCreateForm.tsx | apps/web/src/features/backtest/components/BacktestCreateForm.tsx | Engineering Delivery Lead |
| component | implemented | BacktestRunDetails.tsx | apps/web/src/features/backtest/components/BacktestRunDetails.tsx | Engineering Delivery Lead |
| component | implemented | backtestRunDetailsCharts.tsx | apps/web/src/features/backtest/components/backtestRunDetailsCharts.tsx | Engineering Delivery Lead |
| component | implemented | BacktestRunDetailsTabPanels.tsx | apps/web/src/features/backtest/components/BacktestRunDetailsTabPanels.tsx | Engineering Delivery Lead |
| component | implemented | BacktestRunHeaderSection.tsx | apps/web/src/features/backtest/components/BacktestRunHeaderSection.tsx | Engineering Delivery Lead |
| component | implemented | BacktestsList.tsx | apps/web/src/features/backtest/components/BacktestsList.tsx | Engineering Delivery Lead |
| component | implemented | BacktestsListView.tsx | apps/web/src/features/backtest/components/BacktestsListView.tsx | Engineering Delivery Lead |
| component | implemented | BacktestsRunsTable.tsx | apps/web/src/features/backtest/components/BacktestsRunsTable.tsx | Engineering Delivery Lead |
| component | implemented | BotCreateEditForm.tsx | apps/web/src/features/bots/components/BotCreateEditForm.tsx | Engineering Delivery Lead |
| component | implemented | BotsManagementTabs.tsx | apps/web/src/features/bots/components/bots-management/BotsManagementTabs.tsx | Engineering Delivery Lead |
| component | implemented | BotsMonitoringAttributionPills.tsx | apps/web/src/features/bots/components/bots-management/BotsMonitoringAttributionPills.tsx | Engineering Delivery Lead |
| component | implemented | BotsMonitoringProtectionCell.tsx | apps/web/src/features/bots/components/bots-management/BotsMonitoringProtectionCell.tsx | Engineering Delivery Lead |
| component | implemented | BotsMonitoringRuntimeStateCell.tsx | apps/web/src/features/bots/components/bots-management/BotsMonitoringRuntimeStateCell.tsx | Engineering Delivery Lead |
| component | implemented | BotsMonitoringSections.tsx | apps/web/src/features/bots/components/bots-management/BotsMonitoringSections.tsx | Engineering Delivery Lead |
| component | implemented | BotsMonitoringTab.tsx | apps/web/src/features/bots/components/bots-management/BotsMonitoringTab.tsx | Engineering Delivery Lead |
| component | implemented | BotsPortfolioHistorySection.tsx | apps/web/src/features/bots/components/bots-management/BotsPortfolioHistorySection.tsx | Engineering Delivery Lead |
| component | implemented | MonitoringFutureSignalsSection.tsx | apps/web/src/features/bots/components/bots-management/MonitoringFutureSignalsSection.tsx | Engineering Delivery Lead |
| component | implemented | BotsAssistantTab.tsx | apps/web/src/features/bots/components/BotsAssistantTab.tsx | Engineering Delivery Lead |
| component | implemented | BotsListTable.tsx | apps/web/src/features/bots/components/BotsListTable.tsx | Engineering Delivery Lead |
| component | implemented | BotsManagement.tsx | apps/web/src/features/bots/components/BotsManagement.tsx | Engineering Delivery Lead |
| component | implemented | RuntimeDataSection.tsx | apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeDataSection.tsx | Engineering Delivery Lead |
| component | implemented | runtimeDataTablePresenters.tsx | apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.tsx | Engineering Delivery Lead |
| component | implemented | runtimeOnboardingConfig.tsx | apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeOnboardingConfig.tsx | Engineering Delivery Lead |
| component | implemented | RuntimeOnboardingSection.tsx | apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeOnboardingSection.tsx | Engineering Delivery Lead |
| component | implemented | RuntimeSidebarSection.tsx | apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSidebarSection.tsx | Engineering Delivery Lead |
| component | implemented | RuntimeSignalsSection.tsx | apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.tsx | Engineering Delivery Lead |
| component | implemented | runtimeUiHelpers.tsx | apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeUiHelpers.tsx | Engineering Delivery Lead |
| component | implemented | HomeLiveWidgets.tsx | apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx | Engineering Delivery Lead |
| component | implemented | LiveMarketBar.tsx | apps/web/src/features/dashboard-home/components/LiveMarketBar.tsx | Engineering Delivery Lead |
| component | implemented | ExchangeConnectionsView.tsx | apps/web/src/features/exchanges/components/ExchangeConnectionsView.tsx | Engineering Delivery Lead |
| component | implemented | AuditTrailView.tsx | apps/web/src/features/logs/components/AuditTrailView.tsx | Engineering Delivery Lead |
| component | implemented | MarketUniverseForm.tsx | apps/web/src/features/markets/components/MarketUniverseForm.tsx | Engineering Delivery Lead |
| component | implemented | MarketUniversesTable.tsx | apps/web/src/features/markets/components/MarketUniversesTable.tsx | Engineering Delivery Lead |
| component | implemented | SearchableMultiSelect.tsx | apps/web/src/features/markets/components/SearchableMultiSelect.tsx | Engineering Delivery Lead |
| component | implemented | ApiKeyForm.tsx | apps/web/src/features/profile/components/ApiKeyForm.tsx | Engineering Delivery Lead |
| component | implemented | ApiKeysList.tsx | apps/web/src/features/profile/components/ApiKeysList.tsx | Engineering Delivery Lead |
| component | implemented | BasicForm.tsx | apps/web/src/features/profile/components/BasicForm.tsx | Engineering Delivery Lead |
| component | implemented | Security.tsx | apps/web/src/features/profile/components/Security.tsx | Engineering Delivery Lead |
| component | implemented | Subscription.tsx | apps/web/src/features/profile/components/Subscription.tsx | Engineering Delivery Lead |
| component | implemented | PerformanceReportsView.tsx | apps/web/src/features/reports/components/PerformanceReportsView.tsx | Engineering Delivery Lead |
| component | implemented | StrategiesList.tsx | apps/web/src/features/strategies/components/StrategiesList.tsx | Engineering Delivery Lead |
| component | implemented | StrategyForm.tsx | apps/web/src/features/strategies/components/StrategyForm.tsx | Engineering Delivery Lead |
| component | implemented | Additional.tsx | apps/web/src/features/strategies/components/StrategyFormSections/Additional.tsx | Engineering Delivery Lead |
| component | implemented | Basic.tsx | apps/web/src/features/strategies/components/StrategyFormSections/Basic.tsx | Engineering Delivery Lead |
| component | implemented | Close.tsx | apps/web/src/features/strategies/components/StrategyFormSections/Close.tsx | Engineering Delivery Lead |
| component | implemented | Indicators.tsx | apps/web/src/features/strategies/components/StrategyFormSections/Indicators.tsx | Engineering Delivery Lead |
| component | implemented | Open.tsx | apps/web/src/features/strategies/components/StrategyFormSections/Open.tsx | Engineering Delivery Lead |
| component | implemented | SortableThresholdListEditor.tsx | apps/web/src/features/strategies/components/StrategyFormSections/SortableThresholdListEditor.tsx | Engineering Delivery Lead |
| component | implemented | StrategyPresetPicker.tsx | apps/web/src/features/strategies/components/StrategyPresetPicker.tsx | Engineering Delivery Lead |
| component | implemented | sections.tsx | apps/web/src/features/wallets/components/wallet-create-edit-form/sections.tsx | Engineering Delivery Lead |
| component | implemented | WalletCreateEditForm.tsx | apps/web/src/features/wallets/components/WalletCreateEditForm.tsx | Engineering Delivery Lead |
| component | implemented | WalletPreviewPanel.tsx | apps/web/src/features/wallets/components/WalletPreviewPanel.tsx | Engineering Delivery Lead |
| component | implemented | WalletsListTable.tsx | apps/web/src/features/wallets/components/WalletsListTable.tsx | Engineering Delivery Lead |
| component | implemented | I18nProvider.tsx | apps/web/src/i18n/I18nProvider.tsx | Engineering Delivery Lead |
| component | implemented | AppLogoLink.tsx | apps/web/src/ui/components/AppLogoLink.tsx | Engineering Delivery Lead |
| component | implemented | AssetSymbol.tsx | apps/web/src/ui/components/AssetSymbol.tsx | Engineering Delivery Lead |
| component | implemented | ConfirmModal.tsx | apps/web/src/ui/components/ConfirmModal.tsx | Engineering Delivery Lead |
| component | implemented | DataTable.tsx | apps/web/src/ui/components/DataTable.tsx | Engineering Delivery Lead |
| component | implemented | FooterPreferencesSwitchers.tsx | apps/web/src/ui/components/FooterPreferencesSwitchers.tsx | Engineering Delivery Lead |
| component | implemented | FormModal.tsx | apps/web/src/ui/components/FormModal.tsx | Engineering Delivery Lead |
| component | implemented | InlinePager.tsx | apps/web/src/ui/components/InlinePager.tsx | Engineering Delivery Lead |
| component | implemented | SkeletonCardBlock.tsx | apps/web/src/ui/components/loading/SkeletonCardBlock.tsx | Engineering Delivery Lead |
| component | implemented | SkeletonFormBlock.tsx | apps/web/src/ui/components/loading/SkeletonFormBlock.tsx | Engineering Delivery Lead |
| component | implemented | SkeletonKpiRow.tsx | apps/web/src/ui/components/loading/SkeletonKpiRow.tsx | Engineering Delivery Lead |
| component | implemented | SkeletonTableRows.tsx | apps/web/src/ui/components/loading/SkeletonTableRows.tsx | Engineering Delivery Lead |
| component | implemented | ProfileButton.tsx | apps/web/src/ui/components/ProfileButton.tsx | Engineering Delivery Lead |
| component | implemented | SkipToContentLink.tsx | apps/web/src/ui/components/SkipToContentLink.tsx | Engineering Delivery Lead |
| component | implemented | StatusBadge.tsx | apps/web/src/ui/components/StatusBadge.tsx | Engineering Delivery Lead |
| component | implemented | TableUi.tsx | apps/web/src/ui/components/TableUi.tsx | Engineering Delivery Lead |
| component | implemented | Tabs.tsx | apps/web/src/ui/components/Tabs.tsx | Engineering Delivery Lead |
| component | implemented | ThemeSwitch.tsx | apps/web/src/ui/components/ThemeSwitch.tsx | Engineering Delivery Lead |
| component | implemented | useAsyncConfirm.tsx | apps/web/src/ui/components/useAsyncConfirm.tsx | Engineering Delivery Lead |
| component | implemented | ViewState.tsx | apps/web/src/ui/components/ViewState.tsx | Engineering Delivery Lead |
| component | implemented | FormAlert.tsx | apps/web/src/ui/forms/FormAlert.tsx | Engineering Delivery Lead |
| component | implemented | FormField.tsx | apps/web/src/ui/forms/FormField.tsx | Engineering Delivery Lead |
| component | implemented | FormFields.tsx | apps/web/src/ui/forms/FormFields.tsx | Engineering Delivery Lead |
| component | implemented | FormGrid.tsx | apps/web/src/ui/forms/FormGrid.tsx | Engineering Delivery Lead |
| component | implemented | FormMobileActionBar.tsx | apps/web/src/ui/forms/FormMobileActionBar.tsx | Engineering Delivery Lead |
| component | implemented | FormPageShell.tsx | apps/web/src/ui/forms/FormPageShell.tsx | Engineering Delivery Lead |
| component | implemented | FormSectionCard.tsx | apps/web/src/ui/forms/FormSectionCard.tsx | Engineering Delivery Lead |
| component | implemented | FormValidationSummary.tsx | apps/web/src/ui/forms/FormValidationSummary.tsx | Engineering Delivery Lead |
| component | implemented | DashboardRouteProgress.tsx | apps/web/src/ui/layout/dashboard/DashboardRouteProgress.tsx | Engineering Delivery Lead |
| component | implemented | Footer.tsx | apps/web/src/ui/layout/dashboard/Footer.tsx | Engineering Delivery Lead |
| component | implemented | Header.tsx | apps/web/src/ui/layout/dashboard/Header.tsx | Engineering Delivery Lead |
| component | implemented | IsometricModeToggle.tsx | apps/web/src/ui/layout/dashboard/IsometricModeToggle.tsx | Engineering Delivery Lead |
| component | implemented | LanguageSwitcher.tsx | apps/web/src/ui/layout/dashboard/LanguageSwitcher.tsx | Engineering Delivery Lead |
| component | implemented | PageTitle.tsx | apps/web/src/ui/layout/dashboard/PageTitle.tsx | Engineering Delivery Lead |
| component | implemented | RiskNoticeFooter.tsx | apps/web/src/ui/layout/dashboard/RiskNoticeFooter.tsx | Engineering Delivery Lead |
| component | implemented | SafetyBar.tsx | apps/web/src/ui/layout/dashboard/SafetyBar.tsx | Engineering Delivery Lead |
| component | implemented | Footer.tsx | apps/web/src/ui/layout/public/Footer.tsx | Engineering Delivery Lead |
| component | implemented | Header.tsx | apps/web/src/ui/layout/public/Header.tsx | Engineering Delivery Lead |
| component | implemented | ServiceWorkerRegistration.tsx | apps/web/src/ui/pwa/ServiceWorkerRegistration.tsx | Engineering Delivery Lead |
| document | implemented | pull_request_template.md | .github/pull_request_template.md | Engineering Delivery Lead |
| document | implemented | LUC-1519 Local Protected Route Action Proof Matrix | .tmp/luc-1519-dashboard-proof-intercept.md | Engineering Delivery Lead |
| document | implemented | LUC-1519 Local Protected Route Action Proof Matrix | .tmp/luc-1519-dashboard-proof-localhost.md | Engineering Delivery Lead |
| document | implemented | LUC-1519 Local Protected Route Action Proof Matrix | .tmp/luc-1519-dashboard-proof.md | Engineering Delivery Lead |
| document | implemented | Architecture Graph | .tmp/luc-2957-architecture-output/graphs/architecture-graph.md | Engineering Delivery Lead |
| document | deprecated | Architecture Awareness Report | .tmp/luc-2957-architecture-output/status/architecture-awareness-report.md | Engineering Delivery Lead |
| document | implemented | Dependency Report | .tmp/luc-2957-architecture-output/status/architecture-dependency-report.md | Engineering Delivery Lead |
| document | deprecated | Ownership Report | .tmp/luc-2957-architecture-output/status/architecture-ownership-report.md | Engineering Delivery Lead |
| document | implemented | Task Synchronization Report | .tmp/luc-2957-architecture-output/status/task-synchronization-report.md | Engineering Delivery Lead |
| document | implemented | AGENTS.md - CryptoSparrow / Soar | AGENTS.md | Engineering Delivery Lead |
| document | implemented | AI Testing Protocol | AI_TESTING_PROTOCOL.md | Engineering Delivery Lead |
| document | implemented | CryptoSparrow Mobile (Bootstrap) | apps/mobile/README.md | Engineering Delivery Lead |
| document | implemented | or | apps/web/README.md | Engineering Delivery Lead |
| document | implemented | Changelog | CHANGELOG.md | Engineering Delivery Lead |
| document | implemented | Definition Of Done | DEFINITION_OF_DONE.md | Engineering Delivery Lead |
| document | implemented | Deployment Gate | DEPLOYMENT_GATE.md | Engineering Delivery Lead |
| document | implemented | ADR 0001: Agent Governance Baseline | docs/adr/0001-agent-governance-baseline.md | Docs Memory Lead |
| document | deprecated | ADR Index | docs/adr/architecture-decision-records.md | Docs Memory Lead |
| document | implemented | ADR | docs/adr/README.md | Docs Memory Lead |
| document | implemented | Analysis Documentation | docs/analysis/analysis-documentation.md | Docs Memory Lead |
| document | implemented | Documentation Drift Report | docs/analysis/documentation-drift.md | Docs Memory Lead |
| document | implemented | Documentation Inventory | docs/analysis/documentation-inventory.md | Docs Memory Lead |
| document | implemented | LUC-113 Docs Analysis Provenance Closure | docs/analysis/luc-113-docs-analysis-provenance-closure-2026-05-26.md | Docs Memory Lead |
| document | implemented | LUC-1494 Docs And Memory Loop Checkpoint | docs/analysis/luc-1494-docs-memory-loop-2026-06-02.md | Docs Memory Lead |
| document | implemented | LUC-1740 Docs And Memory Loop Checkpoint | docs/analysis/luc-1740-docs-memory-loop-2026-06-03.md | Docs Memory Lead |
| document | implemented | LUC-197 Docs And Memory Loop Checkpoint | docs/analysis/luc-197-docs-memory-loop-2026-05-26.md | Docs Memory Lead |
| document | implemented | LUC-20 Docs/index/template feedback audit | docs/analysis/luc-20-docs-index-template-feedback-audit-2026-05-25.md | Docs Memory Lead |
| document | implemented | LUC-2191 Docs And Memory Loop Checkpoint | docs/analysis/luc-2191-docs-memory-loop-2026-06-05.md | Docs Memory Lead |
| document | implemented | LUC-333 Docs And Memory Loop Checkpoint | docs/analysis/luc-333-docs-memory-loop-2026-05-27.md | Docs Memory Lead |
| document | implemented | LUC-48 Autonomous map inventory and UI polish readiness gate | docs/analysis/luc-48-autonomous-map-inventory-and-ui-polish-readiness-gate-2026-05-25.md | Docs Memory Lead |
| document | implemented | LUC-49 UI state browser proof matrix | docs/analysis/luc-49-ui-state-browser-proof-matrix-2026-05-25.md | Docs Memory Lead |
| document | implemented | LUC-81 Docs And Memory Loop Audit | docs/analysis/luc-81-docs-memory-loop-2026-05-26.md | Docs Memory Lead |
| document | implemented | Analysis | docs/analysis/README.md | Docs Memory Lead |
| document | implemented | Reusable Audit Registry | docs/analysis/reusable-audit-registry.md | Docs Memory Lead |
| document | implemented | 01 Overview and Principles | docs/architecture/01_overview-and-principles.md | Docs Memory Lead |
| document | implemented | 02 System Topology | docs/architecture/02_system-topology.md | Docs Memory Lead |
| document | implemented | 03 Domain Model | docs/architecture/03_domain-model.md | Docs Memory Lead |
| document | implemented | 04 Runtime Contexts | docs/architecture/04_runtime-contexts.md | Docs Memory Lead |
| document | implemented | 05 Strategy, Signal, and Decision Flow | docs/architecture/05_strategy-signal-and-decision-flow.md | Docs Memory Lead |
| document | implemented | 06 Execution Lifecycle | docs/architecture/06_execution-lifecycle.md | Docs Memory Lead |
| document | implemented | 07 Modes, Parity, and Data | docs/architecture/07_modes-parity-and-data.md | Docs Memory Lead |
| document | implemented | 08 Operator Surfaces and Routing | docs/architecture/08_operator-surfaces-and-routing.md | Docs Memory Lead |
| document | implemented | 09 Integrations, Deployment, and Runtime Services | docs/architecture/09_integrations-deployment-and-runtime-services.md | Docs Memory Lead |
| document | implemented | 10 Safety, Entitlements, and Risk | docs/architecture/10_safety-entitlements-and-risk.md | Docs Memory Lead |
| document | implemented | 11 Assistant Runtime | docs/architecture/11_assistant-runtime.md | Docs Memory Lead |
| document | implemented | 12 Documentation Governance | docs/architecture/12_documentation-governance.md | Docs Memory Lead |
| document | implemented | Agent System Primitives | docs/architecture/agent-system-primitives.md | Docs Memory Lead |
| document | implemented | Architecture Documentation for Soar | docs/architecture/architecture-documentation.md | Docs Memory Lead |
| document | implemented | Architecture Evidence Graph System | docs/architecture/architecture-evidence-graph-system.md | Docs Memory Lead |
| document | implemented | Architecture Source Of Truth | docs/architecture/architecture-source-of-truth.md | Docs Memory Lead |
| document | implemented | Architecture Archive | docs/architecture/archive/architecture-archive.md | Docs Memory Lead |
| document | implemented | Bot V2 Create/Update Contract (Historical Compatibility Note) | docs/architecture/archive/bot-v2-create-update-contract.md | Docs Memory Lead |
| document | implemented | Database (Compatibility Stub) | docs/architecture/archive/database.md | Docs Memory Lead |
| document | implemented | Legacy CryptoBot Positions Module - Deep Analysis | docs/architecture/archive/legacy-cryptobot-positions-analysis.md | Docs Memory Lead |
| document | implemented | modules.md | docs/architecture/archive/modules.md | Docs Memory Lead |
| document | implemented | Runtime Critical-Path Decomposition Contract | docs/architecture/archive/runtime-critical-path-decomposition-contract.md | Docs Memory Lead |
| document | implemented | System Architecture (Compatibility Stub) | docs/architecture/archive/system-architecture.md | Docs Memory Lead |
| document | implemented | Tech Stack (Compatibility Stub) | docs/architecture/archive/tech-stack.md | Docs Memory Lead |
| document | implemented | Trading Logic (Compatibility Stub) | docs/architecture/archive/trading-logic.md | Docs Memory Lead |
| document | implemented | AI Assistant foundation chain | docs/architecture/chains/CHAIN-AI-ASSISTANT-FOUNDATION.md | Docs Memory Lead |
| document | implemented | API platform safety chain | docs/architecture/chains/CHAIN-API-PLATFORM-SAFETY.md | Docs Memory Lead |
| document | implemented | API support routes chain | docs/architecture/chains/CHAIN-API-SUPPORT-ROUTES.md | Docs Memory Lead |
| document | implemented | Auth session deep chain | docs/architecture/chains/CHAIN-AUTH-SESSION-DEEP.md | Docs Memory Lead |
| document | implemented | Auth session login chain | docs/architecture/chains/CHAIN-AUTH-SESSION.md | Docs Memory Lead |
| document | implemented | Backtest run lifecycle and replay chain | docs/architecture/chains/CHAIN-BACKTESTS.md | Docs Memory Lead |
| document | implemented | Bot Runtime monitoring core chain | docs/architecture/chains/CHAIN-BOT-RUNTIME-CORE.md | Docs Memory Lead |
| document | implemented | Bot setup and canonical topology chain | docs/architecture/chains/CHAIN-BOT-SETUP.md | Docs Memory Lead |
| document | implemented | Dashboard runtime monitoring chain | docs/architecture/chains/CHAIN-DASHBOARD-RUNTIME.md | Docs Memory Lead |
| document | implemented | Engine runtime core chain | docs/architecture/chains/CHAIN-ENGINE-RUNTIME-CORE.md | Docs Memory Lead |
| document | implemented | Exchange adapter deep capability and connector chain | docs/architecture/chains/CHAIN-EXCHANGE-ADAPTER-DEEP.md | Docs Memory Lead |
| document | implemented | Logs Audit Trail evidence chain | docs/architecture/chains/CHAIN-LOGS-AUDIT.md | Docs Memory Lead |
| document | implemented | Manual order deep execution chain | docs/architecture/chains/CHAIN-MANUAL-ORDER-DEEP.md | Docs Memory Lead |
| document | implemented | Manual order execution chain | docs/architecture/chains/CHAIN-MANUAL-ORDER.md | Docs Memory Lead |
| document | implemented | Market data and stream adapters chain | docs/architecture/chains/CHAIN-MARKET-DATA-STREAM-ADAPTERS.md | Docs Memory Lead |
| document | implemented | Market universe authoring and catalog chain | docs/architecture/chains/CHAIN-MARKETS.md | Docs Memory Lead |
| document | implemented | Operations config and pipeline chain | docs/architecture/chains/CHAIN-OPS-CONFIG-PIPELINE.md | Docs Memory Lead |
| document | implemented | Positions read reconciliation and manual update chain | docs/architecture/chains/CHAIN-POSITIONS-CORE.md | Docs Memory Lead |
| document | implemented | Profile API Keys credential lifecycle chain | docs/architecture/chains/CHAIN-PROFILE-API-KEYS.md | Docs Memory Lead |
| document | implemented | Release audit tooling evidence chain | docs/architecture/chains/CHAIN-RELEASE-AUDIT-TOOLING.md | Docs Memory Lead |
| document | implemented | Reports performance evidence chain | docs/architecture/chains/CHAIN-REPORTS.md | Docs Memory Lead |
| document | implemented | Runtime DCA exchange PnL chain | docs/architecture/chains/CHAIN-RUNTIME-DCA-PNL.md | Docs Memory Lead |
| document | implemented | Runtime support services chain | docs/architecture/chains/CHAIN-RUNTIME-SUPPORT-SERVICES.md | Docs Memory Lead |
| document | implemented | Strategy authoring and indicator catalog chain | docs/architecture/chains/CHAIN-STRATEGIES.md | Docs Memory Lead |
| document | implemented | Subscriptions Admin entitlement and management chain | docs/architecture/chains/CHAIN-SUBSCRIPTIONS-ADMIN.md | Docs Memory Lead |
| document | implemented | Wallets core lifecycle and analytics chain | docs/architecture/chains/CHAIN-WALLETS-CORE.md | Docs Memory Lead |
| document | implemented | Web runtime surfaces chain | docs/architecture/chains/CHAIN-WEB-RUNTIME-SURFACES.md | Docs Memory Lead |
| document | implemented | Function Chains | docs/architecture/chains/README.md | Docs Memory Lead |
| document | implemented | Codebase Map | docs/architecture/codebase-map.md | Docs Memory Lead |
| document | implemented | Data Ownership Map | docs/architecture/data-ownership-map.md | Docs Memory Lead |
| document | implemented | AI Red Team agent | docs/architecture/nodes/SOAR-AGENT-AI-RED-TEAM.md | Docs Memory Lead |
| document | implemented | Coordinator agent workflow | docs/architecture/nodes/SOAR-AGENT-COORDINATOR.md | Docs Memory Lead |
| document | implemented | PUT /admin/subscriptions/plans/:code | docs/architecture/nodes/SOAR-API-ADMIN-SUBSCRIPTION-PLAN-UPDATE.md | Docs Memory Lead |
| document | implemented | GET /admin/subscriptions/plans | docs/architecture/nodes/SOAR-API-ADMIN-SUBSCRIPTION-PLANS-LIST.md | Docs Memory Lead |
| document | implemented | GET /admin/users | docs/architecture/nodes/SOAR-API-ADMIN-USERS-LIST.md | Docs Memory Lead |
| document | implemented | PATCH /admin/users/:userId | docs/architecture/nodes/SOAR-API-ADMIN-USERS-UPDATE.md | Docs Memory Lead |
| document | implemented | POST /auth/login | docs/architecture/nodes/SOAR-API-AUTH-LOGIN.md | Docs Memory Lead |
| document | implemented | POST /auth/logout | docs/architecture/nodes/SOAR-API-AUTH-LOGOUT.md | Docs Memory Lead |
| document | implemented | GET /auth/me | docs/architecture/nodes/SOAR-API-AUTH-ME.md | Docs Memory Lead |
| document | implemented | POST /auth/register | docs/architecture/nodes/SOAR-API-AUTH-REGISTER.md | Docs Memory Lead |
| document | implemented | POST /dashboard/backtests/runs | docs/architecture/nodes/SOAR-API-BACKTEST-RUN-CREATE.md | Docs Memory Lead |
| document | implemented | DELETE /dashboard/backtests/runs/:id | docs/architecture/nodes/SOAR-API-BACKTEST-RUN-DELETE.md | Docs Memory Lead |
| document | implemented | GET /dashboard/backtests/runs/:id | docs/architecture/nodes/SOAR-API-BACKTEST-RUN-GET.md | Docs Memory Lead |
| document | implemented | GET /dashboard/backtests/runs | docs/architecture/nodes/SOAR-API-BACKTEST-RUN-LIST.md | Docs Memory Lead |
| document | implemented | GET /dashboard/backtests/runs/:id/report | docs/architecture/nodes/SOAR-API-BACKTEST-RUN-REPORT.md | Docs Memory Lead |
| document | implemented | GET /dashboard/backtests/runs/:id/timeline | docs/architecture/nodes/SOAR-API-BACKTEST-RUN-TIMELINE.md | Docs Memory Lead |
| document | implemented | GET /dashboard/backtests/runs/:id/trades | docs/architecture/nodes/SOAR-API-BACKTEST-RUN-TRADES.md | Docs Memory Lead |
| document | implemented | GET /dashboard/bots/:id/assistant-config | docs/architecture/nodes/SOAR-API-BOT-ASSISTANT-CONFIG-GET.md | Docs Memory Lead |
| document | implemented | PUT /dashboard/bots/:id/assistant-config | docs/architecture/nodes/SOAR-API-BOT-ASSISTANT-CONFIG-UPSERT.md | Docs Memory Lead |
| document | implemented | POST /dashboard/bots/:id/assistant-config/dry-run | docs/architecture/nodes/SOAR-API-BOT-ASSISTANT-DRY-RUN.md | Docs Memory Lead |
| document | implemented | POST /dashboard/bots | docs/architecture/nodes/SOAR-API-BOT-CREATE.md | Docs Memory Lead |
| document | implemented | DELETE /dashboard/bots/:id | docs/architecture/nodes/SOAR-API-BOT-DELETE.md | Docs Memory Lead |
| document | implemented | GET /dashboard/bots/:id | docs/architecture/nodes/SOAR-API-BOT-GET.md | Docs Memory Lead |
| document | implemented | GET /dashboard/bots | docs/architecture/nodes/SOAR-API-BOT-LIST.md | Docs Memory Lead |
| document | implemented | POST /dashboard/bots/:id/market-groups | docs/architecture/nodes/SOAR-API-BOT-MARKET-GROUP-CREATE.md | Docs Memory Lead |
| document | implemented | POST /dashboard/bots/:id/market-groups/:groupId/strategies | docs/architecture/nodes/SOAR-API-BOT-MARKET-GROUP-STRATEGY-ATTACH.md | Docs Memory Lead |
| document | implemented | GET /dashboard/bots/:id/market-groups | docs/architecture/nodes/SOAR-API-BOT-MARKET-GROUPS-LIST.md | Docs Memory Lead |
| document | implemented | GET /dashboard/bots/:id/runtime-monitoring/aggregate | docs/architecture/nodes/SOAR-API-BOT-RUNTIME-AGGREGATE.md | Docs Memory Lead |
| document | implemented | POST /dashboard/bots/:id/runtime-sessions/:sessionId/positions/:positionId/close | docs/architecture/nodes/SOAR-API-BOT-RUNTIME-CLOSE-POSITION.md | Docs Memory Lead |
| document | implemented | GET /dashboard/bots/:id/runtime-graph | docs/architecture/nodes/SOAR-API-BOT-RUNTIME-GRAPH.md | Docs Memory Lead |
| document | implemented | GET bot runtime positions | docs/architecture/nodes/SOAR-API-BOT-RUNTIME-POSITIONS.md | Docs Memory Lead |
| document | implemented | GET /dashboard/bots/:id/runtime-sessions/:sessionId | docs/architecture/nodes/SOAR-API-BOT-RUNTIME-SESSION-GET.md | Docs Memory Lead |
| document | implemented | GET /dashboard/bots/:id/runtime-sessions | docs/architecture/nodes/SOAR-API-BOT-RUNTIME-SESSIONS.md | Docs Memory Lead |
| document | implemented | GET /dashboard/bots/:id/runtime-sessions/:sessionId/symbol-stats | docs/architecture/nodes/SOAR-API-BOT-RUNTIME-SYMBOL-STATS.md | Docs Memory Lead |
| document | implemented | GET /dashboard/bots/:id/runtime-sessions/:sessionId/trades | docs/architecture/nodes/SOAR-API-BOT-RUNTIME-TRADES.md | Docs Memory Lead |
| document | implemented | DELETE /dashboard/bots/:id/assistant-config/subagents/:slotIndex | docs/architecture/nodes/SOAR-API-BOT-SUBAGENT-DELETE.md | Docs Memory Lead |
| document | implemented | PUT /dashboard/bots/:id/assistant-config/subagents/:slotIndex | docs/architecture/nodes/SOAR-API-BOT-SUBAGENT-UPSERT.md | Docs Memory Lead |
| document | implemented | PUT /dashboard/bots/:id | docs/architecture/nodes/SOAR-API-BOT-UPDATE.md | Docs Memory Lead |
| document | implemented | GET /dashboard/icons/lookup | docs/architecture/nodes/SOAR-API-ICON-LOOKUP.md | Docs Memory Lead |
| document | implemented | GET /dashboard/logs | docs/architecture/nodes/SOAR-API-LOGS-LIST.md | Docs Memory Lead |
| document | implemented | GET /dashboard/orders/manual-context | docs/architecture/nodes/SOAR-API-MANUAL-CONTEXT.md | Docs Memory Lead |
| document | implemented | GET /dashboard/markets/catalog | docs/architecture/nodes/SOAR-API-MARKET-CATALOG.md | Docs Memory Lead |
| document | implemented | GET /dashboard/market-stream/events | docs/architecture/nodes/SOAR-API-MARKET-STREAM-EVENTS.md | Docs Memory Lead |
| document | implemented | POST /dashboard/markets/universes | docs/architecture/nodes/SOAR-API-MARKET-UNIVERSE-CREATE.md | Docs Memory Lead |
| document | implemented | DELETE /dashboard/markets/universes/:id | docs/architecture/nodes/SOAR-API-MARKET-UNIVERSE-DELETE.md | Docs Memory Lead |
| document | implemented | GET /dashboard/markets/universes/:id | docs/architecture/nodes/SOAR-API-MARKET-UNIVERSE-GET.md | Docs Memory Lead |
| document | implemented | GET /dashboard/markets/universes | docs/architecture/nodes/SOAR-API-MARKET-UNIVERSE-LIST.md | Docs Memory Lead |
| document | implemented | PUT /dashboard/markets/universes/:id | docs/architecture/nodes/SOAR-API-MARKET-UNIVERSE-UPDATE.md | Docs Memory Lead |
| document | implemented | POST /dashboard/orders/:id/cancel | docs/architecture/nodes/SOAR-API-ORDER-CANCEL.md | Docs Memory Lead |
| document | implemented | POST /dashboard/orders/:id/close | docs/architecture/nodes/SOAR-API-ORDER-CLOSE.md | Docs Memory Lead |
| document | implemented | GET /dashboard/orders/:id | docs/architecture/nodes/SOAR-API-ORDER-GET.md | Docs Memory Lead |
| document | implemented | GET /dashboard/orders | docs/architecture/nodes/SOAR-API-ORDER-LIST.md | Docs Memory Lead |
| document | implemented | POST /dashboard/orders/open | docs/architecture/nodes/SOAR-API-ORDER-OPEN.md | Docs Memory Lead |
| document | implemented | GET /dashboard/positions/exchange-snapshot | docs/architecture/nodes/SOAR-API-POSITION-EXCHANGE-SNAPSHOT.md | Docs Memory Lead |
| document | implemented | GET /dashboard/positions/:id | docs/architecture/nodes/SOAR-API-POSITION-GET.md | Docs Memory Lead |
| document | implemented | GET /dashboard/positions | docs/architecture/nodes/SOAR-API-POSITION-LIST.md | Docs Memory Lead |
| document | implemented | GET /dashboard/positions/live-status | docs/architecture/nodes/SOAR-API-POSITION-LIVE-STATUS.md | Docs Memory Lead |
| document | implemented | PATCH /dashboard/positions/:id/management-mode | docs/architecture/nodes/SOAR-API-POSITION-MANAGEMENT-MODE.md | Docs Memory Lead |
| document | implemented | PATCH /dashboard/positions/:id/manual-update | docs/architecture/nodes/SOAR-API-POSITION-MANUAL-UPDATE.md | Docs Memory Lead |
| document | implemented | POST /dashboard/positions/orphan-repair | docs/architecture/nodes/SOAR-API-POSITION-ORPHAN-REPAIR.md | Docs Memory Lead |
| document | implemented | POST /dashboard/positions/takeover-rebind | docs/architecture/nodes/SOAR-API-POSITION-TAKEOVER-REBIND.md | Docs Memory Lead |
| document | implemented | GET /dashboard/positions/takeover-status | docs/architecture/nodes/SOAR-API-POSITION-TAKEOVER-STATUS.md | Docs Memory Lead |
| document | implemented | POST /dashboard/profile/apiKeys | docs/architecture/nodes/SOAR-API-PROFILE-APIKEY-CREATE.md | Docs Memory Lead |
| document | implemented | DELETE /dashboard/profile/apiKeys/:id | docs/architecture/nodes/SOAR-API-PROFILE-APIKEY-DELETE.md | Docs Memory Lead |
| document | implemented | GET /dashboard/profile/apiKeys | docs/architecture/nodes/SOAR-API-PROFILE-APIKEY-LIST.md | Docs Memory Lead |
| document | implemented | POST /dashboard/profile/apiKeys/:id/revoke | docs/architecture/nodes/SOAR-API-PROFILE-APIKEY-REVOKE.md | Docs Memory Lead |
| document | implemented | POST /dashboard/profile/apiKeys/:id/rotate | docs/architecture/nodes/SOAR-API-PROFILE-APIKEY-ROTATE.md | Docs Memory Lead |
| document | implemented | POST /dashboard/profile/apiKeys/:id/test | docs/architecture/nodes/SOAR-API-PROFILE-APIKEY-STORED-TEST.md | Docs Memory Lead |
| document | implemented | POST /dashboard/profile/apiKeys/test | docs/architecture/nodes/SOAR-API-PROFILE-APIKEY-TEST.md | Docs Memory Lead |
| document | implemented | PATCH /dashboard/profile/apiKeys/:id | docs/architecture/nodes/SOAR-API-PROFILE-APIKEY-UPDATE.md | Docs Memory Lead |
| document | implemented | DELETE /dashboard/profile/basic | docs/architecture/nodes/SOAR-API-PROFILE-BASIC-DELETE.md | Docs Memory Lead |
| document | implemented | GET /dashboard/profile/basic | docs/architecture/nodes/SOAR-API-PROFILE-BASIC-GET.md | Docs Memory Lead |
| document | implemented | PATCH /dashboard/profile/basic | docs/architecture/nodes/SOAR-API-PROFILE-BASIC-UPDATE.md | Docs Memory Lead |
| document | implemented | DELETE /dashboard/profile/security/account | docs/architecture/nodes/SOAR-API-PROFILE-SECURITY-ACCOUNT.md | Docs Memory Lead |
| document | implemented | PATCH /dashboard/profile/security/password | docs/architecture/nodes/SOAR-API-PROFILE-SECURITY-PASSWORD.md | Docs Memory Lead |
| document | implemented | POST /dashboard/profile/subscription/checkout-intents | docs/architecture/nodes/SOAR-API-PROFILE-SUBSCRIPTION-CHECKOUT.md | Docs Memory Lead |
| document | implemented | GET /dashboard/profile/subscription | docs/architecture/nodes/SOAR-API-PROFILE-SUBSCRIPTION-GET.md | Docs Memory Lead |
| document | implemented | GET /dashboard/reports/cross-mode-performance | docs/architecture/nodes/SOAR-API-REPORTS-CROSS-MODE-PERFORMANCE.md | Docs Memory Lead |
| document | implemented | POST /dashboard/strategies | docs/architecture/nodes/SOAR-API-STRATEGY-CREATE.md | Docs Memory Lead |
| document | implemented | DELETE /dashboard/strategies/:id | docs/architecture/nodes/SOAR-API-STRATEGY-DELETE.md | Docs Memory Lead |
| document | implemented | GET /dashboard/strategies/:id/export | docs/architecture/nodes/SOAR-API-STRATEGY-EXPORT.md | Docs Memory Lead |
| document | implemented | GET /dashboard/strategies/:id | docs/architecture/nodes/SOAR-API-STRATEGY-GET.md | Docs Memory Lead |
| document | implemented | POST /dashboard/strategies/import | docs/architecture/nodes/SOAR-API-STRATEGY-IMPORT.md | Docs Memory Lead |
| document | implemented | GET /dashboard/strategies/indicators | docs/architecture/nodes/SOAR-API-STRATEGY-INDICATORS.md | Docs Memory Lead |
| document | implemented | GET /dashboard/strategies | docs/architecture/nodes/SOAR-API-STRATEGY-LIST.md | Docs Memory Lead |
| document | implemented | PUT /dashboard/strategies/:id | docs/architecture/nodes/SOAR-API-STRATEGY-UPDATE.md | Docs Memory Lead |
| document | implemented | POST /webhooks/stripe | docs/architecture/nodes/SOAR-API-STRIPE-WEBHOOK.md | Docs Memory Lead |
| document | implemented | POST /upload/avatar | docs/architecture/nodes/SOAR-API-UPLOAD-AVATAR.md | Docs Memory Lead |
| document | implemented | GET /dashboard/wallets/:id/cashflow-events | docs/architecture/nodes/SOAR-API-WALLET-CASHFLOW-EVENTS.md | Docs Memory Lead |
| document | implemented | POST /dashboard/wallets | docs/architecture/nodes/SOAR-API-WALLET-CREATE.md | Docs Memory Lead |
| document | implemented | DELETE /dashboard/wallets/:id | docs/architecture/nodes/SOAR-API-WALLET-DELETE.md | Docs Memory Lead |
| document | implemented | GET /dashboard/wallets/:id/equity-timeline | docs/architecture/nodes/SOAR-API-WALLET-EQUITY-TIMELINE.md | Docs Memory Lead |
| document | implemented | GET /dashboard/wallets/:id | docs/architecture/nodes/SOAR-API-WALLET-GET.md | Docs Memory Lead |
| document | implemented | GET /dashboard/wallets | docs/architecture/nodes/SOAR-API-WALLET-LIST.md | Docs Memory Lead |
| document | implemented | GET /dashboard/wallets/metadata | docs/architecture/nodes/SOAR-API-WALLET-METADATA.md | Docs Memory Lead |
| document | implemented | GET /dashboard/wallets/:id/performance-summary | docs/architecture/nodes/SOAR-API-WALLET-PERFORMANCE-SUMMARY.md | Docs Memory Lead |
| document | implemented | POST /dashboard/wallets/preview-balance | docs/architecture/nodes/SOAR-API-WALLET-PREVIEW-BALANCE.md | Docs Memory Lead |
| document | implemented | POST /dashboard/wallets/:id/reset-paper | docs/architecture/nodes/SOAR-API-WALLET-RESET-PAPER.md | Docs Memory Lead |
| document | implemented | PUT /dashboard/wallets/:id | docs/architecture/nodes/SOAR-API-WALLET-UPDATE.md | Docs Memory Lead |
| document | implemented | AdminLayoutShell | docs/architecture/nodes/SOAR-COMP-ADMIN-LAYOUT-SHELL.md | Docs Memory Lead |
| document | implemented | AdminSubscriptionsPage | docs/architecture/nodes/SOAR-COMP-ADMIN-SUBSCRIPTIONS-PAGE.md | Docs Memory Lead |
| document | implemented | AdminUsersPage | docs/architecture/nodes/SOAR-COMP-ADMIN-USERS-PAGE.md | Docs Memory Lead |
| document | implemented | ApiKeyForm | docs/architecture/nodes/SOAR-COMP-API-KEY-FORM.md | Docs Memory Lead |
| document | implemented | ApiKeysList | docs/architecture/nodes/SOAR-COMP-API-KEYS-LIST.md | Docs Memory Lead |
| document | implemented | AuditTrailView | docs/architecture/nodes/SOAR-COMP-AUDIT-TRAIL-VIEW.md | Docs Memory Lead |
| document | implemented | BacktestCreateForm | docs/architecture/nodes/SOAR-COMP-BACKTEST-CREATE-FORM.md | Docs Memory Lead |
| document | implemented | Backtest detail presenters | docs/architecture/nodes/SOAR-COMP-BACKTEST-DETAIL-PRESENTERS.md | Docs Memory Lead |
| document | implemented | BacktestRunDetails | docs/architecture/nodes/SOAR-COMP-BACKTEST-RUN-DETAILS.md | Docs Memory Lead |
| document | implemented | BacktestsListView | docs/architecture/nodes/SOAR-COMP-BACKTESTS-LIST-VIEW.md | Docs Memory Lead |
| document | implemented | BotCreateEditForm | docs/architecture/nodes/SOAR-COMP-BOT-CREATE-EDIT-FORM.md | Docs Memory Lead |
| document | implemented | BotFormPageContent | docs/architecture/nodes/SOAR-COMP-BOT-FORM-PAGE-CONTENT.md | Docs Memory Lead |
| document | implemented | BotsAssistantTab | docs/architecture/nodes/SOAR-COMP-BOTS-ASSISTANT-TAB.md | Docs Memory Lead |
| document | implemented | BotsListTable | docs/architecture/nodes/SOAR-COMP-BOTS-LIST-TABLE.md | Docs Memory Lead |
| document | implemented | BotsManagementTabs | docs/architecture/nodes/SOAR-COMP-BOTS-MANAGEMENT-TABS.md | Docs Memory Lead |
| document | implemented | BotsManagement runtime monitoring component | docs/architecture/nodes/SOAR-COMP-BOTS-MANAGEMENT.md | Docs Memory Lead |
| document | implemented | BotsMonitoringAttributionPills | docs/architecture/nodes/SOAR-COMP-BOTS-MONITORING-ATTRIBUTION-PILLS.md | Docs Memory Lead |
| document | implemented | BotsMonitoringProtectionCell | docs/architecture/nodes/SOAR-COMP-BOTS-MONITORING-PROTECTION-CELL.md | Docs Memory Lead |
| document | implemented | BotsMonitoringSections | docs/architecture/nodes/SOAR-COMP-BOTS-MONITORING-SECTIONS.md | Docs Memory Lead |
| document | implemented | BotsMonitoringTab | docs/architecture/nodes/SOAR-COMP-BOTS-MONITORING-TAB.md | Docs Memory Lead |
| document | implemented | BotsPortfolioHistorySection | docs/architecture/nodes/SOAR-COMP-BOTS-PORTFOLIO-HISTORY-SECTION.md | Docs Memory Lead |
| document | implemented | ExchangeConnectionsView | docs/architecture/nodes/SOAR-COMP-EXCHANGE-CONNECTIONS-VIEW.md | Docs Memory Lead |
| document | implemented | HomeLiveWidgets | docs/architecture/nodes/SOAR-COMP-HOME-LIVE-WIDGETS.md | Docs Memory Lead |
| document | implemented | LiveMarketBar | docs/architecture/nodes/SOAR-COMP-LIVE-MARKET-BAR.md | Docs Memory Lead |
| document | implemented | LoginForm | docs/architecture/nodes/SOAR-COMP-LOGIN-FORM.md | Docs Memory Lead |
| document | implemented | SearchableMultiSelect | docs/architecture/nodes/SOAR-COMP-MARKET-SEARCHABLE-MULTISELECT.md | Docs Memory Lead |
| document | implemented | MarketUniverseForm | docs/architecture/nodes/SOAR-COMP-MARKET-UNIVERSE-FORM.md | Docs Memory Lead |
| document | implemented | MarketUniversesTable | docs/architecture/nodes/SOAR-COMP-MARKET-UNIVERSES-TABLE.md | Docs Memory Lead |
| document | implemented | MonitoringFutureSignalsSection | docs/architecture/nodes/SOAR-COMP-MONITORING-FUTURE-SIGNALS.md | Docs Memory Lead |
| document | implemented | PerformanceReportsView | docs/architecture/nodes/SOAR-COMP-PERFORMANCE-REPORTS-VIEW.md | Docs Memory Lead |
| document | implemented | Profile BasicForm | docs/architecture/nodes/SOAR-COMP-PROFILE-BASIC-FORM.md | Docs Memory Lead |
| document | implemented | Profile Security | docs/architecture/nodes/SOAR-COMP-PROFILE-SECURITY.md | Docs Memory Lead |
| document | implemented | Profile Subscription component | docs/architecture/nodes/SOAR-COMP-PROFILE-SUBSCRIPTION.md | Docs Memory Lead |
| document | implemented | RegisterForm | docs/architecture/nodes/SOAR-COMP-REGISTER-FORM.md | Docs Memory Lead |
| document | implemented | runtimeDataTablePresenters | docs/architecture/nodes/SOAR-COMP-RUNTIME-DATA-PRESENTERS.md | Docs Memory Lead |
| document | implemented | RuntimeDataSection | docs/architecture/nodes/SOAR-COMP-RUNTIME-DATA-SECTION.md | Docs Memory Lead |
| document | implemented | RuntimeOnboardingSection | docs/architecture/nodes/SOAR-COMP-RUNTIME-ONBOARDING-SECTION.md | Docs Memory Lead |
| document | implemented | RuntimeSidebarSection | docs/architecture/nodes/SOAR-COMP-RUNTIME-SIDEBAR-SECTION.md | Docs Memory Lead |
| document | implemented | RuntimeSignalsSection | docs/architecture/nodes/SOAR-COMP-RUNTIME-SIGNALS-SECTION.md | Docs Memory Lead |
| document | implemented | SortableThresholdListEditor | docs/architecture/nodes/SOAR-COMP-SORTABLE-THRESHOLD-LIST-EDITOR.md | Docs Memory Lead |
| document | implemented | StrategiesList | docs/architecture/nodes/SOAR-COMP-STRATEGIES-LIST.md | Docs Memory Lead |
| document | implemented | Strategy form sections | docs/architecture/nodes/SOAR-COMP-STRATEGY-FORM-SECTIONS.md | Docs Memory Lead |
| document | implemented | StrategyForm | docs/architecture/nodes/SOAR-COMP-STRATEGY-FORM.md | Docs Memory Lead |
| document | implemented | StrategyPresetPicker | docs/architecture/nodes/SOAR-COMP-STRATEGY-PRESET-PICKER.md | Docs Memory Lead |
| document | implemented | WalletCreateEditForm | docs/architecture/nodes/SOAR-COMP-WALLET-CREATE-EDIT-FORM.md | Docs Memory Lead |
| document | implemented | WalletFormPageContent | docs/architecture/nodes/SOAR-COMP-WALLET-FORM-PAGE-CONTENT.md | Docs Memory Lead |
| document | implemented | WalletPreviewPanel | docs/architecture/nodes/SOAR-COMP-WALLET-PREVIEW-PANEL.md | Docs Memory Lead |
| document | implemented | WalletsListTable | docs/architecture/nodes/SOAR-COMP-WALLETS-LIST-TABLE.md | Docs Memory Lead |
| document | implemented | API package manifest | docs/architecture/nodes/SOAR-CONFIG-API-PACKAGE.md | Docs Memory Lead |
| document | implemented | Coolify Service Stack compose topology | docs/architecture/nodes/SOAR-CONFIG-COOLIFY-STACK-COMPOSE.md | Docs Memory Lead |
| document | implemented | Critical secrets readiness config | docs/architecture/nodes/SOAR-CONFIG-CRITICAL-SECRETS-READINESS.md | Docs Memory Lead |
| document | implemented | Local docker compose topology | docs/architecture/nodes/SOAR-CONFIG-LOCAL-COMPOSE.md | Docs Memory Lead |
| document | implemented | Mobile package manifest | docs/architecture/nodes/SOAR-CONFIG-MOBILE-PACKAGE.md | Docs Memory Lead |
| document | implemented | pnpm workspace manifest | docs/architecture/nodes/SOAR-CONFIG-PNPM-WORKSPACE.md | Docs Memory Lead |
| document | implemented | Proxy trust config | docs/architecture/nodes/SOAR-CONFIG-PROXY-TRUST.md | Docs Memory Lead |
| document | implemented | Root package manifest | docs/architecture/nodes/SOAR-CONFIG-ROOT-PACKAGE.md | Docs Memory Lead |
| document | implemented | Runtime execution config | docs/architecture/nodes/SOAR-CONFIG-RUNTIME-EXECUTION.md | Docs Memory Lead |
| document | implemented | Shared package manifest | docs/architecture/nodes/SOAR-CONFIG-SHARED-PACKAGE.md | Docs Memory Lead |
| document | implemented | VPS docker compose topology | docs/architecture/nodes/SOAR-CONFIG-VPS-COMPOSE.md | Docs Memory Lead |
| document | implemented | Web package manifest | docs/architecture/nodes/SOAR-CONFIG-WEB-PACKAGE.md | Docs Memory Lead |
| document | implemented | AuthContext | docs/architecture/nodes/SOAR-CONTEXT-WEB-AUTH.md | Docs Memory Lead |
| document | implemented | Admin subscription plans controller | docs/architecture/nodes/SOAR-CONTROLLER-ADMIN-SUBSCRIPTION-PLANS.md | Docs Memory Lead |
| document | implemented | Admin users controller | docs/architecture/nodes/SOAR-CONTROLLER-ADMIN-USERS.md | Docs Memory Lead |
| document | implemented | Auth controller | docs/architecture/nodes/SOAR-CONTROLLER-AUTH.md | Docs Memory Lead |
| document | implemented | Backtests controller | docs/architecture/nodes/SOAR-CONTROLLER-BACKTESTS.md | Docs Memory Lead |
| document | implemented | Bots controller | docs/architecture/nodes/SOAR-CONTROLLER-BOTS.md | Docs Memory Lead |
| document | implemented | Icons controller | docs/architecture/nodes/SOAR-CONTROLLER-ICONS.md | Docs Memory Lead |
| document | implemented | Logs controller | docs/architecture/nodes/SOAR-CONTROLLER-LOGS.md | Docs Memory Lead |
| document | implemented | Markets controller | docs/architecture/nodes/SOAR-CONTROLLER-MARKETS.md | Docs Memory Lead |
| document | implemented | Orders controller | docs/architecture/nodes/SOAR-CONTROLLER-ORDERS.md | Docs Memory Lead |
| document | implemented | Positions controller | docs/architecture/nodes/SOAR-CONTROLLER-POSITIONS.md | Docs Memory Lead |
| document | implemented | Profile API-key controller | docs/architecture/nodes/SOAR-CONTROLLER-PROFILE-API-KEYS.md | Docs Memory Lead |
| document | implemented | Profile basic controller | docs/architecture/nodes/SOAR-CONTROLLER-PROFILE-BASIC.md | Docs Memory Lead |
| document | implemented | Profile security controller | docs/architecture/nodes/SOAR-CONTROLLER-PROFILE-SECURITY.md | Docs Memory Lead |
| document | implemented | Profile subscription controller | docs/architecture/nodes/SOAR-CONTROLLER-PROFILE-SUBSCRIPTION.md | Docs Memory Lead |
| document | implemented | Reports controller | docs/architecture/nodes/SOAR-CONTROLLER-REPORTS.md | Docs Memory Lead |
| document | implemented | Strategies controller | docs/architecture/nodes/SOAR-CONTROLLER-STRATEGIES.md | Docs Memory Lead |
| document | implemented | Wallets controller | docs/architecture/nodes/SOAR-CONTROLLER-WALLETS.md | Docs Memory Lead |
| document | implemented | ApiKey model | docs/architecture/nodes/SOAR-DB-API-KEY.md | Docs Memory Lead |
| document | implemented | BacktestReport model | docs/architecture/nodes/SOAR-DB-BACKTEST-REPORT.md | Docs Memory Lead |
| document | implemented | BacktestRun model | docs/architecture/nodes/SOAR-DB-BACKTEST-RUN.md | Docs Memory Lead |
| document | implemented | BacktestTrade model | docs/architecture/nodes/SOAR-DB-BACKTEST-TRADE.md | Docs Memory Lead |
| document | implemented | BotAssistantConfig model | docs/architecture/nodes/SOAR-DB-BOT-ASSISTANT-CONFIG.md | Docs Memory Lead |
| document | implemented | BotMarketGroup model | docs/architecture/nodes/SOAR-DB-BOT-MARKET-GROUP.md | Docs Memory Lead |
| document | implemented | BotSubagentConfig model | docs/architecture/nodes/SOAR-DB-BOT-SUBAGENT-CONFIG.md | Docs Memory Lead |
| document | implemented | Bot model | docs/architecture/nodes/SOAR-DB-BOT.md | Docs Memory Lead |
| document | implemented | Log model | docs/architecture/nodes/SOAR-DB-LOG.md | Docs Memory Lead |
| document | implemented | MarketGroupStrategyLink model | docs/architecture/nodes/SOAR-DB-MARKET-GROUP-STRATEGY-LINK.md | Docs Memory Lead |
| document | implemented | MarketUniverse model | docs/architecture/nodes/SOAR-DB-MARKET-UNIVERSE.md | Docs Memory Lead |
| document | implemented | OrderFill model | docs/architecture/nodes/SOAR-DB-ORDER-FILL.md | Docs Memory Lead |
| document | implemented | Order model | docs/architecture/nodes/SOAR-DB-ORDER.md | Docs Memory Lead |
| document | implemented | PaymentIntent model | docs/architecture/nodes/SOAR-DB-PAYMENT-INTENT.md | Docs Memory Lead |
| document | implemented | Position model | docs/architecture/nodes/SOAR-DB-POSITION.md | Docs Memory Lead |
| document | implemented | BotRuntimeSession model | docs/architecture/nodes/SOAR-DB-RUNTIME-SESSION.md | Docs Memory Lead |
| document | implemented | Strategy model | docs/architecture/nodes/SOAR-DB-STRATEGY.md | Docs Memory Lead |
| document | implemented | SubscriptionPlan model | docs/architecture/nodes/SOAR-DB-SUBSCRIPTION-PLAN.md | Docs Memory Lead |
| document | implemented | SymbolGroup model | docs/architecture/nodes/SOAR-DB-SYMBOL-GROUP.md | Docs Memory Lead |
| document | implemented | Trade model | docs/architecture/nodes/SOAR-DB-TRADE.md | Docs Memory Lead |
| document | implemented | UserSubscription model | docs/architecture/nodes/SOAR-DB-USER-SUBSCRIPTION.md | Docs Memory Lead |
| document | implemented | User model | docs/architecture/nodes/SOAR-DB-USER.md | Docs Memory Lead |
| document | implemented | Wallet model | docs/architecture/nodes/SOAR-DB-WALLET.md | Docs Memory Lead |
| document | implemented | AI integration product documentation | docs/architecture/nodes/SOAR-DOC-AI-INTEGRATION.md | Docs Memory Lead |
| document | implemented | AI testing protocol | docs/architecture/nodes/SOAR-DOC-AI-TESTING-PROTOCOL.md | Docs Memory Lead |
| document | implemented | API admin module documentation | docs/architecture/nodes/SOAR-DOC-API-ADMIN.md | Docs Memory Lead |
| document | implemented | API auth module doc | docs/architecture/nodes/SOAR-DOC-API-AUTH.md | Docs Memory Lead |
| document | implemented | API backtests module documentation | docs/architecture/nodes/SOAR-DOC-API-BACKTESTS.md | Docs Memory Lead |
| document | implemented | API bots module doc | docs/architecture/nodes/SOAR-DOC-API-BOTS.md | Docs Memory Lead |
| document | implemented | API icons module documentation | docs/architecture/nodes/SOAR-DOC-API-ICONS.md | Docs Memory Lead |
| document | implemented | API logs module documentation | docs/architecture/nodes/SOAR-DOC-API-LOGS.md | Docs Memory Lead |
| document | implemented | API market stream module documentation | docs/architecture/nodes/SOAR-DOC-API-MARKET-STREAM.md | Docs Memory Lead |
| document | implemented | API markets module documentation | docs/architecture/nodes/SOAR-DOC-API-MARKETS.md | Docs Memory Lead |
| document | implemented | API orders module doc | docs/architecture/nodes/SOAR-DOC-API-ORDERS.md | Docs Memory Lead |
| document | implemented | API positions module doc | docs/architecture/nodes/SOAR-DOC-API-POSITIONS.md | Docs Memory Lead |
| document | implemented | API profile module documentation | docs/architecture/nodes/SOAR-DOC-API-PROFILE.md | Docs Memory Lead |
| document | implemented | API reports module documentation | docs/architecture/nodes/SOAR-DOC-API-REPORTS.md | Docs Memory Lead |
| document | implemented | API root module documentation | docs/architecture/nodes/SOAR-DOC-API-ROOT.md | Docs Memory Lead |
| document | implemented | API strategies module documentation | docs/architecture/nodes/SOAR-DOC-API-STRATEGIES.md | Docs Memory Lead |
| document | implemented | API subscriptions module documentation | docs/architecture/nodes/SOAR-DOC-API-SUBSCRIPTIONS.md | Docs Memory Lead |
| document | implemented | API upload module documentation | docs/architecture/nodes/SOAR-DOC-API-UPLOAD.md | Docs Memory Lead |
| document | implemented | API wallets module documentation | docs/architecture/nodes/SOAR-DOC-API-WALLETS.md | Docs Memory Lead |
| document | implemented | Architecture contract documentation index | docs/architecture/nodes/SOAR-DOC-ARCHITECTURE-CONTRACT-INDEX.md | Docs Memory Lead |
| document | implemented | Architecture governance documentation index | docs/architecture/nodes/SOAR-DOC-ARCHITECTURE-GOVERNANCE-INDEX.md | Docs Memory Lead |
| document | implemented | Architecture evidence graph system doc | docs/architecture/nodes/SOAR-DOC-ARCHITECTURE-GRAPH-SYSTEM.md | Docs Memory Lead |
| document | implemented | Assistant runtime contract | docs/architecture/nodes/SOAR-DOC-ASSISTANT-RUNTIME-CONTRACT.md | Docs Memory Lead |
| document | implemented | Assistant runtime architecture | docs/architecture/nodes/SOAR-DOC-ASSISTANT-RUNTIME.md | Docs Memory Lead |

## Relation Index

| Type | From | To | Evidence |
| --- | --- | --- | --- |
| connected_to | api_endpoint:get-alerts:1897f480e5 | module:apps-api-src:3261657fad | apps/api/src/router/index.ts |
| connected_to | api_endpoint:get-health:ba01ef0056 | module:apps-api-src:3261657fad | apps/api/src/router/index.ts |
| connected_to | api_endpoint:get-me:6a7167adbd | module:apps-api-src:3261657fad | apps/api/src/modules/auth/auth.routes.ts |
| connected_to | api_endpoint:get-metrics:c8c3bc223e | module:apps-api-src:3261657fad | apps/api/src/router/index.ts |
| connected_to | api_endpoint:get-ready-details:2eb3ce564e | module:apps-api-src:3261657fad | apps/api/src/router/index.ts |
| connected_to | api_endpoint:get-ready:5f58f81b1e | module:apps-api-src:3261657fad | apps/api/src/router/index.ts |
| connected_to | api_endpoint:get-workers-health:f2ac053027 | module:apps-api-src:3261657fad | apps/api/src/router/index.ts |
| connected_to | api_endpoint:get-workers-ready:7a43033f4b | module:apps-api-src:3261657fad | apps/api/src/router/index.ts |
| connected_to | api_endpoint:get-workers-runtime-freshness:cb5ccf9adb | module:apps-api-src:3261657fad | apps/api/src/router/index.ts |
| connected_to | api_endpoint:get:1f75b583ca | module:apps-api-src:3261657fad | apps/api/src/router/dashboard.routes.ts |
| connected_to | api_endpoint:get:6708703663 | module:apps-api-src:3261657fad | apps/api/src/router/admin.routes.ts |
| connected_to | api_endpoint:get:ec3f1b71d9 | module:apps-api-src:3261657fad | apps/api/src/router/index.ts |
| connected_to | api_endpoint:post-login:66031e164c | module:apps-api-src:3261657fad | apps/api/src/modules/auth/auth.routes.ts |
| connected_to | api_endpoint:post-logout:a5a7195fe9 | module:apps-api-src:3261657fad | apps/api/src/modules/auth/auth.routes.ts |
| connected_to | api_endpoint:post-register:47bef35779 | module:apps-api-src:3261657fad | apps/api/src/modules/auth/auth.routes.ts |
| connected_to | api_endpoint:use-admin:9b16797c60 | module:apps-api-src:3261657fad | apps/api/src/router/index.ts |
| connected_to | api_endpoint:use-auth:ac44845d3f | module:apps-api-src:3261657fad | apps/api/src/router/index.ts |
| connected_to | api_endpoint:use-avatars:1e1c441a3a | module:apps-api-src:3261657fad | apps/api/src/index.ts |
| connected_to | api_endpoint:use-backtests:1db01efff8 | module:apps-api-src:3261657fad | apps/api/src/router/dashboard.routes.ts |
| connected_to | api_endpoint:use-bots:d49fee56cc | module:apps-api-src:3261657fad | apps/api/src/router/dashboard.routes.ts |
| connected_to | api_endpoint:use-dashboard:2e7ff2f1fa | module:apps-api-src:3261657fad | apps/api/src/router/index.ts |
| connected_to | api_endpoint:use-icons:309c3997b9 | module:apps-api-src:3261657fad | apps/api/src/router/dashboard.routes.ts |
| connected_to | api_endpoint:use-logs:39b6910aae | module:apps-api-src:3261657fad | apps/api/src/router/dashboard.routes.ts |
| connected_to | api_endpoint:use-market-stream:33f6cb2c91 | module:apps-api-src:3261657fad | apps/api/src/router/dashboard.routes.ts |
| connected_to | api_endpoint:use-markets:583f095d82 | module:apps-api-src:3261657fad | apps/api/src/router/dashboard.routes.ts |
| connected_to | api_endpoint:use-orders:b0814be10f | module:apps-api-src:3261657fad | apps/api/src/router/dashboard.routes.ts |
| connected_to | api_endpoint:use-positions:e3a48a2408 | module:apps-api-src:3261657fad | apps/api/src/router/dashboard.routes.ts |
| connected_to | api_endpoint:use-profile-apikeys:680f20cf0c | module:apps-api-src:3261657fad | apps/api/src/router/dashboard.routes.ts |
| connected_to | api_endpoint:use-profile-basic:567948ce49 | module:apps-api-src:3261657fad | apps/api/src/router/dashboard.routes.ts |
| connected_to | api_endpoint:use-profile-security:61552c894b | module:apps-api-src:3261657fad | apps/api/src/router/dashboard.routes.ts |
| connected_to | api_endpoint:use-profile-subscription:e9d8631f88 | module:apps-api-src:3261657fad | apps/api/src/router/dashboard.routes.ts |
| connected_to | api_endpoint:use-reports:cc94abde59 | module:apps-api-src:3261657fad | apps/api/src/router/dashboard.routes.ts |
| connected_to | api_endpoint:use-strategies:673ded2ac7 | module:apps-api-src:3261657fad | apps/api/src/router/dashboard.routes.ts |
| connected_to | api_endpoint:use-subscriptions-plans:b5026ab209 | module:apps-api-src:3261657fad | apps/api/src/router/admin.routes.ts |
| connected_to | api_endpoint:use-upload:59c4f6ed00 | module:apps-api-src:3261657fad | apps/api/src/router/index.ts |
| connected_to | api_endpoint:use-users:2f4d7609a6 | module:apps-api-src:3261657fad | apps/api/src/router/admin.routes.ts |
| connected_to | api_endpoint:use-wallets:b8382408ca | module:apps-api-src:3261657fad | apps/api/src/router/dashboard.routes.ts |
| connected_to | api_endpoint:use-webhooks-stripe:b502d56cea | module:apps-api-src:3261657fad | apps/api/src/index.ts |
| connected_to | project:soar:7c70e892d7 | task:2026-07-02-luc-6750-gap-register-and-repair-lane-refresh:006aecaba0 | .codex/context/TASK_BOARD.md |
| connected_to | project:soar:7c70e892d7 | task:2026-07-02-luc-6750-gap-register-refresh:f10f18ac2e | .codex/context/PROJECT_STATE.md |
| connected_to | project:soar:7c70e892d7 | task:agent-operating-system-task-2026-05-07:04d1de2b03 | history/tasks/agent-operating-system-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:ai-assistant-foundation-protocol-harness-task:0adbd87e92 | history/tasks/ai-assistant-foundation-protocol-harness-2026-05-23-task.md |
| connected_to | project:soar:7c70e892d7 | task:arch-graph-ai-assistant-foundation-backfill-2026-05-24:bb9f438af4 | history/tasks/architecture-graph-ai-assistant-foundation-backfill-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:arch-graph-drift-detection-2026-05-24:8a4424886d | history/tasks/architecture-graph-drift-detection-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:arch-graph-logs-audit-backfill-2026-05-24:e7375e9047 | history/tasks/architecture-graph-logs-audit-backfill-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:arch-graph-ops-config-pipeline-backfill-2026-05-24:a3a5ff99de | history/tasks/architecture-graph-ops-config-pipeline-backfill-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:arch-graph-reports-backfill-2026-05-24:eb5ca63ba2 | history/tasks/architecture-graph-reports-backfill-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:arch-graph-subscriptions-admin-backfill-2026-05-24:db6f9fe944 | history/tasks/architecture-graph-subscriptions-admin-backfill-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:architecture-graph-auth-session-deep-backfill-2026-05-24:31f7730b74 | history/tasks/architecture-graph-auth-session-deep-backfill-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:architecture-graph-backtests-backfill-2026-05-24:964c85fde8 | history/tasks/architecture-graph-backtests-backfill-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:architecture-graph-full-drift-closure-2026-05-24:53d6ec9a98 | history/tasks/architecture-graph-full-drift-closure-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:architecture-graph-markets-backfill-2026-05-24:727c9ba565 | history/tasks/architecture-graph-markets-backfill-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:architecture-graph-strategies-backfill-2026-05-24:100cd67353 | history/tasks/architecture-graph-strategies-backfill-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:architecture-graph-web-runtime-surfaces-backfill-2026-05-24:3fdaea0b90 | history/tasks/architecture-graph-web-runtime-surfaces-backfill-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:backend-permission-and-data-isolation-review-task:6bbc4f70d1 | history/tasks/backend-permission-isolation-review-2026-05-21-task.md |
| connected_to | project:soar:7c70e892d7 | task:backtest-non-binance-order-book-fail-closed-2026-05-23:fa7d994728 | history/tasks/backtest-non-binance-order-book-fail-closed-2026-05-23-task.md |
| connected_to | project:soar:7c70e892d7 | task:bhist-01-bot-portfolio-history-and-capital-events-task:f4932dbe7b | history/tasks/bhist-01-bot-portfolio-history-and-capital-events-task-2026-05-01.md |
| connected_to | project:soar:7c70e892d7 | task:botdrift-01-bot-read-projection-canonical-context-task:5bcfa3d6de | history/tasks/botdrift-01-bot-read-projection-canonical-context-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:botdrift-02-bot-update-canonical-guard-task:d7cf111912 | history/tasks/botdrift-02-bot-update-canonical-guard-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:coolify-auto-deploy-and-worker-recovery-2026-05-26:b99a704cbd | history/tasks/coolify-auto-deploy-and-worker-recovery-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:coolify-service-stack-liveness-gate-task:088e2ed985 | history/tasks/coolify-service-stack-liveness-gate-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:coolify-service-stack-migration-2026-05-25:7006202444 | history/tasks/coolify-service-stack-migration-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:coolify-stack-profile-gated-cutover-2026-05-25:c24faafdc3 | history/tasks/coolify-stack-profile-gated-cutover-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:dashboard-runtime-current-state-aggregate-task-2026-05-09:04d02141e9 | history/tasks/dashboard-runtime-current-state-aggregate-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:dashboard-runtime-widget-aggregate-current-render-task-2026-05-09:9daa556da3 | history/tasks/dashboard-runtime-widget-aggregate-current-render-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:dashdrift-02-position-edit-strategy-display-task:054bc1381d | history/tasks/dashdrift-02-position-edit-strategy-display-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:deploy-freshness-9c125683:e08e777e63 | history/tasks/deploy-freshness-9c125683-task-2026-05-10.md |
| connected_to | project:soar:7c70e892d7 | task:deploy-freshness-e8cd748e-task-2026-05-09:7b6aea0dcc | history/tasks/deploy-freshness-e8cd748e-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:deploy-lag-e70f5cf6-2026-05-10:9b71503178 | history/tasks/deploy-lag-e70f5cf6-task-2026-05-10.md |
| connected_to | project:soar:7c70e892d7 | task:exchange2-01-gate-io-fail-closed-placeholder-task-2026-05-08:763ffb7a0f | history/tasks/exchange2-01-gateio-fail-closed-placeholder-task-2026-05-08.md |
| connected_to | project:soar:7c70e892d7 | task:exchange2-02-gate-io-public-market-catalog-task-2026-05-08:c055b19c65 | history/tasks/exchange2-02-gateio-public-market-catalog-task-2026-05-08.md |
| connected_to | project:soar:7c70e892d7 | task:exchange2-03-runtime-market-event-exchange-boundary-task-2026-05-08:fd86ac7d92 | history/tasks/exchange2-03-runtime-market-event-exchange-boundary-task-2026-05-08.md |
| connected_to | project:soar:7c70e892d7 | task:exchange2-04-gate-io-public-market-data-reader-task-2026-05-08:2bff76927f | history/tasks/exchange2-04-gateio-public-market-data-reader-task-2026-05-08.md |
| connected_to | project:soar:7c70e892d7 | task:exchange2-05-gate-io-market-stream-polling-task-2026-05-08:8f9dd8dcc3 | history/tasks/exchange2-05-gateio-market-stream-polling-task-2026-05-08.md |
| connected_to | project:soar:7c70e892d7 | task:exchange2-06-gate-io-runtime-consumption-regression-task-2026-05-08:2d91f7f74d | history/tasks/exchange2-06-gateio-runtime-consumption-regression-task-2026-05-08.md |
| connected_to | project:soar:7c70e892d7 | task:exchange2-07-gate-io-market-stream-fanout-regression-task-2026-05-08:75bc556db0 | history/tasks/exchange2-07-gateio-market-stream-fanout-regression-task-2026-05-08.md |
| connected_to | project:soar:7c70e892d7 | task:exchange2-09-gate-io-market-stream-worker-config-task-2026-05-08:7546703222 | history/tasks/exchange2-09-gateio-market-stream-worker-config-task-2026-05-08.md |
| connected_to | project:soar:7c70e892d7 | task:exchange2-10-gate-io-web-capability-gating-task-2026-05-08:79dd3b00f0 | history/tasks/exchange2-10-gateio-web-capability-gating-task-2026-05-08.md |
| connected_to | project:soar:7c70e892d7 | task:exchange2-11-gate-io-wallet-bot-ui-gating-task-2026-05-08:9f66a27029 | history/tasks/exchange2-11-gateio-wallet-bot-ui-gating-task-2026-05-08.md |
| connected_to | project:soar:7c70e892d7 | task:exchange2-12-gate-io-api-wallet-fail-closed-task-2026-05-08:7137ef0b08 | history/tasks/exchange2-12-gateio-api-wallet-fail-closed-task-2026-05-08.md |
| connected_to | project:soar:7c70e892d7 | task:exchange2-13-gate-io-api-wallet-update-fail-closed-task-2026-05-08:2341020a85 | history/tasks/exchange2-13-gateio-api-wallet-update-fail-closed-task-2026-05-08.md |
| connected_to | project:soar:7c70e892d7 | task:exchange2-14-gate-io-stored-api-key-probe-fail-closed-task-2026-05-08:096f5f54ed | history/tasks/exchange2-14-gateio-stored-api-key-probe-fail-closed-task-2026-05-08.md |
| connected_to | project:soar:7c70e892d7 | task:exchange2-15-gate-io-wallet-balance-preview-fail-closed-task-2026-05-08:06c6cbb594 | history/tasks/exchange2-15-gateio-wallet-balance-preview-fail-closed-task-2026-05-08.md |
| connected_to | project:soar:7c70e892d7 | task:exchange2-24-gate-io-api-key-probe:d7037f9851 | history/tasks/exchange2-24-gateio-api-key-probe-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:exchange2-25-gate-io-balance-preview:f484d8a05b | history/tasks/exchange2-25-gateio-balance-preview-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:exchange2-26-gate-io-positions-snapshot:1f95756005 | history/tasks/exchange2-26-gateio-positions-snapshot-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:exchange2-27-gate-io-open-orders-snapshot:59f847ad8b | history/tasks/exchange2-27-gateio-open-orders-snapshot-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:exchange2-28-gate-io-trade-history-snapshot:565b41d3fb | history/tasks/exchange2-28-gateio-trade-history-snapshot-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:exchange2-29-gate-io-wallet-cashflow-history:8fd0c3b75d | history/tasks/exchange2-29-gateio-wallet-cashflow-history-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:exchange2-30-gate-io-live-order-submit:20934fb453 | history/tasks/exchange2-30-gateio-live-order-submit-task-2026-05-10.md |
| connected_to | project:soar:7c70e892d7 | task:exchange2-31-live-order-cancel-boundary:8d2a786dc4 | history/tasks/exchange2-31-live-order-cancel-boundary-task-2026-05-10.md |
| connected_to | project:soar:7c70e892d7 | task:fullarch-fix-04-web-navigation-mock-harness:f13d01bb45 | history/tasks/fullarch-fix-04-web-navigation-mock-harness-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:fullarch-fix-05-api-single-active-bot-scope-closure:f54cea4cbc | history/tasks/fullarch-fix-05-api-single-active-bot-scope-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:gate-io-live-bot-context-repair-2026-05-23:0652c33832 | history/tasks/gateio-live-bot-context-repair-2026-05-23-task.md |
| connected_to | project:soar:7c70e892d7 | task:gate-io-live-manual-order-ada-short-attempt-2026-05-23:88bc4e9f48 | history/tasks/gateio-live-manual-order-ada-short-2026-05-23-task.md |
| connected_to | project:soar:7c70e892d7 | task:gate-io-live-reconciliation-scope:84f645d2e8 | history/tasks/gateio-live-reconciliation-scope-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:learning-journal:c5626339c3 | .codex/context/LEARNING_JOURNAL.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1009-source-control-closure-luc-983-luc-994-and-luc-1004:e9f7ada751 | history/tasks/luc-1009-source-control-closure-luc-983-luc-994-luc-1004-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1026-account-access-useauth-local-proof:c92ff7d740 | history/tasks/luc-1026-account-access-useauth-local-proof-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1027-child-read-only-failed-deploy-diagnosis-2026-05-31:7aabac40e4 | history/tasks/luc-1027-child-read-only-failed-deploy-diagnosis-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1027-soar-coolify-production-deploy-health-sweep-2026-05-31:08222209df | history/tasks/luc-1027-soar-coolify-production-deploy-health-sweep-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-103-source-control-closure-2026-05-26-task:5797dc0746 | history/tasks/luc-103-source-control-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1032-resolveopsauthtoken-and-runcontrolledlivesessionproof-runtime-proof-refresh:83a2bf0f21 | history/tasks/luc-1032-runtime-proof-refresh-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-105-runtime-signal-loop-test-closure-repair-2026-05-26:aa7633a58c | history/tasks/luc-105-runtime-signal-loop-test-closure-repair-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1065-soar-coolify-production-deploy-health-sweep-2026-05-31:662535a06a | history/tasks/luc-1065-soar-coolify-production-deploy-health-sweep-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-107-coolify-production-deploy-health-sweep-2026-05-26:24df882fdd | history/tasks/luc-107-coolify-production-deploy-health-sweep-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1071-account-access-countruntimemanagedpositions-proof:aabc4e88ef | history/tasks/luc-1071-account-access-countruntimemanagedpositions-proof-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1075-account-access-getruntimepositionbotcontext-proof:74fe68f4e5 | history/tasks/luc-1075-account-access-getruntimepositionbotcontext-proof-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1079-account-access-listruntimemanagedpositions-proof:b0b621030f | history/tasks/luc-1079-account-access-listruntimemanagedpositions-proof-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1080-infra-gate-diagnose-production-dns-network-failure-for-luc-241-2026-05-31-task:7ce4e4941f | history/tasks/luc-1080-infra-gate-diagnose-production-dns-network-failure-for-luc-241-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1083-account-access-listruntimeopenorders-proof:03797ca706 | history/tasks/luc-1083-account-access-listruntimeopenorders-proof-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1085-account-access-listruntimeopenorders-doc-link-closure:251bd9dad2 | history/tasks/luc-1085-account-access-listruntimeopenorders-doc-link-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1087-account-access-listruntimepositionlastprices-proof:18797e03d8 | history/tasks/luc-1087-account-access-listruntimepositionlastprices-proof-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1089-account-access-listruntimepositionlastprices-doc-link-closure:418d870d18 | history/tasks/luc-1089-account-access-listruntimepositionlastprices-doc-link-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1091-account-access-listruntimepositionstrategies-proof:795aacecd4 | history/tasks/luc-1091-account-access-listruntimepositionstrategies-proof-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1094-account-access-listruntimepositionstrategies-doc-link-closure:93caeed90e | history/tasks/luc-1094-account-access-listruntimepositionstrategies-doc-link-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1096-account-access-listruntimepositiontraderows-proof:11de1ab48b | history/tasks/luc-1096-account-access-listruntimepositiontraderows-proof-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1098-account-access-listruntimepositiontraderows-doc-link-closure:e75012b2e8 | history/tasks/luc-1098-account-access-listruntimepositiontraderows-doc-link-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1100-account-access-sumruntimemanagedpositionmarginused-proof:31df3a2003 | history/tasks/luc-1100-account-access-sumruntimemanagedpositionmarginused-proof-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1102-account-access-sumruntimemanagedpositionmarginused-doc-link-closure:a46ac399c2 | history/tasks/luc-1102-account-access-sumruntimemanagedpositionmarginused-doc-link-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1104-source-control-closure-classify-and-close-local-dirty-state-for-luc-1067-luc-1069:5b3958ff3b | history/tasks/luc-1104-source-control-closure-classify-and-close-local-dirty-state-for-luc-1067-luc-1069-luc-1071-luc-1073-plus-14-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1105-soar-coolify-production-deploy-health-sweep-2026-05-31:68ba559700 | history/tasks/luc-1105-soar-coolify-production-deploy-health-sweep-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1108-account-access-sumruntimemanagedpositionquantity-proof:8474c88aea | history/tasks/luc-1108-account-access-sumruntimemanagedpositionquantity-proof-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1111-account-access-sumruntimemanagedpositionquantity-doc-link-closure:611d10f85c | history/tasks/luc-1111-account-access-sumruntimemanagedpositionquantity-doc-link-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1116-task-account-access-sumruntimemanagedpositionrealizedpnl-proof:7c7a8bc70e | history/tasks/luc-1116-account-access-sumruntimemanagedpositionrealizedpnl-proof-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1120-source-control-closure-classify-and-close-local-dirty-state-for-luc-149:66a9a2c378 | history/tasks/luc-1120-source-control-closure-classify-and-close-local-dirty-state-for-luc-149-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1124-public-read-only-browser-proof:876fe4f1c1 | history/tasks/luc-1124-public-read-only-browser-proof-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-115-luc-86-ops-evidence-closure-2026-05-26:c22069664f | history/tasks/luc-115-luc-86-ops-evidence-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1152-admin-operation-get-root-doc-link-closure:61267e411b | history/tasks/luc-1152-admin-operation-get-doc-link-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1155-admin-operation-use-users-missing-test-link-closure:9033f8f025 | history/tasks/luc-1155-admin-operation-use-users-missing-test-link-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1160-soar-production-stability-diagnose-coolify-restart-loop-and-runtime-crash-cause-2:165294b858 | history/tasks/luc-1160-soar-production-stability-diagnose-coolify-restart-loop-and-runtime-crash-cause-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1162-account-access-use-users-doc-link-closure:f46f93f7f3 | history/tasks/luc-1162-account-access-use-users-doc-link-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1165-gate-io-position-ingestion-and-exchange-sync-fix:dabee5ce03 | history/tasks/luc-1165-soar-gateio-fix-production-position-ingestion-and-exchange-sync-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1166-admin-operation-use-admin-missing-test-link-closure:a05de8c133 | history/tasks/luc-1166-admin-operation-use-admin-missing-test-link-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1175-account-access-use-admin-missing-doc-link-closure:f5d6c8a4bb | history/tasks/luc-1175-account-access-use-admin-missing-doc-link-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1175-soar-v1-conformance-frontend-verification-2026-06-01:2b61a67754 | history/tasks/luc-1175-soar-v1-conformance-frontend-verify-dashboard-active-bot-context-signals-and-trading-ux-display-2026-06-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1176-soar-v1-conformance-qa-build-v1-acceptance-matrix-and-regression-evidence-map:789f23f45e | history/tasks/luc-1176-soar-v1-conformance-qa-build-v1-acceptance-matrix-and-regression-evidence-map-2026-06-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1177-soar-v1-conformance-ops-reconcile-deploy-coolify-restart-evidence-and-release-rea:abd1440228 | history/tasks/luc-1177-soar-v1-conformance-ops-reconcile-deploy-coolify-restart-evidence-and-release-readiness-gates-2026-06-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-118-luc-107-coolify-health-evidence-closure-2026-05-26:1106793307 | history/tasks/luc-118-luc-107-coolify-health-evidence-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1186-soar-coolify-production-deploy-health-sweep-2026-06-01:ceabf40a9e | history/tasks/luc-1186-soar-coolify-production-deploy-health-sweep-2026-06-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1189-soar-v1-conformance-test-automation-worker-turn-acceptance-matrix-rows-into-execu:3fa6fc3be2 | history/tasks/luc-1189-soar-v1-conformance-test-automation-worker-turn-acceptance-matrix-rows-into-executable-regression-checks-2026-06-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-119-luc-98-release-permit-evidence-closure-2026-05-26:114a7e96b8 | history/tasks/luc-119-luc-98-release-permit-evidence-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1197-soar-backend-ops-luc-1188-unblock-workers-ready-contract-suite-and-close-readines:3d496682a8 | history/tasks/luc-1197-soar-backend-ops-luc-1188-unblock-workers-ready-contract-suite-and-close-readiness-proof-gap-2026-06-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1216-source-control-closure-task:484fcd077c | history/tasks/luc-1216-source-control-closure-for-luc-1198-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1237-soar-coolify-production-deploy-health-sweep-2026-06-01:72ff555902 | history/tasks/luc-1237-soar-coolify-production-deploy-health-sweep-2026-06-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1246-source-control-closure-task:5923836921 | history/tasks/luc-1246-source-control-closure-for-luc-1240-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1256-known-state-evidence-architecture-baseline-2026-06-01-task:d69613fb31 | history/tasks/luc-1256-known-state-evidence-architecture-baseline-2026-06-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1263-source-control-closure-task:a427214e66 | history/tasks/luc-1263-source-control-closure-for-luc-1259-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1277-soar-coolify-production-deploy-health-sweep-2026-06-01:9f05e8ba4b | history/tasks/luc-1277-soar-coolify-production-deploy-health-sweep-2026-06-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-130-luc-88-productivity-review-evidence-closure-2026-05-26:4c8237b1c5 | history/tasks/luc-130-luc-88-productivity-review-evidence-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1307-soar-coolify-production-deploy-health-sweep-2026-06-01:f2b6c63f0f | history/tasks/luc-1307-soar-coolify-production-deploy-health-sweep-2026-06-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-131-luc-86-latest-health-sweep-task-closure-2026-05-26:2ecee2d981 | history/tasks/luc-131-luc-86-latest-health-sweep-task-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-132-luc-19-runtime-readiness-task-closure-2026-05-26:fb150b0445 | history/tasks/luc-132-luc-19-runtime-readiness-task-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-135-source-control-closure-artifacts-lane-2026-05-26:0f14e401a7 | history/tasks/luc-135-source-control-closure-artifacts-lane-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-137-docs-operations-closure-bundle-2026-05-26:d3cd9bdf63 | history/tasks/luc-137-docs-operations-closure-bundle-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1371-reconcile-coolify-resource-inventory:23deaf26cf | history/tasks/luc-1371-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1371-soar-coolify-resource-inventory-task:2bb9896e56 | history/tasks/luc-1371-soar-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1399-reconcile-coolify-resource-inventory-task:b04fc726ea | history/tasks/luc-1399-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-140-closure-lane-provenance-packets-2026-05-26:23127d5941 | history/tasks/luc-140-closure-lane-provenance-packets-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1400-source-control-closure-2026-07-17-task:600d967e74 | history/tasks/luc-1400-source-control-closure-2026-07-17-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1405-use-profile-security-stale-missing-doc-link-reconciliation:1c1f54e32a | history/tasks/luc-1405-use-profile-security-stale-missing-doc-link-reconciliation-2026-07-18-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1419-restore-local-db-backed-api-e2e-runtime-for-close-authority-route-proof:8f1c70f6ef | history/tasks/luc-1419-restore-local-db-backed-api-e2e-runtime-for-close-authority-route-proof-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-142-history-evidence-closure-bundle-2026-05-26:5bdd3087aa | history/tasks/luc-142-history-evidence-closure-bundle-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1435-verify-coolify-redeploy-and-production-smoke:da1601b18a | history/tasks/luc-1435-verify-coolify-redeploy-production-smoke-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-145-recent-closure-provenance-packets-2026-05-26:70468bc416 | history/tasks/luc-145-recent-closure-provenance-packets-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1456-account-access-use-dashboard-missing-doc-link-closure:72e4786407 | history/tasks/luc-1456-account-access-use-dashboard-missing-doc-link-2026-07-18-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1458-source-control-closure-for-luc-1456:f3a91589c5 | history/tasks/luc-1458-source-control-closure-classify-and-close-local-dirty-state-for-luc-1456-2026-07-18-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1461-source-control-closure-for-luc-1460:d74273868f | history/tasks/luc-1461-source-control-closure-classify-and-close-local-dirty-state-for-luc-1460-2026-07-18-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1465-source-control-closure-for-luc-1464:8e6b8a8390 | history/tasks/luc-1465-source-control-closure-classify-and-close-local-dirty-state-for-luc-1464-2026-07-18-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1467-review-productivity-resume-delta-2026-07-22-task:3e1bc15f6b | history/tasks/luc-1467-review-productivity-resume-delta-2026-07-22-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-147-history-plans-closure-bundle-2026-05-26:5609dd3b49 | history/tasks/luc-147-history-plans-closure-bundle-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-15-live-project-status-and-decision-dashboard:b7637847fc | history/tasks/luc-15-live-project-status-and-decision-dashboard-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-152-latest-closure-provenance-packets-2026-05-26:7c9819a920 | history/tasks/luc-152-latest-closure-provenance-packets-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-153-coolify-production-deploy-health-sweep-2026-05-26:0587bfeebd | history/tasks/luc-153-coolify-production-deploy-health-sweep-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1531-source-control-closure-for-luc-1359-luc-1460-luc-1528:2dbd4a7313 | history/tasks/luc-1531-source-control-closure-classify-and-close-local-dirty-state-for-luc-1359-luc-1460-luc-1528-2026-07-20-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1565-reconcile-coolify-resource-inventory-2026-06-02:5a5d64106d | history/tasks/luc-1565-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1569-reconcile-coolify-resource-inventory-2026-06-02:d39c0fbf30 | history/tasks/luc-1569-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1574-confirm-coolify-team-workspace-task:00c6f258d5 | history/tasks/luc-1574-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1575-reconcile-coolify-resource-inventory-2026-06-02:a7393b9357 | history/tasks/luc-1575-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-158-luc-153-coolify-health-evidence-closure-2026-05-26:b541acd428 | history/tasks/luc-158-luc-153-coolify-health-evidence-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1580-confirm-coolify-team-workspace-task:910c57a802 | history/tasks/luc-1580-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1581-reconcile-coolify-resource-inventory-2026-06-02:a6a52516a7 | history/tasks/luc-1581-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1584-reconcile-coolify-resource-inventory-2026-06-02:5ba9a079ed | history/tasks/luc-1584-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1585-confirm-coolify-team-workspace-task:eff88cdf35 | history/tasks/luc-1585-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1592-confirm-coolify-team-workspace-task:5fa6b69914 | history/tasks/luc-1592-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1593-reconcile-coolify-resource-inventory-2026-06-02:ca1be4dc3f | history/tasks/luc-1593-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1595-source-control-closure-for-luc-1591:a87e096978 | history/tasks/luc-1595-source-control-closure-classify-and-close-local-dirty-state-for-luc-1591-2026-07-21-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1599-reconcile-coolify-resource-inventory-2026-06-02:7b93f98645 | history/tasks/luc-1599-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-15c-cto-lane-child-issue:3a88094a29 | history/tasks/luc-15-cto-lane-child-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-15d-docs-lane-child-issue:d76bc7e2f3 | history/tasks/luc-15-docs-lane-child-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-15i-implementation-lane-child-issue:fd2cf05628 | history/tasks/luc-15-implementation-lane-child-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-15o-ops-lane-child-issue:4453679051 | history/tasks/luc-15-ops-lane-child-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-15p-product-lane-child-issue:3c56fc2d12 | history/tasks/luc-15-product-lane-child-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-15q-qa-lane-child-issue:b3d4fa0376 | history/tasks/luc-15-qa-lane-child-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-15x-ux-lane-child-issue:41deb76613 | history/tasks/luc-15-ux-lane-child-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-160-luc-158-provenance-packet-closure-2026-05-26:e58e5a521a | history/tasks/luc-160-luc-158-provenance-packet-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1605-reconcile-coolify-resource-inventory-2026-06-02:1cce5a41ce | history/tasks/luc-1605-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1610-reconcile-coolify-resource-inventory-2026-06-02:5b6af7a7aa | history/tasks/luc-1610-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1612-source-control-closure-for-luc-1603:5d67d3e572 | history/tasks/luc-1612-source-control-closure-classify-and-close-local-dirty-state-for-luc-1603-2026-07-21-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1620-reconcile-coolify-resource-inventory-2026-06-03:8dfd70fa60 | history/tasks/luc-1620-reconcile-coolify-resource-inventory-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1624-reconcile-coolify-resource-inventory-2026-06-03:5b46c36a08 | history/tasks/luc-1624-reconcile-coolify-resource-inventory-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1627-source-control-closure-for-luc-1467-luc-1613:90067237d9 | history/tasks/luc-1627-source-control-closure-classify-and-close-local-dirty-state-for-luc-1467-luc-1613-2026-07-22-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-164-luc-160-provenance-packet-closure-2026-05-26:18b71b16b5 | history/tasks/luc-164-luc-160-provenance-packet-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1641-source-control-closure-for-luc-1639:df6cff3096 | history/tasks/luc-1641-source-control-closure-classify-and-close-local-dirty-state-for-luc-1639-2026-07-22-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-166-luc-164-provenance-packet-closure-2026-05-26:d2cc5d83e8 | history/tasks/luc-166-luc-164-provenance-packet-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1663-source-control-closure:68d4eb1377 | history/tasks/luc-1663-source-control-close-dynamic-bot-runtime-proof-refresh-2026-07-22-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1672-confirm-coolify-team-workspace:260ac4fbc0 | history/tasks/luc-1672-confirm-coolify-team-workspace-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-169-luc-166-provenance-packet-closure-2026-05-26:70d252d3ed | history/tasks/luc-169-luc-166-provenance-packet-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-170-account-access-first-doc-rows:f81caa350f | history/tasks/luc-170-account-access-first-doc-rows-2026-07-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-171-luc-169-provenance-packet-closure-2026-05-26:93b4d576c3 | history/tasks/luc-171-luc-169-provenance-packet-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-172-protected-authenticated-browser-proof-packet:c23c159399 | history/tasks/luc-172-protected-authenticated-browser-proof-packet-2026-07-10-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1734-restore-owner-path-for-coolify-inventory-lane:effa2c2808 | history/tasks/luc-1734-restore-owner-path-for-coolify-inventory-lane-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1739-coolify-read-only-access-source-control-closure:00bda71cb9 | history/tasks/luc-1739-coolify-read-only-access-source-control-closure-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-174-protected-trading-readback-vs-live-mutation-approval-packet:9ef895074b | history/tasks/luc-174-protected-trading-readback-live-mutation-approval-packet-2026-07-10-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1755-rollback-guard-protected-evidence:c8c0bba716 | history/tasks/luc-1755-rollback-guard-protected-evidence-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-176-account-access-clearsession-project-truth-proof:402d42c4ac | history/tasks/luc-176-account-access-clearsession-project-truth-proof-2026-07-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1763-bind-rollback-guard-protected-inputs:036d0b8ef4 | history/tasks/luc-1763-bind-rollback-guard-protected-inputs-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1767-bind-rollback-guard-protected-runner-inputs:d7b4d105ae | history/tasks/luc-1767-bind-rollback-guard-protected-runner-inputs-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1769-approve-source-read-only-app-smoke-auth-class:da836da80f | history/tasks/luc-1769-approve-source-read-only-app-smoke-auth-class-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-18-qa-regression-and-smoke-evidence-baseline-2026-05-25:cfe6a58488 | history/tasks/luc-18-qa-regression-smoke-baseline-2026-05-25.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1822-operator-coolify-read-only-production-status-access:d121137c2c | history/tasks/luc-1822-operator-coolify-bind-read-only-production-status-access-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1828-operator-coolify-read-only-production-status-access:f559d9c78f | history/tasks/luc-1828-operator-coolify-bind-read-only-production-status-access-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1831-operator-coolify-read-only-production-status-access:7823dcf416 | history/tasks/luc-1831-operator-coolify-bind-read-only-production-status-access-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1838-source-control-dirty-worktree-classification-and-closure:29b99b8cdf | history/tasks/luc-1838-source-control-classify-and-close-local-dirty-worktree-groups-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1843-operator-coolify-read-only-production-status-access:13c7e05be7 | history/tasks/luc-1843-operator-coolify-bind-read-only-production-status-access-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1850-operator-coolify-bind-read-only-production-status-access:3546336585 | history/tasks/luc-1850-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1857-operator-coolify-bind-read-only-production-status-access:c751aadb7d | history/tasks/luc-1857-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-192-no-stall-queue-expeditor-2026-05-26:65b826544b | history/tasks/luc-192-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1925-source-control-closure-task:9373aeee9f | history/tasks/luc-1925-source-control-close-local-dirty-state-for-luc-1910-luc-1916-luc-1919-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1933-task-contract-coolify-read-only-production-status-access:cc5307829f | history/tasks/luc-1933-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1940-api-data-n-a-semantics-for-medium-graph-gaps:f953896f9d | history/tasks/luc-1940-api-data-na-semantics-medium-graph-gaps-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1941-medium-graph-cleanup-queue-closure:e38e720057 | history/tasks/luc-1941-medium-graph-cleanup-queue-closure-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1944-assistant-dry-run-boundary-and-schema-drift:b69017d9f7 | history/tasks/luc-1944-assistant-dry-run-boundary-schema-drift-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1945-adversarial-api-platform-and-assistant-regression-proof:e4dbd1adbd | history/tasks/luc-1945-adversarial-api-assistant-regression-proof-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1946-route-rate-limit-redis-client-errors-through-redacted-logger:572775ba1e | history/tasks/luc-1946-route-rate-limit-redis-client-errors-through-redacted-logger-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1951-task-contract-coolify-read-only-production-status-access:a559f50f50 | history/tasks/luc-1951-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1952-source-control-closure-for-luc-1933-luc-1939-luc-1940-luc-1941-plus-five:d481c8772b | history/tasks/luc-1952-source-control-close-local-dirty-state-for-luc-1933-luc-1939-luc-1940-luc-1941-plus-5-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1953-task-contract-coolify-read-only-production-status-access:f2522ded82 | history/tasks/luc-1953-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1968-source-control-closure-for-luc-241:2eb2fb2cc1 | history/tasks/luc-1968-source-control-close-local-dirty-state-for-luc-241-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1969-task-contract-coolify-read-only-production-status-access:2626dedc09 | history/tasks/luc-1969-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1973-task-contract-coolify-read-only-production-status-access:9d750950ff | history/tasks/luc-1973-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1976-task-contract-source-control-close-local-dirty-state-for-luc-1973:000c6efac2 | history/tasks/luc-1976-source-control-close-local-dirty-state-for-luc-1973-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1977-task-contract-coolify-read-only-production-status-access:9f9b5bc55f | history/tasks/luc-1977-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1982-task-contract-coolify-read-only-production-status-access:645bb6bd4f | history/tasks/luc-1982-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1986-task-contract-source-control-close-local-dirty-state-for-luc-1977-luc-1982:e7fa7e09ad | history/tasks/luc-1986-source-control-close-local-dirty-state-for-luc-1977-luc-1982-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1987-task-contract-coolify-read-only-production-status-access:93c4b59baf | history/tasks/luc-1987-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-199-no-stall-queue-expeditor-2026-05-26:def023cb57 | history/tasks/luc-199-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1990-task-contract-coolify-read-only-production-status-access:e28ff2966b | history/tasks/luc-1990-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1992-task-contract-source-control-closure-for-luc-1987-luc-1990:ee53f58307 | history/tasks/luc-1992-source-control-close-local-dirty-state-for-luc-1987-luc-1990-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1993-task-contract-coolify-read-only-production-status-access:5a7e6af7c6 | history/tasks/luc-1993-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1996-task-contract-source-control-closure-for-luc-1993:8eb9b911ee | history/tasks/luc-1996-source-control-close-local-dirty-state-for-luc-1993-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1997-task-contract-coolify-read-only-production-status-access:cbb2a56e2b | history/tasks/luc-1997-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2003-task-contract-source-control-closure-for-luc-1997:0deb8044d8 | history/tasks/luc-2003-source-control-close-local-dirty-state-for-luc-1997-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2004-task-contract-coolify-read-only-production-status-access:7d6eaae5dc | history/tasks/luc-2004-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2014-task-contract-coolify-read-only-production-status-access:aa20e6effb | history/tasks/luc-2014-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2018-api-platform-safety-and-assistant-red-team-proof-map:084395af78 | history/tasks/luc-2018-api-platform-safety-assistant-red-team-proof-map-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-202-no-stall-queue-expeditor-2026-05-26:fea4c180ea | history/tasks/luc-202-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2034-task-contract-coolify-read-only-production-status-access:d697717a68 | history/tasks/luc-2034-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2039-task-contract-coolify-read-only-production-status-access:636e063fa4 | history/tasks/luc-2039-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-204-no-stall-queue-expeditor-2026-05-26:a358ddf826 | history/tasks/luc-204-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2043-task-contract-coolify-read-only-production-status-access:04fca5999d | history/tasks/luc-2043-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2044-source-control-closure:54c94a7be2 | history/tasks/luc-2044-source-control-close-local-dirty-state-for-luc-2014-luc-2018-luc-2020-luc-2021-plus-4-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2045-task-contract-coolify-read-only-production-status-access:7eef2b9cfe | history/tasks/luc-2045-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2046-task-contract-source-control-closure-for-luc-2045:35b1a63723 | history/tasks/luc-2046-source-control-close-local-dirty-state-for-luc-2045-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2054-task-contract-coolify-read-only-production-status-access:115d47b9f4 | history/tasks/luc-2054-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2055-api-platform-safety-architecture-gap-review:fc9c88f33d | history/tasks/luc-2055-api-platform-safety-architecture-gap-review-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2057-local-protected-wallet-route-action-proof-task:2bc9484684 | history/tasks/luc-2057-local-protected-wallet-route-action-proof-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2064-source-control-closure-current-luc-402-dirty-packet:09ba7b1bdc | history/tasks/luc-2064-source-control-classify-current-luc-402-dirty-packet-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2069-operator-coolify-bind-read-only-production-status-access:6bdaabd484 | history/tasks/luc-2069-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-207-v1-audit-to-completion-controller-2026-05-26:b7f0720532 | history/tasks/luc-207-v1-audit-to-completion-controller-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2072-operator-coolify-bind-read-only-production-status-access:136eb49614 | history/tasks/luc-2072-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2078-source-control-closure-for-luc-2069-through-luc-2072:d6aeccca26 | history/tasks/luc-2078-source-control-classify-and-close-local-dirty-state-for-luc-2069-luc-2072-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2079-operator-coolify-bind-read-only-production-status-access:75d712cb79 | history/tasks/luc-2079-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-208-no-stall-queue-expeditor-2026-05-26:c132972851 | history/tasks/luc-208-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2085-operator-coolify-bind-read-only-production-status-access:9c6892208d | history/tasks/luc-2085-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2086-task-contract-source-control-closure-for-luc-2079-through-luc-2085:87e01415df | history/tasks/luc-2086-source-control-close-local-dirty-state-for-luc-2079-luc-2085-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2087-operator-coolify-bind-read-only-production-status-access:9fd7161da6 | history/tasks/luc-2087-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2091-operator-coolify-bind-read-only-production-status-access:0a36e36d72 | history/tasks/luc-2091-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2093-source-control-close-local-dirty-state-for-luc-2087-luc-2091:3452b08ff9 | history/tasks/luc-2093-source-control-close-local-dirty-state-for-luc-2087-luc-2091-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2094-operator-coolify-bind-read-only-production-status-access:9872f60acd | history/tasks/luc-2094-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2095-source-control-close-local-dirty-state-for-luc-2094:a3090a5866 | history/tasks/luc-2095-source-control-close-local-dirty-state-for-luc-2094-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2099-operator-coolify-bind-read-only-production-status-access:1fee3311a2 | history/tasks/luc-2099-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-21-soar-local-architecture-and-repo-preflight:f20d9ed387 | history/tasks/luc-21-soar-local-architecture-repo-preflight-2026-07-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2112-operator-coolify-bind-read-only-production-status-access:b39374dc83 | history/tasks/luc-2112-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2117-operator-coolify-bind-read-only-production-status-access:d5e88b3137 | history/tasks/luc-2117-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2122-operator-coolify-bind-read-only-production-status-access:11c98d2240 | history/tasks/luc-2122-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2130-operator-coolify-bind-read-only-production-status-access:ccadfb8e43 | history/tasks/luc-2130-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2136-operator-coolify-bind-read-only-production-status-access:e4d724a07a | history/tasks/luc-2136-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2149-operator-coolify-bind-read-only-production-status-access:76bf53818f | history/tasks/luc-2149-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2162-operator-coolify-bind-read-only-production-status-access:b880ca8253 | history/tasks/luc-2162-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2168-engine-runtime-model-doc-graph-relations:cc6639d032 | history/tasks/luc-2168-engine-runtime-model-doc-graph-relations-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2171-operator-coolify-bind-read-only-production-status-access:4a08b63672 | history/tasks/luc-2171-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2173-operator-coolify-bind-read-only-production-status-access:f9a17da310 | history/tasks/luc-2173-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2181-operator-coolify-bind-read-only-production-status-access:f6638f79a7 | history/tasks/luc-2181-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2185-operator-coolify-bind-read-only-production-status-access:ccff751018 | history/tasks/luc-2185-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2187-inspect-high-signal-missing-test-relation-families:7669b437b7 | history/tasks/luc-2187-inspect-high-signal-missing-test-relation-families-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2188-dynamic-protected-route-fixture-proof:bb91787e43 | history/tasks/luc-2188-dynamic-protected-route-fixture-proof-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-219-no-stall-queue-expeditor-2026-05-26:978ad404b3 | history/tasks/luc-219-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2196-operator-coolify-bind-read-only-production-status-access:3e8f0c19cd | history/tasks/luc-2196-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2197-classify-current-actionable-missing-test-rows-from-architecture-awareness:f64f78bfa8 | history/tasks/luc-2197-classify-current-actionable-missing-test-rows-architecture-awareness-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2198-repair-script-tooling-missing-test-relation-backlog:e17604685e | history/tasks/luc-2198-repair-script-tooling-missing-test-relation-backlog-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-22-first-safe-repair-lane-task:8baf28a3ae | history/tasks/luc-22-first-safe-repair-lane-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2200-money-facing-runtime-residual-missing-test-families:6fbc67ddd5 | history/tasks/luc-2200-money-facing-runtime-residual-missing-test-families-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2204-operator-coolify-bind-read-only-production-status-access:1bce2afedf | history/tasks/luc-2204-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2208-operator-coolify-bind-read-only-production-status-access:c30518f72d | history/tasks/luc-2208-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-221-no-stall-queue-expeditor-2026-05-27:465dab6e06 | history/tasks/luc-221-no-stall-queue-expeditor-2026-05-27-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2222-operator-coolify-bind-read-only-production-status-access:ab4986e0b2 | history/tasks/luc-2222-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2225-operator-coolify-bind-read-only-production-status-access:a4db5d2792 | history/tasks/luc-2225-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2230-close-current-actionable-missing-test-relation-buckets:033d271301 | history/tasks/luc-2230-close-current-actionable-missing-test-relation-buckets-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2233-refresh-journey-evidence-indexes-after-current-graph-state:6cf4de4a24 | history/tasks/luc-2233-refresh-journey-evidence-indexes-current-graph-state-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2239-operator-coolify-bind-read-only-production-status-access:1b239409be | history/tasks/luc-2239-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2251-operator-coolify-bind-read-only-production-status-access:a003c8fb86 | history/tasks/luc-2251-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2252-repair-top-release-ops-script-missing-test-relations:b87c608007 | history/tasks/luc-2252-repair-top-release-ops-script-missing-test-relations-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2253-repair-api-script-tooling-missing-test-relations:e11ead77f9 | history/tasks/luc-2253-repair-api-script-tooling-missing-test-relations-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2260-operator-coolify-bind-read-only-production-status-access:d502d93352 | history/tasks/luc-2260-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2264-operator-coolify-bind-read-only-production-status-access:996cff8193 | history/tasks/luc-2264-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2269-operator-coolify-bind-read-only-production-status-access:1d38b3fd79 | history/tasks/luc-2269-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2279-retrieve-redacted-pre-crash-coolify-host-logs-for-soar-api-restart:47d83a752d | history/tasks/luc-2279-retrieve-redacted-pre-crash-coolify-host-logs-for-soar-api-restart-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-228-v1-audit-to-completion-controller-2026-05-27:06b4ec96fb | history/tasks/luc-228-v1-audit-to-completion-controller-2026-05-27-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2280-controlled-soar-web-restart-for-503-restarting-state-2026-06-05:2c971cf95e | history/tasks/luc-2280-controlled-soar-web-restart-for-503-restarting-state-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2280-controlled-soar-web-restart:cc08910835 | history/tasks/luc-2280-controlled-soar-web-restart-503-restarting-state-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2281-approve-redacted-host-log-export-path-for-soar-api-crash-window:55cb8827d3 | history/tasks/luc-2281-approve-redacted-host-log-export-path-for-soar-api-crash-window-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2282-prepare-soar-web-rollback-or-redeploy-permit:8c5294f11c | history/tasks/luc-2282-prepare-soar-web-rollback-or-redeploy-permit-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2285-clear-soar-web-queued-deployments-and-redeploy-main-sha:4f94a76138 | history/tasks/luc-2285-clear-soar-web-queued-deployments-and-redeploy-main-sha-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2286-choose-next-soar-web-recovery-action-after-restart-503:15a7d0de3f | history/tasks/luc-2286-choose-next-soar-web-recovery-action-after-restart-503-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2287-clear-stuck-coolify-soar-web-deploy-queue:45777bc4cd | history/tasks/luc-2287-clear-stuck-coolify-soar-web-deploy-queue-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2289-approve-redacted-soar-web-deployment-log-export:d40b93e30a | history/tasks/luc-2289-approve-redacted-soar-web-deployment-log-export-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2290-operator-coolify-bind-read-only-production-status-access:8da3c3971b | history/tasks/luc-2290-operator-coolify-bind-read-only-production-status-access-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2291-investigate-soar-api-node-heap-oom-root-cause:687994a26c | history/tasks/luc-2291-investigate-soar-api-node-heap-oom-root-cause-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2292-task-contract-controlled-soar-web-redeploy-from-pushed-main:d9762503de | history/tasks/luc-2292-controlled-soar-web-redeploy-from-pushed-main-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2293-task-contract-controlled-soar-web-rollback-to-previous-candidate:928725de1d | history/tasks/luc-2293-controlled-soar-web-rollback-to-previous-candidate-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2293-task-contract-controlled-soar-web-rollback-to-previous-source-candidate:bdee7646fa | history/tasks/luc-2293-controlled-soar-web-rollback-to-previous-source-candidate-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2294-security-approval-for-redacted-soar-web-rollback-log-export-path:67cfa85881 | history/tasks/luc-2294-approve-redacted-soar-web-rollback-log-export-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2297-retrieve-redacted-soar-web-crash-logs-after-queue-clear:548f0c83e8 | history/tasks/luc-2297-retrieve-redacted-soar-web-crash-logs-after-queue-clear-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2298-retrieve-redacted-soar-web-deployment-history-and-prepare-rollback-permit:15c9b0ac14 | history/tasks/luc-2298-retrieve-redacted-soar-web-deployment-history-and-prepare-rollback-permit-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-230-no-stall-queue-expeditor-2026-05-27:78ebcd6427 | history/tasks/luc-230-no-stall-queue-expeditor-2026-05-27-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2300-bound-runtime-aggregate-trade-position-materialization:885cc1f9fd | history/tasks/luc-2300-bound-runtime-aggregate-trade-position-materialization-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2302-task-contract-select-next-soar-web-recovery-path-after-rollback-failed-closed:bcffbc9bd6 | history/tasks/luc-2302-select-next-soar-web-recovery-path-after-rollback-failed-closed-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2305-redacted-soar-web-container-runtime-crash-investigation:bfa3e9791b | history/tasks/luc-2305-redacted-soar-web-container-runtime-crash-investigation-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2312-source-control-closure:53bc9e9e14 | history/tasks/luc-2312-source-control-closure-luc-1160-plus-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2313-operator-coolify-bind-read-only-production-status-access:b344ac1388 | history/tasks/luc-2313-operator-coolify-bind-read-only-production-status-access-2026-06-06-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2316-operator-coolify-bind-read-only-production-status-access:1c71eedc8e | history/tasks/luc-2316-operator-coolify-bind-read-only-production-status-access-2026-06-06-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2329-gap-register-and-repair-lane-refresh-task:9b3e416602 | history/tasks/luc-2329-gap-register-and-repair-lane-refresh-2026-06-06-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2340-source-control-closure:76ff6bbf38 | history/tasks/luc-2340-source-control-close-post-luc-2312-v1-controller-dirty-state-2026-06-06-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2341-source-control-closure-post-aggregate-proof-dirty-state:aa444f3ae0 | history/tasks/luc-2341-source-control-closure-post-aggregate-proof-dirty-state-2026-06-06-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-235-no-stall-queue-expeditor-2026-05-27:1464183418 | history/tasks/luc-235-no-stall-queue-expeditor-2026-05-27-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2354-gap-register-and-repair-lane-refresh-task:3367ffb2ab | history/tasks/luc-2354-gap-register-and-repair-lane-refresh-2026-06-06-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2356-no-stall-queue-expeditor-2026-06-06:fa2e79b603 | history/tasks/luc-2356-no-stall-queue-expeditor-2026-06-06-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2361-final-post-aggregate-release-gate-for-de3db789:6257e8d8c6 | history/tasks/luc-2361-final-post-aggregate-release-gate-de3db789-2026-06-06-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2364-repair-release-guardrails-blocking-de3db789:b0c5b3bf4a | history/tasks/luc-2364-repair-release-guardrails-blocking-de3db789-2026-06-06-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2365-decide-push-and-production-promotion-path-for-de3db789:b724af920a | history/tasks/luc-2365-decide-push-and-production-promotion-path-for-de3db789-2026-06-06-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2367-decompose-bot-runtime-aggregate-read-model-monoliths:d2173e357f | history/tasks/luc-2367-decompose-bot-runtime-aggregate-read-model-monoliths-2026-06-06-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2368-decompose-bot-runtime-aggregate-read-model-monoliths:6d7f73ba0f | history/tasks/luc-2368-decompose-bot-runtime-aggregate-read-model-monoliths-2026-06-06-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2374-close-dirty-source-state-before-de3db789-push-decision:803969de16 | history/tasks/luc-2374-close-dirty-source-state-before-de3db789-push-decision-2026-06-06-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2380-close-post-2374-dirty-api-runtime-diff-before-push-permit:1099a2f756 | history/tasks/luc-2380-close-post-2374-dirty-api-runtime-diff-before-push-permit-2026-06-06-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2381-resolve-dirty-runtime-monitoring-source-state-blocking-4787ee98-promotion:0828b47396 | history/tasks/luc-2381-resolve-dirty-runtime-monitoring-source-state-blocking-4787ee98-promotion-2026-06-06-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2390-no-stall-queue-expeditor:d65acd41e2 | history/tasks/luc-2390-no-stall-queue-expeditor-2026-06-06-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2394-close-luc-2390-pm-coordination-dirty-state-before-push-permit:25e5062e06 | history/tasks/luc-2394-close-luc-2390-pm-coordination-dirty-state-before-push-permit-2026-06-06-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2395-gap-register-and-repair-lane-refresh-task:cf15a7a8ac | history/tasks/luc-2395-gap-register-and-repair-lane-refresh-2026-06-06-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2403-no-stall-queue-expeditor:ef93e79f77 | history/tasks/luc-2403-no-stall-queue-expeditor-2026-06-06-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2406-source-control-closure-for-luc-2403:2edc147d46 | history/tasks/luc-2406-source-control-closure-for-luc-2403-2026-06-06-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2409-no-stall-queue-expeditor:1cd764d221 | history/tasks/luc-2409-no-stall-queue-expeditor-2026-06-06-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2414-autonomous-idle-and-map-drift-sweep:39ed3d5952 | history/tasks/luc-2414-autonomous-idle-and-map-drift-sweep-2026-06-06-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-243-protected-production-input-inventory:8d4fef99da | history/tasks/luc-243-protected-production-input-inventory-2026-07-10-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-244-no-stall-queue-expeditor-2026-05-27:63e3325672 | history/tasks/luc-244-no-stall-queue-expeditor-2026-05-27-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-244-route-browser-review-slice-checklist-task:9250ac393e | history/tasks/luc-244-route-browser-review-slice-checklist-2026-07-10-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2461-security-and-account-access-gate-sweep:f1bd2230bc | history/tasks/luc-2461-security-account-access-gate-sweep-2026-06-06-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2463-autonomous-idle-and-map-drift-sweep:d845255bd4 | history/tasks/luc-2463-autonomous-idle-and-map-drift-sweep-2026-06-06-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2479-runtime-automation-helper-tests:937715bc9f | history/tasks/luc-2479-runtime-automation-helper-tests-2026-06-06-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-251-no-stall-queue-expeditor-2026-05-27:473fad3ca2 | history/tasks/luc-251-no-stall-queue-expeditor-2026-05-27-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-252-arb-001-security-disposition:c0e8cd7b7e | history/tasks/luc-252-arb-001-security-disposition-2026-07-10-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-255-arb-004-ui-scorecard-tbd-metrics-source-truth:eac17f9eca | history/tasks/luc-255-arb-004-ui-scorecard-tbd-metrics-source-truth-2026-07-10-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2553-no-stall-queue-expeditor:c0072272bb | history/tasks/luc-2553-no-stall-queue-expeditor-2026-06-06-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-256-arb-005-docs-parity-pipeline-enforcement:a35f7cb637 | history/tasks/luc-256-arb-005-docs-parity-pipeline-enforcement-2026-07-10-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2565-architecture-high-risk-security-proof-gap-review:978a7eea39 | history/tasks/luc-2565-architecture-high-risk-security-proof-gap-review-2026-06-06-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2566-runtime-and-exchange-local-only-chain-audit-2026-06-06:22f485994d | history/tasks/luc-2566-runtime-exchange-local-only-chain-audit-2026-06-06-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2568-sync-architecture-gap-backlog-ledgers-task:e922ba9a8d | history/tasks/luc-2568-sync-architecture-gap-backlog-ledgers-2026-06-06-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2578-position-reconciliation-helper-missing-test-links:13715785cd | history/tasks/luc-2578-position-reconciliation-helper-missing-test-links-2026-06-06-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2587-autonomous-idle-and-map-drift-sweep:4106db12b3 | history/tasks/luc-2587-autonomous-idle-and-map-drift-sweep-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2588-v1-audit-to-completion-controller:de8c2bb352 | history/tasks/luc-2588-v1-audit-to-completion-controller-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2590-coolify-production-deploy-health-sweep-2026-06-07:7d6f9510d1 | history/tasks/luc-2590-coolify-production-deploy-health-sweep-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2591-soar-pm-no-stall-queue-expeditor:af7f105d81 | history/tasks/luc-2591-no-stall-queue-expeditor-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2594-workers-execution-coolify-crash-metadata-diagnosis-2026-06-07:948d5e291b | history/tasks/luc-2594-workers-execution-coolify-crash-metadata-diagnosis-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2595-gap-register-and-repair-lane-refresh:934ff744a1 | history/tasks/luc-2595-gap-register-and-repair-lane-refresh-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2597-web-architecture-missing-test-link-families:0e1e42b4de | history/tasks/luc-2597-web-architecture-missing-test-link-families-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2598-no-stall-queue-expeditor:bad6e22d96 | history/tasks/luc-2598-no-stall-queue-expeditor-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2601-web-api-and-form-utility-missing-test-links:64cd53e38c | history/tasks/luc-2601-web-api-form-utility-missing-test-links-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2604-no-stall-queue-expeditor:093858a8dd | history/tasks/luc-2604-no-stall-queue-expeditor-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2607-web-theme-and-datatable-missing-test-links:80263e00d5 | history/tasks/luc-2607-web-theme-datatable-missing-test-links-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2608-no-stall-queue-expeditor:e98f0e03fc | history/tasks/luc-2608-no-stall-queue-expeditor-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2611-shared-ui-form-primitive-missing-test-links:2870dbe48f | history/tasks/luc-2611-shared-ui-form-primitive-missing-test-links-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2618-smoke-auth-binding-for-workers-ready:b40f356560 | history/tasks/luc-2618-smoke-auth-binding-workers-ready-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2619-provision-smoke-auth-binding-for-workers-ready:f88d97fb15 | history/tasks/luc-2619-provision-smoke-auth-binding-workers-ready-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2621-no-stall-queue-expeditor:cfdf6a8975 | history/tasks/luc-2621-no-stall-queue-expeditor-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2624-web-ui-form-layout-missing-test-links:549c168e5b | history/tasks/luc-2624-web-ui-form-layout-missing-test-links-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2628-no-stall-queue-expeditor:70ef06eaba | history/tasks/luc-2628-no-stall-queue-expeditor-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-263-account-access-requireauth-app-completion-proof-row:c01bd6bca1 | history/tasks/luc-263-account-access-requireauth-app-completion-proof-row-2026-07-10-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2631-web-pwa-service-worker-missing-test-links:247f33d41a | history/tasks/luc-2631-web-pwa-service-worker-missing-test-links-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2638-v1-audit-to-completion-controller:dbdf5f9458 | history/tasks/luc-2638-v1-audit-to-completion-controller-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-264-protected-input-readiness-binding-follow-up:6a11897db8 | history/tasks/luc-264-protected-input-readiness-binding-follow-up-2026-07-10-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2644-gap-register-and-repair-lane-refresh:54937aff46 | history/tasks/luc-2644-gap-register-and-repair-lane-refresh-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2645-dashboard-language-switcher-missing-test-link:8886ef154b | history/tasks/luc-2645-dashboard-language-switcher-missing-test-link-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2646-architecture-graph-drift-script-missing-test-links-2026-06-07:3ac71689fd | history/tasks/luc-2646-architecture-graph-drift-script-missing-test-links-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2647-no-stall-queue-expeditor:00654be220 | history/tasks/luc-2647-no-stall-queue-expeditor-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2650-route-reachable-i18n-audit-script-missing-test-links-2026-06-07:63fc2113f1 | history/tasks/luc-2650-route-reachable-i18n-audit-script-missing-test-links-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2661-ops-request-header-helper-missing-test-links:0da9e0a00e | history/tasks/luc-2661-ops-request-header-helper-missing-test-links-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2664-buildprojectindex-architecture-proof-gaps:9816f84c0b | history/tasks/luc-2664-buildprojectindex-architecture-proof-gaps-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2665-autonomous-idle-and-map-drift-sweep:f5a5e97d04 | history/tasks/luc-2665-autonomous-idle-and-map-drift-sweep-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2667-coolify-production-deploy-health-sweep-2026-06-07:0e7bc29d0d | history/tasks/luc-2667-coolify-production-deploy-health-sweep-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2668-no-stall-queue-expeditor:ee0d26a2ee | history/tasks/luc-2668-no-stall-queue-expeditor-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2671-reconcile-residual-architecture-awareness-top-samples:7ee6f11390 | history/tasks/luc-2671-reconcile-residual-architecture-awareness-top-samples-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2672-exclude-test-fixture-functions-from-actionable-missing-test-samples:cfb773f22d | history/tasks/luc-2672-exclude-test-fixture-functions-from-actionable-missing-test-samples-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2674-release-rc-slo-script-missing-test-links-2026-06-07:8abea56c4a | history/tasks/luc-2674-release-rc-slo-script-missing-test-links-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2678-rc-signoff-and-slo-window-missing-test-links-2026-06-07:55ac74fb4f | history/tasks/luc-2678-rc-signoff-slo-window-missing-test-links-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2685-v1-completion-scorecard-missing-test-links-2026-06-07:c2f1afb4da | history/tasks/luc-2685-v1-completion-scorecard-missing-test-links-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2693-v1-master-state-ledger-missing-test-links-2026-06-07:7a80222449 | history/tasks/luc-2693-v1-master-state-ledger-missing-test-links-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2695-no-stall-queue-expeditor-2026-06-07:e793733823 | history/tasks/luc-2695-no-stall-queue-expeditor-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2714-daily-project-status-refresh-2026-06-07:0cba1cae71 | history/tasks/luc-2714-daily-project-status-refresh-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2718-source-control-closure:d86031bcfb | history/tasks/luc-2718-source-control-closure-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2719-regression-evidence-sweep-2026-06-07:5539eb542a | history/tasks/luc-2719-regression-evidence-sweep-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2720-no-stall-queue-expeditor:8064f693ee | history/tasks/luc-2720-no-stall-queue-expeditor-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2725-docs-parity-checker-missing-test-links:ebb4475c35 | history/tasks/luc-2725-docs-parity-checker-missing-test-links-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2731-post-deploy-runtime-freshness-missing-test-links:bf8972612e | history/tasks/luc-2731-post-deploy-runtime-freshness-missing-test-links-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2733-protected-input-readiness-checker-missing-test-links-2026-06-07:25a26adc8e | history/tasks/luc-2733-protected-input-readiness-checker-missing-test-links-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2734-security-and-account-access-gate-sweep:fed5e275d5 | history/tasks/luc-2734-security-account-access-gate-sweep-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2738-architecture-awareness-after-protected-input-readiness-proof-closure-2026-06-07:3ef8325281 | history/tasks/luc-2738-architecture-awareness-after-protected-input-readiness-proof-closure-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2740-rc-external-gate-evidence-checker-missing-test-links:c65bae25b4 | history/tasks/luc-2740-rc-external-gate-evidence-checker-missing-test-links-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2746-no-stall-queue-expeditor:a3f30b76c4 | history/tasks/luc-2746-no-stall-queue-expeditor-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2749-architecture-awareness-after-rc-external-gate-evidence-proof-closure-2026-06-07:f78d7e409d | history/tasks/luc-2749-architecture-awareness-after-rc-external-gate-evidence-proof-closure-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2750-live-import-readback-collector-missing-test-links:b3ef820ceb | history/tasks/luc-2750-live-import-readback-collector-missing-test-links-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2760-autonomous-idle-and-map-drift-sweep:b61b23ca1f | history/tasks/luc-2760-autonomous-idle-and-map-drift-sweep-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2764-architecture-missing-test-script-cluster:8b420b125b | history/tasks/luc-2764-architecture-missing-test-script-cluster-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2767-coolify-production-deploy-health-sweep-2026-06-07:0090945c22 | history/tasks/luc-2767-coolify-production-deploy-health-sweep-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2773-soar-assistant-ai-001-v1-scope-decision:3edd229c07 | history/tasks/luc-2773-soar-assistant-ai-v1-scope-decision-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2774-gap-register-and-repair-lane-refresh:d344ee01d7 | history/tasks/luc-2774-gap-register-and-repair-lane-refresh-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2775-dev-backend-helper-missing-test-links:a354b3636f | history/tasks/luc-2775-dev-backend-helper-missing-test-links-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2779-architecture-awareness-after-dev-backend-proof-closure:371e02b540 | history/tasks/luc-2779-architecture-awareness-after-dev-backend-proof-closure-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2781-dev-backend-shutdownimpl-test-link:bfe2007e6a | history/tasks/luc-2781-dev-backend-shutdownimpl-test-link-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2786-dashboard-locale-encoding-integrity-drift:1dd3854cc7 | history/tasks/luc-2786-dashboard-locale-encoding-integrity-drift-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2791-function-and-user-action-index-generator-missing-test-links:0d2c46bdf2 | history/tasks/luc-2791-function-user-action-index-generator-missing-test-links-2026-06-28-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2792-go-live-smoke-helper-missing-test-links:53a03d145e | history/tasks/luc-2792-go-live-smoke-helper-missing-test-links-2026-06-28-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2793-mobile-traceability-v1-scope-classification:30062c5cb8 | history/tasks/luc-2793-mobile-traceability-v1-scope-classification-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2799-workers-ready-smoke-principal-gate-blocked-disposition:3871bcf266 | history/tasks/luc-2799-workers-ready-smoke-principal-gate-blocked-disposition-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2801-soar-protected-recheck:113f42f49c | history/tasks/luc-2801-soar-protected-recheck-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2803-no-stall-queue-expeditor:963e106dd3 | history/tasks/luc-2803-no-stall-queue-expeditor-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2807-gap-register-and-repair-lane-refresh:9bd66e37e4 | history/tasks/luc-2807-gap-register-and-repair-lane-refresh-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2808-resolve-ops-auth-token-cookie-parser-missing-test-link:f76203f404 | history/tasks/luc-2808-resolve-ops-auth-token-cookie-parser-missing-test-link-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2821-no-stall-queue-expeditor:20382e6290 | history/tasks/luc-2821-no-stall-queue-expeditor-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2824-backup-verification-profile-env-helper-missing-test-link:fb50216877 | history/tasks/luc-2824-backup-verification-profile-env-helper-missing-test-link-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2827-controlled-live-proof-no-order-guard-missing-test-link:81eed8d2ce | history/tasks/luc-2827-controlled-live-proof-no-order-guard-missing-test-link-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2834-controlled-live-proof-target-discovery-missing-test-link:b1de598c79 | history/tasks/luc-2834-controlled-live-proof-target-discovery-missing-test-link-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2845-controlled-live-proof-fetchjson-missing-test-link:427fafc685 | history/tasks/luc-2845-controlled-live-proof-fetchjson-missing-test-link-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2846-gap-register-and-repair-lane-refresh:8195c73da7 | history/tasks/luc-2846-gap-register-and-repair-lane-refresh-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2847-controlled-live-proof-hashid-missing-test-link-2026-06-07:04650378f5 | history/tasks/luc-2847-controlled-live-proof-hashid-missing-test-link-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-285-safe-lane-continuation-2026-05-27:94bfd2df19 | history/tasks/luc-285-safe-lane-non-production-architecture-status-refresh-2026-05-27-continuation-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-285-safe-lane-source-scoped-recovery-2026-05-27:eaac7346f6 | history/tasks/luc-285-safe-lane-non-production-architecture-status-refresh-2026-05-27-source-scoped-recovery-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2857-no-stall-queue-expeditor:70db2ebbf7 | history/tasks/luc-2857-no-stall-queue-expeditor-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2861-no-stall-queue-expeditor:9529809858 | history/tasks/luc-2861-no-stall-queue-expeditor-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2871-function-journey-index-generator-local-proof:f31e427a2a | history/tasks/luc-2871-function-journey-index-generator-local-proof-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2874-coolify-production-deploy-health-sweep:c146ec1426 | history/tasks/luc-2874-coolify-production-deploy-health-sweep-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2878-controlled-live-proof-printusage-missing-test-link:503de02edc | history/tasks/luc-2878-controlled-live-proof-printusage-missing-test-link-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2879-web-server-action-deploy-mismatch-diagnosis:2117503ad6 | history/tasks/luc-2879-web-server-action-deploy-mismatch-diagnosis-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2881-gap-register-and-repair-lane-refresh:23f72e3ab0 | history/tasks/luc-2881-gap-register-and-repair-lane-refresh-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2882-controlled-live-proof-redactbot-missing-test-link:04cfb914cc | history/tasks/luc-2882-controlled-live-proof-redactbot-missing-test-link-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2886-controlled-live-proof-resolvebuildinfo-missing-test-link:8aa0e0e212 | history/tasks/luc-2886-controlled-live-proof-resolvebuildinfo-missing-test-link-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2889-no-stall-queue-expeditor:fc03aafb8b | history/tasks/luc-2889-no-stall-queue-expeditor-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2892-controlled-live-proof-runcollector-missing-test-link:100cf4b0ef | history/tasks/luc-2892-controlled-live-proof-runcollector-missing-test-link-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2896-controlled-live-proof-runsimultaneousruntimereadback-missing-test-link:b58bc90d7d | history/tasks/luc-2896-controlled-live-proof-runsimultaneousruntimereadback-missing-test-link-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2899-controlled-live-proof-sleep-missing-test-link:80bf9d198b | history/tasks/luc-2899-controlled-live-proof-sleep-missing-test-link-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2901-no-stall-queue-expeditor:d640499554 | history/tasks/luc-2901-no-stall-queue-expeditor-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2904-controlled-live-proof-updatebotactivestate-missing-test-link:6331847f85 | history/tasks/luc-2904-controlled-live-proof-updatebotactivestate-missing-test-link-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2905-gap-register-and-repair-lane-refresh:d9c981b89c | history/tasks/luc-2905-gap-register-and-repair-lane-refresh-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2906-controlled-live-proof-waitforrunningsession-missing-test-link:4e6ce8ba49 | history/tasks/luc-2906-controlled-live-proof-waitforrunningsession-missing-test-link-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2907-no-stall-queue-expeditor:709e708a4b | history/tasks/luc-2907-no-stall-queue-expeditor-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2910-cutover-dry-run-main-missing-test-link-2026-06-07:dc9acbdce3 | history/tasks/luc-2910-cutover-dry-run-main-missing-test-link-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2931-local-external-gates-pipeline-missing-test-links:93431708bd | history/tasks/luc-2931-local-external-gates-pipeline-missing-test-links-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2939-prod-auth-session-browser-proof-helper-missing-test-links:c8c6b7d2ac | history/tasks/luc-2939-prod-auth-session-browser-proof-helper-missing-test-links-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2955-v1-audit-to-completion-controller:094b7d483b | history/tasks/luc-2955-v1-audit-to-completion-controller-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2956-prod-security-exchange-proof-helper-missing-test-links:8b9eb22dd9 | history/tasks/luc-2956-prod-security-exchange-proof-helper-missing-test-links-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2961-coolify-production-deploy-health-sweep-2026-06-07:53ae91dd25 | history/tasks/luc-2961-coolify-production-deploy-health-sweep-2026-06-07-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2966-auth-security-and-qa-proof-task-entity-link-backfill:c59e900c9c | history/tasks/luc-2966-auth-security-qa-proof-task-entity-link-backfill-2026-06-08-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2970-gap-register-and-repair-lane-refresh-2026-06-08:5fe3ef6a23 | history/tasks/luc-2970-gap-register-and-repair-lane-refresh-2026-06-08-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2975-public-read-only-browser-proof-helper-test-lane:a9add25baf | history/tasks/luc-2975-public-read-only-browser-proof-helper-test-lane-2026-06-08-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2982-no-stall-queue-expeditor:e609491750 | history/tasks/luc-2982-no-stall-queue-expeditor-2026-06-08-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2985-function-journey-chains-missing-test-row:6ad37aea44 | history/tasks/luc-2985-function-journey-chains-missing-test-row-2026-06-08-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2986-no-stall-queue-expeditor:d28295b846 | history/tasks/luc-2986-no-stall-queue-expeditor-2026-06-08-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2989-go-live-smoke-helper-proof-lane-disposition-2026-06-08:30ed29bc66 | history/tasks/luc-2989-go-live-smoke-helper-proof-lane-disposition-2026-06-08-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2992-no-stall-queue-expeditor:af6b2f4b5b | history/tasks/luc-2992-no-stall-queue-expeditor-2026-06-08-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-2996-gap-register-and-repair-lane-refresh-2026-06-08:a110026afe | history/tasks/luc-2996-gap-register-and-repair-lane-refresh-2026-06-08-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3008-prod-like-and-worker-startup-wrapper-missing-test-rows:cc1eb406e0 | history/tasks/luc-3008-prod-like-worker-startup-wrapper-missing-test-rows-2026-06-08-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3009-rc-gate-summary-and-checklist-missing-test-rows:b7a710092c | history/tasks/luc-3009-rc-gate-summary-checklist-missing-test-rows-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3011-no-stall-queue-expeditor:17a2dc0689 | history/tasks/luc-3011-no-stall-queue-expeditor-2026-06-08-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-306-account-access-controller-clearsession-test-link:8ec231b936 | history/tasks/luc-306-account-access-controller-clearsession-test-link-2026-07-10-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3071-daily-project-status-refresh-2026-06-11:82f6378458 | history/tasks/luc-3071-daily-project-status-refresh-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-310-source-control-closure:c807a54881 | history/tasks/luc-310-source-control-closure-2026-07-10-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-322-safe-lane-non-production-architecture-status-refresh-2026-05-27:90f7fe7b49 | history/tasks/luc-322-safe-lane-non-production-architecture-status-refresh-2026-05-27-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3313-autonomous-idle-and-map-drift-sweep:456898366f | history/tasks/luc-3313-autonomous-idle-and-map-drift-sweep-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3364-autonomous-idle-and-map-drift-sweep:c99a0b08e4 | history/tasks/luc-3364-autonomous-idle-and-map-drift-sweep-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3366-gap-register-and-repair-lane-refresh-2026-06-11:3afb99dfc5 | history/tasks/luc-3366-gap-register-and-repair-lane-refresh-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3373-regression-evidence-sweep-2026-06-11:ef7495ae32 | history/tasks/luc-3373-regression-evidence-sweep-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3375-security-and-account-access-gate-sweep:71c2f1ef2e | history/tasks/luc-3375-security-account-access-gate-sweep-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3381-static-issue-scan-helper-missing-test-rows-2026-06-11:d11f6cc682 | history/tasks/luc-3381-static-issue-scan-helper-missing-test-rows-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3382-coolify-failed-deploy-read-only-diagnosis:9ddf863d48 | history/tasks/luc-3382-coolify-failed-deploy-readonly-diagnosis-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3394-gap-register-and-repair-lane-refresh-2026-06-11:48e07ccca9 | history/tasks/luc-3394-gap-register-and-repair-lane-refresh-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3404-architecture-awareness-refresh-after-closed-relation-lanes-2026-06-11:c4c7eb4e2b | history/tasks/luc-3404-architecture-awareness-refresh-after-closed-relation-lanes-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3405-public-read-only-browser-proof-process-anchor-classification:449e956c6b | history/tasks/luc-3405-public-read-only-browser-proof-process-anchor-classification-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3409-owner-login-verification-path:3cb240fa92 | history/tasks/luc-3409-owner-login-verification-path-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3410-web-next-production-command-wrapper-missing-test-row:dfcf1b77a2 | history/tasks/luc-3410-web-next-production-command-wrapper-missing-test-row-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3419-no-stall-queue-expeditor:7c77f78396 | history/tasks/luc-3419-no-stall-queue-expeditor-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-342-protected-input-binding-readiness-rerun:e2a6900df0 | history/tasks/luc-342-protected-input-binding-readiness-2026-07-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-342-protected-input-binding-readiness:aad3a4c4ee | history/tasks/luc-342-protected-input-binding-readiness-2026-07-10-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3425-autonomous-idle-and-map-drift-sweep:b219ba79e8 | history/tasks/luc-3425-autonomous-idle-and-map-drift-sweep-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3434-static-scan-qa-execution-path-recovery-2026-06-11:b1719da435 | history/tasks/luc-3434-static-scan-qa-execution-path-recovery-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3445-no-stall-queue-expeditor:16d6335198 | history/tasks/luc-3445-no-stall-queue-expeditor-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3455-regression-evidence-sweep-2026-06-11:3f98123c04 | history/tasks/luc-3455-regression-evidence-sweep-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3457-security-and-account-access-gate-sweep:8e865e9b73 | history/tasks/luc-3457-security-account-access-gate-sweep-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3465-gap-register-and-repair-lane-refresh-2026-06-11:0e7caea0aa | history/tasks/luc-3465-gap-register-and-repair-lane-refresh-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3466-prod-like-worker-wrapper-relation-rows-2026-06-11:fac7d2f849 | history/tasks/luc-3466-prod-like-worker-wrapper-relation-rows-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3468-no-stall-queue-expeditor:8f803c8b6f | history/tasks/luc-3468-no-stall-queue-expeditor-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3476-no-stall-queue-expeditor:f475d6365d | history/tasks/luc-3476-no-stall-queue-expeditor-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3480-no-stall-queue-expeditor:7a808c124b | history/tasks/luc-3480-no-stall-queue-expeditor-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3484-v1-audit-to-completion-controller-2026-06-11:5d454c4189 | history/tasks/luc-3484-v1-audit-to-completion-controller-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3487-no-stall-queue-expeditor:356fefc80d | history/tasks/luc-3487-no-stall-queue-expeditor-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3490-gap-register-and-repair-lane-refresh-2026-06-11:138ff1aa78 | history/tasks/luc-3490-gap-register-and-repair-lane-refresh-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3491-rc-summary-checklist-residual-relation-rows:88fc0e35a8 | history/tasks/luc-3491-rc-summary-checklist-residual-relation-rows-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3493-no-stall-queue-expeditor:0bb500736c | history/tasks/luc-3493-no-stall-queue-expeditor-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3503-validate-scripts-source-control-closure-lane:e7357771bf | history/tasks/luc-3503-validate-scripts-source-control-closure-lane-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3504-dashboard-i18n-source-control-closure:f446fdbbb6 | history/tasks/luc-3504-dashboard-i18n-source-control-closure-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3506-classify-nul-workspace-artifact-before-source-control-closure:4bbd3f4ac1 | history/tasks/luc-3506-classify-nul-workspace-artifact-before-source-control-closure-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3510-source-control-closure-batch-after-validated-dirty-lane-evidence:85f467c8b0 | history/tasks/luc-3510-source-control-closure-batch-after-validated-dirty-lane-evidence-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3513-autonomous-idle-and-map-drift-sweep:8321271be6 | history/tasks/luc-3513-autonomous-idle-and-map-drift-sweep-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3515-coolify-production-deploy-health-sweep:315b92a3f0 | history/tasks/luc-3515-coolify-production-deploy-health-sweep-2026-07-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3515-coolify-production-deploy-health-sweep:6d311c0f0e | history/tasks/luc-3515-coolify-production-deploy-health-sweep-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3516-no-stall-queue-expeditor:7938fffe71 | history/tasks/luc-3516-no-stall-queue-expeditor-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3519-gap-register-and-repair-lane-refresh-2026-06-11:f4d081576a | history/tasks/luc-3519-gap-register-and-repair-lane-refresh-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3520-waitforwebbuildinfo-fetchjsonwithtimeout-relation-row:01aa175d43 | history/tasks/luc-3520-waitforwebbuildinfo-fetchjson-relation-row-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3530-no-stall-queue-expeditor:92c3bde6b9 | history/tasks/luc-3530-no-stall-queue-expeditor-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3536-architecture-awareness-after-closed-relation-rows:ea4af84f12 | history/tasks/luc-3536-architecture-awareness-after-closed-relation-rows-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3538-waitforwebbuildinfo-isdeploybuildidaccepted-relation-row:c9db582e03 | history/tasks/luc-3538-waitforwebbuildinfo-isdeploybuildidaccepted-relation-row-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3546-no-stall-queue-expeditor:13d10c8cda | history/tasks/luc-3546-no-stall-queue-expeditor-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3549-architecture-awareness-after-isdeploybuildidaccepted:4ebfb210f6 | history/tasks/luc-3549-architecture-awareness-after-isdeploybuildidaccepted-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3551-waitforwebbuildinfo-isdeploymetadatasourceaccepted-relation-row:1e6f42b61d | history/tasks/luc-3551-waitforwebbuildinfo-isdeploymetadatasourceaccepted-relation-row-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3552-v1-audit-to-completion-controller:494f1cb492 | history/tasks/luc-3552-v1-audit-to-completion-controller-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3554-waitforwebbuildinfo-hasflag-relation-row:d0f13a89cf | history/tasks/luc-3554-waitforwebbuildinfo-hasflag-relation-row-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3555-no-stall-queue-expeditor:71b6c81b41 | history/tasks/luc-3555-no-stall-queue-expeditor-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3558-architecture-awareness-refresh-after-luc-3554:1b748acaa0 | history/tasks/luc-3558-architecture-awareness-after-hasflag-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3559-waitforwebbuildinfo-main-relation-row:1fd9156577 | history/tasks/luc-3559-waitforwebbuildinfo-main-relation-row-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3560-gap-register-and-repair-lane-refresh:0b1c2e088b | history/tasks/luc-3560-gap-register-and-repair-lane-refresh-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3561-waitforwebbuildinfo-feature-level-relation-row:eb51f8b9d8 | history/tasks/luc-3561-waitforwebbuildinfo-feature-level-relation-row-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3565-architecture-awareness-after-feature-level-relation-row:ff71d0bb08 | history/tasks/luc-3565-architecture-awareness-after-feature-level-relation-row-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3567-waitforwebbuildinfo-normalizebaseurl-relation-row:3f4a114630 | history/tasks/luc-3567-waitforwebbuildinfo-normalizebaseurl-relation-row-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3569-no-stall-queue-expeditor:1feddbc84a | history/tasks/luc-3569-no-stall-queue-expeditor-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3572-architecture-awareness-after-normalizebaseurl:ae679fc8e8 | history/tasks/luc-3572-architecture-awareness-after-normalizebaseurl-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3574-waitforwebbuildinfo-normalizenonemptystring-relation-row:22057b8e89 | history/tasks/luc-3574-waitforwebbuildinfo-normalizenonemptystring-relation-row-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3581-source-control-closure-docs-evidence-packet:6a1d109498 | history/tasks/luc-3581-source-control-closure-docs-evidence-packet-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3587-architecture-awareness-after-normalizenonemptystring:347a3f24e2 | history/tasks/luc-3587-architecture-awareness-after-normalizenonemptystring-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3588-waitforwebbuildinfo-printusage-relation-row:356346a305 | history/tasks/luc-3588-waitforwebbuildinfo-printusage-relation-row-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3589-gap-register-and-repair-lane-refresh:0bae4976ab | history/tasks/luc-3589-gap-register-and-repair-lane-refresh-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3595-no-stall-queue-expeditor:fc9c49fcea | history/tasks/luc-3595-no-stall-queue-expeditor-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3598-waitforwebbuildinfo-resolveoptions-relation-row:7585e3b08f | history/tasks/luc-3598-waitforwebbuildinfo-resolveoptions-relation-row-2026-06-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3600-v1-audit-to-completion-controller-architecture-refresh:6c2af0673a | history/tasks/luc-3600-v1-audit-to-completion-controller-architecture-refresh-2026-06-12-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3684-primary-source-control-closure-after-sidecar-routing-fix:6e9e94e07b | history/tasks/luc-3684-primary-source-control-closure-after-sidecar-routing-fix-2026-06-13-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3722-clear-architecture-graph-drift-guardrail-2026-06-13:7d75d21e1a | history/tasks/luc-3722-clear-architecture-graph-drift-guardrail-2026-06-13-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3726-production-ui-audit-helper-test-repair:9190172508 | history/tasks/luc-3726-prod-ui-audit-helper-test-repair-2026-06-13-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-376-read-only-source-control-classification-2026-05-27:3c17098b00 | history/tasks/luc-376-read-only-source-control-classification-docs-state-evidence-drift-2026-05-27-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3779-backend-runtime-task-link-reconciliation:f11b257fe2 | history/tasks/luc-3779-backend-runtime-task-link-reconciliation-2026-06-13-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3832-production-dashboard-performance-diagnosis:4d74cfdef3 | history/tasks/luc-3832-production-dashboard-performance-diagnosis-2026-06-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3840-reduce-dashboard-runtime-fan-out-and-loading-stalls:c1acead2f1 | history/tasks/luc-3840-reduce-dashboard-runtime-fanout-loading-stalls-2026-06-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3841-protected-dashboard-performance-recheck:fbf51c7972 | history/tasks/luc-3841-protected-dashboard-performance-recheck-2026-06-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-3885-stripe-webhook-subscription-lifecycle-reconciliation:d429702abc | history/tasks/luc-3885-stripe-webhook-subscription-lifecycle-2026-06-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-39-backend-api-service-boundary-known-state-2026-05-25:2249aac05c | history/tasks/luc-39-backend-api-service-boundary-known-state-2026-05-25.md |
| connected_to | project:soar:7c70e892d7 | task:luc-4005-soar-architecture-implementation-task-link-reconciliation:b3fcbffebf | history/tasks/luc-4005-soar-architecture-implementation-task-link-reconciliation-2026-06-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-41-runtime-boundary-checkpoint-2026-05-25:6bbdf78f97 | history/tasks/luc-41-runtime-boundary-checkpoint-2026-05-25.md |
| connected_to | project:soar:7c70e892d7 | task:luc-4103-owner-login-verification-path:0bc90da359 | history/tasks/luc-4103-owner-login-verification-path-2026-06-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-4103-owner-login-waiting-state-security-heartbeat-2026-07-02:cd219523e8 | history/tasks/luc-4103-owner-login-waiting-state-security-heartbeat-2026-07-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-4121-protected-test-account-smoke-path:96db9f5aa9 | history/tasks/luc-4121-protected-test-account-smoke-path-2026-06-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-4174-repair-local-vitest-startup-for-dashboard-fan-out-regression-proof:1eaa2dc1b7 | history/tasks/luc-4174-repair-local-vitest-startup-dashboard-fanout-regression-proof-2026-06-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-4201-promote-dashboard-performance-repair-bundle:1349917b3e | history/tasks/luc-4201-promote-dashboard-performance-repair-bundle-2026-06-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-4204-v1-audit-to-completion-controller-architecture-refresh:4b280fee84 | history/tasks/luc-4204-v1-audit-to-completion-controller-architecture-refresh-2026-06-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-433-source-control-closure-classify-and-close-local-dirty-state-for-luc-402-2026-05-28:f1a83ac1e0 | history/tasks/luc-433-source-control-closure-classify-and-close-local-dirty-state-for-luc-402-2026-05-28-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-4493-close-main-dirty-stripe-webhook-packet:134c592358 | history/tasks/luc-4493-close-main-dirty-stripe-webhook-packet-2026-06-19-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-4766-production-performance-and-server-health-watch-task:d408c69912 | history/tasks/luc-4766-production-performance-health-watch-2026-06-20-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-4767-coolify-vps-health-readback-blocked-task:8aba7bf689 | history/tasks/luc-4767-coolify-vps-health-readback-blocked-2026-06-20-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-4806-bind-read-only-coolify-vps-status-inputs:3aa4c08c39 | history/tasks/luc-4806-bind-read-only-coolify-vps-status-inputs-2026-06-20-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-4811-inject-read-only-coolify-vps-status-bindings:f75d37ddad | history/tasks/luc-4811-inject-read-only-coolify-vps-status-bindings-2026-06-20-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-4815-v1-audit-to-completion-controller-stripe-relation-sync:d37c7a63c8 | history/tasks/luc-4815-v1-audit-to-completion-controller-stripe-relation-sync-2026-06-20-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-4819-production-performance-and-server-health-watch-task:3b924c7ae3 | history/tasks/luc-4819-production-performance-health-watch-2026-06-20-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-4833-authenticated-production-acceptance-and-performance-sweep-task:957677878e | history/tasks/luc-4833-authenticated-production-acceptance-performance-sweep-2026-06-20-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-4843-gap-register-and-repair-lane-refresh:881e6c58a0 | history/tasks/luc-4843-gap-register-and-repair-lane-refresh-2026-06-20-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-4893-production-performance-and-server-health-watch-task:dfe492c96f | history/tasks/luc-4893-production-performance-health-watch-2026-06-20-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-4950-source-control-classification-packet-from-luc-4946:a1355a1450 | history/tasks/luc-4950-source-control-classification-packet-from-luc-4946-2026-06-20-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-4971-security-and-account-access-gate-sweep:5be479c345 | history/tasks/luc-4971-security-account-access-gate-sweep-2026-06-20-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-498-account-access-doc-link-burn-down:ff5803d619 | history/tasks/luc-498-account-access-doc-link-burn-down-2026-07-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-499-account-access-auth-controller-test-link-rows:a035f1e41c | history/tasks/luc-499-account-access-auth-controller-test-link-rows-2026-07-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-500-protected-browser-runtime-trading-read-only-proof:b7dd108f50 | history/tasks/luc-500-protected-browser-runtime-trading-readonly-proof-2026-07-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5001-no-stall-queue-expeditor:bf6975d957 | history/tasks/luc-5001-no-stall-queue-expeditor-2026-06-20-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-501-browser-review-owner-route-bundles-task:26a0e3a5fc | history/tasks/luc-501-browser-review-owner-route-bundles-2026-07-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-503-protected-ops-diagnostics-read-only-proof:9bf6543f78 | history/tasks/luc-503-protected-ops-diagnostics-readonly-proof-2026-07-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-528-account-access-auth-e2e-restoreenv-doc-link:c4bcfbfa54 | history/tasks/luc-528-account-access-auth-e2e-restoreenv-doc-link-2026-07-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5362-authenticated-production-acceptance-and-performance-sweep:50343f5020 | history/tasks/luc-5362-authenticated-production-acceptance-performance-sweep-2026-06-21-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5367-gap-register-and-repair-lane-refresh:b0121f5320 | history/tasks/luc-5367-gap-register-and-repair-lane-refresh-2026-06-21-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-539-account-access-auth-jwt-getjwtsecrets-doc-link:fe8111ccf9 | history/tasks/luc-539-account-access-auth-jwt-getjwtsecrets-doc-link-2026-07-11-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-541-account-access-getjwtsecrets-proof:a6d8b8e291 | history/tasks/luc-541-account-access-getjwtsecrets-proof-2026-07-12-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-549-account-access-getprevioussecretexpiry-proof:eba6bfa20f | history/tasks/luc-549-account-access-getprevioussecretexpiry-proof-2026-07-12-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5542-regression-evidence-sweep-2026-06-27:c8a988001f | history/tasks/luc-5542-regression-evidence-sweep-2026-06-27-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5543-security-and-account-access-gate-sweep:b3142cd64f | history/tasks/luc-5543-security-account-access-gate-sweep-2026-06-27-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5577-repair-qa-smoke-runner-pnpm-11-and-local-db-availability:101624d4c8 | history/tasks/luc-5577-repair-qa-smoke-runner-pnpm11-db-availability-2026-06-27-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5581-no-stall-queue-expeditor:a47f3b98fe | history/tasks/luc-5581-no-stall-queue-expeditor-2026-06-27-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5586-restore-local-docker-postgres-redis-availability:27a18a37d0 | history/tasks/luc-5586-restore-local-docker-postgres-redis-availability-2026-06-27-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5588-v1-audit-to-completion-controller:3665193e00 | history/tasks/luc-5588-v1-audit-to-completion-controller-2026-06-27-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5590-repair-qa-repeatable-api-backtests-infra-teardown-sequencing:1debc7c8d1 | history/tasks/luc-5590-repair-qa-repeatable-api-backtests-infra-teardown-sequencing-2026-06-27-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5591-v1-app-completion-admin-operation-proof-lane:6fe83e9fbe | history/tasks/luc-5591-v1-app-completion-admin-operation-proof-lane-2026-06-27-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5598-gap-register-and-repair-lane-refresh:acb7b830fc | history/tasks/luc-5598-gap-register-and-repair-lane-refresh-2026-06-27-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5604-api-backtests-shared-db-cleanup-repair:c35ffc0d67 | history/tasks/luc-5604-api-backtests-shared-db-cleanup-repair-2026-06-27-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5608-production-performance-and-server-health-watch:967060d4cf | history/tasks/luc-5608-production-performance-server-health-watch-2026-06-27-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5622-known-state-evidence-and-architecture-baseline:d23f74e32c | history/tasks/luc-5622-known-state-evidence-architecture-baseline-2026-06-27-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5634-account-access-proof-slice:9f4f9e0edf | history/tasks/luc-5634-account-access-proof-slice-2026-06-27-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5636-exchange-connection-and-configuration-parent-closure-2026-06-29:03c4e83b76 | history/tasks/luc-5636-exchange-connection-configuration-parent-closure-2026-06-29-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5650-production-performance-and-server-health-watch:b0903ccc93 | history/tasks/luc-5650-production-performance-server-health-watch-2026-06-27-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5680-names-only-exchange-configuration-and-fail-closed-api-proof:c8d9d404ae | history/tasks/luc-5680-names-only-exchange-configuration-fail-closed-api-proof-2026-06-28-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5687-v1-audit-to-completion-controller:4122c14b76 | history/tasks/luc-5687-v1-audit-to-completion-controller-2026-06-28-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5693-profile-api-key-e2e-cleanup-isolation-repair-2026-06-28:5406e30823 | history/tasks/luc-5693-profile-api-key-e2e-cleanup-isolation-repair-2026-06-28-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5706-gap-register-and-repair-lane-refresh-2026-06-28:0cf4d32849 | history/tasks/luc-5706-gap-register-and-repair-lane-refresh-2026-06-28-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5796-v1-audit-to-completion-controller-2026-06-28:99f0a1ae78 | history/tasks/luc-5796-v1-audit-to-completion-controller-2026-06-28-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5803-authenticated-production-acceptance-and-performance-sweep:9a4cffb0bb | history/tasks/luc-5803-authenticated-production-acceptance-performance-sweep-2026-06-28-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5806-gap-register-and-repair-lane-refresh-2026-06-28:ca77456d4e | history/tasks/luc-5806-gap-register-and-repair-lane-refresh-2026-06-28-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5822-no-stall-queue-expeditor:00b82b0487 | history/tasks/luc-5822-no-stall-queue-expeditor-2026-06-28-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5862-app-completion-browser-review-proof-triage:7c0bf53cfb | history/tasks/luc-5862-app-completion-browser-review-proof-triage-2026-06-28-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5863-account-and-subscription-proof-link-reconciliation:44f72141ac | history/tasks/luc-5863-account-subscription-proof-link-reconciliation-2026-06-28-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5865-evidence-link-reconciliation:8ddbc85614 | history/tasks/luc-5865-evidence-link-reconciliation-architecture-app-completion-baseline-2026-06-28-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5870-regression-evidence-sweep-2026-06-28:e2a8054e71 | history/tasks/luc-5870-regression-evidence-sweep-2026-06-28-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5886-security-and-account-access-gate-sweep:d3b0bc4c8f | history/tasks/luc-5886-security-account-access-gate-sweep-2026-06-28-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5900-no-stall-queue-expeditor:c37e0d54c0 | history/tasks/luc-5900-no-stall-queue-expeditor-2026-06-28-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5905-v1-audit-to-completion-controller-2026-06-28:7c04df8d71 | history/tasks/luc-5905-v1-audit-to-completion-controller-2026-06-28-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5915-authenticated-production-acceptance-and-performance-sweep:336237740f | history/tasks/luc-5915-authenticated-production-acceptance-performance-sweep-2026-06-28-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5921-gap-register-and-repair-lane-refresh:e606f11f82 | history/tasks/luc-5921-gap-register-and-repair-lane-refresh-2026-06-28-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5938-no-stall-queue-expeditor:79a2d2174f | history/tasks/luc-5938-no-stall-queue-expeditor-2026-06-28-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-5975-no-stall-queue-expeditor:ccaa90481b | history/tasks/luc-5975-no-stall-queue-expeditor-2026-06-28-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6025-v1-audit-to-completion-controller:d611f47f09 | history/tasks/luc-6025-v1-audit-to-completion-controller-2026-06-28-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6038-gap-register-and-repair-lane-refresh:6e57efe2e9 | history/tasks/luc-6038-gap-register-and-repair-lane-refresh-2026-06-28-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6070-restore-v1-execution-flow-from-blocked-queue-audit-task:162f407faa | history/tasks/luc-6070-restore-v1-execution-flow-from-blocked-queue-audit-2026-06-28-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6091-v1-audit-to-completion-controller:d1431498b2 | history/tasks/luc-6091-v1-audit-to-completion-controller-2026-06-29-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6105-restore-local-postgresql-docker-runtime:955e8b34f5 | history/tasks/luc-6105-restore-local-postgresql-docker-runtime-user-config-db-proof-2026-06-29-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6119-gap-register-and-repair-lane-refresh:c9865b01eb | history/tasks/luc-6119-gap-register-and-repair-lane-refresh-2026-06-29-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6139-production-performance-and-server-health-watch-task-contract:9ae4fc5e27 | history/tasks/luc-6139-production-performance-server-health-watch-2026-06-29-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6164-repeatable-backtests-cleanup-isolation-repair:a697f25a99 | history/tasks/luc-6164-repeatable-backtests-cleanup-isolation-repair-2026-06-29-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6170-production-performance-and-server-health-watch-task-contract:57a8fdd845 | history/tasks/luc-6170-production-performance-server-health-watch-2026-06-29-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6177-v1-audit-to-completion-controller:fdde818f95 | history/tasks/luc-6177-v1-audit-to-completion-controller-2026-06-29-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6181-gap-register-and-repair-lane-refresh:25ec99b07b | history/tasks/luc-6181-gap-register-and-repair-lane-refresh-2026-06-29-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6197-daily-project-status-refresh-2026-06-29:d37694bbc1 | history/tasks/luc-6197-daily-project-status-refresh-2026-06-29-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6198-coolify-production-deploy-health-sweep-task-contract:e623cfff44 | history/tasks/luc-6198-coolify-production-deploy-health-sweep-2026-06-29-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6205-regression-evidence-sweep-2026-06-29:74dd6d1198 | history/tasks/luc-6205-regression-evidence-sweep-2026-06-29-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6208-no-stall-queue-expeditor:96d95421fa | history/tasks/luc-6208-no-stall-queue-expeditor-2026-06-29-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6215-production-performance-and-server-health-watch-task-contract:fc669792f7 | history/tasks/luc-6215-production-performance-server-health-watch-2026-06-29-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6234-security-and-account-access-gate-sweep:6de55661fe | history/tasks/luc-6234-security-account-access-gate-sweep-2026-06-29-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6241-no-stall-queue-expeditor:0a60aeb0b5 | history/tasks/luc-6241-no-stall-queue-expeditor-2026-06-29-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6250-gap-register-and-repair-lane-refresh:72747800a1 | history/tasks/luc-6250-gap-register-and-repair-lane-refresh-2026-06-29-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6252-production-performance-and-server-health-watch-task-contract:95be2c33a4 | history/tasks/luc-6252-production-performance-server-health-watch-2026-06-29-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6269-no-stall-queue-expeditor:1450477e57 | history/tasks/luc-6269-no-stall-queue-expeditor-2026-06-29-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6271-production-performance-and-server-health-watch-task-contract:1f7c928026 | history/tasks/luc-6271-production-performance-server-health-watch-2026-06-30-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6290-production-performance-and-server-health-watch-task-record:1cd3ae363a | history/tasks/luc-6290-production-performance-server-health-watch-2026-06-30-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6303-gap-register-and-repair-lane-refresh:239f081ce8 | history/tasks/luc-6303-gap-register-and-repair-lane-refresh-2026-06-30-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-631-browser-proof-plan-and-public-read-only-proof:9ce06f053c | history/tasks/luc-631-browser-proof-plan-and-public-readonly-proof-2026-07-12-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6312-architecture-baseline-missing-test-link-reconciliation:29042127c5 | history/tasks/luc-6312-architecture-baseline-missing-test-link-reconciliation-2026-06-30-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-632-test-automation-proof-burn-down:a095b06daa | history/tasks/luc-632-test-automation-proof-burndown-2026-07-12-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6322-no-stall-queue-expeditor:324b3c80e1 | history/tasks/luc-6322-no-stall-queue-expeditor-2026-06-30-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6329-production-performance-and-server-health-watch-task-record:f9ee97beff | history/tasks/luc-6329-production-performance-server-health-watch-2026-06-30-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6356-no-stall-queue-expeditor:284968d9eb | history/tasks/luc-6356-no-stall-queue-expeditor-2026-06-30-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6369-production-performance-and-server-health-watch-task-record:fe32417679 | history/tasks/luc-6369-production-performance-server-health-watch-2026-06-30-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-637-account-access-session-token-proof:1fcd69fb0e | history/tasks/luc-637-account-access-session-token-proof-2026-07-12-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6411-daily-project-status-refresh-2026-06-30:e8a432c175 | history/tasks/luc-6411-daily-project-status-refresh-2026-06-30-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6413-regression-evidence-sweep-2026-06-30:fa6ee93d60 | history/tasks/luc-6413-regression-evidence-sweep-2026-06-30-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6416-security-and-account-access-gate-sweep:4e478dbe27 | history/tasks/luc-6416-security-account-access-gate-sweep-2026-06-30-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6459-known-state-evidence-and-architecture-baseline-task:8eccc644ed | history/tasks/luc-6459-known-state-evidence-architecture-baseline-2026-06-30-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6463-package-next-app-completion-proof-burn-down-lanes-task:688073c6ad | history/tasks/luc-6463-package-next-app-completion-proof-burn-down-lanes-2026-06-30-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6465-shared-ui-form-component-state-app-completion-proof-packet-task:696acc8442 | history/tasks/luc-6465-shared-ui-form-component-state-proof-2026-06-30-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6466-backtest-strategy-reports-public-shell-journey-proof-task:9730ac558c | history/tasks/luc-6466-backtest-strategy-reports-public-shell-journey-proof-2026-06-30-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6468-runtime-worker-contract-proof-slice:9b5cdd04ad | history/tasks/luc-6468-runtime-worker-contract-proof-slice-2026-07-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6473-no-stall-queue-expeditor-task:a7a21c5338 | history/tasks/luc-6473-no-stall-queue-expeditor-2026-06-30-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6483-no-stall-queue-expeditor-task:3ee29ad73f | history/tasks/luc-6483-no-stall-queue-expeditor-2026-06-30-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6518-classify-product-code-dirty-lane-from-luc-6516-control-tick:673c4a4fb7 | history/tasks/luc-6518-classify-product-code-dirty-lane-from-luc-6516-control-tick-2026-07-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6579-daily-project-status-refresh-2026-07-01:3f6f33c89b | history/tasks/luc-6579-daily-project-status-refresh-2026-07-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6584-regression-evidence-sweep-2026-07-01:4d2b18d55b | history/tasks/luc-6584-regression-evidence-sweep-2026-07-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6688-production-performance-and-server-health-watch:7b47b477b9 | history/tasks/luc-6688-production-performance-server-health-watch-2026-07-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6719-production-acceptance-technical-matrix:45268b1c30 | history/tasks/luc-6719-production-acceptance-technical-matrix-2026-07-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6736-no-stall-queue-expeditor:28af9d012d | history/tasks/luc-6736-no-stall-queue-expeditor-2026-07-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6760-no-stall-queue-expeditor:f811942b01 | history/tasks/luc-6760-no-stall-queue-expeditor-2026-07-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6771-no-stall-queue-expeditor:ca77ebd807 | history/tasks/luc-6771-no-stall-queue-expeditor-2026-07-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6786-no-stall-queue-expeditor:7971b34336 | history/tasks/luc-6786-no-stall-queue-expeditor-2026-07-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6790-no-stall-queue-expeditor:53ab62b32d | history/tasks/luc-6790-no-stall-queue-expeditor-2026-07-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6794-no-stall-queue-expeditor:ac414fb0c5 | history/tasks/luc-6794-no-stall-queue-expeditor-2026-07-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6815-daily-project-status-refresh-2026-07-02:57813f114a | history/tasks/luc-6815-daily-project-status-refresh-2026-07-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6817-no-stall-queue-expeditor-2026-07-02:6d054d1d1c | history/tasks/luc-6817-no-stall-queue-expeditor-2026-07-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6820-regression-evidence-sweep-2026-07-02:d66c524447 | history/tasks/luc-6820-regression-evidence-sweep-2026-07-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6820-regression-evidence-sweep-rerun-2026-07-02:ade13fbd67 | history/tasks/luc-6820-regression-evidence-sweep-rerun-2026-07-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6822-no-stall-queue-expeditor-2026-07-02:3bf71ad7f0 | history/tasks/luc-6822-no-stall-queue-expeditor-2026-07-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6838-no-stall-queue-expeditor:76fea7c1d3 | history/tasks/luc-6838-no-stall-queue-expeditor-2026-07-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6850-production-performance-and-server-health-watch-task:9e61791f94 | history/tasks/luc-6850-production-performance-server-health-watch-2026-07-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6867-no-stall-queue-expeditor-2026-07-02:f9198fd6be | history/tasks/luc-6867-no-stall-queue-expeditor-2026-07-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-6873-no-stall-queue-expeditor-2026-07-02:bea2979db9 | history/tasks/luc-6873-no-stall-queue-expeditor-2026-07-02-task.md |