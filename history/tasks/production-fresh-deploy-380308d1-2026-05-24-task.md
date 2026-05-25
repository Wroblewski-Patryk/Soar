# Task

## Header
- ID: `PROD-FRESH-DEPLOY-380308D1-2026-05-24`
- Title: Deploy current production candidate and recover deploy freshness
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: `PROD-PUBLIC-REACHABILITY-REFRESH-2026-05-24`
- Priority: P1
- Module Confidence Rows: Operations/Release, Engine runtime DCA
- Requirement Rows: `REQ-FUNC-021`
- Quality Scenario Rows: `QAS-FULL-READINESS-2026-05-23`, `QA-021`
- Risk Rows: `RISK-FULL-READINESS-2026-05-23`
- Iteration: 2026-05-24 readiness continuation
- Operation Mode: BUILDER
- Mission ID: `SOAR-FULL-READINESS-COORDINATION-2026-05-23`
- Mission Status: PARTIALLY_VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration objective.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed in the parent mission.
- [x] `.agents/core/mission-control.md` was reviewed for long-running work.
- [x] Missing or template-like state tables were not introduced.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: restore production deploy freshness for Soar Web/API/workers and keep remaining release blockers explicit.
- Release objective advanced: public production now serves current pushed SHA `380308d10cf0fabb2ea629eb55e6f0ba7d980ed1` for Web/API and all Soar workers.
- Included slices: diagnose stale production, queue Coolify deploys, repair API build type mismatch, commit/push the fix, redeploy Web/API/workers, rerun public smoke and V1 preflight.
- Explicit exclusions: no LIVE exchange mutation, no protected app UI/runtime readback without approved auth, no production DB restore drill without approved context.
- Checkpoint cadence: after deploy queueing, after build failure diagnosis, after code fix validation, after production convergence, after preflight.
- Stop conditions: raw secret capture, unapproved live-money mutation, destructive host cleanup, or protected-auth proof without approved credentials.
- Handoff expectation: source-of-truth files state that public freshness is fixed and protected evidence remains blocked.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | `.agents/state/active-mission.md`, `.codex/context/TASK_BOARD.md` | Mission integration, state updates | This task packet | Parent validation gate | DONE |
| Ops/Release | Active chat | Coolify deployment queue, public build-info | Coolify application deploys | Web/API/workers deployed | Queue status and container tags | DONE |
| Backend Fix | Active chat | API build logs | `apps/api/src/modules/engine/runtimePositionAutomation.helpers.ts` | Type contract accepts exchange PnL | Typecheck and focused test | DONE |
| QA/Test | Active chat | Release scripts | Public smoke, preflight | Evidence artifacts | Commands listed below | DONE |
| Documentation/Memory | Active chat | `.agents/state/*`, `.codex/context/*` | Source-of-truth updates | Updated mission status | Guardrails/docs parity | DONE |

### Lane Checks
- [x] `.agents/state/active-mission.md` was refreshed for broad work.
- [x] Responsibility lanes were kept local because deploy and validation were tightly coupled.
- [x] No two write lanes owned the same file.
- [x] Each lane has expected output and validation/proof.
- [x] Missing or unclear ownership did not block this task.

## Context
Production was reachable but stale. Public Web build-info reported
`51fa41efb1664d5cb2e8dbb81cbec33f11365ccd` while local and `origin/main`
were at `52be8b614d2da9ec05d368ac4fbd05f3ec8f8332`.

## Goal
Deploy a fresh production candidate, prove public Web/API reachability, and
record the remaining protected gates without overclaiming full product
readiness.

## Success Signal
- User or operator problem: production candidate freshness blocked release confidence.
- Expected product or reliability outcome: Web/API/workers run current code and public smoke passes.
- How success will be observed: public build-info returns current SHA; public smoke passes; no-secret preflight blocks only on protected auth/evidence gates.
- Post-launch learning needed: yes.

## Deliverable For This Stage
A deployed current SHA, one small committed API build fix, public smoke proof,
V1 preflight artifacts, and source-of-truth updates.

## Constraints
- Use existing Coolify deployment queue and project release scripts.
- Do not introduce workaround deploy paths.
- Do not mutate exchange-side LIVE positions/orders.
- Do not persist or report raw secrets.
- Keep protected app journey proof blocked until approved auth/context exists.

## Definition of Done
- [x] Local API typecheck passes after the build fix.
- [x] Focused runtime exchange-PnL regression test passes.
- [x] Fix is committed and pushed to `main`.
- [x] Production Web build-info exposes `380308d10cf0fabb2ea629eb55e6f0ba7d980ed1`.
- [x] Production API and workers run `380308d10cf0fabb2ea629eb55e6f0ba7d980ed1`.
- [x] Public no-worker smoke passes.
- [x] No-secret V1 preflight report exists and blocks only on protected auth/evidence gates.

## Stage Exit Criteria
- [x] The output matches the declared `verification` stage.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions are stated clearly.

