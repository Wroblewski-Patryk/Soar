# Task

## Header
- ID: PROD-UI-LEGACY-DASHBOARD-REDIRECTS-2026-05-24
- Title: Restore production legacy dashboard redirects
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Depends on: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Priority: P0
- Module Confidence Rows: SOAR-UX-A11Y-MOBILE-001, SOAR-DASHBOARD-001, SOAR-OPERATIONS-001
- Requirement Rows: REQ-FUNC-019, REQ-FUNC-021
- Quality Scenario Rows: QA-019, QAS-FULL-READINESS-2026-05-23
- Risk Rows: RISK-FULL-READINESS-2026-05-23
- Iteration: 2026-05-24
- Operation Mode: TESTER
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: PARTIALLY_VERIFIED

## Context
The production UI module clickthrough audit for deployed `380308d1` found that `/dashboard/exchanges`, `/dashboard/orders`, and `/dashboard/positions` returned `404` instead of redirecting to their canonical replacement surfaces.

## Goal
Restore legacy route redirects at the dashboard middleware boundary and verify the fix locally and on production after one controlled push.

## Success Signal
- User or operator problem: production protected UI audit fails on legacy dashboard routes.
- Expected product or reliability outcome: old dashboard links route to canonical profile/runtime surfaces instead of 404.
- How success will be observed: production UI module clickthrough passes on the deployed fix SHA.
- Post-launch learning needed: yes

## Deliverable For This Stage
Verified middleware redirect fix, deployed once, with production proof artifacts.

## Constraints
- do not touch live exchange actions
- avoid repeated push/deploy churn
- keep the fix limited to Web middleware routing
- preserve unauthenticated redirect-to-login behavior

## Definition of Done
- [x] Authenticated legacy routes redirect to canonical replacements.
- [x] Unauthenticated protected legacy routes still redirect to login.
- [x] Local focused and broad Web validation passes.
- [x] One controlled commit/push deploys the fix.
- [x] Production UI clickthrough passes on the new SHA.

## Forbidden
- LIVE order, cancel, close, or exchange-side mutation
- broad UI redesign
- weakening auth middleware
- repeated deployment triggers

## Validation Evidence
- Tests:
  - `corepack pnpm --filter web exec vitest run src/middleware.test.ts` PASS (`4/4`)
  - `corepack pnpm --filter web run typecheck` PASS
  - `corepack pnpm --filter web run lint` PASS
  - `corepack pnpm --filter web run test -- --run src/middleware.test.ts src/app/dashboard/bots/runtime/page.test.tsx src/app/dashboard/profile/page.test.tsx` PASS (`150` files / `535` tests)
  - `corepack pnpm run quality:guardrails` PASS
  - `corepack pnpm run architecture:graph:drift:strict` PASS (`796/796`, `0` missing)
  - `git diff --check` PASS with line-ending warnings only
- Production checks:
  - Commit `0b7eb4c6e0767ce1d51b3ff68f0229f899781d31` pushed to `main`.
  - Web build-info wait PASS after deployment.
  - Public deploy smoke PASS: API `/health`, API `/ready`, Web `/`.
  - `history/plans/prod-ui-module-clickthrough-0b7eb4c6-2026-05-24.md` PASS.
  - `history/evidence/prod-auth-session-browser-proof-0b7eb4c6-2026-05-24.md` PASS.
  - `history/evidence/prod-security-exchange-proof-0b7eb4c6-2026-05-24.md` PARTIAL: read-only exchange/security checks passed through Gate.io catalog, then blocked on protected ops readiness `401`.
- High-risk checks: no LIVE exchange mutation; no raw secrets written to artifacts
- Reality status: verified for UI redirects; partially verified for broader protected security/exchange proof

## Architecture Evidence
- Architecture source reviewed: dashboard route map and active production proof artifacts.
- Fits approved architecture: yes
- Mismatch discovered: legacy route expectations existed in production audit but middleware no longer redirected them.
- Decision required from user: no
- Approval reference if architecture changed: no architecture change; route compatibility fix only
- Follow-up architecture doc updates: none required; strict graph drift remains zero.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: not required
- Rollback note: revert commit `0b7eb4c6` if legacy redirects regress protected routing
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Production UI audit failed only on three legacy routes.
- Auth and admin route proof were otherwise successful.

### 2. Select One Priority Mission Objective
- Fix the production UI audit blocker before further protected release claims.

### 3. Plan Implementation
- Add middleware mapping for removed legacy dashboard paths after auth-cookie gate.
- Update middleware tests.

### 4. Execute Implementation
- Added `/dashboard/exchanges -> /dashboard/profile#api`.
- Added `/dashboard/orders -> /dashboard/bots/runtime?legacy=orders`.
- Added `/dashboard/positions -> /dashboard/bots/runtime?legacy=positions`.

### 5. Verify and Test
- Local and production checks listed above passed.

### 6. Self-Review
- Simpler option considered: recreate page files; rejected because middleware is already the protected dashboard routing boundary and avoids duplicate page shells.
- Technical debt introduced: no
- Scalability assessment: mapping is small, explicit, and covered by tests.

### 7. Update Documentation and Knowledge
- Docs updated: task and state files.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
