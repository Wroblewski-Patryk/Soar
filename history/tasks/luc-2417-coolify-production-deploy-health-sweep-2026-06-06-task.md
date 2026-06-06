# Task

## Header
- ID: LUC-2417
- Title: Coolify production deploy health sweep
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: none
- Priority: P0
- Module Confidence Rows: production deploy health, Coolify production topology
- Requirement Rows: production public API/Web readiness
- Quality Scenario Rows: deployment health, fail-closed unauthenticated worker readiness
- Risk Rows: Coolify metadata status ambiguity, protected worker proof gap
- Iteration: 2026-06-06 Ops heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-2417-COOLIFY-PRODUCTION-DEPLOY-HEALTH-SWEEP-2026-06-06
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the verification-heavy issue scope.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed through current mission/state indexes.
- [x] `.agents/core/mission-control.md` was reviewed through current mission state.
- [x] Missing or template-like state tables were not encountered for this narrow sweep.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified or marked not applicable.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: capture fresh read-only production deploy health truth for Soar Coolify production.
- Release objective advanced: production API/Web health and deploy freshness confidence.
- Included slices: source ref snapshot, public API/Web smoke, unauthenticated worker fail-closed check, Coolify read-only topology projection, evidence/state update, Paperclip closure.
- Explicit exclusions: deploy, restart, rollback, env edit, database/Redis mutation, account smoke, protected worker/auth/dashboard proof, exchange or live-trading mutation.
- Checkpoint cadence: single heartbeat verification checkpoint.
- Stop conditions: public health/build-info failure, Coolify read-only projection failure, missing protected mutation approval.
- Handoff expectation: close issue with verified read-only evidence and residual protected-proof risks.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | 09 DRE | wake payload, active mission, post-deploy checklist | issue closure, state updates | verified mission packet | parent validation gate | DONE |
| Ops/Release | 09 DRE | `docs/operations/post-deploy-smoke-checklist.md`, Coolify guide | production health evidence | read-only smoke and topology projection | deploy smoke, Coolify projection | DONE |
| Documentation/Memory | 09 DRE | `.codex/context/*`, `.agents/state/*` | task/evidence/state rows | durable LUC-2417 artifacts | state entries and evidence links | DONE |

### Lane Checks
- [x] `.agents/state/active-mission.md` was refreshed for the heartbeat result.
- [x] Responsibility lanes were limited to the single Ops/Release verification lane.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.
- [x] Missing or unclear ownership did not occur.

## Context
[LUC-2417](/LUC/issues/LUC-2417) woke DRE for a critical Soar Coolify production
deploy health sweep. Previous `LUC-2321` evidence verified production on an
older pushed SHA; this heartbeat needed fresh read-only confirmation for the
current deployed production state.

## Goal
Capture fresh production deploy-health truth for Soar canonical API/Web hosts
and Coolify production topology without performing any production mutation.

## Success Signal
- User or operator problem: know whether Soar production is healthy after Coolify deployment activity.
- Expected product or reliability outcome: public production API/Web are reachable and production build-info matches current pushed source.
- How success will be observed: passing read-only smoke, build-info SHA match, and Coolify topology projection.
- Post-launch learning needed: no.

## Deliverable For This Stage
Verification evidence and issue/state closure for the read-only production health sweep.

## Constraints
- use existing smoke and Coolify read-only mechanisms
- do not introduce new deploy structures or scripts
- do not mutate production, secrets, accounts, exchange state, data, Redis, or workers
- do not treat public smoke as protected worker/dashboard/account proof

## Definition of Done
- [x] Source-ref snapshot recorded.
- [x] Public health/build-info checks recorded.
- [x] Coolify read-only projection recorded without sensitive identifiers.
- [x] Focused validation passed.
- [x] Evidence artifact and state files updated.

## Stage Exit Criteria
- [x] The output matches verification stage.
- [x] Work from release mutation stage was not mixed in.
- [x] Risks and assumptions are stated clearly.

## Forbidden
- deploy, restart, rollback, force-start, env edit, database/Redis mutation,
  team/account change, protected account smoke, exchange mutation, or live
  trading.
- secret, token, cookie, account data, exchange credential, raw resource id,
  generated name, internal network, host path, or env value disclosure.

## Validation Evidence
- Tests:
  - `pnpm run ops:coolify-stack:env-check:test` -> PASS (`8/8`).
