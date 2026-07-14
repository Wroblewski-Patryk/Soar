# Project Truth Index

Generated: 2026-07-14T17:00:30.765Z
Project: Soar
Status: gaps_require_routing

This is the routing surface agents should use before guessing whether an app works.

| Metric | Count |
| --- | ---: |
| appCompletionItems | 706 |
| eventChains | 8 |
| incompleteEventChains | 0 |
| runtimeFindings | 0 |
| criticalRuntimeFindings | 0 |
| appCompletionGaps | 697 |
| indexedAppCompletionGaps | 200 |
| knownAppCompletionRiskItems | 697 |
| appCompletionPriorityReviewItems | 200 |
| appCompletionPriorityReviewTruncated | true |
| operationalGateGaps | 0 |
| indexedGaps | 200 |
| totalGaps | 697 |

## First Gap

- medium: Account access: useHydrationReady.ts has app-completion risk missing_doc_link.
- Owner: Docs Memory Lead + Project Manager
- Next action: Link or update the source-of-truth docs/status entry for this flow so future agents can reason from evidence.

## Gaps

| Severity | Kind | Flow | Summary | Next owner |
| --- | --- | --- | --- | --- |
| medium | app_completion_gap | Account access | Account access: useHydrationReady.ts has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: useLoginForm.ts has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: useRegisterForm.ts has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: auth.service.ts has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Account access | Account access: auth.de-CH.ts has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: auth.en.ts has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: auth.pl.ts has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: auth.pt.ts has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Account access | Account access: runProdAuthSessionBrowserProof.mjs has app-completion risk implemented_needs_proof. | QA Regression Lead + Project Manager |
| high | app_completion_gap | Account access | Account access: requireAuth.ts has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Account access | Account access: auth.controller.ts has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Account access | Account access: auth.cookie.ts has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Account access | Account access: auth.errors.ts has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Account access | Account access: auth.jwt.ts has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Account access | Account access: auth.routes.ts has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Account access | Account access: auth.service.ts has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Account access | Account access: auth.session.ts has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Account access | Account access: sessionToken.ts has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Account access | Account access: runtimeSessionOpenOrdersReadModel.service.ts has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Account access | Account access: runtimeSessionPositionCommand.service.ts has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Account access | Account access: runtimeSessionPositionDcaCount.ts has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Account access | Account access: runtimeSessionPositionsRead.repository.ts has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Account access | Account access: runtimeSessionPositionsRead.service.ts has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Account access | Account access: runtimeSessionPositionWindow.ts has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Account access | Account access: runtimeSessionRead.service.ts has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Account access | Account access: runtimeSessionsRead.service.ts has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Account access | Account access: runtimeSessionSymbolStatsRead.service.ts has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Account access | Account access: runtimeSessionTradeFallbackScope.ts has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Account access | Account access: runtimeSessionTradesRead.repository.ts has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Account access | Account access: runtimeSessionTradesRead.service.ts has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Account access | Account access: exchangeAuthenticatedRead.service.ts has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Account access | Account access: exchangeAuthenticatedReadContract.service.ts has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Account access | Account access: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Account access | Account access: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Account access | Account access: AuthContext.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Account access | Account access: LoginForm.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Account access | Account access: PasswordVisibilityToggle.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Account access | Account access: RegisterForm.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Account access | Account access: LoginPage.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Account access | Account access: RegisterPage.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| medium | app_completion_gap | Admin operation | Admin operation: GET / has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Admin operation | Admin operation: USE /users has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Admin operation | Admin operation: USE /admin has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Admin operation | Admin operation: adminUsers.service.ts has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Admin operation | Admin operation: admin.de-CH.ts has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Admin operation | Admin operation: admin.en.ts has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Admin operation | Admin operation: admin.pl.ts has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Admin operation | Admin operation: admin.pt.ts has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| high | app_completion_gap | Admin operation | Admin operation: users.controller.ts has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Admin operation | Admin operation: users.routes.ts has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Admin operation | Admin operation: users.service.ts has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Admin operation | Admin operation: admin.routes.ts has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Admin operation | Admin operation: layout.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Admin operation | Admin operation: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Admin operation | Admin operation: page.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Admin operation | Admin operation: AdminLayoutShell.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| high | app_completion_gap | Admin operation | Admin operation: AdminUsersPage.tsx has app-completion risk needs_browser_review. | QA Regression Lead + Frontend Experience Lead |
| medium | app_completion_gap | Dashboard overview | Dashboard overview: GET / has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Dashboard overview | Dashboard overview: USE /backtests has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Dashboard overview | Dashboard overview: USE /bots has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Dashboard overview | Dashboard overview: USE /icons has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Dashboard overview | Dashboard overview: USE /logs has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Dashboard overview | Dashboard overview: USE /market-stream has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Dashboard overview | Dashboard overview: USE /markets has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Dashboard overview | Dashboard overview: USE /orders has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Dashboard overview | Dashboard overview: USE /positions has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Dashboard overview | Dashboard overview: USE /profile/apiKeys has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Dashboard overview | Dashboard overview: USE /profile/basic has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Dashboard overview | Dashboard overview: USE /profile/security has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Dashboard overview | Dashboard overview: USE /reports has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Dashboard overview | Dashboard overview: USE /strategies has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Dashboard overview | Dashboard overview: USE /wallets has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Dashboard overview | Dashboard overview: USE /dashboard has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Dashboard overview | Dashboard overview: formatters.ts has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Dashboard overview | Dashboard overview: runtimeDerivations.ts has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Dashboard overview | Dashboard overview: runtimeSidebarPresenters.ts has app-completion risk missing_test_link. | Test Automation Engineer + QA Regression Lead |
| medium | app_completion_gap | Dashboard overview | Dashboard overview: runtimeSignalConditionState.ts has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Dashboard overview | Dashboard overview: runtimeTradeMeta.ts has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Dashboard overview | Dashboard overview: HomeLiveWidgets.test-helpers.ts has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
| medium | app_completion_gap | Dashboard overview | Dashboard overview: useCloseRuntimePositionAction.ts has app-completion risk missing_doc_link. | Docs Memory Lead + Project Manager |
