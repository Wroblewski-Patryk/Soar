# LUC-2302 Soar Web Next Recovery Decision Evidence

Date: 2026-06-05
Owner: CTO Architect
Process: release/deploy gate

## Input State

[LUC-2293](/LUC/issues/LUC-2293) failed closed after one permitted
`Soar / production / soar-web` rollback or redeploy to
`b894e5dd30614dfd2035e91e3d848c842d3ff380`.

Prior recovery sequence reviewed:

| Issue | Action | Result |
| --- | --- | --- |
| [LUC-2280](/LUC/issues/LUC-2280) | One controlled `soar-web` restart | Failed closed; Web stayed `503`; API stayed healthy |
| [LUC-2286](/LUC/issues/LUC-2286) | One `soar-web` redeploy from pushed `main` SHA `6e31d814046b640ad529d1cd57f968ba6f67b05e` | Failed closed; deployment accepted but Web build-info stayed `503` |
| [LUC-2293](/LUC/issues/LUC-2293) | One rollback/redeploy to previous finished source candidate `b894e5dd30614dfd2035e91e3d848c842d3ff380` | Failed closed; Web stayed `503`/`502`; API stayed healthy |

## Fresh Read-Only Check

Command:

```text
pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha b894e5dd30614dfd2035e91e3d848c842d3ff380 --no-workers
```

Result: failed only Web checks.

| Probe | Result |
| --- | --- |
| API `/health` | `200` |
| API `/ready` | `200` |
| Web `/` | `503` |
| Web `/api/build-info` | `503`; expected SHA not observable |

Focused local validation:

```text
pnpm run ops:coolify-stack:env-check:test
```

Result: pass, `8/8`.

## Decision

Selected next recovery path: redacted `soar-web` container/runtime crash
investigation.

The next Ops permit must be read-only and must classify:

- whether the current `soar-web` container exists, exits, or crash-loops;
- normalized exit code or error class;
- whether the container starts far enough to bind/listen;
- whether Coolify/proxy has a live upstream for public Web;
- whether the failure class points to app runtime, proxy/routing, or Coolify
  host/runtime repair.

## Rationale

Another source/image mutation is not evidence-backed. Both the current pushed
source and previous finished source candidate failed to make public Web expose
`/api/build-info`. API health/readiness remained green, so the degradation is
isolated to Web or its immediate runtime/routing path. Prior evidence already
shows `soar-web` in `restarting:unknown` with crash signals; the next useful
fact is a redacted runtime crash and proxy/upstream classification.

## Safety

No production deploy, restart, rollback, force-start, env edit, database
action, team/account mutation, protected smoke, secret readback, exchange
action, screenshot, or live-trading action was performed by CTO in this
decision task.

No secret values, tokens, cookies, auth headers, raw resource ids, raw
deployment ids, generated database suffixes, generated app/container names,
container/network/volume ids, host paths, internal IPs, account data, exchange
credentials, or raw logs were stored.

## Next Owner

Ops Release Lead owns [LUC-2305](/LUC/issues/LUC-2305) for the selected
diagnostic path.
