# Deployment Readiness Gates (Web/API/Workers)

Date: 2026-04-03  
Scope: Standardized gate contract for production rollout decisions.

## Goal
Provide one deterministic gate pack for deployment and post-deploy verification.

Stage is parked as of 2026-04-29. The old `.github/workflows/stage-gates.yml`
entry point has been removed so unused stage resources do not redeploy on push.

## Gate Categories

Deployment entry point:
- Coolify/manual operator deployment for the selected production SHA.
- GitHub Actions is not used for production deployment in the active setup.
- Required production access remains owned by the operator/Coolify, not by
  repository GitHub Actions secrets.

### G1 - Build Gate
Required:
- `api` build succeeds.
- `web` build succeeds.
- no fatal dependency/install errors.

Failure effect: candidate blocked.

### G2 - Migration Gate
Required:
- migration status check succeeds,
- migration deploy step succeeds,
- no schema drift that invalidates rollout.

Failure effect: candidate blocked (no promotion).

### G3 - API Health/Readiness Gate
Required responses:
- `GET /health` -> HTTP `200`,
- `GET /ready` -> HTTP `200`.

Time budget:
- readiness must become green within configured rollout timeout.

Failure effect: prod rollback trigger if post-deploy.

### G4 - Web Availability Gate
Required:
- web root route returns HTTP `200`,
- web can reach API baseline endpoint through configured `NEXT_PUBLIC_API_BASE_URL`.

Failure effect: prod rollback trigger if post-deploy.

### G5 - Workers Readiness Gate
Required:
- worker service/processes are running,
- worker readiness signal is healthy (`/workers/health` and `/workers/ready` via API),
- no startup crash loop for execution/market workers.

Failure effect: prod rollback trigger if post-deploy.

### G6 - Smoke Gate
Required minimal smoke:
- login/session baseline works,
- dashboard baseline route loads,
- bot runtime read-model endpoint responds for active bot context.

Failure effect: candidate blocked from promotion.

### G7 - Runtime Freshness + Cache/Stream Gate
Required:
- `GET /workers/runtime-freshness` returns `200` with `status=PASS`,
- no rollback-critical runtime alerts are active (`worker_heartbeat_missing`, `market_data_staleness`, `runtime_signal_lag_stale`, `runtime_restarts_repeated(SEV-1)`, `runtime_reconciliation_drift(SEV-1)`),
- protected API routes maintain no-store cache contract (`/auth`, `/dashboard`, `/admin`),
- market stream freshness remains within configured threshold.

Failure effect: prod rollback trigger condition (runtime-critical regression).

## Prod Post-Deploy Rule
After deployment, required post-deploy verification includes:
- G3 API,
- G4 Web,
- G5 Workers,
- G7 Runtime freshness + cache/stream.

If any required post-deploy gate fails -> automatic rollback policy applies.

## Evidence Contract
Each gate run must produce machine-readable output:
- `gateId`,
- `status` (`PASS`/`FAIL`),
- `timestamp`,
- `candidateSha`,
- `environment`,
- `details` (error message or diagnostic payload).

Gate evidence is mandatory for release sign-off and incident audit trail.

## Fail-Closed Principle
Missing or inconclusive gate evidence is treated as `FAIL`.

No gate may be skipped for production release sign-off.
