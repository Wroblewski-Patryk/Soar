# Task

## Header
- ID: LUC-99
- Title: [Soar][External Ops Blocker] Recover workers-market-stream and temp-stack acceptance
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Ops/Release
- Priority: P0
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: BLOCKED

## Context
Issue-scoped assigned heartbeat for external ops blocker closure on worker readiness plus temp-stack acceptance packet.

## Goal
Leave a fresh evidence-backed disposition for LUC-99 and avoid stale `in_progress` state.

## Constraints
- no secret exposure
- no unauthorized production mutation
- smallest verification that proves current blocker state

## Definition of Done
- [x] Operator unblock packet integrity rechecked for expected SHA.
- [x] Public expected-SHA smoke rechecked.
- [x] Final disposition recorded with explicit unblock owner/action.

## Validation Evidence
- Tests: `corepack pnpm run ops:operator-unblock:check -- --packet history/artifacts/v1-operator-unblock-packet-3fedb7a9-2026-05-26.json --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11`
- Manual checks: `corepack pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11 --skip-workers`
- Runtime check: in-shell Coolify API read attempt blocked (`COOLIFY_BASE_URL` / `COOLIFY_TOKEN` missing)
- Reality status: blocked

## Deployment / Ops Evidence
- Deploy impact: none (read-only verification only)
- Env or secret changes: none
- Health-check impact: none
- Rollback note: not applicable (no mutation)
- Observability or alerting impact: none

## Result Report
- Operator unblock packet validation is PASS for expected SHA `3fedb7a9170097b40accb6ccea1915064f383f11`.
- Public deploy smoke is PASS for API/Web/build-info on the same SHA.
- Direct Coolify inventory/recovery check for `workers-market-stream` could not run in this runtime due to missing `COOLIFY_BASE_URL` / `COOLIFY_TOKEN` bindings.
- LUC-99 remains `blocked` because authenticated temp-stack worker readiness acceptance is still missing.
- Unblock owner/action: scheduled Coolify operator + local-board release controller must execute authenticated temp-domain deploy/readiness run and attach full acceptance packet (`temp-api`, `temp-web`, expected-SHA build-info, four-worker readiness, rollback note).

## Resume Delta (2026-05-26)
- Runtime binding state was refined:
  - `COOLIFY_BASE_URL_PRESENT=True`
  - `COOLIFY_TOKEN_PRESENT=False`
- `ops:protected-inputs:check -- --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11` => `BLOCKED` (`0` matching names).
- Public expected-SHA smoke rerun remains `PASS`.
- Final lane disposition in this delta remains `BLOCKED`; blocker is now explicitly token-scoped for authenticated Coolify operations.

## 2026-05-26 Heartbeat Delta (source_scoped_recovery_action, CTO)
- Fresh runtime binding check in this shell:
  - `COOLIFY_BASE_URL_PRESENT=False`
  - `COOLIFY_TOKEN_PRESENT=False`
- Fresh check reruns:
  - `corepack pnpm run ops:protected-inputs:check -- --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11` -> `BLOCKED` (`0` matching names)
  - `corepack pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11 --skip-workers` -> `PASS`
- Blocker narrowed/confirmed:
  - no authenticated Coolify action is possible in this runtime without both bindings,
  - required closure evidence (worker readiness + temp-domain acceptance packet + rollback/cutover note) remains missing.
- Final lane disposition in this heartbeat: `blocked`.
- Unblock owner/action unchanged: scheduled Coolify operator + local-board release controller.

## 2026-05-26 Reopened-Comment Delta (b81d4348-81dd-486e-98ef-7eca172e38bd)
- Comment acknowledged: board reported `COOLIFY_TOKEN` compatibility alias repair.
- Concrete verification executed immediately in this heartbeat:
  - `COOLIFY_BASE_URL_PRESENT=False`
  - `COOLIFY_TOKEN_PRESENT=False`
  - `COOLIFY_API_TOKEN_PRESENT=False`
- Fresh checks:
  - `corepack pnpm run ops:protected-inputs:check -- --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11` -> `BLOCKED` (`0` matching names)
  - `corepack pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11 --skip-workers` -> `PASS`
- Result: alias repair is not effective in this runtime yet (or not injected into this runner context), so authenticated Coolify recovery/readiness work is still not executable here.
- Final disposition for this heartbeat: `blocked`.
- Unblock owner/action:
  - Owner: Ops/Security secret-binding owner + scheduled Coolify operator.
  - Action: inject effective Coolify auth bindings into this runner context (`COOLIFY_BASE_URL` + `COOLIFY_TOKEN` or `COOLIFY_API_TOKEN`), then rerun authenticated worker/temp-stack recovery and attach closure packet.

