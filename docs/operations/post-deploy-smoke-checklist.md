# Post-Deploy Smoke Checklist (Stage/Prod)

Date: 2026-04-03  
Scope: Manual + scripted smoke checks after deployment on target domains.

## Target Domains
- Web: `https://soar.luckysparrow.ch`
- API: `https://api.soar.luckysparrow.ch`

For STAGE use corresponding stage domains (`stage-soar` / `stage-api.soar`) when provisioned.

## Purpose
Quickly confirm that the deployed revision is operational for critical user flows before declaring rollout healthy.

## Preconditions
- Deployment finished with green build/migration/health gates.
- Candidate SHA and environment are known.
- Worker services are running.

## Smoke Checklist

### 1) API baseline
- `GET /health` returns `200`.
- `GET /ready` returns `200`.
- response time is within expected budget (no severe timeout).

### 2) Web baseline
- root page returns `200`.
- login page loads without runtime error.
- static assets load correctly (no broken chunks).

### 3) Auth baseline
- valid login works,
- protected route access works with active session,
- logout returns to expected public route.

### 4) Dashboard baseline
- `/dashboard` renders successfully,
- no fatal API fetch errors in main cards,
- auto-refresh baseline remains stable.

### 5) Bots runtime baseline
- active bot list endpoint responds,
- selected runtime view loads open positions/history/signal section,
- no `NO_SESSION` false-negative when bot is active.
- strategy drift triage:
  - `GET /dashboard/bots/strategy-drift` returns deterministic drift audit output.
  - if drift rows are present, run `POST /dashboard/bots/strategy-drift/repair` once and re-check drift output is cleared (or capture residual blockers with evidence).

### 6) Workers and queue baseline
- workers health/readiness is green,
- no crash-loop in worker logs,
- market/signal updates visible in runtime within expected interval.

### 7) Data write baseline (paper-safe)
- create one controlled paper bot/backtest action,
- verify expected rows persist and appear in UI.

### 8) Security baseline
- no secret exposure in logs/UI,
- unauthorized access to protected ops paths is denied.

## Pass/Fail Rules
- **PASS**: all required smoke items succeed.
- **FAIL**: any required item fails -> rollout marked degraded; trigger incident/rollback decision path.

## Evidence Recording
Record for each smoke run:
- environment (`stage`/`prod`),
- candidate SHA,
- checklist status per section,
- timestamp,
- operator identity,
- links to logs/screenshots (if failure).

Store evidence with release artifacts for audit and postmortem use.

## Canonical Operator Entry

When running the full V1 release gate, prefer:

```bash
pnpm run ops:release:v1:gate -- --base-url https://<target-api> --auth-token <ADMIN_JWT>
```

This wraps local quality/build/go-live gates plus post-deploy smoke,
runtime freshness, and rollback guard into one deterministic operator flow.
