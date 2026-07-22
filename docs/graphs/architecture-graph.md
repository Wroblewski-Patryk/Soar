# Architecture Graph

Generated: 2026-07-22T22:36:37.884Z

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
| connected_to | project:soar:7c70e892d7 | task:learning-journal:c5626339c3 | .codex/context/LEARNING_JOURNAL.md |
| connected_to | project:soar:7c70e892d7 | task:2026-07-02-luc-6750-gap-register-refresh:f10f18ac2e | .codex/context/PROJECT_STATE.md |
| connected_to | project:soar:7c70e892d7 | task:2026-07-02-luc-6750-gap-register-and-repair-lane-refresh:006aecaba0 | .codex/context/TASK_BOARD.md |
| connected_to | project:soar:7c70e892d7 | task:agent-operating-system-task-2026-05-07:04d1de2b03 | history/tasks/agent-operating-system-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:ai-assistant-foundation-protocol-harness-task:0adbd87e92 | history/tasks/ai-assistant-foundation-protocol-harness-2026-05-23-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:16ccebb9bd | history/tasks/api-endpoint-docs-gap-closure-2026-05-19-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:161af66a30 | history/tasks/api-local-regression-sweep-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:2778556125 | history/tasks/app-function-check-main-sweep-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:task:63f316df7a | history/tasks/arch-runtime-p1-010-011-workers-queue-heartbeat-2026-05-22-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:f670a7ba4b | history/tasks/architecture-evidence-graph-system-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:arch-graph-ai-assistant-foundation-backfill-2026-05-24:bb9f438af4 | history/tasks/architecture-graph-ai-assistant-foundation-backfill-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:task-architecture-graph-api-platform-safety-backfill:622ca95f44 | history/tasks/architecture-graph-api-platform-safety-backfill-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:task-architecture-graph-api-support-routes-backfill:8466799004 | history/tasks/architecture-graph-api-support-routes-backfill-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:architecture-graph-auth-session-deep-backfill-2026-05-24:31f7730b74 | history/tasks/architecture-graph-auth-session-deep-backfill-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:architecture-graph-backtests-backfill-2026-05-24:964c85fde8 | history/tasks/architecture-graph-backtests-backfill-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:ab578dab41 | history/tasks/architecture-graph-bot-runtime-backfill-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:54c0902d4c | history/tasks/architecture-graph-bot-setup-backfill-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:arch-graph-drift-detection-2026-05-24:8a4424886d | history/tasks/architecture-graph-drift-detection-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:d8e6b62a43 | history/tasks/architecture-graph-exchange-adapter-backfill-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:architecture-graph-full-drift-closure-2026-05-24:53d6ec9a98 | history/tasks/architecture-graph-full-drift-closure-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:arch-graph-logs-audit-backfill-2026-05-24:e7375e9047 | history/tasks/architecture-graph-logs-audit-backfill-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:cdbbc39853 | history/tasks/architecture-graph-manual-order-backfill-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:architecture-graph-markets-backfill-2026-05-24:727c9ba565 | history/tasks/architecture-graph-markets-backfill-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:arch-graph-ops-config-pipeline-backfill-2026-05-24:a3a5ff99de | history/tasks/architecture-graph-ops-config-pipeline-backfill-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:d017a92d77 | history/tasks/architecture-graph-positions-backfill-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:a9c4d9e3f1 | history/tasks/architecture-graph-profile-api-keys-backfill-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:arch-graph-reports-backfill-2026-05-24:eb5ca63ba2 | history/tasks/architecture-graph-reports-backfill-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:task-architecture-graph-runtime-support-services-backfill:c963b4b284 | history/tasks/architecture-graph-runtime-support-services-backfill-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:architecture-graph-strategies-backfill-2026-05-24:100cd67353 | history/tasks/architecture-graph-strategies-backfill-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:32ca1a06e5 | history/tasks/architecture-graph-strict-guardrail-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:arch-graph-subscriptions-admin-backfill-2026-05-24:db6f9fe944 | history/tasks/architecture-graph-subscriptions-admin-backfill-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:81e45db262 | history/tasks/architecture-graph-wallets-backfill-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:architecture-graph-web-runtime-surfaces-backfill-2026-05-24:3fdaea0b90 | history/tasks/architecture-graph-web-runtime-surfaces-backfill-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:8d3787d65c | history/tasks/aud07-isolated-db-runner-2026-05-19-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:99aaa74d9c | history/tasks/aud09-neutral-exchange-type-aliases-2026-05-19-task.md |
| connected_to | project:soar:7c70e892d7 | task:backend-permission-and-data-isolation-review-task:6bbc4f70d1 | history/tasks/backend-permission-isolation-review-2026-05-21-task.md |
| connected_to | project:soar:7c70e892d7 | task:backtest-non-binance-order-book-fail-closed-2026-05-23:fa7d994728 | history/tasks/backtest-non-binance-order-book-fail-closed-2026-05-23-task.md |
| connected_to | project:soar:7c70e892d7 | task:bhist-01-bot-portfolio-history-and-capital-events-task:f4932dbe7b | history/tasks/bhist-01-bot-portfolio-history-and-capital-events-task-2026-05-01.md |
| connected_to | project:soar:7c70e892d7 | task:task:b5e9d03948 | history/tasks/binance-futures-api-key-probe-scope-fix-task-2026-05-10.md |
| connected_to | project:soar:7c70e892d7 | task:task:c4054413f1 | history/tasks/bot-delete-active-paper-confirmation-task-2026-05-11.md |
| connected_to | project:soar:7c70e892d7 | task:botdrift-01-bot-read-projection-canonical-context-task:5bcfa3d6de | history/tasks/botdrift-01-bot-read-projection-canonical-context-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:botdrift-02-bot-update-canonical-guard-task:d7cf111912 | history/tasks/botdrift-02-bot-update-canonical-guard-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:task:14c6b24780 | history/tasks/botmulti-00-planning-task-2026-04-29.md |
| connected_to | project:soar:7c70e892d7 | task:task:ec82a39964 | history/tasks/botmulti-01-post-v1-multi-strategy-contract-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:task:b80c4ab358 | history/tasks/botmulti-03-canonical-topology-migration-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:task:c528572748 | history/tasks/botmulti-04-api-write-multi-strategy-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:task:8885f804cb | history/tasks/botmulti-05-runtime-signal-merge-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:task:4d1c739e58 | history/tasks/botmulti-06-runtime-risk-lifecycle-ownership-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:task:1317a2178a | history/tasks/botmulti-07-web-operator-multi-strategy-truth-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:task:705a202cd5 | history/tasks/botmulti-08-architecture-runtime-closure-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:task:5d392424f6 | history/tasks/botmulti-09-containment-supersede-00169d7f-2026-05-12-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:d0574fe21f | history/tasks/botmulti-09-current-production-containment-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:task:d7f5f52e6e | history/tasks/botmulti-09-production-deploy-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:coolify-auto-deploy-and-worker-recovery-2026-05-26:b99a704cbd | history/tasks/coolify-auto-deploy-and-worker-recovery-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:coolify-service-stack-liveness-gate-task:088e2ed985 | history/tasks/coolify-service-stack-liveness-gate-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:coolify-service-stack-migration-2026-05-25:7006202444 | history/tasks/coolify-service-stack-migration-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:coolify-stack-profile-gated-cutover-2026-05-25:c24faafdc3 | history/tasks/coolify-stack-profile-gated-cutover-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:0d42051f88 | history/tasks/current-executable-v1-boundary-3c5da343-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:task:c876788105 | history/tasks/current-focus-4ee1672e-sync-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:dashboard-runtime-current-state-aggregate-task-2026-05-09:04d02141e9 | history/tasks/dashboard-runtime-current-state-aggregate-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:task:f3bb6b161e | history/tasks/dashboard-runtime-signal-condition-active-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:dashboard-runtime-widget-aggregate-current-render-task-2026-05-09:9daa556da3 | history/tasks/dashboard-runtime-widget-aggregate-current-render-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:task:d6e9b97974 | history/tasks/dashdisplay-01-prod-dashboard-display-polish-task-2026-05-02.md |
| connected_to | project:soar:7c70e892d7 | task:dashdrift-02-position-edit-strategy-display-task:054bc1381d | history/tasks/dashdrift-02-position-edit-strategy-display-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:task:86d5f6b4b8 | history/tasks/dashdrift-03-dynamic-stop-columns-canonical-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:task:27a3e18d08 | history/tasks/dashdrift-04-symbol-dynamic-stop-plans-canonical-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:task:25e59e5e68 | history/tasks/dashdrift-05-symbol-stats-filter-canonical-scope-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:task:17ae624024 | history/tasks/dashsignals-01-indicator-value-pending-display-task-2026-05-02.md |
| connected_to | project:soar:7c70e892d7 | task:task:4e3c59212b | history/tasks/dashsignals-02-indicator-recovery-before-unavailable-task-2026-05-02.md |
| connected_to | project:soar:7c70e892d7 | task:task:06507d77b2 | history/tasks/deploy-freshness-010b4f8b-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:task:234241dcc3 | history/tasks/deploy-freshness-1dc55d96-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:task:2c1e1a8915 | history/tasks/deploy-freshness-30b027b7-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:task:b8accdf38f | history/tasks/deploy-freshness-3c5da343-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:task:ca3a927c88 | history/tasks/deploy-freshness-4792fbca-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:task:01bf85cf43 | history/tasks/deploy-freshness-4ee1672e-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:task:3f844e0d4c | history/tasks/deploy-freshness-55469cdc-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:task:2c5a6dbb15 | history/tasks/deploy-freshness-6c54bb5d-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:task:35392fc0c0 | history/tasks/deploy-freshness-90cd07d6-task-2026-05-08.md |
| connected_to | project:soar:7c70e892d7 | task:deploy-freshness-9c125683:e08e777e63 | history/tasks/deploy-freshness-9c125683-task-2026-05-10.md |
| connected_to | project:soar:7c70e892d7 | task:task:87a2030f8a | history/tasks/deploy-freshness-ba3d852d-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:task:bc30c783df | history/tasks/deploy-freshness-c50e1e7c-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:deploy-freshness-e8cd748e-task-2026-05-09:7b6aea0dcc | history/tasks/deploy-freshness-e8cd748e-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:task:4158009a48 | history/tasks/deploy-lag-1f1d9c12-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:task:ee0ec67cac | history/tasks/deploy-lag-d355df93-follow-up-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:deploy-lag-e70f5cf6-2026-05-10:9b71503178 | history/tasks/deploy-lag-e70f5cf6-task-2026-05-10.md |
| connected_to | project:soar:7c70e892d7 | task:task:7e75a1cdbb | history/tasks/deploy-web-build-hotfix-validation-task-2026-04-25.md |
| connected_to | project:soar:7c70e892d7 | task:task:7a58a06a47 | history/tasks/doc-content-graph-hygiene-2026-05-23-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:048b0ca63c | history/tasks/doc-final-content-clarity-scan-2026-05-23-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:3430102462 | history/tasks/doc-hub-filename-semantics-2026-05-23-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:67047be4cb | history/tasks/doc-knowledge-system-restructure-2026-05-23-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:8b1e4fd848 | history/tasks/doc-knowledge-taxonomy-refinement-2026-05-23-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:eca34930ba | history/tasks/doc-local-index-cohesion-2026-05-23-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:89b1a6799b | history/tasks/doc-usability-routing-improvement-2026-05-23-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:5f554059f4 | history/tasks/docmap-01-engineering-documentation-system-map-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:task:ff4ecff0bf | history/tasks/docsync-2026-04-28-historical-status-normalization-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:c540612a8e | history/tasks/docsync-2026-04-28-planning-catalog-refresh-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:366a5aff15 | history/tasks/docsync-2026-04-28-stale-active-plan-status-sync-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:34f0002339 | history/tasks/docsync-2026-05-01-mvp-blocked-section-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:a0308454c3 | history/tasks/docsync-2026-05-01-no-autonomous-now-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:4a36a4ff9f | history/tasks/docsync-2026-05-01-queue-auth-blocker-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:56f3d8cbd5 | history/tasks/docsync-2026-05-01-ready-blocked-separation-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:f8e4c093c5 | history/tasks/docsync-2026-05-01-v1excel-historical-carryover-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:c9ce820d16 | history/tasks/docsync-v1-current-phase-truth-task-2026-04-25.md |
| connected_to | project:soar:7c70e892d7 | task:task:361654426e | history/tasks/docsync-v1excel-superseded-gates-task-2026-05-02.md |
| connected_to | project:soar:7c70e892d7 | task:task:1c21388e3a | history/tasks/docsync-v1final-01-superseded-gate-status-task-2026-05-02.md |
| connected_to | project:soar:7c70e892d7 | task:task:f3ffe2e93a | history/tasks/ethdca-01-live-dca-first-tsl-hardening-task-2026-05-02.md |
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
| connected_to | project:soar:7c70e892d7 | task:task:b2b9a8cb7c | history/tasks/exchange2-16-gateio-positions-snapshot-fail-closed-task-2026-05-08.md |
| connected_to | project:soar:7c70e892d7 | task:task:c6158de16d | history/tasks/exchange2-17-gateio-reconciliation-snapshots-fail-closed-task-2026-05-08.md |
| connected_to | project:soar:7c70e892d7 | task:task:28b218c062 | history/tasks/exchange2-18-gateio-live-submit-boundary-task-2026-05-08.md |
| connected_to | project:soar:7c70e892d7 | task:task:facc8f06f1 | history/tasks/exchange2-19-exchange-backed-cancel-route-fail-closed-task-2026-05-08.md |
| connected_to | project:soar:7c70e892d7 | task:task:5f05de7ee3 | history/tasks/exchange2-20-plan-reconciliation-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:task:62a69138fa | history/tasks/exchange2-22-gateio-public-symbol-rules-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:task:50bf172993 | history/tasks/exchange2-23-gateio-paper-pricing-enable-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:exchange2-24-gate-io-api-key-probe:d7037f9851 | history/tasks/exchange2-24-gateio-api-key-probe-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:exchange2-25-gate-io-balance-preview:f484d8a05b | history/tasks/exchange2-25-gateio-balance-preview-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:exchange2-26-gate-io-positions-snapshot:1f95756005 | history/tasks/exchange2-26-gateio-positions-snapshot-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:exchange2-27-gate-io-open-orders-snapshot:59f847ad8b | history/tasks/exchange2-27-gateio-open-orders-snapshot-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:exchange2-28-gate-io-trade-history-snapshot:565b41d3fb | history/tasks/exchange2-28-gateio-trade-history-snapshot-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:exchange2-29-gate-io-wallet-cashflow-history:8fd0c3b75d | history/tasks/exchange2-29-gateio-wallet-cashflow-history-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:exchange2-30-gate-io-live-order-submit:20934fb453 | history/tasks/exchange2-30-gateio-live-order-submit-task-2026-05-10.md |
| connected_to | project:soar:7c70e892d7 | task:exchange2-31-live-order-cancel-boundary:8d2a786dc4 | history/tasks/exchange2-31-live-order-cancel-boundary-task-2026-05-10.md |
| connected_to | project:soar:7c70e892d7 | task:task:2026ed0dbb | history/tasks/frontend-engine-ux-dca-sweep-2026-05-21-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:54ec5eb74b | history/tasks/frontend-security-ux-owasp-sweep-2026-05-21-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:b3e17cb287 | history/tasks/fullarch-fix-01-recovered-imported-position-visibility-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:2beb13d591 | history/tasks/fullarch-fix-03-reconciliation-diagnostics-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:fullarch-fix-04-web-navigation-mock-harness:f13d01bb45 | history/tasks/fullarch-fix-04-web-navigation-mock-harness-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:fullarch-fix-05-api-single-active-bot-scope-closure:f54cea4cbc | history/tasks/fullarch-fix-05-api-single-active-bot-scope-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:96ad09b986 | history/tasks/fullarch-fix-06-binance-futures-position-normalization-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:598010b9b9 | history/tasks/fullarch-fix-07-runtime-repair-closure-validation-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:6cf8a5e53e | history/tasks/fullarch-fix-09-strategy-backtest-reports-logs-gate-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:520a872883 | history/tasks/fullarch-fix-11-wallet-market-bot-topology-gate-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:500e2dddaf | history/tasks/function-journey-evidence-index-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:0f76397de5 | history/tasks/futures-only-api-key-acceptance-task-2026-05-10.md |
| connected_to | project:soar:7c70e892d7 | task:gate-io-live-bot-context-repair-2026-05-23:0652c33832 | history/tasks/gateio-live-bot-context-repair-2026-05-23-task.md |
| connected_to | project:soar:7c70e892d7 | task:gate-io-live-manual-order-ada-short-attempt-2026-05-23:88bc4e9f48 | history/tasks/gateio-live-manual-order-ada-short-2026-05-23-task.md |
| connected_to | project:soar:7c70e892d7 | task:gate-io-live-reconciliation-scope:84f645d2e8 | history/tasks/gateio-live-reconciliation-scope-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:7b77c84489 | history/tasks/live-bot-symbol-overlap-guard-task-2026-04-28.md |
| connected_to | project:soar:7c70e892d7 | task:task:101f56fb0c | history/tasks/live-dca-submitted-fill-gate-2026-05-22-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:48a9111746 | history/tasks/live-import-ownership-wallet-scope-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:task:19298faa7f | history/tasks/live-import-single-strategy-provenance-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:task:8d7fd0a48c | history/tasks/live-runtime-kill-switch-config-task-2026-05-10.md |
| connected_to | project:soar:7c70e892d7 | task:task:b5a1b3e380 | history/tasks/liveimport-03-current-main-candidate-triage-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:20d323ae6c | history/tasks/liveimport-03-current-production-target-sync-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:task-local-certainty-closure-2026-05-21:a8d07f98c0 | history/tasks/local-certainty-closure-2026-05-21-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:931c56a0d4 | history/tasks/local-docker-coolify-parity-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:task-local-integrity-build-sweep:9f6a181112 | history/tasks/local-integrity-build-sweep-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:e837a45489 | history/tasks/luc-100-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:5a6c82e240 | history/tasks/luc-1004-account-access-seedticker-doc-link-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1009-source-control-closure-luc-983-luc-994-and-luc-1004:e9f7ada751 | history/tasks/luc-1009-source-control-closure-luc-983-luc-994-luc-1004-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:3f717f2ef9 | history/tasks/luc-1011-account-access-registerandlogin-doc-link-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:fe4a823261 | history/tasks/luc-1016-account-access-resolveaggregatesessionwindowend-proof-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:4b1689e808 | history/tasks/luc-1019-account-access-deduperuntimeopenorders-doc-link-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:8bec924620 | history/tasks/luc-102-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:9bcbe1628e | history/tasks/luc-1023-account-access-deduperuntimeopenorders-proof-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1026-account-access-useauth-local-proof:c92ff7d740 | history/tasks/luc-1026-account-access-useauth-local-proof-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:907a57e2d9 | history/tasks/luc-1026-blocked-triage-classify-luc-919-and-produce-next-legal-action-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1027-child-read-only-failed-deploy-diagnosis-2026-05-31:7aabac40e4 | history/tasks/luc-1027-child-read-only-failed-deploy-diagnosis-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:4783c750b6 | history/tasks/luc-1027-registerpage-frontend-proof-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1027-soar-coolify-production-deploy-health-sweep-2026-05-31:08222209df | history/tasks/luc-1027-soar-coolify-production-deploy-health-sweep-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-103-source-control-closure-2026-05-26-task:5797dc0746 | history/tasks/luc-103-source-control-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:8e90b5d6a3 | history/tasks/luc-1030-password-visibility-toggle-and-hydration-ready-frontend-proof-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:f4554681a0 | history/tasks/luc-1031-account-access-fetchauthenticatedbalancepreview-proof-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1032-resolveopsauthtoken-and-runcontrolledlivesessionproof-runtime-proof-refresh:83a2bf0f21 | history/tasks/luc-1032-runtime-proof-refresh-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:aee6bc8809 | history/tasks/luc-1033-blocked-triage-classify-luc-962-and-produce-next-legal-action-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:1131e4b03c | history/tasks/luc-1035-account-access-resolveruntimetakeoverstatus-doc-link-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:6401e5b52b | history/tasks/luc-1039-account-access-selectruntimeopenorders-doc-link-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:9dced6cc5e | history/tasks/luc-1040-account-access-selectruntimeopenorders-proof-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:2172043428 | history/tasks/luc-1042-source-control-closure-luc-1011-luc-1016-luc-1019-luc-1023-plus-7-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-105-runtime-signal-loop-test-closure-repair-2026-05-26:aa7633a58c | history/tasks/luc-105-runtime-signal-loop-test-closure-repair-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:a48a471703 | history/tasks/luc-1050-account-access-resolveclosedresult-doc-link-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:3d9a3a0bad | history/tasks/luc-1054-account-access-resolveclosedresult-proof-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:3f0bb589de | history/tasks/luc-1059-account-access-resolvesinglecanonicalstrategyid-doc-link-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:f4a908ed10 | history/tasks/luc-1060-account-access-resolvesinglecanonicalstrategyid-proof-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:b6928b7c5b | history/tasks/luc-1064-source-control-closure-classify-and-close-local-dirty-state-for-luc-241-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1065-soar-coolify-production-deploy-health-sweep-2026-05-31:662535a06a | history/tasks/luc-1065-soar-coolify-production-deploy-health-sweep-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:950196bd27 | history/tasks/luc-1067-account-access-resolveruntimepositiondcacount-doc-link-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:9c8d819b32 | history/tasks/luc-1068-source-control-closure-classify-and-close-local-dirty-state-for-luc-1065-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:6c27c2b239 | history/tasks/luc-1069-account-access-resolveruntimepositiondcacount-proof-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-107-coolify-production-deploy-health-sweep-2026-05-26:24df882fdd | history/tasks/luc-107-coolify-production-deploy-health-sweep-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1071-account-access-countruntimemanagedpositions-proof:aabc4e88ef | history/tasks/luc-1071-account-access-countruntimemanagedpositions-proof-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:a0e0b041fd | history/tasks/luc-1073-account-access-countruntimemanagedpositions-doc-link-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1075-account-access-getruntimepositionbotcontext-proof:74fe68f4e5 | history/tasks/luc-1075-account-access-getruntimepositionbotcontext-proof-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:a4745ddc09 | history/tasks/luc-1075-blocked-triage-classify-luc-1068-and-produce-next-legal-action-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:267a61c82e | history/tasks/luc-1077-account-access-getruntimepositionbotcontext-doc-link-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1079-account-access-listruntimemanagedpositions-proof:b0b621030f | history/tasks/luc-1079-account-access-listruntimemanagedpositions-proof-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:7c4d7a4197 | history/tasks/luc-108-account-access-requireauth-doc-link-2026-07-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:7e2c20d0f1 | history/tasks/luc-108-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1080-infra-gate-diagnose-production-dns-network-failure-for-luc-241-2026-05-31-task:7ce4e4941f | history/tasks/luc-1080-infra-gate-diagnose-production-dns-network-failure-for-luc-241-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:f56e072f5f | history/tasks/luc-1081-account-access-listruntimemanagedpositions-doc-link-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1083-account-access-listruntimeopenorders-proof:03797ca706 | history/tasks/luc-1083-account-access-listruntimeopenorders-proof-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:477cfb2ee5 | history/tasks/luc-1083-source-control-closure-classify-and-close-local-dirty-state-for-luc-241-luc-1080-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1085-account-access-listruntimeopenorders-doc-link-closure:251bd9dad2 | history/tasks/luc-1085-account-access-listruntimeopenorders-doc-link-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1087-account-access-listruntimepositionlastprices-proof:18797e03d8 | history/tasks/luc-1087-account-access-listruntimepositionlastprices-proof-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1089-account-access-listruntimepositionlastprices-doc-link-closure:418d870d18 | history/tasks/luc-1089-account-access-listruntimepositionlastprices-doc-link-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1091-account-access-listruntimepositionstrategies-proof:795aacecd4 | history/tasks/luc-1091-account-access-listruntimepositionstrategies-proof-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1094-account-access-listruntimepositionstrategies-doc-link-closure:93caeed90e | history/tasks/luc-1094-account-access-listruntimepositionstrategies-doc-link-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1096-account-access-listruntimepositiontraderows-proof:11de1ab48b | history/tasks/luc-1096-account-access-listruntimepositiontraderows-proof-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:bee3f0c82d | history/tasks/luc-1097-source-control-closure-classify-and-close-local-dirty-state-for-luc-241-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1098-account-access-listruntimepositiontraderows-doc-link-closure:e75012b2e8 | history/tasks/luc-1098-account-access-listruntimepositiontraderows-doc-link-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:56efb0ec2d | history/tasks/luc-110-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1100-account-access-sumruntimemanagedpositionmarginused-proof:31df3a2003 | history/tasks/luc-1100-account-access-sumruntimemanagedpositionmarginused-proof-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1102-account-access-sumruntimemanagedpositionmarginused-doc-link-closure:a46ac399c2 | history/tasks/luc-1102-account-access-sumruntimemanagedpositionmarginused-doc-link-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1104-source-control-closure-classify-and-close-local-dirty-state-for-luc-1067-luc-1069:5b3958ff3b | history/tasks/luc-1104-source-control-closure-classify-and-close-local-dirty-state-for-luc-1067-luc-1069-luc-1071-luc-1073-plus-14-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1105-soar-coolify-production-deploy-health-sweep-2026-05-31:68ba559700 | history/tasks/luc-1105-soar-coolify-production-deploy-health-sweep-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1108-account-access-sumruntimemanagedpositionquantity-proof:8474c88aea | history/tasks/luc-1108-account-access-sumruntimemanagedpositionquantity-proof-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:57e6ef2ba7 | history/tasks/luc-1108-source-control-closure-classify-and-close-luc-1105-context-evidence-dirty-set-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1111-account-access-sumruntimemanagedpositionquantity-doc-link-closure:611d10f85c | history/tasks/luc-1111-account-access-sumruntimemanagedpositionquantity-doc-link-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:29acc6f356 | history/tasks/luc-1112-architecture-docs-executable-repair-backlog-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:f6b8458640 | history/tasks/luc-1115-source-control-closure-classify-and-close-local-dirty-state-for-luc-1068-luc-1075-luc-1112-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1116-task-account-access-sumruntimemanagedpositionrealizedpnl-proof:7c7a8bc70e | history/tasks/luc-1116-account-access-sumruntimemanagedpositionrealizedpnl-proof-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:2e0e4bc1cf | history/tasks/luc-1119-source-control-closure-classify-and-close-local-dirty-state-for-luc-1068-luc-1075-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:7c0726358c | history/tasks/luc-112-architecture-awareness-docs-graph-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:85d8ce0309 | history/tasks/luc-1120-blocked-triage-classify-luc-1119-and-produce-next-legal-action-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1120-source-control-closure-classify-and-close-local-dirty-state-for-luc-149:66a9a2c378 | history/tasks/luc-1120-source-control-closure-classify-and-close-local-dirty-state-for-luc-149-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:0b6fc95219 | history/tasks/luc-1121-state-reconciliation-correct-luc-1119-disposition-drift-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:a5a57a273d | history/tasks/luc-1122-source-control-closure-classify-and-close-local-dirty-state-for-luc-1119-luc-1120-luc-1121-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:f8299870bb | history/tasks/luc-1123-softwarehouse-blocked-triage-classify-luc-405-and-produce-next-legal-action-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1124-public-read-only-browser-proof:876fe4f1c1 | history/tasks/luc-1124-public-read-only-browser-proof-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:c39b2e2815 | history/tasks/luc-1126-source-control-closure-classify-and-close-local-dirty-state-for-luc-405-luc-1123-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:3c85da3d86 | history/tasks/luc-1127-softwarehouse-blocked-triage-classify-luc-973-and-produce-next-legal-action-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:3c7b267e02 | history/tasks/luc-1128-soar-source-control-closure-classify-and-close-local-dirty-state-for-luc-973-luc-1127-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:9828579e87 | history/tasks/luc-113-docs-analysis-provenance-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:8a04f54a98 | history/tasks/luc-114-qa-repeatable-smoke-evidence-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:757dc2b1df | history/tasks/luc-1144-soar-luc-241-backend-source-level-auth-map-for-workers-ready-and-fix-lane-stub-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:f81b624280 | history/tasks/luc-1145-read-only-permission-decision-packet-for-workers-ready-smoke-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:78d66bcad9 | history/tasks/luc-1146-workers-ready-minimal-smoke-evidence-classification-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:2e0a9a6413 | history/tasks/luc-1148-source-control-closure-classify-and-close-local-dirty-state-for-luc-241-luc-1144-luc-1145-luc-1146-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:task-contract:f8afad2552 | history/tasks/luc-1148-source-control-closure-comment-73477930-local-repair-lane-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:4ed8a8ebe1 | history/tasks/luc-1148-source-control-closure-comment-followup-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:4fb62e45fc | history/tasks/luc-1148-source-control-closure-finish-successful-run-handoff-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:task-contract:a3e81e1568 | history/tasks/luc-1148-source-control-closure-issue-continuation-needed-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:ededfd1508 | history/tasks/luc-1148-source-control-closure-source-scoped-recovery-action-2-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:938e4124be | history/tasks/luc-1148-source-control-closure-source-scoped-recovery-action-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-115-luc-86-ops-evidence-closure-2026-05-26:c22069664f | history/tasks/luc-115-luc-86-ops-evidence-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1152-admin-operation-get-root-doc-link-closure:61267e411b | history/tasks/luc-1152-admin-operation-get-doc-link-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:03b4397f6d | history/tasks/luc-1154-known-state-refresh-evidence-delta-and-next-repair-lanes-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1155-admin-operation-use-users-missing-test-link-closure:9033f8f025 | history/tasks/luc-1155-admin-operation-use-users-missing-test-link-2026-07-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:77461ff0cc | history/tasks/luc-116-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1160-soar-production-stability-diagnose-coolify-restart-loop-and-runtime-crash-cause-2:165294b858 | history/tasks/luc-1160-soar-production-stability-diagnose-coolify-restart-loop-and-runtime-crash-cause-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:0430bdb08e | history/tasks/luc-1161-soar-qa-reconcile-public-green-endpoints-with-restart-evidence-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1162-account-access-use-users-doc-link-closure:f46f93f7f3 | history/tasks/luc-1162-account-access-use-users-doc-link-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:e9d28a35b2 | history/tasks/luc-1162-soar-luc-241-security-validate-workers-ready-principal-permission-path-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:c4f3320f75 | history/tasks/luc-1163-workers-ready-smoke-recheck-with-decision-matrix-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:c1f1f1fc29 | history/tasks/luc-1164-soar-luc-241-backend-trace-workers-ready-auth-chain-and-fix-ready-map-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1165-gate-io-position-ingestion-and-exchange-sync-fix:dabee5ce03 | history/tasks/luc-1165-soar-gateio-fix-production-position-ingestion-and-exchange-sync-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1166-admin-operation-use-admin-missing-test-link-closure:a05de8c133 | history/tasks/luc-1166-admin-operation-use-admin-missing-test-link-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:task-contract-luc-1166:57642cdf7c | history/tasks/luc-1166-soar-gateio-qa-verify-position-ingestion-readiness-after-adapter-fix-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:task-contract-luc-1167:58cfdbcac5 | history/tasks/luc-1167-soar-bot-signals-verify-active-bot-signal-dashboard-semantics-2026-05-31-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:e8b013b371 | history/tasks/luc-117-release-smoke-blocker-evidence-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task-contract-luc-1174:ffcc0d4836 | history/tasks/luc-1174-soar-v1-conformance-backend-verify-exchange-positions-dca-tsl-workers-readiness-contracts-2026-06-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1175-account-access-use-admin-missing-doc-link-closure:f5d6c8a4bb | history/tasks/luc-1175-account-access-use-admin-missing-doc-link-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1175-soar-v1-conformance-frontend-verification-2026-06-01:2b61a67754 | history/tasks/luc-1175-soar-v1-conformance-frontend-verify-dashboard-active-bot-context-signals-and-trading-ux-display-2026-06-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1176-soar-v1-conformance-qa-build-v1-acceptance-matrix-and-regression-evidence-map:789f23f45e | history/tasks/luc-1176-soar-v1-conformance-qa-build-v1-acceptance-matrix-and-regression-evidence-map-2026-06-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1177-soar-v1-conformance-ops-reconcile-deploy-coolify-restart-evidence-and-release-rea:abd1440228 | history/tasks/luc-1177-soar-v1-conformance-ops-reconcile-deploy-coolify-restart-evidence-and-release-readiness-gates-2026-06-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-118-luc-107-coolify-health-evidence-closure-2026-05-26:1106793307 | history/tasks/luc-118-luc-107-coolify-health-evidence-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1186-soar-coolify-production-deploy-health-sweep-2026-06-01:ceabf40a9e | history/tasks/luc-1186-soar-coolify-production-deploy-health-sweep-2026-06-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:74b766f5f3 | history/tasks/luc-1188-admin-root-browser-review-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:task-contract-luc-1188:c63c13500b | history/tasks/luc-1188-soar-v1-conformance-backend-worker-endpoint-to-contract-drift-matrix-dca-tsl-positions-2026-06-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1189-soar-v1-conformance-test-automation-worker-turn-acceptance-matrix-rows-into-execu:3fa6fc3be2 | history/tasks/luc-1189-soar-v1-conformance-test-automation-worker-turn-acceptance-matrix-rows-into-executable-regression-checks-2026-06-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-119-luc-98-release-permit-evidence-closure-2026-05-26:114a7e96b8 | history/tasks/luc-119-luc-98-release-permit-evidence-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:c8f83ee72e | history/tasks/luc-1190-workers-ready-security-smoke-principal-authorization-gate-2026-06-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:8aed160b69 | history/tasks/luc-1193-account-access-admin-root-missing-test-link-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:b0f0e6c311 | history/tasks/luc-1194-soar-backend-luc-1188-add-endpoint-contract-test-post-dashboard-positions-orphan-repair-2026-06-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:task-contract-luc-1195:2c1f922e9b | history/tasks/luc-1195-soar-backend-luc-1188-consolidate-dca-tsl-route-conformance-pack-runtime-positions-read-2026-06-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:task-contract-luc-1195:f53e5b06c3 | history/tasks/luc-1195-soar-backend-luc-1188-consolidate-dca-tsl-route-level-conformance-pack-runtime-positions-read-2026-06-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:task-contract-luc-1196:2a2ba539fa | history/tasks/luc-1196-soar-backend-luc-1188-add-dca-first-close-authority-route-level-pack-for-runtime-position-close-endpoint-2026-06-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:task-contract-luc-1196:a257c1e35a | history/tasks/luc-1196-soar-backend-luc-1188-add-dca-first-close-authority-route-level-pack-runtime-position-close-endpoint-2026-06-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1197-soar-backend-ops-luc-1188-unblock-workers-ready-contract-suite-and-close-readines:3d496682a8 | history/tasks/luc-1197-soar-backend-ops-luc-1188-unblock-workers-ready-contract-suite-and-close-readiness-proof-gap-2026-06-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:task-contract-luc-1197-continuation-source-scoped-recovery-action:6b7e412486 | history/tasks/luc-1197-source-scoped-recovery-workers-ready-suite-reblock-2026-06-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:9c3103f0bc | history/tasks/luc-1198-account-access-admin-page-doc-link-proof-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:f3d3cefc79 | history/tasks/luc-121-frontend-map-inventory-evidence-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1216-source-control-closure-task:484fcd077c | history/tasks/luc-1216-source-control-closure-for-luc-1198-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:task-luc-1218-stale-admin-root-missing-doc-link-emission-refresh:795adbb2bd | history/tasks/luc-1218-stale-admin-root-missing-doc-link-emission-refresh-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:0f962bdf9e | history/tasks/luc-122-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:fda2406595 | history/tasks/luc-1223-classify-and-close-local-dirty-state-for-luc-1220-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:2cc0940ce1 | history/tasks/luc-1223-soar-source-control-closure-classify-and-close-local-dirty-state-for-luc-241-luc-1160-luc-1161-luc-1162-plus-17-2026-06-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1237-soar-coolify-production-deploy-health-sweep-2026-06-01:72ff555902 | history/tasks/luc-1237-soar-coolify-production-deploy-health-sweep-2026-06-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:7fd9a531ae | history/tasks/luc-1240-admin-users-page-browser-review-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1246-source-control-closure-task:5923836921 | history/tasks/luc-1246-source-control-closure-for-luc-1240-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:1006502740 | history/tasks/luc-1247-architecture-docs-executable-repair-backlog-2026-06-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:924ba7d5a7 | history/tasks/luc-1249-account-access-admin-users-page-doc-link-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:c0843e4c26 | history/tasks/luc-125-luc-49-ui-state-browser-proof-matrix-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task-luc-1250-refresh-project-truth-ingestion-after-admin-users-doc-link-closure:44a6d2ef46 | history/tasks/luc-1250-refresh-project-truth-ingestion-after-admin-users-doc-link-closure-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1256-known-state-evidence-architecture-baseline-2026-06-01-task:d69613fb31 | history/tasks/luc-1256-known-state-evidence-architecture-baseline-2026-06-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:770652babb | history/tasks/luc-1259-adminuserspage-browser-review-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:350c8fcb6e | history/tasks/luc-126-v1-audit-to-completion-controller-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:0b53f47ce7 | history/tasks/luc-1261-adminuserspage-missing-doc-link-baseline-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:95bf6d67be | history/tasks/luc-1261-adminuserspage-missing-doc-link-closeout-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1263-source-control-closure-task:a427214e66 | history/tasks/luc-1263-source-control-closure-for-luc-1259-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:d0d798adbc | history/tasks/luc-1264-adminuserspage-feature-doc-link-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:task-luc-1265-clear-stale-adminuserspage-project-truth-emission:7ef19182ce | history/tasks/luc-1265-stale-adminuserspage-project-truth-refresh-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:a42a64e834 | history/tasks/luc-1267-source-control-closure-luc-1261-luc-1264-luc-1265-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:f7905eb1d8 | history/tasks/luc-1268-source-control-closure-luc-1261-luc-1264-luc-1265-luc-1267-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:ddc542514e | history/tasks/luc-127-luc-64-backend-runtime-signal-docs-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:925bb2530f | history/tasks/luc-1271-dashboard-overview-get-missing-test-link-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:81481e8958 | history/tasks/luc-1272-source-control-closure-for-luc-1271-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:c867d59585 | history/tasks/luc-1275-dashboard-overview-get-missing-doc-link-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:66e28a9bfe | history/tasks/luc-1276-source-control-closure-luc-1275-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1277-soar-coolify-production-deploy-health-sweep-2026-06-01:9f05e8ba4b | history/tasks/luc-1277-soar-coolify-production-deploy-health-sweep-2026-06-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:9595e7bb22 | history/tasks/luc-128-luc-45-v1-controller-docs-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:0ce455fc08 | history/tasks/luc-1280-dashboard-overview-use-backtests-missing-doc-link-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:686dbdeb30 | history/tasks/luc-1282-source-control-closure-luc-1280-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:47582dd6c8 | history/tasks/luc-1284-source-control-closure-luc-1280-luc-1282-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:908c9ad7d4 | history/tasks/luc-1286-dashboard-overview-use-bots-missing-test-link-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:ee07a78a6b | history/tasks/luc-1288-source-control-closure-for-luc-1286-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:cf0be48fd7 | history/tasks/luc-1289-account-access-use-bots-missing-doc-link-2026-07-15-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:c5ee399a01 | history/tasks/luc-129-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:aeba61c576 | history/tasks/luc-1293-source-control-closure-for-luc-1289-2026-07-16-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:04e8f70a9f | history/tasks/luc-1294-dashboard-overview-use-icons-missing-test-link-2026-07-16-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-130-luc-88-productivity-review-evidence-closure-2026-05-26:4c8237b1c5 | history/tasks/luc-130-luc-88-productivity-review-evidence-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:f623777aa1 | history/tasks/luc-1303-dashboard-overview-use-logs-missing-test-link-2026-07-16-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:30c5a48360 | history/tasks/luc-1306-soar-operator-resume-dca-tsl-repair-2026-06-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1307-soar-coolify-production-deploy-health-sweep-2026-06-01:f2b6c63f0f | history/tasks/luc-1307-soar-coolify-production-deploy-health-sweep-2026-06-01-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-131-luc-86-latest-health-sweep-task-closure-2026-05-26:2ecee2d981 | history/tasks/luc-131-luc-86-latest-health-sweep-task-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:1f4f3831a3 | history/tasks/luc-1313-account-access-use-logs-missing-doc-link-2026-07-16-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-132-luc-19-runtime-readiness-task-closure-2026-05-26:fb150b0445 | history/tasks/luc-132-luc-19-runtime-readiness-task-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:450be2565b | history/tasks/luc-1322-dashboard-overview-use-market-stream-missing-test-link-2026-07-16-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:ffa70b0986 | history/tasks/luc-1327-source-control-closure-for-luc-1322-2026-07-16-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:0f2c0f8f15 | history/tasks/luc-1329-account-access-use-market-stream-missing-doc-link-2026-07-16-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:f6ff5f055f | history/tasks/luc-133-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:ea92a4d8f8 | history/tasks/luc-1330-source-control-closure-for-luc-1329-2026-07-16-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:b37789568d | history/tasks/luc-1332-dashboard-overview-use-markets-missing-test-link-2026-07-16-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:4fbe62c3b8 | history/tasks/luc-1336-account-access-use-markets-missing-doc-link-2026-07-16-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:38813b3c67 | history/tasks/luc-1348-source-control-closure-for-luc-149-2026-07-16-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:589e1a4d7e | history/tasks/luc-1349-dashboard-overview-use-orders-missing-doc-link-2026-07-16-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-135-source-control-closure-artifacts-lane-2026-05-26:0f14e401a7 | history/tasks/luc-135-source-control-closure-artifacts-lane-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:e64f58165d | history/tasks/luc-1350-source-control-closure-for-luc-1349-2026-07-16-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:bcc24ef9f5 | history/tasks/luc-1353-dashboard-overview-use-positions-missing-test-link-2026-07-16-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:dab3e2cff0 | history/tasks/luc-1359-restore-production-api-ready-503-runtime-2026-07-17-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:99b465c313 | history/tasks/luc-136-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task-luc-1362-reconcile-stale-use-positions-project-truth-gap-for-luc-1353:3af1352912 | history/tasks/luc-1362-reconcile-stale-use-positions-project-truth-gap-for-luc-1353-2026-07-17-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:291b3c3d52 | history/tasks/luc-1365-source-control-closure-for-luc-1353-luc-1359-luc-1362-2026-07-17-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:f7dfd8bc5e | history/tasks/luc-1366-source-control-closure-for-luc-1353-luc-1359-luc-1362-luc-1365-2026-07-17-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:5a4b35fe1c | history/tasks/luc-1367-operator-soar-owner-login-verification-path-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:c13061e3d8 | history/tasks/luc-1367-source-control-closure-for-luc-1353-luc-1359-luc-1362-luc-1365-plus-1-2026-07-17-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:0ba21be902 | history/tasks/luc-1368-operator-soar-protected-test-account-smoke-path-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:6ab0a5b46b | history/tasks/luc-1368-provide-deploy-capable-redis-recovery-path-2026-07-17-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-137-docs-operations-closure-bundle-2026-05-26:d3cd9bdf63 | history/tasks/luc-137-docs-operations-closure-bundle-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1371-reconcile-coolify-resource-inventory:23deaf26cf | history/tasks/luc-1371-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1371-soar-coolify-resource-inventory-task:2bb9896e56 | history/tasks/luc-1371-soar-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:cf9cfac564 | history/tasks/luc-1371-source-control-closure-for-luc-1353-luc-1359-luc-1362-luc-1365-plus-2-2026-07-17-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:adb5abb56e | history/tasks/luc-1374-diagnose-and-recover-redis-restarting-unhealthy-2026-07-17-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:b9dfd68fbd | history/tasks/luc-1378-execute-owner-login-proof-under-security-gate-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:f4b2f07f31 | history/tasks/luc-1379-account-access-use-positions-missing-doc-link-2026-07-17-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:f795e4ad8c | history/tasks/luc-138-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:1c6d80f743 | history/tasks/luc-1383-dashboard-overview-profile-basic-and-apikeys-proof-2026-07-17-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:faad7c11f1 | history/tasks/luc-1384-dashboard-overview-profile-security-and-reports-proof-2026-07-17-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:24688b5ea3 | history/tasks/luc-1387-restore-least-privilege-coolify-owner-path-for-one-redis-recovery-action-2026-07-17-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:c4da83ac67 | history/tasks/luc-1393-account-access-use-profile-apikeys-missing-doc-link-2026-07-17-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:550ced8bcb | history/tasks/luc-1396-account-access-use-profile-security-missing-doc-link-2026-07-17-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:a810c95320 | history/tasks/luc-1397-dashboard-overview-use-strategies-missing-test-link-2026-07-17-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:1863c60132 | history/tasks/luc-1397-operator-soar-owner-login-verification-path-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:3bb1e6b2b8 | history/tasks/luc-1398-operator-coolify-bind-read-only-production-status-access-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1399-reconcile-coolify-resource-inventory-task:b04fc726ea | history/tasks/luc-1399-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-140-closure-lane-provenance-packets-2026-05-26:23127d5941 | history/tasks/luc-140-closure-lane-provenance-packets-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1400-source-control-closure-2026-07-17-task:600d967e74 | history/tasks/luc-1400-source-control-closure-2026-07-17-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:684df5f9f5 | history/tasks/luc-1402-account-access-use-reports-missing-doc-link-2026-07-17-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:93af6ebff1 | history/tasks/luc-1402-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:51ca0306e4 | history/tasks/luc-1405-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1405-use-profile-security-stale-missing-doc-link-reconciliation:1c1f54e32a | history/tasks/luc-1405-use-profile-security-stale-missing-doc-link-reconciliation-2026-07-18-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:f4cd19b03e | history/tasks/luc-1408-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:186a65fbff | history/tasks/luc-1409-source-control-closure-2026-07-17-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:be941d1863 | history/tasks/luc-141-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:cb6ffc49df | history/tasks/luc-1410-dashboard-overview-use-profile-basic-missing-doc-link-2026-07-17-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:8e1b113859 | history/tasks/luc-1412-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:fa52f2085c | history/tasks/luc-1412-source-control-close-local-dirty-packet-from-luc-1410-2026-07-17-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:aa96e75baf | history/tasks/luc-1416-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:d928e8f0f6 | history/tasks/luc-1417-dashboard-overview-use-wallets-missing-test-link-2026-07-17-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:267a954e4c | history/tasks/luc-1418-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1419-restore-local-db-backed-api-e2e-runtime-for-close-authority-route-proof:8f1c70f6ef | history/tasks/luc-1419-restore-local-db-backed-api-e2e-runtime-for-close-authority-route-proof-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-142-history-evidence-closure-bundle-2026-05-26:5bdd3087aa | history/tasks/luc-142-history-evidence-closure-bundle-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:769dab506c | history/tasks/luc-1421-dashboard-overview-use-wallets-missing-test-link-2026-07-17-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:2d78afe08e | history/tasks/luc-1422-dashboard-backtests-detail-browser-review-2026-07-17-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:99136ee7d2 | history/tasks/luc-1422-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:b4e81e4375 | history/tasks/luc-1428-source-control-closure-classify-and-close-local-dirty-state-for-luc-1368-luc-1396-luc-1417-luc-1421-plus-1-2026-07-17-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:042cb7e10f | history/tasks/luc-1429-classify-history-evidence-artifact-dirty-scope-for-luc-1223-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:e9e4f6d81d | history/tasks/luc-143-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:9c3a8d821a | history/tasks/luc-1430-final-non-runtime-source-control-closure-for-luc-1223-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:1e9082df43 | history/tasks/luc-1431-account-access-use-wallets-missing-doc-link-2026-07-17-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:0f96481d95 | history/tasks/luc-1434-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1435-verify-coolify-redeploy-and-production-smoke:da1601b18a | history/tasks/luc-1435-verify-coolify-redeploy-production-smoke-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:22d8ca9fdc | history/tasks/luc-1436-dashboard-backtests-create-browser-review-2026-07-17-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:5315d64477 | history/tasks/luc-1437-dashboard-backtests-list-browser-review-2026-07-17-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:891999ba52 | history/tasks/luc-1437-refresh-approved-production-smoke-principal-for-workers-ready-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:2bbcd61dc7 | history/tasks/luc-1438-production-smoke-auth-binding-recheck-2026-06-06-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:8072c6eacc | history/tasks/luc-1438-refresh-production-smoke-auth-binding-for-workers-ready-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:6111e07af6 | history/tasks/luc-1441-source-control-closure-classify-and-close-local-dirty-state-for-luc-1431-luc-1436-luc-1437-2026-07-17-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:bcda0df91d | history/tasks/luc-1443-dashboard-overview-use-dashboard-missing-test-link-2026-07-17-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:eb04252abb | history/tasks/luc-1443-operator-coolify-bind-read-only-production-status-access-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:920c369a88 | history/tasks/luc-1444-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:231fb2cb4f | history/tasks/luc-1448-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:6ee14030e5 | history/tasks/luc-1448-workspace-shape-test-no-parent-2026-07-17-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:08b6c34291 | history/tasks/luc-1449-workspace-shape-test-2026-07-18-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-145-recent-closure-provenance-packets-2026-05-26:70468bc416 | history/tasks/luc-145-recent-closure-provenance-packets-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:af4767d070 | history/tasks/luc-1452-dashboard-bot-edit-page-browser-review-2026-07-20-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:39aeb53135 | history/tasks/luc-1454-source-control-closure-luc-1443-luc-1448-luc-1449-2026-07-18-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:47d7df165a | history/tasks/luc-1455-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1456-account-access-use-dashboard-missing-doc-link-closure:72e4786407 | history/tasks/luc-1456-account-access-use-dashboard-missing-doc-link-2026-07-18-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1458-source-control-closure-for-luc-1456:f3a91589c5 | history/tasks/luc-1458-source-control-closure-classify-and-close-local-dirty-state-for-luc-1456-2026-07-18-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:503596dac0 | history/tasks/luc-1459-operator-coolify-bind-read-only-production-status-access-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:d6284aadfe | history/tasks/luc-146-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:a525441544 | history/tasks/luc-1460-diagnose-production-ready-503-and-route-narrowest-recovery-lane-2026-07-18-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:281cc68017 | history/tasks/luc-1460-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1461-source-control-closure-for-luc-1460:d74273868f | history/tasks/luc-1461-source-control-closure-classify-and-close-local-dirty-state-for-luc-1460-2026-07-18-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:d0161ce1e4 | history/tasks/luc-1464-browser-proof-access-for-luc-1438-2026-07-18-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1465-source-control-closure-for-luc-1464:8e6b8a8390 | history/tasks/luc-1465-source-control-closure-classify-and-close-local-dirty-state-for-luc-1464-2026-07-18-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:b1ecd59d4c | history/tasks/luc-1466-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:a67c63c99b | history/tasks/luc-1467-operator-coolify-bind-read-only-production-status-access-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:e99850b247 | history/tasks/luc-1467-review-productivity-resume-delta-2026-07-20-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1467-review-productivity-resume-delta-2026-07-22-task:3e1bc15f6b | history/tasks/luc-1467-review-productivity-resume-delta-2026-07-22-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-147-history-plans-closure-bundle-2026-05-26:5609dd3b49 | history/tasks/luc-147-history-plans-closure-bundle-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:ffea6b32c9 | history/tasks/luc-1470-source-control-closure-classify-and-close-local-dirty-state-for-luc-1438-2026-07-18-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:57ee652c8a | history/tasks/luc-1472-operator-coolify-bind-read-only-production-status-access-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:45934a8259 | history/tasks/luc-1473-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:e470e38462 | history/tasks/luc-1476-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:1425d97e53 | history/tasks/luc-1479-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:66393155a1 | history/tasks/luc-148-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:3d127b8dec | history/tasks/luc-1482-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:7af50638fb | history/tasks/luc-1485-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:daebd1e9f3 | history/tasks/luc-1488-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:61cf3e407d | history/tasks/luc-1496-operator-coolify-bind-read-only-production-status-access-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:3be41676d7 | history/tasks/luc-1497-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-15c-cto-lane-child-issue:3a88094a29 | history/tasks/luc-15-cto-lane-child-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-15d-docs-lane-child-issue:d76bc7e2f3 | history/tasks/luc-15-docs-lane-child-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-15i-implementation-lane-child-issue:fd2cf05628 | history/tasks/luc-15-implementation-lane-child-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-15-live-project-status-and-decision-dashboard:b7637847fc | history/tasks/luc-15-live-project-status-and-decision-dashboard-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-15o-ops-lane-child-issue:4453679051 | history/tasks/luc-15-ops-lane-child-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-15p-product-lane-child-issue:3c56fc2d12 | history/tasks/luc-15-product-lane-child-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-15q-qa-lane-child-issue:b3d4fa0376 | history/tasks/luc-15-qa-lane-child-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-15x-ux-lane-child-issue:41deb76613 | history/tasks/luc-15-ux-lane-child-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:2c3469fc69 | history/tasks/luc-1501-source-control-closure-classify-and-close-local-dirty-state-for-luc-1467-2026-07-18-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:a3357d87a8 | history/tasks/luc-1502-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:8b61f70dcb | history/tasks/luc-1505-source-control-closure-classify-and-close-local-dirty-state-for-luc-1467-2026-07-19-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:41eead7600 | history/tasks/luc-1507-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:f08f3caffb | history/tasks/luc-1508-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:9726936615 | history/tasks/luc-1508-source-control-closure-classify-and-close-local-dirty-state-for-luc-1467-2026-07-20-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:cdf4c9dc48 | history/tasks/luc-151-v1-audit-to-completion-controller-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:0d9cd951e6 | history/tasks/luc-1514-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:9103a35dea | history/tasks/luc-1515-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:35d844b6c5 | history/tasks/luc-1517-dashboard-overview-page-browser-review-2026-07-20-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:90703ae844 | history/tasks/luc-1518-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:f24b15cb22 | history/tasks/luc-1519-dashboard-root-browser-proof-auth-bootstrap-2026-07-20-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:3241e83179 | history/tasks/luc-1519-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-152-latest-closure-provenance-packets-2026-05-26:7c9819a920 | history/tasks/luc-152-latest-closure-provenance-packets-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:46c8f4e203 | history/tasks/luc-1522-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:7125992416 | history/tasks/luc-1523-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:36a2ef19ef | history/tasks/luc-1525-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:b5e55facbc | history/tasks/luc-1526-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:57798d346f | history/tasks/luc-1528-dashboard-overview-page-browser-review-2026-07-20-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:53e2e1e5d4 | history/tasks/luc-1529-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-153-coolify-production-deploy-health-sweep-2026-05-26:0587bfeebd | history/tasks/luc-153-coolify-production-deploy-health-sweep-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:e61c877831 | history/tasks/luc-1530-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:21ae8eb2ae | history/tasks/luc-1531-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1531-source-control-closure-for-luc-1359-luc-1460-luc-1528:2dbd4a7313 | history/tasks/luc-1531-source-control-closure-classify-and-close-local-dirty-state-for-luc-1359-luc-1460-luc-1528-2026-07-20-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:736c8cfa46 | history/tasks/luc-1532-operator-coolify-bind-read-only-production-status-access-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:4ffcc60f5a | history/tasks/luc-1533-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:48b861daa0 | history/tasks/luc-1534-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:3ec8e94955 | history/tasks/luc-1537-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:ca46499c65 | history/tasks/luc-1538-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:91ec0c82af | history/tasks/luc-1539-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:b8eedc1773 | history/tasks/luc-1541-apply-coolify-selector-confirmation-closure-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:f4723f9941 | history/tasks/luc-1542-apply-completed-coolify-selector-disposition-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:ef815f7dd2 | history/tasks/luc-1543-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:289abef4a1 | history/tasks/luc-1548-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:c79b4d227f | history/tasks/luc-1549-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:1e7a4687ee | history/tasks/luc-1552-operator-coolify-bind-read-only-production-status-access-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:6fe9e24bd5 | history/tasks/luc-1553-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:82861a2eb1 | history/tasks/luc-1554-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:d82d0b494e | history/tasks/luc-1556-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:03e2f9dacd | history/tasks/luc-1559-apply-luc-1553-selector-confirmation-closure-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:fbbd4386a0 | history/tasks/luc-156-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:209f7f776d | history/tasks/luc-1560-confirm-coolify-team-workspace-binding-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:4a321b825c | history/tasks/luc-1564-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1565-reconcile-coolify-resource-inventory-2026-06-02:5a5d64106d | history/tasks/luc-1565-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:8ee89e6126 | history/tasks/luc-1568-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1569-reconcile-coolify-resource-inventory-2026-06-02:d39c0fbf30 | history/tasks/luc-1569-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:79830187e4 | history/tasks/luc-1571-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1574-confirm-coolify-team-workspace-task:00c6f258d5 | history/tasks/luc-1574-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1575-reconcile-coolify-resource-inventory-2026-06-02:a7393b9357 | history/tasks/luc-1575-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:404db69195 | history/tasks/luc-1579-operator-coolify-bind-read-only-production-status-access-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-158-luc-153-coolify-health-evidence-closure-2026-05-26:b541acd428 | history/tasks/luc-158-luc-153-coolify-health-evidence-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1580-confirm-coolify-team-workspace-task:910c57a802 | history/tasks/luc-1580-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1581-reconcile-coolify-resource-inventory-2026-06-02:a6a52516a7 | history/tasks/luc-1581-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:4f0de99252 | history/tasks/luc-1583-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1584-reconcile-coolify-resource-inventory-2026-06-02:5ba9a079ed | history/tasks/luc-1584-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1585-confirm-coolify-team-workspace-task:eff88cdf35 | history/tasks/luc-1585-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:2dd0630968 | history/tasks/luc-1586-operator-coolify-bind-read-only-production-status-access-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task-contract-luc-1587-confirm-coolify-team-workspace:e505f5fe25 | history/tasks/luc-1587-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:b7ee97d3c8 | history/tasks/luc-159-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:94f88e1adc | history/tasks/luc-1591-operator-coolify-bind-read-only-production-status-access-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1592-confirm-coolify-team-workspace-task:5fa6b69914 | history/tasks/luc-1592-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1593-reconcile-coolify-resource-inventory-2026-06-02:ca1be4dc3f | history/tasks/luc-1593-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task-contract-luc-1594-confirm-coolify-team-workspace:22147dedaf | history/tasks/luc-1594-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1595-source-control-closure-for-luc-1591:a87e096978 | history/tasks/luc-1595-source-control-closure-classify-and-close-local-dirty-state-for-luc-1591-2026-07-21-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:d3872e47bd | history/tasks/luc-1597-operator-coolify-bind-read-only-production-status-access-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:dd29233743 | history/tasks/luc-1598-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1599-reconcile-coolify-resource-inventory-2026-06-02:7b93f98645 | history/tasks/luc-1599-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:f176be9d73 | history/tasks/luc-16-readiness-map-task-2026-05-25.md |
| connected_to | project:soar:7c70e892d7 | task:luc-160-luc-158-provenance-packet-closure-2026-05-26:e58e5a521a | history/tasks/luc-160-luc-158-provenance-packet-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:c56ee9a66a | history/tasks/luc-1601-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:f98e96a342 | history/tasks/luc-1604-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1605-reconcile-coolify-resource-inventory-2026-06-02:1cce5a41ce | history/tasks/luc-1605-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:5777c6c155 | history/tasks/luc-1609-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1610-reconcile-coolify-resource-inventory-2026-06-02:5b6af7a7aa | history/tasks/luc-1610-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:7825a93832 | history/tasks/luc-1611-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1612-source-control-closure-for-luc-1603:5d67d3e572 | history/tasks/luc-1612-source-control-closure-classify-and-close-local-dirty-state-for-luc-1603-2026-07-21-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:79d9b110d0 | history/tasks/luc-1613-dashboard-overview-page-browser-review-2026-07-21-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:c324ca266a | history/tasks/luc-1614-confirm-coolify-team-workspace-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:a8e22a78e1 | history/tasks/luc-1615-reconcile-coolify-resource-inventory-2026-06-02-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:1d52cd86ea | history/tasks/luc-1619-confirm-coolify-team-workspace-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:b25a1553a1 | history/tasks/luc-162-normalize-blocked-lanes-first-class-blockers-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1620-reconcile-coolify-resource-inventory-2026-06-03:8dfd70fa60 | history/tasks/luc-1620-reconcile-coolify-resource-inventory-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:d7a86331eb | history/tasks/luc-1623-confirm-coolify-team-workspace-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1624-reconcile-coolify-resource-inventory-2026-06-03:5b46c36a08 | history/tasks/luc-1624-reconcile-coolify-resource-inventory-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:7ce3029da3 | history/tasks/luc-1626-confirm-coolify-team-workspace-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1627-source-control-closure-for-luc-1467-luc-1613:90067237d9 | history/tasks/luc-1627-source-control-closure-classify-and-close-local-dirty-state-for-luc-1467-luc-1613-2026-07-22-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:bd264b0ac7 | history/tasks/luc-1628-dashboard-bot-assistant-page-browser-review-2026-07-22-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:29d8749044 | history/tasks/luc-1629-confirm-coolify-team-workspace-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:3d63834456 | history/tasks/luc-1630-reconcile-coolify-resource-inventory-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:968d4a7300 | history/tasks/luc-1633-confirm-coolify-team-workspace-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:7338928738 | history/tasks/luc-1634-dashboard-overview-page-browser-review-2026-07-22-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:449c9ba447 | history/tasks/luc-1634-reconcile-coolify-resource-inventory-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:6926d9e66b | history/tasks/luc-1636-confirm-coolify-team-workspace-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:517dc4adb9 | history/tasks/luc-1636-dashboard-overview-page-browser-review-2026-07-22-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:71194e4d83 | history/tasks/luc-1639-dashboard-overview-page-browser-review-2026-07-22-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:2b9f71a04d | history/tasks/luc-1639-operator-coolify-bind-read-only-production-status-access-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-164-luc-160-provenance-packet-closure-2026-05-26:18b71b16b5 | history/tasks/luc-164-luc-160-provenance-packet-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:c11073b32f | history/tasks/luc-1640-confirm-coolify-team-workspace-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:5458e0e55a | history/tasks/luc-1641-reconcile-coolify-resource-inventory-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1641-source-control-closure-for-luc-1639:df6cff3096 | history/tasks/luc-1641-source-control-closure-classify-and-close-local-dirty-state-for-luc-1639-2026-07-22-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:c533699d88 | history/tasks/luc-1643-dashboard-overview-page-browser-review-2026-07-22-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:b7ee3a3112 | history/tasks/luc-1644-confirm-coolify-team-workspace-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:2f50e69bae | history/tasks/luc-1645-reconcile-coolify-resource-inventory-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:20a8e26207 | history/tasks/luc-1647-confirm-coolify-team-workspace-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:bce8d65fb5 | history/tasks/luc-1649-source-control-closure-classify-and-close-local-dirty-state-for-luc-1643-2026-07-22-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:45660a4c86 | history/tasks/luc-165-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:a1b511dd0e | history/tasks/luc-1650-confirm-coolify-team-workspace-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:084f907397 | history/tasks/luc-1650-dashboard-overview-page-browser-review-2026-07-22-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:68370257b7 | history/tasks/luc-1651-reconcile-coolify-resource-inventory-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:d04321d0da | history/tasks/luc-1654-operator-coolify-bind-read-only-production-status-access-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:e2b66b4c15 | history/tasks/luc-1654-refresh-project-truth-after-bot-edit-proof-2026-07-22-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:ed347c9d3c | history/tasks/luc-1655-confirm-coolify-team-workspace-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:26b5901ad5 | history/tasks/luc-1656-reconcile-coolify-resource-inventory-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:ed449d5fcb | history/tasks/luc-1657-complete-exact-bot-preview-proof-refresh-after-cancelled-follow-up-2026-07-22-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:aebba6439c | history/tasks/luc-1658-confirm-coolify-team-workspace-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:d83ad314e6 | history/tasks/luc-1659-dashboard-bot-detail-alias-page-browser-review-2026-07-22-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-166-luc-164-provenance-packet-closure-2026-05-26:d2cc5d83e8 | history/tasks/luc-166-luc-164-provenance-packet-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:fef6e27edc | history/tasks/luc-1661-confirm-coolify-team-workspace-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:e09aead23f | history/tasks/luc-1662-ingest-exact-dynamic-bot-runtime-redirect-proof-2026-07-22-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:f9cd304acc | history/tasks/luc-1662-reconcile-coolify-resource-inventory-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1663-source-control-closure:68d4eb1377 | history/tasks/luc-1663-source-control-close-dynamic-bot-runtime-proof-refresh-2026-07-22-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:1ca23d0ba1 | history/tasks/luc-1665-confirm-coolify-team-workspace-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:b6a578f4cc | history/tasks/luc-1666-reconcile-coolify-resource-inventory-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:503770f579 | history/tasks/luc-1667-ingest-exact-global-bot-assistant-alias-proof-2026-07-22-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:afacc52ac9 | history/tasks/luc-1668-confirm-coolify-team-workspace-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:e39e1e4f5d | history/tasks/luc-167-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1672-confirm-coolify-team-workspace:260ac4fbc0 | history/tasks/luc-1672-confirm-coolify-team-workspace-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:f68a4e303a | history/tasks/luc-1673-reconcile-coolify-resource-inventory-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:3f5e9dfb13 | history/tasks/luc-1677-operator-coolify-bind-read-only-production-status-access-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:8c9f363fb5 | history/tasks/luc-1678-confirm-coolify-team-workspace-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:130c56380c | history/tasks/luc-1679-confirm-coolify-team-workspace-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-169-luc-166-provenance-packet-closure-2026-05-26:70d252d3ed | history/tasks/luc-169-luc-166-provenance-packet-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:ac5139a5fd | history/tasks/luc-1696-reconcile-coolify-resource-inventory-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:6c67a169ca | history/tasks/luc-17-architecture-function-chain-known-state-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-170-account-access-first-doc-rows:f81caa350f | history/tasks/luc-170-account-access-first-doc-rows-2026-07-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:84ec70ddd2 | history/tasks/luc-170-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:094ec30f31 | history/tasks/luc-1700-operator-coolify-bind-read-only-production-status-access-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:13ca9ff661 | history/tasks/luc-1707-operator-coolify-bind-read-only-production-status-access-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:00e81e72a3 | history/tasks/luc-1709-restore-soar-guardrails-source-control-closure-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:c8c5813277 | history/tasks/luc-171-db-backed-auth-worker-runtime-freshness-2026-07-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-171-luc-169-provenance-packet-closure-2026-05-26:93b4d576c3 | history/tasks/luc-171-luc-169-provenance-packet-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-172-protected-authenticated-browser-proof-packet:c23c159399 | history/tasks/luc-172-protected-authenticated-browser-proof-packet-2026-07-10-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1734-restore-owner-path-for-coolify-inventory-lane:effa2c2808 | history/tasks/luc-1734-restore-owner-path-for-coolify-inventory-lane-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1739-coolify-read-only-access-source-control-closure:00bda71cb9 | history/tasks/luc-1739-coolify-read-only-access-source-control-closure-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:605229b8f6 | history/tasks/luc-174-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-174-protected-trading-readback-vs-live-mutation-approval-packet:9ef895074b | history/tasks/luc-174-protected-trading-readback-live-mutation-approval-packet-2026-07-10-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:8f529d5458 | history/tasks/luc-175-requireauth-test-typing-api-build-blocker-2026-07-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:04c35723a3 | history/tasks/luc-175-source-control-queue-executor-gate-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:cc5a9ea204 | history/tasks/luc-1754-liveimport-readback-protected-evidence-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1755-rollback-guard-protected-evidence:c8c0bba716 | history/tasks/luc-1755-rollback-guard-protected-evidence-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:8d5093bd8d | history/tasks/luc-1756-soar-prod-protected-app-evidence-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:c6e13a084a | history/tasks/luc-1757-prod-db-check-protected-evidence-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-176-account-access-clearsession-project-truth-proof:402d42c4ac | history/tasks/luc-176-account-access-clearsession-project-truth-proof-2026-07-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:3b13a4ab73 | history/tasks/luc-1761-bind-approved-soar-prod-protected-app-smoke-session-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1763-bind-rollback-guard-protected-inputs:036d0b8ef4 | history/tasks/luc-1763-bind-rollback-guard-protected-inputs-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:35f906426a | history/tasks/luc-1764-inject-protected-prod-db-check-runner-inputs-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:8797aafebd | history/tasks/luc-1765-bind-liveimport-readback-read-only-production-principal-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1767-bind-rollback-guard-protected-runner-inputs:d7b4d105ae | history/tasks/luc-1767-bind-rollback-guard-protected-runner-inputs-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1769-approve-source-read-only-app-smoke-auth-class:da836da80f | history/tasks/luc-1769-approve-source-read-only-app-smoke-auth-class-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:cdab6dac26 | history/tasks/luc-1774-provide-valid-prod-ui-audit-session-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:122a745ad8 | history/tasks/luc-1775-bind-fresh-valid-prod-ui-audit-app-session-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:ad853d87c9 | history/tasks/luc-1786-operator-coolify-bind-read-only-production-status-access-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:375418c0c6 | history/tasks/luc-1787-coolify-resource-inventory-reconciliation-2026-06-05-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:e0402daef1 | history/tasks/luc-179-coolify-worker-recovery-or-no-temp-stack-decision-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:e43ee8060a | history/tasks/luc-1790-operator-coolify-bind-read-only-production-status-access-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-18-qa-regression-and-smoke-evidence-baseline-2026-05-25:cfe6a58488 | history/tasks/luc-18-qa-regression-smoke-baseline-2026-05-25.md |
| connected_to | project:soar:7c70e892d7 | task:task:7f163b5913 | history/tasks/luc-1800-operator-coolify-bind-read-only-production-status-access-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:190d6d4200 | history/tasks/luc-181-workers-market-stream-operator-log-root-cause-packet-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1822-operator-coolify-read-only-production-status-access:d121137c2c | history/tasks/luc-1822-operator-coolify-bind-read-only-production-status-access-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1828-operator-coolify-read-only-production-status-access:f559d9c78f | history/tasks/luc-1828-operator-coolify-bind-read-only-production-status-access-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1831-operator-coolify-read-only-production-status-access:7823dcf416 | history/tasks/luc-1831-operator-coolify-bind-read-only-production-status-access-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1838-source-control-dirty-worktree-classification-and-closure:29b99b8cdf | history/tasks/luc-1838-source-control-classify-and-close-local-dirty-worktree-groups-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1843-operator-coolify-read-only-production-status-access:13c7e05be7 | history/tasks/luc-1843-operator-coolify-bind-read-only-production-status-access-2026-06-03-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1850-operator-coolify-bind-read-only-production-status-access:3546336585 | history/tasks/luc-1850-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1857-operator-coolify-bind-read-only-production-status-access:c751aadb7d | history/tasks/luc-1857-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:8e2cb31f47 | history/tasks/luc-1872-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:c4b170ff7e | history/tasks/luc-1875-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:50d1d12bc1 | history/tasks/luc-1878-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:dbfdab0950 | history/tasks/luc-1885-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:11717cba28 | history/tasks/luc-1889-source-control-close-local-dirty-state-for-luc-1885-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:af45db7cad | history/tasks/luc-1890-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:c9658b1429 | history/tasks/luc-1893-source-control-close-local-dirty-state-for-luc-1890-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:d29e2236f0 | history/tasks/luc-1898-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:a9bad43cd5 | history/tasks/luc-19-board-hygiene-status-alignment-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:2184156d3a | history/tasks/luc-19-protected-input-readiness-refresh-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:58c0734724 | history/tasks/luc-19-runtime-known-state-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:6626e4470e | history/tasks/luc-19-runtime-readiness-refresh-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:1760066aa9 | history/tasks/luc-19-worker-proof-auth-gate-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:75e53d6237 | history/tasks/luc-1900-source-control-close-local-dirty-state-for-luc-1898-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:04cc7dd6ea | history/tasks/luc-1901-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:a56a6118eb | history/tasks/luc-191-daily-project-status-refresh-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:ba9326b199 | history/tasks/luc-1910-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:ab6b34595a | history/tasks/luc-1916-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:705c740989 | history/tasks/luc-1919-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-192-no-stall-queue-expeditor-2026-05-26:65b826544b | history/tasks/luc-192-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1925-source-control-closure-task:9373aeee9f | history/tasks/luc-1925-source-control-close-local-dirty-state-for-luc-1910-luc-1916-luc-1919-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:825e28d92f | history/tasks/luc-1926-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:653a04e4ba | history/tasks/luc-193-autonomous-idle-and-map-drift-sweep-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1933-task-contract-coolify-read-only-production-status-access:cc5307829f | history/tasks/luc-1933-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:7ea4df21f0 | history/tasks/luc-1939-residual-page-chain-semantics-medium-graph-gaps-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:ec44f559ff | history/tasks/luc-194-regression-evidence-sweep-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task-contract-luc-194-source-scoped-recovery-disposition-reconciliation-2026-05-26:b33cac38f7 | history/tasks/luc-194-source-scoped-recovery-disposition-reconciliation-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1940-api-data-n-a-semantics-for-medium-graph-gaps:f953896f9d | history/tasks/luc-1940-api-data-na-semantics-medium-graph-gaps-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1941-medium-graph-cleanup-queue-closure:e38e720057 | history/tasks/luc-1941-medium-graph-cleanup-queue-closure-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1944-assistant-dry-run-boundary-and-schema-drift:b69017d9f7 | history/tasks/luc-1944-assistant-dry-run-boundary-schema-drift-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1945-adversarial-api-platform-and-assistant-regression-proof:e4dbd1adbd | history/tasks/luc-1945-adversarial-api-assistant-regression-proof-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1946-route-rate-limit-redis-client-errors-through-redacted-logger:572775ba1e | history/tasks/luc-1946-route-rate-limit-redis-client-errors-through-redacted-logger-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:19449b729b | history/tasks/luc-1948-map-bots-types-test-into-architecture-graph-registry-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:733c3c18dc | history/tasks/luc-195-gap-register-and-repair-lane-refresh-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1951-task-contract-coolify-read-only-production-status-access:a559f50f50 | history/tasks/luc-1951-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1952-source-control-closure-for-luc-1933-luc-1939-luc-1940-luc-1941-plus-five:d481c8772b | history/tasks/luc-1952-source-control-close-local-dirty-state-for-luc-1933-luc-1939-luc-1940-luc-1941-plus-5-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1953-task-contract-coolify-read-only-production-status-access:f2522ded82 | history/tasks/luc-1953-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:task-contract-luc-196-security-account-access-gate-canonical-contract-follow-up-2026-05-26:9b54d0625b | history/tasks/luc-196-security-account-access-gate-canonical-contract-followup-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task-contract-luc-196-security-and-account-access-gate-sweep-2026-05-26:db60422f6b | history/tasks/luc-196-security-account-access-gate-sweep-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task-contract-luc-196-source-scoped-recovery-disposition-reconciliation-2026-05-26:7032fd05e2 | history/tasks/luc-196-source-scoped-recovery-disposition-reconciliation-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1968-source-control-closure-for-luc-241:2eb2fb2cc1 | history/tasks/luc-1968-source-control-close-local-dirty-state-for-luc-241-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1969-task-contract-coolify-read-only-production-status-access:2626dedc09 | history/tasks/luc-1969-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-1973-task-contract-coolify-read-only-production-status-access:9d750950ff | history/tasks/luc-1973-operator-coolify-bind-read-only-production-status-access-2026-06-04-task.md |