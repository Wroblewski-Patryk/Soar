# Task

## Header
- ID: LUC-6660
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
- Risk Rows: production Web unavailable, workers readiness unavailable
- Iteration: 2026-07-01 heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-6660-AUTHENTICATED-PRODUCTION-ACCEPTANCE-PERFORMANCE-SWEEP-2026-07-01
- Mission Status: BLOCKED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches QVE verification ownership.
- [x] The task is aligned with repository source-of-truth documents.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence by proving the current production acceptance blocker.

## Mission Block
- Mission objective: prove whether Soar production can pass authenticated acceptance and performance gates now.
- Release objective advanced: V1 production acceptance evidence.
- Included slices: deploy smoke, runtime freshness, rollback guard, UI route clickthrough, auth-session proof attempt, representative public timing.
- Explicit exclusions: deploy, push, restart, rollback execution, env edit, secret/account value readback, DB/Redis mutation, production account mutation, exchange/payment mutation, order, position, subscription mutation, live-trading action.
- Checkpoint cadence: one heartbeat evidence packet.
- Stop conditions: Web `503`, worker readiness `503`, or any mutation requirement.
- Handoff expectation: blocked disposition with named unblock owner/action.

## Context
Recurring QVE production acceptance must verify Soar as a production product:
public Web, authenticated routes, protected worker/runtime readiness, rollback
posture, and performance timing. Same-day state already showed Web `503` and
`soar-web` / `workers-backtest` restoration under [LUC-6331](/LUC/issues/LUC-6331).

## Goal
Run the smallest read-only production acceptance sweep that proves whether
authenticated acceptance can be accepted now.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within read-only verification

## Definition of Done
- [x] Production API health/readiness result recorded.
- [x] Web root/build-info result recorded.
- [x] Protected runtime/rollback result recorded.
- [x] UI route clickthrough artifact recorded.
- [x] Auth-session proof attempt result recorded.
- [x] Secret values are not printed or stored.
- [x] Issue disposition names the unblock owner/action.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- deploy, push, restart, rollback execution, env edit, secret/account value readback, DB/Redis mutation, production account mutation, exchange/payment mutation, order, position, subscription mutation, or live-trading action
- accepting Web `503` as production-ready

## Validation Evidence
- `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch` with audit auth mapped -> FAIL; API health/ready PASS; Web `/` and build-info `503`; `/workers/ready` `503`.
- `pnpm run -s ops:deploy:runtime-freshness` with audit auth mapped -> PASS; worker/market heartbeat age about `14.3s`, runtime signal lag `0 ms`, `5` running sessions.
- `pnpm run -s ops:deploy:rollback-guard` with audit auth mapped -> FAIL; `shouldRollback=true` with `workers_ready_endpoint_http_503`.
- `pnpm run -s ops:ui:prod-clickthrough -- ...luc-6660...` -> FAIL and wrote artifact.
- `pnpm run -s ops:prod-auth:proof -- --i-understand-production-auth-proof ...luc-6660...` -> FAIL before artifact write; `build-info does not match expected SHA`.
- Timing sample: API health/ready `200`; Web root/build-info `503`.

## Result Report
- Task summary: production acceptance is blocked; API health/ready passes and runtime freshness passes through approved audit-login mapping, but Web frontend returns `503`, workers readiness returns `503`, rollback guard requests action, and auth proof fails closed before browser session evidence.
- Files changed:
  - `history/evidence/luc-6660-authenticated-production-acceptance-performance-sweep-2026-07-01.md`
  - `history/evidence/luc-6660-prod-ui-module-clickthrough-2026-07-01.md`
  - `history/artifacts/luc-6660-prod-ui-module-clickthrough-2026-07-01.json`
  - `history/tasks/luc-6660-authenticated-production-acceptance-performance-sweep-2026-07-01-task.md`
  - state/context ledgers updated.
- How tested: production read-only smoke/freshness/rollback/clickthrough/auth/timing commands above.
- What is incomplete: accepted authenticated browser proof and production Web performance cannot run until production Web and worker readiness recover.
- Next steps: Ops Release Lead / board-approved Coolify mutation owner resolves [LUC-6331](/LUC/issues/LUC-6331), then QVE reruns LUC-6660.
- Decisions made: mark LUC-6660 blocked; do not create duplicate product-code or Backend/Auth repair.
- Paperclip result: `PATCH` returned `identifier=LUC-6660`, `status=blocked`,
  `blockedBy=[LUC-6331]`, comment id
  `1af9b85d-da2a-4f5d-a6f0-3b8e8a4dace1`.
