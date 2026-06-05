# Task

## Header
- ID: LUC-2278
- Title: Recover Soar production web deploy in Coolify after 6e31d814
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Ops/Release
- Priority: P0
- Mission ID: LUC-2278-RECOVER-SOAR-PRODUCTION-WEB-DEPLOY-AFTER-6E31D814-2026-06-05
- Mission Status: BLOCKED

## Context
Soar production API was healthy, but production Web was unavailable after the
pushed commit `6e31d814046b640ad529d1cd57f968ba6f67b05e`.

The Paperclip issue authorized one narrow production-impacting recovery action
against only the Coolify `soar-web` resource `ato4fqkncd6t38wzlle2m0rv`.

## Goal
Recover production Web so `https://soar.luckysparrow.ch/api/build-info`
returns `200` with a `gitSha` starting with `6e31d814`, while preserving API
health and avoiding Postgres, Redis, API env, worker, account, secret, and live
user-data mutation.

## Constraints
- Use bound Coolify credentials only.
- Do not print secret values.
- Trigger at most one single-resource Web redeploy/restart.
- Do not touch Postgres, Redis, API env, workers, or live user data.
- Stop after failed convergence instead of issuing repeated mutations.

## Definition of Done
- [x] Source ref confirmed: local `HEAD` and `origin/main` both resolve to
      `6e31d814046b640ad529d1cd57f968ba6f67b05e`.
- [x] Coolify Web resource inspected with allowlisted metadata.
- [x] Exactly one Web-only Coolify deploy trigger issued.
- [x] API health rechecked.
- [x] Web build-info convergence checked.
- [x] Residual blocker recorded when recovery did not complete.

## Forbidden
- Repeated deploy/restart attempts.
- Database, Redis, API, worker, env, account, secret, or live-trading mutation.
- Raw secret value or raw sensitive log persistence.

## Validation Evidence
- Source control:
  - `git status --short --branch` -> `## main...origin/main`
  - `git rev-parse HEAD` -> `6e31d814046b640ad529d1cd57f968ba6f67b05e`
  - `git ls-remote origin refs/heads/main` -> same SHA
- Pre-action Coolify Web metadata:
  - resource: `soar-web`
  - uuid: `ato4fqkncd6t38wzlle2m0rv`
  - fqdn: `https://soar.luckysparrow.ch/`
  - status: `restarting:unknown`
  - repository: `Wroblewski-Patryk/Soar`
  - branch: `main`
  - git commit setting: `HEAD`
- Pre-action deployment history:
  - visible rows included `in_progress` deployments for
    `b894e5dd30614dfd2035e91e3d848c842d3ff380`
  - visible rows also included queued deployments for
    `6e31d814046b640ad529d1cd57f968ba6f67b05e`
- Production mutation:
  - one `POST /api/v1/deploy?uuid=ato4fqkncd6t38wzlle2m0rv&force=false`
    request returned successfully.
- Convergence:
  - `node scripts/waitForWebBuildInfo.mjs --web-base-url https://soar.luckysparrow.ch --expected-sha 6e31d814 --timeout-seconds 600 --interval-seconds 20 --request-timeout-ms 15000`
    timed out after 30 attempts.
  - every successful poll returned status `503`; one attempt aborted by request
    timeout.
- Final public endpoint checks:
  - `https://api.soar.luckysparrow.ch/health` -> `200 OK`
  - `https://soar.luckysparrow.ch/api/build-info` -> `503 Service Unavailable`
    with body `no available server`
- Final Coolify state:
  - Web resource still `restarting:unknown`
  - deployment queue still shows older `b894e5dd...` in-progress rows and
    `6e31d814...` queued rows.
- Reality status: blocked

## Deployment / Ops Evidence
- Deploy impact: high, production Web only.
- Env or secret changes: none.
- Health-check impact: API health remains `200`; Web remains unavailable.
- Smoke steps updated: no.
- Rollback note: no rollback was performed; repeated mutation is blocked until
  Coolify deployment queue/runtime intervention clears the stale Web state.
- Observability or alerting impact: Web public availability remains failed.
- Staged rollout or feature flag: not applicable.

## Result Report
- Task summary: Performed the authorized one-time single-resource Web deploy
  trigger for `soar-web`. Recovery did not complete within the 10-minute
  convergence window.
- Files changed:
  - `history/tasks/luc-2278-recover-soar-production-web-deploy-after-6e31d814-2026-06-05-task.md`
  - `history/evidence/luc-2278-soar-web-coolify-recovery-attempt-2026-06-05.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `.agents/state/system-health.md`
- How tested: source-ref verification, Coolify allowlisted metadata/deployment
  readback, one Coolify deploy trigger, Web build-info polling, API health
  probe, final Coolify state readback.
- What is incomplete: production Web still returns `503`; expected SHA is not
  observable on `/api/build-info`.
- Next steps: Coolify/platform owner must clear or complete the stuck Web
  deployment queue/runtime state for `soar-web`, then rerun public Web
  build-info and API health verification.
