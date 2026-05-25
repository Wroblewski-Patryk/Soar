# V1 Production Activation And Evidence Plan (2026-05-24)

## Context

- V1 remains production-only.
- Current production candidate:
  `380308d10cf0fabb2ea629eb55e6f0ba7d980ed1`.
- Public build-info and public no-worker smoke pass for the candidate.
- Protected proof inputs are not available in the current local environment.
- No production LIVE order, position, exchange mutation, bot activation change,
  or credential-bearing probe may be run without separate explicit operator
  approval and approved context.

## Goal

Keep production activation planning truthful for the 2026-05-24 candidate by
recording what is already proven, what remains blocked, and which evidence must
be refreshed before the release gate can become ready.

## Scope

- Current production build-info and public smoke.
- Release/preflight tooling safety checks.
- Required protected production proof families:
  - authenticated production UI clickthrough
  - `LIVEIMPORT-03` runtime readback
  - rollback proof
  - production DB restore drill
  - RC status, sign-off, and checklist refresh

## Implementation Plan

1. Preserve the current public production proof for candidate `380308d1`.
2. Acquire approved production app auth/context for non-destructive UI and
   runtime readbacks.
3. Run `LIVEIMPORT-03` read-only production runtime readback on the current
   candidate.
4. Run authenticated production UI dashboard/admin clickthrough on the current
   candidate.
5. Run rollback guard proof and production DB restore drill with approved
   protected context.
6. Refresh RC external gates, sign-off, and checklist only after the protected
   proof set passes.
7. Rerun final preflight and release gate; mark this plan `READY` only if the
   gate reports ready.

## Acceptance Criteria

- Public build-info matches `380308d1`.
- Public production smoke passes.
- `LIVEIMPORT-03` produces a current `PASS` artifact with runtime readback and
  no captured token values.
- Production UI clickthrough produces a current `PASS` artifact for dashboard
  and admin routes.
- Backup/restore and rollback proof artifacts are current and `PASS`.
- RC current docs are current and approved for the candidate.
- Final preflight and release gate have no blockers.

## Definition Of Done

- `corepack pnpm run ops:release:v1:preflight -- --web-base-url https://soar.luckysparrow.ch --api-base-url https://api.soar.luckysparrow.ch --expected-sha 380308d10cf0fabb2ea629eb55e6f0ba7d980ed1` returns no blockers.
- `corepack pnpm run ops:release:v1:gate -- --environment prod --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 380308d10cf0fabb2ea629eb55e6f0ba7d980ed1` returns ready.
- `corepack pnpm run quality:guardrails` passes after evidence and state
  updates.

## Current Status

- Status: **BLOCKED**
- Satisfied for 2026-05-24:
  - public production build-info readback
  - public production no-worker smoke
  - release/preflight tooling safety checks
- Remaining blockers:
  - protected app/runtime/rollback/DB context is not available in this local
    environment
  - current protected evidence families are missing or stale for 2026-05-24

## Result Report

- This plan records the truthful activation state for deployed candidate
  `380308d10cf0fabb2ea629eb55e6f0ba7d980ed1`.
- The candidate is not activation-ready yet.
