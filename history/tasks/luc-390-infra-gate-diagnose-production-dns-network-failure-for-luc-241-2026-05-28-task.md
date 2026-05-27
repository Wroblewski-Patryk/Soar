# Task

## Header
- ID: LUC-390
- Title: [Soar][Infra Gate] Diagnose production DNS/network failure for LUC-241
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Priority: critical
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: IN_PROGRESS_PROD_STACK_DEPLOY

## Context
Wake payload assigned `LUC-390` as a critical infra-gate diagnostic for the active `LUC-241` protected workers readiness path, with the latest failure signal reported as DNS/network regression.

## Goal
Determine whether the current failure is a real production network outage or a domain/target mismatch in the verification lane.

## Constraints
- Read-only diagnostics only.
- No deploy/restart/rollback/runtime mutation.
- No secret value output.

## Definition of Done
- [x] Run DNS resolution checks for current and legacy Soar hostnames.
- [x] Run TCP reachability checks to production IP/hosts.
- [x] Run public HTTP probes for API/Web/VPS endpoints.
- [x] Re-run canonical deploy smoke against production domains.
- [x] Publish root-cause classification and exact unblock path.

## Forbidden
- No production mutation.
- No credential/secret printing.
- No blocker downgrade without evidence.

## Validation Evidence
- Commands:
  - PowerShell diagnostic sweep (DNS/TCP/HTTP) written to:
    `history/artifacts/luc-390-dns-network-diagnostic-2026-05-28.json`
  - `corepack pnpm run -s ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 71b8d503fd6fdfd7378dc67b2fa678799e2430f8`
- Key results:
  - `soar-api.luckysparrow.ch` and `soar-web.luckysparrow.ch` do not resolve (DNS NXDOMAIN).
  - Canonical production hosts resolve and are reachable:
    - `api.soar.luckysparrow.ch -> 141.227.149.67`
    - `soar.luckysparrow.ch -> 141.227.149.67`
    - `vps.luckysparrow.ch -> 141.227.149.67`
  - Canonical public endpoints return healthy responses (`200` for API/Web probes; VPS `302`).
  - Canonical deploy smoke passes public checks and fails only on protected `API /workers/ready -> 401`.

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Rollback note: not applicable (read-only)
- Observability or alerting impact: none

## Result Report
- Final disposition for this issue heartbeat: `done` (diagnosis complete).
- Root-cause classification:
  - This was not a production-wide DNS/network outage.
  - The failing lane used non-canonical hostnames (`soar-api` / `soar-web`) that currently have no DNS records.
- Effect on `LUC-241`:
  - Network blocker is removed when canonical targets are used.
  - Remaining first-class blocker is auth/permission for protected `/workers/ready` (`401`).
- Required follow-up owner/action:
  1. Ops lane uses canonical Soar domains for future smoke/probe runs.
  2. Auth credential owner + Security/Test owner provide valid approved read-only principal/session for protected worker readiness proof.

## Continuation Checkpoint (finish_successful_run_handoff, 2026-05-28)
- Wake consumed from inline payload (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
- No new comment or evidence delta arrived; no additional probe/rerun was required for this issue scope.
- Status integrity action: preserved `LUC-390` as `done` because objective (infra-gate diagnosis) was already completed with durable evidence.
- Cross-issue handoff remains:
  - `LUC-241` continues on canonical hostnames with remaining protected auth/permission blocker (`/workers/ready -> 401`).
