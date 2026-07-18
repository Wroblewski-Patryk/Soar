# Project Truth Index

Generated: 2026-07-18T22:14:37.627Z
Project: Soar
Status: gaps_require_routing

This is the routing surface agents should use before guessing whether an app works.

| Metric | Count |
| --- | ---: |
| appCompletionItems | 86 |
| eventChains | 8 |
| incompleteEventChains | 0 |
| runtimeFindings | 1 |
| criticalRuntimeFindings | 1 |
| appCompletionGaps | 52 |
| indexedAppCompletionGaps | 52 |
| knownAppCompletionRiskItems | 52 |
| appCompletionPriorityReviewItems | 52 |
| appCompletionPriorityReviewTruncated | false |
| operationalGateGaps | 2 |
| indexedGaps | 55 |
| totalGaps | 55 |

## First Gap

- critical: api_ready https://api.soar.luckysparrow.ch/ready returned 503: {"status":"not_ready","service":"api"}
- Owner: Deployment Reliability Engineer + Ops Release Lead
- Next action: Create or resume a release mutation permit for read-only diagnosis, then rollback/restart/redeploy only with named resource, SHA/image, rollback, and smoke proof.

## Gaps

| Severity | Kind | Flow | Summary | Next owner |
| --- | --- | --- | --- | --- |
| critical | runtime_error | - | api_ready https://api.soar.luckysparrow.ch/ready returned 503: {"status":"not_ready","service":"api"} | Deployment Reliability Engineer + Ops Release Lead |
| high | app_completion_gap | Dashboard overview | Dashboard overview: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Dashboard overview | Dashboard overview: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Dashboard overview | Dashboard overview: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Dashboard overview | Dashboard overview: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Dashboard overview | Dashboard overview: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Dashboard overview | Dashboard overview: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Dashboard overview | Dashboard overview: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Dashboard overview | Dashboard overview: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Dashboard overview | Dashboard overview: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Dashboard overview | Dashboard overview: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Dashboard overview | Dashboard overview: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Dashboard overview | Dashboard overview: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Dashboard overview | Dashboard overview: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Dashboard overview | Dashboard overview: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Dashboard overview | Dashboard overview: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Dashboard overview | Dashboard overview: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Dashboard overview | Dashboard overview: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Dashboard overview | Dashboard overview: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Dashboard overview | Dashboard overview: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Dashboard overview | Dashboard overview: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Dashboard overview | Dashboard overview: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Dashboard overview | Dashboard overview: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Dashboard overview | Dashboard overview: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Dashboard overview | Dashboard overview: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Dashboard overview | Dashboard overview: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Dashboard overview | Dashboard overview: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Dashboard overview | Dashboard overview: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Exchange connection and configuration | Exchange connection and configuration: ExchangeConnectionsView.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| medium | app_completion_gap | Subscription and entitlement | Subscription and entitlement: USE /webhooks/stripe has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Subscription and entitlement | Subscription and entitlement: USE /subscriptions/plans has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Subscription and entitlement | Subscription and entitlement: USE /profile/subscription has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| high | app_completion_gap | Subscription and entitlement | Subscription and entitlement: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Subscription and entitlement | Subscription and entitlement: AdminSubscriptionsPage.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| medium | app_completion_gap | Unclassified user workflow | Unclassified user workflow: USE /avatars has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Unclassified user workflow | Unclassified user workflow: GET / has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Unclassified user workflow | Unclassified user workflow: GET /alerts has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Unclassified user workflow | Unclassified user workflow: GET /health has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Unclassified user workflow | Unclassified user workflow: GET /metrics has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Unclassified user workflow | Unclassified user workflow: GET /ready has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Unclassified user workflow | Unclassified user workflow: GET /ready/details has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Unclassified user workflow | Unclassified user workflow: USE /upload has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Unclassified user workflow | Unclassified user workflow: GET /workers/health has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Unclassified user workflow | Unclassified user workflow: GET /workers/ready has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Unclassified user workflow | Unclassified user workflow: GET /workers/runtime-freshness has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| high | app_completion_gap | Unclassified user workflow | Unclassified user workflow: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Unclassified user workflow | Unclassified user workflow: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Unclassified user workflow | Unclassified user workflow: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Unclassified user workflow | Unclassified user workflow: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Unclassified user workflow | Unclassified user workflow: BacktestsListView.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Unclassified user workflow | Unclassified user workflow: AuditTrailView.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Unclassified user workflow | Unclassified user workflow: PerformanceReportsView.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | User configuration | User configuration: ProfilePage.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| critical | operational_gate_gap | - | runtime_error_index: critical_findings | Project Manager |
| high | operational_gate_gap | - | public_runtime_probe: failed | Deployment Reliability Engineer |
