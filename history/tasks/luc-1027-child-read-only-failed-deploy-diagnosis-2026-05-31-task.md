# LUC-1027-CHILD - Read-only failed deploy diagnosis (2026-05-31)

## Context
Parent issue `LUC-1027` requires a dedicated read-only failed-deploy diagnosis lane, separate from protected smoke approval and any production mutation.

## Goal
Produce a no-secret operational diagnosis packet for recent Coolify/production failure state to route the next approved recovery action.

## Scope
- Read-only Coolify API inventory for Soar resources.
- Public canonical host probes (`api/web`).
- No deploy/restart/rollback/env mutation.

## Actions Executed
1. Queried Coolify read-only endpoints:
   - `GET /api/v1/projects`
   - `GET /api/v1/applications`
   - `GET /api/v1/resources`
   - `GET /api/v1/deployments`
2. Ran public production smoke probes:
   - `GET https://api.soar.luckysparrow.ch/health`
   - `GET https://api.soar.luckysparrow.ch/ready`
   - `GET https://soar.luckysparrow.ch/`
   - `GET https://soar.luckysparrow.ch/api/build-info`

## Diagnosis Result
- Public availability: failed (`503` across all four canonical probes).
- Coolify resource snapshot for Soar environment (`environment_id=6`):
  - `soar-api`: `exited:unhealthy`
  - `soar-web`: `exited:unhealthy`
  - `workers-backtest`: `exited:unhealthy`
  - `workers-execution`: `exited:unhealthy`
  - `workers-market-data`: `exited:unhealthy`
  - `workers-market-stream`: `exited:unhealthy`
  - shared `postgresql` + `redis`: `running:healthy`
- Deploy list API returned no recent deployment rows in this token context (`recent_deployments_top40=[]`), so deploy-object lineage remains unresolved in this lane.
- Additional drift detected: `COOLIFY_SOAR_PROJECT_ID` in this runtime resolves to project `n8n`, not `Soar` (resource view still exposes Soar env resources via global listing).

## Safety / Mutation Guard
- No mutation performed.
- No secret values printed.

## Disposition
`blocked`

## First-Class Unblock Owner / Action
1. Ops Release Lead + Coolify operator: under explicit release mutation permit, inspect failed Soar app deploy objects/logs for `environment_id=6` and publish root-cause statement with affected resources.
2. Security/ops credential owner: correct Soar project binding (or provide explicit approved query path) so read-only deploy-object lineage is deterministic for Soar lanes.
3. Only after approved permit: execute minimal production recovery mutation (if required) with rollback path + post-recovery smoke packet.

