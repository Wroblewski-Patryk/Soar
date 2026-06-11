# LUC-2874 Coolify Production Deploy Health Sweep

## Header
- ID: LUC-2874
- Title: Coolify production deploy health sweep
- Task Type: release
- Current Stage: verification
- Status: PARTIALLY_VERIFIED
- Owner: 09 DRE (Deployment & Reliability Engineer)
- Depends on: none
- Priority: P0
- Mission ID: LUC-2874-COOLIFY-PRODUCTION-DEPLOY-HEALTH-SWEEP-2026-06-07
- Mission Status: PARTIALLY_VERIFIED

## Context
Paperclip assigned LUC-2874 after fresh board/user observations that recent
Coolify deploys failed. The issue explicitly required a production deploy
health sweep without exposing credentials and without production mutation.

## Goal
Check Coolify/VPS deploy status, Soar project/environment/resources, source
commit, health endpoints, logs, rollback readiness, and post-deploy smoke
evidence in a read-only way. If diagnosis shows a required production mutation,
stop and require explicit approval.

## Scope
- Coolify project/environment/resource readback for Soar production.
- Public API/Web health and build-info checks.
- No-secret protected input readiness.
- Redacted log scan only; no raw log persistence.
- Paperclip child follow-up for read-only Web deployment mismatch diagnosis.

## Constraints
- No deploy, restart, rollback, env edit, database action, account action,
  protected smoke, secret readback, raw resource id persistence, screenshot, or
  live-trading action.
- Do not write secret values, tokens, cookies, raw logs, or private resource
  identifiers.
- Keep failed-deploy diagnosis separate from redeploy/restart approval.

## Validation Evidence
- Paperclip heartbeat-context for LUC-2874: PASS.
- Coolify read-only project/environment readback at
  `2026-06-07T16:32:22Z`: PASS.
  - Selector: `LuckySparrow`.
  - Project/environment lookup resolved the configured Soar production target.
  - Production inventory: six applications plus PostgreSQL and Redis.
  - Applications: `running:unknown`.
  - PostgreSQL: `running:healthy`.
  - Redis: `running:healthy`.
  - Global resources endpoint returned `17` visible rows; not used as release
    authority.
- Public deploy smoke:
  - `node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`
  - PASS: API `/health` `200`, API `/ready` `200`, Web `/` `200`, Web
    `/api/build-info` `200`.
- Expected-SHA public smoke:
  - `node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 56d8d440bfe0fd9ee692e9f669e35414d85d2493 --no-workers`
  - PASS for public endpoints and reported `gitSha`.
- Web build-info readback:
  - `gitSha=56d8d440bfe0fd9ee692e9f669e35414d85d2493`
  - `gitRef=main`
  - `metadataSource=github-branch`
  - `metadataGeneratedAt=2026-06-06T02:55:48.688Z`
  - Classification: public source-SHA check passes, but deploy provenance is
    not release-grade because `github-branch` is a branch-head fallback, not
    authoritative build metadata under `docs/operations/deployment-readiness-gates.md`.
- Current local source:
  - `git rev-parse HEAD` -> `ed0f1aeb0e60392fe553f46d4931f9d9742f6aec`
  - Branch: `main`.
  - Classification: local checkout is ahead of deployed public build; this is
    not a deploy failure by itself.
- Public endpoint latency readback:
  - API `/health`: `200`, about `5345ms`.
  - API `/ready`: `200`, about `4187ms`.
  - Web `/`: `200`, about `28390ms`.
  - Web `/api/build-info`: `200`, about `7257ms`.
  - Classification: endpoints are reachable, but Web root was slow in this
    single runner probe and should be treated as a performance observation, not
    an incident by itself.
- Protected input readiness:
  - `node scripts/checkProtectedInputReadiness.mjs`
  - Result: `PARTIAL`.
  - Present families: `PROD_UI_AUDIT_*` / `PROD_UI_*`.
  - Missing families: `LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`,
    `SOAR_PROD_*`, `PROD_DB_CHECK_*`, `PRODUCTION_DB_CHECK_*`, `RC_*`,
    `GATE*` / `GATE_*`.
- Coolify deployment history:
  - `GET /api/v1/deployments`, `?take=10`, and `?limit=10` all returned an
    empty list for this token.
  - `GET /api/v1/applications/<uuid>/deployments` returned `404`.
  - Classification: this runner can read project/resource status and app logs,
    but cannot prove deployment history from the available deployment endpoints.
- Redacted application log scan:
  - Raw logs were not persisted.
  - API and worker tails had no error-like markers in the scanned tails.
  - `soar-web` tail had `10` error-like lines and no secret-like markers.
  - Redacted symptom: `Failed to find Server Action "x". This request might be
    from an older or newer deployment.`
  - Classification: Web runtime shows a deployment/version mismatch symptom
    even though public endpoint smoke passes.
- `node scripts/waitForWebBuildInfo.mjs --build-info-url https://soar.luckysparrow.ch/api/build-info --expected-sha 56d8d440bfe0fd9ee692e9f669e35414d85d2493 --timeout-ms 5000 --interval-ms 1000`
  was attempted and timed out at the runner command timeout after repeated
  slow public readback. This does not change the direct build-info result.

## Architecture / Ops Evidence
- Architecture source reviewed: `docs/operations/coolify-vps-deployment-contract.md`,
  `docs/operations/service-topology.md`,
  `docs/operations/deployment-readiness-gates.md`,
  `docs/operations/deployment-rollback-playbook.md`,
  `docs/operations/post-deploy-smoke-checklist.md`.
- Fits approved architecture: yes.
- Mismatch discovered: yes, deploy provenance remains inconclusive because Web
  build-info uses `metadataSource=github-branch`.
- Decision required from user: yes for any restart, redeploy, rollback, env
  edit, protected smoke, or deeper production mutation.

## Result Report
- Task summary: read-only Coolify production health sweep completed. Public
  API/Web are reachable and current public source SHA readback is stable, but
  release-grade deploy provenance remains inconclusive and Web logs show a
  Server Action older/newer deployment mismatch symptom.
- Files changed: this task evidence file only.
- How tested: commands and API checks listed above.
- What is incomplete: protected `/workers/ready`, runtime freshness, rollback
  guard, production DB check, RC gate, and deployment-history proof remain
  blocked by missing protected input families or unavailable deployment-history
  API readback.
- Next steps: create or route a read-only follow-up lane to diagnose Web
  Server Action deployment mismatch and build-info provenance fallback. Any
  restart/redeploy/rollback requires explicit approval with affected resource,
  rollback path, and smoke plan.
- Decisions made: no production mutation was performed.

## Definition Of Done
- [x] Concrete read-only health checks were run.
- [x] Resource topology and public smoke evidence were recorded.
- [x] Protected and release-grade gaps were classified fail-closed.
- [x] No credentials, tokens, raw logs, or resource ids were persisted.
- [x] Follow-up ownership is routed through Paperclip.
