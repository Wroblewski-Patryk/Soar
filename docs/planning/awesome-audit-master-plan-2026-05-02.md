# AWESOME-AUDIT-01 Master Quality Audit Plan - 2026-05-02

## Header
- ID: AWESOME-AUDIT-01
- Title: qa(product): execute a full user-facing quality and integration audit map
- Task Type: research
- Current Stage: verification
- Status: DONE_WITH_FOLLOW_UP
- Owner: QA/Test + Review
- Depends on: V1CLOSEOUT-11
- Priority: P1
- Iteration: post-V1 confidence sweep
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected: define the full audit map before executing fixes.
- [x] Operation mode matches the requested work: TESTER, because the task is to challenge assumptions and find residual bugs.
- [x] The task is aligned with repository source-of-truth documents.

## Context
V1 is currently `GO` for the production-only release target. Fresh production
evidence exists for database restore, rollback proof, and the non-dry-run
production release gate.

The next quality step is not another release gate. It is a broader
operator-quality audit that verifies whether every user-facing workflow still
matches the approved architecture, frontend/backend contracts, runtime truth,
security posture, and UX quality bar.

## Goal
Create and then execute a complete audit program for Soar V1 so any remaining
bugs, inconsistencies, UX gaps, contract drift, or production-runtime blind
spots are found, prioritized, and converted into small implementation tasks.

## Success Signal
- User or operator problem: the operator wants confidence that the application is not only releasable, but excellent in daily use.
- Expected product or reliability outcome: every user-facing function is covered by a clear audit path and objective PASS/FAIL evidence.
- How success will be observed: final audit matrix lists each workflow, evidence, defects, risk, and follow-up task.
- Post-launch learning needed: yes.

## Deliverable For This Stage
A master audit plan with:
- audit list,
- user-facing surface map,
- frontend/backend integration checkpoints,
- validation commands and manual smoke paths,
- PASS evidence requirements,
- defect triage rules,
- execution order.

No production data mutations or code fixes are part of this planning stage.

## Scope
- Web routes under `apps/web/src/app`.
- Web feature modules under `apps/web/src/features`.
- API routes/controllers under `apps/api/src/router` and `apps/api/src/modules`.
- Runtime workers, OPS endpoints, production smoke evidence, and Coolify topology.
- Database integrity, Prisma schema, migrations, restore evidence, and key domain constraints.
- UX states, responsive behavior, accessibility, and operator clarity.
- Security, authorization, secrets, money-impacting operations, and fail-closed behavior.
- Documentation parity and architecture alignment.

## Implementation Plan
1. Read current project state, task board, architecture source-of-truth, and final V1 release evidence.
2. Map all visible web routes and API surfaces.
3. Define one audit per high-risk product layer or workflow cluster.
4. For every audit, define the expected evidence and blocker criteria.
5. Execute audits in order, starting with architecture/contract drift, then user journeys, then production-runtime verification.
6. Record findings as implementation tasks only after evidence exists.
7. Keep context docs synchronized after each meaningful audit result.

## Audit Execution Matrix

