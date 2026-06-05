# LUC-2298 Retrieve Redacted soar-web Deployment History And Prepare Rollback Permit

## Context

[LUC-2285](/LUC/issues/LUC-2285) completed an authorized `soar-web`
queue-clear/redeploy attempt, but production Web remained `503` while API
health and readiness stayed green. [LUC-2294](/LUC/issues/LUC-2294) approved a
constrained read-only evidence path for `Soar / production / soar-web`.

## Goal

Collect a redacted minimum Coolify deployment-history projection for
`soar-web`, classify the previous stable candidate, and prepare a rollback
permit if the evidence supports one.

## Constraints

- Target only `Soar / production / soar-web`.
- No deploy, restart, rollback, env edit, database, Redis, API, worker,
  account, exchange, or live-trading mutation.
- Use only redacted aliases and public source SHAs in persisted evidence.
- Do not persist raw Coolify ids, generated names, host paths, internal IPs,
  env values, logs, cookies, tokens, auth headers, DSNs, account data, or
  secret-bearing material.

## Definition Of Done

- [x] Read [LUC-2294](/LUC/issues/LUC-2294) constraints and prior
  [LUC-2285](/LUC/issues/LUC-2285) evidence.
- [x] Run read-only Coolify deployment/app status projection for `soar-web`.
- [x] Run public API/Web smoke without protected credentials.
- [x] Classify
  `b894e5dd30614dfd2035e91e3d848c842d3ff380`.
- [x] Prepare a rollback permit with target, source, smoke, exclusions, and
  stop condition.
- [x] Record superseding [LUC-2293](/LUC/issues/LUC-2293) evidence that the
  same rollback candidate has already failed closed.

## Forbidden

- Production mutation from this issue.
- Repeating the [LUC-2293](/LUC/issues/LUC-2293) rollback.
- Raw log/id/secret persistence.
- Treating current Web `503` as release-ready.

## Result Report

Status: done as evidence and permit-preparation lane.

Evidence:

- `history/evidence/luc-2298-soar-web-deployment-history-rollback-permit-2026-06-05.md`

Validation:

- Coolify read-only app projection: `soar-web` status readback succeeded;
  deployment rows were not visible through live deployment endpoints; crash
  marker remained active.
- `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`
  failed only Web checks: API `/health` and `/ready` `200`, Web `/` and
  `/api/build-info` `503`.
- App log endpoint returned `400`; deployment log endpoint variants returned
  `404`; no raw output was persisted.

Result:

- `b894e5dd30614dfd2035e91e3d848c842d3ff380` is supported by prior redacted
  chronology as the previous finished `soar-web` source candidate, but not
  reconfirmed from live deployment rows in this heartbeat because live Coolify
  history returned zero visible `soar-web` rows.
- A rollback permit was prepared for one controlled `soar-web`
  rollback/redeploy to that SHA.
- The prepared permit is now superseded by [LUC-2293](/LUC/issues/LUC-2293),
  which already executed the rollback/redeploy and failed closed. Do not repeat
  that mutation without a fresh permit.

Commit/push: not committed; existing dirty tree contains prior state/evidence
from other lanes and this heartbeat added only scoped task/evidence artifacts.

Deploy impact: none from this issue.

Residual risk: production Web remains unavailable. Next owner/action is a new
CTO/Ops-approved recovery permit for host/container crash investigation,
proxy/runtime repair, or another exact source/image action.
