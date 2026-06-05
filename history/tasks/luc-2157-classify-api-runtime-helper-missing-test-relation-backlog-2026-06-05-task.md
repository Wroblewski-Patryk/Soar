# Task

## Header
- ID: LUC-2157
- Title: [Soar][Architecture Repair][QA] Classify API/runtime helper missing-test relation backlog
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: [LUC-2152](/LUC/issues/LUC-2152)
- Priority: P1
- Module Confidence Rows: api-auth; api-bots; api-engine; api-root; Architecture Evidence Graph
- Requirement Rows: REQ-DOC-029; REQ-DOC-030
- Quality Scenario Rows: not applicable
- Risk Rows: RISK-DOC-005
- Iteration: 2026-06-05
- Operation Mode: TESTER
- Mission ID: LUC-2157-API-RUNTIME-HELPER-MISSING-TEST-RELATION-BACKLOG-2026-06-05
- Mission Status: VERIFIED_WITH_LOCAL_DB_BLOCKER

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches this QA/Test Automation assignment.
- [x] The task is aligned with repository source-of-truth documents.
- [x] Affected module confidence rows were identified.
- [x] The issue's protected production boundary was preserved.
- [x] Missing local DB infrastructure was recorded as a verification blocker, not hidden as a test failure.

## Mission Block
- Mission objective: classify current API/runtime helper missing-test relation samples as existing local proof, direct relation backlog, true focused-test candidates, or protected-production proof gaps.
- Release objective advanced: Architecture Evidence Graph and API/runtime test confidence.
- Included slices: report readback, architecture-health sample classification, API test inventory review, focused local pure-helper proof, local DB-backed proof attempt, graph drift proof, state update, issue closure.
- Explicit exclusions: code changes, runtime behavior changes, route behavior changes, deploy, restart, rollback, database mutation, protected smoke, account action, secret readback, exchange mutation, or live-trading action.
- Checkpoint cadence: one bounded heartbeat with final task packet and Paperclip disposition.
- Stop conditions: confirmed missing runtime coverage gap requiring Backend implementation, protected credential requirement, or local infra blocker.
- Handoff expectation: close [LUC-2157](/LUC/issues/LUC-2157) as classification complete with explicit residual owner guidance.

## Context
The scoped Paperclip wake targeted [LUC-2157](/LUC/issues/LUC-2157) with no
pending human comments. The only issue comment was a live-run janitor note that
cancelled a duplicate owner run and kept the active lane. The issue description
asks Test Automation to classify API/runtime helper rows from the 2026-06-05
architecture-awareness export, especially auth session helpers, bots e2e
helpers, repositories/services, and route/runtime helper functions.

## Goal
Prevent the scanner's API/runtime missing-test relation bucket from turning
into low-value blanket "one function, one test" work. Separate real QA gaps
from existing focused/aggregate proof and from protected production evidence
that cannot be locally synthesized.

## Success Signal
- The backlog has a family-level table with sample files, existing proof commands, local/protected boundary, and next owner.
- A focused local pure-helper pack passes.
- DB-backed proof is either run or recorded with the exact local infrastructure blocker.
- No production, protected account, secret, exchange, or live-trading action is performed.

## Constraints
- Use existing architecture evidence graph and module documentation.
- Do not introduce scanner suppressions or relation-generation mechanisms.
- Do not claim protected production proof from local inspection.
- Do not add tests unless a concrete missing behavior is isolated.

## Definition of Done
- [x] Current architecture-health/report samples were read and classified.
- [x] Existing API/runtime tests were inventoried.
- [x] Classification table distinguishes direct relation gaps from true missing focused tests.
- [x] Validation evidence is recorded.
- [x] Deployment and runtime impact are explicitly none.

## Classification

