# LUC-181 Workers Market Stream Operator Root-Cause Packet (2026-05-26)

## Scope
Issue-scoped ops heartbeat for `LUC-181`:
`[Soar][Ops] workers-market-stream operator log/root-cause packet`.

## Concrete Actions
1. Confirmed runtime binding availability (presence only).
2. Re-ran production expected-SHA smoke (control surface).
3. Re-ran temp-domain expected-SHA smoke (acceptance surface).
4. Re-ran protected-input readiness check.
5. Collected fresh read-only Coolify worker snapshot and deployment linkage.
6. Probed per-resource detail/log endpoints required for deeper log packet.

## Command Evidence
- Runtime presence check:
  - `COOLIFY_BASE_URL_PRESENT=True`
  - `COOLIFY_TOKEN_PRESENT=True`
  - `COOLIFY_API_TOKEN_PRESENT=True`

- `corepack pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11 --skip-workers`
  - Result: `PASS`
  - API `/health`: `200`
  - API `/ready`: `200`
  - WEB `/`: `200`
  - WEB `/api/build-info`: `200` (`gitSha=3fedb7a9170097b40accb6ccea1915064f383f11`)

- `corepack pnpm run ops:deploy:smoke -- --base-url https://temp.soar.luckysparrow.ch --api-url https://temp-api.soar.luckysparrow.ch --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11 --skip-workers`
  - Result: `FAIL`
  - API `/health`: `fetch failed`
  - API `/ready`: `fetch failed`
  - WEB `/`: `fetch failed`
  - WEB `/api/build-info`: `fetch failed`

- `corepack pnpm run ops:protected-inputs:check -- --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11`
  - Result: `PARTIAL`
  - Matching protected names present: `9`

- Read-only Coolify API snapshot:
  - `workers-market-stream` found: `True`
  - `uuid=d2oo1wwy8i55q27e5mdky0i4`
  - `status=exited:unhealthy`
  - `environment_id=6`
  - `git_branch=main`
  - `git_commit_sha=HEAD`
  - `updated_at=2026-05-26T02:27:15.000000Z`
  - `health_check_enabled=false`
  - Worker deployments in `/api/v1/deployments`: `0`

- Endpoint capability check (deeper log path):
  - `GET /api/v1/resources/{uuid}` -> `404`
  - `GET /api/v1/resources/{uuid}/logs` -> `404`

## Root-Cause Packet (Current Best-Evidence)
- Primary runtime failure signal remains unchanged: worker app state is
  `exited:unhealthy` in authoritative resource inventory.
- Direct per-resource API log extraction path is unavailable in this API
  surface (`404` for detail/log routes), so deeper process logs are currently
  not retrievable from this runner through the documented resource endpoints.
- No worker-linked deployment rows are currently visible, limiting deployment
  timeline reconstruction from this endpoint set.
- External acceptance context remains degraded (`temp` surface unreachable),
  while production public control endpoints stay healthy on expected SHA.

## Final Disposition
- `blocked`

## Unblock Owner / Action
- Owner: Coolify operator + release controller.
- Action:
  1. Extract `workers-market-stream` runtime/container logs from available
     Coolify UI/internal log path (or alternate authenticated endpoint that
     exposes logs for `d2oo1wwy8i55q27e5mdky0i4`).
  2. Publish root-cause statement with timestamped evidence.
  3. Either recover worker to healthy readiness with proof, or accept a deeper
     blocker decision for parent closure routing.

## 2026-05-26 Resume Delta (finish_successful_run_handoff)
- Deeper Coolify read-only probe found an accessible application-log path:
  - `GET /api/v1/applications/d2oo1wwy8i55q27e5mdky0i4/logs` -> `400` with body: `{\"message\":\"Application is not running.\"}`
- This replaces the prior partial assumption that log-path availability was unknown behind `404` on `/resources/{uuid}/logs`.
- Updated root-cause statement:
  - The worker runtime is currently stopped/crashed from Coolify's perspective (`Application is not running`), which explains both `exited:unhealthy` state and inability to read streaming runtime logs from this endpoint.
- Additional endpoint compatibility findings:
  - `/api/v1/resources/{uuid}` and `/api/v1/resources/{uuid}/logs` remain `404` for this runner/API surface.
  - `/api/v1/applications/{uuid}` call in this runner throws a null-response transport error, while list endpoints still work.
- Operational decision in this issue:
  - Root-cause packet evidence requirement is satisfied at blocker level (`not running` confirmed by API).
  - Recovery proof is still not present (no mutation allowed in this issue heartbeat).

## 2026-05-26 Source-Scoped Recovery Reconciliation
- Inline wake payload processed first (`fallbackFetchNeeded=false`).
- Pending comments: `0/0` (no new human unblock signal).
- Blocker evidence delta: none.
- No new authenticated worker log packet, no recovery/readiness proof, and no accepted deeper-blocker decision were attached in this heartbeat.
- Operational scope was read-only status reconciliation; no production mutation was performed.

### Disposition
- `blocked` (unchanged)

### Unblock Owner / Action (unchanged)
- Owner: Coolify operator + release controller.
- Action: publish one closure packet for this release cycle:
  1. authenticated worker logs + timestamped root-cause + recovery/readiness proof, or
  2. explicit accepted deeper-blocker decision replacing direct recovery.

## 2026-05-26 Reopen Delta - Board Decision Interaction
- New board comment acknowledged: `a3df1eb9-be8d-40a8-a84f-1f10a30ab6e1`.
- Decision gate is now bound to interaction `59c011b0-cc92-47b4-ae72-2a039556dd93`.
- Confirmed options captured in control plane:
  - `accept`: allow narrow production lane for `workers-market-stream` recovery/readiness only.
  - `reject`: keep production untouched and treat current runtime packet as accepted deeper blocker for this release cycle.
- No production mutation occurred in this heartbeat.

## 2026-05-26 Source-Scoped Recovery Action Reconciliation (decision-gate pending)
- Inline wake payload consumed first (`fallbackFetchNeeded=false`).
- Local source-of-truth rescan confirms no new decision artifact beyond
  interaction `59c011b0-cc92-47b4-ae72-2a039556dd93`.
- No new operator-authenticated worker logs, no recovery/readiness proof, and no accepted reject-branch closure artifact were attached in this heartbeat.
- Scope remained non-mutating governance/evidence reconciliation.

### Disposition
- `in_review` (reviewer path: `local-board` via interaction `59c011b0-cc92-47b4-ae72-2a039556dd93`).
