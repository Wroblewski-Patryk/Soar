# LUC-2305 - Redacted soar-web Container Runtime Crash Investigation

## Context

[LUC-2302](/LUC/issues/LUC-2302) selected a read-only `soar-web` container/runtime crash investigation after restart, redeploy, queue clear, and rollback recovery paths failed closed. Production Web was still returning `503`, while API health remained available.

## Goal

Classify the current `soar-web` production runtime crash cause using redacted read-only Coolify/VPS evidence, prove whether the failure is Web runtime packaging, proxy-only, or unknown, and leave a clear next owner/action.

## Constraints

- Read-only diagnostics only.
- Use bound Coolify/VPS/Paperclip credentials only; never print or persist secret values.
- Do not mutate deploy, restart, rollback, env, database, account, secret, exchange, or live-trading state.
- Persist only redacted operational facts.
- Do not treat API health as Web recovery.

## Definition Of Done

- [x] Current API/Web public smoke is recorded.
- [x] Coolify application state is recorded without secret values.
- [x] Host/container crash signature is recorded with generated ids and host paths omitted.
- [x] Crash class is identified or log unavailability is documented.
- [x] Next owner/action is explicit.

## Forbidden

- Production mutation.
- Raw secret, env, container id, generated resource id, network id, volume id, host path, account, or exchange data in artifacts or issue comments.
- Claiming production recovery while Web remains `503`.

## Stage

- `verification`

## Result Report

Status: `done`.

Concrete action:

1. Consumed the scoped wake for [LUC-2305](/LUC/issues/LUC-2305); no pending comments were present in the wake payload and checkout was already claimed by the harness.
2. Reconfirmed public production state with deploy smoke and direct curl probes.
3. Queried Coolify read-only `soar-web` application metadata and app-log endpoint state.
4. Used the approved `codex-vps` read-only SSH path to inspect the current `soar-web` container and filtered only the non-secret error signature.
5. Reviewed the local Web Dockerfile/start contract to identify the exact missing runtime file.
6. Created redacted evidence: `history/evidence/luc-2305-soar-web-container-runtime-crash-investigation-2026-06-05.md`.

Findings:

- API remains healthy: `/health` `200`, `/ready` `200`.
- Web remains unavailable: `/` `503`, `/api/build-info` `503`.
- Coolify reports `soar-web` `restarting:unknown`, `last_restart_type=crash`, `last_restart_at=2026-06-05T21:18:51Z`, and app logs endpoint `400 Bad Request`.
- Host Docker readback found one current `soar-web` application container in `restarting` state on image tag prefix `6e31d814...`.
- Current logs repeatedly show `MODULE_NOT_FOUND` for `[APP_ROOT]/scripts/runWebNextProductionCommand.mjs`, followed by pnpm recursive start failure and exit `1`.
- Local workspace already contains an uncommitted `apps/web/Dockerfile` repair direction that copies the missing start wrapper into the runtime image, but this Ops issue did not author or release that code change.

Classification:

- `web image/startup packaging`

Validation:

- PASS `pnpm run ops:coolify-stack:env-check:test` (`8/8`).
- Expected FAIL `pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`, failing only Web checks.
- PASS direct status probe for current impact classification: API `200/200`, Web `503/503`.

Next owner/action:

- Frontend/Engineering must finish and verify the Web image/startup contract repair.
- Delivery/Ops need a separate release mutation permit before any deploy/restart/rollback recovery action.

Deployment impact:

- none in this heartbeat; read-only diagnostics only.
