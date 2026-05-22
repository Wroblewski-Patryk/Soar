# Task

## Header
- ID: `FRONTEND-SECURITY-UX-OWASP-SWEEP-2026-05-21`
- Title: Frontend OWASP security and UX sweep
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Security
- Priority: P1
- Module Confidence Rows: `SOAR-SECURITY-PRIVACY-001`, `SOAR-PROFILE-API-KEYS-001`, `SOAR-AUTH-001`, `SOAR-MANUAL-ORDERS-001`
- Requirement Rows: `REQ-SEC-FRONTEND-OWASP`
- Quality Scenario Rows: `QA-SEC-FRONTEND-OWASP`
- Risk Rows: `RISK-FRONTEND-SECRET-EXPOSURE`
- Iteration: 2026-05-21
- Operation Mode: BUILDER
- Mission ID: `FRONTEND-SECURITY-UX-OWASP-SWEEP-2026-05-21`
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the selected builder iteration.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was covered by the existing active mission packet and this bounded child task.
- [x] Missing or template-like state tables were confirmed not needed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence by closing frontend security exposure paths.

## Mission Block
- Mission objective: audit the Web frontend against OWASP Top 10 / cheat-sheet concerns named by the operator, then repair only confirmed local defects with focused tests.
- Release objective advanced: local commercial-readiness hardening for protected frontend surfaces.
- Included slices: auth bootstrap, protected data flash checks, admin gating, CSP/security headers, secret/error exposure, local/session storage usage, CSRF-sensitive UI calls, clickjacking/HSTS assumptions, and money-action confirmations.
- Explicit exclusions: backend implementation changes except contract/type understanding, production penetration testing, protected production proof, live-money or exchange-side mutation.
- Checkpoint cadence: one bounded implementation checkpoint with focused Web validation.
- Stop conditions: architecture mismatch, backend-only defect requiring product decision, protected credentials, overlapping edits that make frontend repair unsafe.
- Handoff expectation: status, findings, files changed, tests run, residual risks.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | `AGENTS.md`, active mission, project state | Task framing, integration, source-of-truth updates | This task packet and final report | Focused validation | VERIFIED |
| Frontend Security/UX | Active chat | OWASP Top 10, OWASP cheat sheets, secure lifecycle | `apps/web` auth, admin, headers, profile, runtime/money UI | Findings and repairs | Focused Vitest + typecheck | VERIFIED |
| Documentation/Memory | Active chat | Project state files | Planning/context updates | Evidence and residual risk | Guardrail-compatible docs | VERIFIED |

## Context
The prior `SECURITY-RED-TEAM-HARDENING-2026-05-21` mission already closed several local frontend security items. This task is a fresh, narrower Web security/UX sweep requested by the operator with OWASP framing.

## Goal
Confirm whether the frontend still has exploitable or regression-prone defects in the requested areas. Repair confirmed Web defects and lock them with focused tests.

## Scope
- `apps/web/src/context/AuthContext.tsx`
- `apps/web/src/middleware.ts`
- `apps/web/next.config.ts`
- `apps/web/src/features/admin/**`
- `apps/web/src/features/profile/**`
- `apps/web/src/features/dashboard-home/**`
- `apps/web/src/lib/errorResolver.ts`
- Focused Web tests for touched files.

## Implementation Plan
1. Audit code paths for auth bootstrap/data flashes, admin gates, security headers, storage, error messages, mutation methods, and money confirmations.
2. Fix only confirmed defects in Web.
3. Add focused regression tests that fail on the old behavior.
4. Run focused Web tests and Web typecheck.
5. Update planning/context state with evidence.

## Acceptance Criteria
- Confirmed frontend defects are repaired without backend edits.
- Sensitive backend error messages are not surfaced in production UI paths touched by profile security/API-key forms.
- API-key response normalization does not retain raw returned credentials in frontend state.
- Existing auth/admin/header/money confirmation findings are either verified or recorded as residual risk.
- Focused tests and Web typecheck pass.

## Definition of Done
- [x] Code repair is complete.
- [x] Focused tests pass.
- [x] Web typecheck passes.
- [x] Source-of-truth files record evidence and residual risks.

## Forbidden
- Backend behavior changes.
- Live-money, production mutation, or exchange-side mutation.
- New security framework or parallel auth path.
- Temporary bypasses or client-only authorization claims.

## Security / Privacy Evidence
- Data classification: credentials, session-authenticated user data, admin metadata, trading/money-action context.
- Trust boundaries: browser state, API responses, cookie-authenticated API calls, production response headers.
- Permission or ownership checks: API remains authoritative; Web must avoid rendering protected/admin data before confirmed auth/role.
- Abuse cases: backend raw error leaks, raw API-key response regression, stale unauthenticated runtime load, admin shell flash, missing money confirmation.
- Secret handling: no secret values captured; tests use synthetic values only.
- Security tests or scans: focused Web tests, broader Web security regression pack, Web typecheck, and `git diff --check` passed.
- Fail-closed behavior: profile API-key response normalization now drops unmasked returned credential values; production profile/security form axios errors route through the shared redaction resolver.
- Residual risk: external pentest, production header readback, protected `AUD-19`, and backend-owned CSRF/trusted-origin enforcement remain separate gates.

## Result Report
- Task summary: verified auth bootstrap, protected data flash guards, admin gating, CSP/header assumptions, storage usage, CSRF-sensitive UI call shape, clickjacking/HSTS headers, and money-action confirmations. Repaired confirmed frontend exposure defects in profile API-key response normalization and profile/security error presentation.
- Findings fixed: unmasked `apiKey` values returned by a backend regression are no longer retained as display state; raw production axios messages in API-key connection-test and Profile Security flows now go through shared UI error redaction.
- Files changed: `apps/web/src/features/profile/services/apiKeys.service.ts`, `apps/web/src/features/profile/services/apiKeys.service.test.ts`, `apps/web/src/features/profile/components/ApiKeyForm.tsx`, `apps/web/src/features/profile/components/ApiKeyForm.test.tsx`, `apps/web/src/features/profile/components/Security.tsx`, `apps/web/src/features/profile/components/Security.test.tsx`, and this task packet.
- How tested: `pnpm --filter web run test -- src/features/profile/services/apiKeys.service.test.ts src/features/profile/components/ApiKeyForm.test.tsx src/features/profile/components/Security.test.tsx src/lib/errorResolver.test.ts --run` passed (`4` files / `28` tests); `pnpm --filter web run test -- next.config.test.ts src/middleware.test.ts src/features/admin/layout/AdminLayoutShell.test.tsx src/app/dashboard/dashboard.a11y.smoke.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.open-orders-actions.test.tsx src/features/dashboard-home/hooks/useCloseRuntimePositionAction.test.tsx src/features/dashboard-home/hooks/useManualOrderController.test.tsx --run` passed (`7` files / `23` tests); `pnpm --filter web run typecheck` passed; `git diff --check` passed with line-ending warnings only.
- What is incomplete: no backend changes, no production mutation, no browser route proof, no external pentest, and no current protected `AUD-19` execution were in scope.
- Next steps: rerun protected production proof when approved inputs exist and keep production header readback/external VPS review as separate release gates.
