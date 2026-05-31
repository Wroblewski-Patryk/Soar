# Task

## Header
- ID: LUC-1080
- Title: [Soar][Infra Gate] Diagnose production DNS/network failure for LUC-241
- Task Type: verification
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Priority: critical

## Context
Wake payload assigned `LUC-1080` as a critical infra diagnostic for the active `LUC-241` blocker. The lane required a concrete DNS/network classification for current production failures.

## Goal
Determine whether the current production failure path is DNS/network breakage or upstream application/runtime unavailability.

## Constraints
- Read-only diagnostics only.
- No deploy/restart/rollback/mutation.
- No secret output.

## Definition of Done
- [x] Capture DNS resolution state for legacy and canonical Soar hostnames.
- [x] Capture HTTP probe status for canonical API/Web/VPS endpoints.
- [x] Publish root-cause classification and unblock owner/action.

## Forbidden
- No production mutation.
- No credential or token exposure.

## Validation Evidence
- Artifact: `history/artifacts/luc-1080-dns-network-diagnostic-2026-05-31.json`
- Timestamp: `2026-05-31T14:29:56.8731549+02:00`
- Key findings:
  - Legacy hosts remain unresolved:
    - `soar-api.luckysparrow.ch -> NXDOMAIN`
    - `soar-web.luckysparrow.ch -> NXDOMAIN`
  - Canonical DNS resolves:
    - `api.soar.luckysparrow.ch -> 141.227.149.67`
    - `soar.luckysparrow.ch -> 141.227.149.67`
    - `vps.luckysparrow.ch -> 141.227.149.67`
  - Canonical public HTTP probes fail with `503`:
    - `https://api.soar.luckysparrow.ch/health -> 503`
    - `https://api.soar.luckysparrow.ch/ready -> 503`
    - `https://soar.luckysparrow.ch/ -> 503`
    - `https://soar.luckysparrow.ch/api/build-info -> 503`

## Result Report
- Final disposition: `done`.
- Classification:
  - The current blocker is **not** a DNS-resolution failure on canonical production hostnames.
  - The active canonical path is reachable enough to return HTTP responses, but service availability is degraded at runtime level (`503`).
  - Legacy hostnames are still invalid and must not be used for smoke/ops probes.
- Effect on `LUC-241`:
  - Infra DNS/network gate is cleared for canonical domains.
  - Remaining blocker is runtime/platform recovery (restore canonical API/Web availability from `503`), then one approved protected readiness recheck.
- First-class unblock owner/action:
  1. Ops Release Lead + platform/Coolify runtime owner: restore canonical production service health from `503` to healthy status.
  2. After recovery and gate approval: execute exactly one read-only protected `/workers/ready` recheck and publish redaction-safe evidence.

## Continuation Checkpoint (issue_continuation_needed, 2026-05-31)
- Wake consumed from inline payload (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
- Concrete action in this heartbeat:
  - executed one read-only HTTP recheck and wrote `history/artifacts/luc-1080-dns-network-diagnostic-2026-05-31-continuation.json`.
- Recheck outcome is unchanged:
  - legacy: `soar-api.*` and `soar-web.*` unresolved (NXDOMAIN).
  - canonical: `api.soar.luckysparrow.ch/health`, `api.soar.luckysparrow.ch/ready`, `soar.luckysparrow.ch/` return `503`.
- Status integrity action:
  - preserved `LUC-1080` as `done` because diagnostic objective is completed and stable.
  - runtime recovery remains outside this issue scope and belongs to the active `LUC-241` blocker lane.

## Continuation Checkpoint (source_scoped_recovery_action, 2026-05-31)
- Wake consumed from inline payload (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
- Concrete action in this heartbeat:
  - checked out [LUC-1080](/LUC/issues/LUC-1080) with run header.
  - executed one additional read-only DNS/HTTP recheck.
  - wrote `history/artifacts/luc-1080-dns-network-diagnostic-2026-05-31-heartbeat-recheck.json`.
- Recheck outcome is unchanged:
  - canonical DNS resolves for `api.soar.luckysparrow.ch`, `soar.luckysparrow.ch`, `vps.luckysparrow.ch`.
  - legacy DNS remains invalid (`soar-api.*`, `soar-web.*` -> `NXDOMAIN`).
  - canonical public HTTP probes still return `503` on `/health`, `/ready`, `/`, `/api/build-info`.
- Final disposition action:
  - issue updated via Paperclip API to `done` with heartbeat evidence comment.
  - residual blocker remains in [LUC-241](/LUC/issues/LUC-241): runtime/platform recovery and one approved protected `/workers/ready` recheck.
