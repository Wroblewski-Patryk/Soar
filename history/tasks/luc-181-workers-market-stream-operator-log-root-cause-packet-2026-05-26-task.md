# Task

## Header
- ID: LUC-181
- Title: [Soar][Ops] workers-market-stream operator log/root-cause packet
- Task Type: release
- Current Stage: verification
- Status: REVIEW
- Owner: Ops/Release
- Depends on: LUC-99, LUC-47
- Priority: P0

## Context
Assigned heartbeat requires a concrete operator packet for the unresolved
`workers-market-stream` production blocker, with log/root-cause evidence and
clear unblock ownership.

## Goal
Publish a fresh, durable root-cause packet from allowed operations in this
runtime and leave explicit gate disposition.

## Constraints
- Read-only operations only in this heartbeat.
- No secret values in outputs.
- No production mutation without a release mutation permit.

## Definition of Done
- [x] Fresh runtime + smoke evidence captured.
- [x] Fresh Coolify worker-state and endpoint-capability evidence captured.
- [x] Root-cause packet written to `history/evidence`.
- [x] Source-of-truth context updated.
- [x] Final disposition and unblock owner/action recorded.

## Validation Evidence
- `corepack pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11 --skip-workers` -> `PASS`
- `corepack pnpm run ops:deploy:smoke -- --base-url https://temp.soar.luckysparrow.ch --api-url https://temp-api.soar.luckysparrow.ch --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11 --skip-workers` -> `FAIL`
- `corepack pnpm run ops:protected-inputs:check -- --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11` -> `PARTIAL`
- Read-only Coolify API checks (`/api/v1/resources`, `/api/v1/deployments`, worker detail/log endpoint probes)

## Result Report
- Fresh authoritative inventory still reports `workers-market-stream`
  (`d2oo1wwy8i55q27e5mdky0i4`) as `exited:unhealthy` with `git_commit_sha=HEAD`
  and `health_check_enabled=false`.
- Per-resource Coolify API probes for deeper packet evidence are still blocked
  at API surface level (`/api/v1/resources/{uuid}` and
  `/api/v1/resources/{uuid}/logs` both return `404`).
- Production public expected-SHA smoke is healthy; temp-domain smoke remains
  unreachable.
- Issue remains `blocked` pending operator-side runtime log extraction from
  available Coolify paths and either worker recovery proof or accepted deeper
  blocker decision.

## Deploy Impact
- `none` (verification-only heartbeat).

## Final Disposition
`blocked`


## 2026-05-26 Resume Delta
- Added direct Coolify worker log-path evidence: `/api/v1/applications/d2oo1wwy8i55q27e5mdky0i4/logs` -> `400` `{"message":"Application is not running."}`.
- Follow-up normalization: disposition is fail-closed `blocked` until one unblock packet is attached by owner:
  - operator extracts authenticated worker runtime/container logs with timestamped root-cause statement and recovery proof, or
  - release controller accepts explicit deeper-blocker decision packet for this release cycle.


## 2026-05-26 Source-Scoped Recovery Reconciliation
- Wake `source_scoped_recovery_action` consumed from inline payload first (`fallbackFetchNeeded=false`).
- Pending comments remained `0/0`; no human unblock input arrived in this heartbeat.
- No new operator log packet, recovery/readiness proof, or accepted deeper-blocker decision was attached.
- Scope remained status-governance only; no deploy/restart/recovery mutation was performed.
- Disposition remains fail-closed `blocked` with unchanged unblock owner/action:
  - Owner: Coolify operator + release controller.
  - Action: attach one closure packet for this release cycle:
    1. authenticated worker logs + timestamped root-cause + recovery/readiness proof, or
    2. explicit accepted deeper-blocker decision replacing direct recovery.

## 2026-05-26 Reopen Delta - Board Decision Gate
- New board input acknowledged from comment `a3df1eb9-be8d-40a8-a84f-1f10a30ab6e1`.
- Operator gate is normalized and tracked through request-confirmation interaction:
  `59c011b0-cc92-47b4-ae72-2a039556dd93`.
- No production mutation was performed in this heartbeat.
- Decision path is now explicit and reviewer-bound:
  - `accept`: approve only narrow production lane for `workers-market-stream` recovery/readiness.
  - `reject`: keep production untouched and accept current runtime packet as deeper-blocker decision for this release cycle.
- Heartbeat disposition: `in_review` (pending `local-board` decision on interaction `59c011b0-cc92-47b4-ae72-2a039556dd93`).

## 2026-05-26 Source-Scoped Recovery Action Reconciliation (decision-gate pending)
- Wake `source_scoped_recovery_action` processed from inline payload (`fallbackFetchNeeded=false`).
- Performed concrete local recheck of canonical artifacts (`TASK_BOARD`, `PROJECT_STATE`, LUC-181 packet files).
- No new board decision artifact was found beyond interaction
  `59c011b0-cc92-47b4-ae72-2a039556dd93`.
- No new operator-side authenticated log packet or worker recovery/readiness proof was attached.
- No production mutation executed.

### Final Disposition
- `in_review` (pending `local-board` decision on interaction `59c011b0-cc92-47b4-ae72-2a039556dd93`).
