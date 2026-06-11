# LUC-3515 Coolify Production Deploy Health Sweep

## Header
- ID: LUC-3515
- Title: [Soar] Coolify production deploy health sweep
- Task Type: release
- Current Stage: verification
- Status: PARTIALLY_VERIFIED
- Owner: 09 DRE (Deployment and Reliability Engineer)
- Parent: LUC-12
- Goal: Soar production deploy confidence
- Priority: critical
- Module Confidence Rows: SOAR-OPERATIONS-001 / Coolify production deploy health
- Mission ID: LUC-3515-COOLIFY-PRODUCTION-DEPLOY-HEALTH-SWEEP-2026-06-11
- Mission Status: PARTIALLY_VERIFIED / BLOCKED_ON_DEEPER_LOG_PROVENANCE

## Process Self-Audit
- [x] Issue-scoped wake was honored; checkout was already claimed by the harness and was not repeated.
- [x] DRE role boundaries were applied.
- [x] Production mutation, deploy, restart, rollback, env edit, database/Redis action, protected smoke, raw log capture, screenshot, and secret readback were excluded.
- [x] The smallest useful proof was executed: public no-worker smoke plus read-only Coolify metadata projection.
- [x] Residual blockers are explicit and fail-closed.

## Context
Board/operator observations that recent Coolify deploys failed are treated as
fresh operational facts. This heartbeat verified public production health and
read-only Coolify status without using protected app credentials or mutating
production. Earlier same-day failed-deploy diagnosis [LUC-3382](/LUC/issues/LUC-3382)
already established that the current token/API shape cannot see failed deploy
rows or raw deploy logs through the checked read-only endpoints.

## Goal
Check Coolify/VPS deploy status, Soar production resources, source commit
signals, public health endpoints, rollback/smoke readiness, and deploy-log
visibility without exposing credentials or mutating production.

## Constraints
- Use the Coolify hierarchy as source truth: project -> production environment -> resources.
- Do not store secret values, raw resource ids, cookies, passwords, private log bodies, or screenshots.
- Do not deploy, restart, rollback, edit env, read secret values, mutate DB/Redis, use production accounts, run protected smoke, or perform exchange/live-trading actions.
- Treat public build-info `metadataSource=github-branch` as diagnostic, not release-grade image provenance.

## Definition of Done
- [x] Paperclip heartbeat context read.
- [x] Public production API/Web smoke run.
- [x] Coolify read-only project/environment/resource status checked.
- [x] Failed-deploy log/history visibility classified.
- [x] Residual release gates named.
- [x] Project state evidence updated.

## Forbidden
- Production deploy/redeploy/restart/rollback.
- Environment, database, Redis, team, or account mutation.
- Protected app smoke without accepted principal/session path.
- Raw private log capture or raw UUID/resource-id persistence.
- Secret value disclosure.

## Validation Evidence
- Paperclip heartbeat context:
  - [LUC-3515](/LUC/issues/LUC-3515) is `in_progress`, critical, assigned to DRE, under parent [LUC-12](/LUC/issues/LUC-12), with no comments and no first-class blockers.
- Public direct probes:
  - `https://api.soar.luckysparrow.ch/health` -> `200`.
  - `https://api.soar.luckysparrow.ch/ready` -> `200`.
  - `https://soar.luckysparrow.ch/` -> `200`.
  - `https://soar.luckysparrow.ch/auth/login` -> `200`.
  - `https://soar.luckysparrow.ch/api/build-info` -> `200`, `gitSha=56d8d440bfe0fd9ee692e9f669e35414d85d2493`, `gitRef=main`, `metadataSource=github-branch`.
- Scripted public smoke:
  - `corepack pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 56d8d440bfe0fd9ee692e9f669e35414d85d2493 --no-workers` -> PASS.
  - PASS rows: API `/health`, API `/ready`, Web `/`, Web `/api/build-info`.
- Names-only binding scan:
  - Coolify binding names present: `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`, `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`, `COOLIFY_SOAR_WEB_APP_ID`, `COOLIFY_SOAR_API_APP_ID`, `COOLIFY_SOAR_TEAM_ID`, `COOLIFY_TEAM_ID`.
  - Smoke credential binding names are present, but protected worker smoke was not run from this lane.
