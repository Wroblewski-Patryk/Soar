# LUC-5866 Protected Gate And Blocked-Flow Evidence Packet

- Issue: [LUC-5866](/LUC/issues/LUC-5866)
- Baseline parent: [LUC-5860](/LUC/issues/LUC-5860)
- Checked at: 2026-06-28T07:47:57.306Z
- Owner lane: Deployment and Reliability Engineer
- Scope: read-only production protected-gate and blocked-flow evidence packet.

## Boundary

- No deploy, push, restart, rollback execution, env edit, secret/account
  readback, raw log capture, database/Redis mutation, production account
  mutation, subscription/payment mutation, exchange mutation, order, position,
  or live-trading action occurred.
- Secret values were not printed or written to evidence. The shell used the
  configured smoke login path after clearing only the process-local
  `SMOKE_AUTH_TOKEN` variable for the fresh-login proof run.

## Commands

### Current Binding Smoke

```powershell
pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result: expected `FAIL` because protected `/workers/ready` returned `401`.

Observed rows:

- `PASS API /health -> 200`
- `PASS API /ready -> 200`
- `PASS WEB / -> 200`
- `PASS WEB /api/build-info -> 200`
- `FAIL API /workers/ready -> status 401`

Interpretation: public API/Web are healthy. The currently pre-bound
`SMOKE_AUTH_TOKEN` still fails closed against the protected workers readiness
endpoint.

### Fresh-Login Protected Smoke

```powershell
$env:SMOKE_AUTH_TOKEN='';
pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result: `PASS`.

Observed rows:

- `PASS API /health -> 200`
- `PASS API /ready -> 200`
- `PASS WEB / -> 200`
- `PASS WEB /api/build-info -> 200`
- `PASS API /workers/ready -> 200`
- `deploy-smoke all checks passed`

Interpretation: the configured smoke login path can obtain fresh auth and pass
protected workers readiness.

### Rollback Guard With Fresh Login-Derived Auth

```powershell
$env:ROLLBACK_GUARD_AUTH_EMAIL=$env:SMOKE_AUTH_EMAIL;
$env:ROLLBACK_GUARD_AUTH_PASSWORD=$env:SMOKE_AUTH_PASSWORD;
$env:ROLLBACK_GUARD_AUTH_TOKEN='';
pnpm exec node scripts/evaluateRollbackGuard.mjs --base-url https://api.soar.luckysparrow.ch
```

Result: `PASS / shouldRollback=false`.

Key readback:

- `shouldRollback=false`
- `reasons=[]`
- workers ready: `status=ready`, `topologyStatus=healthy`
- required worker families: `backtest`, `execution`, `market-data`,
  `market-stream`
- runtime freshness: `PASS`
- runtime sessions: `runningCount=5`, `staleSessionIds=[]`
- runtime decision activity: `SKIP` because the optional check is disabled for
  running sessions
- alerts: `[]`

### Build-Info Readback

```powershell
Invoke-RestMethod -Uri 'https://soar.luckysparrow.ch/api/build-info' -Method Get
```

Result:

- `buildId=ashPFPbSl2ryB8Iu38hzi`
- `gitSha=3bd65e21d09f294a18d3317d2f59f7a0d4e577b4`
- `gitRef=main`
- `metadataGeneratedAt=2026-06-28T06:23:59.137Z`
- `metadataSource=env-runtime`
- `checkedAt=2026-06-28T07:47:57.306Z`

Interpretation: deployed Web surface is reachable. Release-grade build
provenance remains a separate residual because `env-runtime` is diagnostic
metadata, not authoritative deploy provenance.

## Gate Result

`VERIFIED_PRODUCTION / PROTECTED_WORKERS_READY_PASS / BLOCKED_FLOW_FAIL_CLOSED / STALE_SMOKE_AUTH_TOKEN_RESIDUAL`.

The protected gate packet requested by [LUC-5866](/LUC/issues/LUC-5866) is
complete for the [LUC-5860](/LUC/issues/LUC-5860) baseline. No DRE incident is
required from this heartbeat because the protected endpoint fails closed for
the stale token, passes with fresh smoke login, and rollback guard reports no
rollback reason.

## Blocked-Flow Classification From LUC-5860

`docs/status/app-completion-index.json` generated
`2026-06-28T07:43:49.789Z` reports `10` blocked items as flow-level counts.
Those blocked entries are not expanded as individually named rows in the
priority review queue (`blockedItemsInPriorityQueue=0`), so this packet
classifies them by flow, gate family, evidence path, and owner action.

| Flow | Blocked count | Gate family | Evidence path | Required owner/action | Child blocker |
| --- | ---: | --- | --- | --- | --- |
| Account access | 3 | Auth / owner path | Current packet plus [LUC-5634](/LUC/issues/LUC-5634), [LUC-5699](/LUC/issues/LUC-5699), and [LUC-5803](/LUC/issues/LUC-5803) production auth proof | QVE/CBE treat account access as verified by existing auth proof; Security/Ops cleans stale smoke token only if future protected smoke keeps receiving it | [LUC-5868](/LUC/issues/LUC-5868) for stale smoke-token cleanup |
| Subscription and entitlement | 7 | Subscription / auth / configuration | Current packet plus [LUC-5635](/LUC/issues/LUC-5635) subscription proof and same-day production acceptance evidence | SPA/CBE/QVE keep subscription proof closed from existing local evidence; no protected subscription mutation is required from DRE | none needed |

Classification result: no new deploy/Coolify, production-smoke, account
mutation, subscription/payment mutation, exchange/live-risk, or live-trading
blocked child is required from [LUC-5866](/LUC/issues/LUC-5866). The only new
owner-path follow-up created from this heartbeat is [LUC-5868](/LUC/issues/LUC-5868)
for the stale smoke-token runner binding.

## Residual Risk

- The pre-bound `SMOKE_AUTH_TOKEN` remains stale or invalid and returns `401`.
  Security/Ops should rotate or remove that binding through
  [LUC-5868](/LUC/issues/LUC-5868) if future DRE runners keep receiving it.
- Release-grade Web build provenance remains separate because build-info still
  reports `metadataSource=env-runtime`.
- Host-level VPS/proxy/container pressure and sanitized log-window proof remain
  unavailable in this DRE shell without approved read-only host-status
  credentials.