## Forbidden
- New release systems.
- Manual container replacement outside Coolify.
- Temporary bypasses.
- LIVE trading mutation.
- Protected proof without approved auth.

## Validation Evidence
- Tests:
  - `corepack pnpm run typecheck` PASS.
  - `corepack pnpm --filter api exec vitest run src/modules/engine/runtimePositionAutomation.exchangePnl.test.ts` PASS, `2/2`.
- Manual checks:
  - Coolify queue shows successful current-SHA deployments for `soar-web`, `soar-api`, `workers-market-data`, `workers-market-stream`, `workers-backtest`, and `workers-execution`.
  - Docker process check shows API and all workers tagged `380308d10cf0fabb2ea629eb55e6f0ba7d980ed1`.
  - `node scripts/waitForWebBuildInfo.mjs --web-base-url https://soar.luckysparrow.ch --expected-sha 380308d10cf0fabb2ea629eb55e6f0ba7d980ed1 --timeout-seconds 30 --interval-seconds 5` PASS.
  - `node scripts/deploySmokeCheck.mjs --web-base-url https://soar.luckysparrow.ch --api-base-url https://api.soar.luckysparrow.ch --skip-workers` PASS.
  - Narrow remote cleanup stopped two failed-deployment helper containers
    (`xopiqmotly1naden26q4ay98`, `relfp23vlseqqn14pq4jqebu`); follow-up
    `docker ps` check found no remaining helper containers from this deploy
    batch.
- Screenshots/logs:
  - Build failure diagnosed from sanitized Coolify deployment log: API build failed because `unrealizedPnl` was passed to `resolveRuntimeCurrentPnlFraction` before its input type accepted it.
- High-risk checks:
  - No LIVE order or position mutation was executed.
  - No protected production app auth proof was attempted.
  - No production DB restore drill was attempted.
- Module confidence ledger updated: yes.
- Module confidence rows closed or changed: Operations/Release; Engine runtime DCA.
- Requirements matrix updated: yes.
- Requirement rows closed or changed: `REQ-FUNC-021` release override.
- Quality scenarios updated: yes.
- Quality scenario rows closed or changed: `QAS-FULL-READINESS-2026-05-23`.
- Risk register updated: yes.
- Risk rows closed or changed: `RISK-FULL-READINESS-2026-05-23`.
- Reality status: partially verified.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-documentation.md`, graph guardrail status through current mission state.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none; touched API file was already covered by strict graph drift.

## Deployment / Ops Evidence
- Deploy impact: medium.
- Env or secret changes: none.
- Health-check impact: public API `/health` and `/ready` pass.
- Smoke steps updated: no.
- Rollback note: previous deployed images remain present on host; rollback should use Coolify rollback/previous deployment if current candidate regresses.
- Observability or alerting impact: none changed.
- Staged rollout or feature flag: not used.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: production was reachable but stale; API deploy failed on TypeScript.
- Gaps: protected auth/evidence gates are still unavailable.
- Inconsistencies: local dirty workspace already contained the type fix, but `origin/main` did not.
- Architecture constraints: use existing Coolify and release scripts.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: mission state, task board, Coolify queue, deployment logs.
- Rows created or corrected: source-of-truth readiness rows refreshed.
- Assumptions recorded: public proof can proceed; protected proof remains blocked.
- Blocking unknowns: protected app auth and production DB restore context.
- Why it was safe to continue: deployment was limited to current pushed repo code and no LIVE mutation.

### 2. Select One Priority Mission Objective
- Selected task: restore deploy freshness.
- Priority rationale: current production freshness was the active release blocker.
- Why other candidates were deferred: protected UI/runtime/DB proof needs approved inputs.

### 3. Plan Implementation
- Files or surfaces to modify: one API helper type plus state/docs.
- Logic: pass exchange `unrealizedPnl` into PnL fraction helper for `EXCHANGE_SYNC` DCA threshold truth.
- Edge cases: leave margin-based fallback behavior intact when `unrealizedPnl` is missing.

### 4. Execute Implementation
- Implementation notes: committed `380308d10cf0fabb2ea629eb55e6f0ba7d980ed1` with `fix(api): pass exchange pnl into runtime dca fraction`.

### 5. Verify and Test
- Validation performed: typecheck, focused regression, production build-info, public smoke, V1 preflight.
- Result: public deploy freshness is verified; final release remains blocked on protected gates.

### 6. Self-Review
- Simpler option considered: redeploy old SHA only; rejected because API build logs proved a code type mismatch.
- Technical debt introduced: no.
- Scalability assessment: no new deploy mechanism; existing Coolify queue retained.
- Refinements made: reran preflight after transient public smoke abort.

### 7. Update Documentation and Knowledge
- Docs updated: this task packet plus state/context files.
- Context updated: yes.
- Learning journal updated: yes.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to iteration objective.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated because repository truth changed.
- [x] Learning journal was updated for the recurring deploy freshness/build-log pitfall.
- [x] Required responsibility lanes were integrated.