| ID | Audit | Primary Surfaces | Evidence Required | Exit Criteria |
| --- | --- | --- | --- | --- |
| AWESOME-01 | Architecture truth audit | `docs/architecture`, API modules, web feature contracts | Static review, route/API mapping, source-of-truth comparison | No hidden ownership drift or documented mismatch list exists |
| AWESOME-02 | Route and navigation audit | all `apps/web/src/app/**/page.tsx` routes | Build route list, auth/role expectation, browser smoke | Every route reaches expected state or has a defect ticket |
| AWESOME-03 | Auth/session E2E audit | login, register, logout, protected dashboard/admin/API | Automated/API checks, browser smoke, cookie/cache review | Session behavior works after fresh load and deploy cache boundaries |
| AWESOME-04 | Frontend/backend contract audit | web API clients, controllers, validation schemas | Payload/response comparison and focused contract tests | UI contracts match API validation and error shapes |
| AWESOME-05 | Dashboard runtime truth audit | dashboard home, runtime cards, streams, positions | API snapshot + stream parity, focused tests, browser checks | KPIs, PnL, prices, and runtime state agree across surfaces |
| AWESOME-06 | Bots full journey audit | bot list/create/edit/detail/preview/runtime/assistant | UI/API workflow checks and ownership validation | Bot context always resolves to wallet + market scope + strategy |
| AWESOME-07 | Manual orders and lifecycle audit | orders, positions, runtime, exchange sync | PAPER and LIVE-safe smoke, e2e tests, fail-closed checks | Open/close/history/attribution are consistent and safe |
| AWESOME-08 | Wallets and exchange keys audit | wallets, profile API keys, exchange probe | Secret-handling review, validation tests, UI smoke | No secret leak, correct ownership, correct exchange-boundary use |
| AWESOME-09 | Strategies, indicators, markets audit | strategies, indicators registry, markets | Registry/strategy API parity, UI create/edit smoke | Strategy and market scope truth is shared by backtest/runtime/UI |
| AWESOME-10 | Backtests and reports audit | backtest create/list/detail, reports | Focused e2e, lifecycle parity, UI result review | Backtest output matches approved lifecycle and report contracts |
| AWESOME-11 | UX states and polish audit | every major dashboard feature | loading/empty/error/success, responsive, a11y checks | No broken text/layout/state traps on desktop/tablet/mobile |
| AWESOME-12 | Security and abuse audit | auth, admin, OPS, money-impacting endpoints | SDL review, authz tests, rate-limit/origin checks | Protected surfaces fail closed and no bypass is found |
| AWESOME-13 | Production runtime audit | Coolify, API/web/workers, OPS endpoints | prod smoke, runtime freshness, rollback guard, logs/restarts | Production runtime remains healthy with current deployed commit |
| AWESOME-14 | Data integrity and migration audit | Prisma schema, migrations, restore, domain invariants | DB constraint review, restore evidence, focused tests | Data model enforces current architecture without stale uniqueness drift |
| AWESOME-15 | Final user acceptance matrix | all user-facing workflows | consolidated PASS/FAIL/RISK matrix | Every available user workflow has a current status and next action |

## User-Facing Surface Map

### Public And Auth
- `/`
- `/auth/login`
- `/auth/register`
- `/offline`

### Dashboard
- `/dashboard`
- `/dashboard/bots`
- `/dashboard/bots/create`
- `/dashboard/bots/new`
- `/dashboard/bots/runtime`
- `/dashboard/bots/assistant`
- `/dashboard/bots/[id]`
- `/dashboard/bots/[id]/edit`
- `/dashboard/bots/[id]/preview`
- `/dashboard/bots/[id]/runtime`
- `/dashboard/bots/[id]/assistant`
- `/dashboard/wallets`
- `/dashboard/wallets/list`
- `/dashboard/wallets/create`
- `/dashboard/wallets/[id]`
- `/dashboard/wallets/[id]/edit`
- `/dashboard/wallets/[id]/preview`
- `/dashboard/strategies/list`
- `/dashboard/strategies/create`
- `/dashboard/strategies/[id]`
- `/dashboard/strategies/[id]/edit`
- `/dashboard/markets/list`
- `/dashboard/markets/create`
- `/dashboard/markets/[id]/edit`
- `/dashboard/backtests/list`
- `/dashboard/backtests/create`
- `/dashboard/backtests/[id]`
- `/dashboard/exchanges`
- `/dashboard/logs`
- `/dashboard/profile`
- `/dashboard/reports`

### Admin
- `/admin`
- `/admin/users`
- `/admin/subscriptions`

## API Surface Map
- Auth: `apps/api/src/modules/auth`
- Dashboard: `apps/api/src/router/dashboard.routes.ts`
- Admin: `apps/api/src/router/admin.routes.ts`, `apps/api/src/modules/admin`
- Bots: `apps/api/src/modules/bots`
- Wallets: `apps/api/src/modules/wallets`
- Strategies and indicators: `apps/api/src/modules/strategies`
- Markets and market stream: `apps/api/src/modules/markets`, `apps/api/src/modules/market-stream`
- Backtests: `apps/api/src/modules/backtests`
- Orders and positions: `apps/api/src/modules/orders`, `apps/api/src/modules/positions`
- Logs and reports: `apps/api/src/modules/logs`, `apps/api/src/modules/reports`
- Profile, API keys, security, subscription: `apps/api/src/modules/profile`
- OPS and runtime: `apps/api/src/router/index.ts`, workers under `apps/api/src/workers`

## Acceptance Criteria
- The master audit list covers every user-facing route cluster and API module.
- Every audit defines what evidence proves PASS.
- The execution order starts with architecture and contract truth before UI polish.
- The plan forbids unverified fixes and temporary workarounds.
- Follow-up implementation work is split into small tasks only after audit evidence exists.

## Definition Of Done
- [x] Master audit plan exists in `docs/planning`.
- [x] User-facing route and API maps are captured.
- [x] Audit matrix includes architecture, UX, security, data, runtime, and production checks.
- [ ] Each audit is executed and linked to evidence.
- [ ] Final user acceptance matrix is published.

