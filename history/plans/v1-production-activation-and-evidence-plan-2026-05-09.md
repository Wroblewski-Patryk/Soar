# V1 Production Activation And Evidence Plan (2026-05-09)

## Context
- V1 remains production-only; no stage requirement is introduced by this plan.
- Public production API is healthy and ready.
- Public production Web build-info exposes
  `30b027b78544f76b5b638851e8e27c98f6d22ab5`, the current protected-backlog
  synchronization batch.
- Public/unauthenticated UI access evidence is historical and remains the
  latest no-auth clickthrough artifact:
  `history/plans/prod-ui-public-access-clickthrough-c50e1e7c-2026-05-09.md`.
- The no-secret V1 final preflight for 2026-05-09 reports public deploy health
  PASS and release readiness BLOCKED:
  `history/releases/v1-final-preflight-30b027b7-2026-05-09.md`.
- `LIVEIMPORT-03` still lacks authenticated read-only production runtime
  evidence.

## Goal
Refresh the production activation plan truth for the current V1 blocker state
without claiming final release approval or replacing protected production
evidence with public checks.

## Scope
- Production activation evidence planning for 2026-05-09.
- Current production build-info, health, readiness, and public access status as
  public preconditions.
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
2. Run the canonical `LIVEIMPORT-03` collector against production after
   build-info confirms the target SHA:
   `node scripts/waitForWebBuildInfo.mjs --web-base-url https://soar.luckysparrow.ch --expected-sha 30b027b78544f76b5b638851e8e27c98f6d22ab5 --timeout-seconds 900 --interval-seconds 30`
   then
   `pnpm run ops:liveimport:readback -- --expected-sha 30b027b78544f76b5b638851e8e27c98f6d22ab5 --output docs/operations/liveimport-03-prod-readback-2026-05-09.json`.
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
- Required production evidence artifacts are fresh for 2026-05-09.
- Production release gate is executed without `--dry-run`.
- No secrets, tokens, passwords, or raw protected payloads are committed.
- V1 is not marked ready unless the release gate reports `ready`.

## Definition Of Done
- `pnpm run ops:release:v1:gate -- --environment prod --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 30b027b78544f76b5b638851e8e27c98f6d22ab5 --skip-local-quality` returns `ready`.
- `node scripts/repoGuardrails.mjs` passes after evidence and state updates.
- The final release report links all fresh required evidence artifacts.

## Current Status
- Status: **NO-GO**
- Reason:
  - authenticated `LIVEIMPORT-03` production runtime readback is missing
  - production DB restore context is missing for a 2026-05-09 restore refresh
  - rollback guard auth is missing
  - RC sign-off record is blocked until real approver identities are provided
  - RC external gates status, sign-off, and checklist are fresh for 2026-05-09
    but failed/open
  - backup/restore drill evidence is stale for 2026-05-09
  - rollback proof pack is stale for 2026-05-09
  - the latest final preflight is status-only and reports `BLOCKED`

## Result Report
- This plan intentionally updates activation planning truth only.
- It does not approve V1.
- Next executable protected step remains authenticated read-only production
  readback for `LIVEIMPORT-03`, followed by fresh production
  recovery/rollback/sign-off evidence and a non-dry-run release gate.
