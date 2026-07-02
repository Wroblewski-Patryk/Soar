# Task

## Header
- ID: LUC-6551
- Title: Authenticated production acceptance and performance sweep
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: QA/Test
- Depends on: [LUC-6331](/LUC/issues/LUC-6331)
- Priority: P0
- Module Confidence Rows: production auth/session, dashboard shell, admin shell, Web build metadata, worker readiness, production timing
- Requirement Rows: production authenticated acceptance, protected worker readiness, rollback guard
- Quality Scenario Rows: production availability, performance, release rollback readiness
- Risk Rows: production Web unavailable, protected worker readiness unavailable, auth binding incomplete in runner
- Iteration: 2026-07-01 heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-6551-AUTHENTICATED-PRODUCTION-ACCEPTANCE-PERFORMANCE-SWEEP-2026-07-01
- Mission Status: BLOCKED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] Exactly one priority task is selected.
- [x] The task is aligned with repository source-of-truth documents.
- [x] Affected module confidence rows were identified.
- [x] The task improves release confidence by proving the current production acceptance blocker.

## Context
Recurring QVE production acceptance must verify Soar as a paid production
product: public Web, authenticated routes, protected worker readiness, runtime
freshness, rollback posture, and performance timing. Recent LUC-6491/LUC-6524
and LUC-6331 evidence showed Web `503`, protected worker readiness failure, and
the active restoration owner path on [LUC-6331](/LUC/issues/LUC-6331).

## Goal
Run the smallest read-only production acceptance sweep that proves whether
authenticated acceptance can be accepted now.

## Scope
- Production API health and readiness.
- Production Web root and build-info.
- Protected `/workers/ready`.
- Runtime freshness.
- Rollback guard.
- Production UI route clickthrough artifact.

## Implementation Plan
1. Confirm available production audit bindings by name/length only.
2. Run deploy smoke on canonical production hosts.
3. Run runtime freshness.
4. Run rollback guard.
5. Run UI clickthrough audit to persist a machine-readable Web fail-state.
6. Update local evidence/state and Paperclip disposition.

## Acceptance Criteria
- Public API health/readiness result recorded.
- Web root/build-info result recorded.
- Protected worker readiness result recorded.
- Runtime freshness and rollback guard results recorded.
- Auth/secret values are not printed or stored.
- Issue disposition names the unblock owner/action.

## Definition of Done
- [x] Evidence file written.
- [x] UI artifact written.
- [x] Source-of-truth state updated.
- [x] Paperclip issue disposition applied with owner/action.

## Forbidden
- No deploy, push, restart, rollback execution, env edit, secret/account value
  readback, DB/Redis mutation, exchange/payment mutation, order, position,
  subscription/payment mutation, or live-trading action.
- No workaround acceptance of Web `503`.

## Validation Evidence
- `pnpm run -s ops:deploy:smoke` -> FAIL, API health/ready PASS, Web `/` and build-info `503`, `/workers/ready` `401` in unauthenticated runner.
- `pnpm run -s ops:deploy:runtime-freshness` -> PASS, worker/market age `12465 ms`, runtime sessions healthy.
- `pnpm run -s ops:deploy:rollback-guard` -> FAIL, `shouldRollback=true`, `workers_ready_endpoint_http_503`.
- `pnpm run -s ops:ui:prod-clickthrough -- ...` -> FAIL and wrote artifact.
- Manual checks: env binding names/lengths only; no values printed.
- High-risk checks: secret redaction and production non-mutation boundary preserved.
- Reality status: blocked.

## Architecture Evidence
- Architecture source reviewed: production acceptance follows existing ops scripts and release gates.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: current production Web and protected worker readiness fail.
- Smoke steps updated: no.
- Rollback note: guard reports `shouldRollback=true`; rollback was not executed.
- Observability or alerting impact: alerts endpoint returned empty inside rollback guard.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Recent LUC-6491/LUC-6524/LUC-6331 state showed Web `503` and worker readiness failure.
- Current LUC-6551 heartbeat requires authenticated production acceptance.

### 2. Select One Priority Mission Objective
- Selected task: LUC-6551 production acceptance sweep.
- Priority rationale: critical recurring release gate.

### 3. Plan Implementation
- Reuse existing ops scripts with env-only bindings and no secret output.

