# V1 Production Activation And Evidence Plan (2026-05-13)

## Context
- V1 remains production-only; this plan does not introduce a stage requirement.
- Public production build-info exposes
  `00169d7fdc3aff8317759137b05594b20e773c8e`.
- Current final preflight for 2026-05-13 has build-info and public smoke
  `PASS`, but final status is `blocked`.
- Current protected input readiness reports no matching protected input names
  in the Codex shell.
- Current production UI audit is fresh `BLOCKED_AUTH`; public routes pass and
  protected dashboard/admin/legacy routes fail closed to `/auth/login`.
- `LIVEIMPORT-03` still lacks authenticated read-only production runtime
  evidence.
- Production DB restore, rollback, RC status, RC sign-off, and RC checklist
  artifacts are stale for 2026-05-13.

## Goal
Keep production activation planning truth current for the 2026-05-13 V1 blocker
state without claiming final release approval or replacing protected production
evidence with public checks.

## Scope
- Production activation evidence planning for 2026-05-13.
- Current production build-info, public smoke, protected-input readiness, and
  production UI fail-closed evidence as no-secret readiness signals.
- Required follow-up evidence families:
  - authenticated/protected worker and runtime checks
  - authenticated `LIVEIMPORT-03` runtime readback
  - production DB restore drill
  - production rollback proof pack
  - authenticated production UI clickthrough PASS
  - RC external gates status
  - RC sign-off record
  - RC checklist verification block
  - non-dry-run production release gate

## Implementation Plan
1. Obtain approved production application/operator auth for protected ops
   endpoints.
2. Obtain approved production dashboard and admin auth for non-destructive UI
   clickthrough.
3. Obtain approved production DB restore context.
4. Run protected worker smoke and runtime freshness through the production
   release gate without bypassing auth.
5. Run canonical `LIVEIMPORT-03` collector against production after confirming
   build-info for the target SHA:
   `pnpm run ops:liveimport:readback -- --expected-sha 00169d7fdc3aff8317759137b05594b20e773c8e --output history/artifacts/liveimport-03-prod-readback-00169d7f-2026-05-13.json`.
6. Refresh production DB restore drill and verify cleanup.
7. Refresh production rollback proof and verify the artifact reports `PASS`.
8. Run production UI clickthrough to `PASS`.
9. Refresh RC external gates status, RC checklist, and RC sign-off after the
   protected runtime and recovery evidence are current.
10. Run the production V1 release gate without `--dry-run` and without skipping
    required protected gates.
11. Record final `ready` or `not_ready` status in source-of-truth state.

## Acceptance Criteria
- `LIVEIMPORT-03` evidence is captured from protected production runtime
  positions readback and redacted.
- Required production evidence artifacts are fresh for 2026-05-13.
- Production UI clickthrough is authenticated and `PASS`.
- Production release gate is executed without `--dry-run`.
- No secrets, tokens, passwords, cookies, private headers, or raw protected
  payloads are committed.
- V1 is not marked ready unless the release gate reports `ready`.

## Definition Of Done
- `pnpm run ops:release:v1:gate -- --environment prod --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 00169d7fdc3aff8317759137b05594b20e773c8e` returns `ready`.
- `node scripts/repoGuardrails.mjs` passes after evidence and state updates.
- The final release report links all fresh required evidence artifacts.

## Current Status
- Status: **NO-GO**
- Satisfied for 2026-05-13:
  - production public build-info readback
  - production public smoke in final preflight
  - no-secret protected input readiness sweep
  - production UI fail-closed audit for unauthenticated protected routes
- Remaining blockers:
  - approved production app/operator auth is missing for protected ops checks
  - approved production dashboard/admin auth is missing for UI clickthrough
  - approved production DB restore context is missing
  - authenticated `LIVEIMPORT-03` production runtime readback is missing
  - production DB restore evidence is stale for 2026-05-13
  - rollback proof pack is stale for 2026-05-13
  - RC Gate 4/sign-off is not approved
  - RC checklist/status artifacts are stale for 2026-05-13
  - production release gate has not run to `ready` without skipped protected gates

## Result Report
- This plan intentionally updates activation planning truth only.
- It does not approve V1.
- Next executable protected step remains approved production app/operator auth,
  approved dashboard/admin auth, approved DB restore context, rollback proof,
  `LIVEIMPORT-03`, RC Gate 4/sign-off, and the non-dry-run production release
  gate.
