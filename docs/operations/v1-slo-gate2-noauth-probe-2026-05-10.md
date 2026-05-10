# V1 Gate 2 No-Auth SLO Probe

## Status
- Result: **BLOCKED / NOT GATE 2 PASS**
- Evidence date: 2026-05-10
- Current production SHA during probe:
  `8c85279d13ca56421b09a5c4cd613535a81ef76d`
- Raw SLO artifact:
  `docs/operations/_artifacts-slo-window-2026-05-10T05-09-56-366Z.json`
- SLO observation report:
  `docs/operations/v1-slo-observation-2026-05-10T05-09-56-366Z.md`

## Summary
A short one-minute production SLO collector run was executed without auth to
check whether RC Gate 2 could progress without operator credentials. It cannot.

The probe was useful blocker evidence:

- `/health` was available for 100% of samples.
- `/ready` was available for 50% of samples during the short window.
- A follow-up public deploy smoke immediately after the SLO run passed
  `/health`, `/ready`, and Web `/`.
- `/workers/health`, `/workers/ready`, `/metrics`, and `/alerts` returned
  protected `401 Missing token` responses without auth.
- Queue-lag, API 5xx ratio, API latency, and live-order failure metrics were
  `NO_DATA`.

This means the no-auth probe must not be treated as Gate 2 approval. It only
confirms the existing protected-input boundary.

## Observed Objective State
| Objective | Metric | Observed | Status |
| --- | --- | --- | --- |
| SLO-1A | `/health` availability | 100.0000% | PASS |
| SLO-1B | `/ready` availability | 50.0000% | FAIL |
| SLO-4A | `/workers/health` availability | 0.0000% | FAIL |
| SLO-4B | `/workers/ready` availability | 0.0000% | FAIL |
| SLO-2 | API 5xx ratio | n/a | NO_DATA |
| SLO-3 | API average duration | n/a | NO_DATA |
| SLO-5 | Execution queue lag compliance | n/a | NO_DATA |
| SLO-6 | Live order failure ratio | n/a | NO_DATA |

## Follow-Up Smoke
After the SLO window, public deploy smoke was rerun:

```text
PASS API /health -> 200
PASS API /ready -> 200
PASS WEB / -> 200
```

This suggests the short `/ready` failures should be treated as a transient
readiness observation to monitor, not as proof of persistent public outage.
Protected Gate 2 metrics are still unavailable without auth.

## Required Next Inputs
To make Gate 2 eligible for PASS, an operator must rerun the production SLO
flow with approved auth and a full observation window:

```powershell
pnpm run ops:slo:collect -- --base-url https://api.soar.luckysparrow.ch --duration-minutes 30 --interval-seconds 30 --auth-token <ADMIN_JWT> --environment production --target-profile V1
pnpm run ops:rc:gates:status -- --today 2026-05-10
```

Accepted auth alternatives are the same operator auth options supported by the
SLO collector:

- `--auth-token <token>`
- or `--auth-email <email>` plus `--auth-password <password>`
- optional OPS private layer via basic auth or custom header options

## Non-Acceptance Notes
- Do not accept this one-minute no-auth SLO artifact as RC Gate 2 PASS.
- Do not accept public `/health` or `/ready` as a substitute for protected
  worker, metrics, alerts, queue-lag, or live-order evidence.
- Do not commit auth tokens, passwords, private headers, or protected payloads.
