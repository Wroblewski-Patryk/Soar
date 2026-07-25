# Task

## Header
- ID: LUC-1882
- Title: [Soar][Coolify Credential Routing Repair] Recover workers-market-data with deploy token
- Task Type: release
- Current Stage: release
- Status: DONE
- Owner: Ops/Release
- Depends on: deploy-capable Coolify token for the exact `workers-market-data` mutation
- Priority: P0
- Module Confidence Rows: not applicable
- Requirement Rows: not applicable
- Quality Scenario Rows: production worker readiness; Coolify credential routing
- Risk Rows: production runtime health; bounded deployment mutation
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-1882-WORKERS-MARKET-DATA-DEPLOY-TOKEN-2026-07-25
- Mission Status: DONE

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] Exactly one priority issue is selected.
- [x] Work stayed inside the DRE role boundary.
- [x] The task remained limited to one resource and one credential path.
- [x] Durable evidence and source-of-truth updates are included.

## Mission Block
- Mission objective:
  use the newly bound deploy-capable Coolify token to recover exactly one
  production worker application: `workers-market-data`.
- Included slices:
  pre-readback, one targeted `start`, deployment polling, application readback,
  public smoke, and state/evidence sync.
- Explicit exclusions:
  no unrelated resource mutation, no deploy/rollback program, no env edit, no
  protected account smoke, no secret disclosure.
- Stop conditions:
  deployment finished and worker recovered; or the deploy token still failed; or
  a new first-class runtime blocker appeared.

## Context
Previous owner-path retries on Saturday, July 25, 2026 proved the read-only
Coolify token could not execute
`POST /api/v1/applications/{workers-market-data}/start`, always returning
`403 Missing required permissions: deploy`. This issue exists to retry the
exact same bounded recovery action with the newly present
`COOLIFY_DEPLOY_API_TOKEN` and verify the runtime result.

## Goal
Recover `workers-market-data` through one deploy-token Coolify action and leave
fresh operational proof.

## Deliverable For This Stage
A release-lane evidence packet proving whether the deploy token repaired the
exact Coolify mutation boundary and whether the worker recovered.

## Constraints
- use existing systems and approved mechanisms
- do not create workarounds or parallel recovery paths
- do not print token values, cookies, or raw secret material
- do not broaden scope beyond `workers-market-data`

## Definition of Done
- [x] one exact `workers-market-data` start mutation was attempted with the deploy token
- [x] deployment queue/deployment completion state was recorded
- [x] post-action worker state was recorded
- [x] public smoke was refreshed with a working runner-safe command path

## Forbidden
- repeated uncontrolled mutations
- unrelated resource deploy/restart/rollback
- env, team, database, or account mutation
- secret disclosure

## Validation Evidence
- Tests:
  not applicable; no product code changed.
- Manual checks:
  read-only `GET /api/v1/applications/{workers-market-data}`,
  deploy-token `POST /api/v1/applications/{workers-market-data}/start`,
  read-only `GET /api/v1/deployments/{deployment_uuid}`,
  read-only application polling, and public smoke via `curl.exe`.
- Screenshots/logs:
  none; only allowlisted API fields were retained.
- High-risk checks:
  one targeted mutation only; no unrelated production state changed.
- Reality status:
  done

## Deployment / Ops Evidence
- Deploy impact:
  one targeted Coolify application start for `workers-market-data`.
- Env or secret changes:
  none; existing injected bindings were used without value disclosure.
- Health-check impact:
  public Web `/`, API `/health`, and API `/ready` all returned `200` after the
  worker recovery.
- Rollback note:
  not needed for this issue because the exact target recovered and no broader
  deployment program was triggered.
- Observability or alerting impact:
  deployment UUID and post-action worker timestamps isolate the exact recovery.

## Result Report
- Pre-state:
  `workers-market-data -> exited:unhealthy`,
  `last_online_at=2026-07-25 18:17:37`,
  `git_commit_sha=ca712e98b70e157b643db4f57726a02821a140bc`.
- Exact deploy-token action:
  `POST /api/v1/applications/{workers-market-data}/start -> 200`
  with `Deployment request queued.` and deployment
  `fd5ok3jdxg69lonnyeyagt9y`.
- Deployment follow-up:
  `fd5ok3jdxg69lonnyeyagt9y -> finished`
  at `2026-07-25T21:25:19.000000Z`.
- Post-state:
  `workers-market-data -> running:unknown`,
  `last_online_at=2026-07-25 21:26:35`,
  unchanged app commit SHA
  `ca712e98b70e157b643db4f57726a02821a140bc`.
- Public smoke:
  `https://soar.luckysparrow.ch -> 200`,
  `https://api.soar.luckysparrow.ch/health -> 200`,
  `https://api.soar.luckysparrow.ch/ready -> 200`.
- Outcome:
  the credential-routing repair is complete for the exact
  `workers-market-data` mutation boundary.

## Evidence
- `history/evidence/luc-1882-workers-market-data-deploy-token-recovery-2026-07-25.md`
