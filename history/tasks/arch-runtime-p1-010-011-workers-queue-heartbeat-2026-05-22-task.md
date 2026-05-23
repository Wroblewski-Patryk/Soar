# Task

## Header
- ID: `ARCH-RUNTIME-P1-010-011-WORKERS-QUEUE-HEARTBEAT-2026-05-22`
- Title: Repair durable backtest queue ownership and split-worker heartbeat readiness
- Task Type: fix
- Current Stage: verification
- Status: REVIEW
- Owner: Ops/Release
- Depends on: `ARCH-CODE-RUNTIME-AUDIT-2026-05-22`
- Priority: P1
- Module Confidence Rows: `SOAR-BACKTESTS-001`, `SOAR-WORKERS-001`, `SOAR-OPERATIONS-001`
- Requirement Rows: `REQ-FUNC-017`
- Quality Scenario Rows: `QA-013`, `QA-017`, `QA-039`
- Risk Rows: worker topology truth, queued backtest loss across API/worker split
- Iteration: 2026-05-22
- Operation Mode: BUILDER
- Mission ID: `ARCH-CODE-RUNTIME-AUDIT-2026-05-22`
- Mission Status: CHECKPOINTED

## Context
`ARCH-CODE-RUNTIME-AUDIT-2026-05-22` left two OPS/WORKERS P1 findings open: API-created backtest runs were queued in memory instead of in a worker-owned durable queue, and `/workers/ready` proved env/topology shape but not cross-container worker liveness.

## Goal
Implement the smallest architecture-aligned local repair using existing Redis, worker bootstrap, readiness, and metrics surfaces.

## Scope
- `apps/api/src/modules/backtests/backtestRunQueue*`
- `apps/api/src/modules/backtests/backtests.service.ts`
- `apps/api/src/workers/backtest.worker.ts`
- `apps/api/src/workers/workerBootstrap.ts`
- `apps/api/src/workers/workerHeartbeat*`
- `apps/api/src/router/index.ts`
- `apps/api/src/router/workers-health-readiness.test.ts`
- State/context docs

## Implementation Plan
1. Keep local/test inline backtest execution behavior.
2. In split backtest ownership, enqueue run ids to Redis with a dedupe set and a processing list.
3. Make backtest job retry safer by skipping terminal runs and clearing stale run-owned trades before retrying an active run.
4. Start Redis queue consumption from `workers-backtest`, not from the API process.
5. Record worker-family heartbeat timestamps to Redis from `bootstrapWorker`.
6. Require fresh Redis heartbeats for all required split-worker families in `/workers/ready`.
7. Add focused unit coverage for Redis queue enqueue/claim and heartbeat classification.

## Acceptance Criteria
- API split ownership enqueues backtest run ids to Redis and does not process them inline.
- Backtest worker claims Redis jobs, runs the existing backtest job, and acknowledges completion.
- Worker heartbeat is stored in Redis with TTL.
- `/workers/ready` fails closed when required worker heartbeat proof is stale, missing, or unavailable.
- Focused tests pass, or any blocked validation is recorded honestly.

## Definition of Done
- Existing systems reused: Redis, worker bootstrap, worker topology snapshot, metrics/readiness.
- No new queue framework or parallel architecture introduced.
- Local inline fallback remains explicit.
- Validation evidence and remaining risks are recorded.

## Result Report
- Task summary: implemented Redis-backed backtest queue ownership for split workers and Redis-backed worker heartbeat proof for `/workers/ready`.
- Files changed: listed in Scope.
- How tested:
  - `corepack pnpm --filter api exec vitest run src/modules/backtests/backtestRunQueue.test.ts --run` => PASS, `4/4`
  - `corepack pnpm --filter api exec vitest run src/modules/backtests/backtestRunQueue.test.ts src/modules/backtests/backtestRunJob.test.ts src/workers/workerHeartbeat.test.ts src/workers/workerOwnership.test.ts --run` => PASS, `17/17`
  - `corepack pnpm --filter api exec vitest run src/router/workers-health-readiness.test.ts --run --sequence.concurrent=false` => PASS, `7/7`
  - `corepack pnpm --filter api run typecheck` => PASS
  - `git diff --check` => PASS with line-ending warnings only
- What is incomplete: production `/workers/ready` proof still requires deployed split workers with Redis and protected ops auth.
- Next steps: collect protected production `/workers/ready` split-worker readback after deploy.
- Decisions made: no BullMQ/new framework; Redis list + processing list + dedupe set is the safest local repair within existing dependencies.

## Reliability / Observability Evidence
- Critical user journey: backtest run submission and operator worker readiness.
- SLI: queued backtest durability across API/worker process split; required worker heartbeat freshness.
- SLO: `/workers/ready` should return `200` only when required split-worker families have fresh heartbeat proof.
- Error budget posture: burning until production split-worker readback passes.
- Health/readiness check: `/workers/ready`.
- Logs, dashboard, or alert route: worker bootstrap logs `worker_heartbeat` and `worker_heartbeat_record_failed`.
- Smoke command or manual smoke: protected `/workers/ready` after deployment.
- Rollback or disable path: set `WORKER_BACKTEST_OWNERSHIP=inline` only for local/degraded exception mode; otherwise revert this slice.
