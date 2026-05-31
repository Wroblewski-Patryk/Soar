# Task

## Header
- ID: LUC-1145
- Title: [Soar][LUC-241][Security] Read-only permission decision packet for /workers/ready smoke
- Task Type: security
- Current Stage: verification
- Status: DONE
- Owner: Security Review Lead
- Priority: high

## Context
Wake payload assigned `LUC-1145` to produce the security decision packet for protected read-only smoke permissions on `GET /workers/ready` in the active `LUC-241` continuity chain.

## Goal
Publish a redaction-safe security decision packet that explicitly states the approved permission class, rejection criteria, and unblock contract for one protected read-only smoke recheck.

## Constraints
- Read-only lane.
- No production mutation.
- No secret/token/session values in artifacts.

## Deliverable Produced
- `history/releases/luc-1145-workers-ready-read-only-permission-decision-packet-2026-05-31.md`

## Evidence Basis
- `history/tasks/luc-241-unblock-workers-ready-smoke-principal-permissions-2026-05-27-task.md`
- `history/tasks/luc-1080-infra-gate-diagnose-production-dns-network-failure-for-luc-241-2026-05-31-task.md`
- `history/releases/luc-657-arb-006-security-approval-read-only-principal-session-2026-05-29.md`

## Local Proof
- Timestamp: `2026-05-31T22:11:27.2443449+02:00`
- Command:
  - `rg -n "requireOpsAccess|workers/ready|requireRole\('ADMIN'\)|requireOpsNetwork" apps/api/src/router/index.ts apps/api/src/router/workers-health-readiness.test.ts -S`
- Result:
  - `apps/api/src/router/index.ts:53` confirms `requireAuth + requireRole('ADMIN') + requireOpsNetwork` chain.
  - `apps/api/src/router/index.ts:128` confirms `/workers/ready` is guarded by `...requireOpsAccess`.
  - `apps/api/src/router/workers-health-readiness.test.ts` confirms admin `/workers/ready` coverage.

## Result Report
- Final disposition for this heartbeat: `done`.
- Handoff owner path: Ops Release Lead + API auth credential owner + Security/Test permission owner apply this packet during the next approved post-recovery one-shot smoke recheck in `LUC-241`.
- Residual risk: canonical runtime is currently `503`, so permission proof execution remains blocked until availability recovers.
