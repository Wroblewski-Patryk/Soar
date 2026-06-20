# LUC-5252 API Health/Ready Latency Correlation - 2026-06-20

## Status

- Result: `DONE / PARTIALLY_VERIFIED / LOW_SECOND_TLS_PROXY_TAILS / APP_REACHABLE`
- Issue: [LUC-5252](/LUC/issues/LUC-5252)
- Parent signal: [LUC-5250](/LUC/issues/LUC-5250)
- Checked at: 2026-06-20T18:39Z to 2026-06-20T18:40Z
- Production API: `https://api.soar.luckysparrow.ch`
- Deployed SHA from parent evidence:
  `42177530f2a2ddc22832133b545bccab6ab404eb`

## Scope

Read-only DRE/Ops correlation pass for intermittent API `/health` and
`/ready` low-second latency tails from [LUC-5250](/LUC/issues/LUC-5250).

No code, deploy, push, restart, rollback, env edit, secret/account readback,
database/Redis mutation, raw log capture, production account use, exchange
action, order, position, payment/subscription mutation, or live-trading action
occurred.

## Parent Signal

[LUC-5250](/LUC/issues/LUC-5250) public `curl.exe` timing showed:

| Target | Result | Max | Average |
| --- | --- | ---: | ---: |
| API `/health` | 5/5 `200` | `1374 ms` | `973.4 ms` |
| API `/ready` | 5/5 `200` | `1314 ms` | `566 ms` |

Web surfaces were healthy in the same parent checkpoint, so the follow-up scope
was narrowed to API public health/readiness latency.

## Current Bounded Probe

Command shape:

```powershell
curl.exe -sS -o NUL -w "%{http_code} %{time_namelookup} %{time_connect} %{time_appconnect} %{time_starttransfer} %{time_total}" --connect-timeout 5 --max-time 12 <url>
```

Each target was sampled 30 times with a short pause between samples. The probe
used public endpoints only and did not send credentials or request bodies.

| Target | Success | Min | Median | P95 | Max | Average | >400 ms | >1000 ms |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| API `/health` | 30/30 `200` | `78 ms` | `101 ms` | `2066 ms` | `2217 ms` | `390.2 ms` | `7` | `4` |
| API `/ready` | 30/30 `200` | `88 ms` | `98 ms` | `112 ms` | `2006 ms` | `162.7 ms` | `1` | `1` |

## Correlation Notes

- The issue reproduced as successful low-second latency tails, not as an
  outage: all 60 requests returned `200`.
- API `/health` had the stronger recurrence: four samples above one second.
- Slow `/health` samples are not explained by `/ready` dependency checks,
  because `/health` returns a simple JSON status without Redis or database
  readiness work.
- The `curl.exe` breakdown for the slow samples concentrated most of the delay
  in `time_appconnect` and `time_starttransfer`.
  Examples:
  - `/health` sample 18: total `2066 ms`, TLS/appconnect `1434 ms`.
  - `/health` sample 21: total `2217 ms`, TLS/appconnect `2050 ms`.
  - `/health` sample 24: total `1329 ms`, TLS/appconnect `1307 ms`.
  - `/ready` sample 1: total `2006 ms`, TLS/appconnect `1911 ms`.
- Current source inspection confirms public `/ready` calls
  `evaluateCriticalSecretsReadiness()` and
  `evaluateRuntimeDependencyReadiness()`, while `/health` does not.
- `evaluateRuntimeDependencyReadiness()` checks Redis and database readiness
  sequentially, and Redis readiness creates a fresh Redis client per check.
  This remains a plausible `/ready` amplification risk from
  [LUC-5213](/LUC/issues/LUC-5213), but it is not the best explanation for
  the current `/health` tails.

## Classification

`PARTIALLY_VERIFIED / LOW_SECOND_TLS_PROXY_TAILS`.

Current evidence points more strongly to intermittent edge/proxy/network/TLS
handshake variance than to the API handler or Redis/database readiness logic.
The API was reachable and consistently returned success responses during this
checkpoint, but the API latency SLO posture is watchful/burning because
successful health checks still intermittently exceeded one second.

## Residual Risk

- Full Coolify/VPS/container/proxy host-level correlation remains blocked by
  the existing approved binding path:
  [LUC-4811](/LUC/issues/LUC-4811) and control-plane unblocker
  [LUC-5075](/LUC/issues/LUC-5075).
- Without approved host/proxy time-series or sanitized API/proxy log-window
  evidence, root cause is not proven.
- No deployable patch is justified from this DRE checkpoint alone.

## Next Owner Action

No new broad issue is required from this checkpoint.

If the tails recur or increase, DRE/Ops should run the next correlation only
after approved read-only bindings exist: Coolify app/container status,
restart-count deltas, reverse-proxy/TLS timing, VPS pressure, and sanitized
API/proxy log-window evidence around the recurrence.

If `/ready` tails recur independently of `/health`, Core Backend can use the
existing [LUC-5213](/LUC/issues/LUC-5213) finding as input for a separate
hardening slice: concurrent Redis/database readiness probes plus focused
slow-path tests before deployment.
