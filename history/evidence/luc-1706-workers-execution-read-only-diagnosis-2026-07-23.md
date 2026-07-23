# LUC-1706 Workers Execution Read-Only Diagnosis

Date: 2026-07-23
Owner: Deployment and Reliability Engineer

## Scope

Diagnose the remaining Soar production worker failure after the approved protected proof established that auth access is working and the stale worker is `execution`.

This lane remained read-only. No restart, start, redeploy, rollback, secret edit, database mutation, or other production mutation was performed.

## Inputs

- Issue: `LUC-1706`
- Prior protected proof disposition: `LUC-1568`
- Soar production protected result from 2026-07-23:
  - `GET /ready/details -> 200`
  - `GET /workers/ready -> 503`
  - `staleWorkers=["execution"]`
- Coolify read-only bindings present in the runner for the Soar production project/environment and application inventory.

## Read-Only Checks

### 1. Coolify application inventory projection

Authenticated read-only Coolify `GET /api/v1/applications` and `GET /api/v1/resources` projections showed:

- `workers-execution`
  - status: `exited:unhealthy`
  - branch: `main`
  - recorded commit: `871783eadc0e6166b6712d6ada26ed175a505ce8`
  - last online at: `2026-07-22 00:06:36`
  - updated at: `2026-07-22T00:07:36Z`
- Other Soar production resources remained up at the time of inspection:
  - `redis -> running:healthy`
  - `postgresql -> running:healthy`
  - `soar-api -> running:unknown`
  - `soar-web -> running:unknown`
  - `workers-backtest -> running:unknown`
  - `workers-market-data -> running:unknown`
  - `workers-market-stream -> running:unknown`

### 2. Coolify application logs endpoint

Using the official Coolify application logs endpoint for the execution worker:

- `GET /api/v1/applications/{uuid}/logs?lines=20 -> 400`
- response message: `Application is not running.`

This confirms the failure is not merely a stale heartbeat key. The execution-worker application is currently down at the Coolify application level.

### 3. Protected Soar route recheck from this runner

The runner's direct admin-smoke login path is not currently usable as a drop-in local cookie proof path:

- `POST /auth/login -> 400`
- protected route follow-up without an issued token remains `401 Missing token`

That did not block the runtime diagnosis because the earlier approved protected proof already established:

- protected API readiness is healthy; and
- protected worker readiness fails specifically on `execution`.

## Diagnosis

Current root-cause classification:

- `workers-execution` is down as a Coolify application (`exited:unhealthy`), not healthy-but-stale.
- Redis is healthy, so this heartbeat found no evidence that the remaining failure is the prior Redis incident.
- The approved protected proof already narrowed the failing worker to `execution`; the Coolify read-only check now narrows the runtime state further to `application not running`.

Most likely repair class:

- production application start/restart/redeploy for `workers-execution`, followed by protected worker-readiness recheck.

## Required Mutation Boundary

Recovering the execution worker now requires a production mutation, at minimum one of:

- start `workers-execution`;
- restart `workers-execution`; or
- redeploy `workers-execution` (and possibly the Soar worker set if the operator chooses a wider controlled action).

This lane does not have authority to perform that mutation without an explicit permit/approval attached to the issue.

## Recommended Next Action

Ops Release Lead / board-approved production mutation owner should issue a typed permit for the smallest safe action on:

- application: `Soar / workers-execution`
- environment: `production`
- branch/ref: `main`
- currently recorded Coolify commit for the worker app: `871783eadc0e6166b6712d6ada26ed175a505ce8`

Minimum permit packet should name:

- exact action (`start`, `restart`, or `redeploy`);
- target resource (`workers-execution`);
- rollback path;
- required post-mutation smoke:
  - protected `GET /workers/ready`
  - protected `GET /workers/runtime-freshness`
  - Coolify status projection for `workers-execution`

After the mutation executes, QVE can refresh the acceptance ledger from the protected result.
