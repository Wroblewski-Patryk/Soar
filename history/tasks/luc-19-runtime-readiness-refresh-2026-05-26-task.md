# Task

## Header
- ID: LUC-19-RUNTIME-READINESS-REFRESH-2026-05-26
- Title: Refresh public runtime readiness evidence for Soar ops lane
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Priority: P1
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: CHECKPOINTED

## Context
Board comment requested continuation in the same narrow ops lane after auth/inbox recovery, with durable evidence and honest status.

## Goal
Refresh current public runtime/deploy evidence and confirm stack manifest preflight remains valid.

## Scope
- Public endpoints:
  - `https://api.soar.luckysparrow.ch/health`
  - `https://api.soar.luckysparrow.ch/ready`
  - `https://soar.luckysparrow.ch/`
  - `https://soar.luckysparrow.ch/api/build-info`
- Stack preflight:
  - `pnpm run docker:coolify:config`
  - `pnpm run ops:coolify-stack:env-check:example`

## Acceptance Criteria
- Fresh timestamped public health/build-info evidence captured.
- Stack config/env-check commands re-validated without secrets.
- Remaining blocker is explicit with owner/action.

## Result Report

### Public runtime snapshot (2026-05-25 23:15-23:17 UTC)
- `GET /health` => `200` (`api.soar.luckysparrow.ch`)
- `GET /ready` => `200` (`api.soar.luckysparrow.ch`)
- `GET /` => `200` (`soar.luckysparrow.ch`)
- `GET /api/build-info` => `200` with:
  - `gitSha`: `4c16305c97566b7680f4feb041601af2af0a0d31`
  - `gitRef`: `main`
  - `metadataSource`: `github-branch`
  - `checkedAt`: `2026-05-25T23:15:30.527Z`

### Stack preflight snapshot
- `pnpm run docker:coolify:config` => PASS
  - API healthcheck renders with `/health` liveness gate.
- `pnpm run ops:coolify-stack:env-check:example` => PASS
  - `required present: 16/16`
  - redacted output (variable names only).

### Current status
- Public no-secret runtime reachability: implemented and verified.
- Preferred one-stack Coolify migration: implemented but not verified end-to-end in this heartbeat (no temp-domain stack redeploy evidence captured here).

### Active blocker and owner
1. Parallel stack redeploy smoke proof is still missing for this run.
   - Status: blocked by error (missing deploy-side evidence, not public endpoint outage).
   - Owner: Ops Release Lead.
   - Next action: execute temp-domain stack redeploy and capture API/Web/build-info/worker liveness proof tied to target SHA.
2. Protected release evidence families remain outside this no-secret checkpoint.
   - Status: blocked by error.
   - Owner: release owner/operator.
   - Next action: provide approved protected context and refresh protected gate artifacts.

## Validation Evidence
- `curl.exe -sS -D - https://api.soar.luckysparrow.ch/health -o NUL`
- `curl.exe -sS -D - https://api.soar.luckysparrow.ch/ready -o NUL`
- `curl.exe -sS -D - https://soar.luckysparrow.ch/ -o NUL`
- `curl.exe -sS https://soar.luckysparrow.ch/api/build-info`
- `pnpm run docker:coolify:config`
- `pnpm run ops:coolify-stack:env-check:example`

Reality status: partially verified

