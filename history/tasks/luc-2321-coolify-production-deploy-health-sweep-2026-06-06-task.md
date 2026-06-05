# Task

## Header
- ID: LUC-2321
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
- Risk Rows: production Web recovery follow-up, Coolify metadata status ambiguity
- Iteration: 2026-06-06 Ops heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-2321-COOLIFY-PRODUCTION-DEPLOY-HEALTH-SWEEP-2026-06-06
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] Exactly one priority task is selected.
- [x] The task is aligned with repository source-of-truth documents.
- [x] Affected operations/source-control state was identified.
- [x] The task improves release confidence with production read-only evidence.

## Context
[LUC-2321](/LUC/issues/LUC-2321) woke Ops Release Lead for a critical Soar
Coolify production deploy health sweep. Recent recovery evidence in
[LUC-2308](/LUC/issues/LUC-2308) verified production `soar-web` recovered on
`a70d7881b69e605c537af5f81cbeb74dc81e9329`; this heartbeat needed fresh
read-only confirmation and a clear issue disposition.

## Goal
Capture fresh production deploy-health truth for Soar canonical API/Web hosts
and Coolify production topology without performing any production mutation.

## Scope
- Public API: `https://api.soar.luckysparrow.ch/health` and `/ready`
- Public Web: `https://soar.luckysparrow.ch/` and `/api/build-info`
- Fail-closed unauthenticated worker spot check: `/workers/ready`
- Coolify project/environment/resources read-only projection for `Soar / production`
- Local evidence and state updates only

## Implementation Plan
1. Confirm source snapshot for local `HEAD` and `origin/main`.
2. Run public no-workers deploy smoke against canonical production hosts.
3. Run direct public status/build-info spot checks.
4. Run names-only Coolify binding check and authenticated read-only resource projection.
5. Run focused Coolify env-check tests.
6. Persist evidence and update project state.
7. Close the Paperclip issue with verified disposition.

## Acceptance Criteria
- API `/health` and `/ready` return `200`.
- Web `/` and `/api/build-info` return `200`.
- Web build-info reports pushed `origin/main` SHA.
- Coolify project/environment/resources projection resolves canonical eight-resource production topology.
- No secret value disclosure and no production mutation.

## Definition of Done
- [x] Source-ref snapshot recorded.
- [x] Public health/build-info checks recorded.
- [x] Coolify read-only projection recorded without sensitive identifiers.
- [x] Focused validation passed.
- [x] Evidence artifact and state files updated.

## Forbidden
- Deploy, restart, rollback, force-start, env edit, database/Redis mutation,
  team/account change, protected account smoke, exchange mutation, or live
  trading.
- Secret, token, cookie, account data, exchange credential, raw resource id,
  generated name, internal network, host path, or env value disclosure.

## Validation Evidence
- Tests:
  - `pnpm run ops:coolify-stack:env-check:test` -> PASS (`8/8`).
- Manual checks:
  - `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha a70d7881b69e605c537af5f81cbeb74dc81e9329 --no-workers` -> PASS.
  - Direct `curl.exe` spot checks: Web `/` `200`, API `/health` `200`, API `/ready` `200`, unauthenticated `/workers/ready` `401`.
  - Read-only Coolify projection: project `Soar`, environment `production`, six applications, PostgreSQL, Redis, zero generic services, `17` visible global resource rows.
- Screenshots/logs: not applicable.
- High-risk checks: no production mutation; no secret values printed or persisted.
- Module confidence ledger updated: not applicable for narrow read-only sweep.
- Requirements matrix updated: not applicable.
- Quality scenarios updated: not applicable.
- Risk register updated: not applicable.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: `docs/operations/coolify-vps-deployment-contract.md` and current Ops state.
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
- Recent [LUC-2308](/LUC/issues/LUC-2308) evidence showed fixed Web wrapper deploy live on `a70d7881b69e605c537af5f81cbeb74dc81e9329`.
- Local `HEAD` is `10f1cfce94533e96a65b487d8cd0b1e9dff8f59e`; `origin/main` remains `a70d7881b69e605c537af5f81cbeb74dc81e9329`.
- Existing dirty worktree content was pre-existing and not used as deploy input.

### 2. Select One Priority Mission Objective
- Selected [LUC-2321](/LUC/issues/LUC-2321), the assigned critical Ops health sweep.
- No other issue was selected because the wake payload is scoped to [LUC-2321](/LUC/issues/LUC-2321).

### 3. Plan Implementation
- Use only read-only public HTTP probes and Coolify API projection.
- Avoid any source/image/runtime mutation because the issue is a health sweep, not a release mutation permit.

### 4. Execute Implementation
- Captured source refs.
- Ran deploy smoke and direct status/build-info probes.
- Ran names-only Coolify binding check and authenticated read-only projection.

### 5. Verify and Test
- Public smoke passed.
- Coolify env-check tests passed.
- Coolify read-only topology projection matched expected production resource model.

### 6. Self-Review
- Existing systems were reused.
- No workaround path, duplicate release mechanism, or production mutation was introduced.
- Local ahead-of-origin state is explicitly recorded as not deployed.

### 7. Update Documentation and Knowledge
- Docs updated: task and evidence artifacts, project state, task board, system health.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before closure.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.

## Result Report

- Task summary: verified Soar production public API/Web deploy health and Coolify production topology for [LUC-2321](/LUC/issues/LUC-2321).
- Files changed:
  - `history/evidence/luc-2321-coolify-production-deploy-health-sweep-2026-06-06.md`
  - `history/tasks/luc-2321-coolify-production-deploy-health-sweep-2026-06-06-task.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.agents/state/system-health.md`
- How tested: public no-workers deploy smoke, direct public spot checks, Coolify env-check tests, read-only Coolify projection.
- What is incomplete: protected account/dashboard/worker readiness smoke remains outside this read-only health sweep.
- Next steps: use a separate release mutation permit for any deploy/restart/rollback; do not deploy local `10f1cfce94533e96a65b487d8cd0b1e9dff8f59e` unless reviewed, pushed, and authorized.
- Decisions made: treated `origin/main`/production build-info SHA as the deployed source, not local ahead-of-origin `HEAD`.
