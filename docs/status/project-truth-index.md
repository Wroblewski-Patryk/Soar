# Project Truth Index

Generated: 2026-07-22T07:26:53.322Z
Project: Soar
Status: gaps_require_routing

This is the routing surface agents should use before guessing whether an app works.

| Metric | Count |
| --- | ---: |
| appCompletionItems | 86 |
| eventChains | 9 |
| incompleteEventChains | 1 |
| runtimeFindings | 0 |
| criticalRuntimeFindings | 0 |
| appCompletionGaps | 51 |
| indexedAppCompletionGaps | 51 |
| knownAppCompletionRiskItems | 51 |
| appCompletionPriorityReviewItems | 51 |
| appCompletionPriorityReviewTruncated | false |
| operationalGateGaps | 1 |
| indexedGaps | 53 |
| totalGaps | 53 |

## First Gap

- high: Missing frontend, backend, worker layer(s) in event chain.
- Owner: CTO Architect + Engineering Delivery Lead
- Next action: Map frontend, backend, worker entities into this flow before claiming holistic status.

## Gaps

| Severity | Kind | Flow | Summary | Next owner |
| --- | --- | --- | --- | --- |
| high | event_chain_gap | AI Assistant foundation | Missing frontend, backend, worker layer(s) in event chain. | CTO Architect + Engineering Delivery Lead |
| high | app_completion_gap | AI Assistant foundation | AI Assistant foundation: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
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
| high | operational_gate_gap | - | event_chain_index: incomplete | Project Manager |
