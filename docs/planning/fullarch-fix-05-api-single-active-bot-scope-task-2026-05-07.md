# FULLARCH-FIX-05 API Single Active Bot Scope Closure

## Header
- ID: FULLARCH-FIX-05
- Title: Repair API e2e root-suite failures around single active bot scope
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: FULLARCH-FIX-04
- Priority: P1
- Iteration: 2026-05-07-continuation-05
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the continuation sequence.
- [x] The task is aligned with repository source-of-truth documents.

## Context
After the Web navigation mock harness repair, the root workspace test suite
advanced to API e2e failures around bot market-group writes and order cleanup.
The failing tests were partly stale against the approved post-V1 contract:
one bot may have one enabled `ACTIVE` market scope and multiple enabled
strategy links inside that one scope.

## Goal
Restore root-suite validity by making the bot market-group API fail closed
with a controlled `409` for a second active scope, and align stale API e2e
fixtures to the canonical single-active-scope/multi-strategy architecture.

## Scope
- `apps/api/src/modules/bots/botMarketGroups.service.ts`
- `apps/api/src/modules/bots/bots.controller.ts`
- `apps/api/src/modules/bots/bots.errors.ts`
- API e2e fixtures/tests in bots, runtime-flow, and orders suites that still
  assumed multi-active-group bot topology or stale cleanup order.
- Source-of-truth task/context documentation.

## Success Signal
- User or operator problem: full local regression evidence is trustworthy
  again after the architecture audit repairs.
- Expected product or reliability outcome: API rejects duplicate active bot
  scopes safely and the root test suite reflects approved architecture.
- How success will be observed: root `pnpm run test -- --run` passes.
- Post-launch learning needed: no.

## Deliverable For This Stage
Completed implementation, validation evidence, self-review, and source-of-truth
sync for the API root-suite repair.

## Constraints
- Follow `docs/architecture/03_domain-model.md` and
  `docs/architecture/04_runtime-contexts.md`.
- Do not reopen multi-market-group bot architecture.
- Do not silently pause, archive, or choose a scope when a second active scope
  is requested.
- Preserve inactive/paused market-group CRUD where existing endpoints allow it.
- Do not change live-money behavior.

## Implementation Plan
1. Confirm architecture source of truth for bot topology.
2. Add domain-level duplicate active-scope validation before create/update.
3. Map the validation to a controlled HTTP `409`.
4. Update stale API e2e tests from multi-active-group assumptions to
   single-active-scope/multi-strategy fixtures.
5. Fix stale cleanup ordering in the manual PAPER market suite.
6. Re-run focused API failures, API typecheck, full workspace tests, lint, and
   repository guardrails.

## Acceptance Criteria
- Creating or updating a second enabled `ACTIVE` bot market group returns a
  controlled `409` instead of leaking a Prisma `500`.
- API e2e tests no longer model unsupported multi-active-group bot topology.
- Root workspace tests pass.
- API typecheck passes.
- No production live execution behavior is broadened.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` quality intent satisfied for this API slice.
- [x] Focused failing API pack passes.
- [x] Root workspace tests pass.
- [x] Typecheck/lint/guardrails/docs parity pass.
- [x] Source-of-truth docs updated.

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/bots/bots.e2e.test.ts src/modules/bots/bots.orchestration.e2e.test.ts src/modules/bots/bots.runtime-strategy-context.e2e.test.ts src/modules/engine/runtime-flow.e2e.test.ts src/modules/orders/orders-positions.e2e.test.ts src/modules/orders/orders.manual-paper-market.e2e.test.ts --sequence.concurrent=false --pool forks --poolOptions.forks.singleFork=true` => `6 passed`, `59 passed`.
  - `pnpm --filter api run typecheck` => PASS.
  - `pnpm run test -- --run` => PASS (`api: 174/174 files, 1163/1163 tests`; `web: 145/145 files, 482/482 tests`; mobile scaffold message only).
  - `pnpm run lint` => PASS.
  - `pnpm run quality:guardrails` => PASS.
  - `pnpm run docs:parity:check` => PASS.
  - `git diff --check` => PASS with LF/CRLF warnings only.
- Manual checks:
  - Confirmed architecture states one active bot market scope per bot and
    multiple strategy links inside that one scope.
- Screenshots/logs: not applicable.
- High-risk checks: no live-money, exchange execution, env, or DB schema change.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/03_domain-model.md`
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/README.md`
- Fits approved architecture: yes.
- Mismatch discovered: yes, stale tests assumed multi-active-group bot
  topology.
