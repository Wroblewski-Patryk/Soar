# V1 Production Activation And Evidence Plan (2026-05-08)

## Context
- V1 remains production-only; no stage requirement is introduced by this plan.
- Public production API is healthy and ready.
- Public production web build-info exposes
  `da1e52cfec0b70e5a94e59d75fe702a55c348d74`, which includes the V1 backend
  PAPER/LIVE adapter-pure runtime fix.
- `LIVEIMPORT-03` still lacks authenticated read-only production runtime
  evidence for the reported ETH/DOGE import/readback path.
- The latest V1 release-gate dry-run reports `readiness=not_ready`:
  `history/releases/v1-release-gate-prod-2026-05-08T05-27-38-139Z.md`.

## Goal
Refresh the production activation plan truth for the current V1 blocker state
without claiming final release approval or replacing protected production
evidence with public/dry-run checks.

## Scope
- Production activation evidence planning for 2026-05-08.
- Current production build-info, health, and readiness status as public
  preconditions.
- Required follow-up evidence families:
  - authenticated `LIVEIMPORT-03` runtime readback
  - RC external gates status
  - RC sign-off record
  - RC checklist verification block
  - production backup/restore drill
  - production rollback proof pack
  - non-dry-run production release gate

## Implementation Plan
1. Obtain read-only production auth for the application operator account or
   approved OPS access layer.
2. Run the canonical `LIVEIMPORT-03` collector against production:
   `pnpm run ops:liveimport:readback -- --expected-sha da1e52cfec0b70e5a94e59d75fe702a55c348d74 --output docs/operations/liveimport-03-prod-readback-2026-05-08.json`.
3. Refresh production backup/restore drill evidence and verify the artifact
   reports `PASS`.
4. Refresh production rollback proof and verify the artifact reports `PASS`.
5. Refresh RC external gates status, RC checklist, and RC sign-off after the
   protected runtime evidence and recovery evidence are current.
6. Run the production V1 release gate without `--dry-run` and without skipping
   required protected gates.
7. Record final `ready` or `not_ready` status in source-of-truth state.

## Acceptance Criteria
- `LIVEIMPORT-03` evidence is captured from protected production runtime
  positions readback and redacted.
- Required production evidence artifacts are fresh for 2026-05-08.
- Production release gate is executed without `--dry-run`.
- No secrets, tokens, passwords, or raw protected payloads are committed.
- V1 is not marked ready unless the release gate reports `ready`.

## Definition Of Done
- `pnpm run ops:release:v1:gate -- --environment prod --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --skip-local-quality` returns `ready`.
- `pnpm run quality:guardrails` passes after evidence and state updates.
- The final release report links all fresh required evidence artifacts.

## Current Status
- Status: **NO-GO**
- Reason:
  - authenticated `LIVEIMPORT-03` production runtime readback is missing
  - RC sign-off record is blocked until real approver identities are provided
  - backup/restore drill evidence is stale or failed for 2026-05-08
  - rollback proof pack is stale or failed for 2026-05-08
  - runtime freshness and rollback guard are protected and fail closed with
    HTTP `401` without auth
  - the latest release-gate run is dry-run only and reports `not_ready`

## Result Report
- This plan intentionally updates activation planning truth only.
- It does not approve V1.
- Next executable step remains authenticated read-only production readback for
  `LIVEIMPORT-03`, followed by fresh production recovery/rollback/sign-off
  evidence and a non-dry-run release gate.
