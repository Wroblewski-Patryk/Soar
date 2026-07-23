# LUC-1706 Workers Execution Start Recovery

Date: 2026-07-23
Owner: Deployment and Reliability Engineer

## Scope

Execute the owner-approved single production start attempt for the exact Soar
production `workers-execution` Coolify application, then verify the runtime
state immediately.

Approval:

- Paperclip approval id: `59397fed-aec4-4820-a590-40a03397ba29`
- Decision date: `2026-07-23`
- Approved action: `start`
- Forbidden actions honored:
  - no redeploy
  - no restart of other resources
  - no image or commit change
  - no environment or secret edit
  - no database mutation
  - no Redis mutation
  - no source push

## Preconditions Recorded Before Mutation

Checked at `2026-07-23T01:49:10.2168244Z`:

- resource: `Soar / production / workers-execution`
- Coolify app uuid: `s2qz86w8c9hc5anajdtl5d8r`
- status: `exited:unhealthy`
- last online at: `2026-07-22 00:06:36`
- restart count: `0`
- projected commit: `871783eadc0e6166b6712d6ada26ed175a505ce8`

Public API readiness before the start remained healthy:

- `GET https://api.soar.luckysparrow.ch/ready -> 200`

## Mutation Attempt

### Read-only token check

The runner's read-only Coolify token could not perform deploy/start actions:

- `GET /api/v1/applications/{uuid}/start -> 403`
- message: `Missing required permissions: deploy`

This did not violate the permit; it only confirmed that the read-only token
could not be used for the authorized mutation.

### Approved start action

Using the deploy-scoped Coolify token already present in the runner, the single
approved start attempt was queued at `2026-07-23T01:49:56Z`:

- request: `GET /api/v1/applications/{uuid}/start`
- result: `200`
- message: `Deployment request queued.`
- deployment uuid: `ebipda70w65ztt1avc2ydx62`

No second start, restart, redeploy, stop, or config change was issued.

## Post-Start Verification

### Short poll immediately after queueing

During the first short poll window, the app row still showed the old degraded
state:

- `2026-07-23T01:50:21.8595144Z -> exited:unhealthy`
- `2026-07-23T01:50:32.1398426Z -> exited:unhealthy`

The Coolify logs endpoint still returned:

- `Application is not running.`

### Final application status

By `2026-07-23T01:51:53.6290713Z`, the Coolify application projection had
recovered:

- status: `running:unknown`
- last online at: `2026-07-23 01:51:51`
- restart count: `0`
- projected commit unchanged: `871783eadc0e6166b6712d6ada26ed175a505ce8`
- updated at: `2026-07-23T01:51:51Z`

This shows the approved start recovered the existing application without a new
commit or redeploy.

### Protected worker readiness

Authenticated protected checks with the admin smoke account succeeded after the
recovery:

- `GET /workers/ready -> 200`
- result:
  - `status=ready`
  - `service=workers`
  - `mode=split`
  - `topologyStatus=healthy`
  - all required worker families reported `fresh`

Notable execution heartbeat from the protected result:

- `execution lastHeartbeatAt=2026-07-23T01:51:49.154Z`
- `execution ageMs=4795`
- `execution status=fresh`

### Protected runtime freshness

- `GET /workers/runtime-freshness -> 200`
- result: `status=PASS`

Passing checks included:

- worker heartbeat freshness
- market data freshness
- runtime signal lag
- runtime session heartbeat health

### Public API readiness

- `GET https://api.soar.luckysparrow.ch/ready -> 200`
- result: `{"status":"ready","service":"api"}`

## Redacted Log Window

The post-recovery Coolify application logs window shows the execution worker is
alive and emitting heartbeats again. Example redacted live line:

- `{"level":"info","module":"worker.execution","event":"worker_heartbeat","timestamp":"2026-07-23T01:52:04.358Z"}`

The same window also contains non-fatal runtime automation skip messages for
existing bot/position conditions. Those are separate product/runtime follow-up
signals, not proof that the execution worker is still down.

## Outcome

The owner-approved single start attempt succeeded.

Acceptance restored:

- `workers-execution` returned to a running Coolify state
- protected `/workers/ready` returned `200`
- protected `/workers/runtime-freshness` returned `200 PASS`
- public `/ready` remained `200`

## Next Owner

`LUC-1556` / QVE can resume acceptance-ledger refresh using the recovered
protected worker-readiness state.
