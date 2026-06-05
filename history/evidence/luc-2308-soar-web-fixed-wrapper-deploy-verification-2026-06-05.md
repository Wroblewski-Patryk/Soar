# LUC-2308 Soar Web Fixed Wrapper Deploy Verification Evidence

- Date: 2026-06-05
- Owner: Ops Release Lead
- Scope: production `soar-web` recovery verification for fixed runtime wrapper source `a70d7881b69e605c537af5f81cbeb74dc81e9329`
- Resource: Coolify `Soar / production / soar-web`
- Secret handling: Coolify/Paperclip bindings were used only through configured environment variables; no secret values were printed or persisted.

## Result

Status: verified.

Production Web is serving the expected fixed wrapper build. No manual deploy,
restart, rollback, env edit, database action, Redis action, API/worker action,
account action, exchange mutation, or live-trading action was performed in this
heartbeat because the requested source had already converged in production by
the time Ops inspected it. Triggering a redundant redeploy after the expected
SHA was live would have added an avoidable production mutation.

## Source Ref Gate

| Check | Result |
| --- | --- |
| Local `HEAD` | `a70d7881b69e605c537af5f81cbeb74dc81e9329` |
| Branch | `main` |
| `origin/main` | `a70d7881b69e605c537af5f81cbeb74dc81e9329` |
| Worktree | Dirty before this heartbeat with pre-existing state/evidence/API changes; not used as deploy input |

## Coolify Readback

| Check | Result |
| --- | --- |
| Application readback | reachable |
| Resource name | `soar-web` |
| Resource UUID | `ato4fqkncd6t38wzlle2m0rv` |
| Status | `running:unknown` |
| FQDN | `https://soar.luckysparrow.ch/` |
| Branch | `main` |
| Dockerfile | `/apps/web/Dockerfile` |
| Visible active `soar-web` deployment rows | none |

Note: Coolify application metadata still reported an older stored
`git_commit_sha` value. Public `/api/build-info` is the acceptance signal for
the active served Web build and reported the required fixed SHA.

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

Direct build-info readback:

```json
{
  "buildId": "YUWo3Z4Ao_7ku0NkkgpQo",
  "gitSha": "a70d7881b69e605c537af5f81cbeb74dc81e9329",
  "gitRef": "main",
  "metadataGeneratedAt": "2026-06-05T21:34:43.237Z",
  "metadataSource": "github-branch",
  "checkedAt": "2026-06-05T21:38:17.100Z"
}
```

Direct `curl.exe` status probe:

```text
web_root=200
web_build_info=200
api_health=200
```

## Disposition

Done. The fixed `soar-web` runtime wrapper source is live and public Web has
recovered from the prior `503` state. Required no-workers smoke passed; broader
protected auth/dashboard/worker release smoke remains outside the narrow
[LUC-2308](/LUC/issues/LUC-2308) permit.
