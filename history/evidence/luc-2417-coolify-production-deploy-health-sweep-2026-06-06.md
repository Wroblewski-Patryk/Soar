# LUC-2417 Coolify Production Deploy Health Sweep

- Date: 2026-06-06
- Checked at: 2026-06-06T04:32:49Z
- Owner: 09 DRE (Deployment and Reliability Engineer)
- Scope: read-only Soar production deploy health sweep
- Resource model: Coolify `Soar / production / resources`
- Secret handling: Coolify bindings were used only through configured environment variables; no secret values, raw resource ids, generated names, container ids, internal networks, host paths, cookies, tokens, account data, exchange credentials, or environment values were printed or persisted.

## Result

Status: verified.

Public API and Web readiness are green, production Web build-info serves the
current pushed `main` SHA, and read-only Coolify projection still resolves the
canonical Soar production topology. No deploy, restart, rollback, env edit,
database action, Redis action, team/account change, protected account smoke,
exchange mutation, or live-trading action was performed.

## Source Ref Snapshot

| Check | Result |
| --- | --- |
| Local `HEAD` | `56d8d440bfe0fd9ee692e9f669e35414d85d2493` |
| `origin/main` | `56d8d440bfe0fd9ee692e9f669e35414d85d2493` |
| Production build-info SHA | `56d8d440bfe0fd9ee692e9f669e35414d85d2493` |
| Source interpretation | production matches current pushed `origin/main` and local `HEAD` |
| Worktree | dirty before this heartbeat with pre-existing state/evidence/docs changes; not used as deploy input |

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

Direct spot checks:

```text
api_health 200
api_ready 200
web_root 200
web_build_info 200
workers_ready_unauth 401
```

Build-info readback:

```json
{
  "buildId": "Xnn0H5fuVVTeahYMA8tvy",
  "gitSha": "56d8d440bfe0fd9ee692e9f669e35414d85d2493",
  "gitRef": "main",
  "metadataGeneratedAt": "2026-06-06T02:55:48.688Z",
  "metadataSource": "github-branch",
  "checkedAt": "2026-06-06T04:32:16.620Z"
}
```

## Coolify Read-Only Projection

Bindings checked by name only:

```text
COOLIFY_BASE_URL=present
COOLIFY_API_TOKEN=present
COOLIFY_TOKEN=present
COOLIFY_SOAR_PROJECT_ID=present
COOLIFY_SOAR_TEAM_ID=present
COOLIFY_SOAR_PRODUCTION_ENVIRONMENT=present
```

Authenticated read-only projection:

| Check | Result |
| --- | --- |
| Project | `Soar` |
| Environments | `production` |
| Production applications | `6` |
| Production generic services | `0` |
| Production PostgreSQL resources | `1` |
| Production Redis resources | `1` |
| Global resources visible | `17` |

Application projection:

| Resource | Status | Branch | Public FQDN |
| --- | --- | --- | --- |
| `soar-api` | `running:unknown` | `main` | `https://api.soar.luckysparrow.ch/` |
| `soar-web` | `running:unknown` | `main` | `https://soar.luckysparrow.ch/` |
| `workers-backtest` | `running:unknown` | `main` | none |
| `workers-execution` | `running:unknown` | `main` | none |
| `workers-market-data` | `running:unknown` | `main` | none |
| `workers-market-stream` | `running:unknown` | `main` | none |

Data resources:

| Resource type | Status |
| --- | --- |
| PostgreSQL | `running:healthy` |
| Redis | `running:healthy` |

Note: Coolify application `running:unknown` is a metadata limitation already
tracked in Ops state. Public API/Web health and protected worker readiness
proof remain separate acceptance signals.

## Validation

- `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 56d8d440bfe0fd9ee692e9f669e35414d85d2493 --no-workers` -> PASS.
- `pnpm run ops:coolify-stack:env-check:test` -> PASS, `8/8`.
- Direct public curl spot checks -> API/Web public readiness PASS; unauthenticated worker readiness fail-closed with `401`.
- Read-only Coolify project/environment/resources projection -> PASS.

## Residual Risk

- This sweep does not replace protected principal-based worker readiness,
  dashboard/auth, trading, exchange, account, SLO, rollback, or live runtime
  proof.
- Application resource health remains `running:unknown` in Coolify metadata;
  public API/Web health and protected worker proof remain the acceptance
  signals.