- Coolify read-only API projection:
  - `GET /api/v1/version` -> `200`.
  - `GET /api/v1/teams/current` -> `200`, selector `LuckySparrow`.
  - `GET /api/v1/projects/{configured-project-id}` -> `200`, project `Soar`.
  - `GET /api/v1/projects/{configured-project-id}/{configured-production-environment}` -> `200`.
  - `GET /api/v1/resources` -> `200`, `17` visible global rows.
  - `GET /api/v1/deployments` -> `200`, `0` active deployment rows visible.
  - Production environment counts: `6` applications, `1` PostgreSQL, `1` Redis, `0` generic services.
- Application metadata:
  - `soar-web`: detail `200`, `serverStatus=true`, Coolify git commit metadata `b894e5dd30614dfd2035e91e3d848c842d3ff380`, restart count `0`.
  - `soar-api`: detail `200`, `serverStatus=true`, git commit metadata `HEAD`, restart count `0`.
  - `workers-backtest`: detail `200`, `serverStatus=true`, git commit metadata `HEAD`, restart count `0`.
  - `workers-execution`: detail `200`, `serverStatus=true`, git commit metadata `HEAD`, `lastRestartType=crash`, restart count `2`.
  - `workers-market-data`: detail `200`, `serverStatus=true`, git commit metadata `HEAD`, restart count `0`.
  - `workers-market-stream`: detail `200`, `serverStatus=true`, git commit metadata `HEAD`, restart count `0`.
  - All six application rows still report `running:unknown` in Coolify inventory.
- Deploy history/log metadata visibility:
  - For all six application resources, checked read-only candidate paths returned `404`: `deployments`, `deployment-history`, `deployments/history`, `logs/deployments`, and `deployment/logs`.
  - No raw private logs were fetched or persisted.

## Diagnosis
- Public API/Web production health is currently green for no-worker smoke.
- Production build-info proves the public Web reports SHA `56d8d440bfe0fd9ee692e9f669e35414d85d2493`, but `metadataSource=github-branch` means this is not release-grade deployed-image provenance.
- Coolify read-only project/environment access works and resolves the expected eight-resource topology.
- Coolify application inventory remains insufficient for app readiness because applications report `running:unknown`; PostgreSQL and Redis presence is verified through the production environment inventory, but this lane did not run database or Redis mutation/protected proof.
- Recent failed-deploy root-cause remains not visible to this token/API shape. The only failure-adjacent metadata visible is `workers-execution` crash restart metadata (`lastRestartType=crash`, `restartCount=2`).
- Existing [LUC-3382](/LUC/issues/LUC-3382) is the same-day read-only failed-deploy diagnosis lane. This heartbeat did not create a duplicate child because it refreshed the same evidence directly and found no new read-only endpoint visibility.

## Result Report
- Files changed:
  - `history/tasks/luc-3515-coolify-production-deploy-health-sweep-2026-06-11-task.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.agents/state/system-health.md`
  - `.agents/state/next-steps.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- Verification commands/checks run:
  - Paperclip heartbeat context read.
  - Direct public endpoint probes.
  - `corepack pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 56d8d440bfe0fd9ee692e9f669e35414d85d2493 --no-workers`.
  - Coolify read-only API projection and application metadata endpoint status checks.
- Commit SHA: not committed; the shared worktree already contains broad unrelated dirty state.
- Push status: not needed.
- Deploy impact: none.
- Residual risk:
  - Full release readiness remains blocked by protected `/workers/ready`, worker freshness, release-grade image provenance, rollback proof, restore drill, SLO evidence, release approval, and a deeper redacted Coolify failed-deploy log/export path.
  - Next owner/action: Ops/Security/Coolify operator must provide an approved redacted Coolify UI/operator deploy-log export or documented read-only deploy-log endpoint if root-cause beyond visible restart metadata is required. Any deploy/restart/rollback remains a separate approval-gated mutation.
