# Task

## Header
- ID: LUC-1761
- Title: Bind approved SOAR_PROD protected app smoke session
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Security
- Depends on: LUC-1756
- Priority: P0
- Module Confidence Rows: production protected app evidence
- Requirement Rows: ARB-006 protected app proof
- Quality Scenario Rows: production auth smoke, no-secret evidence
- Risk Rows: production session handling, account mutation safety
- Iteration: 2026-06-03
- Operation Mode: BUILDER
- Mission ID: LUC-1761-BIND-APP-SMOKE-SESSION-2026-06-03
- Mission Status: VERIFIED

## Context
LUC-1756 blocked QA protected app evidence because its runner had zero matching protected app/auth input names for the production SHA `6839cd6b8884e26eca735ce32cea98c1dadccfbe`. This Security lane had to bind or approve an agent-accessible read-only production Soar app account/session class without exposing secrets.

## Goal
Approve the exact safe protected app proof input family for QA/Test, or record a first-class blocker if the current runner still lacks a complete safe read-only session class.

## Scope
- Read the Paperclip scoped wake, role contract, and Soar protected-input evidence.
- Perform names-only input readback for approved protected app proof families.
- Run the existing no-secret protected-input readiness checker.
- Define allowed and forbidden actions for QA/Test.
- Do not print, copy, store, or validate secret values.

## Implementation Plan
1. Read issue context and Security credential rules.
2. Check current runner for protected app input names only.
3. Run `ops:protected-inputs:check` for the current production SHA.
4. Record the Security disposition and unblock action.

## Acceptance Criteria
- Exact proof env family is named without values.
- Mutating actions are explicitly forbidden.
- If the session class is incomplete, the issue is blocked with owner/action.

## Definition of Done
- [x] Protected input names checked without values.
- [x] Existing readiness command run with dated evidence artifacts.
- [x] Security approval boundary recorded.
- [x] No secret values, cookies, passwords, tokens, or protected response bodies exposed.
- [x] Issue disposition updated.

## Validation Evidence
- Tests:
  - `pnpm run -s ops:protected-inputs:check -- --today 2026-06-03 --expected-sha 6839cd6b8884e26eca735ce32cea98c1dadccfbe --git-ref main --build-info-checked-at 2026-06-03T13:13:08.769Z --json-output history/artifacts/luc-1761-protected-app-session-readiness-6839cd6b-2026-06-03.json --markdown-output history/evidence/luc-1761-protected-app-session-readiness-6839cd6b-2026-06-03.md` -> `PARTIAL`, `matchingProtectedInputNamesPresent=5`.
  - `pnpm run -s ops:protected-inputs:check -- --today 2026-06-03 --expected-sha 6839cd6b8884e26eca735ce32cea98c1dadccfbe --git-ref main --build-info-checked-at 2026-06-03T13:13:08.769Z --json-output history/artifacts/luc-1761-protected-app-session-approved-readiness-6839cd6b-2026-06-03.json --markdown-output history/evidence/luc-1761-protected-app-session-approved-readiness-6839cd6b-2026-06-03.md` -> `PARTIAL`, `matchingProtectedInputNamesPresent=6`, `PROD_UI_AUDIT_*` present.
- Manual checks:
  - names-only env scan found `PROD_UI_AUDIT_ADMIN_EMAIL`, `PROD_UI_AUDIT_ADMIN_PASSWORD`, `PROD_UI_AUDIT_ADMIN_TOKEN`, `PROD_UI_AUDIT_API_BASE_URL`, and `PROD_UI_AUDIT_WEB_BASE_URL`.
  - blocker-resolved names-only env scan found `PROD_UI_AUDIT_AUTH_TOKEN` present.
  - `LUC-1766` continuation summary states Portfolio bound Security-approved `SMOKE_AUTH_TOKEN` as `PROD_UI_AUDIT_AUTH_TOKEN` to Test Automation, QA Regression, Security, and Portfolio runner configs, and did not bind email/password aliases.
- Screenshots/logs: none captured; no authenticated browser proof was run.
- High-risk checks: no deploy, restart, rollback, env edit, account mutation, subscription mutation, API-key mutation, exchange setting change, external service mutation, live-trading action, secret readback, protected response-body capture, or cookie/session export.
- Module confidence ledger updated: yes.
- Reality status: verified for Security binding gate; protected browser proof remains owned by QA/Test.

## Security / Privacy Evidence
- Data classification: production credentials/session context; high risk.
- Trust boundaries: Paperclip runner env/secret binding to production Soar Web/API.
- Permission or ownership checks: the current bound family is admin-scoped by name and cannot be treated as the requested read-only app smoke session.
- Abuse cases:
  - over-approving admin credentials for broad app smoke could expose mutation-capable routes;
  - substituting public build-info for protected auth proof would create false release confidence;
  - printing env values, cookies, passwords, tokens, or response bodies would leak production secrets.
- Secret handling: names only; no values printed, copied, or stored.
- Fail-closed behavior: Security previously blocked the issue until `LUC-1766` bound the approved token alias; blocker is now resolved.
- Residual risk: Security has not proven the browser journey or token validity; QA/Test must run protected route/state/responsive/accessibility proof and fail closed on auth errors.

## Result Report
- Task summary: Security found the initial protected UI audit binding was partial, created [LUC-1766](/LUC/issues/LUC-1766), then verified the blocker-resolved runner now has the approved read-only app smoke token alias `PROD_UI_AUDIT_AUTH_TOKEN` present by name. The existing `PROD_UI_AUDIT_ADMIN_*` family remains limited to non-mutating admin-route proof.
- Files changed:
  - `history/tasks/luc-1761-bind-approved-soar-prod-protected-app-smoke-session-2026-06-03-task.md`
  - `history/evidence/luc-1761-protected-app-session-readiness-6839cd6b-2026-06-03.md`
  - `history/artifacts/luc-1761-protected-app-session-readiness-6839cd6b-2026-06-03.json`
  - `history/evidence/luc-1761-protected-app-session-approved-readiness-6839cd6b-2026-06-03.md`
  - `history/artifacts/luc-1761-protected-app-session-approved-readiness-6839cd6b-2026-06-03.json`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/module-confidence-ledger.md`
- How tested: protected input readiness checker and names-only env scan.
- What is incomplete: protected browser/API proof itself remains incomplete and belongs to QA/Test under [LUC-1756](/LUC/issues/LUC-1756).
- Next steps: QA/Test reruns [LUC-1756](/LUC/issues/LUC-1756) with `PROD_UI_AUDIT_AUTH_TOKEN` plus existing `PROD_UI_AUDIT_API_BASE_URL` and `PROD_UI_AUDIT_WEB_BASE_URL`; evidence must remain redacted.
- Decisions made: forbidden scope remains no subscription, API-key, trading/live setting, exchange setting, external service state, user real account state, or other production mutation.
