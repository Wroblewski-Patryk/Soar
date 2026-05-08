# PROD-UI-PUBLIC-ACCESS-CLICKTHROUGH Task (2026-05-08)

## Header
- ID: `PROD-UI-PUBLIC-ACCESS-CLICKTHROUGH-2026-05-08`
- Title: Verify production public access routes and protected redirects
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on:
  - `PROD-UI-AUDIT-PLAN-2026-05-08`
- Priority: P0
- Iteration: V1 production hardening
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode is TESTER because this is production evidence.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The full production UI module clickthrough audit is planned but blocked on
latest deploy freshness and authenticated/admin app access. The public access
portion can still be verified safely without auth.

## Goal
Capture production evidence for public routes and unauthenticated protected
route behavior without claiming protected dashboard/admin module coverage.

## Success Signal
- User or operator problem: production public access must be healthy before a
  full authenticated module audit.
- Expected product or reliability outcome: public routes load, protected routes
  fail closed to auth, and stale build-info is explicitly recorded.
- How success will be observed: operation evidence report and JSON artifact.
- Post-launch learning needed: no

## Deliverable For This Stage
HTTP reachability/redirect evidence for public and protected unauthenticated
routes.

## Constraints
- no authenticated dashboard/admin coverage in this slice
- no screenshots in this slice
- no production mutation
- do not mark protected flows as PASS beyond auth gating
- latest `main` build-info freshness remains a blocker for full audit

## Scope
- Public/access routes:
  - `/`
  - `/auth/login`
  - `/auth/register`
  - `/offline`
  - `/api/build-info`
- Protected unauthenticated routes:
  - `/dashboard`
  - `/dashboard/profile`
  - `/dashboard/wallets/list`
  - `/dashboard/markets/list`
  - `/dashboard/strategies/list`
  - `/dashboard/backtests/list`
  - `/dashboard/bots`
  - `/dashboard/reports`
  - `/dashboard/logs`
  - `/admin`
  - `/admin/users`
  - `/admin/subscriptions`
- Artifacts:
  - `docs/operations/prod-ui-public-access-clickthrough-2026-05-08.md`
  - `docs/operations/_artifacts-prod-ui-public-access-clickthrough-2026-05-08.json`

## Implementation Plan
1. Use Node `fetch` to request public routes and protected routes with redirects
   disabled where useful.
2. Record status code, redirect location, final URL, and high-level outcome.
3. Write JSON and Markdown evidence artifacts.
4. Update planning/context state.
5. Run docs/guardrail validation.

## Acceptance Criteria
- Public routes return 2xx/3xx acceptable responses.
- Protected dashboard/admin routes redirect to auth or otherwise fail closed.
- Build-info current SHA is recorded.
- Latest-main deploy freshness is not misreported as passing when stale.
- Full authenticated audit remains blocked until auth/deploy prerequisites.

## Definition of Done
- [x] Evidence artifacts written.
- [x] Protected-flow limitation recorded.
- [x] Source-of-truth queue updated.
- [x] Validation evidence recorded.

## Stage Exit Criteria
- [x] Output matches verification stage.
- [x] No authenticated or destructive work was mixed in.
- [x] Risks and assumptions are stated clearly.

## Forbidden
- bypassing auth
- treating login redirects as module-function PASS
- live-money actions
- destructive production actions
- screenshots containing user data

## Validation Evidence
- Tests:
  - `node scripts/repoGuardrails.mjs` => PASS
  - `node scripts/checkDocsParity.mjs` => PASS
  - `git diff --check` => PASS (line-ending warnings only)
- Manual checks:
  - public route probe => PASS (`/`, `/auth/login`, `/auth/register`,
    `/offline`, `/api/build-info` returned HTTP 200)
  - API smoke subset => PASS (`/health`, `/ready` returned HTTP 200)
  - protected unauthenticated route probe => PASS_AUTH_REDIRECT (dashboard and
    admin routes returned HTTP 307 to `/auth/login`)
  - build-info freshness check => BLOCKED; observed
    `d0dc6459e5fa33a8e5f68c5fc36dd29cc1df440d`, expected prefix `373a0ceb`
- Screenshots/logs:
  - no screenshots in this slice
- High-risk checks:
  - no authenticated session used
  - no writes performed

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/reference/dashboard-route-map.md`
  - `docs/planning/prod-ui-module-clickthrough-audit-plan-2026-05-08.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: route/access contract only
- Required states: public loading and protected unauthenticated access
- Responsive checks: not covered in this slice
- Input-mode checks: not covered in this slice
- Accessibility checks: not covered in this slice
- Parity evidence: HTTP route and redirect evidence only

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: docs/evidence-only commit
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: latest pushed `main` is not yet visible in production build-info.
- Gaps: full UI audit remains auth/admin blocked.
- Inconsistencies: public route health can be independently verified now.
- Architecture constraints: protected routes must remain behind auth.

### 2. Select One Priority Task
- Selected task: public access clickthrough evidence.
- Priority rationale: it is the largest honest production UI slice available
  without auth.
- Why other candidates were deferred: authenticated module clickthrough needs
  app credentials and deployed freshness.

### 3. Plan Implementation
- Files or surfaces to modify: operations evidence and context docs.
- Logic: route reachability/redirect classification.
- Edge cases: stale deploy, redirects, protected route auth behavior.

### 4. Execute Implementation
- Implementation notes: evidence generated with read-only HTTP probes.

### 5. Verify and Test
- Validation performed: read-only public HTTP route probe with network access,
  repository guardrails, docs parity, and diff check.
- Result: public/access routes pass, protected routes fail closed to auth, and
  deploy freshness remains blocked on stale build-info.

### 6. Self-Review
- Simpler option considered: only run deploy smoke.
- Technical debt introduced: no
- Scalability assessment: artifact complements the later full browser audit.

### 7. Update Documentation and Knowledge
- Docs updated: task, operations evidence, queue/context.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant repository validations were run.
- [x] Docs or context updated.

## Result Report
- Task summary: capture public route and protected unauthenticated route
  evidence for production UI.
- Files changed: task, operations evidence, and queue/context docs.
- How tested: public HTTP probes against `https://soar.luckysparrow.ch` and
  `https://api.soar.luckysparrow.ch`; `node scripts/repoGuardrails.mjs`;
  `node scripts/checkDocsParity.mjs`; `git diff --check`.
- What is incomplete: authenticated module clickthrough, admin clickthrough,
  responsive screenshots, and function-level clicking remain blocked.
- Next steps: deploy latest `main`, obtain app auth/admin access, then execute
  the full UI module audit plan.
