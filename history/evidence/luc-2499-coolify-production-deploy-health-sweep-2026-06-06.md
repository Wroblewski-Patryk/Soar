# LUC-2499 Coolify Production Deploy Health Sweep

- Date: 2026-06-06
- Checked at: 2026-06-06T16:33:39Z
- Owner: 09 DRE (Deployment and Reliability Engineer)
- Scope: read-only Soar production deploy health, Coolify status projection,
  source/build-info freshness, logs summary, rollback readiness classification,
  and failed-deploy diagnosis routing.
- Secret handling: Coolify and smoke bindings were used only through configured
  environment variables. No token, cookie, password, account data, raw resource
  id, generated resource id, container id, internal network, host path, or secret
  value was printed or stored.

## Result

Status: partially verified.

Public API and Web production health are green for pushed source
`56d8d440bfe0fd9ee692e9f669e35414d85d2493`, and Coolify read-only project
projection resolves the canonical Soar production topology. The fresh deploy
diagnosis finding is on `soar-web`: Coolify application metadata still reports
`git_commit_sha=b894e5dd30614dfd2035e91e3d848c842d3ff380`, while public Web
build-info serves `56d8d440bfe0fd9ee692e9f669e35414d85d2493`. Web runtime logs
also contain recent Next.js Server Action mismatch errors. This does not require
an immediate restart or redeploy from this lane, but it does require a separate
read-only deploy-history/log correlation child lane before any mutation request.

No deploy, restart, rollback, env edit, database action, Redis action, team or
account change, protected account smoke, exchange mutation, or live-trading
action was performed.

## Wake / Adapter Context

- Wake reason: `missing_issue_comment`.
- Pending comments: `0/0`; fallback fetch was not needed.
- Previous heartbeat failed before useful work with adapter error:
  `EBUSY: resource busy or locked, copyfile ... auth.json`.
- Disposition: adapter failure is recorded as tooling/runtime failure only, not
  production health evidence.

## Source Ref Snapshot

| Check | Result |
| --- | --- |
| Local `HEAD` | `c3d1a67f876575f07cfa38c29fca2d00298648e7` |
| `origin/main` | `56d8d440bfe0fd9ee692e9f669e35414d85d2493` |
| Production Web build-info SHA | `56d8d440bfe0fd9ee692e9f669e35414d85d2493` |
| Source interpretation | production matches pushed `origin/main`; local `HEAD` is not the deployed source input |
| Worktree | dirty before this heartbeat with pre-existing docs/evidence/source changes; not used as deploy input |

## Public Smoke

Command:

```text
pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 56d8d440bfe0fd9ee692e9f669e35414d85d2493 --no-workers
```

Result:

```text
PASS API /health -> 200
PASS API /ready -> 200
PASS WEB / -> 200
PASS WEB /api/build-info (gitSha=56d8d440bfe0fd9ee692e9f669e35414d85d2493) -> 200 gitSha=56d8d440bfe0fd9ee692e9f669e35414d85d2493
```

Node public probes:

```text
api_health 200 bodyStatus=ok
api_ready 200 bodyStatus=ready
workers_ready_unauth 401
web_root 200
web_build_info 200 gitSha=56d8d440bfe0fd9ee692e9f669e35414d85d2493
```

## Coolify Read-Only Projection

Authenticated read-only calls succeeded for:

- current selector: `LuckySparrow`
- project: `Soar`
- environment: `production`
- production applications: `6`
- generic services: `0`
- PostgreSQL resources: `1`
- Redis resources: `1`
- global resource rows visible: `17`

Application projection:

| Resource | Status | Branch | Public FQDN |
| --- | --- | --- | --- |
| `soar-web` | `running:unknown` | `main` | `https://soar.luckysparrow.ch` |
| `soar-api` | `running:unknown` | `main` | `https://api.soar.luckysparrow.ch` |
| `workers-backtest` | `running:unknown` | `main` | none |
| `workers-market-stream` | `running:unknown` | `main` | none |
| `workers-execution` | `running:unknown` | `main` | none |
| `workers-market-data` | `running:unknown` | `main` | none |

Data resources:

| Resource type | Status |
| --- | --- |
| PostgreSQL | `running:healthy` |
| Redis | `running:healthy` |

Coolify deployment-list probes:

- `/api/v1/applications/{app}/deployments` returned `404` for Web/API.
- `/api/v1/deployments?application_uuid={app}` returned `200` but `0` rows for
  Web/API.
- `/api/v1/applications/{app}/logs` returned `200` for Web/API.

## Log Diagnosis

API log summary:

- char count: `2281`
- line count: `19`
- marker counts: none for `error`, `failed`, `exception`, `panic`, `crash`,
  `permission denied`, `missing`, `cannot find module`, `enoent`, or `ebusy`.
- tail includes successful `/health`, `/ready`, and fail-closed
  `/workers/ready` `401` requests from this sweep.

Web log summary:

- char count: `656`
- line count: `12`
- marker counts: `error=2`, `failed=4`.
- sanitized tail contains Next.js Server Action mismatch entries:
  `Failed to find Server Action "x". This request might be from an older or
  newer deployment.`

Web app metadata summary:

- `name=soar-web`
- `git_repository=Wroblewski-Patryk/Soar`
- `git_branch=main`
- `git_commit_sha=b894e5dd30614dfd2035e91e3d848c842d3ff380`
- `status=running:unknown`
- `ports_exposes=3002`

API app metadata summary:

- `name=soar-api`
- `git_repository=Wroblewski-Patryk/Soar`
- `git_branch=main`
- `git_commit_sha=HEAD`
- `status=running:unknown`
- `ports_exposes=3001`

## Rollback Readiness Classification

- Public rollback trigger is not currently met: public API/Web health and Web
  build-info are passing.
- Protected worker/dashboard/account/SLO/rollback/live runtime proof remains
  outside this read-only sweep and remains fail-closed through the protected
  release chain.
- Any production mutation remains blocked until a separate explicit
  redeploy/restart/rollback approval names the affected resource, source ref,
  rollback path, and smoke plan.

## Validation

- `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 56d8d440bfe0fd9ee692e9f669e35414d85d2493 --no-workers` -> PASS.
- Node public status probes -> API/Web public readiness PASS; unauthenticated
  worker readiness fail-closed with `401`.
- `pnpm run ops:coolify-stack:env-check:test` -> PASS, `8/8`.
- Read-only Coolify project/environment/resources/log projection -> PARTIAL:
  topology readback succeeded; deploy list endpoints did not expose deploy
  history rows; Web log and metadata mismatch require child diagnosis.

## Residual Risk

- Coolify application `running:unknown` remains an inventory metadata
  limitation.
- Web `git_commit_sha` metadata does not match current public build-info SHA.
- Web Server Action mismatch logs may reflect clients using an older/newer
  bundle after recent failed deploy/rollback activity.
- Protected `/workers/ready`, dashboard/auth, trading, exchange, account, SLO,
  rollback, and live runtime proof are not covered by this sweep.
