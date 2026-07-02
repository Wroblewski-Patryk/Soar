# LUC-6386 Authenticated Production Acceptance And Performance Sweep

## Status

`BLOCKED / PRODUCTION_WEB_503 / AUTHENTICATED_ACCEPTANCE_NOT_EXECUTABLE / ROLLBACK_GUARD_ACTION_REQUIRED`

## Scope

QVE read-only production acceptance recheck for [LUC-6386](/LUC/issues/LUC-6386).

No deploy, push, restart, rollback execution, env edit, secret/account readback,
production DB/Redis mutation, exchange/payment mutation, order, position,
subscription/payment mutation, or live-trading action was performed.

## Wake Context

- Reason: `issue_continuation_needed`.
- Retry reason: `process_lost_retry`; current production gates were rerun
  before board disposition to avoid relying on stale process output.
- Issue: [LUC-6386](/LUC/issues/LUC-6386), critical, `in_progress`.
- Pending comments: none.
- Fallback fetch: not required; inline wake data was sufficient.

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| Runner binding shape | PASS_NAME_ONLY | `PROD_UI_AUDIT_*` bindings were present by name/length only. No secret values were printed. |
| Web build-info direct read | FAIL | `https://soar.luckysparrow.ch/api/build-info` returned `503 no available server`. |
| Production deploy smoke without workers | FAIL | API `/health` and `/ready` passed; Web `/` and `/api/build-info` returned `503`. |
| Direct endpoint timing sample | PARTIAL | API `/health -> 200` in `216.2 ms`; API `/ready -> 200` in `32.8 ms`; Web `/ -> 503` in `70.9 ms`; Web `/api/build-info -> 503` in `17.3 ms`. |
| Runtime freshness | PASS | Auth was supplied through env-only `DEPLOY_FRESHNESS_*` aliases from `PROD_UI_AUDIT_*`; worker/market heartbeat age was about `3.8s`, runtime signal lag `0`, and running sessions were healthy. |
| Rollback guard | FAIL | Auth was supplied through env-only `ROLLBACK_GUARD_*` aliases from `PROD_UI_AUDIT_*`; result was `shouldRollback=true` due to `workers_ready_endpoint_http_503`; freshness passed with worker/market heartbeat age about `9.7s`, and alerts were empty. |

Raw structured artifact:
`history/artifacts/luc-6386-production-acceptance-current-state-2026-06-30.json`.

## Result

Authenticated production acceptance could not be completed in this heartbeat.
The public Web surface is currently unavailable with `503 no available server`,
so build SHA confirmation, dashboard/browser clickthrough, auth-session browser
proof, and UI module clickthrough are not executable.

The API baseline remains responsive and runtime freshness passes, but the
release guard remains failed because protected worker readiness returns `503`.
This matches the existing restoration incident [LUC-6331](/LUC/issues/LUC-6331),
which owns production Web and backtest worker restoration.

## Disposition

[LUC-6386](/LUC/issues/LUC-6386) should move to `blocked` with first-class
blocker [LUC-6331](/LUC/issues/LUC-6331). QVE can rerun the authenticated
acceptance sweep after the restoration owner records Web recovery and protected
worker readiness is green.
