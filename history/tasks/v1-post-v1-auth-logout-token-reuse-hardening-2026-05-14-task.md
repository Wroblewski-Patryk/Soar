# V1 Post-V1 Auth Logout Token Reuse Hardening

## Header

- ID: V1-POST-V1-AUTH-LOGOUT-TOKEN-REUSE-HARDENING-2026-05-14
- Title: Invalidate reused JWT sessions on logout
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder + QA/Test
- Depends on: `V1-POST-V1-RELEASE-CONFIDENCE-ROW-CLOSURE-2026-05-14`
- Priority: P0
- Module Confidence Rows: `SOAR-AUTH-001`
- Requirement Rows: auth/session lifecycle
- Quality Scenario Rows: security, fail-closed auth, production proof
- Risk Rows: `RISK-004`
- Iteration: 2026-05-14-post-v1-hardening
- Operation Mode: BUILDER
- Mission ID: POST-V1-AUTH-HARDENING
- Mission Status: PARTIALLY_VERIFIED

## Process Self-Audit

- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches this continuation slice.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed.
- [x] Missing or template-like state tables were not found in this scope.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence with a real production-discovered
  auth gap.

## Mission Block

- Mission objective: Close the auth session reuse gap found by production
  browser/API proof.
- Release objective advanced: Post-V1 hardening reduces residual auth/session
  risk for the current production-grade release line.
- Included slices: production-safe proof runner, failing production proof
  capture, server-side logout invalidation, focused tests, state updates.
- Explicit exclusions: account deletion, password change flows, broad auth
  redesign, deploy, secret storage, or production data mutation beyond normal
  login/logout proof.
- Checkpoint cadence: record failing proof, implement fix, validate locally,
  leave deploy/prod rerun status explicit.
- Stop conditions: any token/credential artifact leak, failing focused tests,
  or architecture mismatch.
- Handoff expectation: next agent can deploy/rerun production auth proof when
  the fixed build is deployed.

## Context

The new production auth browser/API proof against deployed `2fc90a08` passed
browser route checks but failed `auth me after logout fails closed`: direct
reuse of the pre-logout JWT still returned `200`. Browser state was safe after
cookie clearing, but token replay stayed valid until expiry. Existing auth
code already uses `sessionVersion` to reject stale tokens, so the fix should
reuse that mechanism.

## Goal

Make logout invalidate the currently authenticated session token server-side so
manual reuse of the same JWT no longer authenticates after logout.

## Scope

- `scripts/runProdAuthSessionBrowserProof.mjs`
- `package.json`
- `apps/api/src/modules/auth/auth.controller.ts`
- `apps/api/src/modules/auth/auth.e2e.test.ts`
- Source-of-truth state files for Auth/Risk/System Health after validation

## Implementation Plan

1. Add a redacted production auth browser/API proof runner.
2. Run the proof against current production build-info.
3. If proof fails, inspect auth lifecycle code and tests.
4. Reuse `sessionVersion` on logout to invalidate matching verified tokens.
5. Add regression coverage for stale JWT reuse after logout and re-login.
6. Run focused auth/middleware tests and repository guardrails.
7. Record production rerun status explicitly.

## Acceptance Criteria

- Production proof artifact records the pre-fix failure without secrets.
- Logout increments the authenticated user's `sessionVersion` for the matching
  verified token.
- Reusing the pre-logout JWT returns `401`.
- Re-login creates a valid session after logout.
- Focused auth tests pass.

## Definition Of Done

- Code and tests are updated.
- Validation evidence is recorded.
- Source-of-truth files reflect fixed-local / pending-deploy production state.
- No credentials, cookies, tokens, or response bodies are written to artifacts.

## Forbidden

- Do not add token blacklists or a parallel session subsystem.
- Do not store tokens in proof artifacts.
- Do not mutate unrelated auth/profile behavior.

## Result Report

Status: `partially verified`.

Initial production proof:

- `history/evidence/prod-auth-session-browser-proof-2fc90a08-2026-05-14.md`
  failed on current production build `2fc90a08`.
- Passing steps: build freshness, auth token resolution, unauthenticated
  dashboard redirect, authenticated dashboard render, invalid-token
  `session=expired` redirect, logout API `200`, dashboard after logout redirect.
- Failing step: direct `/auth/me` using the pre-logout token returned `200`.

Implementation:

- `logout` now reuses verified auth-token candidates and increments the
  matching user's `sessionVersion` before clearing cookies.
- Auth e2e coverage now verifies stale-token reuse after logout returns `401`
  and that re-login creates a valid new session.

Validation:

- PASS: `node --check scripts/runProdAuthSessionBrowserProof.mjs`.
- PASS: `pnpm --filter api exec vitest run src/modules/auth/auth.e2e.test.ts src/middleware/requireAuth.test.ts src/middleware/requireTrustedOrigin.test.ts` (`21/21`).
- PASS: `pnpm --filter api run typecheck`.
- PASS: `pnpm run typecheck`.
- PASS: `pnpm run lint`.
- PASS: `pnpm run build`.
- PASS: `pnpm run quality:guardrails`.
- PASS: `git diff --check` with LF-to-CRLF warnings only.
- PASS: known raw temporary credential scan over touched files and proof
  artifacts returned no matches.
- PASS: `chrome-headless-shell` process check returned no validation browser
  process.
- Production rerun status: completed by
  `V1-POST-V1-AUTH-DEPLOY-RERUN-2026-05-14`. The fixed build `84711599` is
  deployed and `history/evidence/prod-auth-session-browser-proof-84711599-2026-05-14.md`
  passed, including stale-token `/auth/me` `401` after logout.
