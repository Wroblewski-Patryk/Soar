# LUC-5634 Account Access Proof Slice

## Header
- ID: LUC-5634
- Title: Account Access Proof Slice
- Task Type: verification
- Current Stage: verification
- Status: DONE
- Owner: 09 QVE (QA & Verification Engineer)
- Parent: [LUC-5622](/LUC/issues/LUC-5622)
- Priority: P1
- Mission ID: LUC-5634-ACCOUNT-ACCESS-PROOF-SLICE-2026-06-27
- Mission Status: VERIFIED_LOCAL_WITH_EXISTING_PRODUCTION_BROWSER_PROOF

## Context
[LUC-5622](/LUC/issues/LUC-5622) routed `KS-LANE-01` from the refreshed
app-completion backlog. The Account access flow required focused proof for
login, logout, `/auth/me`, registration, session cookie/JWT behavior,
protected auth failure states, and current automated proof links.

## Goal
Prove the current Account access slice with the smallest sufficient local
regression checks and bind it to existing redaction-safe production browser
evidence, without protected production mutation.

## Scope
- API auth route and session behavior tests.
- API auth cookie, JWT, session-token, and `requireAuth` middleware tests.
- Web auth/session, middleware redirect, login, register, and auth form tests.
- Existing production auth-session browser proof from [LUC-5596](/LUC/issues/LUC-5596).
- Source-of-truth state updates for the proof lane.

## Constraints
- No push, deploy, restart, protected smoke, secret readback, production
  account mutation, production DB/Redis mutation, payment/subscription
  mutation, exchange action, order, position, or live-trading action.
- No secret values, cookies, tokens, private headers, or response bodies may be
  written to repo artifacts.
- Existing mixed dirty and divergent worktree must not be reverted or committed
  by this QA heartbeat.

## Implementation Plan
1. Read the parent known-state baseline and current Account access queue.
2. Start only local Postgres/Redis if needed for DB-backed auth tests.
3. Run focused API auth tests.
4. Run focused Web auth/session tests.
5. Reuse current same-day redaction-safe production auth browser proof as
   browser-route evidence instead of rerunning protected production proof.
6. Record evidence, cleanup local runtime, and close the Paperclip issue.

## Acceptance Criteria
- API login/logout/me/register/session behavior proof passes locally.
- API cookie/JWT/session-token/auth middleware proof passes locally.
- Web login/register/AuthContext/middleware protected-route proof passes
  locally.
- Browser proof is recorded with protected-input constraints explicit.
- Source-control and deploy impact are explicit.

## Definition Of Done
- [x] Focused API auth proof passed.
- [x] Focused Web auth/session proof passed.
- [x] Browser-route proof reference recorded.
- [x] Runtime cleanup performed for task-owned local services.
- [x] Source-of-truth ledgers updated.
- [x] Paperclip disposition can be set to `done`.

## Forbidden
- New auth architecture or product behavior changes.
- Temporary bypasses or mock-only proof claims.
- Production mutation or protected secret disclosure.
- Commit, push, deploy, rollback, or restart.

## Validation Evidence

### API Auth Proof
- Command:
  `pnpm --filter api exec vitest run src/modules/auth/auth.cookie.test.ts src/modules/auth/auth.errors.test.ts src/modules/auth/auth.jwt.test.ts src/modules/auth/auth.session.test.ts src/modules/auth/sessionToken.test.ts src/middleware/requireAuth.test.ts src/modules/auth/auth.e2e.test.ts src/modules/auth/auth.service.test.ts --run --reporter=dot`
- Result: PASS.
- Files: `8` passed.
- Tests: `34` passed.
- Coverage represented:
  registration, duplicate registration failure, password validation,
  login session cookie TTL, remember-me cookie TTL, `/auth/me`, logout,
  stale/deleted/expired sessions, JWT secret rotation behavior, auth cookie
  options, session token extraction, and `requireAuth` fail-closed paths.

### Web Auth Proof
- Initial command issue:
  unquoted PowerShell path `src/app/(public)/auth/...` failed before Vitest
  because `(public)` was parsed as shell syntax. This is classified as command
  quoting failure, not product failure.
- Rerun command:
  `pnpm --filter web exec vitest run src/middleware.test.ts src/lib/api.test.ts src/context/AuthContext.test.tsx src/features/auth/components/LoginForm.test.tsx src/features/auth/components/RegisterForm.test.tsx src/features/auth/hooks/useLoginForm.test.tsx src/features/auth/hooks/useRegisterForm.test.tsx src/features/auth/types/form.types.test.ts 'src/app/(public)/auth/authPageCacheContract.test.ts' --run --reporter=dot`
- Result: PASS.
- Files: `9` passed.
- Tests: `34` passed.
- Coverage represented:
  protected dashboard redirect behavior, API `401` session-expired handling,
  AuthContext bootstrap/refetch/logout behavior, login/register form behavior,
  login/register hooks, auth form types, and public auth page cache contract.
- Residual warning:
  login/register server-render tests emit existing i18n fallback warnings for
  `auth.forms.*` keys under route `/`; tests still pass and this heartbeat did
  not change copy or i18n routing.

### Browser / Production Proof Reference
- Existing same-day evidence:
  `history/evidence/luc-5596-prod-auth-session-browser-proof-2026-06-27.md`.
- Result: PASS on deployed
  `42177530f2a2ddc22832133b545bccab6ab404eb`.
- Covered:
  unauthenticated protected route redirects to login, authenticated dashboard
  renders, invalid token redirects to `/auth/login?session=expired`, logout
  returns `200`, `/auth/me` after logout returns `401`, and dashboard after
  logout redirects to login.
- Redaction:
  the artifact records route/status summaries only and does not store auth
  tokens, passwords, cookies, private headers, or response bodies.

## Runtime Cleanup
- Local runtime started by this heartbeat:
  `docker compose up -d postgres redis`.
- Reason:
  API auth e2e/service tests require local Postgres.
- Cleanup:
  task-owned Compose services were stopped with `docker compose down` before
  final issue closure.

## Architecture / Product Alignment
- Architecture mismatch: none found.
- New architecture/doc pattern: none.
- Product behavior changed: no.
- Reuse check:
  reused existing auth/API/Web tests and existing production proof artifacts;
  no duplicate verification framework introduced.

## Source-Control Posture
- Repo: `C:\Personal\Projekty\Aplikacje\Soar`.
- Branch: `main...origin/main` is `ahead 14, behind 1`.
- Worktree:
  pre-existing mixed dirty state from same-day evidence and runtime/test lanes.
- Files changed by this heartbeat:
  this task artifact plus source-of-truth state/context rows.
- Commit:
  not created because the worktree is shared, mixed dirty, and divergent.
- Push:
  not authorized and not safe from the current branch/worktree posture.
- Deploy impact:
  none.

## Result Report
- Task summary:
  Account access proof slice is verified locally and linked to current
  production browser-session evidence.
- Status:
  `DONE / VERIFIED_LOCAL / EXISTING_PRODUCTION_BROWSER_PROOF_LINKED`.
- Residual risk:
  app-completion still has broad missing-test/doc rows beyond this focused
  account-access proof slice; release-grade provenance and protected input
  completeness remain separate Security/Ops/release owner gates.
- Next owner/action:
  no [LUC-5634](/LUC/issues/LUC-5634) follow-up is required unless a future
  architecture/app-completion refresh finds a new exact Account access gap.