### 4. Execute Implementation
- Ran deploy smoke, runtime freshness, rollback guard, and UI clickthrough audit.

### 5. Verify and Test
- Result: blocked by Web `503` and protected worker readiness not acceptable; runtime freshness PASS.

### 6. Self-Review
- Existing scripts were reused; no workaround or duplicate checker was introduced.
- Technical debt introduced: no.

### 7. Update Documentation and Knowledge
- Docs updated: evidence, task packet, state/context files.
- Learning journal updated: not applicable; this is a known production availability blocker.

## Result Report
- Task summary: production acceptance is blocked; Web frontend and protected worker readiness are unavailable/not acceptable.
- Files changed:
  - `history/evidence/luc-6551-authenticated-production-acceptance-performance-sweep-2026-07-01.md`
  - `history/evidence/luc-6551-prod-ui-module-clickthrough-2026-07-01.md`
  - `history/artifacts/luc-6551-prod-ui-module-clickthrough-2026-07-01.json`
  - `history/tasks/luc-6551-authenticated-production-acceptance-performance-sweep-2026-07-01-task.md`
  - state/context ledgers updated.
- How tested: production read-only smoke/freshness/rollback/clickthrough commands above.
- What is incomplete: authenticated browser acceptance and Web performance cannot run until production Web and `/workers/ready` recover with approved auth bindings.
- Next steps: Ops Release Lead / board-approved Coolify mutation owner resolves [LUC-6331](/LUC/issues/LUC-6331), then QVE reruns this acceptance.
- Decisions made: mark LUC-6551 blocked; do not create duplicate Backend/Auth repair.
- Paperclip result: comment readback showed `totalComments=1`; `PATCH /api/issues/LUC-6551` returned `status=blocked`.

## Comment-Triggered Recheck
- Wake source: comment `467b06f9-89bf-427a-bc34-d2cb727070be`.
- Action: bounded read-only production recheck; no deploy, restart, rollback,
  env edit, secret readback, DB/Redis mutation, production account mutation,
  exchange/payment action, order, position, subscription mutation, or
  live-trading action.
- Validation:
  - default `pnpm run -s ops:deploy:smoke` -> FAIL, all default-binding checks
    returned `fetch failed`; this runner has no `SMOKE_*` production bindings.
  - explicit curl -> API `/health 200`, API `/ready 200`, unauthenticated
    `/workers/ready 401`.
  - explicit production `pnpm run -s ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`
    -> FAIL, Web `/ 503`, Web `/api/build-info 503`, unauthenticated
    `/workers/ready 401`.
- Result: still `BLOCKED / PRODUCTION_WEB_503 /
  AUTHENTICATED_ACCEPTANCE_NOT_EXECUTABLE`; unblock remains LUC-6331 under Ops
  Release Lead / board-approved Coolify mutation owner.

## Reopened Comment Recheck 2
- Wake source: comment `a7041a06-ac02-4cf7-9868-4c3baa82c2ff`.
- Action: bounded read-only production recheck; no deploy, restart, rollback,
  env edit, secret readback, DB/Redis mutation, production account mutation,
  exchange/payment action, order, position, subscription mutation, or
  live-trading action.
- Validation:
  - `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`
    -> FAIL, API `/health 200`, API `/ready 200`, Web `/ 503`, Web
    `/api/build-info 503`, unauthenticated `/workers/ready 401`.
- Result: still `BLOCKED / PRODUCTION_WEB_503 /
  AUTHENTICATED_ACCEPTANCE_NOT_EXECUTABLE`; unblock remains
  [LUC-6331](/LUC/issues/LUC-6331) under Ops Release Lead / board-approved
  Coolify mutation owner.
- Paperclip control-plane caveat:
  - `PATCH /api/issues/LUC-6551` with blocked status and comment aborted after
    `15s`; mutation unconfirmed from this runner.
  - status-only `PATCH /api/issues/8a3dab57-5646-40e0-8dfc-81be12b0817a`
    also aborted after `10s`; mutation unconfirmed from this runner.
  - `GET /api/health` returned `200`.
  - `GET /api/issues/LUC-6551/heartbeat-context` aborted after `8s`; issue
    readback unconfirmed from this runner.
