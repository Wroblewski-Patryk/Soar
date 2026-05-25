# Task

## Header
- ID: LUC-19-RUNTIME-KNOWN-STATE-2026-05-25
- Title: Soar runtime, deployment, and environment known-state checkpoint
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Priority: P1
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: CHECKPOINTED

## Context
Issue lane `ops` required an explicit runtime known-state for local/stage/prod, startup commands, and deploy blockers before continuing Coolify stack rollout.

## Goal
Produce one evidence-backed runtime matrix and startup/smoke command map without exposing secrets.

## Scope
- `DEPLOYMENT_GATE.md`
- `.env.coolify.example`, `.env.docker.example`, `.env.vps.example`
- `docker-compose.yml`, `docker-compose.vps.yml`, `docker-compose.coolify.yml`
- `docs/operations/*` deployment/smoke/rollback docs
- `package.json` runtime and ops scripts

## Implementation Plan
1. Read canonical ops/runtime docs and mission state.
2. Extract local/stage/prod runtime contracts and required env variables.
3. Verify no-secret deploy tooling commands for Coolify stack config and env shape checks.
4. Record blockers, owners, and next executable steps.

## Acceptance Criteria
- Local/stage/prod matrix is explicit with service topology and env source.
- Startup/smoke commands are listed with evidence status.
- Active deployment blockers are explicit with named unblock owner/action.

## Definition of Done
- [x] Runtime known-state captured with source paths.
- [x] Verification commands executed and results recorded.
- [x] Blockers and next ops actions documented with owners.

## Forbidden
- No secret values in logs or documentation.
- No claim of deployment readiness without smoke/readiness evidence.
- No workaround bypass of documented Coolify stack gates.

## Result Report

### Environment Matrix (current truth)
| Environment | Runtime shape | Source of truth | Status |
| --- | --- | --- | --- |
| Local DEV | `pnpm` apps + optional `docker compose` infra (`postgres`, `redis`) | `README.md`, `docker-compose.yml`, `package.json` | implemented and verified |
| Local Docker parity | API/Web + 4 split workers + optional infra profile | `docker-compose.vps.yml`, `.env.docker.example`, `docs/operations/coolify-linux-vps-setup-guide.md` | implemented and verified |
| STAGE VPS | Declared as intentionally disabled/parked | `docs/operations/coolify-linux-vps-setup-guide.md`, `docs/operations/dev-stage-prod-environment-matrix.md` | present in code, behavior unknown |
| PROD VPS/Coolify | Preferred single Service Stack (`docker-compose.coolify.yml`) with external prod Postgres/Redis | `docker-compose.coolify.yml`, `.env.coolify.example`, ops guides | implemented but not verified |

### Verified commands (2026-05-25)
- `pnpm run docker:coolify:config` -> PASS (compose renders with six app services and `/health` API liveness check).
- `pnpm run ops:coolify-stack:env-check:example` -> PASS (`required present: 16/16`, redacted output).

### Startup and smoke command map
- Local app runtime: `pnpm run backend/dev`, `pnpm run frontend/dev` (workers auto-start from backend unless disabled).
- Local Docker parity: `pnpm run docker:app:config`, `pnpm run docker:app:build`, `pnpm run docker:app:up`, `pnpm run docker:app:ps`, teardown `pnpm run docker:app:down`.
- Coolify stack preflight: `pnpm run docker:coolify:config`, `pnpm run ops:coolify-stack:env-check`.
- Post-deploy smoke baseline: API `/health` + `/ready`, Web `/` + `/api/build-info`, auth/dashboard/worker checks per `docs/operations/post-deploy-smoke-checklist.md`.

### Active release blockers
1. Coolify stack cutover remains incomplete on production temp-domain redeploy path.
   - Status: blocked by error (previous startup gate used `/ready`; fixed locally to `/health`, pending redeploy proof).
   - Owner: Ops Release Lead.
   - Next action: redeploy parallel Service Stack, then run public smoke and worker stability checks.
2. Production readiness still requires protected evidence families (auth/context and release gate artifacts).
   - Status: blocked by error (missing protected input context and stale gate evidence in current mission files).
   - Owner: release owner/operator.
   - Next action: execute operator unblock packet with approved protected context.

## Validation Evidence
- `pnpm run docker:coolify:config` (PASS)
- `pnpm run ops:coolify-stack:env-check:example` (PASS)
- Documentation/code inspection of runtime contracts listed in Scope
- Reality status: partially verified

## Deployment / Ops Evidence
- Deploy impact: low (documentation/state sync only)
- Env or secret changes: none
- Health-check impact: none in this checkpoint (read-only verification)
- Smoke steps updated: no
- Rollback note: existing rollback path remains `docs/operations/deployment-rollback-playbook.md`
- Observability or alerting impact: none

