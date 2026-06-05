# LUC-2321 Coolify Production Deploy Health Sweep

- Date: 2026-06-06
- Checked at: 2026-06-05T22:33:41Z
- Owner: Ops Release Lead
- Scope: read-only Soar production deploy health sweep
- Resource model: Coolify `Soar / production / resources`
- Secret handling: Coolify bindings were used only through configured environment variables; no secret values, raw resource ids, generated names, container ids, internal networks, host paths, cookies, tokens, account data, exchange credentials, or environment values were printed or persisted.

## Result

Status: verified.

Public API and Web readiness are green, production Web build-info serves the
expected pushed `main` SHA, and read-only Coolify projection still resolves the
canonical Soar production topology. No deploy, restart, rollback, env edit,
database action, Redis action, team/account change, protected account smoke,
exchange mutation, or live-trading action was performed.

## Source Ref Snapshot

| Check | Result |
| --- | --- |
| Local `HEAD` | `10f1cfce94533e96a65b487d8cd0b1e9dff8f59e` |
| `origin/main` | `a70d7881b69e605c537af5f81cbeb74dc81e9329` |
| Production build-info SHA | `a70d7881b69e605c537af5f81cbeb74dc81e9329` |
| Source interpretation | production matches pushed `origin/main`; local `HEAD` is not treated as deployed source |
| Worktree | dirty before this heartbeat with pre-existing state/evidence/docs changes; not used as deploy input |

## Public Smoke

Command:

```text
pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha a70d7881b69e605c537af5f81cbeb74dc81e9329 --no-workers
```

Result:

```text
PASS API /health -> 200
PASS API /ready -> 200
PASS WEB / -> 200
PASS WEB /api/build-info (gitSha=a70d7881b69e605c537af5f81cbeb74dc81e9329) -> 200 gitSha=a70d7881b69e605c537af5f81cbeb74dc81e9329
```

Direct spot checks:

```text
web_root=200
api_health=200
api_ready=200
workers_ready_unauth=401
```

Build-info readback:

```json
{
  "buildId": "YUWo3Z4Ao_7ku0NkkgpQo",
  "gitSha": "a70d7881b69e605c537af5f81cbeb74dc81e9329",
  "gitRef": "main",
  "metadataGeneratedAt": "2026-06-05T21:34:43.237Z",
  "metadataSource": "github-branch",
  "checkedAt": "2026-06-05T22:32:45.325Z"
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
```

Authenticated read-only projection:

| Check | Result |
| --- | --- |
| Project | `Soar` |
| Environments | `production` |
| Production environment id | `6` |
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

- `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha a70d7881b69e605c537af5f81cbeb74dc81e9329 --no-workers` -> PASS.
- `pnpm run ops:coolify-stack:env-check:test` -> PASS, `8/8`.
- Direct public curl spot checks -> API/Web public readiness PASS; unauthenticated worker readiness fail-closed with `401`.
- Read-only Coolify project/environment/resources projection -> PASS.

## Residual Risk

- This sweep does not replace protected principal-based worker readiness,
  dashboard/auth, trading, exchange, or account smoke.
- Local `HEAD` is ahead of `origin/main`; no deploy should target local
  `10f1cfce94533e96a65b487d8cd0b1e9dff8f59e` unless it is intentionally
  reviewed, pushed, and authorized by a separate release task.