| Family | Sample files / surfaces | Existing proof relationship | True focused-test candidates | Local/protected disposition |
| --- | --- | --- | --- | --- |
| Auth session and auth endpoints | `apps/api/src/modules/auth/auth.routes.ts`, `auth.service.ts`, `auth.cookie.ts`, `auth.jwt.ts`, `sessionToken.ts` | Module docs list `auth.e2e.test.ts`, `auth.service.test.ts`, `auth.cookie.test.ts`, and `auth.jwt.test.ts`; pure helper proof passed for cookie/JWT/session token tests. DB-backed `auth.service.test.ts` exists but could not run in this shell because local Postgres is unavailable. | No new focused candidate isolated. If auth service DB setup changes recur, add a DB fixture readiness precheck rather than another auth behavior test. | Local pure helpers verified; DB-backed proof blocked by `localhost:5432`; protected production auth proof remains outside this lane. |
| API root/router and worker diagnostics | `apps/api/src/router/index.ts`, `/health`, `/ready`, `/ready/details`, `/workers/health`, `/workers/ready`, `/workers/runtime-freshness` | `api-root.md` lists router tests; inventory includes `health-readiness.test.ts`, `workers-health-readiness.test.ts`, and `workers-runtime-freshness.test.ts`. `workers-health-readiness.test.ts` passed inside the mixed attempt (`8/8`); `workers-runtime-freshness.test.ts` is DB-backed and blocked by local Postgres in this shell. | Optional future helper-level tests only if runtime freshness query logic regresses without DB isolation. | Local route family is present in test inventory; DB-backed freshness rerun blocked by local Postgres; protected `/workers/ready` production smoke remains [LUC-241](/LUC/issues/LUC-241) / Ops gate scope. |
| Bot setup and command helper services | `botContextValidation.service.ts`, `botCanonicalUpdateScope.service.ts`, `botOwnership.service.ts`, `bots.e2e.test.ts`, e2e shared helpers | Registry rows `SOAR-TEST-BOT-SETUP-API`, `SOAR-TEST-BOT-OWNERSHIP`, and module docs map setup, entitlement, wallet contract, duplicate guard, and topology tests. Pure `botCanonicalUpdateScope.service.test.ts` passed; `botContextValidation.service.test.ts` is DB-backed and blocked locally by Postgres. | No current behavior gap. If e2e shared helper direct relations remain noisy, Architecture Graph relation inference should map helpers to aggregate e2e tests. | Existing test proof is present; direct scanner relation gaps remain relation backlog, not a QA blocker. |
| Bot runtime read/command/repository helpers | `botsRuntimeRead.repository.ts`, `runtimeSessionPositionsRead.service.ts`, `runtimeSessionPositionCommand.service.ts`, `runtimePositionSerialization.service.ts`, `runtimeMonitoringAggregateRead.service.ts` | Registry rows `SOAR-TEST-BOT-RUNTIME-API`, `SOAR-TEST-RUNTIME-SUPPORT-SERVICES`, `SOAR-TEST-RUNTIME-EXTERNAL-POSITION-OWNER`, and module docs map runtime monitoring, positions, trades, takeover, history, aggregate, and serialization tests. Pure `runtimePositionSerialization.service.test.ts` passed; broader DB-backed runtime session read/command proof exists but was not rerun due local Postgres. | No new focused candidate isolated. Direct repository helper relation gaps should be handled by graph/test registry mapping unless a specific read-model regression is found. | Local pure helper verified; DB-backed runtime packs are existing proof but locally blocked without Postgres. |
| Engine runtime helper functions | `runtimeSignalLoop.service.ts`, `executionOrchestrator.service.ts`, `runtimeExecutionDedupe.service.ts`, runtime automation and signal helpers | `api-engine.md` and registry rows map runtime loop, orchestration, dedupe, execution parity, paper/live equivalence, assistant orchestration, pre-trade, and automation tests. `runtimeExecutionDedupe.service.test.ts` passed in the pure helper pack. | None isolated by this classification. | Existing proof present; some direct function-to-test links remain scanner relation backlog. |
| Exchange/account/live/protected surfaces consumed by runtime | exchange authenticated-read, API-key probe, live order adapter, production worker freshness/readback collectors | Exchange/profile module docs and registry rows map local adapter/probe tests. Protected success states require approved production credentials or exchange context. | Helper-level tests may be useful only if a concrete adapter/probe failure recurs. | Do not fake protected production success locally; leave protected smoke/readback to [LUC-241](/LUC/issues/LUC-241), Ops, and Security gates. |

## Validation Evidence
- Source inspection:
  - `docs/graphs/architecture-health.json` generated `2026-06-05T10:00:00.169Z`, with `14256` entities, `22120` relations, and `7715` implementation-without-tests signals.
  - `docs/status/architecture-awareness-report.md` top API samples include curated graph-covered auth routes, dashboard bots mount, root auth mount, and workers runtime freshness.
  - `docs/architecture/registry/tests.csv` maps API/runtime test nodes for auth, bot setup, bot runtime, runtime support services, API root/support routes, middleware, and engine/runtime helpers.
  - `docs/modules/api-auth.md`, `docs/modules/api-bots.md`, `docs/modules/api-engine.md`, and `docs/modules/api-root.md` list the relevant module test commands.
- Commands:
  - `pnpm --filter api exec vitest run src/modules/auth/auth.cookie.test.ts src/modules/auth/auth.jwt.test.ts src/modules/auth/sessionToken.test.ts src/modules/bots/botCanonicalUpdateScope.service.test.ts src/modules/bots/runtimePositionSerialization.service.test.ts src/modules/engine/runtimeExecutionDedupe.service.test.ts --run --reporter=dot` -> PASS (`6` files / `37` tests).
  - `pnpm run architecture:graph:drift:strict` -> PASS (`822/822`, `0` missing).
  - `pnpm --filter api exec vitest run src/modules/auth/auth.service.test.ts src/modules/auth/auth.cookie.test.ts src/modules/auth/auth.jwt.test.ts src/modules/auth/sessionToken.test.ts --run --reporter=dot` -> FAIL only in DB-backed `auth.service.test.ts`: Prisma cannot reach `localhost:5432`; other files passed (`3` files / `11` tests passed, `2` DB-backed failures).
  - `pnpm --filter api exec vitest run src/router/workers-runtime-freshness.test.ts src/router/workers-health-readiness.test.ts --run --reporter=dot` -> mixed: `workers-health-readiness.test.ts` passed (`8` tests), `workers-runtime-freshness.test.ts` failed because Prisma cannot reach `localhost:5432`.
  - Larger focused API pack timed out at `120s` before output; replaced by the narrower commands above.
