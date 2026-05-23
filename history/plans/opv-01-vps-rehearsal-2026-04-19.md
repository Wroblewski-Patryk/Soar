# OPV-01 VPS Rehearsal Evidence (2026-04-19)

Scope: `OPV-01 qa(vps-rehearsal): execute Dockerfile-first stage/prod rehearsal and capture evidence`.

## Result
- Dockerfile-first rehearsal: **PASS** (`api`, `web`, `workers-market-data`, `workers-market-stream`, `workers-backtest`, `workers-execution`).
- Production smoke (`api.soar.luckysparrow.ch` + `soar.luckysparrow.ch`): **PASS** (`/health`, `/ready`, web root).
- Stage smoke (`stage-api.soar.luckysparrow.ch` + `stage-soar.luckysparrow.ch`): **FAIL** (`fetch failed`) due to missing DNS records.

## Evidence Artifacts
- Combined summary JSON: `history/artifacts/_artifacts-opv-01-vps-rehearsal-2026-04-19T03-25-24.json`
- Docker rehearsal JSON: `history/artifacts/_artifacts-opv-01-docker-rehearsal-2026-04-19T03-21-03.json`
- Docker rehearsal log: `history/artifacts/_artifacts-opv-01-docker-rehearsal-2026-04-19T03-21-03.log`
- Production smoke log: `history/artifacts/_artifacts-opv-01-smoke-prod-2026-04-19T03-25-24.log`
- Stage smoke log: `history/artifacts/_artifacts-opv-01-smoke-stage-2026-04-19T03-25-24.log`

## Conclusion
`OPV-01` is executed with evidence captured. Production path validates the Dockerfile-first contract and smoke baseline. Stage rehearsal remains externally blocked until stage DNS/domain routing is provisioned for Soar stage endpoints.