- Manual checks:
  - `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 56d8d440bfe0fd9ee692e9f669e35414d85d2493 --no-workers` -> PASS.
  - Direct `curl.exe` spot checks: API `/health` `200`, API `/ready` `200`, Web `/` `200`, Web `/api/build-info` `200`, unauthenticated `/workers/ready` `401`.
  - Read-only Coolify projection: project `Soar`, environment `production`, six applications, PostgreSQL, Redis, zero generic services, `17` visible global resource rows.
- Screenshots/logs: not applicable.
- High-risk checks: no production mutation; no secret values printed or persisted.
- Module confidence ledger updated: yes.
- Module confidence rows closed or changed: production deploy health, Coolify production topology.
- Requirements matrix updated: not applicable for narrow read-only sweep.
- Requirement rows closed or changed: none.
- Quality scenarios updated: not applicable for narrow read-only sweep.
- Quality scenario rows closed or changed: none.
- Risk register updated: not applicable for narrow read-only sweep.
- Risk rows closed or changed: none.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: `docs/operations/coolify-linux-vps-setup-guide.md`, `docs/operations/post-deploy-smoke-checklist.md`, current Ops state.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none; topology unchanged.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: API/Web public checks are green; unauthenticated worker readiness fails closed with `401`.
- Smoke steps updated: no.
- Rollback note: no rollback path exercised; rollback remains a separate release permit if needed.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Wake payload scoped the heartbeat to [LUC-2417](/LUC/issues/LUC-2417).
- Previous [LUC-2321](/LUC/issues/LUC-2321) evidence proved the same topology on an older pushed SHA.
- Local `HEAD` and `origin/main` both resolve to `56d8d440bfe0fd9ee692e9f669e35414d85d2493`.
- Existing dirty worktree content was pre-existing and not used as deploy input.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: active mission, next steps, task board, post-deploy smoke checklist, Coolify guide, prior LUC-2321 evidence.
- Blocking unknowns: none for read-only public/Coolify projection.
- Why it was safe to continue: checks were read-only and did not require protected credentials beyond existing Coolify read access.

### 2. Select One Priority Mission Objective
- Selected task: [LUC-2417](/LUC/issues/LUC-2417), the assigned critical Ops health sweep.
- Priority rationale: scoped wake and production health priority.
- Why other candidates were deferred: the wake payload forbids switching issues until handled.

### 3. Plan Implementation
- Files or surfaces to modify: task/evidence artifacts and state rows only.
- Logic: use existing read-only smoke and Coolify projection, then persist evidence.
- Edge cases: public smoke cannot replace protected worker/account proof; Coolify `running:unknown` application metadata remains only an advisory signal.

### 4. Execute Implementation
- Captured source refs.
- Ran deploy smoke and direct public status/build-info probes.
- Ran names-only Coolify binding check and authenticated read-only projection.

### 5. Verify and Test
- Public smoke passed.
- Coolify env-check tests passed.
- Coolify read-only topology projection matched expected production resource model.

### 6. Self-Review
- Existing systems were reused.
- No workaround path, duplicate release mechanism, or production mutation was introduced.
- Production build-info matches current pushed source.

### 7. Update Documentation and Knowledge
- Docs updated: task and evidence artifacts, project state, task board, active mission, module confidence, system health.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before closure.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected for verification-heavy release work.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.
- [x] Required responsibility lanes were integrated.

## Result Report

- Task summary: verified Soar production public API/Web deploy health and Coolify production topology for [LUC-2417](/LUC/issues/LUC-2417).
- Files changed:
  - `history/evidence/luc-2417-coolify-production-deploy-health-sweep-2026-06-06.md`
  - `history/tasks/luc-2417-coolify-production-deploy-health-sweep-2026-06-06-task.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.agents/state/next-steps.md`
  - `.agents/state/system-health.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested: public no-workers deploy smoke, direct public spot checks, Coolify env-check tests, read-only Coolify projection.
- What is incomplete: protected account/dashboard/worker readiness, SLO, rollback, and live runtime proof remain outside this read-only health sweep.
- Next steps: use a separate protected release proof lane for authenticated worker/dashboard/account evidence; use a separate release mutation permit for deploy/restart/rollback.
- Decisions made: treated current `origin/main`/production build-info SHA as deployed source because it matches local `HEAD`.