- Files updated:
  - `history/tasks/luc-2157-classify-api-runtime-helper-missing-test-relation-backlog-2026-06-05-task.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.agents/state/system-health.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- Module confidence ledger updated: yes.
- Requirements matrix updated: no; classification only.
- Risk register updated: no; existing documentation/graph relation risk unchanged.
- Reality status: verified with local DB blocker.

## Architecture Evidence
- Architecture source reviewed:
  - `.agents/core/project-memory-index.md`
  - `.agents/core/mission-control.md`
  - `docs/graphs/architecture-health.json`
  - `docs/status/architecture-awareness-report.md`
  - `docs/architecture/registry/tests.csv`
  - module docs for API auth, bots, engine, root/router, and adjacent runtime modules
- Fits approved architecture: yes.
- Mismatch discovered: no runtime mismatch; remaining signal is mostly direct relation incompleteness and DB/protected proof boundaries.
- Decision required from user: no.
- Follow-up architecture doc updates: none in this issue.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: not applicable.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: architecture-awareness still reports a broad API/runtime missing-test relation bucket.
- Finding: top rows are a mix of endpoint mount nodes, helper function nodes, aggregate e2e helper relations, and DB/protected proof boundaries.
- No confirmed runtime defect or missing focused behavior was found.

### 2. Select One Priority Mission Objective
- Selected task: [LUC-2157](/LUC/issues/LUC-2157).
- Priority rationale: scoped wake assigned this high-priority QA classification issue.
- Other work deferred: wake contract forbids switching issues before handling this one.

### 3. Plan Implementation
- Build a classification table by module family.
- Run pure helper proof first; attempt representative DB-backed proof and record infra blocker if unavailable.
- Update state and close the issue with exact residual owners.

### 4. Execute Implementation
- Classified auth, API root/worker diagnostics, bot setup, bot runtime, engine runtime, and protected exchange/readback families.
- No production or code mutation occurred.

### 5. Verify and Test
- Pure helper pack passed (`37/37`).
- Strict graph drift passed (`822/822`, `0` missing).
- DB-backed representative proof is blocked by unavailable local Postgres.

### 6. Self-Review
- Existing systems were reused.
- No workaround path, scanner suppression, or duplicated test framework was introduced.
- The classification does not downgrade missing protected proof into local green status.

### 7. Update Documentation and Knowledge
- Task packet and source-of-truth state files were updated.
- Learning journal not updated; the local Postgres blocker is already a known environment class and no new recurring pitfall was isolated by this issue.

## Review Checklist
- [x] Process self-audit completed.
- [x] Exactly one priority task was completed.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Validation evidence is attached.
- [x] Relevant source-of-truth files were updated.
- [x] Residual risks and blockers are explicit.

## Security / Privacy Evidence
- Data classification: docs/test metadata only.
- Trust boundaries: protected production proof scripts and account contexts were not executed.
- Secret handling: no secret values accessed or recorded.
- Abuse cases: no account, exchange, or live-trading mutation occurred.
- Residual risk: protected production runtime proof remains separate and approval-gated.

## Result Report
- Task summary: classified API/runtime helper missing-test relation backlog and separated existing local proof from direct relation backlog, DB-backed local proof blockers, and protected production proof gaps.
- Files changed:
  - `history/tasks/luc-2157-classify-api-runtime-helper-missing-test-relation-backlog-2026-06-05-task.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.agents/state/system-health.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested:
  - Pure API/runtime helper pack: PASS (`6` files / `37` tests).
  - Strict graph drift: PASS (`822/822`, `0` missing).
  - DB-backed auth/worker runtime representative tests: blocked by local Postgres unavailable at `localhost:5432`.
- What is incomplete:
  - Report-wide missing-test relation count remains scanner/graph backlog; this issue classifies rather than rewrites relation inference.
  - DB-backed e2e/service packs need local Postgres/Redis before rerun.
  - Protected production runtime/readback proof remains [LUC-241](/LUC/issues/LUC-241) / Ops/Security gate scope.
- Next steps:
  - Architecture Graph / Docs Memory can improve direct relation inference for aggregate API/runtime helper proof.
  - Backend/Test Automation should add focused tests only when a concrete helper regression is isolated.
  - Ops/Security should continue protected production proof through approved credentials and smoke gates.
- Decisions made:
  - No new focused test work is required by this issue because no concrete missing behavior was isolated.
