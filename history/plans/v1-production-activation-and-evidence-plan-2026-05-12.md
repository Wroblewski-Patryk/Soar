# V1 Production Activation And Evidence Plan (2026-05-12)

## Context
- V1 remains production-only; this plan does not introduce a stage requirement.
- Public production API is healthy and ready.
- Public production Web build-info exposes
  `00169d7fdc3aff8317759137b05594b20e773c8e`.
- Production VPS Docker inventory shows API, Web, workers, Redis, and Postgres
  running.
- Stage public smoke currently returns `503` for API and Web.
- Production backup/restore drill evidence is fresh and PASS:
  `history/evidence/v1-restore-drill-prod-2026-05-12T15-21-38Z.md`.
- `LIVEIMPORT-03` still lacks authenticated read-only production runtime
  evidence.
- Production rollback proof is still stale for 2026-05-12.

## Goal
Keep production activation planning truth current for the 2026-05-12 V1 blocker
state without claiming final release approval or replacing protected production
evidence with public checks.

## Scope
- Production activation evidence planning for 2026-05-12.
- Current production build-info, health, readiness, container topology, and
  backup/restore proof as public/ops preconditions.
- Required follow-up evidence families:
  - authenticated/protected worker and runtime checks
  - authenticated `LIVEIMPORT-03` runtime readback
  - production rollback proof pack
  - RC external gates status
  - RC sign-off record
  - RC checklist verification block
  - non-dry-run production release gate

## Implementation Plan
1. Obtain approved production application/operator auth for protected ops
   endpoints.
2. Run protected worker smoke and runtime freshness through the production
   release gate without bypassing auth.
3. Run canonical `LIVEIMPORT-03` collector against production after confirming
   build-info for the target SHA:
   `pnpm run ops:liveimport:readback -- --expected-sha 00169d7fdc3aff8317759137b05594b20e773c8e --output docs/operations/liveimport-03-prod-readback-2026-05-12.json`.
4. Refresh production rollback proof and verify the artifact reports `PASS`.
5. Refresh RC external gates status, RC checklist, and RC sign-off after the
   protected runtime and recovery evidence are current.
6. Run the production V1 release gate without `--dry-run` and without skipping
   required protected gates.
7. Record final `ready` or `not_ready` status in source-of-truth state.

## Acceptance Criteria
- `LIVEIMPORT-03` evidence is captured from protected production runtime
  positions readback and redacted.
- Required production evidence artifacts are fresh for 2026-05-12.
- Production release gate is executed without `--dry-run`.
- No secrets, tokens, passwords, or raw protected payloads are committed.
- V1 is not marked ready unless the release gate reports `ready`.

## Definition Of Done
- `pnpm run ops:release:v1:gate -- --environment prod --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 00169d7fdc3aff8317759137b05594b20e773c8e --skip-local-quality` returns `ready`.
- `node scripts/repoGuardrails.mjs` passes after evidence and state updates.
- The final release report links all fresh required evidence artifacts.

## Current Status
- Status: **NO-GO**
- Satisfied for 2026-05-12:
  - production public health/readiness
  - production build-info readback
  - production VPS container inventory
  - production backup/restore drill PASS
- Remaining blockers:
  - approved production app/operator auth is missing for protected ops checks
  - authenticated `LIVEIMPORT-03` production runtime readback is missing
  - rollback proof pack is stale for 2026-05-12
  - RC Gate 4/sign-off is not approved
  - RC checklist is fresh but not all gates pass
  - production release gate has not run to `ready` without skipped protected gates

## Result Report
- This plan intentionally updates activation planning truth only.
- It does not approve V1.
- Next executable protected step remains approved production app/operator auth,
  followed by rollback proof, `LIVEIMPORT-03`, RC Gate 4/sign-off, and the
  non-dry-run production release gate.
