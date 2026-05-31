# LUC-1027 Coolify Production Deploy Health Sweep (2026-05-31)

- Timestamp (UTC): 2026-05-31T04:12:00Z
- Lane: Ops Release Lead
- Scope: Read-only production deploy health sweep (no production mutation)
- Wake acknowledgement: `issue_assigned` consumed from inline payload (`fallbackFetchNeeded=false`, comments `0/0`).

## Source Ref Snapshot
- Local `HEAD`: `83ddd20e3046926b214e380d57d0701e642260c2`
- Local `origin/main`: `2dc983ced4a4c66e31e7f37264710c124955e57b`

## Public Health / Build-Info (Canonical Hosts)
- `GET https://api.soar.luckysparrow.ch/health -> 503`
- `GET https://api.soar.luckysparrow.ch/ready -> 503`
- `GET https://soar.luckysparrow.ch/ -> 503`
- `GET https://soar.luckysparrow.ch/api/build-info -> 503`

Command:
- `node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --skip-workers`

Outcome:
- `[deploy-smoke] failed checks: 4`
- All public probes failed with `503` in the same interval.

## Safety / Mutation Guard
- No deploy/restart/rollback/env/database mutation was performed.
- No secret values were printed or stored.

## Ops Disposition
- `blocked`

### First-Class Unblock Owner / Action
1. Ops Release Lead + platform/Coolify runtime owner restore canonical production availability and publish no-mutation incident note for the `503` interval.
2. After availability recovery, rerun one read-only production health sweep and publish fresh SHA/build-info/readiness evidence.

## 2026-05-31 Continuation Delta (finish_successful_run_handoff)
- Wake was acknowledged first from inline payload (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
- Required by wake objective, a dedicated read-only failed-deploy diagnosis child lane was executed and captured in:
  - `history/tasks/luc-1027-child-read-only-failed-deploy-diagnosis-2026-05-31-task.md`
- New read-only diagnosis facts:
  - Coolify resource snapshot shows all Soar applications in `environment_id=6` as `exited:unhealthy`.
  - Soar Postgres/Redis resources remain `running:healthy`.
  - Coolify deployments API in this token context returned no recent deployment rows.
  - Runtime binding drift exists: configured `COOLIFY_SOAR_PROJECT_ID` currently resolves to project `n8n`, not `Soar`.
- Disposition remains `blocked` until owner actions in the child-lane packet are completed.
