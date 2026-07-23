# LUC-1556 Redis Recovery Verification Ledger Refresh

Date: 2026-07-23
Owner: QA and Verification Engineer

## Scope

Refresh the `LUC-1556` acceptance-ledger state after the Redis cache-only
recovery chain and the follow-up `workers-execution` recovery, using fresh
read-only proof from the current runner plus accepted dependency evidence where
this runner still lacks a direct shell path.

## Dependency State Consumed

- `LUC-1568` is complete and confirms the protected-proof/auth-path blocker is
  resolved.
- `LUC-1569` is complete and provides accepted managed read-only evidence for
  protected readiness plus Coolify resource health, including
  `redis -> running:healthy`.
- `LUC-1706` is complete in workspace evidence and shows the single approved
  start action recovered `workers-execution`, after which protected
  `/workers/ready` and `/workers/runtime-freshness` both passed.

## Fresh Checks From This Runner

### Public production smoke

- `GET https://api.soar.luckysparrow.ch/health -> 200`
  - body: `{"status":"ok","service":"api","timestamp":"2026-07-23T01:59:04.487Z"}`
- `GET https://api.soar.luckysparrow.ch/ready -> 200`
  - body: `{"status":"ready","service":"api"}`
- `GET https://soar.luckysparrow.ch/api/build-info -> 200`
  - `gitSha=b0b2c2ce9477a32fcda7717f447ad46aa4327589`
  - `gitRef=main`
  - `metadataSource=env-runtime`
  - `checkedAt=2026-07-23T01:59:04.908Z`

### Protected readiness proof

The current runner does not expose generic `SMOKE_AUTH_*` env names, but it
does expose the specific managed admin-smoke bindings:

- `SOAR_PROD_ADMIN_SMOKE_EMAIL`
- `SOAR_PROD_ADMIN_SMOKE_PASSWORD`

Using that approved login path against
`https://api.soar.luckysparrow.ch` produced:

- `POST /auth/login -> 200` with a session cookie token issued
- `GET /ready/details -> 200`
  - `status=ready`
  - `service=api`
  - `missing=[]`
  - `issues=[]`
- `GET /workers/ready -> 200`
  - `status=ready`
  - `service=workers`
  - `mode=split`
  - `environment=deployed`
  - `topologyStatus=healthy`
  - required worker families fresh:
    - `backtest`
    - `execution`
    - `market-data`
    - `market-stream`
- notable execution heartbeat from this rerun:
  - `lastHeartbeatAt=2026-07-23T01:59:19.333Z`
  - `ageMs=1810`
  - `status=fresh`
- `GET /workers/runtime-freshness -> 200`
  - `status=PASS`
  - `checkedAt=2026-07-23T01:59:21.164Z`
  - passing checks:
    - `workerHeartbeat`
    - `marketData`
    - `runtimeSignalLag`
    - `runtimeSessions`
  - `runtimeDecisionActivity=SKIP` as configured, not as a failure

### Protected-input gate note

`pnpm run -s ops:protected-inputs:check -- --json` still returns:

- `status=PARTIAL`
- `releaseStatus=NO-GO`
- `accountAccessGate.status=FAIL`

This does **not** invalidate the exact `LUC-1556` rerun because the broad
account-access gate checks additional production release families
(`ROLLBACK_GUARD_*`, `PROD_DB_CHECK_*`, `RC_*`, `GATE_*`) that are unrelated to
this narrow readiness smoke. The exact protected readiness path required for
`LUC-1556` is now demonstrably executable from this runner through the managed
admin-smoke login.

## Redis Proof Boundary

- No direct remote `redis-cli PING` path is available in this runner.
- The accepted managed proof source for Redis remains `LUC-1569`, which
  verified current Coolify resource health as `redis -> running:healthy`.
- Because the fresh public `/ready` and fresh protected `/ready/details` both
  pass now, there is no evidence in this heartbeat of a remaining Redis
  readiness regression.

## Acceptance-Ledger Outcome

`VERIFIED / REDIS_HEALTH_ACCEPTED_VIA_MANAGED_COOLIFY_PROJECTION /
PUBLIC_READY_200 / PROTECTED_READY_DETAILS_200 /
WORKERS_READY_200 / RUNTIME_FRESHNESS_PASS`

The prior `LUC-1706` blocker is cleared. `LUC-1556` no longer waits on the
execution worker recovery chain.

## Residual Risk

- Build-info still reports `metadataSource=env-runtime`, so release provenance
  remains weaker than a fully generated/immutable metadata path.
- The general protected-input release gate is still incomplete in this shell,
  but the exact read-only readiness smoke required for `LUC-1556` is verified.
- No secret values, cookies, session tokens, passwords, or provider tokens were
  printed, copied, or stored.
