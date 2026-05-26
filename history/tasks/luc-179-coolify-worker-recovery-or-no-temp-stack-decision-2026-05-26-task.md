# Task

## Header
- ID: LUC-179
- Title: [Soar][Ops Lane] Execute Coolify worker recovery evidence or no-temp-stack decision packet for LUC-178
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Ops/Release
- Depends on: LUC-178, LUC-47
- Priority: P0

## Context
Issue-scoped assigned heartbeat required a concrete closure move for the
worker/temp-stack blocker family: either attach worker recovery evidence or
publish an explicit no-temp-stack decision packet for `LUC-178`.

## Goal
Leave durable, fresh evidence and a clear disposition in this heartbeat.

## Constraints
- No production mutation without full release-mutation permit fields.
- No secret value disclosure.
- Smallest coherent verification only.

## Definition of Done
- [x] Fresh production expected-SHA smoke rechecked.
- [x] Fresh temp-domain smoke rechecked.
- [x] Coolify read-only inventory snapshot captured.
- [x] Explicit `LUC-178` no-temp-stack decision packet written.
- [x] Final disposition recorded with unblock owner/action.

## Validation Evidence
- `corepack pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11 --skip-workers`
- `corepack pnpm run ops:deploy:smoke -- --base-url https://soar-temp.luckysparrow.ch --api-url https://api.soar-temp.luckysparrow.ch --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11 --skip-workers`
- `corepack pnpm run ops:protected-inputs:check -- --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11`
- read-only Coolify API checks: `/api/v1/resources`, `/api/v1/applications`,
  `/api/v1/deployments`

## Result Report
- Worker recovery evidence could not be attached in this runtime because current
  Coolify readback has no temp-stack match and no direct `workers-market-stream`
  app match.
- `LUC-178` decision packet was published as `NO_TEMP_STACK` with fresh proof:
  `history/evidence/luc-178-no-temp-stack-decision-packet-2026-05-26.md`.
- Lane remains `blocked` pending release-controller decision on accepting this
  packet versus requiring restored temp-stack acceptance evidence.

## Deploy Impact
- `none` (verification-only + decision packet documentation).

## Final Disposition
`blocked`

## 2026-05-26 Finish-Handoff Delta
- Continuation wake (`finish_successful_run_handoff`) processed with no pending
  human unblock input (`0/0`).
- Fresh recheck in this heartbeat:
  - production expected-SHA smoke (`3fedb7a9...`) -> `PASS`
  - temp-domain smoke (`soar-temp`) -> `FAIL` (`fetch failed`)
  - `ops:operator-unblock:check` for
    `history/artifacts/v1-operator-unblock-packet-3fedb7a9-2026-05-26.json` -> `PASS`
- No production mutation was executed.
- Disposition remains `blocked`.
- Unblock owner/action unchanged: Coolify operator + release controller must
  either accept the `NO_TEMP_STACK` packet for closure routing or restore
  temp-stack evidence path and attach full acceptance packet.