## 2026-05-26 Finish-Handoff Recheck Delta (CTO)
- Fresh runtime binding check remains unchanged:
  - `COOLIFY_BASE_URL_PRESENT=False`
  - `COOLIFY_TOKEN_PRESENT=False`
  - `COOLIFY_API_TOKEN_PRESENT=False`
- Fresh checks:
  - `ops:protected-inputs:check -- --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11` -> `BLOCKED` (`0` matching names)
  - `ops:deploy:smoke ... --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11 --skip-workers` -> `PASS`
- Disposition: `blocked` (no authenticated Coolify recovery path available in this runner).
- Unblock owner/action unchanged: Ops/Security secret-binding owner + scheduled Coolify operator must inject effective Coolify auth bindings and attach worker/temp-stack closure packet.

## 2026-05-26 Wake Heartbeat Delta (source_scoped_recovery_action, Portfolio Director)
- Fresh runtime binding check in this runner:
  - `COOLIFY_BASE_URL_PRESENT=False`
  - `COOLIFY_TOKEN_PRESENT=False`
  - `COOLIFY_API_TOKEN_PRESENT=False`
- Fresh checks rerun:
  - `corepack pnpm run ops:protected-inputs:check -- --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11` -> `BLOCKED` (`0` matching names)
  - `corepack pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11 --skip-workers` -> `PASS`
- Disposition: `blocked`.
- Unblock owner/action unchanged: Ops/Security secret-binding owner + scheduled Coolify operator must inject effective Coolify auth bindings into this runtime and attach worker/temp-stack closure packet.


## 2026-05-26 Routing-Correction Delta (8fa6a704-67ea-44d3-b37a-0573ab0167e1, Ops Release Lead)
- Board routing correction acknowledged: this lane is owned by `Ops Release Lead`.
- Presence-only runtime check (no secret values printed):
  - `COOLIFY_BASE_URL_PRESENT=True`
  - `COOLIFY_API_TOKEN_PRESENT=True`
  - `COOLIFY_TOKEN_PRESENT=True`
- Fresh proof reruns:
  - `pnpm run ops:protected-inputs:check -- --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11` -> `BLOCKED` (`0` matching protected names)
  - `pnpm run ops:deploy:smoke -- --base-url https://soar-temp.luckysparrow.ch --api-url https://api.soar-temp.luckysparrow.ch --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11 --skip-workers` -> `FAIL` (API/Web temp endpoints `fetch failed`)
- Operational conclusion:
  - The blocker has shifted from missing env bindings to external temp-stack/runtime reachability and acceptance evidence gaps.
  - `workers-market-stream` readiness proof is still missing in this heartbeat.
- Final disposition for this heartbeat: `blocked`.
- Unblock owner/action:
  - Owner: Coolify operator + Security/Ops credential owner + release controller.
  - Action: execute authenticated Coolify inventory/log/readiness checks for `workers-market-stream`, recover temp stack reachability, and attach closure packet (worker readiness, temp API/Web/build-info proof for expected SHA, rollback/cutover note).

## 2026-05-26 Finish-Handoff Delta 2 (Ops Release Lead, read-only Coolify API)
- Concrete read-only Coolify API reconciliation executed in this heartbeat using configured auth bindings (no secret values printed).
- Verified runtime/resource state:
  - `workers-market-stream` (`uuid=d2oo1wwy8i55q27e5mdky0i4`) is still `exited:unhealthy`.
  - Resource summary snapshot: `env=6`, `branch=main`, `commit=HEAD`, `fqdn=null`.
- Temp-stack discovery check in Coolify resources:
  - `RESOURCES_TOTAL=17`
  - `TEMP_MATCHES=0` (no `temp` / `soar-temp` named resource/fqdn entries exposed in this inventory).
- Deployment queue signal for this worker:
  - `DEPLOYMENTS_TOTAL=5`
  - `WORKER_DEPLOYMENT_MATCHES=1`
  - latest match: `deployment_uuid=toi8dv1ls4oswrysgkfzxznb`, `status=queued`, `commit=HEAD`.
- Temp-domain external smoke in prior checkpoint remains `FAIL` (`fetch failed` on temp API/Web/build-info checks).
- Final disposition for this heartbeat: `blocked`.
- Unblock owner/action:
  - Owner: Coolify operator + release controller.
  - Action: drain/resolve queued worker deployment, restore `workers-market-stream` to healthy readiness, provide explicit temp-domain acceptance packet for expected SHA `3fedb7a9170097b40accb6ccea1915064f383f11` (or explicit no-temp-stack decision), and attach rollback/cutover note.