- Decision required from user: no, because the approved architecture already
  explicitly closes this scope.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence
- Deploy impact: low.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert this API/test slice if needed.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: duplicate active market-group writes leaked `500`; stale fixtures
  created multiple active market groups for one bot; one manual order fixture
  lacked wallet ownership proof; one cleanup omitted backtest rows.
- Gaps: root-suite evidence could not be trusted until API e2e failures were
  aligned with current architecture.
- Inconsistencies: tests contradicted the single-active-scope bot topology.
- Architecture constraints: fail closed instead of guessing or silently choosing
  one market scope.

### 2. Select One Priority Task
- Selected task: repair API e2e root-suite failures around single active bot
  scope.
- Priority rationale: this was the next local blocker after Web harness repair.
- Why other candidates were deferred: authenticated production readback still
  requires credentials.

### 3. Plan Implementation
- Files or surfaces to modify: bot market-group service/controller/errors and
  stale API e2e fixtures.
- Logic: preflight duplicate enabled `ACTIVE` scope writes and return `409`;
  use canonical auto-created group for active-scope tests; keep paused/inactive
  group CRUD where needed.
- Edge cases: update can also transition an inactive group into active state,
  so update needs the same duplicate check.

### 4. Execute Implementation
- Implementation notes: added `ACTIVE_BOT_MARKET_GROUP_DUPLICATE`; mapped to
  `bot already has an active market group`; aligned tests to one active group
  with multiple strategy links.

### 5. Verify and Test
- Validation performed: focused API pack, API typecheck, root workspace tests,
  lint, guardrails, docs parity, diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: update tests only. Rejected because the endpoint
  still leaked a `500` for a known domain conflict.
- Technical debt introduced: no.
- Scalability assessment: validation matches persistence invariant and makes
  the API behavior explicit before the DB constraint.
- Refinements made: preserved inactive/paused market-group CRUD to avoid
  over-tightening the existing endpoint surface.

### 7. Update Documentation and Knowledge
- Docs updated:
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.agents/state/known-issues.md`
  - `.agents/state/next-steps.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to continuation sequence.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Product / Discovery Evidence
- Problem validated: yes.
- User or operator affected: developers/operators relying on root regression
  evidence before production readback.
- Existing workaround or pain: root tests were red after Web was repaired.
- Smallest useful slice: close duplicate active-scope behavior and stale
  fixtures.
- Success metric or signal: root workspace tests pass.
- Feature flag, staged rollout, or disable path: not applicable.
- Post-launch feedback or metric check: not applicable.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not
  applicable.
- Critical user journey: bot configuration and runtime evidence validation.
- SLI: root workspace test pass.
- SLO: all local regression suites green before production readback closure.
- Error budget posture: not applicable.
- Health/readiness check: not applicable.
- Logs, dashboard, or alert route: not applicable.
- Smoke command or manual smoke: root workspace test suite.
- Rollback or disable path: revert this API/test slice.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: not applicable.
- Real API/service path used: yes, bot market-group HTTP e2e paths.
- Endpoint and client contract match: yes.
- DB schema and migrations verified: yes, no schema change; existing partial
  unique active-scope invariant respected.
- Loading state verified: not applicable.
- Error state verified: yes, duplicate active market scope returns `409`.
- Refresh/restart behavior verified: not applicable.
- Regression check performed: yes, focused API pack and root workspace suite.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable.
- Data classification: test/local user data only.
- Trust boundaries: ownership isolation tests remain in place.
- Permission or ownership checks: bot market-group tests cover owner/other user
  isolation.
- Abuse cases: second active scope fails closed instead of creating ambiguous
  runtime context.
- Secret handling: no secrets used.
- Security tests or scans: lint/typecheck/guardrails.
- Fail-closed behavior: yes.
- Residual risk: authenticated production readback still pending.

## Result Report
- Task summary: closed API root-suite failures by enforcing duplicate active
  bot scope as a controlled `409` and aligning stale tests to canonical
  single-active-scope/multi-strategy topology.
- Files changed: bot market-group API service/controller/errors, API e2e
  tests, and source-of-truth docs.
- How tested: focused API pack, API typecheck, full workspace tests, lint,
  guardrails, docs parity, diff check.
- What is incomplete: `LIVEIMPORT-03` production readback still requires
  authenticated read-only access.
- Next steps: execute `LIVEIMPORT-03` when credentials are available.
- Decisions made: preserve single-active-scope architecture and do not reopen
  multi-market-group bots.
