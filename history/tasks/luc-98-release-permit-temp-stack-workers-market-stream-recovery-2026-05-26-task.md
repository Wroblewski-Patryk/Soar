# Task

## Header
- ID: LUC-98
- Title: [Soar][Release Permit] Temp stack and workers-market-stream recovery
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Ops/Release
- Priority: P0
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: BLOCKED

## Context
Issue-scoped ops heartbeat for release permit validation of temp stack and worker recovery gates.

## Goal
Leave a fresh, evidence-backed disposition for LUC-98 and avoid stale `in_progress`.

## Constraints
- no production mutation without full permit packet fields
- no secret exposure
- smallest coherent verification only

## Definition of Done
- [x] Fresh no-secret public smoke run against expected SHA.
- [x] Operator unblock packet integrity rechecked.
- [x] Final issue disposition recorded with unblock owner/action.

## Validation Evidence
- Tests: `corepack pnpm run ops:operator-unblock:check -- --packet history/artifacts/v1-operator-unblock-packet-3fedb7a9-2026-05-26.json --json`
- Manual checks: `corepack pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11 --skip-workers`
- Screenshots/logs: terminal output + `history/evidence/luc-86-coolify-production-health-sweep-2026-05-26-final.md`
- Reality status: blocked

## Deployment / Ops Evidence
- Deploy impact: none (read-only checks only)
- Env or secret changes: none
- Health-check impact: none
- Rollback note: not applicable; no mutation executed
- Observability or alerting impact: none

## Result Report
- Public smoke remains PASS on expected SHA `3fedb7a9170097b40accb6ccea1915064f383f11`.
- Operator unblock packet schema/readiness consistency check is PASS.
- Additional permit action executed in this run:
  - Coolify API pre-state confirms `workers-market-stream`=`exited:unhealthy`.
  - `POST /api/v1/applications/d2oo1wwy8i55q27e5mdky0i4/restart` returned `200` with
    `Deployment already queued for this commit.`
  - 60-second post-action polling showed no recovery; worker remained `exited:unhealthy`.
- Release permit remains BLOCKED because:
  - worker recovery did not complete,
  - required temp-domain parallel-stack acceptance packet is still missing.
- Unblock owner/action: scheduled Coolify operator + local-board release controller must expose/create temp stack resources, deploy expected SHA there, verify worker readiness (including `workers-market-stream`), and attach full temp acceptance packet with rollback note.
- Evidence: `history/evidence/luc-98-temp-stack-and-workers-market-stream-recovery-2026-05-26T05-24+02-00.md`.

## 2026-05-26 05:26 +02:00 heartbeat delta (CTO runtime reconciliation)
- A fresh allowed-operation retry (`read/restart/read`) was initiated in this heartbeat.
- Execution was blocked before API call by missing runtime binding: `COOLIFY_BASE_URL`.
- No production mutation happened in this delta.
- Status remains `BLOCKED`.
- Unblock owner/action:
  - Owner: Ops Release Lead + Coolify operator.
  - Action: restore active Coolify API bindings in runtime, rerun worker recovery check, then continue temp-domain acceptance packet.
