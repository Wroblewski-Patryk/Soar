# LUC-119 - LUC-98 release permit evidence closure (2026-05-26)

## Context
- Issue: `LUC-119`
- Title: `[Soar][LUC-103-P5G] LUC-98 release permit evidence closure`
- Lane owner: Ops Release Lead
- Stage: `verification`

## Goal
Refresh `LUC-98` permit evidence with a concrete allowed-operation heartbeat and avoid stale `in_progress`.

## Constraints
- No secret value exposure.
- No deploy mutation.
- Only allowed recovery operation for named worker resource.

## Definition of Done
- [x] Fresh operator packet integrity check result captured.
- [x] `workers-market-stream` read/restart/read evidence captured.
- [x] Final disposition recorded with explicit unblock owner/action.

## Implementation Plan
1. Verify operator unblock packet consistency for current SHA packet.
2. Execute Coolify read/restart/read sequence for `workers-market-stream`.
3. Record evidence and finalize heartbeat disposition.

## Validation Evidence
- `corepack pnpm run ops:operator-unblock:check -- --packet history/artifacts/v1-operator-unblock-packet-3fedb7a9-2026-05-26.json --json` -> `PASS`
- Coolify API:
  - `GET /api/v1/applications` pre-state (`workers-market-stream=exited:unhealthy`)
  - `POST /api/v1/applications/d2oo1wwy8i55q27e5mdky0i4/restart` -> `Deployment already queued for this commit.`
  - `GET /api/v1/applications` x6 (60s) -> unchanged `exited:unhealthy`

## Result Report
- `workers-market-stream` remains `exited:unhealthy` after permitted restart attempt.
- Operator packet check remains `PASS`.
- Issue scope disposition: `blocked`.
- Unblock owner/action:
  - Owner: Ops Release Lead + Coolify operator + local-board release controller.
  - Action: clear queue/crash-loop cause, recover worker to healthy with proof, attach temp-domain expected-SHA acceptance packet and rollback note.
- Evidence:
  - `history/evidence/luc-119-luc-98-release-permit-evidence-closure-2026-05-26.md`
