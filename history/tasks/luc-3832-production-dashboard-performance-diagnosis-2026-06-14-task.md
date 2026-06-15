# LUC-3832 Production Dashboard Performance Diagnosis

Date: 2026-06-14
Owner: 09 DRE (Deployment & Reliability Engineer)
Stage: verification

## Context

[LUC-3832](/LUC/issues/LUC-3832) was opened after an operator report that the
authenticated production dashboard could take about one minute to load. Public
smoke was already fast, so this heartbeat focused on protected dashboard timing
and server-health classification.

## Goal

Diagnose the slow authenticated dashboard path without exposing credentials or
mutating production, then route concrete repair work to one-owner lanes.

## Constraints

- No deploy, restart, rollback, env edit, database mutation, Redis mutation,
  trading action, exchange setting change, payment/subscription change, or live
  account mutation.
- Do not write secrets, cookies, tokens, passwords, private response bodies, or
  screenshots to artifacts.
- Use read-only production probes only.

## Definition of Done

- Protected dashboard timing is reproduced or blocked with a precise reason.
- Timing breakdown separates public route, login/session, dashboard document,
  static assets, protected API calls, and browser network settle.
- Coolify/server-health read-only projection is refreshed enough to classify
  whether this is an active deploy/resource-inventory incident.
- Repair ownership is classified and delegated.

## Evidence

Generated artifacts:

- `history/artifacts/luc-3832-production-dashboard-performance-probe-2026-06-14.json`
- `history/artifacts/luc-3832-production-dashboard-performance-auth-login-probe-2026-06-14.json`

The first probe used the available audit token and proved that token was stale
for `/auth/me`: `401` in `18 ms`; browser navigation redirected to
`/auth/login?session=[REDACTED]` and reached network idle in `1800 ms`. This
did not reproduce the authenticated slow path.

The second probe used the normal audit email/password login path and reproduced
the authenticated dashboard condition:

| Surface | Result |
| --- | --- |
| `POST /auth/login` | `200`, `326 ms`, no secret stored |
| `GET /auth/me` after login | `200`, `366 ms` |
| `/dashboard` document | DOM content loaded in `303 ms`; browser nav timing response end `30 ms`; load event `386 ms` |
| Browser settle | `networkidle_timeout` after `70000 ms` |
| Slowest protected API | `GET /dashboard/bots/:id/runtime-monitoring/aggregate`, `200`, max observed `26312 ms` |
| Other protected API | `runtime-sessions` max `1953 ms`; `runtime-graph` max `941 ms`; bot list max `1505 ms` |
| Request fan-out sample | `50` successful XHR responses; aggregate endpoint appeared `12` times in top network sample |

Fresh read-only Coolify projection at `2026-06-13T22:24:39Z`:

- `GET /api/v1/version`: `200`
- current team selector: `LuckySparrow`
- project/environment readback: `200`
- visible application resources in that projection: `6`
- active deployment rows: `0`
- app rows still report `running:unknown`; no CPU/RAM/raw-log data was exposed
  by the read-only projection used here.

## Diagnosis

Status: `verified_production_repro / repair_delegated / no_mutation`.

The slow path is not public web reachability, initial dashboard HTML, static
asset delivery, login, or base auth/session lookup. The bottleneck is the
authenticated runtime dashboard data path:

- Backend owner: `GET /dashboard/bots/:id/runtime-monitoring/aggregate` can sit
  near the configured `RUNTIME_MONITORING_AGGREGATE_SUBQUERY_TIMEOUT_MS`
  default of `25000 ms` under production data, then still return `200`.
- Frontend owner: dashboard home concurrently fans out per active bot through
  `runtime-sessions`, `runtime-graph`, and `runtime-monitoring/aggregate`.
  Production trace showed duplicate/repeated calls for the same bot ids and
  network did not settle within `70 s`.
- Ops/DRE owner: no active deployment row was visible and public/API health was
  fast; DRE cannot classify CPU/RAM/DB-log saturation from the available
  read-only projection alone without broader Coolify/VPS/log authority.

## Affected Architecture Entities

- `SOAR-API-BOT-RUNTIME-AGGREGATE`
- `SOAR-SERVICE-RUNTIME-AGGREGATE`
- `SOAR-COMP-HOME-LIVE-WIDGETS`
- `SOAR-SERVICE-WEB-BOTS-API`
- `SOAR-OPERATIONS-001 / Coolify production status access`

## Repair Routing

Created these child issues under [LUC-3832](/LUC/issues/LUC-3832):

1. [LUC-3839](/LUC/issues/LUC-3839) Backend/CBE: optimize or bound the production aggregate route so the
   dashboard aggregate endpoint does not tail at `25 s` per bot under normal
   paid-user data; add focused API performance regression evidence.
2. [LUC-3840](/LUC/issues/LUC-3840) Frontend/FEW: reduce dashboard home protected fan-out/repeated aggregate
   calls and make the loading contract fail-fast/degraded instead of keeping
   browser network busy for over `70 s`; add focused Web regression evidence.
3. [LUC-3841](/LUC/issues/LUC-3841) QA/Test Automation after the two fixes: rerun the same protected production
   timing proof and set a sellability threshold.

## Validation

- Redacted authenticated browser timing probe: PASS for reproduction.
- Read-only Coolify projection: PASS for selector/project/deploy-row check.
- Secret handling: PASS; artifacts store no token, cookie, password, private
  payload, screenshot, or raw resource id.
- Mutation check: PASS; only login/session readback, browser GETs, and Coolify
  `GET` calls were used.

## Release Impact

- Commit: not created in this heartbeat; this is evidence/routing only.
- Push: not needed.
- Deploy impact: none.
- Current incident disposition: blocked on delegated Backend/Frontend repair
  lanes and QA protected timing recheck.
