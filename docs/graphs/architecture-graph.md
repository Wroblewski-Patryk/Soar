# Architecture Graph

Generated: 2026-05-27T02:15:57.657Z

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
| agent | implemented | Active Mission Packet | .agents/state/active-mission.md | Engineering Delivery Lead |
| agent | implemented | Agent Process Evals | .agents/state/agent-evals.md | Engineering Delivery Lead |
| agent | implemented | Current Focus | .agents/state/current-focus.md | Engineering Delivery Lead |
| agent | implemented | Decision Register | .agents/state/decision-register.md | Engineering Delivery Lead |
| agent | implemented | Delivery Map | .agents/state/delivery-map.md | Engineering Delivery Lead |
| agent | implemented | Known Issues | .agents/state/known-issues.md | Engineering Delivery Lead |
| agent | implemented | Module Confidence Ledger | .agents/state/module-confidence-ledger.md | Engineering Delivery Lead |
| agent | implemented | Next Steps | .agents/state/next-steps.md | Engineering Delivery Lead |
| agent | implemented | Quality Attribute Scenarios | .agents/state/quality-attribute-scenarios.md | Engineering Delivery Lead |
| agent | implemented | Regression Log | .agents/state/regression-log.md | Engineering Delivery Lead |
| agent | implemented | Requirements Verification Matrix | .agents/state/requirements-verification-matrix.md | Engineering Delivery Lead |
| agent | implemented | Responsibility Learning | .agents/state/responsibility-learning.md | Engineering Delivery Lead |
| agent | implemented | Risk Register | .agents/state/risk-register.md | Engineering Delivery Lead |
| agent | implemented | System Health | .agents/state/system-health.md | Engineering Delivery Lead |
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
| api_endpoint | implemented | POST /login | apps/api/src/modules/auth/auth.routes.ts#/login | Engineering Delivery Lead |
| api_endpoint | implemented | POST /logout | apps/api/src/modules/auth/auth.routes.ts#/logout | Engineering Delivery Lead |
| api_endpoint | implemented | GET /me | apps/api/src/modules/auth/auth.routes.ts#/me | Engineering Delivery Lead |
| api_endpoint | implemented | POST /register | apps/api/src/modules/auth/auth.routes.ts#/register | Engineering Delivery Lead |
| api_endpoint | implemented | GET / | apps/api/src/router/admin.routes.ts#/ | Engineering Delivery Lead |
| api_endpoint | implemented | USE /subscriptions/plans | apps/api/src/router/admin.routes.ts#/subscriptions/plans | Engineering Delivery Lead |
| api_endpoint | implemented | USE /users | apps/api/src/router/admin.routes.ts#/users | Engineering Delivery Lead |
| api_endpoint | implemented | GET / | apps/api/src/router/dashboard.routes.ts#/ | Engineering Delivery Lead |
| api_endpoint | implemented | USE /backtests | apps/api/src/router/dashboard.routes.ts#/backtests | Engineering Delivery Lead |
| api_endpoint | implemented | USE /bots | apps/api/src/router/dashboard.routes.ts#/bots | Engineering Delivery Lead |
| api_endpoint | implemented | USE /icons | apps/api/src/router/dashboard.routes.ts#/icons | Engineering Delivery Lead |
| api_endpoint | implemented | USE /logs | apps/api/src/router/dashboard.routes.ts#/logs | Engineering Delivery Lead |
| api_endpoint | implemented | USE /market-stream | apps/api/src/router/dashboard.routes.ts#/market-stream | Engineering Delivery Lead |
| api_endpoint | implemented | USE /markets | apps/api/src/router/dashboard.routes.ts#/markets | Engineering Delivery Lead |
| api_endpoint | implemented | USE /orders | apps/api/src/router/dashboard.routes.ts#/orders | Engineering Delivery Lead |
| api_endpoint | implemented | USE /positions | apps/api/src/router/dashboard.routes.ts#/positions | Engineering Delivery Lead |
| api_endpoint | implemented | USE /profile/apiKeys | apps/api/src/router/dashboard.routes.ts#/profile/apiKeys | Engineering Delivery Lead |
| api_endpoint | implemented | USE /profile/basic | apps/api/src/router/dashboard.routes.ts#/profile/basic | Engineering Delivery Lead |
| api_endpoint | implemented | USE /profile/security | apps/api/src/router/dashboard.routes.ts#/profile/security | Engineering Delivery Lead |
| api_endpoint | implemented | USE /profile/subscription | apps/api/src/router/dashboard.routes.ts#/profile/subscription | Engineering Delivery Lead |
| api_endpoint | implemented | USE /reports | apps/api/src/router/dashboard.routes.ts#/reports | Engineering Delivery Lead |
| api_endpoint | implemented | USE /strategies | apps/api/src/router/dashboard.routes.ts#/strategies | Engineering Delivery Lead |
| api_endpoint | implemented | USE /wallets | apps/api/src/router/dashboard.routes.ts#/wallets | Engineering Delivery Lead |
| api_endpoint | implemented | GET / | apps/api/src/router/index.ts#/ | Engineering Delivery Lead |
| api_endpoint | implemented | USE /admin | apps/api/src/router/index.ts#/admin | Engineering Delivery Lead |
| api_endpoint | implemented | GET /alerts | apps/api/src/router/index.ts#/alerts | Engineering Delivery Lead |
| api_endpoint | implemented | USE /auth | apps/api/src/router/index.ts#/auth | Engineering Delivery Lead |
| api_endpoint | implemented | USE /dashboard | apps/api/src/router/index.ts#/dashboard | Engineering Delivery Lead |
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
| document | implemented | AGENTS.md - CryptoSparrow / Soar | AGENTS.md | Engineering Delivery Lead |
| document | implemented | AI Testing Protocol | AI_TESTING_PROTOCOL.md | Engineering Delivery Lead |
| document | implemented | CryptoSparrow Mobile (Bootstrap) | apps/mobile/README.md | Engineering Delivery Lead |
| document | implemented | or | apps/web/README.md | Engineering Delivery Lead |
| document | implemented | Changelog | CHANGELOG.md | Engineering Delivery Lead |
| document | implemented | Definition Of Done | DEFINITION_OF_DONE.md | Engineering Delivery Lead |
| document | implemented | Deployment Gate | DEPLOYMENT_GATE.md | Engineering Delivery Lead |
| document | implemented | ADR 0001: Agent Governance Baseline | docs/adr/0001-agent-governance-baseline.md | Docs Memory Lead |
| document | deprecated | ADR Index | docs/adr/architecture-decision-records.md | Docs Memory Lead |
| document | implemented | Analysis Documentation | docs/analysis/analysis-documentation.md | Docs Memory Lead |
| document | implemented | Documentation Drift Report | docs/analysis/documentation-drift.md | Docs Memory Lead |
| document | implemented | Documentation Inventory | docs/analysis/documentation-inventory.md | Docs Memory Lead |
| document | implemented | LUC-113 Docs Analysis Provenance Closure | docs/analysis/luc-113-docs-analysis-provenance-closure-2026-05-26.md | Docs Memory Lead |
| document | implemented | LUC-197 Docs And Memory Loop Checkpoint | docs/analysis/luc-197-docs-memory-loop-2026-05-26.md | Docs Memory Lead |
| document | implemented | LUC-20 Docs/index/template feedback audit | docs/analysis/luc-20-docs-index-template-feedback-audit-2026-05-25.md | Docs Memory Lead |
| document | implemented | LUC-48 Autonomous map inventory and UI polish readiness gate | docs/analysis/luc-48-autonomous-map-inventory-and-ui-polish-readiness-gate-2026-05-25.md | Docs Memory Lead |
| document | implemented | LUC-49 UI state browser proof matrix | docs/analysis/luc-49-ui-state-browser-proof-matrix-2026-05-25.md | Docs Memory Lead |
| document | implemented | LUC-81 Docs And Memory Loop Audit | docs/analysis/luc-81-docs-memory-loop-2026-05-26.md | Docs Memory Lead |
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
| document | implemented | Codebase map | docs/architecture/nodes/SOAR-DOC-CODEBASE-MAP.md | Docs Memory Lead |
| document | implemented | Coolify VPS setup guide | docs/architecture/nodes/SOAR-DOC-COOLIFY-VPS.md | Docs Memory Lead |
| document | implemented | Dashboard route map | docs/architecture/nodes/SOAR-DOC-DASHBOARD-ROUTE-MAP.md | Docs Memory Lead |
| document | implemented | Data model source | docs/architecture/nodes/SOAR-DOC-DATA-MODEL.md | Docs Memory Lead |
| document | implemented | Exchange access ownership matrix | docs/architecture/nodes/SOAR-DOC-EXCHANGE-OWNERSHIP.md | Docs Memory Lead |
| document | implemented | Execution lifecycle architecture doc | docs/architecture/nodes/SOAR-DOC-EXECUTION-LIFECYCLE.md | Docs Memory Lead |
| document | implemented | LIVE position restart continuity contract | docs/architecture/nodes/SOAR-DOC-LIVE-POSITION-RESTART.md | Docs Memory Lead |
| document | implemented | Local development documentation | docs/architecture/nodes/SOAR-DOC-LOCAL-DEVELOPMENT.md | Docs Memory Lead |
| document | implemented | Module governance documentation index | docs/architecture/nodes/SOAR-DOC-MODULE-GOVERNANCE-INDEX.md | Docs Memory Lead |
| document | implemented | Position PnL lifecycle contract | docs/architecture/nodes/SOAR-DOC-POSITION-PNL-LIFECYCLE.md | Docs Memory Lead |
| document | implemented | Engineering testing documentation | docs/architecture/nodes/SOAR-DOC-TESTING.md | Docs Memory Lead |
| document | implemented | Traceability matrix | docs/architecture/nodes/SOAR-DOC-TRACEABILITY.md | Docs Memory Lead |
| document | implemented | Venue context source of truth contract | docs/architecture/nodes/SOAR-DOC-VENUE-CONTEXT.md | Docs Memory Lead |
| document | implemented | Web admin module documentation | docs/architecture/nodes/SOAR-DOC-WEB-ADMIN.md | Docs Memory Lead |
| document | implemented | Web auth module doc | docs/architecture/nodes/SOAR-DOC-WEB-AUTH.md | Docs Memory Lead |
| document | implemented | Web backtests module documentation | docs/architecture/nodes/SOAR-DOC-WEB-BACKTESTS.md | Docs Memory Lead |

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
| connected_to | project:soar:7c70e892d7 | task:task:8bec924620 | history/tasks/luc-102-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-103-source-control-closure-2026-05-26-task:5797dc0746 | history/tasks/luc-103-source-control-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-105-runtime-signal-loop-test-closure-repair-2026-05-26:aa7633a58c | history/tasks/luc-105-runtime-signal-loop-test-closure-repair-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-107-coolify-production-deploy-health-sweep-2026-05-26:24df882fdd | history/tasks/luc-107-coolify-production-deploy-health-sweep-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:7e2c20d0f1 | history/tasks/luc-108-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:56efb0ec2d | history/tasks/luc-110-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:7c0726358c | history/tasks/luc-112-architecture-awareness-docs-graph-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:9828579e87 | history/tasks/luc-113-docs-analysis-provenance-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:8a04f54a98 | history/tasks/luc-114-qa-repeatable-smoke-evidence-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-115-luc-86-ops-evidence-closure-2026-05-26:c22069664f | history/tasks/luc-115-luc-86-ops-evidence-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:77461ff0cc | history/tasks/luc-116-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:e8b013b371 | history/tasks/luc-117-release-smoke-blocker-evidence-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-118-luc-107-coolify-health-evidence-closure-2026-05-26:1106793307 | history/tasks/luc-118-luc-107-coolify-health-evidence-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-119-luc-98-release-permit-evidence-closure-2026-05-26:114a7e96b8 | history/tasks/luc-119-luc-98-release-permit-evidence-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:f3d3cefc79 | history/tasks/luc-121-frontend-map-inventory-evidence-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:0f962bdf9e | history/tasks/luc-122-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:c0843e4c26 | history/tasks/luc-125-luc-49-ui-state-browser-proof-matrix-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:350c8fcb6e | history/tasks/luc-126-v1-audit-to-completion-controller-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:ddc542514e | history/tasks/luc-127-luc-64-backend-runtime-signal-docs-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:9595e7bb22 | history/tasks/luc-128-luc-45-v1-controller-docs-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:c5ee399a01 | history/tasks/luc-129-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-130-luc-88-productivity-review-evidence-closure-2026-05-26:4c8237b1c5 | history/tasks/luc-130-luc-88-productivity-review-evidence-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-131-luc-86-latest-health-sweep-task-closure-2026-05-26:2ecee2d981 | history/tasks/luc-131-luc-86-latest-health-sweep-task-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-132-luc-19-runtime-readiness-task-closure-2026-05-26:fb150b0445 | history/tasks/luc-132-luc-19-runtime-readiness-task-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:f6ff5f055f | history/tasks/luc-133-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-135-source-control-closure-artifacts-lane-2026-05-26:0f14e401a7 | history/tasks/luc-135-source-control-closure-artifacts-lane-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:99b465c313 | history/tasks/luc-136-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-137-docs-operations-closure-bundle-2026-05-26:d3cd9bdf63 | history/tasks/luc-137-docs-operations-closure-bundle-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:f795e4ad8c | history/tasks/luc-138-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-140-closure-lane-provenance-packets-2026-05-26:23127d5941 | history/tasks/luc-140-closure-lane-provenance-packets-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:be941d1863 | history/tasks/luc-141-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-142-history-evidence-closure-bundle-2026-05-26:5bdd3087aa | history/tasks/luc-142-history-evidence-closure-bundle-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:e9e4f6d81d | history/tasks/luc-143-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-145-recent-closure-provenance-packets-2026-05-26:70468bc416 | history/tasks/luc-145-recent-closure-provenance-packets-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:d6284aadfe | history/tasks/luc-146-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-147-history-plans-closure-bundle-2026-05-26:5609dd3b49 | history/tasks/luc-147-history-plans-closure-bundle-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:66393155a1 | history/tasks/luc-148-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-15c-cto-lane-child-issue:3a88094a29 | history/tasks/luc-15-cto-lane-child-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-15d-docs-lane-child-issue:d76bc7e2f3 | history/tasks/luc-15-docs-lane-child-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-15i-implementation-lane-child-issue:fd2cf05628 | history/tasks/luc-15-implementation-lane-child-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-15-live-project-status-and-decision-dashboard:b7637847fc | history/tasks/luc-15-live-project-status-and-decision-dashboard-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-15o-ops-lane-child-issue:4453679051 | history/tasks/luc-15-ops-lane-child-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-15p-product-lane-child-issue:3c56fc2d12 | history/tasks/luc-15-product-lane-child-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-15q-qa-lane-child-issue:b3d4fa0376 | history/tasks/luc-15-qa-lane-child-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-15x-ux-lane-child-issue:41deb76613 | history/tasks/luc-15-ux-lane-child-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:cdf4c9dc48 | history/tasks/luc-151-v1-audit-to-completion-controller-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-152-latest-closure-provenance-packets-2026-05-26:7c9819a920 | history/tasks/luc-152-latest-closure-provenance-packets-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-153-coolify-production-deploy-health-sweep-2026-05-26:0587bfeebd | history/tasks/luc-153-coolify-production-deploy-health-sweep-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:fbbd4386a0 | history/tasks/luc-156-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-158-luc-153-coolify-health-evidence-closure-2026-05-26:b541acd428 | history/tasks/luc-158-luc-153-coolify-health-evidence-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:b7ee97d3c8 | history/tasks/luc-159-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:f176be9d73 | history/tasks/luc-16-readiness-map-task-2026-05-25.md |
| connected_to | project:soar:7c70e892d7 | task:luc-160-luc-158-provenance-packet-closure-2026-05-26:e58e5a521a | history/tasks/luc-160-luc-158-provenance-packet-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:b25a1553a1 | history/tasks/luc-162-normalize-blocked-lanes-first-class-blockers-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-164-luc-160-provenance-packet-closure-2026-05-26:18b71b16b5 | history/tasks/luc-164-luc-160-provenance-packet-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:45660a4c86 | history/tasks/luc-165-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-166-luc-164-provenance-packet-closure-2026-05-26:d2cc5d83e8 | history/tasks/luc-166-luc-164-provenance-packet-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:e39e1e4f5d | history/tasks/luc-167-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-169-luc-166-provenance-packet-closure-2026-05-26:70d252d3ed | history/tasks/luc-169-luc-166-provenance-packet-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:6c67a169ca | history/tasks/luc-17-architecture-function-chain-known-state-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:84ec70ddd2 | history/tasks/luc-170-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-171-luc-169-provenance-packet-closure-2026-05-26:93b4d576c3 | history/tasks/luc-171-luc-169-provenance-packet-closure-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:605229b8f6 | history/tasks/luc-174-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:04c35723a3 | history/tasks/luc-175-source-control-queue-executor-gate-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:e0402daef1 | history/tasks/luc-179-coolify-worker-recovery-or-no-temp-stack-decision-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-18-qa-regression-and-smoke-evidence-baseline-2026-05-25:cfe6a58488 | history/tasks/luc-18-qa-regression-smoke-baseline-2026-05-25.md |
| connected_to | project:soar:7c70e892d7 | task:task:190d6d4200 | history/tasks/luc-181-workers-market-stream-operator-log-root-cause-packet-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:a9bad43cd5 | history/tasks/luc-19-board-hygiene-status-alignment-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:2184156d3a | history/tasks/luc-19-protected-input-readiness-refresh-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:58c0734724 | history/tasks/luc-19-runtime-known-state-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:6626e4470e | history/tasks/luc-19-runtime-readiness-refresh-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:1760066aa9 | history/tasks/luc-19-worker-proof-auth-gate-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:a56a6118eb | history/tasks/luc-191-daily-project-status-refresh-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-192-no-stall-queue-expeditor-2026-05-26:65b826544b | history/tasks/luc-192-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:653a04e4ba | history/tasks/luc-193-autonomous-idle-and-map-drift-sweep-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:ec44f559ff | history/tasks/luc-194-regression-evidence-sweep-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task-contract-luc-194-source-scoped-recovery-disposition-reconciliation-2026-05-26:b33cac38f7 | history/tasks/luc-194-source-scoped-recovery-disposition-reconciliation-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:733c3c18dc | history/tasks/luc-195-gap-register-and-repair-lane-refresh-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task-contract-luc-196-security-account-access-gate-canonical-contract-follow-up-2026-05-26:9b54d0625b | history/tasks/luc-196-security-account-access-gate-canonical-contract-followup-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task-contract-luc-196-security-and-account-access-gate-sweep-2026-05-26:db60422f6b | history/tasks/luc-196-security-account-access-gate-sweep-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task-contract-luc-196-source-scoped-recovery-disposition-reconciliation-2026-05-26:7032fd05e2 | history/tasks/luc-196-source-scoped-recovery-disposition-reconciliation-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-199-no-stall-queue-expeditor-2026-05-26:def023cb57 | history/tasks/luc-199-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-202-no-stall-queue-expeditor-2026-05-26:fea4c180ea | history/tasks/luc-202-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-204-no-stall-queue-expeditor-2026-05-26:a358ddf826 | history/tasks/luc-204-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-207-v1-audit-to-completion-controller-2026-05-26:b7f0720532 | history/tasks/luc-207-v1-audit-to-completion-controller-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-208-no-stall-queue-expeditor-2026-05-26:c132972851 | history/tasks/luc-208-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:5b48691bcb | history/tasks/luc-216-gap-register-and-repair-lane-refresh-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-219-no-stall-queue-expeditor-2026-05-26:978ad404b3 | history/tasks/luc-219-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-22-first-safe-repair-lane-task:8baf28a3ae | history/tasks/luc-22-first-safe-repair-lane-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-221-no-stall-queue-expeditor-2026-05-27:465dab6e06 | history/tasks/luc-221-no-stall-queue-expeditor-2026-05-27-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:697d458166 | history/tasks/luc-227-autonomous-idle-and-map-drift-sweep-2026-05-27-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-228-v1-audit-to-completion-controller-2026-05-27:06b4ec96fb | history/tasks/luc-228-v1-audit-to-completion-controller-2026-05-27-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-230-no-stall-queue-expeditor-2026-05-27:78ebcd6427 | history/tasks/luc-230-no-stall-queue-expeditor-2026-05-27-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:2a9c200f4e | history/tasks/luc-233-gap-register-and-repair-lane-refresh-2026-05-27-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-235-no-stall-queue-expeditor-2026-05-27:1464183418 | history/tasks/luc-235-no-stall-queue-expeditor-2026-05-27-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:deff1521dc | history/tasks/luc-24-paperclip-agent-execution-smoke-test-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:2c54a64a47 | history/tasks/luc-241-unblock-workers-ready-smoke-principal-permissions-2026-05-27-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-244-no-stall-queue-expeditor-2026-05-27:63e3325672 | history/tasks/luc-244-no-stall-queue-expeditor-2026-05-27-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:0c79e49aa9 | history/tasks/luc-246-gap-register-and-repair-lane-refresh-2026-05-27-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-251-no-stall-queue-expeditor-2026-05-27:473fad3ca2 | history/tasks/luc-251-no-stall-queue-expeditor-2026-05-27-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:9031177e78 | history/tasks/luc-263-no-stall-queue-expeditor-2026-05-27-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:cc2eb21b91 | history/tasks/luc-37-a-backend-runtime-and-trading-boundary-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:e97bef4fb9 | history/tasks/luc-37-b-coolify-stack-cutover-and-smoke-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:2084b4d36b | history/tasks/luc-37-c-journey-verification-and-qa-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:4a5018220f | history/tasks/luc-37-d-security-auth-exchange-boundary-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:1c3a21842a | history/tasks/luc-37-e-docs-state-sync-and-journey-map-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:d6b01c494a | history/tasks/luc-37-engineering-breakdown-and-integration-map-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:40c525b922 | history/tasks/luc-38-frontend-view-map-browser-workflow-ownership-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-39-backend-api-service-boundary-known-state-2026-05-25:2249aac05c | history/tasks/luc-39-backend-api-service-boundary-known-state-2026-05-25.md |
| connected_to | project:soar:7c70e892d7 | task:task:d60ae39a4e | history/tasks/luc-40-data-persistence-known-state-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-41-runtime-boundary-checkpoint-2026-05-25:6bbdf78f97 | history/tasks/luc-41-runtime-boundary-checkpoint-2026-05-25.md |
| connected_to | project:soar:7c70e892d7 | task:task:1117c7f03c | history/tasks/luc-43-repeatable-smoke-e2e-checks-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:9f8e0b00ca | history/tasks/luc-45-a-backend-runtime-api-stability-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:d8901f330a | history/tasks/luc-45-b-ops-stack-rollout-and-smoke-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:1f24cab9ee | history/tasks/luc-45-c-qa-repeatable-journey-proof-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:2d2966e70c | history/tasks/luc-45-d-security-boundary-readonly-proof-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:1370b28b50 | history/tasks/luc-45-e-docs-state-parity-sync-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:c5b6b8b972 | history/tasks/luc-45-v1-audit-to-completion-controller-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:f6f8eb4c30 | history/tasks/luc-48-autonomous-map-inventory-and-ui-polish-readiness-gate-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:c5fd6bca96 | history/tasks/luc-49-ui-state-browser-proof-matrix-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:756b0d3dfc | history/tasks/luc-62-v1-project-control-and-lane-supervision-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:f65d7dfe0a | history/tasks/luc-63-no-stall-queue-expeditor-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:74b6b9c761 | history/tasks/luc-64-b-backend-runtime-signal-payload-separation-proof-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:06d96959f6 | history/tasks/luc-64-dashboard-strategy-signal-truth-vs-execution-outcome-repair-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:98ebb5e735 | history/tasks/luc-67-qa-verify-matched-strategy-signal-blocked-execution-reason-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:554acf80d9 | history/tasks/luc-69-ops-smoke-verify-coolify-read-only-secret-access-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:4cdb9e6b28 | history/tasks/luc-70-no-stall-queue-expeditor-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:luc-86-coolify-production-deploy-health-sweep-2026-05-26-task:b76d0a0709 | history/tasks/luc-86-coolify-production-deploy-health-sweep-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:421a4fabd8 | history/tasks/luc-88-review-productivity-for-luc-86-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:f3925fc731 | history/tasks/luc-90-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:336ccc172b | history/tasks/luc-91-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:a9d28091fd | history/tasks/luc-94-v1-audit-to-completion-controller-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:9724e762f9 | history/tasks/luc-95-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:0d725b229d | history/tasks/luc-96-no-stall-queue-expeditor-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:5912861082 | history/tasks/luc-98-release-permit-temp-stack-workers-market-stream-recovery-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:04a82639cd | history/tasks/luc-99-external-ops-blocker-workers-market-stream-and-temp-stack-acceptance-2026-05-26-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:0d16cb98c9 | history/tasks/market-universe-wallet-delete-hardening-task-2026-04-28.md |
| connected_to | project:soar:7c70e892d7 | task:task:b09edf16fc | history/tasks/marketdata-fut-runtime-mark-price-source-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:money-flow-security-cancel-entitlement-task:a28dade859 | history/tasks/money-flow-security-cancel-entitlement-2026-05-21-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:ce1a7d288d | history/tasks/mvp-execution-plan-4ee1672e-progress-sync-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:task:963241bef6 | history/tasks/mvp-execution-plan-55469cdc-progress-sync-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:task:0d15e1c91b | history/tasks/open-protected-backlog-55469cdc-sync-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:task:7e9ccff6dc | history/tasks/open-protected-backlog-ba3d852d-sync-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:open-protected-backlog-dynamic-target-sync-2026-05-10:131bc9474c | history/tasks/open-protected-backlog-dynamic-target-sync-task-2026-05-10.md |
| connected_to | project:soar:7c70e892d7 | task:task:d916b19449 | history/tasks/operator-protected-pack-6c54bb5d-sync-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:operator-unblock-default-current-packet-2026-05-24:28ad5f2826 | history/tasks/operator-unblock-default-current-packet-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:operator-unblock-readiness-consistency-2026-05-24:3b1ff1ca22 | history/tasks/operator-unblock-readiness-consistency-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:1b0763a210 | history/tasks/orddrift-01-manual-context-canonical-group-no-direct-fallback-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:task:7362de4106 | history/tasks/paper-close-pnl-long-short-regression-task-2026-04-25.md |
| connected_to | project:soar:7c70e892d7 | task:task:cefe3dbcb7 | history/tasks/paper-close-pnl-truth-recovery-task-2026-04-24.md |
| connected_to | project:soar:7c70e892d7 | task:task:4e9628394e | history/tasks/pmplc-queue-sync-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:task:5ed0eeefab | history/tasks/portfolio-history-pending-fee-completeness-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:task:5c38cbfd2a | history/tasks/posdrift-01-manual-order-canonical-context-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:task:b961bfa10f | history/tasks/posdrift-02-manual-close-strategy-provenance-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:task:41f7a867eb | history/tasks/posdrift-03-import-ownership-canonical-market-scope-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:task:e5d2d8e665 | history/tasks/posdrift-04-runtime-position-read-canonical-context-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:posdrift-05-canonical-execution-venue-task:3f734a28c3 | history/tasks/posdrift-05-canonical-execution-venue-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:posdrift-06-runtime-signal-loop-canonical-venue-task:568e06c38b | history/tasks/posdrift-06-runtime-signal-loop-canonical-venue-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:posdrift-07-live-overlap-canonical-market-scope-task:bff43e0c02 | history/tasks/posdrift-07-live-overlap-canonical-market-scope-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:posdrift-08-wallet-update-canonical-market-scope-task:fce1882a69 | history/tasks/posdrift-08-wallet-update-canonical-market-scope-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:posdrift-09-manual-context-canonical-venue-task:8a1d7c67c4 | history/tasks/posdrift-09-manual-context-canonical-venue-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:posdrift-10-manual-order-multi-strategy-ambiguity-task:a03d0682c6 | history/tasks/posdrift-10-manual-order-multistrategy-ambiguity-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:posdrift-11-legacy-position-repair-canonical-scope-task:b5e866f9ed | history/tasks/posdrift-11-legacy-position-repair-canonical-scope-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:posdrift-12-live-continuity-canonical-strategy-task:da9404d33b | history/tasks/posdrift-12-live-continuity-canonical-strategy-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:task:0de3e220bc | history/tasks/position-management-backtest-selected-dca-funds-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:task:5aa5480e91 | history/tasks/position-management-basic-dca-reachability-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:task:43947b71da | history/tasks/position-management-dca-lane-state-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:task:d42f71a74b | history/tasks/position-management-exchange-close-pnl-fee-backfill-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:task:a3e0b97f5c | history/tasks/position-management-exchange-event-underfilled-close-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:task:241eef2d87 | history/tasks/position-management-exchange-event-underfilled-entry-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:task:c617d178f0 | history/tasks/position-management-exchange-existing-fill-cap-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:pmplc-36-exchange-fee-pending-helper-task:8cae1e1b9d | history/tasks/position-management-exchange-fee-pending-helper-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:task:e253382d56 | history/tasks/position-management-exchange-fee-pending-recovery-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:task:47429e36d1 | history/tasks/position-management-exchange-fee-pending-truth-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:pmplc-33-exchange-fee-refresh-helper-task:ac3acd3c6e | history/tasks/position-management-exchange-fee-refresh-helper-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:task:fe38baef35 | history/tasks/position-management-exchange-fill-fee-aggregation-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:pmplc-31-exchange-fill-fee-backfill-task:530418ce42 | history/tasks/position-management-exchange-fill-fee-backfill-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:task:8af54210b4 | history/tasks/position-management-exchange-fill-fee-cap-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:task:da8c72f4bb | history/tasks/position-management-exchange-fill-helper-boundary-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:task:7df7f0e707 | history/tasks/position-management-exchange-fill-quantity-normalizer-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:task:fbe249da34 | history/tasks/position-management-exchange-fill-status-helper-refactor-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:task:b3ab70f138 | history/tasks/position-management-exchange-filled-event-idempotency-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:task:135fd6c702 | history/tasks/position-management-exchange-filled-without-quantity-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:pmplc-39-exchange-final-fee-pending-task:bbdbe747dd | history/tasks/position-management-exchange-final-fee-pending-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:pmplc-41-exchange-missing-partial-fee-backfill-task:7c64fe9658 | history/tasks/position-management-exchange-missing-partial-fee-backfill-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:pmplc-40-exchange-missing-partial-fee-pending-task:265c6d9120 | history/tasks/position-management-exchange-missing-partial-fee-pending-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:task:31161b1840 | history/tasks/position-management-exchange-orderfill-quantity-cap-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:task:e722ae2c49 | history/tasks/position-management-exchange-partial-backfill-still-pending-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:pmplc-38-exchange-partial-fee-pending-task:3489a8ad5a | history/tasks/position-management-exchange-partial-fee-pending-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:task:ad2a6eb6c6 | history/tasks/position-management-exchange-partial-status-monotonicity-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:task:b3839a970c | history/tasks/position-management-exchange-recordable-fill-details-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:pmplc-37-exchange-settled-fee-pending-recovery-task:ead6c0319b | history/tasks/position-management-exchange-settled-fee-pending-recovery-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:pmplc-32-exchange-stale-fee-event-guard-task:9a1bc2e375 | history/tasks/position-management-exchange-stale-fee-event-guard-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:pmplc-34-exchange-stale-fee-pending-guard-task:a0f4851bca | history/tasks/position-management-exchange-stale-fee-pending-guard-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:pmplc-35-exchange-stale-fee-pending-recovery-task:2b33c6f997 | history/tasks/position-management-exchange-stale-fee-pending-recovery-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:task:10956e73c6 | history/tasks/position-management-exchange-terminal-fill-details-idempotency-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:task:df3c177d93 | history/tasks/position-management-live-close-order-contract-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:task:8e7a56aec5 | history/tasks/position-management-live-entry-lifecycle-gate-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:task:0f2d1180cc | history/tasks/position-management-live-entry-underfill-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:task:0335a71bbd | history/tasks/position-management-live-free-balance-cap-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:task:008f744925 | history/tasks/position-management-pnl-lifecycle-contract-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:task:6b97aaff82 | history/tasks/position-management-portfolio-dca-fill-margin-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:task:ad9d0d9074 | history/tasks/position-management-portfolio-final-margin-release-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:task:2b796efdd8 | history/tasks/position-management-replay-tracked-balance-reserve-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:task:4b5239d91e | history/tasks/position-management-underfilled-close-fail-closed-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:post-v1-operator-feedback-intake-2026-05-14:16ef9e05e5 | history/tasks/post-v1-bot-wallet-dashboard-cleanup-2026-05-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:3be46e915d | history/tasks/post-v1-crypto-icon-consistency-2026-05-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:post-v1-strategy-snapshot-history-2026-05-14:f58def7094 | history/tasks/post-v1-strategy-snapshot-history-2026-05-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:prod-promote-preq-2026-05-07-production-promotion-prerequisite-sweep:05ee440d8c | history/tasks/prod-promotion-prerequisite-sweep-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:0b91ab8ae2 | history/tasks/prod-public-reachability-refresh-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:6cc8fb72ca | history/tasks/prod-ui-auth-clickthrough-39a52703-task-2026-05-10.md |
| connected_to | project:soar:7c70e892d7 | task:task:3dde56960c | history/tasks/prod-ui-legacy-dashboard-redirects-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:prod-ui-module-clickthrough-runner-2026-05-10:00ef352249 | history/tasks/prod-ui-module-clickthrough-runner-task-2026-05-10.md |
| connected_to | project:soar:7c70e892d7 | task:prod-ui-public-access-clickthrough-task-2026-05-08:5162c6068d | history/tasks/prod-ui-public-access-clickthrough-task-2026-05-08.md |
| connected_to | project:soar:7c70e892d7 | task:task:26b43b8c98 | history/tasks/prod-ui-public-access-refresh-3c5da343-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:task:35848325a4 | history/tasks/prod-ui-public-access-refresh-4ee1672e-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:task:0709ca1769 | history/tasks/prod-ui-public-access-refresh-55469cdc-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:task:f87bd72dc6 | history/tasks/prod-ui-public-access-refresh-6c54bb5d-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:task:2aece422bb | history/tasks/prod-ui-public-access-refresh-745b5f5a-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:task:7de01b65d3 | history/tasks/prod-ui-public-access-refresh-90cd07d6-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:task:0c52813a9a | history/tasks/prod-ui-public-access-refresh-c50e1e7c-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:prod-ui-public-clickthrough-88313309-2026-05-10:1a6c76180a | history/tasks/prod-ui-public-clickthrough-88313309-task-2026-05-10.md |
| connected_to | project:soar:7c70e892d7 | task:task:7574f64658 | history/tasks/production-fresh-deploy-380308d1-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:f9b0ad2a9b | history/tasks/project-index-v1-crosswalk-task-2026-05-10.md |
| connected_to | project:soar:7c70e892d7 | task:task:48db8e62c8 | history/tasks/project-organization-precommit-polish-2026-05-23-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:5bcee4f540 | history/tasks/project-state-v1postbot-drift-sync-task-2026-04-25.md |
| connected_to | project:soar:7c70e892d7 | task:protected-app-test-credential-availability-2026-05-23:4bae8d5023 | history/tasks/protected-app-test-credential-availability-2026-05-23-task.md |
| connected_to | project:soar:7c70e892d7 | task:protected-preflight-classifier-task-2026-05-19:f6cebb5792 | history/tasks/protected-preflight-dd1a1faf-2026-05-19-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:467a1d09aa | history/tasks/qh-e2e-markets-wallets-suite-stabilization-task-2026-04-28.md |
| connected_to | project:soar:7c70e892d7 | task:task:d776bc5d25 | history/tasks/release-audit-tooling-graph-backfill-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:release-gate-activation-status-hardening-2026-05-24-task-packet:4f432ae134 | history/tasks/release-gate-activation-status-hardening-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:release-gate-expected-sha-evidence-binding-2026-05-24-task-packet:5b8989c710 | history/tasks/release-gate-expected-sha-evidence-binding-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:release-gate-history-evidence-resolver-2026-05-24-task-packet:7f226934e3 | history/tasks/release-gate-history-evidence-resolver-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:release-gate-rc-sha-binding-2026-05-24-task-packet:032fdb385a | history/tasks/release-gate-rc-sha-binding-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:release-gate-restore-rollback-sha-binding-2026-05-24-task-packet:060b1bb92c | history/tasks/release-gate-restore-rollback-sha-binding-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:release-operator-unblock-packet-380308d1-2026-05-24:056dcdf052 | history/tasks/release-operator-unblock-packet-380308d1-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:release-preflight-active-docs-root-2026-05-24-task-packet:a595d2eeb4 | history/tasks/release-preflight-active-docs-root-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:release-preflight-remediation-hints-2026-05-24-task-packet:77f1362c3f | history/tasks/release-preflight-remediation-hints-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:repo-source-of-truth-cleanup-task:d5205c7b24 | history/tasks/repo-source-truth-cleanup-2026-05-23-task.md |
| connected_to | project:soar:7c70e892d7 | task:rest-implementation-sweep-2026-05-21:b4a7ec98c4 | history/tasks/rest-implementation-sweep-2026-05-21-task.md |
| connected_to | project:soar:7c70e892d7 | task:reusable-audit-history-path-resolver-2026-05-24:cf099d80e9 | history/tasks/reusable-audit-history-path-resolver-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:4bec41c777 | history/tasks/runtime-aggregate-imported-closed-position-pnl-task-2026-05-06.md |
| connected_to | project:soar:7c70e892d7 | task:runtime-aggregate-slo-blocker-2026-05-25:7e22a40804 | history/tasks/runtime-aggregate-slo-blocker-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:runtime-dca-exchange-pnl-threshold-task:3ab9a5ab08 | history/tasks/runtime-dca-exchange-pnl-threshold-2026-05-23-task.md |
| connected_to | project:soar:7c70e892d7 | task:runtime-execution-dedupe-observability-2026-05-23:5e882226dd | history/tasks/runtime-execution-dedupe-observability-2026-05-23-task.md |
| connected_to | project:soar:7c70e892d7 | task:security-red-team-hardening-2026-05-21:e8726bb21f | history/tasks/security-red-team-hardening-2026-05-21-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:2f98270491 | history/tasks/soar-full-readiness-coordination-2026-05-23-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:c091efb00d | history/tasks/standards-based-security-hardening-2026-05-21-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:d9281280f7 | history/tasks/sysfinal-00-planning-truth-sync-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:task:4ae4a123dd | history/tasks/sysfinal-08-empty-sysfix-queue-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:task:d8efaebe3e | history/tasks/task-board-ready-closure-sync-task-2026-04-25.md |
| connected_to | project:soar:7c70e892d7 | task:task-history:eb31879469 | history/tasks/task-history.md |
| connected_to | project:soar:7c70e892d7 | task:task:d567edde3c | history/tasks/user-action-evidence-index-2026-05-25-task.md |
| connected_to | project:soar:7c70e892d7 | task:ux-ui-memory-autonomy-2026-05-08:816850b88f | history/tasks/ux-ui-memory-autonomy-process-task-2026-05-08.md |
| connected_to | project:soar:7c70e892d7 | task:task:603c678ec2 | history/tasks/uxfix-2026-04-30-a-dashboard-positions-action-style-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:827ff536af | history/tasks/uxfix-2026-04-30-b-dashboard-live-wallet-delta-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:b2504178d4 | history/tasks/v1-agent-blocker-sweep-dd1a1faf-2026-05-20-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:8a891c3938 | history/tasks/v1-api-subscriptions-doc-truth-2026-05-12-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:08bcb5ac22 | history/tasks/v1-architecture-boundary-cleanup-task-2026-05-10.md |
| connected_to | project:soar:7c70e892d7 | task:task:53fbc67066 | history/tasks/v1-bot-runtime-completed-session-fixture-task-2026-05-11.md |
| connected_to | project:soar:7c70e892d7 | task:task:247aa4957d | history/tasks/v1-continuation-expected-sha-snippets-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:v1-continuation-state-sync-2026-05-07-sync-v1-continuation-state:a9de064552 | history/tasks/v1-continuation-state-sync-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:v1-coolify-deploy-queue-recovery-2026-05-10:f90c11b453 | history/tasks/v1-coolify-deploy-queue-recovery-task-2026-05-10.md |
| connected_to | project:soar:7c70e892d7 | task:task:6163f17e75 | history/tasks/v1-current-day-blocker-refresh-00169d7f-2026-05-13-task.md |
| connected_to | project:soar:7c70e892d7 | task:v1-current-main-promotion-deploy-lag-457bce05-2026-05-14:b8446bf0e5 | history/tasks/v1-current-main-promotion-deploy-lag-457bce05-2026-05-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:fce7d028fa | history/tasks/v1-current-preflight-status-snapshot-task-2026-05-08.md |
| connected_to | project:soar:7c70e892d7 | task:task:65dc42adb9 | history/tasks/v1-current-state-drift-cleanup-2026-05-12-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:626dc0a877 | history/tasks/v1-current-worktree-full-regression-2026-05-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:0a71c05a0c | history/tasks/v1-current-worktree-sanity-2026-05-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:35df5e183a | history/tasks/v1-dashboard-crypto-icons-regression-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:c935f6beb9 | history/tasks/v1-dashboard-home-runtime-session-fixture-task-2026-05-11.md |
| connected_to | project:soar:7c70e892d7 | task:v1-deploy-freshness-state-sync-task-2026-05-08:e8ef8238c7 | history/tasks/v1-deploy-freshness-state-sync-task-2026-05-08.md |
| connected_to | project:soar:7c70e892d7 | task:task:730d1da90a | history/tasks/v1-final-activation-truth-reconciliation-task-2026-04-25.md |
| connected_to | project:soar:7c70e892d7 | task:v1-final-blocker-pack-2026-05-07-publish-final-blocker-execution-pack:50f87a29df | history/tasks/v1-final-blocker-execution-pack-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:34a01de680 | history/tasks/v1-final-blocker-pack-candidate-sha-sync-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:task:ab1653ac72 | history/tasks/v1-final-blocker-pack-date-overrides-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:task:f50006c4e3 | history/tasks/v1-final-blocker-pack-restore-state-sync-task-2026-05-08.md |
| connected_to | project:soar:7c70e892d7 | task:task:4bc6294d8e | history/tasks/v1-final-blocker-prerequisite-recheck-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:v1-function-architecture-verification-2026-05-20:6425f2d04e | history/tasks/v1-function-architecture-verification-2026-05-20-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:c260f24d7b | history/tasks/v1-generated-state-refresh-after-current-day-blocker-00169d7f-2026-05-13-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:b721745ee7 | history/tasks/v1-generated-state-refresh-after-operator-packet-00169d7f-2026-05-13-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:7c6fe16e00 | history/tasks/v1-generated-state-refresh-after-queue-hygiene-00169d7f-2026-05-12-task.md |
| connected_to | project:soar:7c70e892d7 | task:v1-generated-state-refresh-after-ui-gate-task-2026-05-12:e68aad23d0 | history/tasks/v1-generated-state-refresh-after-ui-gate-2026-05-12-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:a309e954c5 | history/tasks/v1-live-import-status-isolation-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:v1-live-import-auth-preflight-hardening-task-2026-05-08:41119768ea | history/tasks/v1-liveimport-auth-preflight-hardening-task-2026-05-08.md |
| connected_to | project:soar:7c70e892d7 | task:task:2f80d45da6 | history/tasks/v1-manual-payment-metadata-cleanup-2026-05-12-task.md |
| connected_to | project:soar:7c70e892d7 | task:v1-next-steps-dynamic-sha-cleanup-2026-05-10:50aabae4a5 | history/tasks/v1-next-steps-dynamic-sha-cleanup-task-2026-05-10.md |
| connected_to | project:soar:7c70e892d7 | task:task:77497042e3 | history/tasks/v1-next-steps-protected-sha-sync-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:v1-non-binance-backtest-derivatives-adapter-2026-05-13:cbf161fac4 | history/tasks/v1-non-binance-backtest-derivatives-adapter-2026-05-13-task.md |
| connected_to | project:soar:7c70e892d7 | task:v1-operator-artifact-naming-2026-05-10:0c6c48752e | history/tasks/v1-operator-artifact-naming-task-2026-05-10.md |
| connected_to | project:soar:7c70e892d7 | task:task:1dd08e0e4c | history/tasks/v1-operator-packet-current-day-refresh-00169d7f-2026-05-13-task.md |
| connected_to | project:soar:7c70e892d7 | task:v1-operator-packet-ui-admin-auth-sync-task-2026-05-12:f015779af2 | history/tasks/v1-operator-packet-ui-admin-auth-sync-2026-05-12-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:bd21ce6061 | history/tasks/v1-operator-runbook-current-sha-sync-task-2026-05-10.md |
| connected_to | project:soar:7c70e892d7 | task:task:5a4a57544a | history/tasks/v1-operator-runbook-dynamic-sha-task-2026-05-10.md |
| connected_to | project:soar:7c70e892d7 | task:task:d7544e76b8 | history/tasks/v1-post-release-freshness-memory-sync-2026-05-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:v1-post-v1-auth-deploy-rerun:7d854680e8 | history/tasks/v1-post-v1-auth-deploy-rerun-2026-05-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:v1-post-v1-auth-logout-token-reuse-hardening:0cfecec9e6 | history/tasks/v1-post-v1-auth-logout-token-reuse-hardening-2026-05-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:v1-post-v1-release-confidence-row-closure:81aa4c026d | history/tasks/v1-post-v1-release-confidence-row-closure-2026-05-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:v1-post-v1-wallet-bot-cleanup-hardening:7755e0d306 | history/tasks/v1-post-v1-wallet-bot-cleanup-hardening-2026-05-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:59eccc1107 | history/tasks/v1-preflight-release-gate-graph-refresh-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:b77c9f2f68 | history/tasks/v1-prod-github-actions-regression-cleanup-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:v1-production-restore-and-liveimport-truth-00169d7f-2026-05-13:84d0c37878 | history/tasks/v1-prod-restore-and-liveimport-truth-00169d7f-2026-05-13-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:866a85b28f | history/tasks/v1-prod-ui-current-blocked-refresh-00169d7f-2026-05-12-task.md |
| connected_to | project:soar:7c70e892d7 | task:v1-production-ui-input-unblock-sync-task-00169d7f-2026-05-12:0c0db6ca44 | history/tasks/v1-prod-ui-input-unblock-sync-00169d7f-2026-05-12-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:477d90f96c | history/tasks/v1-production-activation-current-sha-sync-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:v1-prod-activation-refresh-2026-05-07-refresh-production-activation-plan-and-audit:37b6ab8520 | history/tasks/v1-production-activation-plan-refresh-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:469e7329a1 | history/tasks/v1-production-activation-refresh-2026-05-09-task.md |
| connected_to | project:soar:7c70e892d7 | task:v1-prod-activation-refresh-2026-05-10:49a278fd0f | history/tasks/v1-production-activation-refresh-2026-05-10-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:a58c0aa40a | history/tasks/v1-production-activation-refresh-2026-05-12-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:f819bfcb7c | history/tasks/v1-production-activation-refresh-2026-05-13-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:92c6a8a6f2 | history/tasks/v1-production-ui-clickthrough-refresh-00169d7f-2026-05-13-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:6a48b17bd9 | history/tasks/v1-protected-auth-context-sweep-task-2026-05-08.md |
| connected_to | project:soar:7c70e892d7 | task:task:355431fe9b | history/tasks/v1-protected-input-readiness-refresh-380308d1-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:32ad5a6e3b | history/tasks/v1-protected-operator-docs-55469cdc-sync-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:task:d3e9c3a9a6 | history/tasks/v1-protected-ops-gate-457bce05-2026-05-14-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:62fe33fbd7 | history/tasks/v1-protected-preflight-dd1a1faf-2026-05-20-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:ea710d1c2b | history/tasks/v1-protected-queue-dedupe-2026-05-12-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:aaa5dfcfc5 | history/tasks/v1-queue-none-marker-cleanup-2026-05-12-task.md |
| connected_to | project:soar:7c70e892d7 | task:v1-runtime-exchange-adapter-boundary-2026-05-13:6609851d95 | history/tasks/v1-runtime-exchange-adapter-boundary-2026-05-13-task.md |
| connected_to | project:soar:7c70e892d7 | task:v1-runtime-non-binance-derivatives-adapter-2026-05-13:fc684fb228 | history/tasks/v1-runtime-non-binance-derivatives-adapter-2026-05-13-task.md |
| connected_to | project:soar:7c70e892d7 | task:v1-runtime-ticker-and-backtest-venue-ui-2026-05-13:3ce7422b1a | history/tasks/v1-runtime-ticker-and-backtest-venue-ui-2026-05-13-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:0c7a986511 | history/tasks/v1-subscriptions-focused-tests-2026-05-12-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:cfd1fd56b2 | history/tasks/v1-ui-blocker-truth-sync-00169d7f-2026-05-12-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:bf84dab49b | history/tasks/v1-web-orders-positions-doc-truth-2026-05-12-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:d2e4146413 | history/tasks/v1auto-01-runtime-state-rebase-task-2026-04-30.md |
| connected_to | project:soar:7c70e892d7 | task:task:20803737e1 | history/tasks/v1auto-02-reconciliation-automation-hydration-task-2026-04-30.md |
| connected_to | project:soar:7c70e892d7 | task:task:d60810ff6e | history/tasks/v1auto-03-imported-dca-visibility-task-2026-04-30.md |
| connected_to | project:soar:7c70e892d7 | task:v1backtest-01-futures-backtest-kline-recovery:f9288aef7e | history/tasks/v1backtest-01-futures-kline-fallback-task-2026-05-02.md |
| connected_to | project:soar:7c70e892d7 | task:task:4932c5c612 | history/tasks/v1close-00-planning-task-2026-04-27.md |
| connected_to | project:soar:7c70e892d7 | task:task:545c93c4a4 | history/tasks/v1coh-07-manual-live-ready-state-task-2026-04-25.md |
| connected_to | project:soar:7c70e892d7 | task:task:e842f64e77 | history/tasks/v1coh-manual-live-scope-fail-closed-task-2026-04-25.md |
| connected_to | project:soar:7c70e892d7 | task:task:3a5fbada57 | history/tasks/v1cover-00-planning-task-2026-04-29.md |
| connected_to | project:soar:7c70e892d7 | task:task:be38016368 | history/tasks/v1dca-02-multi-replacement-dca-count-task-2026-05-01.md |
| connected_to | project:soar:7c70e892d7 | task:task:709fc91fa0 | history/tasks/v1dca-04-wallet-scoped-imported-dca-read-model-task-2026-05-01.md |
| connected_to | project:soar:7c70e892d7 | task:task:a49fe29ec7 | history/tasks/v1dca-05-restarted-session-imported-dca-read-model-task-2026-05-01.md |
| connected_to | project:soar:7c70e892d7 | task:v1dca-01-runtime-positions-dca-visibility:6bd3329cca | history/tasks/v1dca-visibility-runtime-positions-task-2026-05-01.md |
| connected_to | project:soar:7c70e892d7 | task:task:7367a439f4 | history/tasks/v1doge-02-runtime-close-reopen-hardening-task-2026-05-01.md |
| connected_to | project:soar:7c70e892d7 | task:v1doge-03-live-protection-and-dashboard-price-truth:3af54d88ee | history/tasks/v1doge-ttp-exchange-sync-price-task-2026-05-02.md |
| connected_to | project:soar:7c70e892d7 | task:task:253ff32b74 | history/tasks/v1excel-00-planning-task-2026-04-29.md |
| connected_to | project:soar:7c70e892d7 | task:task:bce217e537 | history/tasks/v1excel-02-local-confidence-task-2026-04-29.md |
| connected_to | project:soar:7c70e892d7 | task:task:d3722f45fb | history/tasks/v1excel-04-stage-refresh-task-2026-04-29.md |
| connected_to | project:soar:7c70e892d7 | task:task:76d9683a47 | history/tasks/v1excel-05-prod-refresh-task-2026-04-29.md |
| connected_to | project:soar:7c70e892d7 | task:task:663d55359d | history/tasks/v1excel-06-prod-runtime-observability-task-2026-05-01.md |
| connected_to | project:soar:7c70e892d7 | task:task:1d045d16f8 | history/tasks/v1excel-06-runtime-observability-task-2026-04-29.md |
| connected_to | project:soar:7c70e892d7 | task:task:d66b75f1b7 | history/tasks/v1excel-07-go-no-go-task-2026-04-29.md |
| connected_to | project:soar:7c70e892d7 | task:task:4ad72de088 | history/tasks/v1excel-08-closure-task-2026-04-29.md |
| connected_to | project:soar:7c70e892d7 | task:task:809e28b6a7 | history/tasks/v1final-00-final-test-structure-task-2026-05-01.md |
| connected_to | project:soar:7c70e892d7 | task:task:5111267ede | history/tasks/v1final-01-prod-gate-execution-task-2026-05-01.md |
| connected_to | project:soar:7c70e892d7 | task:task:ad58afa74e | history/tasks/v1fix-manual-order-open-position-lifecycle-task-2026-04-26.md |
| connected_to | project:soar:7c70e892d7 | task:task:af979ca95f | history/tasks/v1fix-prod-manual-order-and-takeover-investigation-task-2026-04-26.md |
| connected_to | project:soar:7c70e892d7 | task:task:e87ae61f0c | history/tasks/v1gate-01-current-target-freshness-sync-task-2026-05-01.md |
| connected_to | project:soar:7c70e892d7 | task:task:35e1cdf392 | history/tasks/v1gate-02-public-target-refresh-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:a7f9200c55 | history/tasks/v1guard-00-planning-task-2026-04-29.md |
| connected_to | project:soar:7c70e892d7 | task:task:d132c68a15 | history/tasks/v1hist-00-analysis-task-2026-04-29.md |
| connected_to | project:soar:7c70e892d7 | task:v1i18n-01-swiss-german-locale:5375eb8698 | history/tasks/v1i18n-01-swiss-german-locale-task-2026-05-02.md |
| connected_to | project:soar:7c70e892d7 | task:task:fba00896e5 | history/tasks/v1live-00-planning-task-2026-04-26.md |
| connected_to | project:soar:7c70e892d7 | task:task:19887b75dd | history/tasks/v1live-02-03-exact-exchange-context-task-2026-04-26.md |
| connected_to | project:soar:7c70e892d7 | task:task:27c6afb3c8 | history/tasks/v1live-10-signal-live-lifecycle-test-task-2026-04-26.md |
| connected_to | project:soar:7c70e892d7 | task:task:fde55e813a | history/tasks/v1live-11-binance-adapter-family-task-2026-04-26.md |
| connected_to | project:soar:7c70e892d7 | task:task:017c736bf7 | history/tasks/v1live-12-binance-event-lifecycle-task-2026-04-26.md |
| connected_to | project:soar:7c70e892d7 | task:task:2983c2f5b9 | history/tasks/v1live-13-cleanup-task-2026-04-26.md |
| connected_to | project:soar:7c70e892d7 | task:task:5ad135293d | history/tasks/v1live-14-closure-task-2026-04-26.md |
| connected_to | project:soar:7c70e892d7 | task:task:474f4bf9fb | history/tasks/v1live-prod-browser-repro-and-fix-task-2026-04-26.md |
| connected_to | project:soar:7c70e892d7 | task:task:f89b52e020 | history/tasks/v1live-prod-position-truth-followup-task-2026-04-26.md |
| connected_to | project:soar:7c70e892d7 | task:task:981e5c8407 | history/tasks/v1live-prod-position-truth-repair-task-2026-04-26.md |
| connected_to | project:soar:7c70e892d7 | task:task:a558ad6df0 | history/tasks/v1mark-00-planning-task-2026-04-29.md |
| connected_to | project:soar:7c70e892d7 | task:v1market-01-deactivated-bot-market-edit-guard:0b645fffda | history/tasks/v1market-01-deactivated-bot-market-edit-task-2026-05-02.md |
| connected_to | project:soar:7c70e892d7 | task:task:f27303f47c | history/tasks/v1market-02-whitelist-catalog-selection-task-2026-05-02.md |
| connected_to | project:soar:7c70e892d7 | task:task:a732c3e651 | history/tasks/v1market-03-ignore-stale-legacy-market-guard-task-2026-05-02.md |
| connected_to | project:soar:7c70e892d7 | task:task:53235e10d8 | history/tasks/v1own-01-imported-live-runtime-ownership-task-2026-04-30.md |
| connected_to | project:soar:7c70e892d7 | task:task:1a7867652c | history/tasks/v1protect-00-architecture-and-plan-task-2026-04-30.md |
| connected_to | project:soar:7c70e892d7 | task:task:f1f54f95bc | history/tasks/v1ready-2026-04-25-c-deploy-truth-task-2026-04-25.md |
| connected_to | project:soar:7c70e892d7 | task:task:f60fcc733a | history/tasks/v1reg-02-automated-verification-sweep-task-2026-04-25.md |
| connected_to | project:soar:7c70e892d7 | task:task:b8615eb7d2 | history/tasks/v1reg-03-browser-verification-sweep-task-2026-04-25.md |
| connected_to | project:soar:7c70e892d7 | task:task:1fd2c73727 | history/tasks/v1reg-04-findings-classification-task-2026-04-25.md |
| connected_to | project:soar:7c70e892d7 | task:task:a0427b3b82 | history/tasks/v1reg-05-regression-closure-task-2026-04-25.md |
| connected_to | project:soar:7c70e892d7 | task:task:63817114ac | history/tasks/v1reopen-00-analysis-task-2026-04-29.md |
| connected_to | project:soar:7c70e892d7 | task:task:811f4cb828 | history/tasks/v1reopen-06-operator-truth-task-2026-04-29.md |
| connected_to | project:soar:7c70e892d7 | task:task:c40c6f58ce | history/tasks/v1restart-00-planning-task-2026-04-28.md |
| connected_to | project:soar:7c70e892d7 | task:task:7ee123953d | history/tasks/v1roe-00-analysis-task-2026-04-30.md |
| connected_to | project:soar:7c70e892d7 | task:task:6bac7dc7f0 | history/tasks/v1roe-04-production-verification-task-2026-04-30.md |
| connected_to | project:soar:7c70e892d7 | task:v1runtime-trust-03-runtime-operator-trust-hardening:9fc246aa18 | history/tasks/v1runtime-operator-trust-hardening-task-2026-05-02.md |
| connected_to | project:soar:7c70e892d7 | task:task:398a225a27 | history/tasks/v1safe-00-analysis-task-2026-04-29.md |
| connected_to | project:soar:7c70e892d7 | task:task:02c5dea646 | history/tasks/v1safe-13-sortable-strategy-threshold-editor-task-2026-04-30.md |
| connected_to | project:soar:7c70e892d7 | task:v1safe-20-ttp-monotonic-kernel-fix:f8e3d85558 | history/tasks/v1safe-20-ttp-monotonic-kernel-task-2026-04-30.md |
| connected_to | project:soar:7c70e892d7 | task:task:1f1d0cbecc | history/tasks/v1scope-01-launch-scope-decision-task-2026-05-01.md |
| connected_to | project:soar:7c70e892d7 | task:v1sec-01-prod-only-dependency-hardening-task-2026-05-02:36e0bed171 | history/tasks/v1sec-01-prod-only-dependency-hardening-task-2026-05-02.md |
| connected_to | project:soar:7c70e892d7 | task:v1subs-01-live-entitlement-bot-write-guard-task:dd4b1c344f | history/tasks/v1subs-01-live-entitlement-bot-write-guard-task-2026-05-01.md |
| connected_to | project:soar:7c70e892d7 | task:v1surf-02-shared-runtime-open-position-derivation:634dafd968 | history/tasks/v1surf-02-shared-runtime-position-derivation-task-2026-05-02.md |
| connected_to | project:soar:7c70e892d7 | task:task:bbcbe59818 | history/tasks/v1take-00-planning-task-2026-04-25.md |
| connected_to | project:soar:7c70e892d7 | task:task:19d2974477 | history/tasks/v1take-02-takeover-authority-red-task-2026-04-25.md |
| connected_to | project:soar:7c70e892d7 | task:task:ca8a15e2f6 | history/tasks/v1take-03-wallet-owned-takeover-fix-task-2026-04-25.md |
| connected_to | project:soar:7c70e892d7 | task:task:c107e02956 | history/tasks/v1take-04-runtime-visibility-red-task-2026-04-25.md |
| connected_to | project:soar:7c70e892d7 | task:task:a0a8c6a734 | history/tasks/v1take-05-runtime-ownership-fix-task-2026-04-25.md |
| connected_to | project:soar:7c70e892d7 | task:task:fbba470cb5 | history/tasks/v1take-06-manual-order-truth-red-task-2026-04-25.md |
| connected_to | project:soar:7c70e892d7 | task:task:70e205561f | history/tasks/v1take-07-manual-order-truth-fix-task-2026-04-25.md |
| connected_to | project:soar:7c70e892d7 | task:task:ec60d6318f | history/tasks/v1take-08-closure-task-2026-04-25.md |
| connected_to | project:soar:7c70e892d7 | task:task:17231d9dca | history/tasks/v1take-09-wallet-single-switch-ui-task-2026-04-25.md |
| connected_to | project:soar:7c70e892d7 | task:task:5b9f49e5d5 | history/tasks/v1take-10-bot-external-management-source-task-2026-04-30.md |
| connected_to | project:soar:7c70e892d7 | task:task:04a71f56e0 | history/tasks/v1truth-00-planning-task-2026-04-29.md |
| connected_to | project:soar:7c70e892d7 | task:task:2ba942e3fe | history/tasks/v1truth-01-execution-plan-status-sync-task-2026-05-09.md |
| connected_to | project:soar:7c70e892d7 | task:task:6cac430e5f | history/tasks/v1truth-07-08-protection-rule-task-2026-04-29.md |
| connected_to | project:soar:7c70e892d7 | task:v1ui-01-auth-login-error-alert-task:3a70f49b81 | history/tasks/v1ui-01-auth-login-error-alert-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:v1ui-02-auth-register-error-and-i18n-route-task:cbb49d08d2 | history/tasks/v1ui-02-auth-register-error-i18n-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:v1ui-03-public-access-header-route-contract:603fc3624a | history/tasks/v1ui-03-public-access-header-route-contract-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:v1ui-08-dashboard-prospective-protection-label:1b0b0ab57e | history/tasks/v1ui-08-dashboard-prospective-protection-label-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:v1ui-10-runtime-position-provenance-label-task:fdb585434f | history/tasks/v1ui-10-runtime-position-provenance-label-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:v1ui-11-dashboard-position-modal-provenance-task:c92e8519a7 | history/tasks/v1ui-11-dashboard-position-modal-provenance-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:v1ui-12-runtime-continuity-label-helper-task:338db681de | history/tasks/v1ui-12-runtime-continuity-label-helper-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:2556deb014 | history/tasks/v1ui-13-bot-open-orders-source-label-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:0c8669e04a | history/tasks/v1ui-14-runtime-open-order-status-label-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:f8c013ba18 | history/tasks/v1ui-15-dashboard-open-order-fill-quantity-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:ca6c4fa7de | history/tasks/v1ui-16-dashboard-open-order-execution-terms-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:72f229b2f0 | history/tasks/v1ui-17-dashboard-open-position-entry-quantity-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:09bb9aa709 | history/tasks/v1ui-19-dashboard-history-close-reason-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:d1724d7c37 | history/tasks/v1ui-20-dashboard-closed-history-table-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:ef4604e205 | history/tasks/v1ui-21-dashboard-aggregate-wallet-strict-capital-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:723cc827d8 | history/tasks/v1ui-23-dashboard-manual-order-lifecycle-state-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:2bb9cc85a9 | history/tasks/v1ui-25-dashboard-manual-order-submitted-state-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:a14307f0fd | history/tasks/v1ui-27-manual-order-exchange-id-state-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:c685c329aa | history/tasks/v1ui-28-manual-order-blocked-reason-state-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:e64517f69b | history/tasks/v1ui-29-exchange-backed-order-cancel-fail-closed-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:97410f64d5 | history/tasks/v1ui-30-auth-form-prehydration-fail-closed-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:fab6a760ea | history/tasks/v1ui-31-dashboard-home-route-owned-runtime-labels-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:91ae3ec8ed | history/tasks/v1ui-32-dashboard-home-route-owned-copy-closure-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:ee4f04d4ff | history/tasks/v1ui-33-shared-mark-price-source-suffix-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:7d26f6ad4c | history/tasks/v1ui-34-dashboard-signal-score-summary-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:feb148e092 | history/tasks/v1ui-35-dashboard-signal-runtime-detail-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:b8c73c4d3e | history/tasks/v1ui-37-dashboard-signal-market-state-badge-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:5a32385ab5 | history/tasks/v1ui-38-dashboard-session-failure-detail-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:6496f70589 | history/tasks/v1ui-39-shared-runtime-signal-label-suffixes-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:48bbf7bfca | history/tasks/v1ui-40-runtime-signal-label-unknown-values-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:task:df4d6b03d2 | history/tasks/v1ui-41-open-order-status-fail-closed-task-2026-05-07.md |
| connected_to | project:soar:7c70e892d7 | task:v1ui-flag-01-footer-language-switcher-flags-regression:a6e99b0c7f | history/tasks/v1ui-flag-01-footer-language-flags-regression-task-2026-05-01.md |
| connected_to | project:soar:7c70e892d7 | task:task:ba53c71d58 | history/tasks/v1ux-bots-03-canonical-bot-preview-assistant-route-shell-task-2026-05-01.md |
| connected_to | project:soar:7c70e892d7 | task:task:b37759f0a6 | history/tasks/walletbal-01-live-account-balance-cache-task-2026-05-03.md |
| connected_to | project:soar:7c70e892d7 | task:task-web-dashboard-selected-bot-load-dependency-closure:2ab693725c | history/tasks/web-dashboard-selected-bot-load-deps-2026-05-24-task.md |
| connected_to | project:soar:7c70e892d7 | task:task:4559c6c956 | history/tasks/wpreview-10-wallet-preview-unavailable-fail-closed-task-2026-05-01.md |
| connected_to | project:soar:7c70e892d7 | task:task:07ee2b0a30 | history/tasks/xadapt-03-exchange-adapter-boundary-task-2026-04-25.md |
| connected_to | project:soar:7c70e892d7 | task:task:2808020c54 | history/tasks/xadapt-04-binance-adapter-contract-tests-task-2026-04-25.md |
| connected_to | project:soar:7c70e892d7 | task:task:04d8e145ec | history/tasks/xadapt-05-exchange-adapter-closure-task-2026-04-25.md |
| connected_to | project:soar:7c70e892d7 | task:task:d70718b78f | history/tasks/xvenue-01-exact-exchange-context-contract-task-2026-04-25.md |
| connected_to | project:soar:7c70e892d7 | task:task:7be192263e | history/tasks/xvenue-05-markets-engine-boundary-removal-task-2026-04-25.md |
| connected_to | project:soar:7c70e892d7 | task:task:2d25d54d61 | history/tasks/xvenue-07-worker-topology-truth-task-2026-04-25.md |
| connected_to | project:soar:7c70e892d7 | task:task:f2931288b1 | history/tasks/xvenue-08-closure-task-2026-04-25.md |
| documents | agent:active-mission-packet:90910b7ce0 | module:agents:703799f003 | .agents/state/active-mission.md |
| documents | agent:adopt-template-into-existing-project:9ddfafa2f9 | module:agents:703799f003 | .agents/skills/adopt_template_into_existing_project/SKILL.md |
| documents | agent:agent-checklists:db27c98cf6 | module:agents:703799f003 | .agents/checklists/README.md |
| documents | agent:agent-hierarchy:2922333a24 | module:agents:703799f003 | .agents/workflows/agent-hierarchy.md |
| documents | agent:agent-operating-system:55bf1c725a | module:agents:703799f003 | .agents/core/operating-system.md |
| documents | agent:agent-process-evals:733443a73f | module:agents:703799f003 | .agents/state/agent-evals.md |
| documents | agent:agent-reports:72c29de6c8 | module:agents:703799f003 | .agents/reports/README.md |
| documents | agent:agent-tasks:dd753616e7 | module:agents:703799f003 | .agents/tasks/README.md |
| documents | agent:anti-regression-system:c99df5ca5f | module:agents:703799f003 | .agents/core/anti-regression.md |
| documents | agent:backend-builder:67e359c884 | module:agents:703799f003 | .agents/prompts/backend-builder.md |
| documents | agent:capture-agent-learnings:1db5f932ee | module:agents:703799f003 | .agents/skills/capture-agent-learnings/SKILL.md |
| documents | agent:code-reviewer:c3d1ec54fa | module:agents:703799f003 | .agents/prompts/code-reviewer.md |
| documents | agent:codex-power-use-workflow:e35e261319 | module:agents:703799f003 | .agents/workflows/codex-power-use.md |
| documents | agent:current-focus:d7426a0788 | module:agents:703799f003 | .agents/state/current-focus.md |
| documents | agent:db-migrations:8412462f48 | module:agents:703799f003 | .agents/prompts/db-migrations.md |
| documents | agent:decision-register:64471059cc | module:agents:703799f003 | .agents/state/decision-register.md |
| documents | agent:delivery-map:31184c63a9 | module:agents:703799f003 | .agents/state/delivery-map.md |
| documents | agent:documentation-governance-workflow:5d42f7cf6d | module:agents:703799f003 | .agents/workflows/documentation-governance.md |
| documents | agent:execution-loop:d3a950191f | module:agents:703799f003 | .agents/core/execution-loop.md |
| documents | agent:frontend-builder:4877ab146a | module:agents:703799f003 | .agents/prompts/frontend-builder.md |
| documents | agent:general-workspace-rules:fd70611997 | module:agents:703799f003 | .agents/workflows/general.md |
| documents | agent:known-issues:c1bb1f627a | module:agents:703799f003 | .agents/state/known-issues.md |
| documents | agent:mission-control:ba3faa3760 | module:agents:703799f003 | .agents/core/mission-control.md |
| documents | agent:module-confidence-ledger:37979932f1 | module:agents:703799f003 | .agents/state/module-confidence-ledger.md |
| documents | agent:next-steps:de8f85e09f | module:agents:703799f003 | .agents/state/next-steps.md |
| documents | agent:ops-release:e460d409e0 | module:agents:703799f003 | .agents/prompts/ops-release.md |
| documents | agent:planner:d382717bd5 | module:agents:703799f003 | .agents/prompts/planner.md |
| documents | agent:procedure:21bf8ee82e | module:agents:703799f003 | .agents/skills/ship_dashboard_feature_slice/SKILL.md |
| documents | agent:procedure:75d06fe291 | module:agents:703799f003 | .agents/skills/scaffold_api_module/SKILL.md |
| documents | agent:procedure:9978f21e86 | module:agents:703799f003 | .agents/skills/build_worker_job_pipeline/SKILL.md |
| documents | agent:procedure:ad2dd97170 | module:agents:703799f003 | .agents/skills/run_release_gate_checks/SKILL.md |
| documents | agent:procedure:be70a21ee0 | module:agents:703799f003 | .agents/skills/_templates/SKILL.template.md |
| documents | agent:procedure:f48c47c027 | module:agents:703799f003 | .agents/skills/implement_exchange_api_key_flow/SKILL.md |
| documents | agent:product-delivery-system:fce835cd39 | module:agents:703799f003 | .agents/core/product-delivery-system.md |
| documents | agent:product-docs:5261cc5f87 | module:agents:703799f003 | .agents/prompts/product-docs.md |
| documents | agent:product-intake-and-decision-handshake:6d603155b8 | module:agents:703799f003 | .agents/core/product-intake-and-decision-handshake.md |
| documents | agent:project-memory-index:7835719b6a | module:agents:703799f003 | .agents/core/project-memory-index.md |
| documents | agent:qa-test:541adac345 | module:agents:703799f003 | .agents/prompts/qa-test.md |
| documents | agent:quality-attribute-scenarios:61d0ad5ccb | module:agents:703799f003 | .agents/state/quality-attribute-scenarios.md |
| documents | agent:quality-gates:884b22bbbc | module:agents:703799f003 | .agents/core/quality-gates.md |
| documents | agent:regression-log:d70c96d1c0 | module:agents:703799f003 | .agents/state/regression-log.md |
| documents | agent:requirements-verification-matrix:e41e52ef6d | module:agents:703799f003 | .agents/state/requirements-verification-matrix.md |
| documents | agent:requirements-verification-system:c3130ec88a | module:agents:703799f003 | .agents/core/requirements-verification-system.md |
| documents | agent:responsibility-lanes:4708049f99 | module:agents:703799f003 | .agents/workflows/responsibility-lanes.md |
| documents | agent:responsibility-learning:ff40aac95c | module:agents:703799f003 | .agents/state/responsibility-learning.md |
| documents | agent:risk-register:db2f66a37d | module:agents:703799f003 | .agents/state/risk-register.md |
| documents | agent:security-auditor:5310513aee | module:agents:703799f003 | .agents/prompts/security-auditor.md |
| documents | agent:skills-index:85edd232fa | module:agents:703799f003 | .agents/skills/README.md |
| documents | agent:subagent-orchestration-workflow:d90b97dded | module:agents:703799f003 | .agents/workflows/subagent-orchestration.md |
| documents | agent:system-health:61941ce1e0 | module:agents:703799f003 | .agents/state/system-health.md |
| documents | agent:user-collaboration-workflow:3d2112756f | module:agents:703799f003 | .agents/workflows/user-collaboration.md |
| documents | agent:world-class-delivery-workflow:aca23ea4dc | module:agents:703799f003 | .agents/workflows/world-class-delivery.md |
| documents | document:01-overview-and-principles:64875f8804 | module:docs:5ee73d9114 | docs/architecture/01_overview-and-principles.md |
| documents | document:02-system-topology:3f239dded1 | module:docs:5ee73d9114 | docs/architecture/02_system-topology.md |
| documents | document:03-domain-model:5cb5bdbe43 | module:docs:5ee73d9114 | docs/architecture/03_domain-model.md |
| documents | document:04-runtime-contexts:218bf82688 | module:docs:5ee73d9114 | docs/architecture/04_runtime-contexts.md |
| documents | document:05-strategy-signal-and-decision-flow:7f10e0dc7a | module:docs:5ee73d9114 | docs/architecture/05_strategy-signal-and-decision-flow.md |
| documents | document:06-execution-lifecycle:819096ac77 | module:docs:5ee73d9114 | docs/architecture/06_execution-lifecycle.md |
| documents | document:07-modes-parity-and-data:3c478a8fd3 | module:docs:5ee73d9114 | docs/architecture/07_modes-parity-and-data.md |
| documents | document:08-operator-surfaces-and-routing:f862681bd3 | module:docs:5ee73d9114 | docs/architecture/08_operator-surfaces-and-routing.md |