## Stage Exit Criteria
- [x] The output matches the declared `planning` stage.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- Implementing fixes before evidence exists.
- Weakening production OPS protections to make tests easier.
- Marking a workflow PASS based only on static code review when browser or API evidence is required.
- Creating duplicate contracts between frontend and backend.
- Treating stage as a V1 blocker; stage remains V2 infrastructure.

## Validation Evidence
- Tests: not run for this planning stage.
- Manual checks: route/API surfaces mapped from repository files.
- Screenshots/logs: not applicable for this planning stage.
- High-risk checks: production secret values are not required and must not be recorded.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/README.md`, `docs/architecture/architecture-source-of-truth.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no in planning stage.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: only if later audits discover mismatches.

## UX/UI Evidence
- Design source type: approved_snapshot.
- Design source reference: repository UX docs and current app implementation.
- Canonical visual target: current Soar dashboard design system.
- Fidelity target: structurally_faithful.
- Stitch used: no.
- Experience-quality bar reviewed: planned for AWESOME-11.
- Visual-direction brief reviewed: planned for AWESOME-11.
- Existing shared pattern reused: required during any later fixes.
- New shared pattern introduced: no.
- Design-memory update required: only if later fixes approve a new pattern.
- Required states: loading, empty, error, success.
- Responsive checks: desktop, tablet, mobile.
- Input-mode checks: touch, pointer, keyboard.
- Accessibility checks: keyboard navigation, focus visibility, labels, contrast, reduced layout shift.
- Parity evidence: to be captured during audit execution.

## Deployment / Ops Evidence
- Deploy impact: none for planning.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: not applicable.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: V1 is release-green, but product-quality confidence still needs route-by-route and workflow-by-workflow evidence.
- Gaps: no single consolidated user acceptance matrix currently covers every route and API workflow.
- Inconsistencies: previous evidence packets record many historical drifts; this plan requires fresh classification instead of relying on history.
- Architecture constraints: architecture docs remain source of truth; no workaround or duplicate ownership is allowed.

### 2. Select One Priority Task
- Selected task: define the full audit plan before executing fixes.
- Priority rationale: broad audits without a plan can create noisy, overlapping work; the plan makes follow-up tasks small and reversible.
- Why other candidates were deferred: individual fixes are deferred until audit evidence proves a specific defect.

### 3. Plan Implementation
- Files or surfaces to modify: this planning doc plus context queue files.
- Logic: document audit order, scope, and PASS evidence.
- Edge cases: production-only V1 scope, protected OPS auth, money-impacting LIVE operations, secrets.

### 4. Execute Implementation
- Implementation notes: planning artifact created; no runtime code changes.

### 5. Verify and Test
- Validation performed: repository route/API maps were read from source files.
- Result: planning evidence is sufficient for current stage.

### 6. Self-Review
- Simpler option considered: execute ad hoc tests immediately.
- Technical debt introduced: no.
- Scalability assessment: audit IDs allow follow-up tasks to be split without losing the global map.
- Refinements made: production-only scope and protected OPS constraints are explicit.

### 7. Update Documentation and Knowledge
- Docs updated: this planning doc.
- Context updated: required after this file is added.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to task risk.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached for planning stage.
- [ ] Relevant validations were run after context sync.
- [ ] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
- This plan intentionally does not mark all audits complete.
- The next execution slice should start with `AWESOME-01 Architecture Truth Audit`.
- Later browser-based audits should use production-safe or local-prod-like data paths and must not mutate LIVE exchange state without explicit operator approval.

## Production-Grade Required Contract

### Goal
Execute a complete post-V1 quality audit program that proves or disproves the current product-quality claim.

### Scope
Exact scope is the `Audit Execution Matrix`, `User-Facing Surface Map`, and `API Surface Map` above.

### Implementation Plan
Execute `AWESOME-01..15` in order, recording evidence and converting only confirmed findings into implementation tasks.

### Acceptance Criteria
All user-facing workflows are classified as PASS, FAIL, or RISK with evidence.

### Definition of Done
This master planning task is done when the audit plan and context queue are recorded. The full audit program is done only after all audit IDs are executed.

### Result Report
- Task summary: created and executed the master plan for full post-V1 product-quality verification.
- Files changed: this planning document, execution report, remediation plan, and context files.
- How tested: see `docs/operations/awesome-audit-execution-report-2026-05-02.md`.
- What is incomplete: one QA reliability follow-up remains for imported position history hydrator test isolation.
- Next steps: implement `AWESOME-FIX-01`.
- Decisions made: V1 remains production-only; stage is not a V1 audit blocker.
