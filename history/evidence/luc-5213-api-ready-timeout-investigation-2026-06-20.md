# LUC-5213 API Ready Timeout Investigation - 2026-06-20

## Status

- Result: `DONE / PARTIALLY_VERIFIED / ACTIVE_TIMEOUT_NOT_REPRODUCED / BACKEND_RISK_IDENTIFIED`
- Owner lane: Core Backend Engineer
- Environment: production, read-only public probes plus local source inspection
- Source issue: [LUC-5198](/LUC/issues/LUC-5198)

## Scope

Investigate intermittent production API `/ready` timeout and latency outliers
reported by [LUC-5198](/LUC/issues/LUC-5198). Scope stayed read-only for
production. No deploy, push, restart, rollback, env edit, secret/account
readback, database/Redis mutation, raw log capture, account mutation, exchange
action, payment/subscription mutation, or live-trading action occurred.

## Prior Signal

[LUC-5198](/LUC/issues/LUC-5198) recorded a valid API `/ready` warning:

- initial five-sample timing: API `/ready` max `2426 ms`; API `/health` max
  `1978 ms`;
- focused ten-sample recheck: API `/health` normalized (`max=207 ms`,
  `avg=104.6 ms`), while API `/ready` had one `000` timeout at `21048 ms` plus
  outliers at `884 ms`, `1416 ms`, and `1626 ms`;
- Web routes stayed responsive during the same heartbeat;
- Coolify read-only projection showed `0` visible deployments, app rows
  `running:unknown`, and global PostgreSQL/Redis rows `running:healthy`.

## Current Reproduction Attempts

### PowerShell Invoke-WebRequest

Twenty public samples per endpoint returned `200`, but this client produced
noisy multi-second timings:

| Target | 200 samples | Min ms | Avg ms | P95 ms | Max ms |
| --- | ---: | ---: | ---: | ---: | ---: |
| API `/health` | 20/20 | 317 | 2151.2 | 4355 | 6410 |
| API `/ready` | 20/20 | 44 | 1486.0 | 3423 | 4857 |

Because `/health` showed worse tails than `/ready` in the same client, these
numbers are not strong evidence of a readiness-specific backend bottleneck.

### Node Fetch

Thirty public samples per endpoint did not reproduce the timeout or warning:

| Target | 200 samples | Min ms | Avg ms | P95 ms | Max ms |
| --- | ---: | ---: | ---: | ---: | ---: |
| API `/health` | 30/30 | 12 | 36 | 97 | 181 |
| API `/ready` | 30/30 | 18 | 33 | 69 | 145 |

### Curl Timing

Twenty public `curl.exe` samples per endpoint also did not reproduce the
[LUC-5198](/LUC/issues/LUC-5198) timeout:

| Target | 200 samples | Total min ms | Total avg ms | Total p95 ms | Total max ms | TTFB max ms |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| API `/health` | 20/20 | 137 | 311.1 | 894 | 1330 | 1330 |
| API `/ready` | 20/20 | 78 | 206.4 | 787 | 987 | 987 |

Only API `/health` had one current sample over one second. Current `/ready`
stayed under one second.

## Backend Source Inspection

Readiness route:

- `apps/api/src/router/index.ts` implements public `GET /ready`.
- The route calls `evaluateCriticalSecretsReadiness()` and
  `evaluateRuntimeDependencyReadiness()`.

Runtime dependency readiness:

- `apps/api/src/config/runtimeDependencyReadiness.ts` pings Redis when
  required and then pings the database.
- Redis readiness creates a fresh Redis client per request, connects, pings,
  then disconnects.
- Redis and database checks are sequential.
- Default readiness timeouts are `1500 ms` each via
  `READINESS_REDIS_TIMEOUT_MS` and `READINESS_DATABASE_TIMEOUT_MS`.

Supported interpretation:

- The current code can amplify dependency slowness because a single public
  `/ready` request may wait on Redis and then database checks.
- The implementation explains sub-second to low-second `/ready` outliers, but
  it does not fully explain a `21048 ms` curl timeout by itself because the
  local per-dependency defaults are much lower.
- Since current focused probes did not reproduce the timeout and `/health` also
  showed occasional client/tooling tails, the strongest current bottleneck
  class is intermittent production delivery/runtime behavior or client/network
  timing, with readiness dependency checks as an amplification risk.

## Disposition

No code change was made in this heartbeat because the active production timeout
was not reproduced and the available evidence does not prove a backend defect
that should be patched without deployment approval.

Smallest future repair if `/ready` outliers recur:

1. Add bounded local backend hardening for `evaluateRuntimeDependencyReadiness`
   by making dependency probes concurrent and preserving public `/ready`
   redaction.
2. Add focused tests proving combined Redis/database slow paths do not serialize
   into avoidable latency.
3. Keep deployment separate under Ops release approval.

Smallest future diagnostics if production-only recurrence continues:

1. DRE/Ops captures host/proxy/container timing and sanitized API log-window
   evidence around the recurrence.
2. If approved protected inputs are available, compare public `/ready` with
   protected `/ready/details` during the same window without storing secrets.

## Safety

No browser automation, local server, Docker container, database, Redis client,
or background watcher was started for this task. No cleanup action was needed.
